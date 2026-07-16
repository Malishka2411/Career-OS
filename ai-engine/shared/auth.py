"""
Verifies that incoming requests genuinely come from the Backend service
(not the end-user's browser directly), using a shared secret / JWT
issued by the Backend team.

Replace the placeholder verification logic once Backend confirms the
real auth scheme (shared HMAC secret vs. JWT vs. mTLS, etc.) — this is
a starting point so every sub-team doesn't invent their own version.

Usage (in a router.py):
    from fastapi import Depends
    from shared.auth import verify_backend_request

    @router.post("/generate")
    def generate(payload: SomeModel, _=Depends(verify_backend_request)):
        ...
"""

from fastapi import Header, HTTPException, status

from config import settings


def verify_backend_request(x_service_token: str = Header(default="")) -> None:
    """
    Dependency that checks the 'X-Service-Token' header sent by the
    Backend service on every internal request.
    """
    if not settings.AUTH_SHARED_SECRET:
        # No secret configured (local dev) — skip verification.
        return

    if x_service_token != settings.AUTH_SHARED_SECRET:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing service token.",
        )
