"""
Core business logic for ResumePortfolio.
Keep router.py thin -- all real logic (model calls, scoring, generation)
lives here so it can be unit tested without spinning up FastAPI.
"""

from resume_portfolio.models import ResumePortfolioRequest, ResumePortfolioResponse
from shared.logging_config import get_logger

logger = get_logger(__name__)


def process(request: ResumePortfolioRequest) -> ResumePortfolioResponse:
    """
    TODO: implement real logic for ResumePortfolio.
    """
    logger.info("Processing ResumePortfolio request for learner %s", request.learner_id)
    return ResumePortfolioResponse(learner_id=request.learner_id)
