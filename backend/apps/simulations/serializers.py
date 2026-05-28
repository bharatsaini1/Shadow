from rest_framework import serializers
from .models import CareerTrack, SimulationSession


class CareerTrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerTrack
        fields = ["id", "name", "slug", "description", "difficulty_level"]


class SimulationSessionSerializer(serializers.ModelSerializer):
    career_track_name = serializers.CharField(
        source="career_track.name", read_only=True
    )
    user_name = serializers.CharField(source="user.name", read_only=True)

    class Meta:
        model = SimulationSession
        fields = [
            "id", "user", "user_name", "career_track", "career_track_name",
            "status", "current_day", "total_days", "xp_earned",
            "industry_readiness_score", "started_at", "completed_at",
        ]
        read_only_fields = ["id", "user", "started_at", "completed_at"]


class StartSimulationSerializer(serializers.Serializer):
    career_track_id = serializers.UUIDField()


class GenerateDayResponseSerializer(serializers.Serializer):
    task_id = serializers.CharField()
    status = serializers.CharField()
