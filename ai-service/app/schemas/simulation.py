from pydantic import BaseModel, Field


class SimulationRequest(BaseModel):
    role: str = Field(..., json_schema_extra={"example": "MERN Stack Developer"})
    day: int = Field(..., ge=1, le=10, json_schema_extra={"example": 3})
    previous_context: str = Field(default="", json_schema_extra={"example": "Days 1-2: Student set up dev environment, cloned repo."})
    difficulty: str = Field(default="intermediate", pattern=r"^(easy|intermediate|hard)$")


class TaskItem(BaseModel):
    task_id: str
    title: str
    description: str
    task_type: str
    difficulty: str
    deadline_hours: int
    client_context: str
    expected_deliverable: str


class SimulationResponse(BaseModel):
    manager_message: str
    tasks: list[TaskItem]
    error: str | None = None
