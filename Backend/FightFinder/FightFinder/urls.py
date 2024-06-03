from django.contrib import admin
from django.urls import path
from FightFinderAPI.views import user_preferences, get_recommendations, register
from rest_framework_simplejwt.views import (TokenObtainPairView, TokenRefreshView,)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/preferences/', user_preferences, name='user_preferences'),
    path('api/recommendations/', get_recommendations, name='get_recommendations'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', register, name='register'),
]
