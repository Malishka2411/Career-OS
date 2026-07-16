"""
Consistent logging setup for every sub-system.

Usage:
    from shared.logging_config import get_logger
    logger = get_logger(__name__)
    logger.info("Digital twin updated for learner %s", learner_id)
"""

import logging
import sys

from config import settings

_CONFIGURED = False


def _configure_root_once() -> None:
    global _CONFIGURED
    if _CONFIGURED:
        return

    handler = logging.StreamHandler(sys.stdout)
    formatter = logging.Formatter(
        fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    handler.setFormatter(formatter)

    root = logging.getLogger()
    root.setLevel(settings.LOG_LEVEL)
    root.addHandler(handler)

    _CONFIGURED = True


def get_logger(name: str) -> logging.Logger:
    _configure_root_once()
    return logging.getLogger(name)
