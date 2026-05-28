import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models


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
