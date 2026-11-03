@echo off
cd /d "%~dp0"
echo ===================================================================
echo Starting Thailand Elderly Health 9D Dashboard (Node.js Next.js)
echo ระบบสารสนเทศวิเคราะห์ข้อมูลสุขภาพผู้สูงอายุ (Triple-Window Executive Portal)
echo ===================================================================
echo.
echo [Window 1] ระบบคัดกรอง 9 ด้าน 76 จังหวัด (ปี 2569):
echo            http://localhost:3000
echo.
echo [Window 2] สถานการณ์สุขภาพและประชากร 5 ปี (รายงานและตาราง):
echo            http://localhost:3000/elderly-health-situation
echo.
echo [Window 3] ระบบแสดงภาพข้อมูลเชิงวิเคราะห์ (Analyze Aging Visualizer):
echo            http://localhost:3000/analyze-aging
echo.
echo ===================================================================
echo กด Ctrl+C เพื่อหยุดการทำงานของเซิร์ฟเวอร์
echo ===================================================================
echo.
echo กำลังเปิดเบราว์เซอร์อัตโนมัติ...
start "" powershell -NoProfile -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:3000/analyze-aging'"
npm run dev
pause
