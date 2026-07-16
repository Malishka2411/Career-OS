"""
Core business logic for HRSimulator.
Keep router.py thin -- all real logic (model calls, scoring, generation)
lives here so it can be unit tested without spinning up FastAPI.
"""

from hr_simulator.models import HRSimulatorRequest, HRSimulatorResponse
from shared.logging_config import get_logger

logger = get_logger(__name__)


def process(request: HRSimulatorRequest) -> HRSimulatorResponse:
    """
    TODO: implement real logic for HRSimulator.
    """
    logger.info("Processing HRSimulator request for learner %s", request.learner_id)
    return HRSimulatorResponse(learner_id=request.learner_id)
