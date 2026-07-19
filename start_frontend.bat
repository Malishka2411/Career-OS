@echo off
title XTRAGRAD AI — Frontend Server (Port 5500)
echo =============================================
echo   XTRAGRAD AI CareerOS — Frontend Server
echo =============================================
echo.
cd /D "d:\INTERNSHIP\AICTE AI internship\AI-CareerOS\frontend"
echo [INFO] Serving frontend at http://localhost:5500
echo [INFO] Open: http://localhost:5500/login.html
echo [INFO] Press Ctrl+C to stop.
echo.
python -m http.server 5500
pause
