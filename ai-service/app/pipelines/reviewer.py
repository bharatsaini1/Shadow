import json
from datetime import datetime, timedelta, timezone
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from app.config import get_settings
from app.pipelines import rag

MODEL_NAME = "llama-3.3-70b-versatile"
BASE_XP = 100
DIFFICULTY_MULTIPLIER = {"easy": 1.0, "intermediate": 1.5, "medium": 1.5, "hard": 2.0}

SYSTEM_TEMPLATE = open("app/prompts/reviewer_system.txt", encoding="utf-8").read()

REQUIRED_SCORE_FIELDS = ["code_quality", "communication", "problem_solving", "time_management", "completeness"]
REQUIRED_FIELDS = ["overall_score", "scores", "feedback", "strengths", "improvement_suggestions", "what_a_senior_would_say"]


def _is_on_time(submitted_at: str, task_created_at: str, deadline_hours: int) -> bool:
    try:
        submitted = datetime.fromisoformat(submitted_at)
        created = datetime.fromisoformat(task_created_at)
        deadline = created + timedelta(hours=deadline_hours)
        return submitted <= deadline
    except Exception:
        return True


async def evaluate_submission(
    task: dict,
    submission_content: str,
    submitted_at: str,
    task_created_at: str,
    deadline_hours: int,
) -> dict:
    try:
        on_time = _is_on_time(submitted_at, task_created_at, deadline_hours)
        rubric = await rag.get_evaluation_rubric(task.get("task_type", "coding"))

        system_prompt = SYSTEM_TEMPLATE.format(
            task_title=task.get("title", ""),
            task_description=task.get("description", ""),
            task_type=task.get("task_type", "coding"),
            difficulty=task.get("difficulty", "medium"),
            rubric=rubric if rubric else "Standard evaluation rubric",
            submission=submission_content[:3000],
            on_time=str(on_time),
        )

        model = ChatGroq(
            model=MODEL_NAME,
            temperature=0.3,
            max_tokens=2000,
            api_key=get_settings().groq_api_key,
        )

        response = model.bind(response_format={"type": "json_object"}).invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content="Evaluate this submission and return JSON scores."),
        ])

        result = json.loads(response.content)

        missing = [f for f in REQUIRED_FIELDS if f not in result]
        if missing:
            raise ValueError(f"Response missing required field(s): {', '.join(missing)}")

        difficulty = task.get("difficulty", "medium")
        multiplier = DIFFICULTY_MULTIPLIER.get(difficulty, 1.0)
        overall = result.get("overall_score", 0)
        xp_earned = int(BASE_XP * (overall / 100) * multiplier)

        scores = result.get("scores", {})
        for field in REQUIRED_SCORE_FIELDS:
            scores.setdefault(field, None)

        return {
            "overall_score": overall,
            "scores": scores,
            "xp_earned": xp_earned,
            "feedback": result.get("feedback", ""),
            "strengths": result.get("strengths", []),
            "improvement_suggestions": result.get("improvement_suggestions", []),
            "what_a_senior_would_say": result.get("what_a_senior_would_say", ""),
        }

    except Exception as e:
        return {
            "overall_score": 0,
            "xp_earned": 0,
            "error": str(e),
        }
