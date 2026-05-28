from rest_framework import serializers
from .models import User


class UserRegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    name = serializers.CharField()
    password = serializers.CharField(write_only=True, min_length=8)


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id", "email", "name", "subscription_plan",
            "xp_total", "career_level", "daily_streak", "avatar_url",
        ]


class DashboardSerializer(serializers.Serializer):
    xp_total = serializers.IntegerField()
    career_level = serializers.IntegerField()
    daily_streak = serializers.IntegerField()
    active_simulations = serializers.ListField(child=serializers.DictField())
    completed_simulations = serializers.ListField(child=serializers.DictField())
    badges = serializers.ListField(child=serializers.DictField())
    leaderboard = serializers.ListField(child=serializers.DictField())


class PassportSerializer(serializers.Serializer):
    user = UserSerializer()
    simulations = serializers.ListField(child=serializers.DictField())
    interview_scores = serializers.ListField(child=serializers.DictField())
    badges = serializers.ListField(child=serializers.DictField())
    total_xp = serializers.IntegerField()
    career_level = serializers.IntegerField()
    industry_readiness = serializers.FloatField()
