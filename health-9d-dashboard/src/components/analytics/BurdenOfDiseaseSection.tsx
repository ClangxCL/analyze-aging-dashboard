'use client';

import React, { useState } from 'react';
import '@/components/analytics/ChartSetup';
import { Bar } from 'react-chartjs-2';
import { burdenOfDiseaseData } from '@/data/agingData';
import { Scale, HeartCrack, Activity, Layers, UserCheck, Users } from 'lucide-react';

const GENDER_DALY_DATA = [
  { rank: 1, condition: 'โรคหลอดเลือดสมอง (Stroke)', male: 325.0, female: 272.9 },
  { rank: 2, condition: 'โรคเบาหวาน (Diabetes)', male: 102.0, female: 175.0 },
  { rank: 3, condition: 'โรคหัวใจขาดเลือด (IHD)', male: 128.0, female: 115.0 },
  { rank: 4, condition: 'มะเร็งปอด/หลอดลม (Lung Cancer)', male: 142.0, female: 65.0 },
  { rank: 5, condition: 'โรคปอดอุดกั้นเรื้อรัง (COPD)', male: 138.0, female: 52.0 },
  { rank: 6, condition: 'โรคข้อเข่าเสื่อม (OA Knee)', male: 25.0, female: 95.0 },
  { rank: 7, condition: 'โรคไตเรื้อรัง (CKD)', male: 68.0, female: 72.0 },
  { rank: 8, condition: 'โรคสมองเสื่อม (Dementia)', male: 38.0, female: 76.0 },
  { rank: 9, condition: 'โรคซึมเศร้า (Depression)', male: 28.0, female: 82.0 },
  { rank: 10, condition: 'การหกล้ม/บาดเจ็บ (Falls)', male: 42.0, female: 45.0 }
];

export const BurdenOfDiseaseSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'yll_yld' | 'gender'>('yll_yld');

  // Chart 1: Stacked Bar YLL vs YLD
  const dalyChartData = {
    labels: burdenOfDiseaseData.map(d => `${d.Rank}. ${d.Condition_Name_TH}`),
    datasets: [
      {
        label: 'YLL: ปีสุขภาวะที่สูญเสียจากการตายก่อนวัยอันควร (พันปี)',
        data: burdenOfDiseaseData.map(d => Number((d.YLL_Premature_Death_Years / 1000).toFixed(1))),
        backgroundColor: '#dc2626', // Red
        borderRadius: 4
      },
      {
        label: 'YLD: ปีสุขภาวะที่สูญเสียจากความพิการ/บกพร่อง (พันปี)',
        data: burdenOfDiseaseData.map(d => Number((d.YLD_Disability_Years / 1000).toFixed(1))),
        backgroundColor: '#f59e0b', // Amber
        borderRadius: 4
      }
    ]
  };

  const dalyChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ${context.dataset.label}: ${context.parsed.y} พันปีสุขภาวะ (DALYs)`
        }
      }
    },
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        title: { display: true, text: 'ปีสุขภาวะที่สูญเสีย (พันปี DALYs)' }
      }
    }
  };

  // Chart 2: Gender-Disaggregated DALYs (Male vs Female)
  const genderChartData = {
    labels: GENDER_DALY_DATA.map(d => d.condition.split(' (')[0]),
    datasets: [
      {
        label: 'เพศชาย (พันปี DALYs)',
        data: GENDER_DALY_DATA.map(d => d.male),
        backgroundColor: '#0284c7', // Sky Blue
        borderRadius: 4
      },
      {
        label: 'เพศหญิง (พันปี DALYs)',
        data: GENDER_DALY_DATA.map(d => d.female),
        backgroundColor: '#ec4899', // Rose Pink
        borderRadius: 4
      }
    ]
  };

  const genderChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ${context.dataset.label}: ${context.parsed.y} พันปี DALYs`
        }
      }
    },
    scales: {
      y: {
        title: { display: true, text: 'พันปีสุขภาวะที่สูญเสีย (พันปี DALYs)' }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Tab Switcher */}
      <div className="bg-white rounded-2xl p-6 border border-[#d4e0ed] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#006bff] uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" />
            <span>Burden of Disease (BOD) Epidemiology</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#0b3558]">
            ภาระโรคและการสูญเสียปีสุขภาวะ 10 อันดับแรกในผู้สูงอายุไทย (DALYs)
          </h2>
          <p className="text-xs text-[#476788] mt-1">
            จำแนกระหว่างการตายก่อนวัยอันควร (YLL), การมีชีวิตอยู่ด้วยความพิการ (YLD) และความแตกต่างระหว่างเพศชาย-หญิง (โครงการ BOD Thailand)
          </p>
        </div>
        <div className="shrink-0 flex items-center bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('yll_yld')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'yll_yld'
                ? 'bg-[#006bff] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>โครงสร้าง YLL vs YLD</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('gender')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'gender'
                ? 'bg-purple-700 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>เปรียบเทียบ เพศชาย vs เพศหญิง</span>
          </button>
        </div>
      </div>

      {/* 2. Main Chart */}
      <div className="bg-white rounded-2xl p-6 border border-[#d4e0ed] shadow-sm flex flex-col">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0b3558]">
              {activeTab === 'yll_yld'
                ? 'ภาระโรค DALYs รวม จำแนกตามสัดส่วน YLL (สีแดง) และ YLD (สีส้ม)'
                : 'เปรียบเทียบภาระโรค DALYs ระหว่างเพศชาย (สีฟ้า) และเพศหญิง (สีชมพู)'}
            </h3>
            <p className="text-xs text-[#476788]">
              {activeTab === 'yll_yld'
                ? 'โรคหลอดเลือดสมองเป็นสาเหตุอันดับ 1 (597.9 พัน DALYs) ขณะที่โรคข้อเข่าเสื่อมเป็นภาระความพิการ (YLD) 100%'
                : 'ชายสูญเสียสูงจากมะเร็งปอด/COPD ส่วนหญิงสูญเสียสูงจากเบาหวาน ข้อเข่าเสื่อม และซึมเศร้า'}
            </p>
          </div>
          <span className="text-xs font-bold text-[#006bff] bg-blue-50 px-3 py-1 rounded-lg">
            หน่วย: พันปีสุขภาวะ (1,000 DALYs)
          </span>
        </div>
        <div className="h-96 w-full">
          {activeTab === 'yll_yld' ? (
            <Bar data={dalyChartData} options={dalyChartOptions} />
          ) : (
            <Bar data={genderChartData} options={genderChartOptions} />
          )}
        </div>
      </div>

      {/* 3. DALYs Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {burdenOfDiseaseData.map((d, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-5 border border-[#d4e0ed] shadow-sm hover:border-[#006bff] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-[#006bff] uppercase tracking-wider">
                  อันดับ {d.Rank}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 font-mono">
                  {d.Total_DALYs_Years.toLocaleString()} DALYs
                </span>
              </div>
              <h4 className="text-base font-bold text-[#0b3558]">
                {d.Condition_Name_TH}
              </h4>
              <div className="text-xs text-[#476788] italic mb-3">
                {d.Condition_Name_EN}
              </div>

              {/* Progress bar YLL vs YLD */}
              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-rose-600">YLL (ตายก่อนวัย): {d.YLL_Share_Pct}%</span>
                  <span className="text-amber-600">YLD (พิการ): {d.YLD_Share_Pct}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-rose-500"
                    style={{ width: `${d.YLL_Share_Pct}%` }}
                    title={`YLL: ${d.YLL_Share_Pct}%`}
                  />
                  <div
                    className="h-full bg-amber-500"
                    style={{ width: `${d.YLD_Share_Pct}%` }}
                    title={`YLD: ${d.YLD_Share_Pct}%`}
                  />
                </div>
              </div>

              <p className="text-xs text-slate-600 bg-[#f8f9fb] p-2.5 rounded-xl border border-[#e2e8f0]">
                {d.Nature_Of_Burden}
              </p>
            </div>

            <div className="text-[11px] text-[#476788] mt-4 pt-3 border-t border-[#f0f3f8] flex items-center justify-between">
              <span>สัดส่วน YLL : YLD:</span>
              <span className="font-bold text-[#0b3558] font-mono">
                {d.Ratio_YLL_to_YLD}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};