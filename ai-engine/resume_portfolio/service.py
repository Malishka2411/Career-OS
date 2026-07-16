"""
Core business logic for ResumePortfolio.

Turns a learner's Digital Twin (skills, projects, certifications) into
an ATS-friendly resume summary and a LinkedIn-style summary using the
shared Claude API wrapper. Keeps router.py thin — all prompt
construction and parsing lives here so it's independently testable.
"""

import json
from datetime import datetime, timezone

from digital_twin.service import get_twin, upsert_twin
from resume_portfolio.models import ResumePortfolioRequest, ResumePortfolioResponse
from shared.llm_client import generate_text
from shared.logging_config import get_logger

logger = get_logger(__name__)

_SYSTEM_PROMPT = (
    "You are an expert resume writer for early-career tech candidates. "
    "You write ATS-friendly, achievement-focused text with no fluff. "
    "You always respond with valid JSON only, no markdown formatting, "
    "matching this exact shape: "
    '{"resume_summary": "...", "linkedin_summary": "..."}'
)


def _build_user_prompt(request: ResumePortfolioRequest, twin) -> str:
    skills = ", ".join(s.name for s in twin.skills) or "no assessed skills yet"
    projects = "; ".join(f"{p.title} ({', '.join(p.tech_stack)})" for p in twin.projects) or "no projects yet"
    certs = ", ".join(c.title for c in twin.certifications) or "no certifications yet"

    return (
        f"Candidate name: {twin.full_name}\n"
        f"Career interests: {', '.join(twin.career_interests) or 'not specified'}\n"
        f"Skills: {skills}\n"
        f"Projects: {projects}\n"
        f"Certifications: {certs}\n"
        f"Desired tone: {request.tone}\n\n"
        "Write a 3-4 sentence ATS-friendly resume summary and a separate "
        "2-3 sentence LinkedIn 'About' summary. Respond with JSON only."
    )


def _compute_ats_score(resume_summary: str, twin) -> float:
    """
    Lightweight ATS heuristic: rewards keyword coverage of the learner's
    own skill list and a reasonable summary length. This is a stand-in —
    swap for a real ATS-parsing library if higher fidelity is needed.
    """
    if not twin.skills:
        return 50.0

    text_lower = resume_summary.lower()
    matched = sum(1 for s in twin.skills if s.name.lower() in text_lower)
    keyword_coverage = matched / len(twin.skills)

    word_count = len(resume_summary.split())
    length_score = 1.0 if 40 <= word_count <= 120 else 0.6

    score = (0.7 * keyword_coverage + 0.3 * length_score) * 100
    return round(min(score, 100.0), 1)


def process(request: ResumePortfolioRequest) -> ResumePortfolioResponse:
    logger.info("Generating resume/portfolio for learner %s", request.learner_id)

    twin = get_twin(request.learner_id)
    user_prompt = _build_user_prompt(request, twin)

    raw_response = generate_text(system_prompt=_SYSTEM_PROMPT, user_prompt=user_prompt, max_tokens=600)

    try:
        parsed = json.loads(raw_response)
        resume_summary = parsed["resume_summary"]
        linkedin_summary = parsed["linkedin_summary"]
    except (json.JSONDecodeError, KeyError):
        logger.warning("Resume generation returned non-JSON response; using raw text as fallback.")
        resume_summary = raw_response.strip()
        linkedin_summary = raw_response.strip()

    ats_score = _compute_ats_score(resume_summary, twin)

    twin.resume.last_generated_at = datetime.now(timezone.utc)
    twin.resume.ats_score = ats_score
    upsert_twin(twin)

    return ResumePortfolioResponse(
        learner_id=request.learner_id,
        resume_summary=resume_summary,
        linkedin_summary=linkedin_summary,
        ats_score=ats_score,
    )
