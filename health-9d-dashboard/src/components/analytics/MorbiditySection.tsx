'use client';

import React, { useState } from 'react';
import '@/components/analytics/ChartSetup';
import { Bar } from 'react-chartjs-2';
import { morbidityData } from '@/data/agingData';
import { TrendingUp, Hospital, UserCheck, AlertTriangle } from 'lucide-react';

export const MorbiditySection: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'opd' | 'ipd'>('opd');

  const currentItems = morbidityData.filter(d =>
    activeMode === 'opd' ? d.Care_Type.includes('OPD') : d.Care_Type.includes('IPD')
  );

  // Rate per 100k Chart
  const rateChartData = {
    labels: currentItems.map(d => `${d.Rank}. ${d.Condition_Name_TH} (${d.ICD10_Code})`),
    datasets: [
      {
        label: 'อัตราป่วยต่อแสนประชากร (ปี 2567)',
        data: currentItems.map(d => d.Rate_Per_100k_2567),
        backgroundColor: activeMode === 'opd' ? '#0284c7' : '#e11d48',
        borderRadius: 6
      }
    ]
  };

  const rateChartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const item = currentItems[context.dataIndex];
            return ` อัตรา: ${item.Rate_Per_100k_2567.toLocaleString()} ต่อแสน (ผู้ป่วยปี 67: ${item.Cases_2567.toLocaleString()} คน)`;
          }
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'อัตราป่วยต่อแสนประชากรผู้สูงอายุ' }
      }
    }
  };

  // 3-Year Comparison Multi-Bar
  const multiYearChartData = {
    labels: currentItems.map(d => d.Condition_Name_TH.length > 15 ? d.Condition_Name_TH.substring(0, 15) + '...' : d.Condition_Name_TH),
    datasets: [
      {
        label: 'ปี 2565',
        data: currentItems.map(d => Number((d.Cases_2565 / 1000).toFixed(1))),
        backgroundColor: '#94a3b8',
        borderRadius: 4
      },
      {
        label: 'ปี 2566',
        data: currentItems.map(d => Number((d.Cases_2566 / 1000).toFixed(1))),
        backgroundColor: '#38bdf8',
        borderRadius: 4
      },
      {
        label: 'ปี 2567',
        data: currentItems.map(d => Number((d.Cases_2567 / 1000).toFixed(1))),
        backgroundColor: activeMode === 'opd' ? '#0b3558' : '#e11d48',
        borderRadius: 4
      }
    ]
  };

  const multiYearChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ${context.dataset.label}: ${context.parsed.y} พันคน`
        }
      }
    },
    scales: {
      y: {
        title: { display: true, text: 'จำนวนครั้ง/ผู้ป่วย (พันคน)' }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Mode Switcher */}
      <div className="bg-white rounded-2xl p-6 border border-[#d4e0ed] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#006bff] uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>Morbidity & Healthcare Utilization</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#0b3558]">
            สถิติอัตราป่วยและแนวโน้ม 10 อันดับแรก (OPD & IPD 2565–2567)
          </h2>
          <p className="text-xs text-[#476788] mt-1">
            ฐานข้อมูลรายงานจากกองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข และ HDC
          </p>
        </div>

        {/* Switcher Buttons */}
        <div className="flex items-center bg-[#f0f3f8] p-1.5 rounded-xl border border-[#d4e0ed]">
          <button
            onClick={() => setActiveMode('opd')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'opd'
                ? 'bg-[#006bff] text-white shadow-sm'
                : 'text-[#476788] hover:text-[#0b3558]'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>ผู้ป่วยนอก (OPD)</span>
          </button>
          <button
            onClick={() => setActiveMode('ipd')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'ipd'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-[#476788] hover:text-[#0b3558]'
            }`}
          >
            <Hospital className="w-4 h-4" />
            <span>ผู้ป่วยใน (IPD)</span>
          </button>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>ข้อกำหนดข้อมูลจริง (Real Data Protocol):</strong> ข้อมูลอัตราป่วยของปี 2568 และ 2569 จะถูกเว้นว่างตามข้อกำหนดจริง ไม่มีการประมาณการตัวเลขจำลอง
        </span>
      </div>

      {/* Rate per 100k Chart */}
      <div className="bg-white rounded-2xl p-6 border border-[#d4e0ed] shadow-sm flex flex-col">
        <div className="mb-4">
          <h3 className="text-base font-bold text-[#0b3558]">
            อัตราป่วย 10 อันดับแรกต่อแสนประชากร ปี 2567 ({activeMode.toUpperCase()})
          </h3>
          <p className="text-xs text-[#476788]">
            {activeMode === 'opd'
              ? 'โรคความดันโลหิตสูงและเบาหวานครองอันดับ 1 และ 2 สูงสุด'
              : 'โรคหลอดเลือดสมองและโรคปอดอักเสบเป็นสาเหตุหลักของการนอนโรงพยาบาล'}
          </p>
        </div>
        <div className="h-80 w-full">
          <Bar data={rateChartData} options={rateChartOptions} />
        </div>
      </div>

      {/* 3-Year Trend Comparison Chart */}
      <div className="bg-white rounded-2xl p-6 border border-[#d4e0ed] shadow-sm flex flex-col">
        <div className="mb-4">
          <h3 className="text-base font-bold text-[#0b3558]">
            เปรียบเทียบจำนวนผู้ป่วย 3 ปีย้อนหลัง (2565 – 2567)
          </h3>
          <p className="text-xs text-[#476788]">
            แสดงแนวโน้มการเพิ่มขึ้นของจำนวนครั้งที่เข้ารับการรักษา
          </p>
        </div>
        <div className="h-80 w-full">
          <Bar data={multiYearChartData} options={multiYearChartOptions} />
        </div>
      </div>

      {/* Morbidity Table */}
      <div className="bg-white rounded-2xl border border-[#d4e0ed] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#d4e0ed] flex items-center justify-between">
          <h3 className="text-base font-bold text-[#0b3558]">
            ตารางสถิติผู้ป่วย 10 อันดับแรก ({activeMode.toUpperCase()})
          </h3>
          <span className="text-xs text-[#476788]">หน่วย: คน และอัตราต่อแสน</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#0b3558] text-white font-bold text-xs">
              <tr>
                <th className="py-3 px-4">อันดับ</th>
                <th className="py-3 px-4">ICD-10</th>
                <th className="py-3 px-4">ภาวะ / โรค</th>
                <th className="py-3 px-4 text-right">ปี 2565</th>
                <th className="py-3 px-4 text-right">ปี 2566</th>
                <th className="py-3 px-4 text-right font-bold">ปี 2567</th>
                <th className="py-3 px-4 text-right">อัตราต่อแสน (67)</th>
                <th className="py-3 px-4 text-right">เติบโต 65-67 (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d4e0ed] font-mono text-xs">
              {currentItems.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#f0f3f8] transition">
                  <td className="py-2.5 px-4 font-bold text-[#0b3558]">{row.Rank}</td>
                  <td className="py-2.5 px-4 font-sans text-[#476788]">{row.ICD10_Code}</td>
                  <td className="py-2.5 px-4 font-sans font-medium text-[#0b3558]">{row.Condition_Name_TH}</td>
                  <td className="py-2.5 px-4 text-right">{row.Cases_2565.toLocaleString()}</td>
                  <td className="py-2.5 px-4 text-right">{row.Cases_2566.toLocaleString()}</td>
                  <td className="py-2.5 px-4 text-right font-bold text-[#006bff]">
                    {row.Cases_2567.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold">
                    {row.Rate_Per_100k_2567.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-rose-600">
                    +{row.Growth_2565_2567_Pct}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
