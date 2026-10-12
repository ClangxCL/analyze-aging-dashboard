# ระบบสารสนเทศวิเคราะห์ข้อมูลคัดกรองสุขภาพผู้สูงอายุ 9 ด้าน (ปี 2569)
> Executive Analytics Dashboard for Thailand's 9-Dimension Elderly Health Screening (FY 2026)

แดชบอร์ดผู้บริหารกระทรวงสาธารณสุข ออกแบบตามแนวทาง **Calendly Design System (DESIGN.md)** สำหรับวิเคราะห์ข้อมูลคัดกรองสุขภาพผู้สูงอายุ 9 มิติ ครอบคลุม 12 เขตบริการสุขภาพ และ 76 จังหวัดทั่วประเทศไทย

---

## ฟีเจอร์หลัก (Key Features)

1. **Multi-Level Dynamic Filtering**: กรองข้อมูลได้ 3 ระดับพร้อมกัน
   - เขตบริการสุขภาพ (เขตสุขภาพที่ 1 ถึง 12)
   - จังหวัด (ครบทั้ง 76 จังหวัด)
   - ประเด็นสุขภาพ 9 ด้าน (การมองเห็น, ช่องปาก, เคลื่อนไหว, ADL, การได้ยิน, ความจำ, กลั้นปัสสาวะ, โภชนาการ, ซึมเศร้า 2Q)
2. **Top 1 – 9 Risk Rankings**: จัดอันดับประเด็นสุขภาพ 9 ด้าน เรียงตามร้อยละความเสี่ยง (`% เสี่ยง/ผิดปกติ`) อัปเดตแบบ Real-time ตามพื้นที่ที่เลือก
3. **Interactive Thailand Geographic Map**: แผนที่ภูมิศาสตร์เวกเตอร์ประเทศไทย (Choropleth Map) แสดงความเข้มข้นของปัญหา พร้อม Tooltip แสดงข้อมูลรายจังหวัด และคลิกเพื่อเจาะลึก
4. **Regional Heat Map (12 เขต × 9 ด้าน)**: เมทริกซ์เปรียบเทียบความเสี่ยงรายเขตสุขภาพแบบสองมิติ เพื่อชี้เป้าความเปราะบางเชิงระบบ
5. **Comprehensive Data Table**: ตารางข้อมูล 76 จังหวัด ค้นหาแบบทันที (Instant Search), จัดเรียงคอลัมน์ (Sort), แบ่งหน้า (Pagination), และส่งออกเป็นไฟล์ UTF-8 CSV (รองรับภาษาไทยใน Microsoft Excel)
6. **Executive Landing Page**: ออกแบบสไตล์ Calendly ตาม `DESIGN.md` (Ink Navy `#0b3558`, Signal Blue `#006bff`, Cloud `#f8f9fb`, Paper cards พร้อม 3-layer blue-tinted elevation)

---

## การติดตั้งและใช้งานบนเครื่อง (Local Run)

```bash
cd health-9d-dashboard
npm install
npm run dev
```
เปิดใช้งานที่: [http://localhost:3000](http://localhost:3000)

## การขึ้นระบบบน Vercel (Vercel Deployment)

ดูรายละเอียดฉบับเต็มได้ที่ [DEPLOYMENT.md](../DEPLOYMENT.md) หรือสั่งการ:
```bash
npx vercel
```
