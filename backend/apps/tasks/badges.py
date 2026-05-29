from django.db.models import Count
from .models import Badge, UserBadge, Task, Submission


BADGE_RULES = {
    "first-submission": {"name": "First Submission", "description": "Submitted your first task"},
    "bug-slayer": {"name": "Bug Slayer", "description": "Fixed a critical bug"},
    "interview-ace": {"name": "Interview Ace", "description": "Scored 80%+ in an interview"},
    "7-day-streak": {"name": "7-Day Streak", "description": "Active for 7 consecutive days"},
    "code-master": {"name": "Code Master", "description": "Completed 10 coding tasks"},
    "design-pro": {"name": "Design Pro", "description": "Completed 5 design tasks"},
}


def _get_or_create_badge(slug):
    if slug not in BADGE_RULES:
        return None
    badge, _ = Badge.objects.get_or_create(
        slug=slug,
        defaults=BADGE_RULES[slug],
    )
    return badge


def award_badge(user, slug):
    badge = _get_or_create_badge(slug)
    if not badge:
        return False
    _, created = UserBadge.objects.get_or_create(user=user, badge=badge)
    return created


def check_and_award_badges(user):
    awarded = []

    submission_count = Submission.objects.filter(user=user).count()
    if submission_count >= 1:
        if award_badge(user, "first-submission"):
            awarded.append("first-submission")

    coding_submissions = (
        Submission.objects.filter(user=user, task__task_type="coding")
        .values("task_id")
        .distinct()
        .count()
    )
    if coding_submissions >= 10:
        if award_badge(user, "code-master"):
            awarded.append("code-master")

    design_submissions = (
        Submission.objects.filter(user=user, task__task_type="design")
        .values("task_id")
        .distinct()
        .count()
    )
    if design_submissions >= 5:
        if award_badge(user, "design-pro"):
            awarded.append("design-pro")

    if user.daily_streak >= 7:
        if award_badge(user, "7-day-streak"):
            awarded.append("7-day-streak")

    return awarded
