import type { Metadata } from "next";
import "./globals.css";
import { Kanit as KanitFont } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Savvy - ระบบจัดการค่าใช้จ่ายอัตโนมัติจากอีเมลใบเสร็จ",
  description: "ระบบอัจฉริยะที่ดึงข้อมูลค่าใช้จ่ายจากอีเมล จัดหมวดหมู่ ติดตามงบประมาณ และแจ้งเตือนเมื่อใกล้ถึงขีดจำกัด",
};

const kanit = KanitFont({
  subsets: ["latin", "thai"],
  weight: "400",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${kanit.className}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}