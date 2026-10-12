'use client';

import React, { useState, useMemo } from 'react';
import { Table2, Download, Search, ArrowUpDown, ChevronLeft, ChevronRight, Check, LayoutGrid, ListFilter } from 'lucide-react';
import { DimensionKey, ProvinceData } from '@/types/health';
import { DIMENSIONS, formatNumber, formatPercent } from '@/lib/analytics';
import { Button } from '../ui/Button';
import { PillBadge } from '../ui/PillBadge';

interface DataTableProps {
  provinces: ProvinceData[];
}

type SortField =
  | 'id'
  | 'province'
  | 'zone'
  | 'totalScreened'
  | 'screened9d'
  | 'pctScreened9d'
  | 'top1RiskPct'
  | DimensionKey;

export const DataTable: React.FC<DataTableProps> = ({ provinces }) => {
  const [viewMode, setViewMode] = useState<'threeRows' | 'nineDimensions'>('threeRows');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('id');
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Filter provinces by search query
  const filteredData = useMemo(() => {
    return provinces.filter(p => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        p.province.toLowerCase().includes(q) ||
        p.zone.toLowerCase().includes(q) ||
        p.top1Issue.toLowerCase().includes(q)
      );
    });
  }, [provinces, searchQuery]);

  // Sort data
  const sortedData = useMemo(() => {
    const list = [...filteredData];
    list.sort((a, b) => {
      let aVal: any = 0;
      let bVal: any = 0;

      if (sortField === 'province' || sortField === 'zone') {
        aVal = a[sortField];
        bVal = b[sortField];
        return sortAsc ? aVal.localeCompare(bVal, 'th') : bVal.localeCompare(aVal, 'th');
      }

      if (sortField === 'id' || sortField === 'totalScreened' || sortField === 'screened9d' || sortField === 'pctScreened9d' || sortField === 'top1RiskPct') {
        aVal = a[sortField];
        bVal = b[sortField];
      } else {
        aVal = a.dimensions[sortField]?.riskPct || 0;
        bVal = b.dimensions[sortField]?.riskPct || 0;
      }

      return sortAsc ? aVal - bVal : bVal - aVal;
    });
    return list;
  }, [filteredData, sortField, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending for numbers
    }
    setCurrentPage(1);
  };

  // Export to CSV with UTF-8 BOM
  const exportToCSV = () => {
    let csvContent = '\uFEFF';

    if (viewMode === 'threeRows') {
      const headers = ['เขตบริการสุขภาพ', 'จังหวัด', 'รายการข้อมูล', 'Top 1', 'Top 2', 'Top 3', 'Top 4', 'Top 5'];
      const rows: string[] = [];

      sortedData.forEach(p => {
        const breakdown = p.threeRowBreakdown && p.threeRowBreakdown.length === 3
          ? p.threeRowBreakdown
          : [
              {
                itemType: 'ประเด็นสุขภาพ',
                top1: p.rankedDimensions[0]?.name || '',
                top2: p.rankedDimensions[1]?.name || '',
                top3: p.rankedDimensions[2]?.name || '',
                top4: p.rankedDimensions[3]?.name || '',
                top5: p.rankedDimensions[4]?.name || ''
              },
              {
                itemType: 'จำนวนคัดกรอง (คน)',
                top1: formatNumber(p.rankedDimensions[0]?.screened),
                top2: formatNumber(p.rankedDimensions[1]?.screened),
                top3: formatNumber(p.rankedDimensions[2]?.screened),
                top4: formatNumber(p.rankedDimensions[3]?.screened),
                top5: formatNumber(p.rankedDimensions[4]?.screened)
              },
              {
                itemType: 'จำนวนเสี่ยง (ร้อยละ)',
                top1: `${formatNumber(p.rankedDimensions[0]?.risk)} (${formatPercent(p.rankedDimensions[0]?.riskPct)})`,
                top2: `${formatNumber(p.rankedDimensions[1]?.risk)} (${formatPercent(p.rankedDimensions[1]?.riskPct)})`,
                top3: `${formatNumber(p.rankedDimensions[2]?.risk)} (${formatPercent(p.rankedDimensions[2]?.riskPct)})`,
                top4: `${formatNumber(p.rankedDimensions[3]?.risk)} (${formatPercent(p.rankedDimensions[3]?.riskPct)})`,
                top5: `${formatNumber(p.rankedDimensions[4]?.risk)} (${formatPercent(p.rankedDimensions[4]?.riskPct)})`
              }
            ];

        breakdown.forEach((r, idx) => {
          const zoneCell = idx === 0 ? `"${p.zone}"` : '""';
          const provCell = idx === 0 ? `"${p.province}"` : '""';
          rows.push([
            zoneCell,
            provCell,
            `"${r.itemType}"`,
            `"${r.top1}"`,
            `"${r.top2}"`,
            `"${r.top3}"`,
            `"${r.top4}"`,
            `"${r.top5}"`
          ].join(','));
        });
      });

      csvContent += [headers.join(','), ...rows].join('\r\n');
    } else {
      const headers = [
        'ลำดับ',
        'เขตสุขภาพ',
        'จังหวัด',
        'คัดกรองรวม (คน)',
        'ครบ 9 ด้าน (คน)',
        'ร้อยละ 9 ด้าน (%)',
        'ประเด็นเสี่ยงสูงสุด',
        'ร้อยละเสี่ยงสูงสุด (%)',
        ...DIMENSIONS.map(d => `${d.name} (%)`)
      ];

      const rows = sortedData.map(p => {
        return [
          p.id,
          `"${p.zone}"`,
          `"${p.province}"`,
          p.totalScreened,
          p.screened9d,
          p.pctScreened9d,
          `"${p.top1Issue}"`,
          p.top1RiskPct,
          ...DIMENSIONS.map(d => p.dimensions[d.key]?.riskPct || 0)
        ].join(',');
      });

      csvContent += [headers.join(','), ...rows].join('\r\n');
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `elderly_health_76_provinces_${viewMode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  return (
    <div id="data-table" className="bg-white rounded-[24px] p-6 border border-[#d4e0ed] card-elevation transition-all">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#f0f3f8]">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[#e6f0ff] text-[#006bff] rounded-xl">
              <Table2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-[#0b3558]">
                  ตารางข้อมูลคัดกรองและร้อยละความเสี่ยง 76 จังหวัด
                </h3>
                <PillBadge variant="signal">ชีท: ตารางแยก 3 บรรทัดต่อจังหวัด</PillBadge>
              </div>
              <p className="text-xs text-[#476788] mt-0.5">
                ที่มาข้อมูล: ระบบคลังข้อมูลด้านการแพทย์และสุขภาพ (HDC) • สถาบันเวชศาสตร์สมเด็จพระสังฆราชญาณสังวรเพื่อผู้สูงอายุ กรมการแพทย์
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-[#f0f3f8] p-1 rounded-[10px] border border-[#d4e0ed]">
            <button
              onClick={() => setViewMode('threeRows')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[8px] transition-all ${
                viewMode === 'threeRows'
                  ? 'bg-white text-[#006bff] shadow-sm'
                  : 'text-[#476788] hover:text-[#0b3558]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              แยก 3 บรรทัดต่อจังหวัด (Top 1-5)
            </button>
            <button
              onClick={() => setViewMode('nineDimensions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-[8px] transition-all ${
                viewMode === 'nineDimensions'
                  ? 'bg-white text-[#006bff] shadow-sm'
                  : 'text-[#476788] hover:text-[#0b3558]'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              ร้อยละครบ 9 มิติ (เต็ม)
            </button>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#476788] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาชื่อจังหวัด หรือเขตสุขภาพ..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-[#f0f3f8] border border-[#d4e0ed] text-xs text-[#0b3558] rounded-[8px] pl-9 pr-3 py-2 w-60 focus:outline-none focus:ring-2 focus:ring-[#006bff]/20 focus:border-[#006bff] transition-all"
            />
          </div>

          {/* Export Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={exportToCSV}
            className="text-xs"
          >
            {copiedNotification ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#1b7a42]" />
                ดาวน์โหลดแล้ว
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-[#006bff]" />
                ส่งออก CSV
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Table Content */}
      {viewMode === 'threeRows' ? (
        /* Sheet 2: ตารางแยก 3 บรรทัดต่อจังหวัด */
        <div className="overflow-x-auto border border-[#d4e0ed] rounded-[16px]">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fb] text-[#0b3558] font-bold border-b border-[#d4e0ed]">
                <th
                  onClick={() => handleSort('zone')}
                  className="p-3 cursor-pointer hover:bg-[#e6f0ff] whitespace-nowrap border-r border-[#d4e0ed]"
                >
                  <div className="flex items-center gap-1">
                    เขตบริการสุขภาพ
                    <ArrowUpDown className="w-3 h-3 text-[#476788]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('province')}
                  className="p-3 cursor-pointer hover:bg-[#e6f0ff] whitespace-nowrap sticky left-0 bg-[#f8f9fb] z-10 border-r border-[#d4e0ed]"
                >
                  <div className="flex items-center gap-1">
                    จังหวัด
                    <ArrowUpDown className="w-3 h-3 text-[#476788]" />
                  </div>
                </th>
                <th className="p-3 whitespace-nowrap border-r border-[#d4e0ed] bg-[#f0f3f8] text-[#0b3558]">
                  รายการข้อมูล
                </th>
                <th className="p-3 text-center whitespace-nowrap bg-[#fff8eb] text-[#b86200] border-r border-[#d4e0ed]">
                  Top 1 (อันดับ 1)
                </th>
                <th className="p-3 text-center whitespace-nowrap bg-[#eef5fc] text-[#0b3558] border-r border-[#d4e0ed]">
                  Top 2 (อันดับ 2)
                </th>
                <th className="p-3 text-center whitespace-nowrap bg-[#f0f3f8] text-[#0b3558] border-r border-[#d4e0ed]">
                  Top 3 (อันดับ 3)
                </th>
                <th className="p-3 text-center whitespace-nowrap bg-[#f0f3f8] text-[#0b3558] border-r border-[#d4e0ed]">
                  Top 4 (อันดับ 4)
                </th>
                <th className="p-3 text-center whitespace-nowrap bg-[#f0f3f8] text-[#0b3558]">
                  Top 5 (อันดับ 5)
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((p, pIdx) => {
                const breakdown = p.threeRowBreakdown && p.threeRowBreakdown.length === 3
                  ? p.threeRowBreakdown
                  : [
                      {
                        itemType: 'ประเด็นสุขภาพ',
                        top1: p.rankedDimensions[0]?.name || '',
                        top2: p.rankedDimensions[1]?.name || '',
                        top3: p.rankedDimensions[2]?.name || '',
                        top4: p.rankedDimensions[3]?.name || '',
                        top5: p.rankedDimensions[4]?.name || ''
                      },
                      {
                        itemType: 'จำนวนคัดกรอง (คน)',
                        top1: formatNumber(p.rankedDimensions[0]?.screened),
                        top2: formatNumber(p.rankedDimensions[1]?.screened),
                        top3: formatNumber(p.rankedDimensions[2]?.screened),
                        top4: formatNumber(p.rankedDimensions[3]?.screened),
                        top5: formatNumber(p.rankedDimensions[4]?.screened)
                      },
                      {
                        itemType: 'จำนวนเสี่ยง (ร้อยละ)',
                        top1: `${formatNumber(p.rankedDimensions[0]?.risk)} (${formatPercent(p.rankedDimensions[0]?.riskPct)})`,
                        top2: `${formatNumber(p.rankedDimensions[1]?.risk)} (${formatPercent(p.rankedDimensions[1]?.riskPct)})`,
                        top3: `${formatNumber(p.rankedDimensions[2]?.risk)} (${formatPercent(p.rankedDimensions[2]?.riskPct)})`,
                        top4: `${formatNumber(p.rankedDimensions[3]?.risk)} (${formatPercent(p.rankedDimensions[3]?.riskPct)})`,
                        top5: `${formatNumber(p.rankedDimensions[4]?.risk)} (${formatPercent(p.rankedDimensions[4]?.riskPct)})`
                      }
                    ];

                return (
                  <React.Fragment key={p.id}>
                    {/* Row 1: ประเด็นสุขภาพ */}
                    <tr className="border-t-2 border-[#d4e0ed] hover:bg-[#f8f9fb] transition-colors">
                      <td
                        rowSpan={3}
                        className="p-3 font-semibold text-[#476788] border-r border-[#d4e0ed] align-middle bg-[#ffffff] whitespace-nowrap"
                      >
                        {p.zone}
                      </td>
                      <td
                        rowSpan={3}
                        className="p-3 font-bold text-[#0b3558] border-r border-[#d4e0ed] align-middle sticky left-0 bg-[#ffffff] z-10 whitespace-nowrap text-sm"
                      >
                        <div>จ.{p.province}</div>
                        <div className="text-[10px] text-[#476788] font-normal">
                          คัดกรองรวม: {formatNumber(p.totalScreened)} คน
                        </div>
                      </td>
                      <td className="p-2.5 font-bold text-[#0b3558] bg-[#f0f3f8] border-r border-[#d4e0ed] whitespace-nowrap">
                        {breakdown[0].itemType}
                      </td>
                      <td className="p-2.5 text-center font-bold text-[#b86200] bg-[#fffdf5] border-r border-[#d4e0ed]">
                        <span className="px-2 py-0.5 rounded-md bg-[#fff0cc] text-[#b86200]">
                          {breakdown[0].top1}
                        </span>
                      </td>
                      <td className="p-2.5 text-center font-semibold text-[#0b3558] border-r border-[#d4e0ed]">
                        {breakdown[0].top2}
                      </td>
                      <td className="p-2.5 text-center font-semibold text-[#0b3558] border-r border-[#d4e0ed]">
                        {breakdown[0].top3}
                      </td>
                      <td className="p-2.5 text-center font-semibold text-[#0b3558] border-r border-[#d4e0ed]">
                        {breakdown[0].top4}
                      </td>
                      <td className="p-2.5 text-center font-semibold text-[#0b3558]">
                        {breakdown[0].top5}
                      </td>
                    </tr>

                    {/* Row 2: จำนวนคัดกรอง (คน) */}
                    <tr className="hover:bg-[#f8f9fb] transition-colors border-t border-[#f0f3f8]">
                      <td className="p-2.5 font-medium text-[#476788] bg-[#f0f3f8] border-r border-[#d4e0ed] whitespace-nowrap">
                        {breakdown[1].itemType}
                      </td>
                      <td className="p-2.5 text-center tabular-nums text-[#476788] bg-[#fffdf5] border-r border-[#d4e0ed]">
                        {breakdown[1].top1}
                      </td>
                      <td className="p-2.5 text-center tabular-nums text-[#476788] border-r border-[#d4e0ed]">
                        {breakdown[1].top2}
                      </td>
                      <td className="p-2.5 text-center tabular-nums text-[#476788] border-r border-[#d4e0ed]">
                        {breakdown[1].top3}
                      </td>
                      <td className="p-2.5 text-center tabular-nums text-[#476788] border-r border-[#d4e0ed]">
                        {breakdown[1].top4}
                      </td>
                      <td className="p-2.5 text-center tabular-nums text-[#476788]">
                        {breakdown[1].top5}
                      </td>
                    </tr>

                    {/* Row 3: จำนวนเสี่ยง (ร้อยละ) */}
                    <tr className="hover:bg-[#f8f9fb] transition-colors border-t border-[#f0f3f8] pb-2">
                      <td className="p-2.5 font-bold text-[#b86200] bg-[#fff8eb] border-r border-[#d4e0ed] whitespace-nowrap">
                        {breakdown[2].itemType}
                      </td>
                      <td className="p-2.5 text-center font-bold text-[#b86200] bg-[#fff8eb] border-r border-[#d4e0ed]">
                        {breakdown[2].top1}
                      </td>
                      <td className="p-2.5 text-center font-semibold text-[#006bff] border-r border-[#d4e0ed]">
                        {breakdown[2].top2}
                      </td>
                      <td className="p-2.5 text-center font-semibold text-[#006bff] border-r border-[#d4e0ed]">
                        {breakdown[2].top3}
                      </td>
                      <td className="p-2.5 text-center font-semibold text-[#476788] border-r border-[#d4e0ed]">
                        {breakdown[2].top4}
                      </td>
                      <td className="p-2.5 text-center font-semibold text-[#476788]">
                        {breakdown[2].top5}
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Sheet 4: ตารางร้อยละ 9 มิติ */
        <div className="overflow-x-auto border border-[#d4e0ed] rounded-[16px]">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-[#f8f9fb] text-[#0b3558] font-bold border-b border-[#d4e0ed]">
                <th
                  onClick={() => handleSort('id')}
                  className="p-3 cursor-pointer hover:bg-[#e6f0ff] whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    ลำดับ
                    <ArrowUpDown className="w-3 h-3 text-[#476788]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('zone')}
                  className="p-3 cursor-pointer hover:bg-[#e6f0ff] whitespace-nowrap"
                >
                  <div className="flex items-center gap-1">
                    เขตสุขภาพ
                    <ArrowUpDown className="w-3 h-3 text-[#476788]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('province')}
                  className="p-3 cursor-pointer hover:bg-[#e6f0ff] whitespace-nowrap sticky left-0 bg-[#f8f9fb] z-10"
                >
                  <div className="flex items-center gap-1">
                    จังหวัด
                    <ArrowUpDown className="w-3 h-3 text-[#476788]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('totalScreened')}
                  className="p-3 text-right cursor-pointer hover:bg-[#e6f0ff] whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1">
                    คัดกรองรวม
                    <ArrowUpDown className="w-3 h-3 text-[#476788]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('pctScreened9d')}
                  className="p-3 text-right cursor-pointer hover:bg-[#e6f0ff] whitespace-nowrap"
                >
                  <div className="flex items-center justify-end gap-1">
                    ครบ 9 ด้าน (%)
                    <ArrowUpDown className="w-3 h-3 text-[#476788]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('top1RiskPct')}
                  className="p-3 text-left cursor-pointer hover:bg-[#e6f0ff] whitespace-nowrap bg-[#fff8eb]"
                >
                  <div className="flex items-center gap-1 text-[#b86200]">
                    Top 1 เสี่ยงสูงสุด
                    <ArrowUpDown className="w-3 h-3 text-[#b86200]" />
                  </div>
                </th>

                {/* 9 Dimensions columns */}
                {DIMENSIONS.map(d => (
                  <th
                    key={d.key}
                    onClick={() => handleSort(d.key)}
                    className="p-2.5 text-right cursor-pointer hover:bg-[#e6f0ff] whitespace-nowrap"
                    title={d.name}
                  >
                    <div className="flex items-center justify-end gap-1">
                      {d.shortName} (%)
                      <ArrowUpDown className="w-2.5 h-2.5 text-[#476788]" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f0f3f8]">
              {paginatedData.map(p => (
                <tr key={p.id} className="hover:bg-[#f8f9fb] transition-colors">
                  <td className="p-3 text-[#476788]">{p.id}</td>
                  <td className="p-3 font-medium text-[#476788] whitespace-nowrap">{p.zone}</td>
                  <td className="p-3 font-bold text-[#0b3558] sticky left-0 bg-white whitespace-nowrap z-10">
                    จ.{p.province}
                  </td>
                  <td className="p-3 text-right tabular-nums text-[#0b3558]">
                    {formatNumber(p.totalScreened)}
                  </td>
                  <td className="p-3 text-right tabular-nums">
                    <span className={`font-semibold ${p.pctScreened9d >= 80 ? 'text-[#1b7a42]' : 'text-[#476788]'}`}>
                      {formatPercent(p.pctScreened9d)}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap bg-[#fffdf8]">
                    <span className="font-semibold text-[#0b3558]">{p.top1Issue}</span>
                    <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fff0cc] text-[#b86200]">
                      {formatPercent(p.top1RiskPct)}
                    </span>
                  </td>

                  {/* 9 Dimensions values */}
                  {DIMENSIONS.map(d => {
                    const riskPct = p.dimensions[d.key]?.riskPct || 0;
                    return (
                      <td
                        key={d.key}
                        className="p-2.5 text-right tabular-nums whitespace-nowrap font-medium"
                      >
                        <span
                          className={
                            riskPct >= 15
                              ? 'text-[#004eba] font-bold'
                              : riskPct >= 10
                              ? 'text-[#006bff] font-semibold'
                              : 'text-[#476788]'
                          }
                        >
                          {formatPercent(riskPct)}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-3 border-t border-[#f0f3f8] text-xs text-[#476788]">
        <div>
          แสดง {(currentPage - 1) * pageSize + 1} ถึง{' '}
          {Math.min(currentPage * pageSize, sortedData.length)} จากทั้งหมด{' '}
          {sortedData.length} จังหวัด
        </div>

        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-[#f0f3f8] border border-[#d4e0ed] text-[#0b3558] rounded-[6px] px-2 py-1 text-xs"
          >
            <option value={10}>10 จังหวัดต่อหน้า</option>
            <option value={15}>15 จังหวัดต่อหน้า</option>
            <option value={25}>25 จังหวัดต่อหน้า</option>
            <option value={76}>ทั้งหมด (76 จังหวัด)</option>
          </select>

          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-[#d4e0ed] hover:bg-[#f0f3f8] disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-4 h-4 text-[#0b3558]" />
          </button>
          <span className="font-semibold text-[#0b3558]">
            หน้า {currentPage} จาก {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-[#d4e0ed] hover:bg-[#f0f3f8] disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronRight className="w-4 h-4 text-[#0b3558]" />
          </button>
        </div>
      </div>
    </div>
  );
};
