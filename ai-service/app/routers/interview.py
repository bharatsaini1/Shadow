from fastapi import APIRouter, Depends
from app.auth import verify_api_key
from app.schemas.interview import (
    InterviewTurnRequest,
    InterviewTurnResponse,
    InterviewScoreRequest,
    InterviewScoreResponse,
)
from app.pipelines.interview_agent import run_turn, generate_scores

router = APIRouter(dependencies=[Depends(verify_api_key)])


@router.post("/turn", response_model=InterviewTurnResponse)
async def interview_turn(body: InterviewTurnRequest):
    result = await run_turn(
        user_message=body.user_message,
        conversation_history=[e.model_dump() for e in body.conversation_history],
        interview_type=body.interview_type,
        role=body.role,
        simulation_context=body.simulation_context,
        turn_count=body.turn_count,
    )
    return result


@router.post("/score", response_model=InterviewScoreResponse)
async def interview_score(body: InterviewScoreRequest):
    result = await generate_scores(
        transcript=[e.model_dump() for e in body.transcript],
        interview_type=body.interview_type,
        role=body.role,
    )
    return result
