@echo off
cd /D "d:\INTERNSHIP\AICTE AI internship\AI-CareerOS\backend"
echo [INFO] Starting XTRAGRAD AI Backend on port 8000...
"d:\INTERNSHIP\AICTE AI internship\AI-CareerOS\.venv\Scripts\python.exe" -m uvicorn main:app --reload --port 8000 --host 0.0.0.0
