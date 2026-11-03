'use client';

import React, { useState } from 'react';
import '@/components/analytics/ChartSetup';
import { Line, Bar } from 'react-chartjs-2';
import { demographicsData } from '@/data/agingData';
import { TrendingUp, Users, Calendar, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const DemographicsSection: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(2569);
  const years = demographicsData.map(d => `ปี ${d.Year_TH}`);
  const currentDemo = demographicsData.find(d => d.Year_TH === selectedYear) || demographicsData[demographicsData.length - 1];
  
  // Chart 1: Population Trend
  const popTrendData = {
    labels: years,
    datasets: [
      {
        type: 'line' as const,
        label: 'สัดส่วนผู้สูงอายุ (%)',
        data: demographicsData.map(d => d.Elderly_Pct),
        borderColor: '#006bff',
        backgroundColor: 'rgba(0, 107, 255, 0.1)',
        yAxisID: 'y1',
        tension: 0.3,
        fill: true,
        pointRadius: 5,
        pointBackgroundColor: '#006bff'
      },
      {
        type: 'bar' as const,
        label: 'จำนวนผู้สูงอายุ (ล้านคน)',
        data: demographicsData.map(d => Number((d.Elderly_Population / 1000000).toFixed(2))),
        backgroundColor: '#0b3558',
        yAxisID: 'y',
        borderRadius: 8
      }
    ]
  };

  const popTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            if (context.dataset.yAxisID === 'y1') {
              return ` ${context.dataset.label}: ${context.parsed.y}%`;
            }
            return ` ${context.dataset.label}: ${context.parsed.y} ล้านคน`;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: { display: true, text: 'ล้านคน' },
        min: 10,
        max: 16
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: { display: true, text: 'ร้อยละ (%)' },
        min: 16,
        max: 23,
        grid: { drawOnChartArea: false }
      }
    }
  };

  // Chart 2: Age Bracket Stacked Bar
  const ageBracketData = {
    labels: years,
    datasets: [
      {
        label: 'วัยต้น (60-69 ปี)',
        data: demographicsData.map(d => Number((d.Age_60_69_Early / 1000000).toFixed(2))),
        backgroundColor: '#38bdf8',
        borderRadius: 4
      },
      {
        label: 'วัยกลาง (70-79 ปี)',
        data: demographicsData.map(d => Number((d.Age_70_79_Mid / 1000000).toFixed(2))),
        backgroundColor: '#0284c7',
        borderRadius: 4
      },
      {
        label: 'วัยปลาย (80+ ปี)',
        data: demographicsData.map(d => Number((d.Age_80_Plus_Late / 1000000).toFixed(2))),
        backgroundColor: '#0369a1',
        borderRadius: 4
      }
    ]
  };

  const ageBracketOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ${context.dataset.label}: ${context.parsed.y} ล้านคน`
        }
      }
    },
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        title: { display: true, text: 'จำนวนประชากร (ล้านคน)' }
      }
    }
  };

  // Chart 3: Aging Index & OADR Trend
  const dependencyData = {
    labels: years,
    datasets: [
      {
        label: 'ดัชนีการสูงวัย (Aging Index)',
        data: demographicsData.map(d => d.Aging_Index),
        borderColor: '#d97706',
        backgroundColor: 'rgba(217, 119, 6, 0.1)',
        yAxisID: 'y',
        tension: 0.3,
        fill: true,
        pointRadius: 5
      },
      {
        label: 'อัตราพึ่งพิงสูงอายุ (OADR)',
        data: demographicsData.map(d => d.Old_Age_Dependency_Ratio_OADR),
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        yAxisID: 'y1',
        tension: 0.3,
        pointRadius: 5
      }
    ]
  };

  const dependencyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const }
    },
    scales: {
      y: {
        position: 'left' as const,
        title: { display: true, text: 'ผู้สูงอายุต่อเด็ก 100 คน' }
      },
      y1: {
        position: 'right' as const,
        title: { display: true, text: 'ผู้สูงอายุต่อแรงงาน 100 คน' },
        grid: { drawOnChartArea: false }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Note */}
      <div className="bg-white rounded-2xl p-6 border border-[#d4e0ed] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#006bff] uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Demographic Transition • การเปลี่ยนผ่านสู่สังคมสูงวัยขั้นสุดยอด</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#0b3558]">
            โครงสร้างและแนวโน้มประชากรผู้สูงอายุไทย 5 ปี (พ.ศ. 2565 – 2569)
          </h2>
          <p className="text-xs text-[#476788] mt-1">
            วิเคราะห์ข้อมูลประชากรจากมิเตอร์ประเทศไทย (สถาบันวิจัยประชากรและสังคม ม.มหิดล IPSR) และสำนักบริหารการทะเบียน กรมการปกครอง
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-3">
          <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold text-center">
            Super-Aged Society ตั้งแต่ปี 2567
          </div>
        </div>
      </div>

      {/* 2. Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Population Growth Chart */}
        <div className="bg-white rounded-2xl p-6 border border-[#d4e0ed] shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#0b3558]">
                แนวโน้มประชากรสูงอายุและสัดส่วนร้อยละ (2565–2569)
              </h3>
              <p className="text-xs text-[#476788]">
                เพิ่มจาก 12.52 ล้านคน (18.91%) สู่ 13.79 ล้านคน (20.73%)
              </p>
            </div>
          </div>
          <div className="h-72 w-full">
            <Bar data={popTrendData as any} options={popTrendOptions as any} />
          </div>
        </div>

        {/* Age Bracket Stacked Chart */}
        <div className="bg-white rounded-2xl p-6 border border-[#d4e0ed] shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#0b3558]">
                การกระจายตัวตามกลุ่มช่วงวัย (Age Brackets)
              </h3>
              <p className="text-xs text-[#476788]">
                วัยต้น (60-69 ปี) ~56.4% • วัยกลาง (70-79 ปี) ~30.1% • วัยปลาย (80+ ปี) ~13.5%
              </p>
            </div>
          </div>
          <div className="h-72 w-full">
            <Bar data={ageBracketData} options={ageBracketOptions} />
          </div>
        </div>
      </div>

      {/* 3. Dependency & Supporting Ratio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#d4e0ed] shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-[#0b3558]">
                ดัชนีการสูงวัย (Aging Index) และ อัตราส่วนพึ่งพิง (OADR)
              </h3>
              <p className="text-xs text-[#476788]">
                ดัชนีการสูงวัยพุ่งแตะ 162.48 สะท้อนจำนวนผู้สูงอายุมากกว่าเด็กในอัตราเร่ง
              </p>
            </div>
          </div>
          <div className="h-64 w-full">
            <Line data={dependencyData} options={dependencyOptions} />
          </div>
        </div>

        {/* Life Expectancy & Demographic Health Summary */}
        <div className="bg-white rounded-2xl p-6 border border-[#d4e0ed] shadow-sm flex flex-col justify-between space-y-4">
          <div className="border-b border-[#f0f3f8] pb-3 flex items-center justify-between">
            <h3 className="text-base font-bold text-[#0b3558]">
              ดัชนีชี้วัดประชากรศาสตร์ (ปี {currentDemo.Year_TH})
            </h3>
            <div className="flex gap-1">
              {demographicsData.map(d => (
                <button
                  key={d.Year_TH}
                  type="button"
                  onClick={() => setSelectedYear(d.Year_TH)}
                  className={`px-2 py-0.5 text-xs rounded-md font-bold transition-all ${
                    selectedYear === d.Year_TH
                      ? 'bg-[#006bff] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {d.Year_TH}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#476788]">ประชากรผู้สูงอายุ (60+ ปี):</span>
              <span className="font-bold text-[#0b3558] font-mono text-sm">
                {(currentDemo.Elderly_Population / 1000000).toFixed(2)} ล้านคน ({currentDemo.Elderly_Pct}%)
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#476788]">อายุขัยเฉลี่ยเพศหญิง:</span>
              <span className="font-bold text-[#0b3558] font-mono text-sm">{currentDemo.Life_Expectancy_Female} ปี</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#476788]">อายุขัยเฉลี่ยเพศชาย:</span>
              <span className="font-bold text-[#0b3558] font-mono text-sm">{currentDemo.Life_Expectancy_Male} ปี</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#476788]">สัดส่วนเพศ (หญิง : ชาย):</span>
              <span className="font-bold text-rose-600 font-mono text-sm">{currentDemo.Sex_Ratio_F_to_M} : 1</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#476788]">อัตราเจริญพันธุ์รวม (TFR):</span>
              <span className="font-bold text-amber-600 font-mono text-sm">{currentDemo.Total_Fertility_Rate_TFR} คน/สตรี</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#476788]">อัตราเกื้อหนุน (แรงงาน : สูงอายุ):</span>
              <span className="font-bold text-purple-700 font-mono text-sm">{currentDemo.Potential_Support_Ratio} : 1</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs">
            💡 <strong>นัยยะเชิงนโยบาย (ปี {currentDemo.Year_TH}):</strong> อัตราเกื้อหนุนอยู่ที่ {currentDemo.Potential_Support_Ratio} คนต่อผู้สูงอายุ 1 คน ({currentDemo.Super_Aged_Status}) เร่งจัดเตรียมระบบบริการสุขภาพและ Long-term Care (LTC)
          </div>
        </div>
      </div>
    </div>
  );
};
