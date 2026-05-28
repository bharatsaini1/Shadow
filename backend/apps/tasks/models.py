import uuid
from django.db import models
from django.conf import settings


class Task(models.Model):
    TASK_TYPES = [
        ("coding", "Coding"),
        ("design", "Design"),
        ("report", "Report"),
        ("meeting", "Meeting"),
        ("bug_fix", "Bug Fix"),
        ("code_review", "Code Review"),
        ("testing", "Testing"),
        ("devops", "DevOps"),
        ("documentation", "Documentation"),
    ]
    DIFFICULTY = [
        ("easy", "Easy"),
        ("medium", "Medium"),
        ("hard", "Hard"),
    ]
    STATUS = [
        ("pending", "Pending"),
        ("submitted", "Submitted"),
        ("evaluated", "Evaluated"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(
        "simulations.SimulationSession",
        on_delete=models.CASCADE,
        related_name="tasks",
    )
    title = models.CharField(max_length=500)
    description = models.TextField(blank=True)
    task_type = models.CharField(max_length=50, choices=TASK_TYPES)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY, default="medium")
    deadline_hours = models.IntegerField(default=4)
    status = models.CharField(max_length=20, choices=STATUS, default="pending")
    ai_generated_context = models.JSONField(null=True, blank=True)
    client_context = models.TextField(blank=True)
    expected_deliverable = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Submission(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    task = models.ForeignKey(
        Task, on_delete=models.CASCADE, related_name="submissions"
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField(blank=True)
    file_urls = models.JSONField(default=list, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Submission for {self.task.title} by {self.user.email}"


class Evaluation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    submission = models.OneToOneField(
        Submission, on_delete=models.CASCADE, related_name="evaluation"
    )
    overall_score = models.IntegerField(default=0)
    code_quality_score = models.IntegerField(null=True, blank=True)
    communication_score = models.IntegerField(null=True, blank=True)
    problem_solving_score = models.IntegerField(null=True, blank=True)
    time_management_score = models.IntegerField(null=True, blank=True)
    completeness_score = models.IntegerField(null=True, blank=True)
    feedback = models.TextField(blank=True)
    strengths = models.JSONField(default=list, blank=True)
    improvement_suggestions = models.JSONField(default=list, blank=True)
    what_a_senior_would_say = models.TextField(blank=True)
    xp_awarded = models.IntegerField(default=0)
    evaluated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Evaluation for {self.submission.task.title} ({self.overall_score}/100)"


class Badge(models.Model):
    slug = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    icon_url = models.URLField(max_length=500, blank=True)

    def __str__(self):
        return self.name


class UserBadge(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="badges",
    )
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    awarded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["user", "badge"]

    def __str__(self):
        return f"{self.user.email} - {self.badge.name}"
