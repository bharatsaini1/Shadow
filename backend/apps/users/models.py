import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class User(AbstractUser):
    SUBSCRIPTION_CHOICES = [
        ("free", "Free"),
        ("pro", "Student Pro"),
        ("elite", "Student Elite"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    subscription_plan = models.CharField(
        max_length=20, default="free", choices=SUBSCRIPTION_CHOICES
    )
    xp_total = models.IntegerField(default=0)
    career_level = models.IntegerField(default=1)
    daily_streak = models.IntegerField(default=0)
    last_active_date = models.DateField(null=True, blank=True)
    avatar_url = models.URLField(max_length=500, blank=True, default="")

    username = None
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.email

    def update_career_level(self):
        new_level = 1
        xp = self.xp_total
        threshold = 100
        while xp >= threshold:
            new_level += 1
            xp -= threshold
            threshold = int(threshold * 1.5)
        if new_level != self.career_level:
            self.career_level = new_level
            self.save(update_fields=["career_level"])
        return new_level

    def update_daily_streak(self):
        today = timezone.now().date()
        if self.last_active_date == today:
            return self.daily_streak
        if self.last_active_date == today - timezone.timedelta(days=1):
            self.daily_streak += 1
        elif self.last_active_date != today:
            self.daily_streak = 1
        self.last_active_date = today
        self.save(update_fields=["daily_streak", "last_active_date"])
        return self.daily_streak
