'use client';

import React, { useState } from 'react';
import {
  Users,
  Activity,
  HeartPulse,
  TrendingUp,
  Skull,
  Scale,
  Database,
  Layers,
  BarChart3,
  Download,
  Printer,
  ExternalLink
} from 'lucide-react';
import { AgingKpiCards } from './AgingKpiCards';
import { DemographicsSection } from './DemographicsSection';
import { FunctionalADLSection } from './FunctionalADLSection';
import { ScreeningComparisonSection } from './ScreeningComparisonSection';
import { ChronicNCDSection } from './ChronicNCDSection';
import { MorbiditySection } from './MorbiditySection';
import { MortalitySection } from './MortalitySection';
import { BurdenOfDiseaseSection } from './BurdenOfDiseaseSection';
import { ComprehensiveExplorer } from './ComprehensiveExplorer';

export const AnalyzeAgingDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'demographics' | 'functional' | 'screening' | 'ncd' | 'morbidity' | 'mortality' | 'bod' | 'explorer'
  >('demographics');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#0b3558] via-[#0f4471] to-[#006bff] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-200 border border-sky-400/30">
                หน้าต่าง 3 • Analyze Aging Visualizer
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
                ฐานข้อมูล 5 ปี (2565–2569)
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Interactive Charts & Visualizations
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              ระบบแสดงภาพข้อมูลเชิงวิเคราะห์ประชากรและสุขภาพผู้สูงอายุไทย
            </h1>
            <p className="text-sm text-slate-200 leading-relaxed">
              การสังเคราะห์และแสดงภาพข้อมูล (Data Visualization) จากชุดข้อมูล Analyze Aging ครอบคลุม 8 มิติสำคัญ: 
              โครงสร้างประชากร, ศักยภาพ ADL, ผลคัดกรอง HDC vs DMS, โรคเรื้อรัง NCDs, อัตราป่วย OPD/IPD, อัตราตาย, ภาระโรค DALYs และชุดข้อมูล 209 ตัวชี้วัด
            </p>
          </div>

          <div className="flex flex-wrap lg:flex-col items-stretch gap-3 shrink-0">
            <a
              href="/Elderly_Thailand_Health_Report_2565_2569.docx"
              download="Elderly_Thailand_Health_Report_2565_2569.docx"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all border border-emerald-400"
            >
              <Download className="w-4 h-4" />
              <span>ดาวน์โหลดรายงาน .docx (61.8 KB)</span>
            </a>
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>พิมพ์หน้านี้ / บันทึก PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Executive KPI Summary */}
      <AgingKpiCards />

      {/* 3. Sticky Tab Navigation Bar */}
      <div className="bg-white rounded-2xl p-2 border border-[#d4e0ed] shadow-sm sticky top-16 z-30">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => setActiveTab('demographics')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'demographics'
                ? 'bg-[#0b3558] text-white shadow-md'
                : 'text-[#476788] hover:text-[#0b3558] hover:bg-[#f0f3f8]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>1. ประชากร & สูงวัย</span>
          </button>

          <button
            onClick={() => setActiveTab('functional')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'functional'
                ? 'bg-[#0b3558] text-white shadow-md'
                : 'text-[#476788] hover:text-[#0b3558] hover:bg-[#f0f3f8]'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>2. ศักยภาพ ADL & 9 มิติ</span>
          </button>

          <button
            onClick={() => setActiveTab('screening')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'screening'
                ? 'bg-[#0b3558] text-white shadow-md'
                : 'text-[#476788] hover:text-[#0b3558] hover:bg-[#f0f3f8]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3. คัดกรอง HDC vs DMS</span>
          </button>

          <button
            onClick={() => setActiveTab('ncd')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'ncd'
                ? 'bg-[#0b3558] text-white shadow-md'
                : 'text-[#476788] hover:text-[#0b3558] hover:bg-[#f0f3f8]'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>4. โรคเรื้อรัง NCDs</span>
          </button>

          <button
            onClick={() => setActiveTab('morbidity')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'morbidity'
                ? 'bg-[#0b3558] text-white shadow-md'
                : 'text-[#476788] hover:text-[#0b3558] hover:bg-[#f0f3f8]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>5. อัตราป่วย Top 10</span>
          </button>

          <button
            onClick={() => setActiveTab('mortality')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'mortality'
                ? 'bg-[#0b3558] text-white shadow-md'
                : 'text-[#476788] hover:text-[#0b3558] hover:bg-[#f0f3f8]'
            }`}
          >
            <Skull className="w-4 h-4" />
            <span>6. สาเหตุการตาย Top 10</span>
          </button>

          <button
            onClick={() => setActiveTab('bod')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'bod'
                ? 'bg-[#0b3558] text-white shadow-md'
                : 'text-[#476788] hover:text-[#0b3558] hover:bg-[#f0f3f8]'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>7. ภาระโรค DALYs</span>
          </button>

          <button
            onClick={() => setActiveTab('explorer')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'explorer'
                ? 'bg-[#006bff] text-white shadow-md'
                : 'text-[#006bff] hover:bg-blue-50 font-extrabold'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>8. สำรวจชุดข้อมูล 209 ตัวชี้วัด</span>
          </button>
        </div>
      </div>

      {/* 4. Active Tab Content */}
      <div className="transition-all duration-300">
        {activeTab === 'demographics' && <DemographicsSection />}
        {activeTab === 'functional' && <FunctionalADLSection />}
        {activeTab === 'screening' && <ScreeningComparisonSection />}
        {activeTab === 'ncd' && <ChronicNCDSection />}
        {activeTab === 'morbidity' && <MorbiditySection />}
        {activeTab === 'mortality' && <MortalitySection />}
        {activeTab === 'bod' && <BurdenOfDiseaseSection />}
        {activeTab === 'explorer' && <ComprehensiveExplorer />}
      </div>
    </div>
  );
};
