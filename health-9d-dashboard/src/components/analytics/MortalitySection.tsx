'use client';

import React from 'react';
import '@/components/analytics/ChartSetup';
import { Bar, Doughnut } from 'react-chartjs-2';
import { mortalityData } from '@/data/agingData';
import { Skull, AlertTriangle, ArrowUpRight } from 'lucide-react';

export const MortalitySection: React.FC = () => {
  const top10Causes = mortalityData.filter(d => typeof d.Rank === 'number' || (d.Rank !== '-' && d.Rank !== 'Others'));
  const totalRow = mortalityData.find(d => d.ICD10_Code === 'Total');

  // Horizontal Bar: Rate per 100k
  const rateChartData = {
    labels: top10Causes.map(d => `${d.Rank}. ${d.Cause_Of_Death_TH}`),
    datasets: [
      {
        label: 'อัตราตายต่อแสนประชากร (ปี 2567)',
        data: top10Causes.map(d => d.Mortality_Rate_Per_100k_2567),
        backgroundColor: [
          '#b91c1c', // Cancer
          '#dc2626', // Stroke
          '#ea580c', // Pneumonia
          '#f59e0b', // IHD
          '#d97706', // Sepsis
          '#7c3aed', // CKD
          '#2563eb', // DM
          '#475569', // COPD
          '#059669', // Falls
          '#0d9488'  // Cirrhosis
        ],
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
            const item = top10Causes[context.dataIndex];
            return ` อัตราตาย: ${item.Mortality_Rate_Per_100k_2567} ต่อแสน (ผู้เสียชีวิต: ${item.Deaths_2567.toLocaleString()} ราย, สัดส่วน: ${item.Mortality_Share_Pct_2567}%)`;
          }
        }
      }
    },
    scales: {
      x: {
        title: { display: true, text: 'อัตราตายต่อแสนประชากรผู้สูงอายุ' }
      }
    }
  };

  // Donut: Share of deaths
  const shareChartData = {
    labels: top10Causes.map(d => d.Cause_Of_Death_TH),
    datasets: [
      {
        data: top10Causes.map(d => d.Mortality_Share_Pct_2567),
        backgroundColor: [
          '#b91c1c', '#dc2626', '#ea580c', '#f59e0b', '#d97706',
          '#7c3aed', '#2563eb', '#475569', '#059669', '#0d9488'
        ],
        hoverOffset: 6
      }
    ]
  };

  const shareChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' as const },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ${context.label}: ${context.parsed}%`
        }
      }
    },
    cutout: '60%'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#d4e0ed] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
            <Skull className="w-4 h-4" />
            <span>Mortality & Causes of Death</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#0b3558]">
            สถิติสาเหตุการเสียชีวิต 10 อันดับแรกในผู้สูงอายุไทย (พ.ศ. 2565–2567)
          </h2>
          <p className="text-xs text-[#476788] mt-1">
            ฐานข้อมูลจากสำนักบริหารการทะเบียน กรมการปกครอง และกองยุทธศาสตร์และแผนงาน กระทรวงสาธารณสุข
          </p>
        </div>
        <div className="shrink-0">
          <div className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold text-center">
            ผู้สูงอายุเสียชีวิตรวมปี 2567: {totalRow?.Deaths_2567.toLocaleString()} ราย
          </div>
        </div>
      </div>

      {/* Real Data Protocol Alert Banner */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>ข้อกำหนดข้อมูลจริง (Real Data Protocol):</strong> ข้อมูลสถิติการเสียชีวิตของปี 2568 และ 2569 ยังไม่มีรายงานทางการจากกระทรวงสาธารณสุข จึงเว้นว่างไว้ตามข้อกำหนดจริงโดยไม่มีการใส่ตัวเลขประมาณการ
        </span>
      </div>

      {/* Grid Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rate per 100k */}
        <div className="bg-white rounded-2xl p-6 border border-[#d4e0ed] shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#0b3558]">
              อัตราตายต่อแสนประชากร 10 อันดับแรก (ปี 2567)
            </h3>
            <p className="text-xs text-[#476788]">
              โรคมะเร็งและหลอดเลือดสมองเป็น 2 สาเหตุหลักที่มีอัตราการเสียชีวิตสูงสุด
            </p>
          </div>
          <div className="h-80 w-full">
            <Bar data={rateChartData} options={rateChartOptions} />
          </div>
        </div>

        {/* Share Donut */}
        <div className="bg-white rounded-2xl p-6 border border-[#d4e0ed] shadow-sm flex flex-col">
          <div className="mb-4">
            <h3 className="text-base font-bold text-[#0b3558]">
              สัดส่วนสาเหตุการเสียชีวิต (% Mortality Share)
            </h3>
            <p className="text-xs text-[#476788]">
              โรคมะเร็งครองสัดส่วนเกือบ 1 ใน 5 (19.85%) ของการเสียชีวิตทั้งหมด
            </p>
          </div>
          <div className="h-80 w-full flex items-center justify-center">
            <Doughnut data={shareChartData} options={shareChartOptions} />
          </div>
        </div>
      </div>

      {/* Mortality Table */}
      <div className="bg-white rounded-2xl border border-[#d4e0ed] shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#d4e0ed] flex items-center justify-between">
          <h3 className="text-base font-bold text-[#0b3558]">
            ตารางสาเหตุการเสียชีวิต 10 อันดับแรก
          </h3>
          <span className="text-xs text-[#476788]">ปี 2568-2569 เว้นว่างตามข้อกำหนดข้อมูลจริง</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#0b3558] text-white font-bold text-xs">
              <tr>
                <th className="py-3 px-4">อันดับ</th>
                <th className="py-3 px-4">ICD-10</th>
                <th className="py-3 px-4">สาเหตุการเสียชีวิต</th>
                <th className="py-3 px-4 text-right">ปี 2565 (ราย)</th>
                <th className="py-3 px-4 text-right">ปี 2566 (ราย)</th>
                <th className="py-3 px-4 text-right font-bold">ปี 2567 (ราย)</th>
                <th className="py-3 px-4 text-right">อัตราต่อแสน</th>
                <th className="py-3 px-4 text-right">สัดส่วน (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d4e0ed] font-mono text-xs">
              {top10Causes.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#f0f3f8] transition">
                  <td className="py-2.5 px-4 font-bold text-[#0b3558]">{row.Rank}</td>
                  <td className="py-2.5 px-4 font-sans text-[#476788]">{row.ICD10_Code}</td>
                  <td className="py-2.5 px-4 font-sans font-medium text-[#0b3558]">{row.Cause_Of_Death_TH}</td>
                  <td className="py-2.5 px-4 text-right">{row.Deaths_2565.toLocaleString()}</td>
                  <td className="py-2.5 px-4 text-right">{row.Deaths_2566.toLocaleString()}</td>
                  <td className="py-2.5 px-4 text-right font-bold text-rose-600">
                    {row.Deaths_2567.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold">
                    {row.Mortality_Rate_Per_100k_2567}
                  </td>
                  <td className="py-2.5 px-4 text-right font-bold text-amber-700">
                    {row.Mortality_Share_Pct_2567}%
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
