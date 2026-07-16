"""
Shared exception types + FastAPI exception handlers.

Every sub-system should raise these instead of generic Exceptions, so
errors come back to Backend/Frontend as consistent, predictable JSON
instead of raw 500 stack traces.

Usage:
    from shared.exceptions import LearnerNotFoundError
    raise LearnerNotFoundError(learner_id="stu_00123")
"""

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class AIEngineError(Exception):
    """Base class for all AI Engine errors."""
    status_code = 500
    error_code = "ai_engine_error"

    def __init__(self, message: str = "Internal AI Engine error"):
        self.message = message
        super().__init__(message)


class LearnerNotFoundError(AIEngineError):
    status_code = 404
    error_code = "learner_not_found"

    def __init__(self, learner_id: str):
        super().__init__(f"Learner '{learner_id}' not found in Digital Twin store.")
        self.learner_id = learner_id


class InvalidSchemaError(AIEngineError):
    status_code = 422
    error_code = "invalid_schema"


class LLMGenerationError(AIEngineError):
    status_code = 502
    error_code = "llm_generation_failed"

    def __init__(self, message: str = "The generative model failed to produce a valid response."):
        super().__init__(message)


class SandboxExecutionError(AIEngineError):
    """Raised when code submitted to the Technical Assessment sandbox fails to execute safely."""
    status_code = 400
    error_code = "sandbox_execution_error"


def register_exception_handlers(app: FastAPI) -> None:
    """Call once from main.py: register_exception_handlers(app)"""

    @app.exception_handler(AIEngineError)
    async def handle_ai_engine_error(request: Request, exc: AIEngineError):
        return JSONResponse(
            status_code=exc.status_code,
            content={"error_code": exc.error_code, "message": exc.message},
        )
