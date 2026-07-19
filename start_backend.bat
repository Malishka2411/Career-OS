@echo off
title XTRAGRAD AI — Backend Server (Port 8000)
echo =============================================
echo   XTRAGRAD AI CareerOS — FastAPI Backend
echo =============================================
echo.
cd /D "d:\INTERNSHIP\AICTE AI internship\AI-CareerOS"
call .venv\Scripts\activate.bat
echo [INFO] Virtual environment activated.
cd backend
echo [INFO] Starting uvicorn on http://localhost:8000 ...
echo [INFO] API Docs: http://localhost:8000/docs
echo [INFO] Press Ctrl+C to stop.
echo.
python -m uvicorn main:app --reload --port 8000 --host 0.0.0.0
pause
