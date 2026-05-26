import json
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from app.config import get_settings
from app.pipelines import rag

TURN_MODEL = "llama-3.1-8b-instant"
SCORE_MODEL = "llama-3.3-70b-versatile"
CONCLUDE_PHRASE = "That concludes our interview."

SYSTEM_TEMPLATE = open("app/prompts/interview_system.txt", encoding="utf-8").read()


def _build_messages(
    system_prompt: str,
    conversation_history: list[dict],
    user_message: str,
) -> list:
    messages = [SystemMessage(content=system_prompt)]
    for entry in conversation_history:
        role = entry.get("role", "")
        content = entry.get("content", "")
        if role == "user":
            messages.append(HumanMessage(content=content))
        elif role == "assistant":
            messages.append(AIMessage(content=content))
    messages.append(HumanMessage(content=user_message))
    return messages


async def run_turn(
    user_message: str,
    conversation_history: list[dict],
    interview_type: str,
    role: str,
    simulation_context: str,
    turn_count: int,
) -> dict:
    try:
        questions = await rag.get_interview_questions(role, interview_type)

        system_prompt = SYSTEM_TEMPLATE.format(
            interview_type=interview_type,
            role=role,
            simulation_context=simulation_context or "No prior simulation data.",
            interview_questions=questions if questions else "Standard interview questions for this role.",
        )

        messages = _build_messages(system_prompt, conversation_history, user_message)

        model = ChatGroq(
            model=TURN_MODEL,
            temperature=0.7,
            max_tokens=1024,
            api_key=get_settings().groq_api_key,
        )

        response = model.invoke(messages)
        ai_text = response.content.strip()

        is_complete = CONCLUDE_PHRASE in ai_text

        return {
            "ai_response": ai_text,
            "is_complete": is_complete,
            "next_action": "conclude" if is_complete else "continue",
            "turn_count": turn_count + 1,
        }

    except Exception:
        return {
            "ai_response": "I apologize, let me rephrase that question.",
            "is_complete": False,
            "next_action": "continue",
            "turn_count": turn_count,
        }


SCORE_SYSTEM_TEMPLATE = """You are an expert interview evaluator. Analyze the following interview transcript and provide scores.

Interview Type: {interview_type}
Role: {role}

### Transcript
{transcript}

You MUST respond with valid JSON only. No markdown, no explanation.
The JSON must use this exact structure:
{{
  "scores": {{
    "technical_knowledge": 72,
    "communication": 85,
    "confidence": 68,
    "problem_solving": 78,
    "cultural_fit": 80
  }},
  "overall_score": 77,
  "feedback": "The candidate demonstrated strong communication...",
  "interview_summary": "The interview covered technical concepts...",
  "strengths": ["Good communication", "Clear explanations"],
  "areas_for_improvement": ["Could provide more specific examples", "Deepen technical knowledge"]
}}
"""


async def generate_scores(
    transcript: list[dict],
    interview_type: str,
    role: str,
) -> dict:
    try:
        transcript_text = "\n".join(
            f"{'Interviewer' if e.get('role') == 'assistant' else 'Candidate'}: {e.get('content', '')}"
            for e in transcript
        )

        system_prompt = SCORE_SYSTEM_TEMPLATE.format(
            interview_type=interview_type,
            role=role,
            transcript=transcript_text,
        )

        model = ChatGroq(
            model=SCORE_MODEL,
            temperature=0.3,
            max_tokens=2000,
            api_key=get_settings().groq_api_key,
        )

        response = model.bind(response_format={"type": "json_object"}).invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content="Generate the interview evaluation scores in JSON format."),
        ])

        result = json.loads(response.content)

        return {
            "scores": result.get("scores", {
                "technical_knowledge": 0,
                "communication": 0,
                "confidence": 0,
                "problem_solving": 0,
                "cultural_fit": 0,
            }),
            "overall_score": result.get("overall_score", 0),
            "feedback": result.get("feedback", ""),
            "interview_summary": result.get("interview_summary", ""),
            "strengths": result.get("strengths", []),
            "areas_for_improvement": result.get("areas_for_improvement", []),
        }

    except Exception as e:
        return {
            "overall_score": 0,
            "error": str(e),
        }
