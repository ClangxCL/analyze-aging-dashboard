'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  ArrowDown, 
  Eye, 
  Smile, 
  Activity, 
  Heart, 
  Ear, 
  Brain, 
  Droplet, 
  Apple, 
  ShieldCheck,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { NationalData, DimensionKey } from '@/types/health';
import { formatNumber, formatPercent } from '@/lib/analytics';
import { DimensionMotionCanvas } from './DimensionMotionCanvas';

interface LandingHeroProps {
  national: NationalData;
  onExploreDashboard: () => void;
  onSelectDimension?: (dimKey: DimensionKey) => void;
}

interface DimensionVisualMeta {
  key: DimensionKey;
  englishTitle: string;
  themeColor: string;
  gradient: string;
  borderGlow: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  clinicalNote: string;
}

const DIMENSION_VISUALS: Record<DimensionKey, DimensionVisualMeta> = {
  vision: {
    key: 'vision',
    englishTitle: 'Visual Health & Cataract',
    themeColor: '#006bff',
    gradient: 'from-[#006bff]/20 via-[#0099ff]/10 to-transparent',
    borderGlow: 'rgba(0, 107, 255, 0.35)',
    icon: Eye,
    tagline: 'การมองเห็นและโรคต้อกระจก',
    clinicalNote: 'ตรวจคัดกรองสายตาเลือนราง ต้อกระจก และความผิดปกติของการหักเหแสงเพื่อป้องกันการพลัดตกหกล้ม'
  },
  oral: {
    key: 'oral',
    englishTitle: 'Oral Health & Dentition',
    themeColor: '#0284c7',
    gradient: 'from-[#0284c7]/20 via-[#38bdf8]/10 to-transparent',
    borderGlow: 'rgba(2, 132, 199, 0.35)',
    icon: Smile,
    tagline: 'สุขภาพช่องปากและการบดเคี้ยว',
    clinicalNote: 'ประเมินฟันแท้ใช้งานไม่น้อยกว่า 20 ซี่ เพื่อคงประสิทธิภาพการเคี้ยวอาหารและภาวะโภชนาการ'
  },
  mobility: {
    key: 'mobility',
    englishTitle: 'Mobility & Fall Prevention',
    themeColor: '#d97706',
    gradient: 'from-[#d97706]/20 via-[#fbbf24]/10 to-transparent',
    borderGlow: 'rgba(217, 119, 6, 0.35)',
    icon: Activity,
    tagline: 'การเคลื่อนไหวและป้องกันหกล้ม',
    clinicalNote: 'แบบทดสอบ Time Up and Go (TUG) และข้อเข่าเสื่อม ป้องกันทุพพลภาพและการติดเตียง'
  },
  adl: {
    key: 'adl',
    englishTitle: 'Activities of Daily Living',
    themeColor: '#16a34a',
    gradient: 'from-[#16a34a]/20 via-[#4ade80]/10 to-transparent',
    borderGlow: 'rgba(22, 163, 74, 0.35)',
    icon: ShieldCheck,
    tagline: 'การปฏิบัติกิจวัตรประจำวัน (ADL)',
    clinicalNote: 'ดัชนีบาร์เธล (Barthel Index) จำแนกกลุ่มติดสังคม ติดบ้าน และติดเตียง เพื่อการดูแลระยะยาว'
  },
  hearing: {
    key: 'hearing',
    englishTitle: 'Hearing & Auditory Acuity',
    themeColor: '#8b5cf6',
    gradient: 'from-[#8b5cf6]/20 via-[#c084fc]/10 to-transparent',
    borderGlow: 'rgba(139, 92, 246, 0.35)',
    icon: Ear,
    tagline: 'การได้ยินและการสื่อสารทางสังคม',
    clinicalNote: 'ตรวจคัดกรองภาวะประสาทหูเสื่อมตามวัย ป้องกันความโดดเดี่ยวทางสังคมและภาวะซึมเศร้า'
  },
  cognition: {
    key: 'cognition',
    englishTitle: 'Cognitive Function & Memory',
    themeColor: '#ec4899',
    gradient: 'from-[#ec4899]/20 via-[#f472b6]/10 to-transparent',
    borderGlow: 'rgba(236, 72, 153, 0.35)',
    icon: Brain,
    tagline: 'ความคิดความจำและสมองเสื่อม',
    clinicalNote: 'แบบประเมิน Mini-Cog และ AMT คัดกรองภาวะสมองเสื่อมระยะเริ่มต้นเพื่อการชะลอความเสื่อม'
  },
  incontinence: {
    key: 'incontinence',
    englishTitle: 'Urinary Continence Care',
    themeColor: '#06b6d4',
    gradient: 'from-[#06b6d4]/20 via-[#67e8f9]/10 to-transparent',
    borderGlow: 'rgba(6, 182, 212, 0.35)',
    icon: Droplet,
    tagline: 'การกลั้นปัสสาวะและระบบขับถ่าย',
    clinicalNote: 'ประเมินปัญหาปัสสาวะเล็ดราด ซึ่งเป็นปัจจัยกระตุ้นสำคัญของการติดเชื้อและแผลกดทับ'
  },
  nutrition: {
    key: 'nutrition',
    englishTitle: 'Nutritional Status & Sarcopenia',
    themeColor: '#e11d48',
    gradient: 'from-[#e11d48]/20 via-[#fb7185]/10 to-transparent',
    borderGlow: 'rgba(225, 29, 72, 0.35)',
    icon: Apple,
    tagline: 'ภาวะโภชนาการและมวลกล้ามเนื้อ',
    clinicalNote: 'แบบประเมิน Mini Nutritional Assessment (MNA) ป้องกันภาวะกล้ามเนื้อลีบและการขาดสารอาหาร'
  },
  depression: {
    key: 'depression',
    englishTitle: 'Mental Wellness & Depression (2Q)',
    themeColor: '#4f46e5',
    gradient: 'from-[#4f46e5]/20 via-[#818cf8]/10 to-transparent',
    borderGlow: 'rgba(79, 70, 229, 0.35)',
    icon: Heart,
    tagline: 'สุขภาพจิตและภาวะซึมเศร้า 2Q',
    clinicalNote: 'แบบคัดกรอง 2 คำถาม สัญญาณเตือนอารมณ์เศร้าท้อแท้ เพื่อส่งต่อระบบดูแลจิตใจเชิงรุก'
  }
};

export const LandingHero: React.FC<LandingHeroProps> = ({
  national,
  onExploreDashboard,
  onSelectDimension
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isAutoRotate, setIsAutoRotate] = useState(true);

  // Ranked dimensions list
  const dimensions = national.rankedDimensions || [];
  const currentDim = dimensions[activeIndex] || dimensions[0];
  const visualMeta = currentDim ? DIMENSION_VISUALS[currentDim.key] : DIMENSION_VISUALS.vision;

  // Auto-rotation every 7 seconds if enabled
  useEffect(() => {
    if (!isAutoRotate || dimensions.length === 0) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % dimensions.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [isAutoRotate, dimensions.length]);

  const handlePrev = () => {
    setIsAutoRotate(false);
    setActiveIndex(prev => (prev - 1 + dimensions.length) % dimensions.length);
  };

  const handleNext = () => {
    setIsAutoRotate(false);
    setActiveIndex(prev => (prev + 1) % dimensions.length);
  };

  const handleCardClick = (index: number) => {
    setIsAutoRotate(false);
    setActiveIndex(index);
  };

  const handleSelectActiveDimension = () => {
    if (currentDim && onSelectDimension) {
      onSelectDimension(currentDim.key);
    } else {
      onExploreDashboard();
    }
  };

  return (
    <section className="relative overflow-hidden pt-4 pb-10 sm:pt-6 sm:pb-14 bg-[#f8f9fb]">
      {/* Decorative ambient blobs (Navy Ink on Cool Marble from DESIGN.md) */}
      <div 
        className="absolute top-0 left-1/4 -translate-x-1/2 w-[520px] h-[520px] rounded-full blur-[130px] opacity-25 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, #e55cff 0%, #0099ff 100%)' }}
      />
      <div 
        className="absolute top-1/3 right-10 w-[420px] h-[420px] rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, #006bff 0%, #0099ff 100%)' }}
      />

      {/* Outer Studio Frame: Theme Navy Ink on Cool Marble */}
      <div className="max-w-[1360px] mx-auto px-2 sm:px-4 lg:px-6 relative z-10">
        <div className="relative rounded-[28px] sm:rounded-[36px] bg-white border border-[#d4e0ed] shadow-xl shadow-[#0b3558]/5 overflow-hidden p-4 sm:p-7 lg:p-9 transition-all">
          
          {/* Subtle cool marble gradient wash */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-40" 
            style={{ 
              background: 'radial-gradient(circle at 50% 15%, rgba(240, 243, 248, 0.8) 0%, rgba(248, 249, 251, 0.3) 60%, rgba(255, 255, 255, 0) 100%)' 
            }} 
          />

          {/* 1. TOP HEADER BAR: Navy Ink on Cool Marble */}
          <header className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-4 mb-6 sm:mb-8">
            {/* Left: Brand Identity with Signal Blue Pulse Dot */}
            <div className="flex items-center gap-3 self-start md:self-auto">
              <div className="flex items-center gap-1.5 font-extrabold tracking-tight text-[#0b3558] text-xl font-mono">
                <span>DMS</span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#006bff] shadow-[0_0_8px_#006bff] animate-pulse" />
                <span className="text-[#006bff]">9D</span>
              </div>
              <div className="h-6 w-[1px] bg-[#d4e0ed]" />
              <div>
                <h2 className="text-xs font-bold text-[#0b3558] tracking-tight uppercase">
                  สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ
                </h2>
                <p className="text-[11px] text-[#476788] font-medium">
                  กรมการแพทย์ กระทรวงสาธารณสุข • กลุ่มงานสารสนเทศระบบสุขภาพด้านผู้สูงอายุ
                </p>
              </div>
            </div>

            {/* Center: Floating Glassmorphism Pill Menu matching Navbar */}
            <nav className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#f0f3f8] border border-[#d4e0ed] shadow-sm text-xs text-[#476788] font-semibold">
              <button 
                onClick={onExploreDashboard}
                className="px-2.5 py-1 rounded-full hover:bg-white hover:text-[#0b3558] transition-all flex items-center gap-1"
              >
                <span className="text-[10px] text-[#006bff]">⊡</span>
                <span>ภาพรวม 9 มิติ</span>
              </button>
              <a 
                href="#geo-map" 
                className="px-2.5 py-1 rounded-full hover:bg-white hover:text-[#0b3558] transition-all flex items-center gap-1"
              >
                <span className="text-[10px] text-[#006bff]">☍</span>
                <span>แผนที่ 76 จว.</span>
              </a>
              <a 
                href="#data-table" 
                className="px-2.5 py-1 rounded-full hover:bg-white hover:text-[#0b3558] transition-all flex items-center gap-1"
              >
                <span className="text-[10px] text-[#006bff]">▤</span>
                <span>ตาราง 3 บรรทัด</span>
              </a>
            </nav>

            {/* Right: Signal Blue CTA Button */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              <button
                onClick={onExploreDashboard}
                className="relative group px-5 py-2.5 rounded-full text-xs font-bold text-white tracking-wide shadow-lg shadow-[#006bff]/25 transition-all active:scale-95 overflow-hidden flex items-center gap-2 bg-[#006bff] hover:bg-[#005cd6]"
              >
                <span>สำรวจแดชบอร์ด 9 ด้าน</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </header>

          {/* Top Right Metadata Header */}
          <div className="relative z-10 flex items-center justify-between text-xs font-mono tracking-wider text-[#476788] uppercase mb-4 sm:mb-6 px-1 border-b border-[#f0f3f8] pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1b7a42]" />
              <span className="font-semibold text-[#0b3558]">ข้อมูลประมวลผล HDC Health Data Center</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#006bff] rounded-sm" />
              <span className="font-extrabold text-[#006bff]">SELECTED DIMENSIONS • 01–09 / 2569</span>
            </div>
          </div>

          {/* 2. THE 3D KINETIC MOTION STAGE */}
          <div className="relative z-10 my-2 sm:my-6">
            <div className="relative w-full h-[470px] sm:h-[530px] lg:h-[570px] flex items-center justify-center [perspective:1400px] overflow-hidden select-none">
              
              {/* Carousel Cards Layer */}
              <div className="relative w-full max-w-4xl h-full flex items-center justify-center [transform-style:preserve-3d]">
                {dimensions.map((dim, idx) => {
                  const offset = (idx - activeIndex + dimensions.length) % dimensions.length;
                  const normalizedOffset = offset > dimensions.length / 2 ? offset - dimensions.length : offset;
                  
                  // Only render visible cards in 3D arc (-2, -1, 0, 1, 2)
                  const isVisible = Math.abs(normalizedOffset) <= 2;
                  if (!isVisible) return null;

                  const meta = DIMENSION_VISUALS[dim.key] || DIMENSION_VISUALS.vision;
                  const Icon = meta.icon;
                  const isActive = normalizedOffset === 0;

                  // 3D Transform calculations
                  let translateX = normalizedOffset * 220; // px
                  let translateZ = -Math.abs(normalizedOffset) * 140; // px
                  let rotateY = -normalizedOffset * 28; // deg
                  let scale = isActive ? 1.04 : 0.88 - Math.abs(normalizedOffset) * 0.08;
                  let opacity = isActive ? 1 : Math.max(0.45, 0.85 - Math.abs(normalizedOffset) * 0.25);
                  let zIndex = 30 - Math.abs(normalizedOffset) * 10;

                  return (
                    <div
                      key={dim.key}
                      onClick={() => handleCardClick(idx)}
                      style={{
                        transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                        opacity,
                        zIndex,
                        transition: 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease'
                      }}
                      className={`absolute w-[295px] sm:w-[345px] md:w-[385px] h-[415px] sm:h-[465px] rounded-[24px] sm:rounded-[28px] cursor-pointer transition-shadow ${
                        isActive
                          ? 'shadow-[0_20px_50px_rgba(11,53,88,0.35),0_0_30px_rgba(0,107,255,0.25)] ring-2 ring-[#006bff]/50'
                          : 'shadow-lg shadow-[#0b3558]/10 hover:opacity-100 hover:shadow-xl'
                      }`}
                    >
                      {/* CARD CONTENT */}
                      {isActive ? (
                        /* === ACTIVE CENTER CARD: PROCEDURAL CLINICAL MOTION CONSOLE === */
                        <div className="relative w-full h-full rounded-[24px] sm:rounded-[28px] overflow-hidden bg-[#071524] border border-[#006bff]/50 flex flex-col justify-between text-white">
                          
                          {/* Themed Procedural 60fps Animation for this Dimension */}
                          <DimensionMotionCanvas
                            dimensionKey={dim.key}
                            isPlaying={isPlaying}
                          />

                          {/* Vignette Overlay for Crisp Readability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#071524] via-[#071524]/20 to-black/40 pointer-events-none" />

                          {/* Top Card Controls Bar: WITH PROMINENT RANKING & CONTROLS */}
                          <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between">
                            {/* Prominent High-Contrast Rank Pill */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#006bff] text-white text-xs font-black shadow-lg shadow-[#006bff]/40 tracking-wide uppercase">
                              <TrendingUp className="w-3.5 h-3.5" />
                              <span>TOP {dim.rank} • อันดับ {dim.rank} ประเทศ</span>
                            </div>

                            {/* Animation Playback Controls */}
                            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-full p-1 border border-white/20">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsPlaying(prev => !prev);
                                }}
                                className="p-1.5 rounded-full hover:bg-white/20 transition-all text-white/90"
                                title={isPlaying ? 'หยุดแอนิเมชันชั่วคราว' : 'เล่นแอนิเมชัน'}
                              >
                                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsAutoRotate(prev => !prev);
                                }}
                                className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-extrabold transition-all ${
                                  isAutoRotate ? 'bg-[#006bff] text-white' : 'text-slate-300 hover:text-white'
                                }`}
                                title="สลับการหมุนมิติอัตโนมัติ"
                              >
                                {isAutoRotate ? 'AUTO' : 'MANUAL'}
                              </button>
                            </div>
                          </div>

                          {/* Center Graphic Watermark / Subtle Pulse */}
                          <div className="relative z-10 flex-1 flex items-center justify-center pointer-events-none">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-cyan-400/30 flex items-center justify-center bg-cyan-950/20 backdrop-blur-sm shadow-[0_0_20px_rgba(0,153,255,0.25)] animate-pulse">
                              <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-300 drop-shadow-lg" />
                            </div>
                          </div>

                          {/* Bottom Card Editorial Metadata: PROMINENT TITLE & HUGE % RISK */}
                          <div className="relative z-10 p-5 sm:p-6 bg-gradient-to-t from-[#071524] via-[#071524]/95 to-transparent backdrop-blur-[2px] border-t border-white/10">
                            {/* Headline Banner with Huge Risk % */}
                            <div className="flex items-end justify-between gap-3 mb-2">
                              <div>
                                <div className="text-[11px] font-mono uppercase tracking-wider text-cyan-300 mb-0.5 font-bold">
                                  0{dim.rank} / 09 • มิติสุขภาพประเมิน
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
                                  {dim.name}
                                </h3>
                              </div>

                              {/* HUGE, PROMINENT RISK PERCENTAGE */}
                              <div className="text-right flex-shrink-0 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 shadow-md">
                                <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 font-bold">
                                  ร้อยละความเสี่ยง
                                </div>
                                <div className="text-3xl sm:text-4xl font-black text-amber-300 tracking-tight leading-none">
                                  {formatPercent(dim.riskPct)}
                                </div>
                              </div>
                            </div>

                            <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed mb-3 font-medium">
                              {meta.clinicalNote}
                            </p>

                            <div className="flex items-center justify-between pt-2.5 border-t border-white/15">
                              <div className="text-xs text-slate-300 font-mono">
                                กลุ่มเสี่ยง: <span className="font-bold text-white">{formatNumber(dim.risk)}</span> / คัดกรอง {formatNumber(dim.screened)} คน
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectActiveDimension();
                                }}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 hover:text-white transition-colors"
                              >
                                <span>สำรวจมิตินี้ในแดชบอร์ด</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* === SIDE CARDS: NAVY INK ON COOL MARBLE PAPER CARDS === */
                        <div className="relative w-full h-full rounded-[24px] sm:rounded-[28px] overflow-hidden bg-white/95 backdrop-blur-md border border-[#d4e0ed] p-6 flex flex-col justify-between text-[#0b3558] select-none hover:border-[#006bff]/50 hover:shadow-xl transition-all shadow-md shadow-[#0b3558]/5">
                          {/* Card Header: PROMINENT RANKING BADGE */}
                          <div>
                            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#f0f3f8]">
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#e6f0ff] text-[#006bff] border border-[#b8d5ff] text-xs font-black tracking-wide">
                                <TrendingUp className="w-3 h-3" />
                                <span>อันดับ {dim.rank} ประเทศ</span>
                              </span>
                              <span className="text-[11px] font-mono font-bold text-[#476788]">
                                HDC 2569
                              </span>
                            </div>

                            <div className="w-11 h-11 rounded-xl bg-[#f0f3f8] border border-[#d4e0ed] flex items-center justify-center text-[#006bff] mb-3">
                              <Icon className="w-6 h-6" />
                            </div>

                            <h4 className="text-xl font-black text-[#0b3558] tracking-tight mb-1">
                              {dim.name}
                            </h4>

                            <p className="text-xs font-mono font-medium text-[#476788] mb-2">
                              {meta.englishTitle}
                            </p>

                            <p className="text-xs text-[#476788] line-clamp-2 leading-relaxed">
                              {meta.clinicalNote}
                            </p>
                          </div>

                          {/* Card Stat Footer: PROMINENT HUGE RISK % */}
                          <div className="pt-4 border-t border-[#f0f3f8] bg-[#f8f9fb] -mx-6 -mb-6 p-5">
                            <div className="flex items-baseline justify-between mb-1">
                              <span className="text-xs font-extrabold uppercase tracking-wider text-[#006bff]">
                                ร้อยละความเสี่ยง
                              </span>
                              <span className="text-3xl sm:text-4xl font-black text-[#0b3558] tracking-tight">
                                {formatPercent(dim.riskPct)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-[#476788] mt-1 font-medium">
                              <span>ผู้มีความเสี่ยง {formatNumber(dim.risk)} คน</span>
                              <span className="text-xs font-bold text-[#006bff]">คลิกดูมิติ ↗</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Signature Floor Fracture Graphic: Signal Blue on Cool Marble Floor */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-10 pointer-events-none opacity-50">
                <svg viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path 
                    d="M100 0 L95 12 L82 18 L68 15 L50 25 M100 0 L106 14 L120 18 L138 16 L158 28 M100 0 L99 22 L92 34 M100 0 L103 24 L114 36" 
                    stroke="#006bff" 
                    strokeWidth="1.2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />
                </svg>
              </div>
            </div>

            {/* Stage Controls: Left/Right Navigation and Prominent Active Dimension Info */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-2 sm:px-6 pt-4 border-t border-[#f0f3f8]">
              
              {/* Active Dimension Caption: PROMINENT RANKING & RISK % */}
              <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2.5 mb-1">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#006bff] text-white text-xs font-black shadow-sm">
                    <TrendingUp className="w-3 h-3" />
                    <span>อันดับ {currentDim.rank} ประเทศ</span>
                  </span>
                  <span className="text-base font-black text-[#006bff]">
                    ร้อยละเสี่ยง {formatPercent(currentDim.riskPct)}
                  </span>
                  <span className="text-xs text-[#476788] font-medium hidden md:inline">
                    • ผู้มีความเสี่ยง {formatNumber(currentDim.risk)} คน
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#0b3558] tracking-tight">
                  {currentDim.name} — <span className="text-[#476788] font-semibold text-lg">{visualMeta.englishTitle}</span>
                </h3>
              </div>

              {/* Center Arrows & View Dimension Button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full border border-[#d4e0ed] bg-[#f0f3f8] hover:bg-white text-[#0b3558] flex items-center justify-center transition-all shadow-sm active:scale-95"
                  aria-label="Previous dimension"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={handleSelectActiveDimension}
                  className="px-5 py-2.5 rounded-full bg-[#006bff] hover:bg-[#005cd6] text-xs font-bold text-white transition-all shadow-md shadow-[#006bff]/25 active:scale-95"
                >
                  สำรวจมิตินี้ในแดชบอร์ด ↗
                </button>

                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full border border-[#d4e0ed] bg-[#f0f3f8] hover:bg-white text-[#0b3558] flex items-center justify-center transition-all shadow-sm active:scale-95"
                  aria-label="Next dimension"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Bottom Right Scroll Indicator */}
              <a
                href="#dashboard"
                className="hidden lg:flex items-center gap-2 text-xs font-mono font-medium text-[#476788] hover:text-[#0b3558] transition-colors"
              >
                <span className="w-7 h-7 rounded-full border border-[#d4e0ed] bg-[#f0f3f8] flex items-center justify-center animate-bounce text-[#006bff]">
                  <ArrowDown className="w-3.5 h-3.5" />
                </span>
                <span>เลื่อนลงเพื่อดูข้อมูลเชิงลึก 76 จังหวัด</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
