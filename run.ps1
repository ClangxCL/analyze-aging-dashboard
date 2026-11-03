Write-Host "=======================================================================" -ForegroundColor Cyan
Write-Host " Starting Analyze Aging: Thailand Elderly Health Interactive Dashboard" -ForegroundColor Green
Write-Host " Dashboard URL: http://127.0.0.1:8000" -ForegroundColor Yellow
Write-Host "=======================================================================" -ForegroundColor Cyan
& .\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
