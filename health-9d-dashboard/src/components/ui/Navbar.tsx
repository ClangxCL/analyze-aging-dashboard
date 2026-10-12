'use client';

import React from 'react';
import { Activity, MapPin, Grid, Table2, Layers } from 'lucide-react';
import { PillBadge } from './PillBadge';
import { Button } from './Button';

interface NavbarProps {
  activeTab: 'overview' | 'map' | 'heatmap' | 'table';
  setActiveTab: (tab: 'overview' | 'map' | 'heatmap' | 'table') => void;
  onExploreClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onExploreClick
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#d4e0ed] transition-all">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[12px] bg-[#006bff] flex items-center justify-center text-white shadow-md shadow-[#006bff]/20">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0b3558] text-lg tracking-tight leading-none">
                ระบบวิเคราะห์สุขภาพผู้สูงอายุ 9 ด้าน
              </span>
              <PillBadge variant="signal">ปี 2569</PillBadge>
            </div>
            <p className="text-[11px] text-[#476788] hidden sm:block">
              ข้อมูลคัดกรอง 12 เขตสุขภาพ 76 จังหวัด • กระทรวงสาธารณสุข
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#f0f3f8] p-1 rounded-[10px] border border-[#d4e0ed]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[8px] transition-all ${
              activeTab === 'overview'
                ? 'bg-white text-[#006bff] shadow-sm'
                : 'text-[#476788] hover:text-[#0b3558]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            ภาพรวม & อันดับ
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[8px] transition-all ${
              activeTab === 'map'
                ? 'bg-white text-[#006bff] shadow-sm'
                : 'text-[#476788] hover:text-[#0b3558]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            แผนที่ภูมิศาสตร์
          </button>
          <button
            onClick={() => setActiveTab('heatmap')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[8px] transition-all ${
              activeTab === 'heatmap'
                ? 'bg-white text-[#006bff] shadow-sm'
                : 'text-[#476788] hover:text-[#0b3558]'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            ฮีทแมพรายเขต
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[8px] transition-all ${
              activeTab === 'table'
                ? 'bg-white text-[#006bff] shadow-sm'
                : 'text-[#476788] hover:text-[#0b3558]'
            }`}
          >
            <Table2 className="w-3.5 h-3.5" />
            ตารางข้อมูล 76 จว.
          </button>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-2">
          {onExploreClick && (
            <Button
              size="sm"
              variant="primary"
              onClick={onExploreClick}
              className="text-xs"
            >
              เปิดแดชบอร์ด
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
