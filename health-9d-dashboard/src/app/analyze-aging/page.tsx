'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { AnalyzeAgingDashboard } from '@/components/analytics/AnalyzeAgingDashboard';

export default function AnalyzeAgingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fb]">
      {/* Universal Navbar */}
      <Navbar
        currentWindow="analyze-aging"
        onWindowChange={target => {
          if (target === 'screening-9d') {
            router.push('/');
          } else if (target === 'situation-5y') {
            router.push('/elderly-health-situation');
          }
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-8">
        <AnalyzeAgingDashboard />
      </main>

      {/* Footer in Calendly / Navy Style */}
      <footer className="bg-white border-t border-[#d4e0ed] mt-16 py-12">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-[#f0f3f8]">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#006bff] flex items-center justify-center text-white font-bold text-xs">
                  VIZ
                </div>
                <span className="font-bold text-[#0b3558] text-base">
                  Analyze Aging Visualizer • ระบบสารสนเทศและแสดงภาพข้อมูลผู้สูงอายุไทย (2565–2569)
                </span>
              </div>
              <p className="text-xs text-[#476788] max-w-sm leading-relaxed">
                การสังเคราะห์ข้อมูลระบาดวิทยา ประชากรศาสตร์จากมิเตอร์ประเทศไทย (ม.มหิดล IPSR) ผลการคัดกรองสุขภาพ 9 ด้าน ความชุกโรค NCDs 
                แนวโน้มอัตราป่วย-ตาย 10 อันดับแรก และภาระโรค (DALYs) เพื่อสนับสนุนนโยบายสาธารณสุขไทย
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#476788] mb-3">
                หมวดหมู่การวิเคราะห์
              </h4>
              <ul className="space-y-2 text-xs text-[#0b3558]">
                <li>• โครงสร้างประชากร & Super-Aged</li>
                <li>• ศักยภาพ ADL (ติดสังคม/บ้าน/เตียง)</li>
                <li>• ผลคัดกรอง HDC vs DMS Care Tools</li>
                <li>• ความชุกโรคไม่ติดต่อเรื้อรัง (NCDs)</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#476788] mb-3">
                สถิติทางคลินิก & ภาระโรค
              </h4>
              <ul className="space-y-2 text-xs text-[#0b3558]">
                <li>• สถิติผู้ป่วยนอก (OPD) 10 อันดับ</li>
                <li>• สถิติผู้ป่วยใน (IPD) 10 อันดับ</li>
                <li>• สาเหตุการเสียชีวิต 10 อันดับ</li>
                <li>• ภาระโรค DALYs (YLL vs YLD)</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#476788] gap-4">
            <p>
              © 2569 กรมการแพทย์ กระทรวงสาธารณสุข ร่วมกับ สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ
            </p>
            <div className="flex items-center gap-4">
              <span>ข้อมูลอ้างอิง: HDC, กรมการปกครอง, สวรส., ม.มหิดล IPSR, BOD Thailand</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
