import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ระบบสารสนเทศวิเคราะห์สุขภาพผู้สูงอายุ 9 ด้าน 2569 | กรมการแพทย์ HDC",
  description: "แดชบอร์ดข้อมูลคัดกรองสุขภาพผู้สูงอายุ 9 ด้าน จัดทำโดยกลุ่มงานสารสนเทศระบบสุขภาพด้านผู้สูงอายุ สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ กรมการแพทย์ กระทรวงสาธารณสุข ข้อมูล HDC 76 จังหวัด",
  keywords: ["ผู้สูงอายุ", "คัดกรองสุขภาพ 9 ด้าน", "เขตบริการสุขภาพ", "กรมการแพทย์", "HDC", "สถาบันเวชศาสตร์ผู้สูงอายุ", "Health Dashboard"]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="h-full antialiased scroll-smooth" suppressHydrationWarning>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>{children}</body>
    </html>
  );
}
