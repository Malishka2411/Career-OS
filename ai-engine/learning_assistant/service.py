"""
Core business logic for LearningAssistant.
Keep router.py thin -- all real logic (model calls, scoring, generation)
lives here so it can be unit tested without spinning up FastAPI.
"""

from learning_assistant.models import LearningAssistantRequest, LearningAssistantResponse
from shared.logging_config import get_logger

logger = get_logger(__name__)


def process(request: LearningAssistantRequest) -> LearningAssistantResponse:
    """
    TODO: implement real logic for LearningAssistant.
    """
    logger.info("Processing LearningAssistant request for learner %s", request.learner_id)
    return LearningAssistantResponse(learner_id=request.learner_id)
