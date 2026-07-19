@echo off
cd /D "d:\INTERNSHIP\AICTE AI internship\AI-CareerOS"
echo === Testing Login ===
"d:\INTERNSHIP\AICTE AI internship\AI-CareerOS\.venv\Scripts\python.exe" -c "import httpx, json; r = httpx.post('http://localhost:8000/auth/login', json={'email':'demostudent2026@example.com','password':'demo123'}); print('Status:', r.status_code); data = r.json(); print('Body:', json.dumps(data, indent=2)); token = data.get('access_token',''); print('\n=== Testing Dashboard Stats ==='); r2 = httpx.get('http://localhost:8000/dashboard/stats', headers={'Authorization': f'Bearer {token}'}); print('Status:', r2.status_code); print('Body:', json.dumps(r2.json(), indent=2))"
echo.
echo === Done ===
