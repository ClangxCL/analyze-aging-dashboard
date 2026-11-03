@echo off
cd /d "%~dp0health-9d-dashboard"
echo ===================================================================
echo Starting Thailand Elderly Health 9D Dashboard (Node.js Next.js)
echo ระบบสารสนเทศวิเคราะห์ข้อมูลสุขภาพและแสดงภาพข้อมูลผู้สูงอายุไทย
echo ===================================================================
echo.
echo [Window 1] ระบบคัดกรอง 9 ด้าน 76 จังหวัด:
echo            http://localhost:3000
echo.
echo [Window 2] ตารางสถานการณ์สุขภาพและประชากร 5 ปี (2565-2569):
echo            http://localhost:3000/elderly-health-situation
echo.
echo [Window 3] แสดงภาพข้อมูลเชิงวิเคราะห์ (Interactive Visualizations):
echo            http://localhost:3000/analyze-aging
echo.
echo ===================================================================
echo กำลังเริ่มเซิร์ฟเวอร์... (กรุณารอประมาณ 5-10 วินาทีจนขึ้น Ready)
echo กด Ctrl+C เพื่อหยุดการทำงาน
echo ===================================================================
echo.
npm run dev
pause