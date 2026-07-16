"""
Core business logic for TechnicalAssessment.
Keep router.py thin -- all real logic (model calls, scoring, generation)
lives here so it can be unit tested without spinning up FastAPI.
"""

from shared.logging_config import get_logger
from technical_assessment.models import TechnicalAssessmentRequest, TechnicalAssessmentResponse

logger = get_logger(__name__)


def process(request: TechnicalAssessmentRequest) -> TechnicalAssessmentResponse:
    """
    TODO: implement real logic for TechnicalAssessment.
    """
    logger.info("Processing TechnicalAssessment request for learner %s", request.learner_id)
    return TechnicalAssessmentResponse(learner_id=request.learner_id)
