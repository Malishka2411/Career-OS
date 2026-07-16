"""
Core business logic for CareerIntelligence.
Keep router.py thin -- all real logic (model calls, scoring, generation)
lives here so it can be unit tested without spinning up FastAPI.
"""

from career_intelligence.models import CareerIntelligenceRequest, CareerIntelligenceResponse
from shared.logging_config import get_logger

logger = get_logger(__name__)


def process(request: CareerIntelligenceRequest) -> CareerIntelligenceResponse:
    """
    TODO: implement real logic for CareerIntelligence.
    """
    logger.info("Processing CareerIntelligence request for learner %s", request.learner_id)
    return CareerIntelligenceResponse(learner_id=request.learner_id)
