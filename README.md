# ElderHealth Forum 2026 (มหกรรมสุขภาพผู้สูงอายุแห่งชาติ ครั้งที่ 6)

ระบบเว็บแอปพลิเคชันสำหรับงาน **“การประชุมวิชาการ เวชศาสตร์และวิทยาการด้านผู้สูงอายุ” มหกรรมสุขภาพผู้สูงอายุแห่งชาติ ครั้งที่ 6 (The 6th Thailand National Elderly Health Forum 2026)**
จัดโดย **สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ กรมการแพทย์ กระทรวงสาธารณสุข**

---

## สถาปัตยกรรมและเทคโนโลยีที่ใช้ (Tech Stack)

### Frontend
- **Design System:** สไตล์ **Atelier AI Warm Linen Paper** โทนกระดาษอบอุ่น (`--paper: #f5f0e9`, `--ink: #171411`, `--panel: #eee5da`, `--taupe: #a67b4f`) คมชัด สบายตา ไม่ฉูดฉาด
- **Universal Accessibility (WCAG 2.1 AA):** แถบปรับขนาดตัวอักษร 3 ระดับ (A / A+ / A++), ปุ่มโหมดสีคอนทราสต์สูง (High Contrast Mode)
- **Voice Assistance (Speech-to-Text & Text-to-Speech):** รองรับการพูดด้วยเสียงภาษาไทยแทนการพิมพ์ สำหรับผู้สูงอายุ และปุ่มอ่านสรุปข้อมูลด้วยเสียง
- **Event Countdown:** ระบบนับถอยหลังสู่วันเปิดงานแบบเรียลไทม์ 4 ช่อง (วัน, ชั่วโมง, นาที, วินาที)
- **3-Track Registration System:**
  - **Track 1.1:** ประชาชนทั่วไปและผู้สูงอายุ (Universal Design พร้อมระบบสั่งพิมพ์ด้วยเสียง)
  - **Track 1.2:** บุคลากรทางการแพทย์และสาธารณสุข (รองรับเขตสุขภาพ 1 - 12 และเลขขอหน่วยกิต CME, CNEU, อื่นๆ)
  - **Track 1.3:** ASEAN Member States (English registration form & Hotel Accommodation booking notice)
- **Verification Spotlight:** ด็อกค้นหาและตรวจสอบสถานะการลงทะเบียนทันที
- **A4 Vertical Schedule Slider:** กำหนดการงานแนวตั้งขนาด A4 รองรับ Touch Swipe บนมือถือ/ไอแพด พร้อมระบบ Lightbox แตะดูภาพขนาดเต็ม
- **Document Center:** ระบบดาวน์โหลดเอกสารวิชาการและใบจองห้องพักโรงแรม

### Backend
- **Framework:** Python 3.12 + FastAPI (Asynchronous REST API)
- **Database ORM:** SQLAlchemy พร้อมระบบจำลองฐานข้อมูล SQLite (`forum2026.db`) รองรับ PostgreSQL ในระดับ Production
- **Data Deduplication:** ตรวจสอบและป้องกันการลงทะเบียนซ้ำซ้อนระดับชื่อ-นามสกุลแบบ Real-time (Atomic UPSERT)
- **Admin Management & Excel Export:** แดชบอร์ดสรุปสถิติผู้เข้าร่วมงานแยกตามเขตสุขภาพและจังหวัด พร้อมดาวน์โหลดรายงานเป็นไฟล์ Excel (`.xlsx`)
- **Audit Logging:** บันทึกประวัติการแก้ไขและส่งออกข้อมูลเพื่อความปลอดภัย

---

## โครงสร้างโปรเจกต์ (Project Structure)

```
.
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI Application Entrypoint & Startup Hook
│   │   ├── config.py            # การตั้งค่าแอปพลิเคชันและไดเรกทอรี
│   │   ├── database.py          # SQLAlchemy Session & Engine
│   │   ├── models.py            # โครงสร้างตารางฐานข้อมูล (Public, Medical, ASEAN, Audit, Documents)
│   │   ├── schemas.py           # Pydantic Schemas สำหรับ Validation
│   │   ├── seed_data.py         # ข้อมูลตั้งต้นและเอกสารดาวน์โหลดจำลอง
│   │   ├── services/
│   │   │   └── deduplication.py # ตรรกะป้องกันการลงทะเบียนซ้ำ
│   │   └── routers/
│   │       ├── registration.py  # API รับสมัครและค้นหาสถานะ
│   │       ├── content.py       # API กำหนดการและเอกสารดาวน์โหลด
│   │       └── admin.py         # API ระบบผู้ดูแลระบบและส่งออก Excel
├── frontend/
│   ├── index.html               # หน้าหลัก Landing Page สไตล์ Atelier AI
│   ├── admin.html               # หน้า Backoffice สำหรับผู้ดูแลระบบ
│   ├── css/
│   │   └── style.css            # สไตล์ชีท Atelier AI Design Tokens & Accessibility
│   ├── js/
│   │   ├── app.js               # ตรรกะหน้าเว็บ เสียงพูด การเลื่อนสไลด์ A4 และการส่งฟอร์ม
│   │   └── thai_address_data.js # ฐานข้อมูลภูมิศาสตร์ไทย (77 จังหวัด, อำเภอ, ตำบล, เขตสุขภาพ 1-12)
│   └── assets/                  # ภาพแบนเนอร์ทางการ 1920x1080 และภาพกำหนดการ A4
├── tests/
│   ├── test_backend_unit.py     # ชุดทดสอบ Backend API, Deduplication และ Excel Export
│   └── test_html_dom.py         # ชุดทดสอบโครงสร้าง HTML DOM และ A11y Standards
├── requirements.txt             # รายการแพ็กเกจ Python
├── run_app.py                   # สคริปต์รันเซิร์ฟเวอร์แบบด่วน
└── start_server.bat             # ไฟล์ Batch สำหรับรันเซิร์ฟเวอร์บน Windows
```

---

## วิธีการติดตั้งและรันระบบ (Quickstart)

### 1. ติดตั้ง Dependencies
```bash
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

### 2. เริ่มต้นรันเซิร์ฟเวอร์
```bash
python run_app.py
```
หรือรันผ่าน Uvicorn โดยตรง:
```bash
uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

- เข้าใช้งานหน้าเว็บหลัก: [http://127.0.0.1:8000](http://127.0.0.1:8000)
- เข้าใช้งานระบบผู้ดูแลระบบ (Admin): [http://127.0.0.1:8000/admin.html](http://127.0.0.1:8000/admin.html)
- ดูคู่มือ Swagger API: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 3. การรันชุดทดสอบ (Automated Tests)
```bash
pytest
```

---

## ผู้พัฒนาและลิขสิทธิ์
- สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ กรมการแพทย์ กระทรวงสาธารณสุข
- © 2026 ElderHealth Forum Project. All rights reserved.
