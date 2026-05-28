from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Task, Submission
from .serializers import TaskSerializer, SubmitTaskSerializer, EvaluationSerializer
from celery_tasks.ai_tasks import evaluate_submission_task
from services.storage import upload_file


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
    parser_classes = [MultiPartParser, FormParser]

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

        evaluate_submission_task.delay(str(task.id), str(submission.id))

        return Response(
            {
                "submission_id": str(submission.id),
                "status": "submitted",
                "message": "Submission received. Evaluation in progress.",
            },
            status=status.HTTP_201_CREATED,
        )


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
        return Response(data, status=status.HTTP_200_OK)


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
