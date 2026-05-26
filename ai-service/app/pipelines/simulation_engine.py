import json
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from app.config import get_settings
from app.pipelines import rag

MODEL_NAME = "llama-3.3-70b-versatile"

SYSTEM_TEMPLATE = open("app/prompts/simulation_system.txt", encoding="utf-8").read()


def _build_system_prompt(
    role: str,
    day: int,
    difficulty: str,
    previous_context: str,
    career_context: str,
    task_templates: str,
) -> str:
    return SYSTEM_TEMPLATE.format(
        role=role,
        day_to_day=career_context,
        tech_stack="",
        common_issues="",
        industry_standards="",
        task_examples=task_templates,
    )


def _build_user_message(
    role: str,
    day: int,
    difficulty: str,
    previous_context: str,
) -> str:
    parts = [
        f"Generate a work day for a {role}.",
        "",
        f"Day: {day}",
        f"Difficulty: {difficulty}",
        "",
    ]
    if previous_context:
        parts.extend([
            "Previous Context:",
            previous_context,
            "",
            "Reference ongoing projects. Do NOT repeat completed tasks.",
        ])
    else:
        parts.append("This is day 1. The student is new. Welcome them and assign their first tasks.")
    parts.append("")
    parts.append("Return valid JSON only. No markdown or explanation.")
    return "\n".join(parts)


async def generate_day(
    role: str,
    day: int,
    previous_context: str,
    difficulty: str,
) -> dict:
    try:
        career_context = await rag.get_career_context(role, f"day {day} {difficulty}")
        task_templates = await rag.get_task_templates(role, difficulty)

        system_prompt = _build_system_prompt(
            role, day, difficulty, previous_context,
            career_context, task_templates,
        )
        user_message = _build_user_message(role, day, difficulty, previous_context)

        model = ChatGroq(
            model=MODEL_NAME,
            temperature=0.7,
            max_tokens=2000,
            api_key=get_settings().groq_api_key,
        )

        response = model.bind(response_format={"type": "json_object"}).invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_message),
        ])

        result = json.loads(response.content)

        if "manager_message" not in result or "tasks" not in result:
            raise ValueError("Response missing required fields")

        return result

    except Exception as e:
        return {
            "manager_message": "Good morning! I have some updates for you today.",
            "tasks": [],
            "error": str(e),
        }
