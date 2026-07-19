@echo off
cd /D "d:\INTERNSHIP\AICTE AI internship\AI-CareerOS"
echo Installing backend dependencies using python -m pip ...
"d:\INTERNSHIP\AICTE AI internship\AI-CareerOS\.venv\Scripts\python.exe" -m pip install -r backend\requirements.txt
echo.
echo Install complete. Exit code: %errorlevel%
