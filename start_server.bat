@echo off
cd /d "%~dp0"
echo ===================================================================
echo Analyze Aging: ระบบสารสนเทศและแดชบอร์ดสุขภาพผู้สูงอายุไทย (MOPH HDC)
echo Closed-Loop Data Engineering & 9-Domain Epidemiological Surveillance
echo ===================================================================
echo.
echo Interactive Dashboard: http://localhost:8000
echo Swagger API Docs:      http://localhost:8000/docs
echo.
echo ===================================================================
echo.

if exist ".\.venv\Scripts\python.exe" (
    ".\.venv\Scripts\python.exe" -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
) else (
    python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
)
pause
