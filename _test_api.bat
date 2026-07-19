@echo off
cd /D "d:\INTERNSHIP\AICTE AI internship\AI-CareerOS"
echo === Testing Register ===
"d:\INTERNSHIP\AICTE AI internship\AI-CareerOS\.venv\Scripts\python.exe" -c "import httpx; r = httpx.post('http://localhost:8000/auth/register', json={'full_name':'Demo Student','email':'demostudent2026@example.com','password':'demo123','phone':'9876543210','college':'IIT Delhi','branch':'CSE','year_of_study':'3rd Year'}); print('Status:', r.status_code); print('Body:', r.text)"
echo.
echo === Done ===
