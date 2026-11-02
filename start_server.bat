@echo off
cd /d "%~dp0"
echo ========================================================
echo Starting ElderHealth Forum 2026 Web Application
echo The 6th Thailand National Elderly Health Forum 2026
echo ========================================================
echo.
echo Server starting at: http://localhost:8000
echo Admin Portal at:   http://localhost:8000/admin.html
echo Admin Login:       admin / forum2026
echo ========================================================
echo.

if exist ".\.venv\Scripts\python.exe" (
    ".\.venv\Scripts\python.exe" -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
) else (
    python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
)
pause
