'use client';

import React from 'react';
import Link from 'next/link';
import {
  Activity,
  MapPin,
  Grid,
  Table2,
  Layers,
  BarChart3,
  ExternalLink,
  Download,
  Calendar
} from 'lucide-react';
import { PillBadge } from './PillBadge';
import { Button } from './Button';

export type WindowMode = 'screening-9d' | 'situation-5y' | 'analyze-aging';

interface NavbarProps {
  currentWindow?: WindowMode;
  onWindowChange?: (window: WindowMode) => void;
  activeTab?: 'overview' | 'map' | 'heatmap' | 'table';
  setActiveTab?: (tab: 'overview' | 'map' | 'heatmap' | 'table') => void;
  onExploreClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentWindow = 'screening-9d',
  onWindowChange,
  activeTab,
  setActiveTab,
  onExploreClick
}) => {
  const isWindow1 = currentWindow === 'screening-9d';
  const isWindow2 = currentWindow === 'situation-5y';
  const isWindow3 = currentWindow === 'analyze-aging';

  const handleSwitch = (target: WindowMode) => {
    if (onWindowChange) {
      onWindowChange(target);
    }
  };

  const handleOpenInNewWindow = () => {
    let targetUrl = '/';
    if (isWindow1) targetUrl = '/analyze-aging';
    else if (isWindow2) targetUrl = '/analyze-aging';
    else if (isWindow3) targetUrl = '/';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#d4e0ed] transition-all">
      {/* Top Window Switcher Bar */}
      <div className="bg-[#0b3558] text-white px-4 sm:px-6 py-2 border-b border-[#0f4471]">
        <div className="max-w-[1280px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Window Tabs */}
          <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-xl border border-white/15 overflow-x-auto">
            <button
              type="button"
              onClick={() => handleSwitch('screening-9d')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                isWindow1
                  ? 'bg-white text-[#0b3558] shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-[#006bff]" />
              <span>หน้าต่าง 1: คัดกรอง 9 ด้าน (76 จว. ปี 2569)</span>
              {isWindow1 && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSwitch('situation-5y')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                isWindow2
                  ? 'bg-white text-[#0b3558] shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
              <span>หน้าต่าง 2: สถานการณ์สุขภาพ & ประชากร 5 ปี</span>
              {isWindow2 && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSwitch('analyze-aging')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                isWindow3
                  ? 'bg-white text-[#0b3558] shadow-sm'
                  : 'text-slate-200 hover:text-white hover:bg-white/10'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
              <span>หน้าต่าง 3: แสดงภาพข้อมูล (Analyze Aging)</span>
              {isWindow3 && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={handleOpenInNewWindow}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium border border-white/20 transition-all"
              title="เปิดมุมมองนี้ในหน้าต่างเบราว์เซอร์ใหม่แยกอิสระ"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-300" />
              <span className="hidden sm:inline">เปิดแยกอีกหน้าต่างหนึ่ง</span>
            </button>

            <a
              href="/Elderly_Thailand_Health_Report_2565_2569.docx"
              download="Elderly_Thailand_Health_Report_2565_2569.docx"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all border border-emerald-400 shadow-sm"
              title="ดาวน์โหลดรายงานผลการวิเคราะห์ฉบับสมบูรณ์ (.docx 61.8 KB)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>รายงาน .docx (61.8 KB)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sub-Navbar */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[12px] bg-[#006bff] flex items-center justify-center text-white shadow-md shadow-[#006bff]/20">
            {isWindow1 ? <Activity className="w-5 h-5" /> : <BarChart3 className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0b3558] text-lg tracking-tight leading-none">
                {isWindow1
                  ? 'ระบบวิเคราะห์สุขภาพผู้สูงอายุ 9 ด้าน'
                  : 'สถานการณ์สุขภาพและประชากรผู้สูงอายุไทย 5 ปี'}
              </span>
              <PillBadge variant="signal">{isWindow1 ? 'ปี 2569' : '2565–2569'}</PillBadge>
            </div>
            <p className="text-[11px] text-[#476788] hidden sm:block">
              {isWindow1
                ? 'กลุ่มงานสารสนเทศระบบสุขภาพด้านผู้สูงอายุ สถาบันเวชศาสตร์ผู้สูงอายุ กรมการแพทย์ • แหล่งข้อมูล HDC'
                : 'การวิเคราะห์ระบาดวิทยาและประชากรศาสตร์ผู้สูงอายุ • ข้อมูลมิเตอร์ประเทศไทย (ม.มหิดล) และ HDC'}
            </p>
          </div>
        </div>

        {/* Navigation Tabs for Window 1 */}
        {isWindow1 && setActiveTab && activeTab && (
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
        )}

        {/* CTA */}
        <div className="flex items-center gap-2">
          {isWindow1 && onExploreClick && (
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
