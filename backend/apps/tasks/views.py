from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import Task, Submission, Evaluation
from .serializers import TaskSerializer, SubmitTaskSerializer, EvaluationSerializer
from .badges import check_and_award_badges
from services.ai_client import evaluate_submission as ai_evaluate_submission
from services.storage import upload_file
from apps.simulations.models import Notification


def create_notification(user, ntype, title, message="", link=""):
    Notification.objects.create(
        user=user,
        notification_type=ntype,
        title=title,
        message=message,
        link=link,
    )

MAX_UPLOAD_SIZE = 10 * 1024 * 1024


class GetTaskView(APIView):
    def get(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id, session__user=request.user)
        except Task.DoesNotExist:
            return Response(
                {"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND
            )

        data = TaskSerializer(task).data
        return Response(data, status=status.HTTP_200_OK)


class SubmitTaskView(APIView):
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id, session__user=request.user)
        except Task.DoesNotExist:
            return Response(
                {"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if task.status not in ("pending", "submitted"):
            return Response(
                {"error": "Task has already been evaluated"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        total_size = sum(f.size for f in request.FILES.getlist("files"))
        if total_size > MAX_UPLOAD_SIZE:
            return Response(
                {"error": "Total upload size exceeds 10MB limit"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = SubmitTaskSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        file_urls = list(serializer.validated_data.get("file_urls", []))
        uploaded_files = request.FILES.getlist("files")
        for f in uploaded_files:
            url = upload_file(f, content_type=f.content_type)
            file_urls.append(url)

        submission = Submission.objects.create(
            task=task,
            user=request.user,
            content=serializer.validated_data.get("content", ""),
            file_urls=file_urls,
        )

        task.status = "submitted"
        task.save(update_fields=["status"])

        request.user.update_daily_streak()

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

        result = ai_evaluate_submission(
            task=task_data,
            submission_content=submission.content or "",
            submitted_at=submission.submitted_at.isoformat(),
            task_created_at=task.created_at.isoformat(),
            deadline_hours=task.deadline_hours,
        )

        if result.get("error"):
            task.status = "pending"
            task.save(update_fields=["status"])
            return Response(
                {"error": result["error"]},
                status=status.HTTP_502_BAD_GATEWAY,
            )

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

        # Revision cycle: if score < 60 and under max revisions, send back
        MAX_REVISIONS = 2
        if (
            evaluation.overall_score < 60
            and task.revision_count < MAX_REVISIONS
        ):
            task.status = "pending"
            task.revision_requested = True
            task.revision_feedback = evaluation.feedback
            task.revision_count += 1
            task.save(
                update_fields=[
                    "status", "revision_requested",
                    "revision_feedback", "revision_count",
                ]
            )
            create_notification(
                user=request.user,
                ntype="revision_requested",
                title="Task Needs Revision",
                message=f"Score {evaluation.overall_score}/100 — {task.title}",
                link=f"/simulation?task_id={task.id}",
            )
        else:
            task.status = "evaluated"
            task.save(update_fields=["status"])
            create_notification(
                user=request.user,
                ntype="task_evaluated",
                title="Task Evaluated",
                message=f"{task.title}: {evaluation.overall_score}/100 (+{evaluation.xp_awarded} XP)",
                link=f"/simulation?task_id={task.id}",
            )

        user = request.user
        user.xp_total += evaluation.xp_awarded
        user.save(update_fields=["xp_total"])
        user.update_career_level()

        session = task.session
        session.xp_earned += evaluation.xp_awarded
        session.save(update_fields=["xp_earned"])

        check_and_award_badges(user)

        eval_data = EvaluationSerializer(evaluation).data
        eval_data["session_id"] = str(task.session.id)
        return Response(eval_data, status=status.HTTP_200_OK)


class GetEvaluationView(APIView):
    def get(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id, session__user=request.user)
        except Task.DoesNotExist:
            return Response(
                {"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND
            )

        if task.status == "pending":
            return Response({"status": "pending"}, status=status.HTTP_200_OK)

        try:
            submission = task.submissions.last()
            if not submission:
                return Response({"status": "pending"}, status=status.HTTP_200_OK)

            try:
                evaluation = submission.evaluation
            except Submission.evaluation.RelatedObjectDoesNotExist:
                return Response({"status": "pending"}, status=status.HTTP_200_OK)

        except Exception:
            return Response({"status": "pending"}, status=status.HTTP_200_OK)

        data = EvaluationSerializer(evaluation).data
        data["session_id"] = str(task.session.id)
        return Response(data, status=status.HTTP_200_OK)


class UpdateTaskStatusView(APIView):
    def post(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id, session__user=request.user)
        except Task.DoesNotExist:
            return Response(
                {"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND
            )

        new_status = request.data.get("status", "").strip()
        valid_statuses = ["pending", "in_progress", "blocked", "submitted"]
        if new_status not in valid_statuses:
            return Response(
                {"error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if task.status in ("evaluated",):
            return Response(
                {"error": "Cannot change status of an evaluated task"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        task.status = new_status
        task.save(update_fields=["status"])
        return Response({"status": task.status}, status=status.HTTP_200_OK)


class TaskStatusView(APIView):
    def get(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id, session__user=request.user)
        except Task.DoesNotExist:
            return Response(
                {"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            {
                "status": task.status,
                "title": task.title,
                "task_type": task.task_type,
                "difficulty": task.difficulty,
                "deadline_hours": task.deadline_hours,
                "created_at": task.created_at.isoformat(),
            },
            status=status.HTTP_200_OK,
        )
