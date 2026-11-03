'use client';

import React from 'react';
import { Users, TrendingUp, HeartPulse, Activity, AlertTriangle, Scale } from 'lucide-react';
import { demographicsData, chronicNCDsData, burdenOfDiseaseData } from '@/data/agingData';

export const AgingKpiCards: React.FC = () => {
  const latestDemo = demographicsData[demographicsData.length - 1]; // 2569
  const baseDemo = demographicsData[0]; // 2565
  
  const agingIndexGrowth = ((latestDemo.Aging_Index - baseDemo.Aging_Index) / baseDemo.Aging_Index * 100).toFixed(1);
  const oadrGrowth = ((latestDemo.Old_Age_Dependency_Ratio_OADR - baseDemo.Old_Age_Dependency_Ratio_OADR) / baseDemo.Old_Age_Dependency_Ratio_OADR * 100).toFixed(1);
  const multimorbidity = chronicNCDsData.find(d => d.ICD10_Code === 'Multimorbidity');
  const topBurden = burdenOfDiseaseData[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. ประชากรสูงอายุรวม */}
      <div className="bg-white rounded-2xl p-5 border border-[#d4e0ed] shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between text-[#476788] mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">ประชากรสูงอายุปี 2569</span>
          <div className="p-2 rounded-xl bg-blue-50 text-[#006bff]">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-[#0b3558] font-mono">
          {(latestDemo.Elderly_Population / 1000000).toFixed(2)}M
        </div>
        <div className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
          <span>{latestDemo.Elderly_Pct}% ของประชากรรวม (Super-Aged)</span>
        </div>
        <div className="text-[11px] text-[#476788] mt-3 pt-2.5 border-t border-[#f0f3f8] flex justify-between">
          <span>รวมประชากรแฝง: 14.96M</span>
          <span className="text-rose-600 font-medium">หญิง 1.39 : ชาย 1</span>
        </div>
      </div>

      {/* 2. ดัชนีการสูงวัย */}
      <div className="bg-white rounded-2xl p-5 border border-[#d4e0ed] shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between text-[#476788] mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">ดัชนีการสูงวัย (Aging Index)</span>
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-[#0b3558] font-mono">
          {latestDemo.Aging_Index}
        </div>
        <div className="text-xs font-semibold text-amber-600 mt-1">
          <span>สูงอายุ 162.5 คน ต่อเด็ก 100 คน</span>
        </div>
        <div className="text-[11px] text-[#476788] mt-3 pt-2.5 border-t border-[#f0f3f8] flex justify-between">
          <span>ปี 2565: {baseDemo.Aging_Index}</span>
          <span className="text-emerald-700 font-semibold">+{agingIndexGrowth}% ใน 5 ปี</span>
        </div>
      </div>

      {/* 3. อัตราส่วนพึ่งพิงสูงอายุ */}
      <div className="bg-white rounded-2xl p-5 border border-[#d4e0ed] shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between text-[#476788] mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">อัตราพึ่งพิง (OADR)</span>
          <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
            <Scale className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-[#0b3558] font-mono">
          {latestDemo.Old_Age_Dependency_Ratio_OADR}
        </div>
        <div className="text-xs font-semibold text-purple-600 mt-1">
          <span>แรงงาน 100 คน เลี้ยงดูสูงวัย 36.3 คน</span>
        </div>
        <div className="text-[11px] text-[#476788] mt-3 pt-2.5 border-t border-[#f0f3f8] flex justify-between">
          <span>เกื้อหนุนเหลือ: 2.75 : 1</span>
          <span className="text-emerald-700 font-semibold">+{oadrGrowth}%</span>
        </div>
      </div>

      {/* 4. Multimorbidity & ภาระโรคสูงสุด */}
      <div className="bg-white rounded-2xl p-5 border border-[#d4e0ed] shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between text-[#476788] mb-2">
          <span className="text-xs font-bold uppercase tracking-wider">มีโรคเรื้อรังร่วม ({'>='}2 โรค)</span>
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
            <HeartPulse className="w-4 h-4" />
          </div>
        </div>
        <div className="text-3xl font-extrabold text-rose-600 font-mono">
          {multimorbidity?.Prevalence_Pct}%
        </div>
        <div className="text-xs font-semibold text-[#476788] mt-1">
          <span>ผู้สูงอายุประมาณ {(Number(multimorbidity?.Estimated_Cases) / 1000000).toFixed(2)} ล้านคน</span>
        </div>
        <div className="text-[11px] text-[#476788] mt-3 pt-2.5 border-t border-[#f0f3f8] flex justify-between">
          <span>ภาระ DALY สูงสุด:</span>
          <span className="text-[#0b3558] font-bold">{topBurden?.Condition_Name_TH}</span>
        </div>
      </div>
    </div>
  );
};
