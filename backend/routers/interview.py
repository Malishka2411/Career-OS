"""
Interview simulation router powered by Groq.
"""
import json
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
import asyncpg

from core.database import get_db
from dependencies.auth import get_current_user
from services.groq_client import groq_chat

router = APIRouter(prefix="/interview", tags=["Interview"])


class InterviewRequest(BaseModel):
    role: Optional[str] = "Software Engineer"
    interview_type: Optional[str] = "technical"  # technical | hr | behavioral
    question_count: Optional[int] = 5


class AnswerRequest(BaseModel):
    question: str
    answer: str
    role: Optional[str] = "Software Engineer"


@router.post("/generate-questions")
async def generate_questions(
    data: InterviewRequest,
    current_user: dict = Depends(get_current_user),
):
    system = "You are a professional interviewer. Generate interview questions as JSON."
    user_prompt = (
        f"Generate {data.question_count} {data.interview_type} interview questions "
        f"for the role: {data.role}. "
        f'Return JSON: {{"questions": ["q1", "q2", ...]}}'
    )
    raw = await groq_chat(system, user_prompt, max_tokens=600)
    try:
        return json.loads(raw)
    except Exception:
        return {"questions": [raw]}


@router.post("/evaluate-answer")
async def evaluate_answer(
    data: AnswerRequest,
    current_user: dict = Depends(get_current_user),
    db: asyncpg.Connection = Depends(get_db),
):
    system = "You are an expert hiring manager. Evaluate interview answers as JSON."
    user_prompt = (
        f"Role: {data.role}\nQuestion: {data.question}\nCandidate Answer: {data.answer}\n"
        "Evaluate this answer. "
        'Return JSON: {"score": <0-10>, "feedback": "...", "suggested_answer": "..."}'
    )
    raw = await groq_chat(system, user_prompt, max_tokens=500)
    try:
        result = json.loads(raw)
    except Exception:
        result = {"raw_feedback": raw}

    # Increment interview count
    await db.execute(
        "UPDATE profiles SET interviews_done = interviews_done + 1, updated_at = NOW() WHERE user_id = $1",
        current_user["id"],
    )
    return result
