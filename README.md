# Analyze Aging: Thailand Elderly Health Surveillance & Clinical Dashboard
> ระบบสารสนเทศและแดชบอร์ดสุขภาพผู้สูงอายุไทย 9 ด้าน (MOPH HDC Data Surveillance & Clinical Insights)  
> ออกแบบภายใต้แนวคิด **Sunlit Editing Desk** ตามมาตรฐาน [DESIGN.md](DESIGN.md)

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-black?style=flat&logo=vercel)](https://analyze-aging-dashboard.vercel.app)
[![Live Demo](https://img.shields.io/badge/Live_Dashboard-analyze--aging--dashboard.vercel.app-00d0ff?style=flat)](https://analyze-aging-dashboard.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-ClangxCL%2Fanalyze--aging--dashboard-181717?style=flat&logo=github)](https://github.com/ClangxCL/analyze-aging-dashboard)

🌐 **Live Production URL:** [https://analyze-aging-dashboard.vercel.app](https://analyze-aging-dashboard.vercel.app)  
📦 **GitHub Repository:** [https://github.com/ClangxCL/analyze-aging-dashboard](https://github.com/ClangxCL/analyze-aging-dashboard)

---

## 🌟 จุดเด่นของระบบ (Key Features)

### 1. Dual-Mode Architecture (สถาปัตยกรรมทำงานได้ 2 รูปแบบ)
- **Zero-Dependency Direct Offline Mode**: หน้าเว็บ [frontend/index.html](frontend/index.html) ฝังชุดข้อมูลสำรองออฟไลน์ (Embedded Fallback Data Bundle) ขนาด 1.39 MB และแผนที่ประเทศไทย D3.js GeoJSON ครบ 77 จังหวัด **สามารถดับเบิลคลิกเปิดไฟล์ดูและเล่นตัวกรองได้ทันทีในเบราว์เซอร์ โดยไม่ต้องรันเซิร์ฟเวอร์หรือติดตั้งโปรแกรมใดๆ เพิ่มเติม**
- **Full-Stack Live API Mode**: เชื่อมต่อผ่าน FastAPI + SQLite (`aging_data.db`) พร้อมระบบตรวจสอบความสมบูรณ์ของข้อมูลย้อนหลัง 5 ปี (พ.ศ. 2565–2569) ผ่าน `run.bat`

### 2. โมดูลวิเคราะห์สุขภาพผู้สูงอายุ 6 มิติหลัก (6 Dedicated Health Modules)
1. **คัดกรอง 9 ด้าน & ศักยภาพ ADL (Barthel Index 3 ติด)**:
   - แถบวัดสัดส่วนศักยภาพตามเกณฑ์ Barthel Index: **ติดสังคม 95.8% (13.21M คน)**, **ติดบ้าน 3.1% (427k คน)**, **ติดเตียง 1.1% (151k คน)**
   - การ์ดจัดอันดับ 9 มิติสุขภาพ เรียงลำดับความเสี่ยงสูงสุดในประเทศ พร้อมแถบสีความรุนแรงและปุ่ม Active Focus
   - แผนที่ระบายสีเชิงพื้นที่ประเทศไทย D3.js Choropleth Map (77 จังหวัด 13 เขตสุขภาพ) พร้อมตารางจัดอันดับ Leaderboard
2. **โครงสร้างและสถานการณ์ประชากร 5 ปี (2565–2569)**:
   - กราฟแท่งคู่ผสมผสานจำนวนประชากรสูงวัย (14.96 ล้านคน) และสัดส่วนที่ก้าวสู่ Super-Aged Society (20.67%)
   - แผนภูมิโดนัทเจาะลึก 3 ช่วงวัย: วัยต้น (60-69 ปี: 54.7%), วัยกลาง (70-79 ปี: 31.4%), วัยปลาย (80+ ปี: 13.9%)
   - แถบสรุปดัชนีการสูงวัย (Aging Index, OADR, Potential Support Ratio 2.76:1)
3. **ความชุก 10 โรคเรื้อรังสำคัญ (NCDs) & Multimorbidity**:
   - ไฮไลต์ประเด็น **68.4% ของผู้สูงอายุมีโรคประจำตัวเรื้อรังตั้งแต่ 2 โรคขึ้นไป**
   - ปุ่มกรองหมวดหมู่โรค: ทั้งหมด (10 โรค), หัวใจและหลอดเลือด, กระดูกและข้อ, สมองและจิตใจ
   - ปุ่มสลับการจัดอันดับตามร้อยละความชุก (%) หรือจำนวนผู้ป่วยคาดการณ์จริง
   - การ์ดจุดเน้นการดูแลทางคลินิก (Clinical Focus) เชิงนโยบาย
4. **การเจ็บป่วย OPD & IPD ย้อนหลัง 5 ปี (2565–2569)**:
   - สลับมุมมองระหว่างผู้ป่วยนอก (OPD: 10 อันดับโรคตรวจรักษา) และผู้ป่วยใน (IPD: 10 อันดับการนอนโรงพยาบาล)
   - สลับการแสดงผลระหว่าง **จำนวนครั้ง/ราย (เปรียบเทียบแนวโน้ม 3 ปี 2565–2567)** และ **อัตราต่อแสนประชากรสูงอายุ**
   - ป้ายวิเคราะห์ความแตกต่างเชิงระบบ (System Contrast Callout) อธิบายความต่างระหว่างการคุมโรคระดับปฐมภูมิกับการนอน รพ.
5. **10 อันดับสาเหตุการเสียชีวิต (Mortality Causes)**:
   - แถบสถิติ Pareto Concentration: Top 4 สาเหตุ (มะเร็ง, หลอดเลือดสมอง, ปอดอักเสบ, หัวใจขาดเลือด) ครองสัดส่วนถึง 68.5% ของการเสียชีวิตทั้งหมด
   - กราฟแท่งแนวนอนแสดงจำนวนผู้เสียชีวิตจริงปี 2567 เทียบกับแผนภูมิโดนัทสัดส่วนร้อยละ
6. **ภาระโรคและการสูญเสียปีสุขภาวะ (DALYs & BOD Thailand)**:
   - ปุ่มสลับมุมมองระหว่าง **จำนวนปีรวม (DALYs)** และ **สัดส่วน 100% Normalized (YLL vs YLD)**
   - แสดงความแตกต่างระหว่างกลุ่มโรคคร่าชีวิตเฉียบพลัน (เช่น โรคหลอดเลือดสมอง: YLL 89.2%) กับโรคทุพพลภาพเรื้อรังยาวนาน (เช่น ข้อเข่าเสื่อม: YLD 100%, สมองเสื่อม: YLD 80%)

---

## 🎨 ระบบดีไซน์ (Design System)
ออกแบบตามมาตรฐาน [DESIGN.md](DESIGN.md) (*Captions — Sunlit editing desk*):
- **Floating Frosted Header**: แถบนำทางโปร่งแสงลอยตัว ขอบมนรัศมี 30px พร้อม Backdrop Blur 24px
- **Paper White Canvas (`#ffffff`)**: พื้นผิวสีขาวสว่าง พร้อมเส้นกริดไมโครสะอาดตา
- **Air Wash Surfaces (`#effbff`)**: พื้นผิวสีฟ้าอ่อนโปร่งแสงสำหรับส่วนเน้นและตัวกรอง
- **Mist Border (`#e8eff2`) & Steel Inset (`#d0d6d7`)**: ขอบมนและเส้นแบ่งความละเอียดสูง 0.5px
- **Prism Cyan (`#00d0ff`) & Charcoal (`#1d1f20`)**: คู่สีมินิมอลโมเดิร์น
- **Editorial Typography**: การจับคู่ฟอนต์ `Newsreader` (Display Headline) กับ `Plus Jakarta Sans`, `Prompt`, และ `Sarabun` (Interface & Body)

---

## 🚀 วิธีการติดตั้งและรันระบบ (Quick Start)

### วิธีที่ 1: เปิดใช้งานทันที (Offline / No Server Required)
เปิดไฟล์ผ่านเบราว์เซอร์ Google Chrome หรือ Microsoft Edge:
```
frontend/index.html
```

### วิธีที่ 2: รันผ่าน Local Server (FastAPI + Uvicorn)
1. **ติดตั้ง Dependencies** (หากยังไม่ได้ติดตั้ง):
   ```bash
   python -m venv .venv
   .\.venv\Scripts\pip install -r requirements.txt
   ```
2. **รันเซิร์ฟเวอร์**:
   - บน Windows: ดับเบิลคลิกไฟล์ `run.bat`
   - หรือรันผ่านคำสั่ง:
     ```bash
     .\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
     ```
3. **เข้าใช้งาน**:
   - แดชบอร์ดหลัก: [http://127.0.0.1:8000](http://127.0.0.1:8000)
   - เอกสาร Interactive API (Swagger): [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🧪 การทดสอบระบบ (Test Suite)
โปรเจกต์ผ่านการทดสอบอัตโนมัติ 100% ครบทั้ง 28 ชุดทดสอบ:
```bash
.\.venv\Scripts\pytest.exe -o pythonpath=. tests/ -v
```
- `tests/test_html_dom.py`: ตรวจสอบโครงสร้าง DOM, แท็บ, และคอมโพเนนต์
- `tests/test_aging_api.py`: ตรวจสอบความถูกต้องของ REST API Endpoints 15 จุด
- `tests/test_aging_db.py`: ตรวจสอบ Schema ฐานข้อมูลและ Audit Logging
- `tests/test_aging_e2e_playwright.py`: ทดสอบ E2E จำลองการคลิกสลับแท็บ แผนที่ กรองข้อมูล และจัดอันดับบนเบราว์เซอร์เสมือนจริง

---

## 📁 โครงสร้างโปรเจกต์ (Repository Structure)

```
.
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI Application Entrypoint
│   │   ├── config.py            # การตั้งค่าแอปพลิเคชัน
│   │   ├── database.py          # SQLAlchemy Session & Engine
│   │   ├── models.py            # โครงสร้างตารางฐานข้อมูลสุขภาพผู้สูงอายุ
│   │   ├── schemas.py           # Pydantic Validation Schemas
│   │   ├── seed_aging_data.py   # สคริปต์เพาะข้อมูลสุขภาพ 9 ด้าน 5 ปีย้อนหลัง
│   │   └── routers/
│   │       └── aging.py         # REST API Endpoints สำหรับข้อมูลสุขภาพ 6 มิติ
│   └── aging_data.db            # ฐานข้อมูล SQLite ข้อมูลสุขภาพผู้สูงอายุไทย
├── frontend/
│   ├── index.html               # หน้าแดชบอร์ดหลัก (Sunlit Editing Desk Design)
│   ├── aging_dashboard.html     # หน้าแดชบอร์ดสำรอง
│   ├── css/
│   │   └── style.css            # Token สไตล์และคลาสคอมโพเนนต์ตาม DESIGN.md
│   └── js/
│       ├── aging_app.js         # ลอจิกแอปพลิเคชันและ Chart.js / D3.js
│       └── aging_data_embedded.js # ชุดข้อมูลสำรองออฟไลน์ 1.39 MB (Offline Bundle)
├── tests/
│   ├── test_html_dom.py         # การทดสอบ DOM และ Assets
│   ├── test_aging_api.py        # การทดสอบ API Endpoints
│   ├── test_aging_db.py         # การทดสอบ Database Models
│   └── test_aging_e2e_playwright.py # การทดสอบ End-to-End ผ่าน Playwright
├── DESIGN.md                    # ข้อกำหนดระบบดีไซน์ต้นแบบ (Design System Specification)
├── run.bat                      # สคริปต์สำหรับรันเซิร์ฟเวอร์บน Windows
└── requirements.txt             # รายการ Python Libraries
```

---

## 📄 แหล่งข้อมูลอ้างอิง (Data Sources & Attribution)
- กระทรวงสาธารณสุข (MOPH HDC - Health Data Center): ระบบคลังข้อมูลสุขภาพ
- กรมการแพทย์ (DMS - Department of Medical Services)
- สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ
- โครงการประเมินภาระโรคแห่งประเทศไทย (BOD Thailand)
- สำนักงานสถิติแห่งชาติ และสำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ (สศช.)
