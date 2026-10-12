# คู่มือการติดตั้งและ Deploy สู่ Vercel (Deployment Guide)

ระบบสารสนเทศวิเคราะห์สุขภาพผู้สูงอายุ 9 ด้าน ประจำปีงบประมาณ 2569 ถูกพัฒนาด้วย Next.js (App Router), TypeScript, และ Tailwind CSS พร้อมรองรับการ Deploy สู่ [Vercel](https://vercel.com/) ได้ทันทีแบบ Zero-Config

---

## วิธีที่ 1: Deploy ผ่าน Vercel CLI (รวดเร็วที่สุด)

1. เปิด Terminal ในโฟลเดอร์โครงการ `health-9d-dashboard`:
   ```bash
   cd health-9d-dashboard
   ```
2. รันคำสั่ง deploy ผ่าน Vercel:
   ```bash
   npx vercel
   ```
3. เมื่อตรวจสอบ Preview URL เรียบร้อยแล้ว รันคำสั่งขึ้น Production:
   ```bash
   npx vercel --prod
   ```

---

## วิธีที่ 2: Deploy ผ่าน GitHub / GitLab / Bitbucket

1. Push โค้ดขึ้น Git Repository
2. เข้าสู่แดชบอร์ด [Vercel.com](https://vercel.com/) และคลิก **"Add New..." → "Project"**
3. เลือก Repository ที่ต้องการ
4. ในส่วนการตั้งค่าโปรเจกต์ (**Project Settings**):
   - **Root Directory**: ให้คลิก Edit แล้วเลือกโฟลเดอร์ `health-9d-dashboard`
   - **Framework Preset**: Next.js (ระบบจะตรวจพบอัตโนมัติ)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
5. คลิกปุ่ม **"Deploy"** — ระบบจะ Build และเปิดใช้งาน Domain ทันทีภายใน 1-2 นาที

---

## การทดสอบระบบในเครื่อง (Local Development)

```bash
cd health-9d-dashboard
npm run dev
```
เปิดบราวเซอร์ที่: [http://localhost:3000](http://localhost:3000)

## การตรวจสอบความพร้อมสำหรับ Production (Build Verification)

```bash
cd health-9d-dashboard
npm run build
```
ผลลัพธ์จะสร้าง Static Pages ครบ 100% พร้อมแคชข้อมูลขนาดเล็ก โหลดรวดเร็วระดับ Sub-second บน Vercel Edge Network
