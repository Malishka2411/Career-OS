"""
Core logic for reading/writing Digital Twins.
Router stays thin; this is where the actual storage calls happen.

Storage is a placeholder in-memory dict for now — swap for real DB
calls via shared/db.py once Backend confirms the storage approach.
"""

from datetime import datetime, timezone

from digital_twin.schema import DigitalTwin
from shared.exceptions import LearnerNotFoundError
from shared.logging_config import get_logger

logger = get_logger(__name__)

# TODO: replace with real persistence (see shared/db.py)
_STORE: dict[str, DigitalTwin] = {}


def get_twin(learner_id: str) -> DigitalTwin:
    twin = _STORE.get(learner_id)
    if twin is None:
        raise LearnerNotFoundError(learner_id)
    return twin


def create_twin(learner_id: str, full_name: str) -> DigitalTwin:
    now = datetime.now(timezone.utc)
    twin = DigitalTwin(
        learner_id=learner_id,
        full_name=full_name,
        created_at=now,
        updated_at=now,
    )
    _STORE[learner_id] = twin
    logger.info("Created Digital Twin for learner %s", learner_id)
    return twin


def upsert_twin(twin: DigitalTwin) -> DigitalTwin:
    twin.updated_at = datetime.now(timezone.utc)
    _STORE[twin.learner_id] = twin
    logger.info("Upserted Digital Twin for learner %s", twin.learner_id)
    return twin
