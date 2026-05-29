from rest_framework import serializers
from .models import CareerTrack, SimulationSession, JobApplication, Certificate


class CareerTrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = CareerTrack
        fields = [
            "id", "name", "slug", "description", "difficulty_level",
            "company", "domain", "requirements", "salary_range", "is_active",
        ]


class SimulationSessionSerializer(serializers.ModelSerializer):
    career_track_name = serializers.CharField(
        source="career_track.name", read_only=True
    )
    user_name = serializers.CharField(source="user.name", read_only=True)

    class Meta:
        model = SimulationSession
        fields = [
            "id", "user", "user_name", "career_track", "career_track_name",
            "difficulty", "status", "current_day", "total_days", "xp_earned",
            "industry_readiness_score", "started_at", "completed_at",
        ]
        read_only_fields = ["id", "user", "started_at", "completed_at"]


class StartSimulationSerializer(serializers.Serializer):
    career_track_id = serializers.UUIDField()
    difficulty = serializers.ChoiceField(
        choices=["beginner", "intermediate", "advanced"], default="intermediate"
    )


class GenerateDayResponseSerializer(serializers.Serializer):
    task_id = serializers.CharField()
    status = serializers.CharField()


class JobApplicationSerializer(serializers.ModelSerializer):
    career_track_name = serializers.CharField(
        source="career_track.name", read_only=True
    )
    career_track_company = serializers.CharField(
        source="career_track.company", read_only=True
    )

    class Meta:
        model = JobApplication
        fields = [
            "id", "user", "career_track", "career_track_name",
            "career_track_company", "status", "cover_note", "applied_at",
        ]
        read_only_fields = ["id", "user", "applied_at"]


class ApplyJobSerializer(serializers.Serializer):
    career_track_id = serializers.UUIDField()
    cover_note = serializers.CharField(required=False, allow_blank=True)


class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = [
            "id", "user", "session", "certificate_type", "title",
            "score", "file_url", "created_at", "expires_at",
        ]
        read_only_fields = ["id", "user", "created_at", "expires_at"]
