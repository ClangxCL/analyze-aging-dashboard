'use client';

import React from 'react';
import { ArrowRight, BarChart3, ShieldCheck, Users, Eye, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { PillBadge } from '../ui/PillBadge';
import { formatNumber, formatPercent } from '@/lib/analytics';
import { NationalData } from '@/types/health';

interface LandingHeroProps {
  national: NationalData;
  onExploreDashboard: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  national,
  onExploreDashboard
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-[#f8f9fb] via-[#ffffff] to-[#f8f9fb]">
      {/* Decorative ambient blobs from DESIGN.md (Coral Magenta + Sky Cyan) */}
      <div
        className="absolute top-12 left-1/2 -translate-x-[65%] w-[420px] h-[420px] rounded-full blur-[110px] opacity-25 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, #e55cff 0%, #0099ff 100%)' }}
      />
      <div
        className="absolute top-36 right-[-80px] w-[350px] h-[350px] rounded-full blur-[90px] opacity-20 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, #006bff 0%, #0099ff 100%)' }}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 relative z-10">
        {/* Top badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#d4e0ed] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#006bff] animate-pulse" />
            <span className="text-xs font-semibold text-[#0b3558]">
              ระบบข้อมูลคัดกรองสุขภาพผู้สูงอายุ 9 ด้าน ปีงบประมาณ 2569
            </span>
            <PillBadge variant="signal">76 จังหวัด</PillBadge>
          </div>
        </div>

        {/* Hero Headlines */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0b3558] tracking-tight leading-[1.15] mb-6">
            เข้าใจความเปราะบางผู้สูงวัย{' '}
            <span className="text-[#006bff]">ชี้เป้าความเสี่ยง 9 มิติ</span>{' '}
            แม่นยำทุกเขตสุขภาพ
          </h1>
          <p className="text-lg sm:text-xl text-[#476788] leading-relaxed max-w-2xl mx-auto">
            แดชบอร์ดผู้บริหารกระทรวงสาธารณสุข ยกระดับข้อมูลคัดกรองสู่การตัดสินใจเชิงนโยบาย
            ด้วยแผนที่ภูมิศาสตร์ความเสี่ยง ฮีทแมพเปรียบเทียบรายเขต และการจัดอันดับ Top 1 - 9
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14">
          <Button
            size="lg"
            variant="primary"
            onClick={onExploreDashboard}
            className="w-full sm:w-auto shadow-lg shadow-[#006bff]/20"
          >
            เข้าสู่แดชบอร์ดวิเคราะห์ข้อมูล
            <ArrowRight className="w-5 h-5 ml-1" />
          </Button>
          <a
            href="#data-table"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-[8px] text-[18px] font-semibold text-[#0b3558] bg-white border border-[#d4e0ed] hover:bg-[#f0f3f8] transition-all"
          >
            ดูตารางข้อมูลดิบ 76 จังหวัด
          </a>
        </div>

        {/* Executive Summary Metric Band */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-[18px] p-5 border border-[#d4e0ed] card-elevation-sm">
            <div className="flex items-center gap-2 text-[#476788] text-xs font-medium mb-1">
              <Users className="w-4 h-4 text-[#006bff]" />
              ผู้สูงอายุได้รับการคัดกรอง
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0b3558]">
              {formatNumber(national.totalScreened)}
            </div>
            <div className="text-[11px] text-[#476788] mt-1">
              คนทั่วประเทศ (12 เขตสุขภาพ)
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-[18px] p-5 border border-[#d4e0ed] card-elevation-sm">
            <div className="flex items-center gap-2 text-[#476788] text-xs font-medium mb-1">
              <ShieldCheck className="w-4 h-4 text-[#1b7a42]" />
              คัดกรองครบทั้ง 9 ด้าน
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0b3558]">
              {formatPercent(national.pctScreened9d)}
            </div>
            <div className="text-[11px] text-[#476788] mt-1">
              {formatNumber(national.screened9d)} คนที่มีข้อมูลสมบูรณ์
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-[18px] p-5 border border-[#d4e0ed] card-elevation-sm">
            <div className="flex items-center gap-2 text-[#476788] text-xs font-medium mb-1">
              <Eye className="w-4 h-4 text-[#006bff]" />
              ความเสี่ยงสูงสุดอันดับ 1
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0b3558]">
              {national.rankedDimensions[0]?.name || 'การมองเห็น'}
            </div>
            <div className="text-[11px] text-[#006bff] font-semibold mt-1">
              ร้อยละเสี่ยง {formatPercent(national.rankedDimensions[0]?.riskPct)}
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-[18px] p-5 border border-[#d4e0ed] card-elevation-sm">
            <div className="flex items-center gap-2 text-[#476788] text-xs font-medium mb-1">
              <BarChart3 className="w-4 h-4 text-[#b86200]" />
              ความเสี่ยงอันดับ 2 & 3
            </div>
            <div className="text-lg sm:text-xl font-bold text-[#0b3558] truncate">
              {national.rankedDimensions[1]?.shortName} ({formatPercent(national.rankedDimensions[1]?.riskPct)})
            </div>
            <div className="text-[11px] text-[#476788] mt-1 truncate">
              และ {national.rankedDimensions[2]?.shortName} ({formatPercent(national.rankedDimensions[2]?.riskPct)})
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
