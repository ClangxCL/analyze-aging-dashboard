import os
import re

html_path = 'elderly_analytics_dashboard.html'
with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = '<main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="contentArea">'

shelf = '''<main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="contentArea">

    <!-- 8 MODULAR CSV DATASETS DOWNLOAD SHELF -->
    <div class="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-lg border border-slate-700">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
        <div>
          <div class="flex items-center space-x-2 text-xs font-bold text-sky-400 uppercase tracking-wider mb-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            <span>Raw Data Export • ข้อมูลดิบพร้อมใช้ (.csv เข้ารหัส UTF-8 BOM สำหรับ Excel ภาษาไทย)</span>
          </div>
          <h2 class="text-lg font-bold font-heading text-white">ดาวน์โหลดไฟล์ชุดข้อมูลดิบ 8 ชุด (ระยะ 5 ปี พ.ศ. 2565 – 2569)</h2>
          <p class="text-xs text-slate-300">คลิกที่แต่ละปุ่มเพื่อดาวน์โหลดไฟล์ .csv ไปเปิดในโปรแกรม Microsoft Excel หรือเครื่องมือวิเคราะห์ได้ทันที</p>
        </div>
        <a href="elderly_health_5year_comprehensive_dataset_2565_2569.csv" download class="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-heading shadow-md transition shrink-0 border border-blue-400">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          <span>ดาวน์โหลดชุดรวม Master (209 รายการ)</span>
        </a>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <a href="1_demographics_population_meter_2565_2569.csv" download class="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition group">
          <div class="min-w-0 pr-2">
            <div class="text-xs font-bold text-white group-hover:text-sky-300 truncate">1. ประชากร (มิเตอร์ประเทศไทย)</div>
            <div class="text-[10px] text-slate-400">5 แถว • ม.มหิดล IPSR</div>
          </div>
          <span class="p-1.5 rounded-lg bg-sky-500/20 text-sky-300">↓</span>
        </a>
        <a href="2_health_screening_9domains_hdc_dms_2565_2569.csv" download class="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition group">
          <div class="min-w-0 pr-2">
            <div class="text-xs font-bold text-white group-hover:text-sky-300 truncate">2. คัดกรอง 9 ด้าน (HDC vs DMS)</div>
            <div class="text-[10px] text-slate-400">12 แถว • สธ. & กรมการแพทย์</div>
          </div>
          <span class="p-1.5 rounded-lg bg-sky-500/20 text-sky-300">↓</span>
        </a>
        <a href="2_1_functional_ability_adl_and_screening.csv" download class="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition group">
          <div class="min-w-0 pr-2">
            <div class="text-xs font-bold text-white group-hover:text-sky-300 truncate">3. กิจวัตร ADL & Syndromes</div>
            <div class="text-[10px] text-slate-400">8 แถว • Barthel ADL</div>
          </div>
          <span class="p-1.5 rounded-lg bg-sky-500/20 text-sky-300">↓</span>
        </a>
        <a href="3_chronic_diseases_ncd_prevalence.csv" download class="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition group">
          <div class="min-w-0 pr-2">
            <div class="text-xs font-bold text-white group-hover:text-sky-300 truncate">4. โรคเรื้อรัง NCDs 10 อันดับ</div>
            <div class="text-[10px] text-slate-400">11 แถว • NHES & HDC</div>
          </div>
          <span class="p-1.5 rounded-lg bg-sky-500/20 text-sky-300">↓</span>
        </a>
        <a href="4_top10_morbidity_opd_ipd_2565_2569.csv" download class="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition group">
          <div class="min-w-0 pr-2">
            <div class="text-xs font-bold text-white group-hover:text-sky-300 truncate">5. อัตราป่วย OPD & IPD Top 10</div>
            <div class="text-[10px] text-slate-400">20 แถว • 68-69 เว้นว่าง</div>
          </div>
          <span class="p-1.5 rounded-lg bg-sky-500/20 text-sky-300">↓</span>
        </a>
        <a href="5_top10_mortality_causes_2565_2569.csv" download class="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition group">
          <div class="min-w-0 pr-2">
            <div class="text-xs font-bold text-white group-hover:text-sky-300 truncate">6. อัตราตาย Top 10 สาเหตุ</div>
            <div class="text-[10px] text-slate-400">12 แถว • 68-69 เว้นว่าง</div>
          </div>
          <span class="p-1.5 rounded-lg bg-sky-500/20 text-sky-300">↓</span>
        </a>
        <a href="6_burden_of_disease_dalys_bod.csv" download class="flex items-center justify-between p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition group">
          <div class="min-w-0 pr-2">
            <div class="text-xs font-bold text-white group-hover:text-sky-300 truncate">7. ภาระโรค DALYs (YLL/YLD)</div>
            <div class="text-[10px] text-slate-400">10 แถว • BOD Thailand</div>
          </div>
          <span class="p-1.5 rounded-lg bg-sky-500/20 text-sky-300">↓</span>
        </a>
        <a href="Elderly_Thailand_Health_Report_2565_2569.docx" download class="flex items-center justify-between p-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 transition group">
          <div class="min-w-0 pr-2">
            <div class="text-xs font-bold text-emerald-300 truncate">8. รายงานฉบับสมบูรณ์ .docx</div>
            <div class="text-[10px] text-emerald-400/80">61.8 KB • พร้อมพิมพ์</div>
          </div>
          <span class="p-1.5 rounded-lg bg-emerald-500/30 text-emerald-300">↓</span>
        </a>
      </div>
    </div>
'''

if target in content:
    content = content.replace(target, shelf, 1)
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS")
else:
    print("TARGET NOT FOUND")
