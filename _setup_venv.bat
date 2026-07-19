@echo off
cd /D "d:\INTERNSHIP\AICTE AI internship\AI-CareerOS"
echo [1/3] Recreating .venv with Python 3.11 ...
python -m venv .venv --clear
echo [2/3] Installing requirements ...
.venv\Scripts\python.exe -m pip install --upgrade pip
.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
echo [3/3] Done!
