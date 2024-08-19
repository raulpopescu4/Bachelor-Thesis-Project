from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from django.db import transaction
from django.forms.models import model_to_dict
from django.db.models import Count, F
from .models import UserProfile, Fight, Bookmark, LikeDislike
from .serializers import UserProfileSerializer, UserRegistrationSerializer, FightSerializer
from openai import OpenAI
import json
from FightFinder.settings import OPENAI_API_KEY

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def user_preferences(request):
    if request.method == 'POST':
        data = request.data
        if 'preferences' in data:
            data['preferences'] = json.dumps(data['preferences'])
        
        serializer = UserProfileSerializer(data=data, instance=request.user.userprofile)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    user_profile = request.user.userprofile
    if not user_profile.preferences:
        user_profile.preferences = json.dumps({})
        user_profile.save()

    try:
        preferences = json.loads(user_profile.preferences)
    except json.JSONDecodeError:
        preferences = {}
        
    return Response({'preferences': preferences})


@api_view(['POST'])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        try:
            with transaction.atomic():
                user = serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recommendations(request):
    user = request.user
    user_profile = user.userprofile
    preferences_summary = user_profile.preferences

    top_liked_fights = LikeDislike.objects.filter(user=user, value=LikeDislike.LIKE).values_list('fight__title', flat=True)[:3]
    top_bookmarks_global = Bookmark.objects.values('fight__title').annotate(total=Count('id')).order_by('-total')[:3]
    bookmarked_titles = Bookmark.objects.filter(user=request.user).values_list('fight__title', flat=True)
    exclusions = ', '.join(set(bookmarked_titles))

    fighter_counts = Bookmark.objects.filter(user=user).annotate(
        fighter=F('fight__fighter1')
    ).values('fighter').annotate(count=Count('fighter')).order_by('-count')
    top_fighters = [fighter['fighter'] for fighter in fighter_counts[:3]]

    prompt = (
        f"User preferences include: {preferences_summary}. "
        f"Top liked fights: {', '.join(top_liked_fights)}. "
        f"Popular globally bookmarked fights feature: {', '.join(f['fight__title'] for f in top_bookmarks_global)}. "
        f"Preferred fighters based on user activity: {', '.join(top_fighters)}. "
        f"Exclude these fights: {exclusions}. "
        "Based on these insights, provide UFC fight recommendations. "
        "Each recommendation should be a JSON object with the following fields: "
        "title, fighter1, fighter2, card, date, details. "
        "Return only the JSON objects, nothing else."
    )
    
    client = OpenAI(api_key=OPENAI_API_KEY)
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are an assistant that provides UFC fight recommendations. Always provide at least 5 recommendations."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=700
    )

    if completion.choices and completion.choices[0].message:
        recommendations_text = completion.choices[0].message.content.strip()
        try:
            fights_data = json.loads(recommendations_text)
            fights = [Fight(title=fight_data['title'],
                            fighter1=fight_data['fighter1'],
                            fighter2=fight_data['fighter2'],
                            card=fight_data['card'],
                            date=fight_data['date'],
                            details=fight_data['details'])
                      for fight_data in fights_data]
            fights_json = [model_to_dict(fight) for fight in fights]
            return Response({'fights': fights_json})
        except (json.JSONDecodeError, KeyError):
            return Response({'error': 'Failed to decode or missing fields in JSON response'}, status=500)
    
    return Response({'error': 'No recommendation found'}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def bookmark_fight(request):
    fight_data = request.data.get('fight')
    fight = Fight.objects.create(**fight_data)
    Bookmark.objects.create(user=request.user, fight=fight)
    return Response({'status': 'Fight bookmarked'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_bookmarked_fights(request):
    bookmarks = Bookmark.objects.filter(user=request.user).select_related('fight')
    results = []
    
    for bookmark in bookmarks:
        fight = bookmark.fight
        fight_data = FightSerializer(fight).data
        fight_data['bookmark_id'] = bookmark.id

        like_dislike = LikeDislike.objects.filter(user=request.user, fight=fight).first()
        fight_data['like_status'] = like_dislike.value if like_dislike else 0

        results.append(fight_data)
    
    return Response(results)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_bookmark(request, bookmark_id):
    bookmark = get_object_or_404(Bookmark, id=bookmark_id, user=request.user)
    bookmark.delete()
    return Response({'message': 'Bookmark deleted successfully'}, status=204)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_like_dislike(request, fight_id, action):
    fight = get_object_or_404(Fight, id=fight_id)
    user = request.user

    value = LikeDislike.LIKE if action == 'like' else LikeDislike.DISLIKE
    existing_record, created = LikeDislike.objects.get_or_create(user=user, fight=fight, defaults={'value': value})

    if created:
        message = 'Fight liked.' if value == LikeDislike.LIKE else 'Fight disliked.'
        return Response({'message': message}, status=status.HTTP_201_CREATED)

    if existing_record.value == value:
        existing_record.delete()
        message = 'Like removed.' if value == LikeDislike.LIKE else 'Dislike removed.'
        return Response({'message': message}, status=status.HTTP_204_NO_CONTENT)

    existing_record.value = value
    existing_record.save()
    message = 'Fight liked.' if value == LikeDislike.LIKE else 'Fight disliked.'
    return Response({'message': message}, status=status.HTTP_200_OK)


class AllFightsView(APIView):
    def get(self, request, format=None):
        fights = Fight.objects.all()
        serializer = FightSerializer(fights, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
