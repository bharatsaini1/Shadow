from pydantic import BaseModel, Field


class TaskInfo(BaseModel):
    task_id: str
    title: str
    description: str
    task_type: str
    difficulty: str
    deadline_hours: int
    client_context: str = ""
    expected_deliverable: str = ""


class EvaluationRequest(BaseModel):
    task: TaskInfo
    submission_content: str
    submitted_at: str
    task_created_at: str
    deadline_hours: int


class DetailedScores(BaseModel):
    code_quality: int | None = None
    communication: int | None = None
    problem_solving: int | None = None
    time_management: int | None = None
    completeness: int | None = None


class EvaluationResponse(BaseModel):
    overall_score: int = 0
    scores: DetailedScores | None = None
    xp_earned: int = 0
    feedback: str = ""
    strengths: list[str] = []
    improvement_suggestions: list[str] = []
    what_a_senior_would_say: str = ""
    error: str | None = None
