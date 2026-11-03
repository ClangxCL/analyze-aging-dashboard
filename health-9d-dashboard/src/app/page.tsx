'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar, WindowMode } from '@/components/ui/Navbar';
import { LandingHero } from '@/components/landing/LandingHero';
import { FilterToolbar } from '@/components/ui/FilterToolbar';
import { TopRankingCards } from '@/components/dashboard/TopRankingCards';
import { ThailandGeoMap } from '@/components/dashboard/ThailandGeoMap';
import { RegionalHeatMap } from '@/components/dashboard/RegionalHeatMap';
import { DataTable } from '@/components/dashboard/DataTable';
import { StatCard } from '@/components/ui/StatCard';
import { PillBadge } from '@/components/ui/PillBadge';
import { ElderlySituationView } from '@/components/situation/ElderlySituationView';
import { AnalyzeAgingDashboard } from '@/components/analytics/AnalyzeAgingDashboard';
import { FilterState, HealthDataset } from '@/types/health';
import { computeAggregatedRankings, filterProvinces, formatNumber, formatPercent } from '@/lib/analytics';
import healthDataJson from '@/data/elderly_health_2026.json';
import { Activity, ShieldCheck, MapPin, Building2, ExternalLink, BarChart3, ArrowRight } from 'lucide-react';

const dataset: HealthDataset = healthDataJson as unknown as HealthDataset;

export default function Home() {
  const router = useRouter();
  const [currentWindow, setCurrentWindow] = useState<WindowMode>('screening-9d');
  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'heatmap' | 'table'>('overview');
  const [filter, setFilter] = useState<FilterState>({
    zone: 'all',
    province: 'all',
    dimension: 'all'
  });

  const dashboardRef = useRef<HTMLDivElement>(null);

  const handleScrollToDashboard = () => {
    dashboardRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filtered provinces
  const filteredProvinces = useMemo(() => {
    return filterProvinces(dataset.provinces, filter);
  }, [filter]);

  // Current scope rankings
  const activeRankings = useMemo(() => {
    return computeAggregatedRankings(dataset, filter);
  }, [filter]);

  // Dynamic scope title
  const scopeTitle = useMemo(() => {
    if (filter.province !== 'all') return `จ.${filter.province} (${filter.zone})`;
    if (filter.zone !== 'all') return `${filter.zone} (รวม ${filteredProvinces.length} จังหวัด)`;
    return 'ภาพรวมทั้งประเทศ (12 เขตสุขภาพ 76 จังหวัด)';
  }, [filter, filteredProvinces]);

  // Scope summary metrics
  const scopeMetrics = useMemo(() => {
    if (filter.province !== 'all') {
      const p = dataset.provinces.find(prov => prov.province === filter.province);
      return {
        screened: p ? p.totalScreened : 0,
        screened9d: p ? p.screened9d : 0,
        pct9d: p ? p.pctScreened9d : 0,
        top1Issue: p ? p.top1Issue : '',
        top1RiskPct: p ? p.top1RiskPct : 0
      };
    }
    if (filter.zone !== 'all') {
      const r = dataset.regions.find(reg => reg.zone === filter.zone);
      return {
        screened: r ? r.totalScreened : 0,
        screened9d: r ? r.screened9d : 0,
        pct9d: r ? r.pctScreened9d : 0,
        top1Issue: r ? r.top1Issue : '',
        top1RiskPct: r ? r.top1RiskPct : 0
      };
    }
    return {
      screened: dataset.national.totalScreened,
      screened9d: dataset.national.screened9d,
      pct9d: dataset.national.pctScreened9d,
      top1Issue: dataset.national.rankedDimensions[0]?.name || '',
      top1RiskPct: dataset.national.rankedDimensions[0]?.riskPct || 0
    };
  }, [filter]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fb]">
      {/* 1. Universal Dual-Window Navbar */}
      <Navbar
        currentWindow={currentWindow}
        onWindowChange={target => {
          setCurrentWindow(target);
        }}
        activeTab={activeTab}
        setActiveTab={tab => {
          setActiveTab(tab);
          const targetId =
            tab === 'overview'
              ? 'rankings'
              : tab === 'map'
              ? 'geo-map'
              : tab === 'heatmap'
              ? 'heat-map'
              : 'data-table';
          const el = document.getElementById(targetId);
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        onExploreClick={handleScrollToDashboard}
      />

      {/* WINDOW 3 VIEW: INTERACTIVE VISUALIZATIONS (ANALYZE AGING) */}
      {currentWindow === 'analyze-aging' ? (
        <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-8">
          <AnalyzeAgingDashboard />
        </main>
      ) : currentWindow === 'situation-5y' ? (
        /* WINDOW 2 VIEW: SITUATION 5-YEAR & DEMOGRAPHICS */
        <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-8">
          <ElderlySituationView />
        </main>
      ) : (
        /* WINDOW 1 VIEW: 9-DIMENSION SCREENING (76 PROVINCES) */
        <>
          {/* Quick Notice Banner for Window 2 & 3 Discovery */}
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border-b border-[#d4e0ed] py-2.5 px-4 sm:px-6">
            <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded font-bold bg-[#006bff] text-white">ใหม่</span>
                <span className="text-[#0b3558] font-semibold">
                  หน้าต่างที่ 3: ระบบแสดงภาพข้อมูลเชิงวิเคราะห์ (Analyze Aging Visualizer) พร้อมกราฟสรุป 8 มิติแล้ว
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push('/analyze-aging')}
                  className="font-bold text-[#006bff] hover:text-[#0b3558] flex items-center gap-1 transition-colors"
                >
                  <span>เปิดหน้าระบบแสดงภาพข้อมูล</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentWindow('situation-5y')}
                  className="font-semibold text-[#476788] hover:text-[#0b3558] flex items-center gap-1 transition-colors"
                >
                  <span>หน้าต่างที่ 2 (รายงาน)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Hero Section (Noa Vale Motion Experience) */}
          <LandingHero
            national={dataset.national}
            onExploreDashboard={handleScrollToDashboard}
            onSelectDimension={dimKey => {
              setFilter(prev => ({ ...prev, dimension: dimKey }));
              handleScrollToDashboard();
            }}
          />

          {/* Main Dashboard Workspace */}
          <main ref={dashboardRef} id="dashboard" className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 py-8">
            {/* Section Header */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b3558] tracking-tight">
                    ศูนย์ข้อมูลวิเคราะห์สุขภาพผู้สูงอายุ 9 มิติ
                  </h2>
                  <p className="text-sm text-[#476788] mt-1">
                    พื้นที่ประเมิน: <span className="font-semibold text-[#006bff]">{scopeTitle}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <PillBadge variant="signal">ปีงบประมาณ 2569</PillBadge>
                  <PillBadge variant="pebble">กระทรวงสาธารณสุข</PillBadge>
                </div>
              </div>
            </div>

            {/* Filter Toolbar */}
            <FilterToolbar
              filter={filter}
              setFilter={setFilter}
              regions={dataset.regions}
              provinces={dataset.provinces}
            />

            {/* Dynamic Context Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="จำนวนคัดกรองในพื้นที่"
                value={formatNumber(scopeMetrics.screened)}
                subtitle="ผู้สูงอายุที่เข้ารับการตรวจ"
                icon={<Activity className="w-5 h-5 text-[#006bff]" />}
              />
              <StatCard
                title="คัดกรองครบทั้ง 9 ด้าน"
                value={formatPercent(scopeMetrics.pct9d)}
                subtitle={`${formatNumber(scopeMetrics.screened9d)} คนที่มีผลครบ`}
                icon={<ShieldCheck className="w-5 h-5 text-[#1b7a42]" />}
                badge={<PillBadge variant="pebble">เกณฑ์มาตรฐาน</PillBadge>}
              />
              <StatCard
                title="ปัญหาเสี่ยงสูงสุดอันดับ 1"
                value={scopeMetrics.top1Issue}
                subtitle={`ร้อยละเสี่ยง ${formatPercent(scopeMetrics.top1RiskPct)}`}
                icon={<MapPin className="w-5 h-5 text-[#b86200]" />}
                badge={<PillBadge variant="warning">Top 1 Risk</PillBadge>}
              />
              <StatCard
                title="จำนวนจังหวัดในพื้นที่คัดกรอง"
                value={`${filteredProvinces.length} จังหวัด`}
                subtitle={filter.zone !== 'all' ? filter.zone : 'ครบทั้ง 12 เขตสุขภาพ'}
                icon={<Building2 className="w-5 h-5 text-[#006bff]" />}
              />
            </div>

            {/* View Switcher Container */}
            <div className="space-y-10">
              {/* Section: Top 1-9 Rankings */}
              <section id="rankings" className="space-y-4">
                <TopRankingCards
                  rankings={activeRankings}
                  scopeTitle={scopeTitle}
                />
              </section>

              {/* Section: Geographic Map and Heat Map (2-Column on large screens) */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Geographic Map (7 cols) */}
                <div id="geo-map" className="lg:col-span-6 xl:col-span-5">
                  <ThailandGeoMap
                    provinces={filteredProvinces}
                    filter={filter}
                    onSelectProvince={provName => {
                      setFilter(prev => ({ ...prev, province: provName }));
                    }}
                    onSelectZone={zoneName => {
                      setFilter(prev => ({ ...prev, zone: zoneName, province: 'all' }));
                    }}
                  />
                </div>

                {/* Regional Heatmap (7 cols) */}
                <div id="heat-map" className="lg:col-span-6 xl:col-span-7">
                  <RegionalHeatMap
                    regions={dataset.regions}
                    filter={filter}
                    onSelectZone={zoneName => {
                      setFilter(prev => ({ ...prev, zone: zoneName, province: 'all' }));
                    }}
                    onSelectDimension={dimKey => {
                      setFilter(prev => ({ ...prev, dimension: dimKey }));
                    }}
                  />
                </div>
              </section>

              {/* Section: Comprehensive Data Table */}
              <section>
                <DataTable provinces={filteredProvinces} />
              </section>
            </div>
          </main>
        </>
      )}

      {/* Footer in Calendly Style */}
      <footer className="bg-white border-t border-[#d4e0ed] mt-16 py-12">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-[#f0f3f8]">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#006bff] flex items-center justify-center text-white font-bold">
                  9D
                </div>
                <span className="font-bold text-[#0b3558] text-base">
                  ระบบสารสนเทศสุขภาพผู้สูงอายุ 9 ด้าน 2569
                </span>
              </div>
              <p className="text-xs text-[#476788] max-w-sm leading-relaxed">
                แพลตฟอร์มวิเคราะห์ข้อมูลสุขภาพเพื่อสนับสนุนการตัดสินใจเชิงนโยบาย
                พัฒนาตามมาตรฐานความปลอดภัยข้อมูลสาธารณสุข รองรับการประมวลผล 76 จังหวัด และ 12 เขตบริการสุขภาพ
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#476788] mb-3">
                มิติสุขภาพ 9 ด้าน
              </h4>
              <ul className="space-y-1.5 text-xs text-[#0b3558]">
                <li>การมองเห็น • สุขภาพช่องปาก</li>
                <li>การเคลื่อนไหว • กิจวัตรประจำวัน (ADL)</li>
                <li>การได้ยิน • ความคิดความจำ</li>
                <li>การกลั้นปัสสาวะ • ขาดสารอาหาร</li>
                <li>ภาวะซึมเศร้า 2Q</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#476788] mb-3">
                แหล่งข้อมูลและการเผยแพร่
              </h4>
              <ul className="space-y-1.5 text-xs text-[#0b3558]">
                <li>ระบบคลังข้อมูลด้านการแพทย์และสุขภาพ (HDC)</li>
                <li>กลุ่มงานสารสนเทศระบบสุขภาพด้านผู้สูงอายุ</li>
                <li>สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ</li>
                <li>กรมการแพทย์ กระทรวงสาธารณสุข</li>
                <li className="flex items-center gap-1 text-[#006bff] font-medium pt-1">
                  <span>พร้อมใช้งานบน Vercel</span>
                  <ExternalLink className="w-3 h-3" />
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#476788]">
            <div>
              วิเคราะห์และจัดทำข้อมูลโดย กลุ่มงานสารสนเทศระบบสุขภาพด้านผู้สูงอายุ สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ กรมการแพทย์ กระทรวงสาธารณสุข • ที่มาข้อมูล: ระบบคลังข้อมูลด้านการแพทย์และสุขภาพ หรือ HDC (Health Data Center)
            </div>
            <div className="flex items-center gap-4">
              <span>Theme: Noa Vale Motion & Navy Marble</span>
              <span>Next.js & Tailwind CSS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
