"""
Core business logic for ProjectLab.
Keep router.py thin -- all real logic (model calls, scoring, generation)
lives here so it can be unit tested without spinning up FastAPI.
"""

from project_lab.models import ProjectLabRequest, ProjectLabResponse
from shared.logging_config import get_logger

logger = get_logger(__name__)


def process(request: ProjectLabRequest) -> ProjectLabResponse:
    """
    TODO: implement real logic for ProjectLab.
    """
    logger.info("Processing ProjectLab request for learner %s", request.learner_id)
    return ProjectLabResponse(learner_id=request.learner_id)
