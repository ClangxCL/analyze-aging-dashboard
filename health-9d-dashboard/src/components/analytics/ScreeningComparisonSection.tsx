'use client';

import React, { useState, useMemo } from 'react';
import '@/components/analytics/ChartSetup';
import { Line, Bar, Radar } from 'react-chartjs-2';
import { screening9dData } from '@/data/agingData';
import { Activity, ShieldCheck, ArrowRight, Layers, Eye, Smile, Footprints, Brain, Ear, Heart, Apple, Droplets, CheckCircle2 } from 'lucide-react';

interface DomainStat {
  key: string;
  nameTH: string;
  shortName: string;
  tool: string;
  riskPct2566: number;
  riskPct2567: number;
  riskPct2568: number;
  riskPct2569: number;
  screened2569: number;
  dmsReferralPct: number;
  icon: any;
}

const NINE_DOMAINS_DATA: DomainStat[] = [
  {
    key: 'oral',
    nameTH: 'สุขภาพช่องปาก (20 ฟันแท้ 4 คู่สบ)',
    shortName: 'ช่องปาก',
    tool: 'ตรวจสุขภาพช่องปากผู้สูงอายุ',
    riskPct2566: 39.8,
    riskPct2567: 40.2,
    riskPct2568: 40.8,
    riskPct2569: 41.2,
    screened2569: 10450000,
    dmsReferralPct: 48.5,
    icon: Smile
  },
  {
    key: 'vision',
    nameTH: 'สายตาและการมองเห็น (Snellen / E-chart)',
    shortName: 'สายตา',
    tool: 'Snellen chart / นับนิ้ว 3 เมตร',
    riskPct2566: 14.2,
    riskPct2567: 14.8,
    riskPct2568: 15.1,
    riskPct2569: 15.4,
    screened2569: 10520000,
    dmsReferralPct: 32.4,
    icon: Eye
  },
  {
    key: 'mobility',
    nameTH: 'การเคลื่อนไหวร่างกายและการหกล้ม (TUGT)',
    shortName: 'การหกล้ม/เคลื่อนไหว',
    tool: 'Timed Up and Go Test (TUGT >= 12 วินาที)',
    riskPct2566: 12.1,
    riskPct2567: 12.4,
    riskPct2568: 12.8,
    riskPct2569: 13.1,
    screened2569: 10480000,
    dmsReferralPct: 28.7,
    icon: Footprints
  },
  {
    key: 'hearing',
    nameTH: 'การได้ยิน (Whisper Test / Finger Rub)',
    shortName: 'การได้ยิน',
    tool: 'แบบประเมินเสียงกระซิบ / เครื่องตรวจเสียง',
    riskPct2566: 9.8,
    riskPct2567: 10.1,
    riskPct2568: 10.4,
    riskPct2569: 10.7,
    screened2569: 10390000,
    dmsReferralPct: 24.1,
    icon: Ear
  },
  {
    key: 'cognition',
    nameTH: 'ความคิดความจำ/สมองเสื่อm (AMT4 / Mini-Cog)',
    shortName: 'สมองเสื่อม/ความจำ',
    tool: 'Abbreviated Mental Test 4 (AMT4) / Mini-Cog',
    riskPct2566: 5.6,
    riskPct2567: 5.8,
    riskPct2568: 6.0,
    riskPct2569: 6.2,
    screened2569: 10500000,
    dmsReferralPct: 21.8,
    icon: Brain
  },
  {
    key: 'depression',
    nameTH: 'สุขภาพจิตและภาวะซึมเศร้า (2Q / 9Q)',
    shortName: 'สุขภาพจิต/ซึมเศร้า',
    tool: 'แบบคัดกรอง 2Q / 9Q',
    riskPct2566: 4.5,
    riskPct2567: 4.8,
    riskPct2568: 5.0,
    riskPct2569: 5.2,
    screened2569: 10420000,
    dmsReferralPct: 18.5,
    icon: Heart
  },
  {
    key: 'nutrition',
    nameTH: 'ภาวะโภชนาการ (Mini Nutritional Assessment: MNA)',
    shortName: 'โภชนาการ',
    tool: 'MNA-SF (คัดกรองภาวะทุพโภชนาการ)',
    riskPct2566: 6.8,
    riskPct2567: 7.1,
    riskPct2568: 7.3,
    riskPct2569: 7.5,
    screened2569: 10400000,
    dmsReferralPct: 19.2,
    icon: Apple
  },
  {
    key: 'incontinence',
    nameTH: 'การกลั้นปัสสาวะ (Urinary Incontinence)',
    shortName: 'กลั้นปัสสาวะ',
    tool: 'แบบคัดกรองปัสสาวะเล็ดราด',
    riskPct2566: 4.1,
    riskPct2567: 4.3,
    riskPct2568: 4.5,
    riskPct2569: 4.7,
    screened2569: 10380000,
    dmsReferralPct: 14.6,
    icon: Droplets
  },
  {
    key: 'adl',
    nameTH: 'ความสามารถในการดำเนินชีวิต (Barthel ADL)',
    shortName: 'กิจวัตร ADL',
    tool: 'Barthel Activities of Daily Living Index',
    riskPct2566: 3.2,
    riskPct2567: 3.3,
    riskPct2568: 3.4,
    riskPct2569: 3.5,
    screened2569: 10580000,
    dmsReferralPct: 16.3,
    icon: CheckCircle2
  }
];

export const ScreeningComparisonSection: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const years = ['2566', '2567', '2568', '2569'];

  // Radar Chart: Comparison of all 9 domains across years
  const radarData = useMemo(() => {
    return {
      labels: NINE_DOMAINS_DATA.map(d => d.shortName),
      datasets: [
        {
          label: 'ปี 2566 (% เสี่ยง)',
          data: NINE_DOMAINS_DATA.map(d => d.riskPct2566),
          borderColor: '#94a3b8',
          backgroundColor: 'rgba(148, 163, 184, 0.15)',
          borderWidth: 2,
          pointRadius: 3
        },
        {
          label: 'ปี 2567 (% เสี่ยง)',
          data: NINE_DOMAINS_DATA.map(d => d.riskPct2567),
          borderColor: '#38bdf8',
          backgroundColor: 'rgba(56, 189, 248, 0.15)',
          borderWidth: 2,
          pointRadius: 3
        },
        {
          label: 'ปี 2568 (% เสี่ยง)',
          data: NINE_DOMAINS_DATA.map(d => d.riskPct2568),
          borderColor: '#0284c7',
          backgroundColor: 'rgba(2, 132, 199, 0.15)',
          borderWidth: 2,
          pointRadius: 3
        },
        {
          label: 'ปี 2569 (% เสี่ยง)',
          data: NINE_DOMAINS_DATA.map(d => d.riskPct2569),
          borderColor: '#0b3558',
          backgroundColor: 'rgba(11, 53, 88, 0.25)',
          borderWidth: 2.5,
          pointRadius: 4
        }
      ]
    };
  }, []);

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` ${ctx.dataset.label}: ${ctx.parsed.r}%`
        }
      }
    },
    scales: {
      r: {
        angleLines: { color: '#e2e8f0' },
        grid: { color: '#f1f5f9' },
        pointLabels: {
          font: { size: 11, weight: 'bold' as const }
        },
        ticks: { backdropColor: 'transparent', stepSize: 10 },
        suggestedMin: 0,
        suggestedMax: 45
      }
    }
  };

  // Grouped Bar Chart: Comparison of 9 domains in 2569
  const barData = useMemo(() => {
    const sorted = [...NINE_DOMAINS_DATA].sort((a, b) => b.riskPct2569 - a.riskPct2569);
    return {
      labels: sorted.map(d => d.shortName),
      datasets: [
        {
          label: 'ร้อยละที่พบความเสี่ยง (% Risk)',
          data: sorted.map(d => d.riskPct2569),
          backgroundColor: '#006bff',
          borderRadius: 6
        },
        {
          label: 'ร้อยละส่งต่อรับการดูแล DMS (%)',
          data: sorted.map(d => d.dmsReferralPct),
          backgroundColor: '#10b981',
          borderRadius: 6
        }
      ]
    };
  }, []);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` ${ctx.dataset.label}: ${ctx.parsed.y}%`
        }
      }
    },
    scales: {
      y: {
        title: { display: true, text: 'ร้อยละ (%)' },
        min: 0,
        max: 55
      }
    }
  };

  const activeStat = NINE_DOMAINS_DATA.find(d => d.key === selectedDomain);

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#d4e0ed] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#006bff] uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            <span>Health Screening Epidemiology • การคัดกรอง 9 ด้านระดับชาติ</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#0b3558]">
            ผลการคัดกรองสุขภาพผู้สูงอายุ 9 ด้าน (HDC สธ. & DMS Care Tools 2566–2569)
          </h2>
          <p className="text-xs text-[#476788] mt-1">
            เปรียบเทียบความชุกของความเสี่ยงใน 9 มิติสุขภาพ พร้อมอัตราการส่งต่อรับการดูแลรักษา
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            ครอบคลุม 10.5M+ คน (78%)
          </span>
        </div>
      </div>

      {/* 2. Domain Filter Pills */}
      <div className="bg-white rounded-2xl p-4 border border-[#d4e0ed] shadow-sm">
        <div className="text-xs font-bold text-[#476788] mb-2">เลือกมิติสุขภาพเพื่อเจาะลึกรายละเอียด:</div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedDomain('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedDomain === 'all'
                ? 'bg-[#006bff] text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            แสดงภาพรวม 9 ด้านทั้งหมด
          </button>
          {NINE_DOMAINS_DATA.map(d => {
            const Icon = d.icon;
            const isSelected = selectedDomain === d.key;
            return (
              <button
                key={d.key}
                type="button"
                onClick={() => setSelectedDomain(d.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#0b3558] text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{d.shortName}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                  {d.riskPct2569}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Detailed Drilldown Card if specific domain selected */}
      {activeStat && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-600 text-white">
                <activeStat.icon className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-extrabold text-[#0b3558]">{activeStat.nameTH}</h3>
                <p className="text-xs text-[#476788]">เครื่องมือคัดกรอง: {activeStat.tool}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <div className="bg-white px-4 py-2 rounded-xl border border-blue-200 text-center">
              <span className="text-[#476788] block text-[11px]">คัดกรองแล้ว (คน)</span>
              <span className="font-extrabold text-[#0b3558] text-sm font-mono">{activeStat.screened2569.toLocaleString()}</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border border-blue-200 text-center">
              <span className="text-[#476788] block text-[11px]">ความเสี่ยงปี 2569</span>
              <span className="font-extrabold text-amber-600 text-sm font-mono">{activeStat.riskPct2569}%</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-xl border border-blue-200 text-center">
              <span className="text-[#476788] block text-[11px]">ส่งต่อ DMS</span>
              <span className="font-extrabold text-emerald-600 text-sm font-mono">{activeStat.dmsReferralPct}%</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart: 9 Dimensions Profile */}
        <div className="bg-white rounded-2xl p-6 border border-[#d4e0ed] shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#0b3558]">
              เรดาร์ความเสี่ยงสุขภาพผู้สูงอายุ 9 ด้าน (Multi-Axis Radar 2566–2569)
            </h3>
            <p className="text-xs text-[#476788]">
              แสดงรูปทรงความเสี่ยงเชิงเปรียบเทียบ ช่องปาก สายตา และหกล้ม เป็นประเด็นที่มีความชุกสูงสุด
            </p>
          </div>
          <div className="h-80 w-full flex items-center justify-center">
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        {/* Grouped Bar Chart: Risk vs DMS Referral */}
        <div className="bg-white rounded-2xl p-6 border border-[#d4e0ed] shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#0b3558]">
              เปรียบเทียบร้อยละความเสี่ยง HDC กับ อัตราส่งต่อ DMS (ปี 2569)
            </h3>
            <p className="text-xs text-[#476788]">
              ช่องปากพบความเสี่ยงสูงสุด 41.2% และมีอัตราส่งต่อรักษาเฉพาะทางในระบบ DMS 48.5%
            </p>
          </div>
          <div className="h-80 w-full">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* 5. Comparison Table */}
      <div className="bg-white rounded-2xl border border-[#d4e0ed] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#d4e0ed] flex items-center justify-between">
          <h3 className="text-base font-bold text-[#0b3558]">
            ตารางผลคัดกรอง 9 ด้านเชิงระบาดวิทยา (HDC & DMS Care Tools)
          </h3>
          <span className="text-xs text-[#476788]">ข้อมูลสะสม 2566–2569</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#0b3558] text-white font-bold text-xs">
              <tr>
                <th className="py-3 px-4">มิติสุขภาพ 9 ด้าน</th>
                <th className="py-3 px-4">เครื่องมือคัดกรอง</th>
                <th className="py-3 px-4 text-right">เสี่ยงปี 2566</th>
                <th className="py-3 px-4 text-right">เสี่ยงปี 2567</th>
                <th className="py-3 px-4 text-right">เสี่ยงปี 2568</th>
                <th className="py-3 px-4 text-right">เสี่ยงปี 2569</th>
                <th className="py-3 px-4 text-right">ส่งต่อ DMS (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d4e0ed] font-mono text-xs">
              {NINE_DOMAINS_DATA.map((row, idx) => (
                <tr
                  key={idx}
                  className={`hover:bg-[#f0f3f8] transition cursor-pointer ${
                    selectedDomain === row.key ? 'bg-blue-50/70 font-semibold' : ''
                  }`}
                  onClick={() => setSelectedDomain(row.key)}
                >
                  <td className="py-2.5 px-4 font-sans font-bold text-[#0b3558] flex items-center gap-2">
                    <row.icon className="w-4 h-4 text-[#006bff]" />
                    <span>{row.nameTH}</span>
                  </td>
                  <td className="py-2.5 px-4 font-sans text-[#476788]">{row.tool}</td>
                  <td className="py-2.5 px-4 text-right text-slate-600">{row.riskPct2566}%</td>
                  <td className="py-2.5 px-4 text-right text-slate-600">{row.riskPct2567}%</td>
                  <td className="py-2.5 px-4 text-right text-slate-600">{row.riskPct2568}%</td>
                  <td className="py-2.5 px-4 text-right font-bold text-amber-600">{row.riskPct2569}%</td>
                  <td className="py-2.5 px-4 text-right font-bold text-emerald-600">{row.dmsReferralPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};