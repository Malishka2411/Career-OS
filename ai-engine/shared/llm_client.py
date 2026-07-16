"""
Single shared wrapper around the Anthropic API, used by every generative
sub-system (Resume/Portfolio Studio, Project Lab, HR Simulator,
Technical Assessment feedback, Career Intelligence reasoning).

Centralizing this means retries, error handling, and model selection
are configured once — not reinvented per sub-team.

Usage:
    from shared.llm_client import generate_text

    result = generate_text(
        system_prompt="You are a resume writing assistant.",
        user_prompt="Write a summary for a student with these projects: ...",
    )
"""

import time

import anthropic

from config import settings
from shared.exceptions import LLMGenerationError
from shared.logging_config import get_logger

logger = get_logger(__name__)

_client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)

_MAX_RETRIES = 3
_RETRY_DELAY_SECONDS = 2


def generate_text(
    system_prompt: str,
    user_prompt: str,
    max_tokens: int = 1024,
    temperature: float = 0.7,
) -> str:
    """
    Calls the Claude API with basic retry handling. Raises
    LLMGenerationError if all retries fail, so callers can catch one
    consistent exception type instead of anthropic's internal ones.
    """
    if not settings.ANTHROPIC_API_KEY:
        raise LLMGenerationError(
            "ANTHROPIC_API_KEY is not set. Add it to your .env file to use generative features."
        )

    last_error: Exception | None = None

    for attempt in range(1, _MAX_RETRIES + 1):
        try:
            response = _client.messages.create(
                model=settings.ANTHROPIC_MODEL,
                max_tokens=max_tokens,
                temperature=temperature,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}],
            )
            text_blocks = [block.text for block in response.content if block.type == "text"]
            return "\n".join(text_blocks).strip()

        except Exception as exc:  # noqa: BLE001 - deliberately broad, we wrap it below
            last_error = exc
            logger.warning("LLM call failed (attempt %d/%d): %s", attempt, _MAX_RETRIES, exc)
            if attempt < _MAX_RETRIES:
                time.sleep(_RETRY_DELAY_SECONDS * attempt)

    logger.error("LLM call failed after %d attempts.", _MAX_RETRIES)
    raise LLMGenerationError(f"Claude API call failed after {_MAX_RETRIES} attempts: {last_error}")
