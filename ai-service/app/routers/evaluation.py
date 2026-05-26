from fastapi import APIRouter, Depends
from app.auth import verify_api_key
from app.schemas.evaluation import EvaluationRequest, EvaluationResponse
from app.pipelines.reviewer import evaluate_submission

router = APIRouter(dependencies=[Depends(verify_api_key)])


@router.post("/submission", response_model=EvaluationResponse)
async def evaluate(body: EvaluationRequest):
    result = await evaluate_submission(
        task=body.task.model_dump(),
        submission_content=body.submission_content,
        submitted_at=body.submitted_at,
        task_created_at=body.task_created_at,
        deadline_hours=body.deadline_hours,
    )
    return result
