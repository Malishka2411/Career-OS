"""
Core business logic for PlacementReadiness.
Keep router.py thin -- all real logic (model calls, scoring, generation)
lives here so it can be unit tested without spinning up FastAPI.
"""

from placement_readiness.models import PlacementReadinessRequest, PlacementReadinessResponse
from shared.logging_config import get_logger

logger = get_logger(__name__)


def process(request: PlacementReadinessRequest) -> PlacementReadinessResponse:
    """
    TODO: implement real logic for PlacementReadiness.
    """
    logger.info("Processing PlacementReadiness request for learner %s", request.learner_id)
    return PlacementReadinessResponse(learner_id=request.learner_id)
