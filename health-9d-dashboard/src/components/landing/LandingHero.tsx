'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  ArrowDown, 
  Sparkles, 
  Eye, 
  Smile, 
  Activity, 
  Heart, 
  Ear, 
  Brain, 
  Droplet, 
  Apple, 
  ShieldCheck,
  Building2,
  Users
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
    <section className="relative overflow-hidden pt-4 pb-12 sm:pt-6 sm:pb-16 bg-[#eef0f3]">
      {/* Outer Studio Frame (Inspired by Aura: Noa Vale — A Portfolio in Motion) */}
      <div className="max-w-[1360px] mx-auto px-2 sm:px-4 lg:px-6">
        <div className="relative rounded-[28px] sm:rounded-[36px] bg-[#f5f2eb] border border-[#e2dcd2] shadow-2xl shadow-stone-800/10 overflow-hidden p-4 sm:p-7 lg:p-9 transition-all">
          
          {/* Subtle marble canvas grain & ambient floor light */}
          <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-60" 
               style={{ background: 'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.8) 0%, rgba(240,235,225,0.4) 60%, rgba(225,218,206,0.6) 100%)' }} />
          
          {/* 1. TOP HEADER BAR: Noa Vale Studio Style */}
          <header className="relative z-20 flex flex-col md:flex-row items-center justify-between gap-4 mb-8 sm:mb-12">
            {/* Left: Brand Identity with glowing dot */}
            <div className="flex items-center gap-3 self-start md:self-auto">
              <div className="flex items-center gap-1.5 font-bold tracking-tighter text-[#141b22] text-xl font-mono">
                <span>DMS</span>
                <span className="w-2 h-2 rounded-full bg-[#c07a38] animate-pulse" />
                <span>9D</span>
              </div>
              <div className="h-6 w-[1px] bg-[#d5cec2]" />
              <div>
                <h2 className="text-xs font-bold text-[#1a232c] tracking-tight uppercase">
                  สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ
                </h2>
                <p className="text-[10px] text-[#78716c] font-medium">
                  กรมการแพทย์ กระทรวงสาธารณสุข • กลุ่มงานสารสนเทศระบบสุขภาพด้านผู้สูงอายุ
                </p>
              </div>
            </div>

            {/* Center: Floating Glassmorphism Pill Menu */}
            <nav className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#dcd6cc] shadow-sm text-xs text-[#44403c] font-medium">
              <button 
                onClick={onExploreDashboard}
                className="px-2.5 py-1 rounded-full hover:bg-stone-100 hover:text-[#1c1917] transition-all flex items-center gap-1"
              >
                <span className="text-[10px] opacity-70">⊡</span>
                <span>ภาพรวม 9 มิติ</span>
              </button>
              <a 
                href="#geo-map" 
                className="px-2.5 py-1 rounded-full hover:bg-stone-100 hover:text-[#1c1917] transition-all flex items-center gap-1"
              >
                <span className="text-[10px] opacity-70">☍</span>
                <span>แผนที่ 76 จว.</span>
              </a>
              <a 
                href="#data-table" 
                className="px-2.5 py-1 rounded-full hover:bg-stone-100 hover:text-[#1c1917] transition-all flex items-center gap-1"
              >
                <span className="text-[10px] opacity-70">▤</span>
                <span>ตาราง 3 บรรทัด</span>
              </a>
            </nav>

            {/* Right: Tactile Amber/Bronze Metallic Button */}
            <div className="flex items-center gap-3 self-end md:self-auto">
              <button
                onClick={onExploreDashboard}
                className="relative group px-5 py-2 rounded-full text-xs font-semibold text-white tracking-wide shadow-md transition-all active:scale-95 overflow-hidden flex items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #c07a38 0%, #a25f23 50%, #874917 100%)',
                  boxShadow: '0 4px 14px rgba(162, 95, 35, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.4)'
                }}
              >
                <span>สำรวจแดชบอร์ด 9 ด้าน</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </header>

          {/* Top Right Metadata Header: Exact Noa Vale style */}
          <div className="relative z-10 flex items-center justify-between text-[11px] font-mono tracking-wider text-[#78716c] uppercase mb-4 sm:mb-6 px-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a]" />
              <span>ข้อมูลประมวลผล HDC Health Data Center</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#c07a38]" />
              <span className="font-semibold text-[#44403c]">SELECTED DIMENSIONS • 01–09 / 2569</span>
            </div>
          </div>

          {/* 2. THE 3D KINETIC MOTION STAGE (Noa Vale Cylindrical Rotating Carousel) */}
          <div className="relative z-10 my-4 sm:my-8">
            <div className="relative w-full h-[460px] sm:h-[520px] lg:h-[560px] flex items-center justify-center [perspective:1400px] overflow-hidden select-none">
              
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

                  // 3D Transform calculations based on Noa Vale template
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
                      className={`absolute w-[290px] sm:w-[340px] md:w-[380px] h-[410px] sm:h-[460px] rounded-[24px] sm:rounded-[28px] cursor-pointer transition-shadow ${
                        isActive
                          ? 'shadow-2xl shadow-stone-900/30 ring-1 ring-stone-900/10'
                          : 'shadow-lg shadow-stone-900/10 hover:opacity-95'
                      }`}
                    >
                      {/* CARD CONTENT */}
                      {isActive ? (
                        /* === ACTIVE CENTER CARD: PROCEDURAL CLINICAL MOTION ANIMATION === */
                        <div className="relative w-full h-full rounded-[24px] sm:rounded-[28px] overflow-hidden bg-stone-950 border border-white/20 flex flex-col justify-between text-white">
                          
                          {/* Themed Procedural 60fps Animation for this Dimension */}
                          <DimensionMotionCanvas
                            dimensionKey={dim.key}
                            isPlaying={isPlaying}
                          />

                          {/* Subtle Vignette Overlay for Crisp Readability */}
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-stone-900/40 pointer-events-none" />

                          {/* Top Card Controls Bar */}
                          <div className="relative z-10 p-4 sm:p-5 flex items-center justify-between">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono tracking-widest uppercase">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                              <span>CLINICAL MOTION • 0{dim.rank} {dim.name}</span>
                            </div>

                            {/* Animation Playback Controls */}
                            <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-full p-1 border border-white/15">
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
                                className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold transition-all ${
                                  isAutoRotate ? 'bg-amber-500/30 text-amber-300' : 'text-stone-400 hover:text-white'
                                }`}
                                title="สลับการหมุนมิติอัตโนมัติ"
                              >
                                {isAutoRotate ? 'AUTO' : 'MANUAL'}
                              </button>
                            </div>
                          </div>

                          {/* Center Graphic Watermark / Subtle Pulse */}
                          <div className="relative z-10 flex-1 flex items-center justify-center pointer-events-none">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm animate-pulse">
                              <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white/90 drop-shadow-lg" />
                            </div>
                          </div>

                          {/* Bottom Card Editorial Metadata */}
                          <div className="relative z-10 p-5 sm:p-6 bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-[2px]">
                            <div className="flex items-center justify-between text-xs text-amber-300/90 font-mono mb-1.5">
                              <span>0{dim.rank} / 09 • RANKING TOP {dim.rank}</span>
                              <span className="bg-amber-500/20 px-2 py-0.5 rounded text-[10px] font-semibold text-amber-200">
                                เสี่ยง {formatPercent(dim.riskPct)}
                              </span>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-snug mb-1">
                              {dim.name}
                            </h3>

                            <p className="text-[11px] text-stone-300 line-clamp-2 leading-relaxed mb-3">
                              {meta.clinicalNote}
                            </p>

                            <div className="flex items-center justify-between pt-2 border-t border-white/15">
                              <div className="text-[10px] text-stone-400 font-mono">
                                คัดกรอง {formatNumber(dim.screened)} คน
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSelectActiveDimension();
                                }}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 hover:text-white transition-colors"
                              >
                                <span>สำรวจมิตินี้ในแดชบอร์ด</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* === SIDE CARDS: ELEGANT EDITORIAL PAPER CARDS (Noa Vale Style) === */
                        <div className="relative w-full h-full rounded-[24px] sm:rounded-[28px] overflow-hidden bg-[#faf8f4] border border-[#dcd6cb] p-6 flex flex-col justify-between text-[#1c1917] select-none hover:bg-white transition-colors">
                          {/* Card Header */}
                          <div>
                            <div className="flex items-center justify-between text-[11px] font-mono text-[#78716c] uppercase mb-4 pb-2 border-b border-[#e7e2d8]">
                              <span>RANK 0{dim.rank}</span>
                              <span className="font-semibold text-[#1c1917]">HDC 2569</span>
                            </div>

                            <div className="w-10 h-10 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-700 mb-4">
                              <Icon className="w-5 h-5" />
                            </div>

                            <h4 className="text-xl font-bold text-[#1c1917] tracking-tight mb-1">
                              {dim.name}
                            </h4>

                            <p className="text-xs font-mono text-[#78716c] mb-3">
                              {meta.englishTitle}
                            </p>

                            <p className="text-xs text-[#57534e] line-clamp-3 leading-relaxed">
                              {meta.clinicalNote}
                            </p>
                          </div>

                          {/* Card Stat Footer */}
                          <div className="pt-4 border-t border-[#e7e2d8]">
                            <div className="text-[10px] font-mono uppercase text-[#78716c] mb-0.5">
                              อัตราความเสี่ยงประเมิน
                            </div>
                            <div className="text-2xl font-black text-[#1c1917] tracking-tight">
                              {formatPercent(dim.riskPct)}
                            </div>
                            <div className="text-[10px] text-[#78716c] mt-0.5">
                              ผู้มีความเสี่ยง {formatNumber(dim.risk)} คน
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Signature Noa Vale Floor Fracture Graphic underneath active card */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-48 sm:w-64 h-10 pointer-events-none opacity-40">
                <svg viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M100 0 L95 12 L82 18 L68 15 L50 25 M100 0 L106 14 L120 18 L138 16 L158 28 M100 0 L99 22 L92 34 M100 0 L103 24 L114 36" 
                        stroke="#78716c" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Stage Controls: Left/Right Navigation and Dimension Pill Selector */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-2 sm:px-6">
              
              {/* Active Dimension Caption: Noa Vale Editorial Style */}
              <div className="text-center sm:text-left">
                <div className="text-[10px] font-mono tracking-wider text-[#78716c] uppercase">
                  0{currentDim.rank} / 09 • MOVING HEALTH PERSPECTIVE
                </div>
                <h3 className="text-lg sm:text-xl font-extrabold text-[#1c1917] tracking-tight">
                  {currentDim.name} — {visualMeta.englishTitle}
                </h3>
              </div>

              {/* Center Arrows & View Dimension Button */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-full border border-[#d5cec2] bg-white/80 hover:bg-white text-[#44403c] flex items-center justify-center transition-all shadow-sm active:scale-95"
                  aria-label="Previous dimension"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={handleSelectActiveDimension}
                  className="px-4 py-2 rounded-full border border-[#d5cec2] bg-white/90 hover:bg-stone-900 hover:text-white text-xs font-semibold text-[#44403c] transition-all shadow-sm"
                >
                  สำรวจมิตินี้ในแดชบอร์ด ↗
                </button>

                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-full border border-[#d5cec2] bg-white/80 hover:bg-white text-[#44403c] flex items-center justify-center transition-all shadow-sm active:scale-95"
                  aria-label="Next dimension"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Bottom Right Scroll Indicator: Exactly as in Noa Vale */}
              <a
                href="#dashboard"
                className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-[#78716c] hover:text-[#1c1917] transition-colors"
              >
                <span className="w-6 h-6 rounded-full border border-[#d5cec2] flex items-center justify-center animate-bounce">
                  <ArrowDown className="w-3 h-3 text-[#c07a38]" />
                </span>
                <span>เลื่อนลงเพื่อดูข้อมูลเชิงลึก 76 จังหวัด</span>
              </a>
            </div>
          </div>

          {/* 3. EXECUTIVE KEY STATS BAND (Integrated cleanly below the stage) */}
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-8 border-t border-[#dfd9ce]">
            
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#dfd9ce] shadow-sm">
              <div className="flex items-center gap-2 text-[#78716c] text-xs font-medium mb-1">
                <Users className="w-4 h-4 text-[#006bff]" />
                <span>ผู้สูงอายุคัดกรองสะสม</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1c1917] tracking-tight">
                {formatNumber(national.totalScreened)}
              </div>
              <div className="text-[11px] text-[#78716c] mt-0.5">
                คนทั่วประเทศ (12 เขตสุขภาพ)
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#dfd9ce] shadow-sm">
              <div className="flex items-center gap-2 text-[#78716c] text-xs font-medium mb-1">
                <ShieldCheck className="w-4 h-4 text-[#16a34a]" />
                <span>คัดกรองครบทั้ง 9 ด้าน</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1c1917] tracking-tight">
                {formatPercent(national.pctScreened9d)}
              </div>
              <div className="text-[11px] text-[#78716c] mt-0.5">
                {formatNumber(national.screened9d)} คนที่มีข้อมูลสมบูรณ์
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#dfd9ce] shadow-sm">
              <div className="flex items-center gap-2 text-[#78716c] text-xs font-medium mb-1">
                <Eye className="w-4 h-4 text-[#c07a38]" />
                <span>ความเสี่ยงอันดับ 1 ประเทศ</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1c1917] tracking-tight truncate">
                {national.rankedDimensions[0]?.name || 'การมองเห็น'}
              </div>
              <div className="text-[11px] text-[#c07a38] font-bold mt-0.5">
                ร้อยละเสี่ยง {formatPercent(national.rankedDimensions[0]?.riskPct)}
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#dfd9ce] shadow-sm">
              <div className="flex items-center gap-2 text-[#78716c] text-xs font-medium mb-1">
                <Building2 className="w-4 h-4 text-[#006bff]" />
                <span>ความครอบคลุมพื้นที่</span>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#1c1917] tracking-tight">
                76 จังหวัด
              </div>
              <div className="text-[11px] text-[#78716c] mt-0.5">
                12 เขตบริการสุขภาพทั่วประเทศ
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
