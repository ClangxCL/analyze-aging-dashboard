'use client';

import React, { useState, useMemo } from 'react';
import '@/components/analytics/ChartSetup';
import { Bar } from 'react-chartjs-2';
import { chronicNCDsData } from '@/data/agingData';
import { HeartPulse, AlertCircle, ShieldAlert, Activity, Users, Percent, ArrowRight } from 'lucide-react';

export const ChronicNCDSection: React.FC = () => {
  const [metricMode, setMetricMode] = useState<'pct' | 'cases'>('pct');
  const [focusFilter, setFocusFilter] = useState<'all' | 'cvd'>('all');

  const top10NCDs = useMemo(() => {
    return chronicNCDsData.filter(d => d.ICD10_Code !== 'Multimorbidity');
  }, []);

  const multimorbidity = useMemo(() => {
    return chronicNCDsData.find(d => d.ICD10_Code === 'Multimorbidity');
  }, []);

  // Filtered dataset for chart
  const displayedNCDs = useMemo(() => {
    if (focusFilter === 'cvd') {
      const cvdCodes = ['I10', 'E11', 'N18', 'I60-I69', 'I20-I25'];
      return top10NCDs.filter(d => cvdCodes.includes(d.ICD10_Code));
    }
    return top10NCDs;
  }, [focusFilter, top10NCDs]);

  // Chart configuration
  const chartData = useMemo(() => {
    const isPct = metricMode === 'pct';
    return {
      labels: displayedNCDs.map(d => `${d.Disease_Name_TH} (${d.ICD10_Code})`),
      datasets: [
        {
          label: isPct ? 'ความชุกของโรค (%)' : 'จำนวนผู้ป่วยโดยประมาณ (ล้านคน)',
          data: isPct
            ? displayedNCDs.map(d => d.Prevalence_Pct)
            : displayedNCDs.map(d => Number((d.Estimated_Cases / 1000000).toFixed(2))),
          backgroundColor: displayedNCDs.map(d => {
            if (d.ICD10_Code === 'I10') return '#ef4444'; // HT
            if (d.ICD10_Code === 'E11') return '#f97316'; // DM
            if (d.ICD10_Code === 'N18') return '#8b5cf6'; // CKD
            if (d.ICD10_Code === 'I60-I69') return '#ec4899'; // Stroke
            if (d.ICD10_Code === 'I20-I25') return '#dc2626'; // IHD
            return '#0284c7';
          }),
          borderRadius: 6
        }
      ]
    };
  }, [displayedNCDs, metricMode]);

  const chartOptions = useMemo(() => {
    const isPct = metricMode === 'pct';
    return {
      indexAxis: 'y' as const,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const item = displayedNCDs[context.dataIndex];
              if (isPct) {
                return ` ความชุก: ${item.Prevalence_Pct}% (ผู้ป่วยประมาณ ${(item.Estimated_Cases / 1000000).toFixed(2)} ล้านคน)`;
              }
              return ` ผู้ป่วย: ${(item.Estimated_Cases / 1000000).toFixed(2)} ล้านคน (${item.Prevalence_Pct}%)`;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: isPct ? 'ร้อยละความชุกในผู้สูงอายุ (%)' : 'จำนวนผู้ป่วยโดยประมาณ (ล้านคน)'
          },
          max: isPct ? 60 : 8
        }
      }
    };
  }, [displayedNCDs, metricMode]);

  return (
    <div className="space-y-6">
      {/* 1. Header with Metric & Category Controls */}
      <div className="bg-white rounded-2xl p-6 border border-[#d4e0ed] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#006bff] uppercase tracking-wider mb-1">
            <HeartPulse className="w-4 h-4" />
            <span>NCDs & Chronic Conditions Epidemiology</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#0b3558]">
            ความชุกของโรคไม่ติดต่อเรื้อรัง 10 อันดับแรกในผู้สูงอายุไทย (NCDs)
          </h2>
          <p className="text-xs text-[#476788] mt-1">
            ข้อมูลสำรวจระดับชาติจากกองโรคไม่ติดต่อ กรมควบคุมโรค และระบบ HDC กระทรวงสาธารณสุข
          </p>
        </div>
        <div className="shrink-0 flex flex-wrap items-center gap-2">
          {/* CVD Filter */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setFocusFilter('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                focusFilter === 'all' ? 'bg-white text-[#0b3558] shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              10 โรคทั้งหมด
            </button>
            <button
              type="button"
              onClick={() => setFocusFilter('cvd')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                focusFilter === 'cvd' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              กลุ่มโรคหัวใจและหลอดเลือด (5 โรค)
            </button>
          </div>

          {/* Metric Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setMetricMode('pct')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                metricMode === 'pct' ? 'bg-[#006bff] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Percent className="w-3 h-3" />
              <span>ความชุก %</span>
            </button>
            <button
              type="button"
              onClick={() => setMetricMode('cases')}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                metricMode === 'cases' ? 'bg-[#006bff] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3 h-3" />
              <span>จำนวนคน (ล้าน)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Multimorbidity Alert Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-amber-600 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-white/20 text-white shrink-0">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-100">
              สถานการณ์สำคัญ: ภาวะพหุพยาธิสภาพ (Multimorbidity)
            </span>
            <h3 className="text-xl font-extrabold mt-1">
              ผู้สูงอายุไทย {multimorbidity?.Prevalence_Pct}% (ประมาณ {(Number(multimorbidity?.Estimated_Cases) / 1000000).toFixed(2)} ล้านคน) มีโรคเรื้อรังร่วมตั้งแต่ 2 โรคขึ้นไป
            </h3>
            <p className="text-xs text-rose-100 mt-1 max-w-2xl leading-relaxed">
              สอดคล้องกับแนวคิด Cardio-Renal-Metabolic Continuum ที่โรคความดันโลหิตสูงและเบาหวานเป็นปัจจัยต้นทางนำไปสู่โรคไตเรื้อรัง (CKD) อัมพฤกษ์อัมพาต (Stroke) และหัวใจขาดเลือด (IHD)
            </p>
          </div>
        </div>
      </div>

      {/* 3. Main Chart */}
      <div className="bg-white rounded-2xl p-6 border border-[#d4e0ed] shadow-sm flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0b3558]">
              {focusFilter === 'cvd'
                ? 'ความชุกกลุ่มโรค Cardio-Metabolic & หลอดเลือด'
                : 'ความชุกของโรคเรื้อรัง 10 อันดับแรก (% Prevalence & จำนวนผู้ป่วย)'}
            </h3>
            <p className="text-xs text-[#476788]">
              แสดงลำดับความชุกจากมากไปน้อย: ความดันโลหิตสูง (53.2%) {'>'} เบาหวาน (24.8%) {'>'} ข้อเข่าเสื่อม (16.5%)
            </p>
          </div>
          <span className="text-xs font-bold text-[#006bff] bg-blue-50 px-3 py-1 rounded-lg">
            หน่วย: {metricMode === 'pct' ? 'ร้อยละ (%)' : 'ล้านคน (M)'}
          </span>
        </div>
        <div className="h-96 w-full">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* 4. NCD Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedNCDs.map((d, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-[#d4e0ed] shadow-sm hover:border-[#006bff] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded-lg text-xs font-mono font-bold bg-slate-100 text-[#0b3558]">
                  {d.ICD10_Code}
                </span>
                <span className="text-xs font-bold text-rose-600 font-mono">
                  {d.Prevalence_Pct}%
                </span>
              </div>
              <h4 className="text-base font-bold text-[#0b3558]">
                {idx + 1}. {d.Disease_Name_TH}
              </h4>
              <div className="text-xs text-[#476788] italic mb-2">
                {d.Disease_Name_EN}
              </div>
              <p className="text-xs text-slate-600 bg-[#f8f9fb] p-2.5 rounded-xl border border-[#e2e8f0]">
                {d.Clinical_Focus}
              </p>
            </div>
            <div className="text-[11px] text-[#476788] mt-4 pt-3 border-t border-[#f0f3f8] flex items-center justify-between">
              <span>ผู้ป่วยโดยประมาณ:</span>
              <span className="font-bold text-[#0b3558] font-mono">
                {(d.Estimated_Cases / 1000).toLocaleString()} พันคน
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};