'use client';

import React, { useState } from 'react';
import '@/components/analytics/ChartSetup';
import { Doughnut, Bar } from 'react-chartjs-2';
import { functionalAbilityData } from '@/data/agingData';
import { Activity, ShieldAlert, Heart, CheckCircle2, AlertTriangle, Eye, Volume2, Droplets, Apple, Moon, Footprints, Layers } from 'lucide-react';

const ADL_5YEAR_TREND = [
  { year: '2565', social: 97.1, home: 2.3, bed: 0.6, totalElderly: 12519926 },
  { year: '2566', social: 96.9, home: 2.5, bed: 0.6, totalElderly: 12833199 },
  { year: '2567', social: 2567, socialPct: 96.8, homePct: 2.6, bedPct: 0.6, totalElderly: 13150000 },
  { year: '2568', socialPct: 96.6, homePct: 2.7, bedPct: 0.7, totalElderly: 13470000 },
  { year: '2569', socialPct: 96.5, homePct: 2.8, bedPct: 0.7, totalElderly: 13794128 }
];

const GERIATRIC_SYNDROMES = [
  { name: 'สุขภาพช่องปากเคี้ยวไม่ได้ (Oral Impairment)', pct: 41.2, count: 5683180, icon: Apple, color: '#0284c7' },
  { name: 'ปัญหาการนอนหลับ (Sleep Disorders)', pct: 38.5, count: 5310739, icon: Moon, color: '#6366f1' },
  { name: 'การมองเห็นบกพร่อง (Vision Impairment)', pct: 18.2, count: 2509780, icon: Eye, color: '#0d9488' },
  { name: 'มวลกล้ามเนื้อน้อย/เปราะบาง (Frailty/Sarcopenia)', pct: 16.5, count: 2276031, icon: Footprints, color: '#d97706' },
  { name: 'กลั้นปัสสาวะไม่อยู่ (Urinary Incontinence)', pct: 14.8, count: 2041530, icon: Droplets, color: '#f97316' },
  { name: 'เสี่ยงหกล้ม (Falls Risk TUGT)', pct: 13.1, count: 1807030, icon: AlertTriangle, color: '#ef4444' }
];

export const FunctionalADLSection: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'stacked' | 'donut'>('stacked');
  const years = ['ปี 2565', 'ปี 2566', 'ปี 2567', 'ปี 2568', 'ปี 2569'];

  // 1. 100% Stacked Bar: ADL Transition 2565-2569
  const adlStackedData = {
    labels: years,
    datasets: [
      {
        label: 'ติดเตียง (Bed-bound 0.5–0.7%)',
        data: [0.6, 0.6, 0.6, 0.7, 0.7],
        backgroundColor: '#ef4444',
        borderRadius: 4
      },
      {
        label: 'ติดบ้าน (Home-bound 2.3–2.8%)',
        data: [2.3, 2.5, 2.6, 2.7, 2.8],
        backgroundColor: '#f59e0b',
        borderRadius: 4
      },
      {
        label: 'ติดสังคม (Social-bound 96.5–97.1%)',
        data: [97.1, 96.9, 96.8, 96.6, 96.5],
        backgroundColor: '#10b981',
        borderRadius: 4
      }
    ]
  };

  const adlStackedOptions = {
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
      x: { stacked: true },
      y: {
        stacked: true,
        max: 100,
        title: { display: true, text: 'สัดส่วนร้อยละ 100%' }
      }
    }
  };

  // 2. Donut: Latest ADL Distribution (2569)
  const adlDonutData = {
    labels: ['ติดสังคม (Social-bound)', 'ติดบ้าน (Home-bound)', 'ติดเตียง (Bed-bound)'],
    datasets: [
      {
        data: [96.5, 2.8, 0.7],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        hoverOffset: 6,
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  const adlDonutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' as const },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const counts = [13311333, 386235, 96559];
            return ` ${ctx.label}: ${ctx.parsed}% (~${(counts[ctx.dataIndex] / 1000).toLocaleString()} พันคน)`;
          }
        }
      }
    },
    cutout: '65%'
  };

  // 3. Horizontal Bar: Geriatric Syndromes
  const syndromesChartData = {
    labels: GERIATRIC_SYNDROMES.map(s => s.name.split(' (')[0]),
    datasets: [
      {
        label: 'ความชุกร้อยละ (% Prevalence)',
        data: GERIATRIC_SYNDROMES.map(s => s.pct),
        backgroundColor: GERIATRIC_SYNDROMES.map(s => s.color),
        borderRadius: 6
      }
    ]
  };

  const syndromesChartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const item = GERIATRIC_SYNDROMES[ctx.dataIndex];
            return ` ความชุก: ${item.pct}% (ประมาณ ${(item.count / 1000000).toFixed(2)} ล้านคน)`;
          }
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'ร้อยละ (% Prevalence)' },
        max: 50
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#d4e0ed] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#006bff] uppercase tracking-wider mb-1">
            <Activity className="w-4 h-4" />
            <span>Functional Ability & Geriatric Syndromes</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#0b3558]">
            ความสามารถในการดำเนินชีวิต (ADL) และกลุ่มอาการผู้สูงอายุ 5 ปี (2565–2569)
          </h2>
          <p className="text-xs text-[#476788] mt-1">
            ประเมินระดับการพึ่งพาตนเองตามเกณฑ์ Barthel ADL และวิเคราะห์ความชุกของ Geriatric Syndromes สำคัญ
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedView('stacked')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedView === 'stacked'
                ? 'bg-[#006bff] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            แนวโน้ม 5 ปี (100% Stacked)
          </button>
          <button
            type="button"
            onClick={() => setSelectedView('donut')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              selectedView === 'donut'
                ? 'bg-[#006bff] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            สัดส่วนปี 2569 (Donut)
          </button>
        </div>
      </div>

      {/* 2. ADL & Geriatric Syndromes Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ADL Visualizer */}
        <div className="bg-white rounded-2xl p-6 border border-[#d4e0ed] shadow-sm flex flex-col justify-between">
          <div className="mb-3">
            <h3 className="text-base font-bold text-[#0b3558]">
              {selectedView === 'stacked'
                ? 'แนวโน้มการเปลี่ยนผ่านกลุ่ม ADL 5 ปี (พ.ศ. 2565–2569)'
                : 'สัดส่วนกลุ่มศักยภาพ ADL ล่าสุด (พ.ศ. 2569)'}
            </h3>
            <p className="text-xs text-[#476788]">
              กลุ่มติดสังคมส่วนใหญ่ 96.5–97.1% ขณะที่กลุ่มติดบ้าน/ติดเตียงเพิ่มขึ้นเป็น 4.82 แสนคน
            </p>
          </div>
          <div className="h-72 w-full flex items-center justify-center">
            {selectedView === 'stacked' ? (
              <Bar data={adlStackedData} options={adlStackedOptions} />
            ) : (
              <Doughnut data={adlDonutData} options={adlDonutOptions} />
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#f0f3f8] text-center text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <span className="font-bold text-emerald-800">ติดสังคม 96.5%</span>
              <div className="text-[11px] text-emerald-600 mt-0.5">13.31 ล้านคน</div>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200">
              <span className="font-bold text-amber-800">ติดบ้าน 2.8%</span>
              <div className="text-[11px] text-amber-600 mt-0.5">3.86 แสนคน</div>
            </div>
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
              <span className="font-bold text-rose-800">ติดเตียง 0.7%</span>
              <div className="text-[11px] text-rose-600 mt-0.5">9.65 หมื่นคน</div>
            </div>
          </div>
        </div>

        {/* Geriatric Syndromes Horizontal Bar */}
        <div className="bg-white rounded-2xl p-6 border border-[#d4e0ed] shadow-sm flex flex-col justify-between">
          <div className="mb-3">
            <h3 className="text-base font-bold text-[#0b3558]">
              ความชุกกลุ่มอาการผู้สูงอายุ (Geriatric Syndromes Prevalence)
            </h3>
            <p className="text-xs text-[#476788]">
              ปัญหาช่องปาก การนอนหลับ และการมองเห็น มีความชุกสูงที่สุดในกลุ่มผู้สูงอายุไทย
            </p>
          </div>
          <div className="h-72 w-full">
            <Bar data={syndromesChartData} options={syndromesChartOptions} />
          </div>
          <div className="mt-4 pt-3 border-t border-[#f0f3f8] flex items-center justify-between text-xs text-[#476788]">
            <span>ปัญหาช่องปาก/เคี้ยวอาหารไม่ได้:</span>
            <span className="font-bold text-[#0b3558] font-mono text-sm">41.2% (5.68 ล้านคน)</span>
          </div>
        </div>
      </div>

      {/* 3. Detailed Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {GERIATRIC_SYNDROMES.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-[#d4e0ed] shadow-sm hover:border-[#006bff] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-slate-50 text-[#006bff]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 font-mono">
                    {item.pct}%
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#0b3558] mb-1">
                  {item.name}
                </h4>
              </div>
              <div className="text-[11px] text-[#476788] mt-4 pt-3 border-t border-[#f0f3f8] flex items-center justify-between">
                <span>ผู้ได้รับผลกระทบ:</span>
                <span className="font-bold text-[#0b3558] font-mono">
                  {(item.count / 1000000).toFixed(2)} ล้านคน
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};