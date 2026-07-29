"""
XTRAGRAD AI CareerOS — Single Entry Point
Run:  uvicorn wsgi:app --reload
Starts:
  • FastAPI backend  → http://localhost:8000  (API docs at /docs)
  • Frontend server  → http://localhost:5500  (open /login.html)
"""

import os
import sys
import threading
import http.server
import socketserver
from pathlib import Path
from functools import partial

# ---------------------------------------------------------------------------
# Resolve project paths
# ---------------------------------------------------------------------------
ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"

# Add backend/ to sys.path so that `main`, `core`, `routers`, etc. resolve
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

# Set working directory to backend/ so .env resolution works
os.chdir(BACKEND_DIR)


# ---------------------------------------------------------------------------
# Frontend: lightweight HTTP file server in a background daemon thread
# ---------------------------------------------------------------------------
_frontend_started = False


def _start_frontend(directory: str, port: int = 5500):
    """Serve the frontend folder on the given port."""
    handler = partial(http.server.SimpleHTTPRequestHandler, directory=directory)
    with socketserver.TCPServer(("0.0.0.0", port), handler) as httpd:
        print(f"[Frontend] Serving at http://localhost:{port}")
        print(f"[Frontend] Open     http://localhost:{port}/login.html")
        httpd.serve_forever()


def _ensure_frontend():
    """Start the frontend server once (idempotent across reloads)."""
    global _frontend_started
    if _frontend_started:
        return
    _frontend_started = True
    t = threading.Thread(
        target=_start_frontend,
        args=(str(FRONTEND_DIR),),
        kwargs={"port": 5500},
        daemon=True,
    )
    t.start()


# Start the frontend server when this module is imported
_ensure_frontend()

# ---------------------------------------------------------------------------
# Import the FastAPI app from backend/main.py so uvicorn can find `wsgi:app`
# ---------------------------------------------------------------------------
from main import app  # noqa: E402, F401

print()
print("=" * 50)
print("  XTRAGRAD AI CareerOS — Running")
print("=" * 50)
print("[Backend]  API   → http://localhost:8000")
print("[Backend]  Docs  → http://localhost:8000/docs")
print("[Frontend] UI    → http://localhost:5500/login.html")
print("=" * 50)
print()
