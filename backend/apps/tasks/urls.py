from django.urls import path
from .views import GetTaskView, SubmitTaskView, GetEvaluationView, TaskStatusView

urlpatterns = [
    path("<uuid:task_id>", GetTaskView.as_view(), name="task-detail"),
    path("<uuid:task_id>/submit", SubmitTaskView.as_view(), name="task-submit"),
    path("<uuid:task_id>/evaluation", GetEvaluationView.as_view(), name="task-evaluation"),
    path("<uuid:task_id>/status", TaskStatusView.as_view(), name="task-status"),
]
