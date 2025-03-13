'use client';

import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Bell, Mail, PiggyBank, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from 'react';
import LoginModal from '@/components/LoginModal';
import RegisterModal from '@/components/RegisterModal';
import DesktopNavbar from '@/components/navbar/DesktopNavbar';
import MobileNavbar from '@/components/navbar/MobileNavbar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function Landing() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleSwitchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <>
      <DesktopNavbar />
      <MobileNavbar />
      <div className="absolute inset-0 inline-flex justify-center items-center bg-[#f0f0f0]">
        <div className="flex justify-center items-center">
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="relative w-[40vmin] h-[40vmin] bg-[#ff4bf4]/80 rounded-[100%] blur-[50px] sm:blur-[150px] animate-[one_90s_infinite]"></div>
          </div>

          <div className="absolute inset-0 flex justify-center items-center">
            <div className="relative w-[40vmin] h-[40vmin] bg-[#21e6ec]/80 rounded-[100%] blur-[50px] sm:blur-[150px] animate-[two_90s_infinite]"></div>
          </div>

          <div className="absolute inset-0 flex justify-center items-center">
            <div className="relative w-[40vmin] h-[40vmin] bg-[#4af04f]/80 rounded-[100%] blur-[50px] sm:blur-[150px] animate-[three_90s_infinite]"></div>
          </div>
        </div>
      </div>

      <div className="flex flex-col min-h-screen ">

        <div className="flex-1">

          <section className="relative pt-20 md:pt-48 pb-16 md:pb-24">
            <div className=" flex flex-col items-center text-center">
              <div className=" absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              <div className="space-y-4 max-w-3xl">
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#2F584F]">
                  จัดการค่าใช้จ่ายของคุณ<span className=" text-[#2F584F]"> อัตโนมัติ</span> จากอีเมลใบเสร็จ
                </h1>
                <p className="text-xl text-[#748F89] mb-8">
                  ระบบอัจฉริยะที่ดึงข้อมูลค่าใช้จ่ายจากอีเมล จัดหมวดหมู่ ติดตามงบประมาณ และแจ้งเตือนเมื่อใกล้ถึงขีดจำกัด
                </p>
                
              </div>

              {/* Dashboard Preview Image */}
              <div className="mt-16 relative w-full max-w-5xl">
                <div className="rounded-xl overflow-hidden border shadow-2xl">
                  <Image
                    src="/dashboard-preview.png"
                    alt="Dashboard Preview"
                    width={1200}
                    height={675}
                    className="w-full h-auto"
                    priority
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='675' viewBox='0 0 1200 675'%3E%3Crect width='1200' height='675' fill='%231a1a1a'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='48' fill='white'%3EBudget Tracking Dashboard%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 -z-10 h-full w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 opacity-20 blur-2xl"></div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 bg-slate-50 dark:bg-slate-900/50 mt-40">
            <div className="container mx-auto"> 
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl text-[#2F584F] font-bold mb-4">คุณสมบัติเด่น</h2>
                <p className="text-xl text-[#748F89] max-w-2xl mx-auto">
                  ระบบติดตามค่าใช้จ่ายอัจฉริยะที่ช่วยให้คุณประหยัดเวลาและจัดการการเงินได้อย่างมีประสิทธิภาพ
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="bg-background rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl text-[#2F584F] font-semibold mb-2">ดึงข้อมูลจากอีเมลอัตโนมัติ</h3>
                  <p className="text-muted-foreground">
                    ระบบใช้ IMAP ดึงข้อมูลจากอีเมลใบเสร็จการชำระเงิน เช่น Netflix, ช้อปปี้ และอื่นๆ โดยอัตโนมัติ
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-background rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[#2F584F] ">จัดหมวดหมู่ค่าใช้จ่ายอัตโนมัติ</h3>
                  <p className="text-muted-foreground">
                    ระบบจัดหมวดหมู่ค่าใช้จ่ายอัตโนมัติ ทำให้คุณเห็นภาพรวมว่าใช้จ่ายไปในด้านใดบ้าง
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-background rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <PiggyBank className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[#2F584F] ">ติดตามงบประมาณ</h3>
                  <p className="text-muted-foreground">
                    ตั้งงบประมาณสำหรับแต่ละหมวดหมู่ และติดตามการใช้จ่ายเทียบกับงบที่ตั้งไว้
                  </p>
                </div>

                {/* Feature 4 */}
                <div className="bg-background rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[#2F584F] ">รายงานข้อมูลเชิงลึก</h3>
                  <p className="text-muted-foreground">
                    ดูรายงานข้อมูลเชิงลึกเกี่ยวกับรูปแบบการใช้จ่ายของคุณ แนวโน้ม
                  </p>
                </div>

                {/* Feature 5 */}
                <div className="bg-background rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-[#2F584F] ">ความปลอดภัยสูงสุด</h3>
                  <p className="text-muted-foreground">
                    ข้อมูลทั้งหมดถูกเข้ารหัสและปลอดภัย ไม่มีการเข้าถึงข้อมูลส่วนตัวอื่นๆ ในอีเมลของคุณ
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" className="py-20">
            <div className="container mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#2F584F] ">วิธีการทำงาน</h2>
                <p className="text-xl text-[#748F89] max-w-2xl mx-auto">
                  เพียงไม่กี่ขั้นตอนง่ายๆ ก็สามารถติดตามค่าใช้จ่ายได้อย่างอัตโนมัติ
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {/* Step line connector (desktop) */}
                <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-muted" />

                {/* Step 1 */}
                <div className="relative">
                  <div className="bg-background rounded-xl p-6 border shadow-sm text-center relative z-10">
                    <div className="h-12 w-12 rounded-full bg-[#2F584F] flex items-center justify-center mb-6 mx-auto text-white font-bold">
                      1
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-[#2F584F]">เชื่อมต่ออีเมล</h3>
                    <p className="text-muted-foreground">
                      เชื่อมต่อบัญชีอีเมลที่คุณได้รับใบเสร็จค่าใช้จ่าย เช่น Gmail หรืออีเมลอื่นๆ ที่รองรับ IMAP
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="bg-background rounded-xl p-6 border shadow-sm text-center relative z-10">
                    <div className="h-12 w-12 rounded-full bg-[#2F584F] flex items-center justify-center mb-6 mx-auto text-white font-bold">
                      2
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-[#2F584F]">กำหนดกฎการดึงข้อมูล</h3>
                    <p className="text-muted-foreground">
                      เลือกประเภทใบเสร็จที่ต้องการให้ระบบติดตาม เช่น Netflix, สาธารณูปโภค, ช้อปปิ้งออนไลน์
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="bg-background rounded-xl p-6 border shadow-sm text-center relative z-10">
                    <div className="h-12 w-12 rounded-full bg-[#2F584F] flex items-center justify-center mb-6 mx-auto text-white font-bold">
                      3
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-[#2F584F]">รับรายงาน</h3>
                    <p className="text-muted-foreground">
                      รับรายงานสรุปค่าใช้จ่าย และข้อมูลเชิงลึกอื่นๆ เพื่อปรับปรุงพฤติกรรมการใช้จ่าย
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </>
  );
}