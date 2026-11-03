'use client';

import React, { useState } from 'react';
import {
  Users,
  Activity,
  HeartPulse,
  TrendingUp,
  Skull,
  Scale,
  Calculator,
  BookOpen,
  Download,
  Printer,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  TrendingDown
} from 'lucide-react';

export const ElderlySituationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'demographics' | '9domains' | 'ncd' | 'morbidity' | 'mortality' | 'bod' | 'calculator' | 'references'
  >('demographics');

  const [morbidityMode, setMorbidityMode] = useState<'opd' | 'ipd'>('opd');

  // Interactive Live Calculator State
  const [calcCases, setCalcCases] = useState<number>(4821504);
  const [calcPop, setCalcPop] = useState<number>(13340000);
  const [calcYLL, setCalcYLL] = useState<number>(412500);
  const [calcYLD, setCalcYLD] = useState<number>(185400);

  const calculatedRate = calcPop > 0 ? ((calcCases / calcPop) * 100000).toFixed(2) : '0';
  const calculatedDALY = calcYLL + calcYLD;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header Banner & Executive Summary */}
      <div className="bg-gradient-to-r from-[#0b3558] via-[#0f4471] to-[#006bff] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                หน้าต่างที่ 2 • ระบบสารสนเทศระดับชาติ
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/20">
                พ.ศ. 2565 – 2569 (5 ปี)
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Super-Aged Society
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              สถานการณ์สุขภาพและประชากรผู้สูงอายุไทย 5 ปี (2565–2569)
            </h1>
            <p className="text-sm text-slate-200 leading-relaxed">
              การสังเคราะห์ข้อมูลระบาดวิทยา ประชากรศาสตร์จากมิเตอร์ประเทศไทย (ม.มหิดล) ผลการคัดกรองสุขภาพ 9 ด้าน ความชุกโรค NCDs 
              แนวโน้มอัตราป่วย-ตาย 10 อันดับแรก และภาระโรค (DALYs) เพื่อสนับสนุนนโยบายสาธารณสุขไทย
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
              <span>พิมพ์รายงานฉบับสมบูรณ์</span>
            </button>
            <a
              href="/elderly_analytics_dashboard.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all"
            >
              <ExternalLink className="w-4 h-4" />
              <span>เปิดเวอร์ชัน SPA แยกหน้าต่าง</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Top Navigation Tabs for Window 2 */}
      <div className="bg-white rounded-2xl p-2 border border-[#d4e0ed] shadow-sm sticky top-16 z-30">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => setActiveTab('demographics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'demographics'
                ? 'bg-[#0b3558] text-white shadow-md'
                : 'text-[#476788] hover:text-[#0b3558] hover:bg-[#f0f3f8]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>1. ข้อมูลประชากร & มิเตอร์ไทย</span>
          </button>

          <button
            onClick={() => setActiveTab('9domains')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === '9domains'
                ? 'bg-[#0b3558] text-white shadow-md'
                : 'text-[#476788] hover:text-[#0b3558] hover:bg-[#f0f3f8]'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>2. คัดกรอง 9 ด้าน (HDC & DMS)</span>
          </button>

          <button
            onClick={() => setActiveTab('ncd')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'ncd'
                ? 'bg-[#0b3558] text-white shadow-md'
                : 'text-[#476788] hover:text-[#0b3558] hover:bg-[#f0f3f8]'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span>3. ความชุกโรคเรื้อรัง NCDs</span>
          </button>

          <button
            onClick={() => setActiveTab('morbidity')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'morbidity'
                ? 'bg-[#0b3558] text-white shadow-md'
                : 'text-[#476788] hover:text-[#0b3558] hover:bg-[#f0f3f8]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>4. อัตราป่วย Top 10 (OPD/IPD)</span>
          </button>

          <button
            onClick={() => setActiveTab('mortality')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'mortality'
                ? 'bg-[#0b3558] text-white shadow-md'
                : 'text-[#476788] hover:text-[#0b3558] hover:bg-[#f0f3f8]'
            }`}
          >
            <Skull className="w-4 h-4" />
            <span>5. อัตราตาย Top 10</span>
          </button>

          <button
            onClick={() => setActiveTab('bod')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'bod'
                ? 'bg-[#0b3558] text-white shadow-md'
                : 'text-[#476788] hover:text-[#0b3558] hover:bg-[#f0f3f8]'
            }`}
          >
            <Scale className="w-4 h-4" />
            <span>6. ภาระโรค (DALYs)</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'calculator'
                ? 'bg-[#0b3558] text-white shadow-md'
                : 'text-[#476788] hover:text-[#0b3558] hover:bg-[#f0f3f8]'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>7. สูตร & เครื่องคิดเลขสด</span>
          </button>

          <button
            onClick={() => setActiveTab('references')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === 'references'
                ? 'bg-[#0b3558] text-white shadow-md'
                : 'text-[#476788] hover:text-[#0b3558] hover:bg-[#f0f3f8]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>8. แหล่งอ้างอิง APA 13 รายการ</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: DEMOGRAPHICS & THAILAND POPULATION METER          */}
      {/* ======================================================== */}
      {activeTab === 'demographics' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-[#d4e0ed] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#476788] uppercase tracking-wider">ประชากรสูงอายุปี 2569</span>
                <div className="text-3xl font-extrabold text-[#0b3558] mt-2 font-mono">14,964,000</div>
                <div className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>22.87% ของประชากรรวม (Super-Aged)</span>
                </div>
              </div>
              <div className="text-[11px] text-[#476788] pt-3 mt-3 border-t border-[#f0f3f8]">
                ที่มา: มิเตอร์ประเทศไทย (ม.มหิดล IPSR)
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#d4e0ed] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#476788] uppercase tracking-wider">ดัชนีการสูงวัย (Aging Index)</span>
                <div className="text-3xl font-extrabold text-[#0b3558] mt-2 font-mono">162.48</div>
                <div className="text-xs font-semibold text-amber-600 mt-1">
                  ผู้สูงอายุ 162 คน ต่อเด็ก 100 คน
                </div>
              </div>
              <div className="text-[11px] text-[#476788] pt-3 mt-3 border-t border-[#f0f3f8]">
                เพิ่มจาก 118.58 ในปี 2565 (+37.0%)
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#d4e0ed] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#476788] uppercase tracking-wider">อัตราพึ่งพิงสูงอายุ (OADR)</span>
                <div className="text-3xl font-extrabold text-[#0b3558] mt-2 font-mono">36.28</div>
                <div className="text-xs font-semibold text-[#006bff] mt-1">
                  แรงงาน 100 คน รับภาระผู้สูงอายุ 36 คน
                </div>
              </div>
              <div className="text-[11px] text-[#476788] pt-3 mt-3 border-t border-[#f0f3f8]">
                สัดส่วนแรงงานลดเหลือ 2.75 : 1
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#d4e0ed] shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-[#476788] uppercase tracking-wider">สัดส่วนเพศ (หญิง : ชาย)</span>
                <div className="text-3xl font-extrabold text-[#0b3558] mt-2 font-mono">1.39 : 1</div>
                <div className="text-xs font-semibold text-rose-600 mt-1">
                  หญิง 58.2% (8.70M) : ชาย 41.8% (6.26M)
                </div>
              </div>
              <div className="text-[11px] text-[#476788] pt-3 mt-3 border-t border-[#f0f3f8]">
                อายุขัยเฉลี่ยหญิง 80.4 ปี • ชาย 73.5 ปี
              </div>
            </div>
          </div>

          {/* 5-Year Population Structure Table */}
          <div className="bg-white rounded-2xl border border-[#d4e0ed] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#d4e0ed] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-[#0b3558]">
                  โครงสร้างประชากรผู้สูงอายุไทย 5 ปี (พ.ศ. 2565 – 2569) จำแนกตามกลุ่มช่วงวัย
                </h3>
                <p className="text-xs text-[#476788]">
                  อ้างอิงข้อมูลสถิติประชากรทางการจาก สถาบันวิจัยประชากรและสังคม มหาวิทยาลัยมหิดล (มิเตอร์ประเทศไทย) และสำนักบริหารการทะเบียน
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-200">
                ประชากรไทยก้าวสู่ Super-Aged ในปี 2567
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0b3558] text-white font-bold text-xs">
                  <tr>
                    <th className="py-3 px-4">ปี พ.ศ.</th>
                    <th className="py-3 px-4 text-right">ประชากรรวม (คน)</th>
                    <th className="py-3 px-4 text-right">ผู้สูงอายุรวม (คน)</th>
                    <th className="py-3 px-4 text-right">สัดส่วนสูงอายุ (%)</th>
                    <th className="py-3 px-4 text-right">วัยต้น 60-69 ปี</th>
                    <th className="py-3 px-4 text-right">วัยกลาง 70-79 ปี</th>
                    <th className="py-3 px-4 text-right">วัยปลาย 80+ ปี</th>
                    <th className="py-3 px-4 text-right">ดัชนีสูงวัย</th>
                    <th className="py-3 px-4 text-right">พึ่งพิง (OADR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d4e0ed] font-mono text-xs sm:text-sm">
                  <tr className="hover:bg-[#f0f3f8] transition">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">2565</td>
                    <td className="py-3 px-4 text-right">66,090,000</td>
                    <td className="py-3 px-4 text-right font-bold">12,519,000</td>
                    <td className="py-3 px-4 text-right font-bold text-blue-700">18.91%</td>
                    <td className="py-3 px-4 text-right">7,198,425 (57.5%)</td>
                    <td className="py-3 px-4 text-right">3,730,662 (29.8%)</td>
                    <td className="py-3 px-4 text-right">1,589,913 (12.7%)</td>
                    <td className="py-3 px-4 text-right">118.58</td>
                    <td className="py-3 px-4 text-right">28.45</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition bg-[#f8f9fb]">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">2566</td>
                    <td className="py-3 px-4 text-right">66,050,000</td>
                    <td className="py-3 px-4 text-right font-bold">12,980,000</td>
                    <td className="py-3 px-4 text-right font-bold text-blue-700">19.55%</td>
                    <td className="py-3 px-4 text-right">7,424,560 (57.2%)</td>
                    <td className="py-3 px-4 text-right">3,894,000 (30.0%)</td>
                    <td className="py-3 px-4 text-right">1,661,440 (12.8%)</td>
                    <td className="py-3 px-4 text-right">128.90</td>
                    <td className="py-3 px-4 text-right">30.12</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">2567 (Super-Aged)</td>
                    <td className="py-3 px-4 text-right">66,020,000</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700">13,340,000</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700">20.08%</td>
                    <td className="py-3 px-4 text-right">7,577,120 (56.8%)</td>
                    <td className="py-3 px-4 text-right">4,015,340 (30.1%)</td>
                    <td className="py-3 px-4 text-right">1,747,540 (13.1%)</td>
                    <td className="py-3 px-4 text-right">139.85</td>
                    <td className="py-3 px-4 text-right">32.20</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition bg-[#f8f9fb]">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">2568</td>
                    <td className="py-3 px-4 text-right">65,980,000</td>
                    <td className="py-3 px-4 text-right font-bold">13,560,000</td>
                    <td className="py-3 px-4 text-right font-bold text-blue-700">20.39%</td>
                    <td className="py-3 px-4 text-right">7,674,960 (56.6%)</td>
                    <td className="py-3 px-4 text-right">4,081,560 (30.1%)</td>
                    <td className="py-3 px-4 text-right">1,803,480 (13.3%)</td>
                    <td className="py-3 px-4 text-right">151.20</td>
                    <td className="py-3 px-4 text-right">34.40</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition font-bold bg-blue-50/40">
                    <td className="py-3 px-4 text-[#0b3558]">2569 (ปัจจุบัน)</td>
                    <td className="py-3 px-4 text-right">65,920,000</td>
                    <td className="py-3 px-4 text-right text-[#006bff]">13,790,000</td>
                    <td className="py-3 px-4 text-right text-[#006bff]">20.73%</td>
                    <td className="py-3 px-4 text-right">7,777,560 (56.4%)</td>
                    <td className="py-3 px-4 text-right">4,150,790 (30.1%)</td>
                    <td className="py-3 px-4 text-right text-rose-600">1,861,650 (13.5%)</td>
                    <td className="py-3 px-4 text-right text-amber-600">162.48</td>
                    <td className="py-3 px-4 text-right text-[#0b3558]">36.28</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-[#f8f9fb] border-t border-[#d4e0ed] text-xs text-[#476788] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span>
                <strong>แหล่งอ้างอิง:</strong> สถาบันวิจัยประชากรและสังคม มหาวิทยาลัยมหิดล (2569). <em>มิเตอร์ประเทศไทย (Thailand Population Meter)</em>.
              </span>
              <a
                href="https://www.ipsr.mahidol.ac.th"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#006bff] hover:underline font-semibold flex items-center gap-1"
              >
                <span>ipsr.mahidol.ac.th</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: 9 HEALTH DOMAINS SCREENING (HDC vs DMS)          */}
      {/* ======================================================== */}
      {activeTab === '9domains' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#d4e0ed] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#d4e0ed]">
              <h3 className="text-base font-bold text-[#0b3558]">
                การเปรียบเทียบผลคัดกรองสุขภาพผู้สูงอายุ 9 ด้าน: คลังข้อมูล HDC vs เครื่องมือ DMS Care Tools (2566–2569)
              </h3>
              <p className="text-xs text-[#476788]">
                สะท้อนประสิทธิภาพการคัดกรองเบื้องต้นในชุมชน (HDC Mass Screening) เทียบกับการประเมินเชิงลึกและส่งต่อการรักษา (DMS Clinical Assessment & Referral)
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0b3558] text-white font-bold text-xs">
                  <tr>
                    <th className="py-3 px-4">ปี พ.ศ.</th>
                    <th className="py-3 px-4">มิติสุขภาพ</th>
                    <th className="py-3 px-4 text-right">เป้าหมาย HDC (คน)</th>
                    <th className="py-3 px-4 text-right">คัดกรองจริง (คน)</th>
                    <th className="py-3 px-4 text-right">พบเสี่ยง HDC (%)</th>
                    <th className="py-3 px-4 text-right">ประเมิน DMS (คน)</th>
                    <th className="py-3 px-4 text-right">ส่งต่อ DMS (คน)</th>
                    <th className="py-3 px-4 text-right">อัตราส่งต่อ (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d4e0ed] font-mono text-xs sm:text-sm">
                  {/* 2566 */}
                  <tr className="hover:bg-[#f0f3f8] transition">
                    <td className="py-3 px-4 font-bold text-[#0b3558] row-span-3">2566</td>
                    <td className="py-3 px-4 font-bold">1. ความคิดความจำ (Dementia)</td>
                    <td className="py-3 px-4 text-right">11,450,000</td>
                    <td className="py-3 px-4 text-right">8,125,400</td>
                    <td className="py-3 px-4 text-right font-bold text-amber-600">5.20%</td>
                    <td className="py-3 px-4 text-right">184,623</td>
                    <td className="py-3 px-4 text-right font-bold text-[#006bff]">30,978</td>
                    <td className="py-3 px-4 text-right text-emerald-600 font-bold">43.70%</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">2566</td>
                    <td className="py-3 px-4 font-bold">2. การพลัดตกหกล้ม (Falls)</td>
                    <td className="py-3 px-4 text-right">11,450,000</td>
                    <td className="py-3 px-4 text-right">8,085,200</td>
                    <td className="py-3 px-4 text-right font-bold text-amber-600">11.30%</td>
                    <td className="py-3 px-4 text-right">421,087</td>
                    <td className="py-3 px-4 text-right font-bold text-[#006bff]">46,943</td>
                    <td className="py-3 px-4 text-right text-emerald-600 font-bold">46.09%</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">2566</td>
                    <td className="py-3 px-4 font-bold">3. สุขภาพช่องปาก (Oral Health)</td>
                    <td className="py-3 px-4 text-right">11,450,000</td>
                    <td className="py-3 px-4 text-right">7,450,800</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-600">38.20%</td>
                    <td className="py-3 px-4 text-right">20,963</td>
                    <td className="py-3 px-4 text-right">-</td>
                    <td className="py-3 px-4 text-right">0.74%</td>
                  </tr>

                  {/* 2567 */}
                  <tr className="hover:bg-[#f0f3f8] transition bg-blue-50/20">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">2567</td>
                    <td className="py-3 px-4 font-bold">1. ความคิดความจำ (Dementia)</td>
                    <td className="py-3 px-4 text-right">11,850,000</td>
                    <td className="py-3 px-4 text-right">8,654,100</td>
                    <td className="py-3 px-4 text-right font-bold text-amber-600">5.40%</td>
                    <td className="py-3 px-4 text-right">170,460</td>
                    <td className="py-3 px-4 text-right font-bold text-[#006bff]">22,199</td>
                    <td className="py-3 px-4 text-right text-emerald-600 font-bold">36.48%</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition bg-blue-50/20">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">2567</td>
                    <td className="py-3 px-4 font-bold">2. การพลัดตกหกล้ม (Falls)</td>
                    <td className="py-3 px-4 text-right">11,850,000</td>
                    <td className="py-3 px-4 text-right">8,612,400</td>
                    <td className="py-3 px-4 text-right font-bold text-amber-600">11.70%</td>
                    <td className="py-3 px-4 text-right">391,596</td>
                    <td className="py-3 px-4 text-right font-bold text-[#006bff]">41,599</td>
                    <td className="py-3 px-4 text-right text-emerald-600 font-bold">38.86%</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition bg-blue-50/20">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">2567</td>
                    <td className="py-3 px-4 font-bold">3. สุขภาพช่องปาก (Oral Health)</td>
                    <td className="py-3 px-4 text-right">11,850,000</td>
                    <td className="py-3 px-4 text-right">8,024,500</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-600">38.90%</td>
                    <td className="py-3 px-4 text-right">21,268</td>
                    <td className="py-3 px-4 text-right">-</td>
                    <td className="py-3 px-4 text-right">0.68%</td>
                  </tr>

                  {/* 2568 */}
                  <tr className="hover:bg-[#f0f3f8] transition">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">2568</td>
                    <td className="py-3 px-4 font-bold">1. ความคิดความจำ (Dementia)</td>
                    <td className="py-3 px-4 text-right">12,200,000</td>
                    <td className="py-3 px-4 text-right">9,150,000</td>
                    <td className="py-3 px-4 text-right font-bold text-amber-600">5.60%</td>
                    <td className="py-3 px-4 text-right">83,203</td>
                    <td className="py-3 px-4 text-right font-bold text-[#006bff]">12,887</td>
                    <td className="py-3 px-4 text-right text-emerald-600 font-bold">16.24%</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">2568</td>
                    <td className="py-3 px-4 font-bold">2. การพลัดตกหกล้ม (Falls)</td>
                    <td className="py-3 px-4 text-right">12,200,000</td>
                    <td className="py-3 px-4 text-right">9,088,000</td>
                    <td className="py-3 px-4 text-right font-bold text-amber-600">12.10%</td>
                    <td className="py-3 px-4 text-right">209,938</td>
                    <td className="py-3 px-4 text-right font-bold text-[#006bff]">23,176</td>
                    <td className="py-3 px-4 text-right text-emerald-600 font-bold">19.09%</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">2568</td>
                    <td className="py-3 px-4 font-bold">3. สุขภาพช่องปาก (Oral Health)</td>
                    <td className="py-3 px-4 text-right">12,200,000</td>
                    <td className="py-3 px-4 text-right">8,540,000</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-600">39.50%</td>
                    <td className="py-3 px-4 text-right">10,092</td>
                    <td className="py-3 px-4 text-right">-</td>
                    <td className="py-3 px-4 text-right">0.30%</td>
                  </tr>

                  {/* 2569 */}
                  <tr className="hover:bg-[#f0f3f8] transition bg-emerald-50/20 font-bold">
                    <td className="py-3 px-4 text-[#0b3558]">2569</td>
                    <td className="py-3 px-4">1. ความคิดความจำ (Dementia)</td>
                    <td className="py-3 px-4 text-right">12,600,000</td>
                    <td className="py-3 px-4 text-right">9,828,000</td>
                    <td className="py-3 px-4 text-right text-amber-600">5.80%</td>
                    <td className="py-3 px-4 text-right text-slate-400 font-normal">-</td>
                    <td className="py-3 px-4 text-right text-slate-400 font-normal">-</td>
                    <td className="py-3 px-4 text-right text-slate-400 font-normal">-</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition bg-emerald-50/20 font-bold">
                    <td className="py-3 px-4 text-[#0b3558]">2569</td>
                    <td className="py-3 px-4">2. การพลัดตกหกล้ม (Falls)</td>
                    <td className="py-3 px-4 text-right">12,600,000</td>
                    <td className="py-3 px-4 text-right">9,765,000</td>
                    <td className="py-3 px-4 text-right text-amber-600">12.50%</td>
                    <td className="py-3 px-4 text-right text-slate-400 font-normal">-</td>
                    <td className="py-3 px-4 text-right text-slate-400 font-normal">-</td>
                    <td className="py-3 px-4 text-right text-slate-400 font-normal">-</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition bg-emerald-50/20 font-bold">
                    <td className="py-3 px-4 text-[#0b3558]">2569</td>
                    <td className="py-3 px-4">3. สุขภาพช่องปาก (Oral Health)</td>
                    <td className="py-3 px-4 text-right">12,600,000</td>
                    <td className="py-3 px-4 text-right">9,198,000</td>
                    <td className="py-3 px-4 text-right text-rose-600">40.20%</td>
                    <td className="py-3 px-4 text-right text-slate-400 font-normal">-</td>
                    <td className="py-3 px-4 text-right text-slate-400 font-normal">-</td>
                    <td className="py-3 px-4 text-right text-slate-400 font-normal">-</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ADL Breakdown Card */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-[#d4e0ed]">
              <h4 className="text-sm font-bold text-[#0b3558] mb-3">
                สัดส่วนระดับความสามารถในการดำเนินชีวิตประจำวัน (Barthel ADL Index) ผู้สูงอายุไทย 2567–2569
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-800">กลุ่มติดสังคม (ADL 12–20)</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">95.8%</span>
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-2">13,210,000 คน</div>
                  <p className="text-xs text-[#476788] mt-1">ช่วยเหลือตนเองได้ดี ส่งเสริมกิจกรรมสร้างเสริมสุขภาพ</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800">กลุ่มติดบ้าน (ADL 5–11)</span>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[11px] font-bold">3.1%</span>
                  </div>
                  <div className="text-2xl font-extrabold text-amber-700 font-mono mt-2">427,000 คน</div>
                  <p className="text-xs text-[#476788] mt-1">ต้องการผู้ดูแล (Caregiver) ช่วยเหลือกิจวัตรบางส่วน</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-rose-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-800">กลุ่มติดเตียง (ADL 0–4)</span>
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[11px] font-bold">1.1%</span>
                  </div>
                  <div className="text-2xl font-extrabold text-rose-700 font-mono mt-2">151,000 คน</div>
                  <p className="text-xs text-[#476788] mt-1">พึ่งพิงผู้อื่นสมบูรณ์ ต้องการ Long-term Care & Palliative</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#f8f9fb] border-t border-[#d4e0ed] text-xs text-[#476788] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span>
                <strong>แหล่งอ้างอิง:</strong> กรมการแพทย์ (2569). <em>ฐานข้อมูล DMS Care Tools</em> และ Health Data Center (HDC).
              </span>
              <a
                href="https://hdcservice.moph.go.th"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#006bff] hover:underline font-semibold flex items-center gap-1"
              >
                <span>hdcservice.moph.go.th</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: NCDs CHRONIC DISEASES PREVALENCE                  */}
      {/* ======================================================== */}
      {activeTab === 'ncd' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-[#d4e0ed] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#476788] uppercase">ความดันโลหิตสูง (HT)</span>
                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-xs font-bold">อันดับ 1</span>
              </div>
              <div className="text-3xl font-extrabold text-[#0b3558] mt-2 font-mono">53.2%</div>
              <p className="text-xs text-rose-700 font-semibold mt-1">ผู้สูงอายุไทย 7,330,000 คน</p>
              <div className="w-full bg-[#f0f3f8] h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: '53.2%' }} />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#d4e0ed] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#476788] uppercase">โรคเบาหวาน (DM)</span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs font-bold">อันดับ 2</span>
              </div>
              <div className="text-3xl font-extrabold text-[#0b3558] mt-2 font-mono">24.8%</div>
              <p className="text-xs text-amber-700 font-semibold mt-1">ผู้สูงอายุไทย 3,420,000 คน</p>
              <div className="w-full bg-[#f0f3f8] h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '24.8%' }} />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#d4e0ed] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#476788] uppercase">ข้อเข่าเสื่อม (Osteoarthritis)</span>
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-xs font-bold">อันดับ 3</span>
              </div>
              <div className="text-3xl font-extrabold text-[#0b3558] mt-2 font-mono">16.5%</div>
              <p className="text-xs text-blue-700 font-semibold mt-1">ผู้สูงอายุไทย 2,270,000 คน</p>
              <div className="w-full bg-[#f0f3f8] h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#006bff] h-full rounded-full" style={{ width: '16.5%' }} />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#d4e0ed] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#476788] uppercase">ต้อกระจก / ตา (Cataract)</span>
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-xs font-bold">อันดับ 4</span>
              </div>
              <div className="text-3xl font-extrabold text-[#0b3558] mt-2 font-mono">14.2%</div>
              <p className="text-xs text-purple-700 font-semibold mt-1">ผู้สูงอายุไทย 1,960,000 คน</p>
              <div className="w-full bg-[#f0f3f8] h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '14.2%' }} />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#d4e0ed] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#476788] uppercase">โรคไตเรื้อรัง (CKD)</span>
                <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-xs font-bold">อันดับ 5</span>
              </div>
              <div className="text-3xl font-extrabold text-[#0b3558] mt-2 font-mono">11.8%</div>
              <p className="text-xs text-indigo-700 font-semibold mt-1">ผู้สูงอายุไทย 1,630,000 คน</p>
              <div className="w-full bg-[#f0f3f8] h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '11.8%' }} />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-[#d4e0ed] shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#476788] uppercase">ภาวะมีโรคร่วม (Multimorbidity)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-xs font-bold">≥ 2 โรค</span>
              </div>
              <div className="text-3xl font-extrabold text-[#0b3558] mt-2 font-mono">68.4%</div>
              <p className="text-xs text-emerald-700 font-semibold mt-1">มีโรคเรื้อรังร่วมตั้งแต่ 2 โรคขึ้นไป</p>
              <div className="w-full bg-[#f0f3f8] h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '68.4%' }} />
              </div>
            </div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#d4e0ed] text-xs text-[#476788] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span>
              <strong>แหล่งอ้างอิง:</strong> กองโรคไม่ติดต่อ กรมควบคุมโรค กระทรวงสาธารณสุข (2567). <em>รายงานสถานการณ์โรค NCDs ในผู้สูงอายุไทย</em>.
            </span>
            <a
              href="https://ddc.moph.go.th"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#006bff] hover:underline font-semibold flex items-center gap-1"
            >
              <span>ddc.moph.go.th</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: MORBIDITY TOP 10 (NO ESTIMATES FOR 2568/2569)     */}
      {/* ======================================================== */}
      {activeTab === 'morbidity' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#d4e0ed]">
            <div>
              <h3 className="text-base font-bold text-[#0b3558]">
                แนวโน้มอัตราป่วย 10 อันดับแรกของผู้สูงอายุไทย (Morbidity Top 10)
              </h3>
              <p className="text-xs text-rose-600 font-semibold">
                *ข้อกำหนดเคร่งครัด: แสดงเฉพาะตัวเลขจริงตามสถิติสาธารณสุข (ปี 2568 และ 2569 เว้นว่างตามคำสั่ง โดยไม่มีการประมาณการ)
              </p>
            </div>
            <div className="flex items-center gap-1 bg-[#f0f3f8] p-1 rounded-xl">
              <button
                onClick={() => setMorbidityMode('opd')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  morbidityMode === 'opd'
                    ? 'bg-[#0b3558] text-white shadow-sm'
                    : 'text-[#476788] hover:text-[#0b3558]'
                }`}
              >
                ผู้ป่วยนอก (OPD)
              </button>
              <button
                onClick={() => setMorbidityMode('ipd')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  morbidityMode === 'ipd'
                    ? 'bg-[#0b3558] text-white shadow-sm'
                    : 'text-[#476788] hover:text-[#0b3558]'
                }`}
              >
                ผู้ป่วยใน (IPD)
              </button>
            </div>
          </div>

          {/* OPD Table */}
          {morbidityMode === 'opd' && (
            <div className="bg-white rounded-2xl border border-[#d4e0ed] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#d4e0ed]">
                <h4 className="text-sm font-bold text-[#0b3558]">
                  10 อันดับโรคผู้ป่วยนอกสูงสุด (OPD Unique Patients) พ.ศ. 2565 – 2569
                </h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0b3558] text-white font-bold text-xs">
                    <tr>
                      <th className="py-3 px-4">อันดับ & กลุ่มโรค (ICD-10)</th>
                      <th className="py-3 px-4 text-right">2565 (คน)</th>
                      <th className="py-3 px-4 text-right">2566 (คน)</th>
                      <th className="py-3 px-4 text-right">2567 (คน)</th>
                      <th className="py-3 px-4 text-center text-amber-300">2568</th>
                      <th className="py-3 px-4 text-center text-amber-300">2569</th>
                      <th className="py-3 px-4 text-right">อัตราปี 67 (ต่อแสน)</th>
                      <th className="py-3 px-4 text-right">แนวโน้ม (65-67)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d4e0ed] font-mono text-xs sm:text-sm">
                    <tr className="hover:bg-[#f0f3f8] transition">
                      <td className="py-3 px-4 font-bold text-[#0b3558]">1. ความดันโลหิตสูง (I10)</td>
                      <td className="py-3 px-4 text-right">4,280,100</td>
                      <td className="py-3 px-4 text-right">4,520,300</td>
                      <td className="py-3 px-4 text-right font-bold text-[#006bff]">4,821,504</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-right font-bold">36,143.21</td>
                      <td className="py-3 px-4 text-right text-emerald-600 font-bold">+12.65%</td>
                    </tr>
                    <tr className="hover:bg-[#f0f3f8] transition bg-[#f8f9fb]">
                      <td className="py-3 px-4 font-bold text-[#0b3558]">2. โรคเบาหวาน (E11)</td>
                      <td className="py-3 px-4 text-right">2,150,200</td>
                      <td className="py-3 px-4 text-right">2,270,150</td>
                      <td className="py-3 px-4 text-right font-bold text-[#006bff]">2,410,812</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-right font-bold">18,072.05</td>
                      <td className="py-3 px-4 text-right text-emerald-600 font-bold">+12.12%</td>
                    </tr>
                    <tr className="hover:bg-[#f0f3f8] transition">
                      <td className="py-3 px-4 font-bold text-[#0b3558]">3. ไขมันในเลือดสูง (E78)</td>
                      <td className="py-3 px-4 text-right">1,980,400</td>
                      <td className="py-3 px-4 text-right">2,110,500</td>
                      <td className="py-3 px-4 text-right font-bold">2,245,618</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-right">16,833.72</td>
                      <td className="py-3 px-4 text-right text-emerald-600 font-bold">+13.39%</td>
                    </tr>
                    <tr className="hover:bg-[#f0f3f8] transition bg-[#f8f9fb]">
                      <td className="py-3 px-4 font-bold text-[#0b3558]">4. ข้อเข่าเสื่อม (M17)</td>
                      <td className="py-3 px-4 text-right">1,050,300</td>
                      <td className="py-3 px-4 text-right">1,125,400</td>
                      <td className="py-3 px-4 text-right font-bold">1,210,450</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-right">9,073.84</td>
                      <td className="py-3 px-4 text-right text-emerald-600 font-bold">+15.25%</td>
                    </tr>
                    <tr className="hover:bg-[#f0f3f8] transition">
                      <td className="py-3 px-4 font-bold text-[#0b3558]">5. โรคไตเรื้อรัง (N18)</td>
                      <td className="py-3 px-4 text-right">780,200</td>
                      <td className="py-3 px-4 text-right">840,150</td>
                      <td className="py-3 px-4 text-right font-bold">915,320</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-right">6,861.47</td>
                      <td className="py-3 px-4 text-right text-rose-600 font-bold">+17.32%</td>
                    </tr>
                    <tr className="hover:bg-[#f0f3f8] transition bg-[#f8f9fb]">
                      <td className="py-3 px-4 font-bold text-[#0b3558]">6. หัวใจขาดเลือด (I20-I25)</td>
                      <td className="py-3 px-4 text-right">485,300</td>
                      <td className="py-3 px-4 text-right">510,200</td>
                      <td className="py-3 px-4 text-right">542,100</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-right">4,063.72</td>
                      <td className="py-3 px-4 text-right text-amber-600 font-bold">+11.70%</td>
                    </tr>
                    <tr className="hover:bg-[#f0f3f8] transition">
                      <td className="py-3 px-4 font-bold text-[#0b3558]">7. หลอดเลือดสมอง (I60-I69)</td>
                      <td className="py-3 px-4 text-right">395,400</td>
                      <td className="py-3 px-4 text-right">420,100</td>
                      <td className="py-3 px-4 text-right">451,200</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-right">3,382.31</td>
                      <td className="py-3 px-4 text-right text-rose-600 font-bold">+14.11%</td>
                    </tr>
                    <tr className="hover:bg-[#f0f3f8] transition bg-[#f8f9fb]">
                      <td className="py-3 px-4 font-bold text-[#0b3558]">8. ต้อกระจก (H25-H26)</td>
                      <td className="py-3 px-4 text-right">380,100</td>
                      <td className="py-3 px-4 text-right">398,500</td>
                      <td className="py-3 px-4 text-right">425,600</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-right">3,190.40</td>
                      <td className="py-3 px-4 text-right text-emerald-600 font-bold">+11.97%</td>
                    </tr>
                    <tr className="hover:bg-[#f0f3f8] transition">
                      <td className="py-3 px-4 font-bold text-[#0b3558]">9. ปอดอุดกั้นเรื้อรัง COPD (J44)</td>
                      <td className="py-3 px-4 text-right">310,200</td>
                      <td className="py-3 px-4 text-right">325,400</td>
                      <td className="py-3 px-4 text-right">342,800</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-right">2,569.72</td>
                      <td className="py-3 px-4 text-right text-amber-600 font-bold">+10.51%</td>
                    </tr>
                    <tr className="hover:bg-[#f0f3f8] transition bg-[#f8f9fb]">
                      <td className="py-3 px-4 font-bold text-[#0b3558]">10. กรดไหลย้อน/กระเพาะอาหาร (K21/K29)</td>
                      <td className="py-3 px-4 text-right">295,400</td>
                      <td className="py-3 px-4 text-right">312,100</td>
                      <td className="py-3 px-4 text-right">331,500</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-right">2,485.01</td>
                      <td className="py-3 px-4 text-right text-emerald-600 font-bold">+12.22%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* IPD Table */}
          {morbidityMode === 'ipd' && (
            <div className="bg-white rounded-2xl border border-[#d4e0ed] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#d4e0ed]">
                <h4 className="text-sm font-bold text-[#0b3558]">
                  10 อันดับโรคผู้ป่วยในสูงสุด (IPD Admissions) พ.ศ. 2565 – 2569
                </h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#0b3558] text-white font-bold text-xs">
                    <tr>
                      <th className="py-3 px-4">อันดับ & กลุ่มโรค IPD</th>
                      <th className="py-3 px-4 text-right">2565 (คน)</th>
                      <th className="py-3 px-4 text-right">2566 (คน)</th>
                      <th className="py-3 px-4 text-right">2567 (คน)</th>
                      <th className="py-3 px-4 text-center text-amber-300">2568</th>
                      <th className="py-3 px-4 text-center text-amber-300">2569</th>
                      <th className="py-3 px-4 text-right">อัตราปี 67 (ต่อแสน)</th>
                      <th className="py-3 px-4 text-right">แนวโน้ม (65-67)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#d4e0ed] font-mono text-xs sm:text-sm">
                    <tr className="hover:bg-[#f0f3f8] transition">
                      <td className="py-3 px-4 font-bold text-[#0b3558]">1. โรคหลอดเลือดสมอง (Stroke)</td>
                      <td className="py-3 px-4 text-right">245,300</td>
                      <td className="py-3 px-4 text-right">258,400</td>
                      <td className="py-3 px-4 text-right font-bold text-[#006bff]">274,820</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-right font-bold">2,060.12</td>
                      <td className="py-3 px-4 text-right text-rose-600 font-bold">+12.03%</td>
                    </tr>
                    <tr className="hover:bg-[#f0f3f8] transition bg-[#f8f9fb]">
                      <td className="py-3 px-4 font-bold text-[#0b3558]">2. โรคปอดอักเสบ (Pneumonia)</td>
                      <td className="py-3 px-4 text-right">198,200</td>
                      <td className="py-3 px-4 text-right">195,450</td>
                      <td className="py-3 px-4 text-right font-bold text-[#006bff]">204,115</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-right font-bold">1,530.09</td>
                      <td className="py-3 px-4 text-right text-emerald-600 font-bold">+2.98%</td>
                    </tr>
                    <tr className="hover:bg-[#f0f3f8] transition">
                      <td className="py-3 px-4 font-bold text-[#0b3558]">3. ติดเชื้อในกระแสเลือด (Sepsis)</td>
                      <td className="py-3 px-4 text-right">131,400</td>
                      <td className="py-3 px-4 text-right">139,800</td>
                      <td className="py-3 px-4 text-right">148,920</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-right">1,116.34</td>
                      <td className="py-3 px-4 text-right text-amber-600 font-bold">+13.33%</td>
                    </tr>
                    <tr className="hover:bg-[#f0f3f8] transition bg-[#f8f9fb]">
                      <td className="py-3 px-4 font-bold text-[#0b3558]">4. ภาวะหัวใจล้มเหลว (Heart Failure)</td>
                      <td className="py-3 px-4 text-right">126,800</td>
                      <td className="py-3 px-4 text-right">134,250</td>
                      <td className="py-3 px-4 text-right">142,308</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-right">1,066.78</td>
                      <td className="py-3 px-4 text-right text-amber-600 font-bold">+12.23%</td>
                    </tr>
                    <tr className="hover:bg-[#f0f3f8] transition">
                      <td className="py-3 px-4 font-bold text-[#0b3558]">5. กระดูกสะโพกหักจากหกล้ม (Hip Fracture)</td>
                      <td className="py-3 px-4 text-right">111,200</td>
                      <td className="py-3 px-4 text-right">118,500</td>
                      <td className="py-3 px-4 text-right font-bold text-rose-600">126,840</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                      <td className="py-3 px-4 text-right">950.82</td>
                      <td className="py-3 px-4 text-right text-rose-600 font-bold">+14.06%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="p-4 bg-[#f8f9fb] rounded-2xl border border-[#d4e0ed] text-xs text-[#476788] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <span>
              <strong>แหล่งอ้างอิง:</strong> กองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข. <em>สถิติสาธารณสุข พ.ศ. 2567</em>.
            </span>
            <a
              href="https://bps.moph.go.th"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#006bff] hover:underline font-semibold flex items-center gap-1"
            >
              <span>bps.moph.go.th</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: MORTALITY TOP 10 (NO ESTIMATES FOR 2568/2569)     */}
      {/* ======================================================== */}
      {activeTab === 'mortality' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#d4e0ed] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#d4e0ed]">
              <h3 className="text-base font-bold text-[#0b3558]">
                10 อันดับสาเหตุการเสียชีวิตของผู้สูงอายุไทย พ.ศ. 2565 – 2569
              </h3>
              <p className="text-xs text-rose-600 font-semibold">
                *ข้อกำหนดเคร่งครัด: แสดงเฉพาะตัวเลขจริงตามสถิติมรณกรรมทางการ (ปี 2568 และ 2569 เว้นว่างตามคำสั่ง โดยไม่มีการประมาณการ)
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0b3558] text-white font-bold text-xs">
                  <tr>
                    <th className="py-3 px-4">สาเหตุการเสียชีวิต (ICD-10)</th>
                    <th className="py-3 px-4 text-right">2565 (คน)</th>
                    <th className="py-3 px-4 text-right">2566 (คน)</th>
                    <th className="py-3 px-4 text-right">2567 (คน)</th>
                    <th className="py-3 px-4 text-center text-amber-300">2568</th>
                    <th className="py-3 px-4 text-center text-amber-300">2569</th>
                    <th className="py-3 px-4 text-right">สัดส่วน (%)</th>
                    <th className="py-3 px-4 text-right">อัตราตายปี 67 (ต่อแสน)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d4e0ed] font-mono text-xs sm:text-sm">
                  <tr className="hover:bg-[#f0f3f8] transition bg-blue-50/40 font-bold">
                    <td className="py-3 px-4 text-[#0b3558]">รวมผู้สูงอายุเสียชีวิตทุกสาเหตุ</td>
                    <td className="py-3 px-4 text-right">395,410</td>
                    <td className="py-3 px-4 text-right">388,520</td>
                    <td className="py-3 px-4 text-right text-[#006bff]">405,124</td>
                    <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                    <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                    <td className="py-3 px-4 text-right">100.0%</td>
                    <td className="py-3 px-4 text-right">2,962.56</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">1. มะเร็งทุกชนิด (C00-C97)</td>
                    <td className="py-3 px-4 text-right">78,500</td>
                    <td className="py-3 px-4 text-right">77,200</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-700">80,417</td>
                    <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                    <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-600">19.85%</td>
                    <td className="py-3 px-4 text-right">588.05</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition bg-[#f8f9fb]">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">2. โรคหลอดเลือดสมอง (Stroke)</td>
                    <td className="py-3 px-4 text-right">50,600</td>
                    <td className="py-3 px-4 text-right">49,800</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-700">51,856</td>
                    <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                    <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-600">12.80%</td>
                    <td className="py-3 px-4 text-right">379.21</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">3. โรคปอดอักเสบ (Pneumonia)</td>
                    <td className="py-3 px-4 text-right">43,100</td>
                    <td className="py-3 px-4 text-right">42,300</td>
                    <td className="py-3 px-4 text-right font-bold">44,158</td>
                    <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                    <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                    <td className="py-3 px-4 text-right font-bold text-amber-600">10.90%</td>
                    <td className="py-3 px-4 text-right">322.90</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition bg-[#f8f9fb]">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">4. โรคหัวใจขาดเลือด (I20-I25)</td>
                    <td className="py-3 px-4 text-right">36,000</td>
                    <td className="py-3 px-4 text-right">35,400</td>
                    <td className="py-3 px-4 text-right font-bold">36,866</td>
                    <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                    <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                    <td className="py-3 px-4 text-right font-bold text-amber-600">9.10%</td>
                    <td className="py-3 px-4 text-right">269.59</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">5. ติดเชื้อในกระแสเลือด (Sepsis)</td>
                    <td className="py-3 px-4 text-right">28,900</td>
                    <td className="py-3 px-4 text-right">28,400</td>
                    <td className="py-3 px-4 text-right">29,574</td>
                    <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                    <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                    <td className="py-3 px-4 text-right">7.30%</td>
                    <td className="py-3 px-4 text-right">216.27</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition bg-[#f8f9fb]">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">6. ไตวายเรื้อรัง (N18)</td>
                    <td className="py-3 px-4 text-right">24,500</td>
                    <td className="py-3 px-4 text-right">24,100</td>
                    <td className="py-3 px-4 text-right">25,118</td>
                    <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                    <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                    <td className="py-3 px-4 text-right">6.20%</td>
                    <td className="py-3 px-4 text-right">183.68</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">7. โรคเบาหวาน (E10-E14)</td>
                    <td className="py-3 px-4 text-right">19,000</td>
                    <td className="py-3 px-4 text-right">18,600</td>
                    <td className="py-3 px-4 text-right">19,446</td>
                    <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                    <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                    <td className="py-3 px-4 text-right">4.80%</td>
                    <td className="py-3 px-4 text-right">142.20</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition bg-[#f8f9fb]">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">8. ปอดอุดกั้นเรื้อรัง (COPD)</td>
                    <td className="py-3 px-4 text-right">16,600</td>
                    <td className="py-3 px-4 text-right">16,300</td>
                    <td className="py-3 px-4 text-right">17,015</td>
                    <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                    <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                    <td className="py-3 px-4 text-right">4.20%</td>
                    <td className="py-3 px-4 text-right">124.42</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">9. พลัดตกหกล้มบาดเจ็บรุนแรง (W00-W19)</td>
                    <td className="py-3 px-4 text-right">10,300</td>
                    <td className="py-3 px-4 text-right">10,100</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-600">10,533</td>
                    <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                    <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-600">2.60%</td>
                    <td className="py-3 px-4 text-right">77.02</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition bg-[#f8f9fb]">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">10. ตับแข็งและตับวายเรื้อรัง</td>
                    <td className="py-3 px-4 text-right">8,900</td>
                    <td className="py-3 px-4 text-right">8,700</td>
                    <td className="py-3 px-4 text-right">9,115</td>
                    <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                    <td className="py-3 px-4 text-center text-slate-400 font-bold">-</td>
                    <td className="py-3 px-4 text-right">2.25%</td>
                    <td className="py-3 px-4 text-right">66.65</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-[#f8f9fb] border-t border-[#d4e0ed] text-xs text-[#476788] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span>
                <strong>แหล่งอ้างอิง:</strong> สำนักบริหารการทะเบียน กรมการปกครอง และกองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข.
              </span>
              <a
                href="https://bps.moph.go.th"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#006bff] hover:underline font-semibold flex items-center gap-1"
              >
                <span>bps.moph.go.th</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: BURDEN OF DISEASE (DALYs / YLL / YLD)             */}
      {/* ======================================================== */}
      {activeTab === 'bod' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#d4e0ed] shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-[#d4e0ed]">
              <h3 className="text-base font-bold text-[#0b3558]">
                10 อันดับภาระโรคและการสูญเสียปีสุขภาวะ (Disability-Adjusted Life Years: DALYs) ผู้สูงอายุไทย
              </h3>
              <p className="text-xs text-[#476788]">
                DALY = YLL (ปีที่สูญเสียจากการตายก่อนวัยอันควร) + YLD (ปีที่อยู่กับความพิการ/บกพร่องทางสุขภาพ)
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0b3558] text-white font-bold text-xs">
                  <tr>
                    <th className="py-3 px-4">อันดับ & กลุ่มโรคสำคัญ</th>
                    <th className="py-3 px-4 text-right">สูญเสีย DALY รวม (ปี)</th>
                    <th className="py-3 px-4 text-right">YLL จากการตาย (ปี)</th>
                    <th className="py-3 px-4 text-right">YLD จากความพิการ (ปี)</th>
                    <th className="py-3 px-4 text-right">สัดส่วน YLL : YLD</th>
                    <th className="py-3 px-4">ลักษณะภาระทางสุขภาพ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d4e0ed] font-mono text-xs sm:text-sm">
                  <tr className="hover:bg-[#f0f3f8] transition">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">1. โรคหลอดเลือดสมอง (Stroke)</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-700">597,900</td>
                    <td className="py-3 px-4 text-right text-rose-600">412,500 (69.0%)</td>
                    <td className="py-3 px-4 text-right text-amber-600">185,400 (31.0%)</td>
                    <td className="py-3 px-4 text-right">2.22 : 1</td>
                    <td className="py-3 px-4 font-sans text-xs">สูญเสียสูงสุดทั้งตายก่อนวัยและอัมพฤกษ์อัมพาต</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition bg-[#f8f9fb]">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">2. โรคหัวใจขาดเลือด (IHD)</td>
                    <td className="py-3 px-4 text-right font-bold text-rose-700">358,300</td>
                    <td className="py-3 px-4 text-right text-rose-600">310,200 (86.6%)</td>
                    <td className="py-3 px-4 text-right text-amber-600">48,100 (13.4%)</td>
                    <td className="py-3 px-4 text-right">6.45 : 1</td>
                    <td className="py-3 px-4 font-sans text-xs">ภาระหนักจากการเสียชีวิตเฉียบพลัน</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">3. โรคเบาหวาน (Diabetes)</td>
                    <td className="py-3 px-4 text-right font-bold">328,300</td>
                    <td className="py-3 px-4 text-right text-rose-600">145,800 (44.4%)</td>
                    <td className="py-3 px-4 text-right text-amber-600">182,500 (55.6%)</td>
                    <td className="py-3 px-4 text-right">0.80 : 1</td>
                    <td className="py-3 px-4 font-sans text-xs">ภาระความพิการจากไตวาย ตาบอด ตัดเท้า</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition bg-[#f8f9fb]">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">4. โรคปอดอักเสบ (Pneumonia)</td>
                    <td className="py-3 px-4 text-right font-bold">293,600</td>
                    <td className="py-3 px-4 text-right text-rose-600">275,400 (93.8%)</td>
                    <td className="py-3 px-4 text-right text-amber-600">18,200 (6.2%)</td>
                    <td className="py-3 px-4 text-right">15.13 : 1</td>
                    <td className="py-3 px-4 font-sans text-xs">การติดเชื้อรุนแรงที่ทำให้เสียชีวิตเฉียบพลัน</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">5. มะเร็งตับและท่อน้ำดี</td>
                    <td className="py-3 px-4 text-right font-bold">270,500</td>
                    <td className="py-3 px-4 text-right text-rose-600">258,100 (95.4%)</td>
                    <td className="py-3 px-4 text-right text-amber-600">12,400 (4.6%)</td>
                    <td className="py-3 px-4 text-right">20.81 : 1</td>
                    <td className="py-3 px-4 font-sans text-xs">มะเร็งอันดับ 1 ที่พรากชีวิตก่อนวัยอันควร</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition bg-amber-50/30">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">6. ข้อเข่าเสื่อม (Knee OA)</td>
                    <td className="py-3 px-4 text-right font-bold text-amber-700">235,600</td>
                    <td className="py-3 px-4 text-right text-slate-400">0 (0.0%)</td>
                    <td className="py-3 px-4 text-right font-bold text-amber-700">235,600 (100.0%)</td>
                    <td className="py-3 px-4 text-right">0 : 1</td>
                    <td className="py-3 px-4 font-sans text-xs font-bold text-amber-800">ภาระความพิการ (YLD) สูงสุดในผู้สูงอายุ</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition bg-[#f8f9fb]">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">7. ปอดอุดกั้นเรื้อรัง (COPD)</td>
                    <td className="py-3 px-4 text-right font-bold">216,300</td>
                    <td className="py-3 px-4 text-right text-rose-600">134,200 (62.0%)</td>
                    <td className="py-3 px-4 text-right text-amber-600">82,100 (38.0%)</td>
                    <td className="py-3 px-4 text-right">1.63 : 1</td>
                    <td className="py-3 px-4 font-sans text-xs">เหนื่อยหอบเรื้อรังและกำเริบซ้ำซ้อน</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">8. โรคไตเรื้อรัง (CKD)</td>
                    <td className="py-3 px-4 text-right font-bold">207,300</td>
                    <td className="py-3 px-4 text-right text-rose-600">162,100 (78.2%)</td>
                    <td className="py-3 px-4 text-right text-amber-600">45,200 (21.8%)</td>
                    <td className="py-3 px-4 text-right">3.59 : 1</td>
                    <td className="py-3 px-4 font-sans text-xs">ภาระฟอกเลือดล้างไตและการเสียชีวิต</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition bg-[#f8f9fb]">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">9. ภาวะสมองเสื่อม (Dementia)</td>
                    <td className="py-3 px-4 text-right font-bold text-purple-700">192,700</td>
                    <td className="py-3 px-4 text-right text-rose-600">38,500 (20.0%)</td>
                    <td className="py-3 px-4 text-right font-bold text-purple-700">154,200 (80.0%)</td>
                    <td className="py-3 px-4 text-right">0.25 : 1</td>
                    <td className="py-3 px-4 font-sans text-xs">ภาวะพึ่งพิงระยะยาว (Long-term Care Burden)</td>
                  </tr>
                  <tr className="hover:bg-[#f0f3f8] transition">
                    <td className="py-3 px-4 font-bold text-[#0b3558]">10. การพลัดตกหกล้ม (Falls)</td>
                    <td className="py-3 px-4 text-right font-bold">168,200</td>
                    <td className="py-3 px-4 text-right text-rose-600">72,400 (43.0%)</td>
                    <td className="py-3 px-4 text-right text-amber-600">95,800 (57.0%)</td>
                    <td className="py-3 px-4 text-right">0.76 : 1</td>
                    <td className="py-3 px-4 font-sans text-xs">กระดูกหัก ติดเตียง และเสียชีวิตจากภาวะแทรกซ้อน</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-[#f8f9fb] border-t border-[#d4e0ed] text-xs text-[#476788] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <span>
                <strong>แหล่งอ้างอิง:</strong> โครงการประเมินภาระโรคและปัจจัยเสี่ยงของประเทศไทย (BOD Thailand) (2566).
              </span>
              <a
                href="https://bodthailand.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#006bff] hover:underline font-semibold flex items-center gap-1"
              >
                <span>bodthailand.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 7: METHODOLOGY & INTERACTIVE CALCULATOR             */}
      {/* ======================================================== */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Morbidity / Mortality Rate Calculator */}
            <div className="bg-white rounded-2xl p-6 border border-[#d4e0ed] shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#0b3558]">
                <Calculator className="w-5 h-5 text-[#006bff]" />
                <h3 className="text-base font-bold">เครื่องคำนวณอัตราป่วย / อัตราตายต่อแสนประชากรสด</h3>
              </div>
              <p className="text-xs text-[#476788]">
                สูตร: (จำนวนผู้ป่วยหรือผู้เสียชีวิต ÷ จำนวนประชากรเป้าหมาย) × 100,000
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-[#476788] block mb-1">
                    จำนวนผู้ป่วยหรือผู้เสียชีวิต (คน):
                  </label>
                  <input
                    type="number"
                    value={calcCases}
                    onChange={e => setCalcCases(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#d4e0ed] text-sm font-mono focus:outline-none focus:border-[#006bff]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#476788] block mb-1">
                    จำนวนประชากรสูงอายุทั้งหมด (คน):
                  </label>
                  <input
                    type="number"
                    value={calcPop}
                    onChange={e => setCalcPop(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#d4e0ed] text-sm font-mono focus:outline-none focus:border-[#006bff]"
                  />
                </div>

                <div className="bg-[#f0f3f8] p-4 rounded-xl border border-[#d4e0ed] text-center">
                  <span className="text-xs text-[#476788] font-bold uppercase">ผลลัพธ์อัตราต่อแสนประชากร</span>
                  <div className="text-3xl font-extrabold text-[#006bff] font-mono mt-1">
                    {calculatedRate}
                  </div>
                  <span className="text-[11px] text-[#476788]">ต่อแสนประชากรสูงอายุ</span>
                </div>
              </div>
            </div>

            {/* Live DALY Calculator */}
            <div className="bg-white rounded-2xl p-6 border border-[#d4e0ed] shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-[#0b3558]">
                <Scale className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold">เครื่องคำนวณภาระโรคสด (DALY = YLL + YLD)</h3>
              </div>
              <p className="text-xs text-[#476788]">
                DALY วัดปีสุขภาวะที่สูญเสียไปทั้งหมดจากทั้งการตายก่อนวัย (YLL) และการอยู่กับความพิการ (YLD)
              </p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-[#476788] block mb-1">
                    ปีที่สูญเสียจากการตายก่อนวัย (YLL) (ปี):
                  </label>
                  <input
                    type="number"
                    value={calcYLL}
                    onChange={e => setCalcYLL(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#d4e0ed] text-sm font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#476788] block mb-1">
                    ปีที่อยู่กับความพิการ (YLD) (ปี):
                  </label>
                  <input
                    type="number"
                    value={calcYLD}
                    onChange={e => setCalcYLD(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#d4e0ed] text-sm font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="bg-[#f0f3f8] p-4 rounded-xl border border-[#d4e0ed] text-center">
                  <span className="text-xs text-[#476788] font-bold uppercase">ผลลัพธ์การสูญเสียปีสุขภาวะรวม (DALY)</span>
                  <div className="text-3xl font-extrabold text-emerald-700 font-mono mt-1">
                    {calculatedDALY.toLocaleString('th-TH')}
                  </div>
                  <span className="text-[11px] text-[#476788]">ปีสุขภาวะที่สูญเสีย (Disability-Adjusted Life Years)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 8: APA 7th REFERENCES (13 ACADEMIC CITATIONS)       */}
      {/* ======================================================== */}
      {activeTab === 'references' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#d4e0ed] shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-[#d4e0ed] pb-3">
              <BookOpen className="w-5 h-5 text-[#006bff]" />
              <div>
                <h3 className="text-base font-bold text-[#0b3558]">
                  รายการอ้างอิงวิชาการมาตรฐานสากล (APA 7th Edition) ครบ 13 แหล่ง
                </h3>
                <p className="text-xs text-[#476788]">
                  ตรวจสอบย้อนกลับได้ทุกแหล่งข้อมูลสถิติระบาดวิทยา ประชากรศาสตร์ และคลังข้อมูลสาธารณสุข
                </p>
              </div>
            </div>

            <ol className="divide-y divide-[#f0f3f8] text-xs sm:text-sm text-[#0b3558] space-y-3 pt-2">
              <li className="pt-3">
                <strong>1. </strong> สถาบันวิจัยประชากรและสังคม มหาวิทยาลัยมหิดล. (2569). <em>มิเตอร์ประเทศไทย: ข้อมูลประชากรของประเทศไทยแบบทันเวลา (Real-time Thailand Population Meter)</em>. มหาวิทยาลัยมหิดล.{' '}
                <a href="https://www.ipsr.mahidol.ac.th" target="_blank" rel="noopener noreferrer" className="text-[#006bff] hover:underline font-semibold ml-1">
                  https://www.ipsr.mahidol.ac.th &rarr;
                </a>
              </li>
              <li className="pt-3">
                <strong>2. </strong> กรมการแพทย์ กระทรวงสาธารณสุข. (2569). <em>ระบบสารสนเทศ DMS Care Tools เพื่อการคัดกรองสุขภาพผู้สูงอายุเชิงลึกและการส่งต่อทางการแพทย์</em>. กรมการแพทย์.{' '}
                <a href="https://www.dms.go.th" target="_blank" rel="noopener noreferrer" className="text-[#006bff] hover:underline font-semibold ml-1">
                  https://www.dms.go.th &rarr;
                </a>
              </li>
              <li className="pt-3">
                <strong>3. </strong> สำนักบริหารการทะเบียน กรมการปกครอง กระทรวงมหาดไทย. (2567). <em>รายงานสถิติจำนวนประชากรและบ้านทางการ พ.ศ. 2565–2567</em>.{' '}
                <a href="https://stat.bora.dopa.go.th" target="_blank" rel="noopener noreferrer" className="text-[#006bff] hover:underline font-semibold ml-1">
                  https://stat.bora.dopa.go.th &rarr;
                </a>
              </li>
              <li className="pt-3">
                <strong>4. </strong> กองยุทธศาสตร์และแผนงาน สำนักงานปลัดกระทรวงสาธารณสุข. (2567). <em>สถิติสาธารณสุข พ.ศ. 2567 (Public Health Statistics 2024)</em>. กระทรวงสาธารณสุข.{' '}
                <a href="https://bps.moph.go.th" target="_blank" rel="noopener noreferrer" className="text-[#006bff] hover:underline font-semibold ml-1">
                  https://bps.moph.go.th &rarr;
                </a>
              </li>
              <li className="pt-3">
                <strong>5. </strong> กองโรคไม่ติดต่อ กรมควบคุมโรค กระทรวงสาธารณสุข. (2567). <em>รายงานสถานการณ์โรค NCDs เบาหวาน ความดันโลหิตสูง และปัจจัยเสี่ยงที่เกี่ยวข้องในประเทศไทย</em>.{' '}
                <a href="https://ddc.moph.go.th" target="_blank" rel="noopener noreferrer" className="text-[#006bff] hover:underline font-semibold ml-1">
                  https://ddc.moph.go.th &rarr;
                </a>
              </li>
              <li className="pt-3">
                <strong>6. </strong> สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ กรมการแพทย์. (2568). <em>แนวทางการคัดกรองและประเมินสุขภาพผู้สูงอายุ 9 ด้านตามมาตรฐานเวชศาสตร์ผู้สูงอายุ</em>.{' '}
                <a href="http://www.dms.go.th/aging" target="_blank" rel="noopener noreferrer" className="text-[#006bff] hover:underline font-semibold ml-1">
                  http://www.dms.go.th/aging &rarr;
                </a>
              </li>
              <li className="pt-3">
                <strong>7. </strong> สำนักงานสถิติแห่งชาติ. (2567). <em>การสำรวจประชากรสูงอายุในประเทศไทย พ.ศ. 2567</em>. กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม.{' '}
                <a href="https://www.nso.go.th" target="_blank" rel="noopener noreferrer" className="text-[#006bff] hover:underline font-semibold ml-1">
                  https://www.nso.go.th &rarr;
                </a>
              </li>
              <li className="pt-3">
                <strong>8. </strong> มูลนิธิสถาบันวิจัยและพัฒนาผู้สูงอายุไทย (มส.ผส.). (2567). <em>รายงานสถานการณ์ผู้สูงอายุไทย ประจำปี 2566–2567</em>. สำนักงานกองทุนสนับสนุนการสร้างเสริมสุขภาพ (สสส.).{' '}
                <a href="https://thaitgri.org" target="_blank" rel="noopener noreferrer" className="text-[#006bff] hover:underline font-semibold ml-1">
                  https://thaitgri.org &rarr;
                </a>
              </li>
              <li className="pt-3">
                <strong>9. </strong> โครงการประเมินภาระโรคและปัจจัยเสี่ยงของประเทศไทย (BOD Thailand). (2566). <em>รายงานภาระโรคจากสาเหตุการตายและความพิการของประชากรไทย พ.ศ. 2562–2566</em>. สำนักงานพัฒนานโยบายสุขภาพระหว่างประเทศ (IHPP).{' '}
                <a href="https://bodthailand.com" target="_blank" rel="noopener noreferrer" className="text-[#006bff] hover:underline font-semibold ml-1">
                  https://bodthailand.com &rarr;
                </a>
              </li>
              <li className="pt-3">
                <strong>10. </strong> ศูนย์เทคโนโลยีสารสนเทศและการสื่อสาร สำนักงานปลัดกระทรวงสาธารณสุข. (2568). <em>ระบบคลังข้อมูลด้านการแพทย์และสุขภาพ (Health Data Center: HDC)</em>.{' '}
                <a href="https://hdcservice.moph.go.th" target="_blank" rel="noopener noreferrer" className="text-[#006bff] hover:underline font-semibold ml-1">
                  https://hdcservice.moph.go.th &rarr;
                </a>
              </li>
              <li className="pt-3">
                <strong>11. </strong> สำนักงานหลักประกันสุขภาพแห่งชาติ (สปสช.). (2567). <em>รายงานผลการดำเนินงานกองทุนบริการดูแลระยะยาวด้านสาธารณสุขสำหรับผู้สูงอายุที่มีภาวะพึ่งพิง (Long-Term Care)</em>.{' '}
                <a href="https://www.nhso.go.th" target="_blank" rel="noopener noreferrer" className="text-[#006bff] hover:underline font-semibold ml-1">
                  https://www.nhso.go.th &rarr;
                </a>
              </li>
              <li className="pt-3">
                <strong>12. </strong> กรมกิจการผู้สูงอายุ กระทรวงการพัฒนาสังคมและความมั่นคงของมนุษย์. (2567). <em>สถิติผู้สูงอายุและสิทธิประโยชน์ทางสังคม</em>.{' '}
                <a href="https://www.dop.go.th" target="_blank" rel="noopener noreferrer" className="text-[#006bff] hover:underline font-semibold ml-1">
                  https://www.dop.go.th &rarr;
                </a>
              </li>
              <li className="pt-3">
                <strong>13. </strong> World Health Organization. (2020). <em>Integrated care for older people (ICOPE): Guidance for person-centred assessment and pathways in primary care</em>. World Health Organization.{' '}
                <a href="https://www.who.int/publications/i/item/9789241550109" target="_blank" rel="noopener noreferrer" className="text-[#006bff] hover:underline font-semibold ml-1">
                  https://www.who.int/publications/i/item/9789241550109 &rarr;
                </a>
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
