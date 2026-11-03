@echo off
echo =======================================================================
echo  Starting Analyze Aging: Thailand Elderly Health Interactive Dashboard
echo  Dashboard URL: http://127.0.0.1:8000
echo =======================================================================
.\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
