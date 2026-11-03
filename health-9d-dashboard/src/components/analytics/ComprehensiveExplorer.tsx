'use client';

import React, { useState, useMemo } from 'react';
import { comprehensiveDataset, ComprehensiveItem } from '@/data/agingData';
import { Search, Download, Filter, Database, Check, FileSpreadsheet, ExternalLink } from 'lucide-react';

const MODULAR_CSV_FILES = [
  { name: '1. ประชากรศาสตร์ (มิเตอร์ประเทศไทย)', file: '1_demographics_population_meter_2565_2569.csv', size: '2.8 KB' },
  { name: '2. คัดกรอง 9 ด้าน (HDC vs DMS)', file: '2_health_screening_9domains_hdc_dms_2565_2569.csv', size: '3.5 KB' },
  { name: '3. กิจวัตร ADL & Syndromes', file: '2_1_functional_ability_adl_and_screening.csv', size: '3.7 KB' },
  { name: '4. ความชุกโรคเรื้อรัง NCDs', file: '3_chronic_diseases_ncd_prevalence.csv', size: '4.3 KB' },
  { name: '5. อัตราป่วย OPD & IPD', file: '4_top10_morbidity_opd_ipd_2565_2569.csv', size: '9.4 KB' },
  { name: '6. สาเหตุการตาย Mortality', file: '5_top10_mortality_causes_2565_2569.csv', size: '6.0 KB' },
  { name: '7. ภาระโรค DALYs (BOD)', file: '6_burden_of_disease_dalys_bod.csv', size: '4.6 KB' },
  { name: 'ชุดข้อมูลรวม Master (209 รายการ)', file: 'elderly_health_5year_comprehensive_dataset_2565_2569.csv', size: '123 KB' }
];

export const ComprehensiveExplorer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 15;

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    comprehensiveDataset.forEach(d => {
      if (d.Category) set.add(d.Category);
    });
    return Array.from(set);
  }, []);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return comprehensiveDataset.filter(item => {
      if (selectedCategory !== 'all' && item.Category !== selectedCategory) {
        return false;
      }
      if (selectedYear !== 'all' && String(item.Year_TH) !== selectedYear) {
        return false;
      }
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchCode = item.Indicator_Code?.toLowerCase().includes(query);
        const matchNameTH = item.Indicator_Name_TH?.toLowerCase().includes(query);
        const matchNameEN = item.Indicator_Name_EN?.toLowerCase().includes(query);
        const matchRemarks = item.Remarks?.toLowerCase().includes(query);
        if (!matchCode && !matchNameTH && !matchNameEN && !matchRemarks) {
          return false;
        }
      }
      return true;
    });
  }, [searchTerm, selectedCategory, selectedYear]);

  // Paginated items
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, page]);

  // Export Filtered CSV directly
  const handleExportCSV = () => {
    const headers = [
      'Category',
      'Indicator_Code',
      'Indicator_Name_TH',
      'Indicator_Name_EN',
      'Sub_Dimension',
      'Year_TH',
      'Value_Numeric',
      'Unit',
      'Metric_Type',
      'Data_Source',
      'Remarks'
    ];

    const rows = filteredData.map(item => [
      `"${item.Category || ''}"`,
      `"${item.Indicator_Code || ''}"`,
      `"${item.Indicator_Name_TH || ''}"`,
      `"${item.Indicator_Name_EN || ''}"`,
      `"${item.Sub_Dimension || ''}"`,
      item.Year_TH,
      item.Value_Numeric !== null ? item.Value_Numeric : '',
      `"${item.Unit || ''}"`,
      `"${item.Metric_Type || ''}"`,
      `"${item.Data_Source || ''}"`,
      `"${item.Remarks || ''}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `comprehensive_aging_dataset_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <div className="bg-white rounded-2xl p-6 border border-[#d4e0ed] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#006bff] uppercase tracking-wider mb-1">
            <Database className="w-4 h-4" />
            <span>Comprehensive 5-Year Master Dataset</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#0b3558]">
            สำรวจชุดข้อมูลสรุปสถานการณ์สุขภาพและประชากร 209 รายการ (2565–2569)
          </h2>
          <p className="text-xs text-[#476788] mt-1">
            ค้นหา กรอง และดาวน์โหลดข้อมูลมาตรฐานจากเอกสารสังเคราะห์ระบาดวิทยาฉบับสมบูรณ์ (UTF-8 BOM พร้อมใช้กับ Excel)
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#006bff] hover:bg-[#0056cc] text-white font-semibold text-xs sm:text-sm shadow-md transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>ส่งออกชุดที่กรอง ({filteredData.length} รายการ)</span>
        </button>
      </div>

      {/* 2. Direct CSV Downloads Shelf (8 Files) */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-2xl p-5 border border-[#d4e0ed] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-[#006bff]" />
            <h3 className="text-sm font-bold text-[#0b3558]">
              ดาวน์โหลดไฟล์ข้อมูลดิบ 8 ชุด (.csv เข้ารหัส UTF-8 BOM สำหรับ Excel ภาษาไทย)
            </h3>
          </div>
          <span className="text-[11px] text-[#476788]">คลิกเพื่อดาวน์โหลดทันที</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {MODULAR_CSV_FILES.map((f, idx) => (
            <a
              key={idx}
              href={`/${f.file}`}
              download
              className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#d4e0ed] hover:border-[#006bff] hover:shadow-sm transition-all group"
            >
              <div className="min-w-0 pr-2">
                <div className="text-xs font-bold text-[#0b3558] group-hover:text-[#006bff] truncate">
                  {f.name}
                </div>
                <div className="text-[10px] text-[#476788] truncate">{f.file}</div>
              </div>
              <span className="shrink-0 p-1.5 rounded-lg bg-blue-50 text-[#006bff] group-hover:bg-[#006bff] group-hover:text-white transition-colors">
                <Download className="w-3.5 h-3.5" />
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* 3. Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#d4e0ed] shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-[#476788]">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={selectedCategory}
              onChange={e => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
              className="bg-[#f8f9fb] border border-[#d4e0ed] rounded-xl px-3 py-2 text-xs font-semibold text-[#0b3558] focus:outline-none focus:ring-2 focus:ring-[#006bff]"
            >
              <option value="all">ทุกหมวดหมู่ ({categories.length} หมวด)</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Year Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-[#476788]">
            <select
              value={selectedYear}
              onChange={e => {
                setSelectedYear(e.target.value);
                setPage(1);
              }}
              className="bg-[#f8f9fb] border border-[#d4e0ed] rounded-xl px-3 py-2 text-xs font-semibold text-[#0b3558] focus:outline-none focus:ring-2 focus:ring-[#006bff]"
            >
              <option value="all">ทุกปี (2565–2569)</option>
              <option value="2565">ปี 2565</option>
              <option value="2566">ปี 2566</option>
              <option value="2567">ปี 2567</option>
              <option value="2568">ปี 2568</option>
              <option value="2569">ปี 2569</option>
            </select>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#476788] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="ค้นหาตัวชี้วัด, รหัส, หมายเหตุ..."
            className="w-full bg-[#f8f9fb] border border-[#d4e0ed] rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-[#0b3558] placeholder-[#476788] focus:outline-none focus:ring-2 focus:ring-[#006bff]"
          />
        </div>
      </div>

      {/* 4. Table */}
      <div className="bg-white rounded-2xl border border-[#d4e0ed] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b3558] text-white font-bold">
              <tr>
                <th className="py-3 px-4">หมวดหมู่</th>
                <th className="py-3 px-4">รหัส</th>
                <th className="py-3 px-4">ชื่อตัวชี้วัด</th>
                <th className="py-3 px-4 text-center">ปี พ.ศ.</th>
                <th className="py-3 px-4 text-right">ค่าข้อมูล</th>
                <th className="py-3 px-4">หน่วย</th>
                <th className="py-3 px-4">ประเภทตัวชี้วัด</th>
                <th className="py-3 px-4">แหล่งข้อมูล</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d4e0ed]">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#476788]">
                    ไม่พบข้อมูลที่ตรงกับเงื่อนไขการค้นหา
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#f0f3f8] transition">
                    <td className="py-2.5 px-4 font-semibold text-[#006bff]">
                      {row.Category}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-500">
                      {row.Indicator_Code}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-bold text-[#0b3558]">
                        {row.Indicator_Name_TH}
                      </div>
                      <div className="text-[11px] text-[#476788] italic">
                        {row.Indicator_Name_EN}
                      </div>
                      {row.Remarks && (
                        <div className="text-[10px] text-amber-700 mt-0.5">
                          📌 {row.Remarks}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-center font-mono font-bold text-[#0b3558]">
                      {row.Year_TH}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-emerald-700">
                      {row.Value_Numeric !== '' && row.Value_Numeric !== null
                        ? Number(row.Value_Numeric).toLocaleString()
                        : '-'}
                    </td>
                    <td className="py-2.5 px-4 text-[#476788]">{row.Unit}</td>
                    <td className="py-2.5 px-4 text-slate-600">{row.Metric_Type}</td>
                    <td className="py-2.5 px-4 text-[11px] text-[#476788] max-w-xs truncate" title={row.Data_Source}>
                      {row.Data_Source}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-6 py-3 border-t border-[#d4e0ed] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#476788]">
          <div>
            แสดง {filteredData.length > 0 ? (page - 1) * pageSize + 1 : 0} ถึง{' '}
            {Math.min(page * pageSize, filteredData.length)} จากทั้งหมด {filteredData.length} รายการ
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-[#d4e0ed] bg-white font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ก่อนหน้า
            </button>
            <span className="px-3 py-1.5 font-bold text-[#0b3558]">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-[#d4e0ed] bg-white font-semibold hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ถัดไป
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};