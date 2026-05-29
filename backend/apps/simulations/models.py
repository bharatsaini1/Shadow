import uuid
from django.db import models
from django.conf import settings


class CareerTrack(models.Model):
    DOMAIN_CHOICES = [
        ("tech", "Technology"),
        ("design", "Design"),
        ("data", "Data"),
        ("hr", "HR & Operations"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    difficulty_level = models.CharField(
        max_length=50,
        choices=[("easy", "Easy"), ("intermediate", "Intermediate"), ("hard", "Hard")],
        default="easy",
    )
    company = models.CharField(max_length=200, default="TechSprint Solutions")
    domain = models.CharField(
        max_length=50, choices=DOMAIN_CHOICES, default="tech"
    )
    requirements = models.TextField(blank=True, default="")
    salary_range = models.CharField(max_length=100, blank=True, default="")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class SimulationSession(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("completed", "Completed"),
        ("abandoned", "Abandoned"),
    ]
    DIFFICULTY_CHOICES = [
        ("beginner", "Beginner"),
        ("intermediate", "Intermediate"),
        ("advanced", "Advanced"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sessions",
    )
    career_track = models.ForeignKey(CareerTrack, on_delete=models.PROTECT)
    difficulty = models.CharField(
        max_length=20, choices=DIFFICULTY_CHOICES, default="intermediate"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    current_day = models.IntegerField(default=1)
    total_days = models.IntegerField(default=10)
    xp_earned = models.IntegerField(default=0)
    industry_readiness_score = models.FloatField(null=True, blank=True)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.email} - {self.career_track.name} (Day {self.current_day})"


class JobApplication(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending Review"),
        ("shortlisted", "Shortlisted"),
        ("accepted", "Accepted"),
        ("rejected", "Rejected"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="job_applications",
    )
    career_track = models.ForeignKey(
        CareerTrack, on_delete=models.CASCADE, related_name="applications"
    )
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="pending"
    )
    cover_note = models.TextField(blank=True, default="")
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["user", "career_track"]

    def __str__(self):
        return f"{self.user.email} applied for {self.career_track.name}"


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ("task_assigned", "Task Assigned"),
        ("task_evaluated", "Task Evaluated"),
        ("revision_requested", "Revision Requested"),
        ("simulation_completed", "Simulation Completed"),
        ("interview_ready", "Interview Ready"),
        ("badge_earned", "Badge Earned"),
        ("deadline_reminder", "Deadline Reminder"),
        ("certificate_earned", "Certificate Earned"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPES)
    title = models.CharField(max_length=255)
    message = models.TextField(blank=True, default="")
    link = models.CharField(max_length=500, blank=True, default="")
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"[{self.notification_type}] {self.user.email} - {self.title}"


class Certificate(models.Model):
    CERTIFICATE_TYPES = [
        ("best_employee", "Best Employee of the Month"),
        ("high_performance", "High Performance Achievement"),
        ("project_excellence", "Project Excellence Award"),
        ("completion", "Simulation Completion"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="certificates",
    )
    session = models.ForeignKey(
        SimulationSession,
        on_delete=models.CASCADE,
        related_name="certificates",
    )
    certificate_type = models.CharField(
        max_length=50, choices=CERTIFICATE_TYPES, default="completion"
    )
    title = models.CharField(max_length=255, default="Certificate of Completion")
    score = models.IntegerField(default=0)
    file_url = models.CharField(max_length=500, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} - {self.title} ({self.score})"
