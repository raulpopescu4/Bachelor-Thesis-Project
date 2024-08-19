from django.contrib import admin
from django.urls import path
from FightFinderAPI.views import user_preferences, get_recommendations, register, view_bookmarked_fights, bookmark_fight, delete_bookmark, AllFightsView, toggle_like_dislike
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView,)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/user/preferences/', user_preferences, name='user_preferences'),
    path('api/register/', register, name='register'),
    path('fights/', AllFightsView.as_view(), name='all-fights'),
    path('api/recommendations/', get_recommendations, name='get_recommendations'),
    path('api/bookmarked-fights/', view_bookmarked_fights, name='view_bookmarked_fights'),
    path('api/bookmark-fight/', bookmark_fight, name='bookmark_fight'),
    path('api/delete-bookmark/<int:bookmark_id>/', delete_bookmark, name='delete_bookmark'),
    path('api/fight/<int:fight_id>/<str:action>/', toggle_like_dislike, name='toggle_like_dislike'),
]
