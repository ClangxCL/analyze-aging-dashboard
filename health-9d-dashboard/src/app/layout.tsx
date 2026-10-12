import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ระบบสารสนเทศวิเคราะห์สุขภาพผู้สูงอายุ 9 ด้าน 2569 | กระทรวงสาธารณสุข",
  description: "แดชบอร์ดข้อมูลคัดกรองสุขภาพผู้สูงอายุ 9 ด้าน ครอบคลุม 12 เขตสุขภาพ และ 76 จังหวัด พร้อมแผนที่ภูมิศาสตร์ ฮีทแมพ และการจัดอันดับ Top 1 - 9",
  keywords: ["ผู้สูงอายุ", "คัดกรองสุขภาพ 9 ด้าน", "เขตบริการสุขภาพ", "กระทรวงสาธารณสุข", "Health Dashboard", "Thailand Elderly Health"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
