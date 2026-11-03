'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/ui/Navbar';
import { ElderlySituationView } from '@/components/situation/ElderlySituationView';
import { ExternalLink } from 'lucide-react';

export default function ElderlyHealthSituationPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fb]">
      {/* Universal Navbar */}
      <Navbar
        currentWindow="situation-5y"
        onWindowChange={target => {
          if (target === 'screening-9d') {
            router.push('/');
          } else if (target === 'analyze-aging') {
            router.push('/analyze-aging');
          }
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-8">
        <ElderlySituationView />
      </main>

      {/* Footer in Calendly / Navy Style */}
      <footer className="bg-white border-t border-[#d4e0ed] mt-16 py-12">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-[#f0f3f8]">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#006bff] flex items-center justify-center text-white font-bold">
                  5Y
                </div>
                <span className="font-bold text-[#0b3558] text-base">
                  ระบบสารสนเทศสถานการณ์สุขภาพและประชากรผู้สูงอายุไทย (2565–2569)
                </span>
              </div>
              <p className="text-xs text-[#476788] max-w-sm leading-relaxed">
                การสังเคราะห์ข้อมูลระบาดวิทยา ประชากรศาสตร์จากมิเตอร์ประเทศไทย (ม.มหิดล) ผลการคัดกรองสุขภาพ 9 ด้าน ความชุกโรค NCDs 
                แนวโน้มอัตราป่วย-ตาย 10 อันดับแรก และภาระโรค (DALYs) เพื่อสนับสนุนนโยบายสาธารณสุขไทย
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#476788] mb-3">
                มิติการวิเคราะห์ 8 ด้าน
              </h4>
              <ul className="space-y-1.5 text-xs text-[#0b3558]">
                <li>1. ประชากร & มิเตอร์ประเทศไทย 5 ปี</li>
                <li>2. คัดกรอง 9 ด้าน (HDC vs DMS)</li>
                <li>3. ความชุกโรคเรื้อรัง (NCDs)</li>
                <li>4. แนวโน้มอัตราป่วย Top 10 (OPD/IPD)</li>
                <li>5. แนวโน้มอัตราตาย Top 10</li>
                <li>6. ภาระโรค DALYs / YLL / YLD</li>
                <li>7. เครื่องคิดเลขสด & ระเบียบวิธีวิจัย</li>
                <li>8. บรรณานุกรม APA 13 รายการ</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#476788] mb-3">
                แหล่งข้อมูลและการเผยแพร่
              </h4>
              <ul className="space-y-1.5 text-xs text-[#0b3558]">
                <li>สถาบันวิจัยประชากรและสังคม ม.มหิดล (มิเตอร์ประเทศไทย)</li>
                <li>ระบบคลังข้อมูลด้านการแพทย์และสุขภาพ (HDC)</li>
                <li>กองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข</li>
                <li>โครงการประเมินภาระโรคแห่งประเทศไทย (BOD Thailand)</li>
                <li className="flex items-center gap-1 text-[#006bff] font-medium pt-1">
                  <span>พร้อมใช้งานบน Vercel</span>
                  <ExternalLink className="w-3 h-3" />
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#476788]">
            <div>
              วิเคราะห์และสังเคราะห์ข้อมูลโดย สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ กรมการแพทย์ กระทรวงสาธารณสุข
            </div>
            <div className="flex items-center gap-4">
              <span>Theme: Institutional Navy Marble</span>
              <span>Next.js 16 & React 19</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
