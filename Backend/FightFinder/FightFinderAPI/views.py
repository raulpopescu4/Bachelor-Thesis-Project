from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from FightFinder.settings import OPENAI_API_KEY
from .models import UserProfile, Recommendation
from .serializers import UserProfileSerializer
from .serializers import UserRegistrationSerializer
from openai import OpenAI
from django.db import transaction

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def user_preferences(request):
    if request.method == 'POST':
        serializer = UserProfileSerializer(data=request.data, instance=request.user.userprofile)
        if serializer.is_valid():
            serializer.save()
            print(UserProfile.objects.all())  
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    else:
        serializer = UserProfileSerializer(instance=request.user.userprofile)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_recommendations(request):
    
    user_profile = request.user.userprofile
    prompt = f"Provide fight recommendations based on the following preferences: {user_profile.preferences}"
    
    
    client = OpenAI(api_key=OPENAI_API_KEY)

   
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "Provide fight recommendations."},
            {"role": "user", "content": prompt}
        ]
    )

    if completion.choices and completion.choices[0].message:
        recommendations_text = completion.choices[0].message.content.strip()
        
        recommendation = Recommendation.objects.create(user=request.user, recommendation_text=recommendations_text)

        
        return Response({'recommendations': recommendations_text})
    else:
        return Response({'error': 'No recommendation found'}, status=404)


@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            try:
                with transaction.atomic():
                    user = serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
