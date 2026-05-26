from pydantic import BaseModel, Field


class ConversationEntry(BaseModel):
    role: str
    content: str


class InterviewTurnRequest(BaseModel):
    user_message: str
    conversation_history: list[ConversationEntry] = []
    interview_type: str = Field(..., pattern=r"^(technical|hr|behavioral)$")
    role: str
    simulation_context: str = ""
    turn_count: int = 0


class InterviewTurnResponse(BaseModel):
    ai_response: str
    is_complete: bool = False
    next_action: str = "continue"
    turn_count: int = 0


class InterviewScoreRequest(BaseModel):
    transcript: list[ConversationEntry]
    interview_type: str = Field(..., pattern=r"^(technical|hr|behavioral)$")
    role: str


class ScoreBreakdown(BaseModel):
    technical_knowledge: int = 0
    communication: int = 0
    confidence: int = 0
    problem_solving: int = 0
    cultural_fit: int = 0


class InterviewScoreResponse(BaseModel):
    scores: ScoreBreakdown | None = None
    overall_score: int = 0
    feedback: str = ""
    interview_summary: str = ""
    strengths: list[str] = []
    areas_for_improvement: list[str] = []
    error: str | None = None
