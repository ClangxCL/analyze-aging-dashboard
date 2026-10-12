'use client';

import React from 'react';
import { Trophy, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { DimensionMetric } from '@/types/health';
import { formatNumber, formatPercent, getHeatMapColor } from '@/lib/analytics';
import { PillBadge } from '../ui/PillBadge';

interface TopRankingCardsProps {
  rankings: DimensionMetric[];
  scopeTitle: string;
}

export const TopRankingCards: React.FC<TopRankingCardsProps> = ({
  rankings,
  scopeTitle
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#006bff]" />
            <h3 className="text-xl font-bold text-[#0b3558]">
              จัดอันดับความเสี่ยงสุขภาพผู้สูงอายุ Top 1 - 9
            </h3>
          </div>
          <p className="text-xs text-[#476788] mt-0.5">
            เรียงตามร้อยละเสี่ยง/ผิดปกติจากมากที่สุดไปหาน้อย ({scopeTitle})
          </p>
        </div>
        <div className="flex items-center gap-2">
          <PillBadge variant="signal">เกณฑ์ % เสี่ยง</PillBadge>
          <span className="text-xs text-[#476788]">ครบทั้ง 9 ด้าน</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rankings.map((item, index) => {
          const rank = item.rank || index + 1;
          const isTop3 = rank <= 3;
          const colors = getHeatMapColor(item.riskPct);

          return (
            <div
              key={item.key}
              className={`relative bg-white rounded-[16px] p-5 border transition-all hover:translate-y-[-2px] ${
                isTop3
                  ? 'border-[#006bff]/30 card-elevation'
                  : 'border-[#d4e0ed] card-elevation-sm'
              }`}
            >
              {/* Top accent badge */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      rank === 1
                        ? 'bg-[#006bff] text-white shadow-md shadow-[#006bff]/30 ring-2 ring-[#006bff]/20'
                        : rank === 2
                        ? 'bg-[#0b3558] text-white'
                        : rank === 3
                        ? 'bg-[#476788] text-white'
                        : 'bg-[#f0f3f8] text-[#476788]'
                    }`}
                  >
                    #{rank}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0b3558] text-base leading-snug">
                      {item.name}
                    </h4>
                    <span className="text-[11px] text-[#476788]">
                      อันดับที่ {rank} ของพื้นที่
                    </span>
                  </div>
                </div>

                <div
                  className="px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  {formatPercent(item.riskPct)}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#f0f3f8] h-2 rounded-full overflow-hidden my-3">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (item.riskPct / 25) * 100)}%`,
                    backgroundColor: rank === 1 ? '#006bff' : rank <= 3 ? '#0b3558' : '#476788'
                  }}
                />
              </div>

              {/* Numbers */}
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-[#f0f3f8]">
                <div>
                  <span className="text-[#476788] block text-[11px]">จำนวนเสี่ยง/ผิดปกติ</span>
                  <span className="font-bold text-[#0b3558] text-sm">
                    {formatNumber(item.risk)} คน
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[#476788] block text-[11px]">จำนวนคัดกรองทั้งหมด</span>
                  <span className="font-medium text-[#476788] text-sm">
                    {formatNumber(item.screened)} คน
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
