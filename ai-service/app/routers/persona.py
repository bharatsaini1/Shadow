from fastapi import APIRouter, Depends
from app.auth import verify_api_key
from app.schemas.persona import PersonaRequest, PersonaResponse, PersonaChatRequest, PersonaChatResponse
from app.pipelines.team_persona import generate_message, generate_chat_response

router = APIRouter(dependencies=[Depends(verify_api_key)])


@router.post("/message", response_model=PersonaResponse)
async def persona_message(body: PersonaRequest):
    result = await generate_message(
        persona=body.persona,
        trigger=body.trigger,
        context=body.context,
        student_performance=body.student_performance,
        message_history=body.message_history,
    )
    return result


@router.post("/chat", response_model=PersonaChatResponse)
async def persona_chat(body: PersonaChatRequest):
    result = await generate_chat_response(
        persona=body.persona,
        user_message=body.user_message,
        conversation_history=body.conversation_history,
        context=body.context,
    )
    return result
