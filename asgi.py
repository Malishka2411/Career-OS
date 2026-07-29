"""
XTRAGRAD AI CareerOS — ASGI Entry Point (Production + Development)
Run:  uvicorn asgi:app --host 0.0.0.0 --port $PORT
"""

import os
import sys
from pathlib import Path

# ---------------------------------------------------------------------------
# Resolve project paths
# ---------------------------------------------------------------------------
ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"

# Add backend/ to sys.path so that `main`, `core`, `routers`, etc. resolve
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

# Set working directory to backend/ so .env resolution works
os.chdir(BACKEND_DIR)

# ---------------------------------------------------------------------------
# Import the FastAPI app from backend/main.py
# Render / uvicorn will find this as `asgi:app`
# ---------------------------------------------------------------------------
from backend.main import app  # noqa: E402, F401

print()
print("=" * 50)
print("  XTRAGRAD AI CareerOS — Running")
print("=" * 50)
print(f"[Backend]  API   → port {os.environ.get('PORT', '8000')}")
print("[Backend]  Docs  → /docs")
print("=" * 50)
print()
