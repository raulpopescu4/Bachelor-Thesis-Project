import json
from rest_framework import serializers
from .models import UserProfile
from django.contrib.auth.models import User

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['preferences']
        
    def to_representation(self, instance):
        
        rep = super().to_representation(instance)
        rep['preferences'] = json.loads(instance.preferences)
        return rep

    def to_internal_value(self, data):
       
        data['preferences'] = json.dumps(data['preferences'])
        return super().to_internal_value(data)

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password']
        )
        UserProfile.objects.create(user=user)
        return user