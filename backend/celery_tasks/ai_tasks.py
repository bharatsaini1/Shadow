from celery import shared_task
from django.apps import apps
from django.utils import timezone
from django.db.models import Avg

from services.ai_client import generate_simulation_day, evaluate_submission


@shared_task(bind=True, max_retries=3, default_retry_delay=10)
def generate_day_task(self, session_id: str, user_id: str):
    SimulationSession = apps.get_model("simulations", "SimulationSession")
    CareerTrack = apps.get_model("simulations", "CareerTrack")
    Task = apps.get_model("tasks", "Task")

    try:
        session = SimulationSession.objects.select_related(
            "career_track", "user"
        ).get(id=session_id, user__id=user_id)
    except SimulationSession.DoesNotExist:
        return {"error": "Session not found"}

    previous_tasks = Task.objects.filter(session=session).order_by("created_at")
    previous_context_lines = [
        f"Task {i+1}: {t.title} ({t.status})"
        for i, t in enumerate(previous_tasks)
    ]
    previous_context = (
        "\n".join(previous_context_lines[-5:])
        if previous_context_lines
        else ""
    )

    result = generate_simulation_day(
        role=session.career_track.name,
        day=session.current_day,
        previous_context=previous_context,
        difficulty=session.career_track.difficulty_level,
    )

    if "error" in result:
        raise self.retry(exc=Exception(result["error"]))

    manager_message = result.get("manager_message", "")
    tasks_data = result.get("tasks", [])

    if not tasks_data:
        raise self.retry(exc=Exception("No tasks generated"))

    task_objects = []
    for t in tasks_data:
        task = Task.objects.create(
            session=session,
            title=t.get("title", "Untitled Task"),
            description=t.get("description", ""),
            task_type=t.get("task_type", "coding"),
            difficulty=t.get("difficulty", "medium"),
            deadline_hours=t.get("deadline_hours", 4),
            client_context=t.get("client_context", ""),
            expected_deliverable=t.get("expected_deliverable", ""),
            status="pending",
        )
        task_objects.append(str(task.id))

    session.current_day += 1
    if session.current_day > session.total_days:
        session.status = "completed"
        session.completed_at = timezone.now()
        Evaluation = apps.get_model("tasks", "Evaluation")
        avg_score = Evaluation.objects.filter(
            submission__task__session=session
        ).aggregate(avg=Avg("overall_score"))["avg"]
        session.industry_readiness_score = round(avg_score, 2) if avg_score else 0.0
    session.save(update_fields=["current_day", "status", "completed_at", "industry_readiness_score"])

    return {
        "session_id": session_id,
        "manager_message": manager_message,
        "tasks": task_objects,
        "next_day": session.current_day,
    }


@shared_task(bind=True, max_retries=3, default_retry_delay=10)
def evaluate_submission_task(self, task_id: str, submission_id: str):
    Task = apps.get_model("tasks", "Task")
    Submission = apps.get_model("tasks", "Submission")
    Evaluation = apps.get_model("tasks", "Evaluation")
    User = apps.get_model("users", "User")

    try:
        submission = Submission.objects.select_related("task", "user").get(
            id=submission_id, task__id=task_id
        )
    except Submission.DoesNotExist:
        return {"error": "Submission not found"}

    task = submission.task

    task_data = {
        "task_id": str(task.id),
        "title": task.title,
        "description": task.description,
        "task_type": task.task_type,
        "difficulty": task.difficulty,
        "deadline_hours": task.deadline_hours,
        "client_context": task.client_context or "",
        "expected_deliverable": task.expected_deliverable or "",
    }

    result = evaluate_submission(
        task=task_data,
        submission_content=submission.content or "",
        submitted_at=submission.submitted_at.isoformat(),
        task_created_at=task.created_at.isoformat(),
        deadline_hours=task.deadline_hours,
    )

    if "error" in result:
        raise self.retry(exc=Exception(result["error"]))

    scores = result.get("scores", {})
    evaluation = Evaluation.objects.create(
        submission=submission,
        overall_score=result.get("overall_score", 0),
        code_quality_score=scores.get("code_quality"),
        communication_score=scores.get("communication"),
        problem_solving_score=scores.get("problem_solving"),
        time_management_score=scores.get("time_management"),
        completeness_score=scores.get("completeness"),
        feedback=result.get("feedback", ""),
        strengths=result.get("strengths", []),
        improvement_suggestions=result.get("improvement_suggestions", []),
        what_a_senior_would_say=result.get("what_a_senior_would_say", ""),
        xp_awarded=result.get("xp_earned", 0),
    )

    task.status = "evaluated"
    task.save(update_fields=["status"])

    user = submission.user
    user.xp_total += evaluation.xp_awarded
    user.save(update_fields=["xp_total"])
    user.update_career_level()
    user.update_daily_streak()

    session = task.session
    session.xp_earned += evaluation.xp_awarded
    session.save(update_fields=["xp_earned"])

    from apps.tasks.badges import check_and_award_badges
    check_and_award_badges(user)

    return {
        "task_id": task_id,
        "submission_id": submission_id,
        "evaluation_id": str(evaluation.id),
        "overall_score": evaluation.overall_score,
        "xp_awarded": evaluation.xp_awarded,
    }


@shared_task
def cleanup_expired_certificates():
    Certificate = apps.get_model("simulations", "Certificate")
    now = timezone.now()
    expired = Certificate.objects.filter(expires_at__lte=now)
    count = expired.count()
    for cert in expired:
        if cert.file_url:
            from pathlib import Path
            from django.conf import settings
            file_path = cert.file_url
            if file_path.startswith("/media/"):
                file_path = file_path[7:]
            full_path = settings.MEDIA_ROOT / file_path
            if full_path.exists():
                full_path.unlink()
    expired.delete()
    return {"cleaned_up": count}
