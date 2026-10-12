'use client';

import React from 'react';
import { Filter, RotateCcw, MapPin, Building2, Stethoscope } from 'lucide-react';
import { DimensionKey, FilterState, ProvinceData, RegionData } from '@/types/health';
import { DIMENSIONS } from '@/lib/analytics';
import { PillBadge } from './PillBadge';

interface FilterToolbarProps {
  filter: FilterState;
  setFilter: React.Dispatch<React.SetStateAction<FilterState>>;
  regions: RegionData[];
  provinces: ProvinceData[];
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  filter,
  setFilter,
  regions,
  provinces
}) => {
  // Available provinces based on current zone selection
  const availableProvinces = provinces.filter(p => {
    if (filter.zone === 'all') return true;
    return p.zone === filter.zone;
  });

  const handleZoneChange = (zone: string) => {
    setFilter(prev => ({
      ...prev,
      zone,
      // If selected province is not in new zone, reset province to 'all'
      province: 'all'
    }));
  };

  const handleProvinceChange = (province: string) => {
    if (province !== 'all') {
      const provObj = provinces.find(p => p.province === province);
      setFilter(prev => ({
        ...prev,
        province,
        zone: provObj ? provObj.zone : prev.zone
      }));
    } else {
      setFilter(prev => ({ ...prev, province: 'all' }));
    }
  };

  const handleDimensionChange = (dimension: DimensionKey | 'all') => {
    setFilter(prev => ({ ...prev, dimension }));
  };

  const handleReset = () => {
    setFilter({
      zone: 'all',
      province: 'all',
      dimension: 'all'
    });
  };

  const isFiltered = filter.zone !== 'all' || filter.province !== 'all' || filter.dimension !== 'all';

  return (
    <div className="bg-white rounded-[20px] p-5 border border-[#d4e0ed] card-elevation-sm transition-all mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#f0f3f8]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#e6f0ff] text-[#006bff] flex items-center justify-center">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[#0b3558] text-base leading-tight">ตัวกรองข้อมูลเชิงลึก</h3>
            <p className="text-xs text-[#476788]">เลือกเขตบริการสุขภาพ จังหวัด และประเด็นสุขภาพ 9 ด้าน</p>
          </div>
        </div>

        {isFiltered && (
          <button
            onClick={handleReset}
            className="self-start lg:self-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#006bff] hover:bg-[#e6f0ff] rounded-lg transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            ล้างตัวกรองทั้งหมด
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        {/* 1. Health Region Filter */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[#0b3558] mb-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#006bff]" />
            เขตบริการสุขภาพ
          </label>
          <select
            value={filter.zone}
            onChange={e => handleZoneChange(e.target.value)}
            className="w-full bg-[#f0f3f8] border border-[#d4e0ed] text-[#0b3558] text-sm rounded-[8px] px-3 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-[#006bff]/20 focus:border-[#006bff] transition-all cursor-pointer"
          >
            <option value="all">ทุกเขตสุขภาพ (เขต 1 - 12)</option>
            {regions.map(r => (
              <option key={r.zone} value={r.zone}>
                {r.zone} ({r.provinceCount} จังหวัด)
              </option>
            ))}
          </select>
        </div>

        {/* 2. Province Filter */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[#0b3558] mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#006bff]" />
            จังหวัด ({availableProvinces.length} จังหวัด)
          </label>
          <select
            value={filter.province}
            onChange={e => handleProvinceChange(e.target.value)}
            className="w-full bg-[#f0f3f8] border border-[#d4e0ed] text-[#0b3558] text-sm rounded-[8px] px-3 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-[#006bff]/20 focus:border-[#006bff] transition-all cursor-pointer"
          >
            <option value="all">ทุกจังหวัด {filter.zone !== 'all' ? `(ใน${filter.zone})` : '(76 จังหวัด)'}</option>
            {availableProvinces.map(p => (
              <option key={p.province} value={p.province}>
                {p.province} ({p.zone})
              </option>
            ))}
          </select>
        </div>

        {/* 3. Dimension Filter */}
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-[#0b3558] mb-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-[#006bff]" />
            ประเด็นสุขภาพ 9 ด้าน
          </label>
          <select
            value={filter.dimension}
            onChange={e => handleDimensionChange(e.target.value as DimensionKey | 'all')}
            className="w-full bg-[#f0f3f8] border border-[#d4e0ed] text-[#0b3558] text-sm rounded-[8px] px-3 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-[#006bff]/20 focus:border-[#006bff] transition-all cursor-pointer"
          >
            <option value="all">ทุกประเด็นสุขภาพ (จัดอันดับ Top 1 - 9)</option>
            {DIMENSIONS.map(d => (
              <option key={d.key} value={d.key}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active filter summary tag bar */}
      <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-[#f0f3f8] text-xs">
        <span className="text-[#476788] font-medium">มุมมองปัจจุบัน:</span>
        <PillBadge variant={filter.zone === 'all' ? 'pebble' : 'signal'}>
          {filter.zone === 'all' ? 'ทุกเขตสุขภาพ' : filter.zone}
        </PillBadge>
        <PillBadge variant={filter.province === 'all' ? 'pebble' : 'signal'}>
          {filter.province === 'all' ? `ทุกจังหวัด (${availableProvinces.length} จว.)` : `จ.${filter.province}`}
        </PillBadge>
        <PillBadge variant={filter.dimension === 'all' ? 'pebble' : 'dark'}>
          {filter.dimension === 'all'
            ? 'จัดอันดับความเสี่ยงครบ 9 ด้าน'
            : DIMENSIONS.find(d => d.key === filter.dimension)?.name}
        </PillBadge>
      </div>
    </div>
  );
};
