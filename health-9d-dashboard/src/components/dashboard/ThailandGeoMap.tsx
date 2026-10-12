'use client';

import React, { useState, useMemo } from 'react';
import { MapPin, Info, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { DimensionKey, FilterState, ProvinceData } from '@/types/health';
import { DIMENSIONS, formatNumber, formatPercent, getHeatMapColor } from '@/lib/analytics';
import { PillBadge } from '../ui/PillBadge';
import geoData from '@/data/thailand_provinces.json';

interface ThailandGeoMapProps {
  provinces: ProvinceData[];
  filter: FilterState;
  onSelectProvince: (provName: string) => void;
  onSelectZone: (zoneName: string) => void;
}

export const ThailandGeoMap: React.FC<ThailandGeoMapProps> = ({
  provinces,
  filter,
  onSelectProvince,
  onSelectZone
}) => {
  const [hoveredProvince, setHoveredProvince] = useState<{
    name: string;
    zone: string;
    riskPct: number;
    issueName: string;
    screened: number;
    risk: number;
    x: number;
    y: number;
  } | null>(null);

  // Quick lookup map for province data
  const provMap = useMemo(() => {
    const map = new Map<string, ProvinceData>();
    provinces.forEach(p => map.set(p.province, p));
    return map;
  }, [provinces]);

  // Project longitude/latitude to SVG coordinates
  // Thailand bounds: Lon 97.2 to 105.8, Lat 5.5 to 20.6
  // Aspect ratio calibrated for Thailand
  const svgWidth = 550;
  const svgHeight = 850;
  const minLon = 97.2;
  const maxLon = 105.85;
  const minLat = 5.5;
  const maxLat = 20.6;
  const pad = 24;

  const project = (lon: number, lat: number): [number, number] => {
    const w = svgWidth - pad * 2;
    const h = svgHeight - pad * 2;
    // Standard projection for Thailand
    const cosLat = 0.974; // cos(13 deg)
    const x = pad + ((lon - minLon) / (maxLon - minLon)) * w;
    const y = svgHeight - pad - ((lat - minLat) / (maxLat - minLat)) * h;
    return [x, y];
  };

  // Convert GeoJSON geometries into SVG paths
  const provincePaths = useMemo(() => {
    return geoData.features.map(f => {
      const thName = f.properties.name_th || f.properties.name;
      const enName = f.properties.name_en || f.properties.name;
      const geom = f.geometry;

      let d = '';
      if (geom.type === 'Polygon') {
        const rings = geom.coordinates as number[][][];
        d = rings
          .map(ring => {
            return ring
              .map(([lon, lat], i) => {
                const [px, py] = project(lon, lat);
                return `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`;
              })
              .join(' ') + 'Z';
          })
          .join(' ');
      } else if (geom.type === 'MultiPolygon') {
        const multi = geom.coordinates as number[][][][];
        d = multi
          .map(poly => {
            return poly
              .map(ring => {
                return ring
                  .map(([lon, lat], i) => {
                    const [px, py] = project(lon, lat);
                    return `${i === 0 ? 'M' : 'L'}${px.toFixed(1)},${py.toFixed(1)}`;
                  })
                  .join(' ') + 'Z';
              })
              .join(' ');
          })
          .join(' ');
      }

      return {
        id: enName,
        thName,
        enName,
        d
      };
    });
  }, []);

  // Determine current active dimension label
  const activeDimObj = DIMENSIONS.find(d => d.key === filter.dimension);
  const activeDimName = activeDimObj ? activeDimObj.name : 'ความเสี่ยงสูงสุด (Top 1)';

  return (
    <div className="bg-white rounded-[24px] p-6 border border-[#d4e0ed] card-elevation transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#f0f3f8]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#e6f0ff] text-[#006bff] rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#0b3558]">
                แผนที่ภูมิศาสตร์ความเสี่ยงสุขภาพผู้สูงอายุ (Geographic Map)
              </h3>
              <p className="text-xs text-[#476788] mt-0.5">
                ระดับความเสี่ยง: <span className="font-semibold text-[#006bff]">{activeDimName}</span> • ชี้เป้าความรุนแรงรายจังหวัดทั่วประเทศ
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 text-xs bg-[#f0f3f8] p-2 rounded-xl border border-[#d4e0ed]">
          <span className="text-[#476788] font-medium mr-1">ร้อยละเสี่ยง:</span>
          <div className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#cce0ff]" title="< 7%" />
            <span className="text-[10px] text-[#476788]">&lt;7%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#99c2ff]" title="7 - 10%" />
            <span className="text-[10px] text-[#476788]">7-10%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#4d94ff]" title="10 - 14%" />
            <span className="text-[10px] text-[#476788]">10-14%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#006bff]" title="14 - 18%" />
            <span className="text-[10px] text-[#476788]">14-18%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-sm bg-[#004eba]" title="> 18%" />
            <span className="text-[10px] text-[#476788]">&gt;18%</span>
          </div>
        </div>
      </div>

      <div className="relative flex justify-center items-center bg-[#f8f9fb] rounded-[18px] border border-[#d4e0ed] p-2 overflow-hidden min-h-[580px]">
        {/* Floating Tooltip */}
        {hoveredProvince && (
          <div
            className="absolute z-30 pointer-events-none bg-white/95 backdrop-blur-md rounded-[12px] p-3 shadow-xl border border-[#d4e0ed] text-xs max-w-xs transition-transform"
            style={{
              left: `${Math.min(svgWidth - 180, Math.max(20, hoveredProvince.x))}px`,
              top: `${Math.max(20, hoveredProvince.y - 120)}px`
            }}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-bold text-[#0b3558] text-sm">จ.{hoveredProvince.name}</span>
              <PillBadge variant="pebble">{hoveredProvince.zone}</PillBadge>
            </div>
            <div className="text-[11px] text-[#476788] mb-1">
              {hoveredProvince.issueName}:{' '}
              <span className="font-bold text-[#006bff] text-sm">
                {formatPercent(hoveredProvince.riskPct)}
              </span>
            </div>
            <div className="flex justify-between gap-3 text-[11px] text-[#476788] pt-1 border-t border-[#f0f3f8]">
              <span>เสี่ยง: {formatNumber(hoveredProvince.risk)} คน</span>
              <span>คัดกรอง: {formatNumber(hoveredProvince.screened)} คน</span>
            </div>
            <div className="mt-1 text-[10px] text-[#006bff] font-medium text-right">
              คลิกเพื่อเลือกจังหวัดนี้ ↗
            </div>
          </div>
        )}

        {/* SVG Thailand Map */}
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full max-w-[480px] h-auto max-h-[640px] drop-shadow-sm select-none"
        >
          {provincePaths.map(p => {
            const data = provMap.get(p.thName);
            const isSelected = filter.province === p.thName;
            const isZoneMatch = filter.zone === 'all' || (data && data.zone === filter.zone);

            // Compute risk value based on filter
            let riskPct = 0;
            let issueName = '';
            let screened = 0;
            let risk = 0;

            if (data) {
              if (filter.dimension !== 'all') {
                const dimInfo = data.dimensions[filter.dimension];
                riskPct = dimInfo ? dimInfo.riskPct : 0;
                issueName = dimInfo ? dimInfo.name : '';
                screened = dimInfo ? dimInfo.screened : 0;
                risk = dimInfo ? dimInfo.risk : 0;
              } else {
                riskPct = data.top1RiskPct;
                issueName = `Top 1: ${data.top1Issue}`;
                screened = data.totalScreened;
                risk = data.dimensions[data.rankedDimensions[0]?.key]?.risk || 0;
              }
            }

            const colorObj = data ? getHeatMapColor(riskPct) : { bg: '#e4ebf5', text: '#0b3558' };
            const fillColor = !isZoneMatch ? '#e2e8f0' : colorObj.bg;
            const opacity = !isZoneMatch ? 0.35 : 1;

            return (
              <path
                key={p.id}
                d={p.d}
                fill={fillColor}
                opacity={opacity}
                stroke={isSelected ? '#0b3558' : '#ffffff'}
                strokeWidth={isSelected ? '2.5' : '0.75'}
                className="transition-colors duration-200 cursor-pointer hover:opacity-85 hover:stroke-[#0b3558] hover:stroke-[1.5]"
                onMouseEnter={e => {
                  if (data) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const parentRect = e.currentTarget.ownerSVGElement?.getBoundingClientRect();
                    const rx = parentRect ? rect.left - parentRect.left + rect.width / 2 : 100;
                    const ry = parentRect ? rect.top - parentRect.top + rect.height / 2 : 100;
                    setHoveredProvince({
                      name: p.thName,
                      zone: data.zone,
                      riskPct,
                      issueName,
                      screened,
                      risk,
                      x: rx,
                      y: ry
                    });
                  }
                }}
                onMouseLeave={() => setHoveredProvince(null)}
                onClick={() => {
                  if (data) {
                    onSelectProvince(p.thName);
                  }
                }}
              />
            );
          })}
        </svg>

        {/* Map Help hint */}
        <div className="absolute bottom-3 left-4 text-[11px] text-[#476788] bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-[#d4e0ed]">
          💡 ชี้เมาส์เพื่อดูสถิติ หรือคลิกเพื่อเจาะลึกเฉพาะจังหวัด
        </div>
      </div>
    </div>
  );
};
