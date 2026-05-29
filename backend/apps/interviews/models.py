import uuid
from django.db import models
from django.conf import settings


class InterviewSession(models.Model):
    TYPES = [
        ("technical", "Technical"),
        ("hr", "HR"),
        ("behavioral", "Behavioral"),
    ]
    STATUS = [
        ("active", "Active"),
        ("completed", "Completed"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="interviews",
    )
    simulation_session = models.ForeignKey(
        "simulations.SimulationSession",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    role = models.CharField(max_length=200, default="Software Engineer")
    interview_type = models.CharField(max_length=50, choices=TYPES)
    status = models.CharField(max_length=20, choices=STATUS, default="active")
    transcript = models.JSONField(default=list)
    technical_score = models.IntegerField(null=True, blank=True)
    communication_score = models.IntegerField(null=True, blank=True)
    confidence_score = models.IntegerField(null=True, blank=True)
    problem_solving_score = models.IntegerField(null=True, blank=True)
    cultural_fit_score = models.IntegerField(null=True, blank=True)
    overall_score = models.IntegerField(null=True, blank=True)
    feedback = models.TextField(blank=True)
    interview_summary = models.TextField(blank=True)
    strengths = models.JSONField(default=list, blank=True)
    areas_for_improvement = models.JSONField(default=list, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.email} - {self.interview_type} ({self.status})"
