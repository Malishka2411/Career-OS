"""
Core business logic for RecruiterAgent.
Keep router.py thin -- all real logic (model calls, scoring, generation)
lives here so it can be unit tested without spinning up FastAPI.
"""

from recruiter_agent.models import RecruiterAgentRequest, RecruiterAgentResponse
from shared.logging_config import get_logger

logger = get_logger(__name__)


def process(request: RecruiterAgentRequest) -> RecruiterAgentResponse:
    """
    TODO: implement real logic for RecruiterAgent.
    """
    logger.info("Processing RecruiterAgent request for learner %s", request.learner_id)
    return RecruiterAgentResponse(learner_id=request.learner_id)
