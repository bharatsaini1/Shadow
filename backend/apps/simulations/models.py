import uuid
from django.db import models
from django.conf import settings


class CareerTrack(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    difficulty_level = models.CharField(max_length=50, default="beginner")

    def __str__(self):
        return self.name


class SimulationSession(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("completed", "Completed"),
        ("abandoned", "Abandoned"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sessions",
    )
    career_track = models.ForeignKey(CareerTrack, on_delete=models.PROTECT)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    current_day = models.IntegerField(default=1)
    total_days = models.IntegerField(default=10)
    xp_earned = models.IntegerField(default=0)
    industry_readiness_score = models.FloatField(null=True, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.email} - {self.career_track.name} (Day {self.current_day})"
