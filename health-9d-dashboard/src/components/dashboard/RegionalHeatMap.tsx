'use client';

import React, { useState } from 'react';
import { Grid, Eye, AlertCircle } from 'lucide-react';
import { DimensionKey, FilterState, RegionData } from '@/types/health';
import { DIMENSIONS, formatNumber, formatPercent, getHeatMapColor } from '@/lib/analytics';
import { PillBadge } from '../ui/PillBadge';

interface RegionalHeatMapProps {
  regions: RegionData[];
  filter: FilterState;
  onSelectZone: (zone: string) => void;
  onSelectDimension: (dim: DimensionKey) => void;
}

export const RegionalHeatMap: React.FC<RegionalHeatMapProps> = ({
  regions,
  filter,
  onSelectZone,
  onSelectDimension
}) => {
  const [hoveredCell, setHoveredCell] = useState<{
    zone: string;
    dimName: string;
    riskPct: number;
    screened: number;
    risk: number;
    rank?: number;
  } | null>(null);

  return (
    <div className="bg-white rounded-[24px] p-6 border border-[#d4e0ed] card-elevation transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#f0f3f8]">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#e6f0ff] text-[#006bff] rounded-xl">
            <Grid className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0b3558]">
              ฮีทแมพเปรียบเทียบความเสี่ยงรายเขตสุขภาพ (Regional Heat Map)
            </h3>
            <p className="text-xs text-[#476788] mt-0.5">
              เมทริกซ์ 12 เขตบริการสุขภาพ × 9 ประเด็นสุขภาพ • แสดงร้อยละความเสี่ยง (% เสี่ยง/ผิดปกติ)
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-xs bg-[#f0f3f8] p-2 rounded-xl border border-[#d4e0ed]">
          <span className="text-[#476788] font-medium mr-1">ระดับสี:</span>
          <div className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#f0f3f8] border border-[#d4e0ed]" />
            <span className="text-[10px] text-[#476788]">&lt;4%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#cce0ff]" />
            <span className="text-[10px] text-[#476788]">4-7%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#99c2ff]" />
            <span className="text-[10px] text-[#476788]">7-10%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#4d94ff]" />
            <span className="text-[10px] text-[#476788]">10-14%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#006bff]" />
            <span className="text-[10px] text-[#476788]">14-18%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#004eba]" />
            <span className="text-[10px] text-[#476788]">&gt;18%</span>
          </div>
        </div>
      </div>

      {/* Heatmap Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[840px] border-collapse text-xs">
          <thead>
            <tr>
              <th className="p-3 text-left font-bold text-[#0b3558] bg-[#f8f9fb] rounded-tl-xl border-b border-r border-[#d4e0ed] sticky left-0 z-20">
                เขตบริการสุขภาพ
              </th>
              {DIMENSIONS.map(d => (
                <th
                  key={d.key}
                  onClick={() => onSelectDimension(d.key)}
                  className={`p-2.5 text-center font-bold border-b border-[#d4e0ed] transition-colors cursor-pointer hover:bg-[#e6f0ff] ${
                    filter.dimension === d.key
                      ? 'bg-[#e6f0ff] text-[#006bff] ring-1 ring-[#006bff] ring-inset'
                      : 'text-[#0b3558] bg-[#f8f9fb]'
                  }`}
                  title={`คลิกเพื่อกรองเฉพาะ: ${d.name}`}
                >
                  <div className="leading-tight">{d.shortName}</div>
                  <div className="text-[10px] font-normal text-[#476788] mt-0.5">
                    {filter.dimension === d.key ? '✓ กำลังเลือก' : 'คลิกเลือก'}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {regions.map((reg, rIdx) => {
              const isSelectedZone = filter.zone === reg.zone;

              return (
                <tr
                  key={reg.zone}
                  className={`transition-colors ${
                    isSelectedZone ? 'bg-[#f0f6ff]' : 'hover:bg-[#f8f9fb]'
                  }`}
                >
                  {/* Region Name Column */}
                  <td
                    onClick={() => onSelectZone(reg.zone)}
                    className={`p-3 font-semibold border-b border-r border-[#d4e0ed] sticky left-0 z-10 cursor-pointer ${
                      isSelectedZone
                        ? 'bg-[#e6f0ff] text-[#006bff] font-bold'
                        : 'bg-white text-[#0b3558] hover:text-[#006bff]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span>{reg.zone}</span>
                      <span className="text-[10px] text-[#476788] font-normal">
                        ({reg.provinceCount} จว.)
                      </span>
                    </div>
                  </td>

                  {/* 9 Dimensions Heat Cells */}
                  {DIMENSIONS.map(d => {
                    const cell = reg.dimensions[d.key];
                    const riskPct = cell ? cell.riskPct : 0;
                    const colors = getHeatMapColor(riskPct);
                    const isCellDimSelected = filter.dimension === d.key;

                    return (
                      <td
                        key={d.key}
                        onMouseEnter={() => {
                          setHoveredCell({
                            zone: reg.zone,
                            dimName: d.name,
                            riskPct,
                            screened: cell?.screened || 0,
                            risk: cell?.risk || 0,
                            rank: cell?.rank
                          });
                        }}
                        onMouseLeave={() => setHoveredCell(null)}
                        onClick={() => {
                          onSelectZone(reg.zone);
                          onSelectDimension(d.key);
                        }}
                        className={`p-2.5 text-center font-bold border-b border-[#d4e0ed] transition-all cursor-pointer hover:scale-105 hover:z-10 relative ${
                          isCellDimSelected ? 'ring-2 ring-[#006bff] ring-inset' : ''
                        }`}
                        style={{
                          backgroundColor: colors.bg,
                          color: colors.text
                        }}
                      >
                        <span className="tabular-nums">
                          {formatPercent(riskPct)}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Interactive Tooltip Card at Bottom of Heatmap */}
      <div className="mt-4 pt-3 border-t border-[#f0f3f8] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        {hoveredCell ? (
          <div className="flex items-center gap-3 text-[#0b3558]">
            <span className="font-bold">{hoveredCell.zone}</span>
            <span className="text-[#476788]">•</span>
            <span className="font-semibold text-[#006bff]">{hoveredCell.dimName}</span>
            <span className="text-[#476788]">•</span>
            <span>เสี่ยง: <strong>{formatPercent(hoveredCell.riskPct)}</strong> ({formatNumber(hoveredCell.risk)} คน จากคัดกรอง {formatNumber(hoveredCell.screened)} คน)</span>
            {hoveredCell.rank && (
              <PillBadge variant="signal">อันดับที่ {hoveredCell.rank} ในเขตนี้</PillBadge>
            )}
          </div>
        ) : (
          <div className="text-[#476788]">
            💡 ชี้เมาส์เหนือช่องเพื่อดูข้อมูลคัดกรอง หรือคลิกที่ช่องเพื่อกรองข้อมูลเฉพาะเขตและประเด็นนั้น
          </div>
        )}
      </div>
    </div>
  );
};
