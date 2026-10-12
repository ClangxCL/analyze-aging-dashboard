'use client';

import React, { useState, useMemo } from 'react';
import { Table2, Download, Search, ArrowUpDown, ChevronLeft, ChevronRight, Check } from 'lucide-react';
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
        // Dimension keys
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

  // Export to CSV with UTF-8 BOM so Excel opens Thai cleanly
  const exportToCSV = () => {
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

    const rows = sortedData.map((p, idx) => {
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

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `elderly_health_76_provinces_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3000);
  };

  return (
    <div id="data-table" className="bg-white rounded-[24px] p-6 border border-[#d4e0ed] card-elevation transition-all">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#f0f3f8]">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-[#e6f0ff] text-[#006bff] rounded-xl">
            <Table2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#0b3558]">
              ตารางข้อมูลคัดกรองและร้อยละความเสี่ยง 76 จังหวัด
            </h3>
            <p className="text-xs text-[#476788] mt-0.5">
              แสดงผลข้อมูลละเอียดรายจังหวัดและประเด็นสุขภาพ 9 ด้าน • คลิกที่หัวคอลัมน์เพื่อจัดเรียง
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
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
              className="bg-[#f0f3f8] border border-[#d4e0ed] text-xs text-[#0b3558] rounded-[8px] pl-9 pr-3 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-[#006bff]/20 focus:border-[#006bff] transition-all"
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
                ส่งออกข้อมูล CSV
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Table */}
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
            {paginatedData.map((p, idx) => (
              <tr key={p.id} className="hover:bg-[#f8f9fb] transition-colors">
                <td className="p-3 text-[#476788]">{p.id}</td>
                <td className="p-3 font-medium text-[#476788] whitespace-nowrap">{p.zone}</td>
                <td className="p-3 font-bold text-[#0b3558] sticky left-0 bg-white whitespace-nowrap z-10">
                  {p.province}
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
            <option value={15}>15 แถวต่อหน้า</option>
            <option value={30}>30 แถวต่อหน้า</option>
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
