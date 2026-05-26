from fastapi import APIRouter, Depends
from app.auth import verify_api_key
from app.schemas.persona import PersonaRequest, PersonaResponse
from app.pipelines.team_persona import generate_message

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
