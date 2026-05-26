from pydantic import BaseModel, Field


class PersonaRequest(BaseModel):
    persona: str = Field(..., pattern=r"^(team_lead|senior_dev|client|hr)$")
    trigger: str = Field(default="task_submitted", pattern=r"^(task_submitted|task_evaluated|day_completed|simulation_completed|excellent_performance|poor_performance)$")
    context: dict = {}
    student_performance: str = Field(default="good", pattern=r"^(good|needs_improvement|excellent)$")
    message_history: list[str] = []


class PersonaResponse(BaseModel):
    persona_name: str
    persona_role: str
    message: str
    message_type: str
    timestamp_offset_minutes: int
    error: str | None = None
