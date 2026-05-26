import json
import random
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from app.config import get_settings

MODEL_NAME = "llama-3.3-70b-versatile"

PERSONAS = {
    "team_lead": {
        "name": "Priya Sharma",
        "role": "Team Lead",
        "message_type": "slack",
        "timestamp_range": (5, 20),
        "system_prompt": (
            "You are Priya Sharma, Team Lead at TechSprint Solutions, Bangalore. "
            "7 years experience. Professional but approachable. "
            "Use bullet points for multi-point feedback. "
            "Reference specific parts of the task or submission. "
            "Max 6 Slack lines. Always end with a clear next step or action item. "
            "Sign off as 'Priya'."
        ),
    },
    "senior_dev": {
        "name": "Karan Joshi",
        "role": "Senior MERN Developer",
        "message_type": "slack",
        "timestamp_range": (10, 40),
        "system_prompt": (
            "You are Karan Joshi, Senior MERN Developer. "
            "5 years experience. Casual tone, uses developer slang (bro, ngl, tbh, lol, fr fr). "
            "Reference actual technical concepts (useState, async/await, MongoDB indexes, JWT). "
            "Max 5 Slack lines. No formal greeting — just dive in. "
            "Sign off as 'Karan'."
        ),
    },
    "client": {
        "name": "Rajiv Nair",
        "role": "Client Representative",
        "message_type": "email",
        "timestamp_range": (30, 120),
        "system_prompt": (
            "You are Rajiv Nair from TechMart Solutions writing a formal business email. "
            "First line must be 'Subject: ...' then blank line then the email. "
            "Professional greeting 'Hi Team,'. 2-3 short paragraphs. "
            "Formal sign-off: 'Best regards, Rajiv Nair | TechMart Solutions'."
        ),
    },
    "hr": {
        "name": "Sneha Patel",
        "role": "HR Executive",
        "message_type": "slack",
        "timestamp_range": (60, 180),
        "system_prompt": (
            "You are Sneha Patel, HR Executive. "
            "Warm, encouraging, positive. Use emojis: 🎉 ⭐ 💪 🚀. "
            "Reference their progress and achievements. Max 4 Slack lines. "
            "Sign off as 'Sneha from HR 😊'."
        ),
    },
}

SYSTEM_TEMPLATE = open("app/prompts/persona_system.txt", encoding="utf-8").read()


async def generate_message(
    persona: str,
    trigger: str = "task_submitted",
    context: dict | None = None,
    student_performance: str = "good",
    message_history: list[str] | None = None,
) -> dict:
    try:
        persona_config = PERSONAS.get(persona)
        if not persona_config:
            raise ValueError(f"Unknown persona: {persona}")

        if message_history is None:
            message_history = []

        system_prompt = SYSTEM_TEMPLATE.format(
            persona_prompt=persona_config["system_prompt"],
            trigger=trigger,
            context=json.dumps(context or {}, indent=2)[:1500],
            student_performance=student_performance,
            message_history="\n".join(message_history[-3:]),
        )

        model = ChatGroq(
            model=MODEL_NAME,
            temperature=0.85,
            max_tokens=1024,
            api_key=get_settings().groq_api_key,
        )

        response = model.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"Generate a {persona_config['message_type']} message for this {trigger} event."),
        ])

        lo, hi = persona_config["timestamp_range"]
        timestamp = random.randint(lo, hi)

        return {
            "persona_name": persona_config["name"],
            "persona_role": persona_config["role"],
            "message": response.content.strip(),
            "message_type": persona_config["message_type"],
            "timestamp_offset_minutes": timestamp,
        }

    except Exception as e:
        cfg = PERSONAS.get(persona, {})
        return {
            "persona_name": cfg.get("name", persona),
            "persona_role": cfg.get("role", ""),
            "message": f"Hi! Here's a quick update on the {trigger} event.",
            "message_type": cfg.get("message_type", "slack"),
            "timestamp_offset_minutes": 0,
            "error": str(e),
        }
