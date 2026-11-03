/**
 * Analyze Aging - Dedicated Interactive Dashboard Frontend Logic
 * Full-stack MOPH HDC 9-Domain Screening, Thailand Choropleth Map,
 * Dynamic TOP Rank Leaderboards, Multi-Domain Heatmap, 5-Year Trends,
 * and Continuous Closed-Loop Validation Telemetry.
 */

const state = {
  year: '2569',
  level: 'province',
  zone: 'all',
  province: 'all',
  domain: 'd1_visual',
  order: 'desc',
  limit: 10,
  provincesList: [],
  chart: null,
  demographicsChart: null,
  ageGroupChart: null,
  ncdChart: null,
  morbidityChart: null,
  mortalityBarChart: null,
  mortalityPieChart: null,
  dalysChart: null,
  morbidityType: 'OPD',
  morbidityMetric: 'cases',
  morbidityRawData: [],
  ncdRawData: [],
  ncdCategory: 'all',
  ncdSort: 'pct',
  dalysView: 'absolute',
  dalysRawData: [],
  heatmapRows: [],
  mapSvg: null,
  mapData: null,
  activeTab: 'tab-9domains'
};

const DOMAINS_TITLE_MAP = {
  'd1_visual': '1. การมองเห็น (Visual Impairment)',
  'd2_incontinence': '2. การกลั้นปัสสาวะ (Urinary Incontinence)',
  'd3_hearing': '3. การได้ยิน (Hearing Impairment)',
  'd4_adl': '4. กิจวัตรประจำวัน (ADL Dependency)',
  'd5_cognition': '5. ความคิดความจำ (Cognition / Dementia)',
  'd6_depression': '6. ภาวะซึมเศร้า (Depression 2Q)',
  'd7_mobility': '7. การเคลื่อนไหว (Mobility & Fall Risk)',
  'd8_oral': '8. สุขภาพช่องปาก (Oral Health)',
  'd9_nutrition': '9. ภาวะโภชนาการ (Nutrition)'
};

const ORDER_TITLE_MAP = {
  'desc': 'ร้อยละความเสี่ยงสูงสุด (Top Risk %)',
  'asc': 'ร้อยละความเสี่ยงต่ำสุด (Lowest Risk %)',
  'risk_count_desc': 'จำนวนผู้มีความเสี่ยงมากสุด (Risk Count)',
  'coverage_desc': 'ความครอบคลุมการคัดกรองสูงสุด (Coverage %)'
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', async () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
  await loadProvincesList();
  await initDashboard();
});

async function initDashboard() {
  updateFilterStatusBanner();
  await Promise.all([
    loadSummaryKPIs(),
    loadRankings(),
    loadHeatmap(),
    loadChoroplethMap()
  ]);
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// ==========================================
// Robust Dual-Mode Fetch Engine (Live API + Offline Embedded Fallback)
// ==========================================
async function apiFetch(url, embeddedKey, fallbackTransform = null) {
  try {
    const res = await fetch(url);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Network error / server offline / file:// protocol
  }
  if (window.AGING_EMBEDDED_DATA) {
    if (embeddedKey && window.AGING_EMBEDDED_DATA[embeddedKey]) {
      const cloned = JSON.parse(JSON.stringify(window.AGING_EMBEDDED_DATA[embeddedKey]));
      if (typeof fallbackTransform === 'function') {
        return fallbackTransform(cloned);
      }
      return cloned;
    }
  }
  return null;
}

// ==========================================
// Province Metadata Management
// ==========================================
async function loadProvincesList() {
  try {
    const data = await apiFetch('/api/aging/provinces', 'provinces');
    if (!data) return;
    state.provincesList = data;
    populateProvinceDropdown();
  } catch (err) {
    console.error('Error loading provinces list:', err);
  }
}

function populateProvinceDropdown() {
  const select = document.getElementById('filter-province');
  if (!select) return;

  const currentVal = state.province;
  select.innerHTML = '<option value="all">ทุกจังหวัด</option>';

  const filteredProvinces = (state.zone === 'all')
    ? state.provincesList
    : state.provincesList.filter(p => p.zone_id === state.zone);

  filteredProvinces.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.province_code;
    opt.textContent = `[เขต ${parseInt(p.zone_id, 10)}] ${p.province_name_th}`;
    select.appendChild(opt);
  });

  if (filteredProvinces.some(p => p.province_code === currentVal)) {
    select.value = currentVal;
  } else {
    state.province = 'all';
    select.value = 'all';
  }
}

// ==========================================
// Tab Switching
// ==========================================
function switchTab(tabId) {
  state.activeTab = tabId;
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  const activePanel = document.getElementById(tabId);
  const activeBtn = document.getElementById(`btn-${tabId}`);
  if (activePanel) activePanel.classList.add('active');
  if (activeBtn) activeBtn.classList.add('active');

  if (tabId === 'tab-demographics') {
    loadDemographicsTab();
  } else if (tabId === 'tab-ncd') {
    loadNCDTab();
  } else if (tabId === 'tab-morbidity') {
    loadMorbidityTab();
  } else if (tabId === 'tab-mortality') {
    loadMortalityTab();
  } else if (tabId === 'tab-dalys') {
    loadDALYsTab();
  }
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// ==========================================
// 1. KPI Summaries & National 9-Domain Ranking
// ==========================================
async function loadSummaryKPIs() {
  try {
    let url = `/api/aging/summary?year=${state.year}`;
    if (state.province !== 'all') {
      url += `&province_id=${state.province}`;
    } else if (state.zone !== 'all') {
      url += `&zone_id=${state.zone}`;
    }

    const data = await apiFetch(url, `summary_${state.year}`, (fallbackSummary) => {
      if (state.province !== 'all' && window.AGING_EMBEDDED_DATA && window.AGING_EMBEDDED_DATA.heatmap_2569) {
        const row = window.AGING_EMBEDDED_DATA.heatmap_2569.rows.find(r => r.entity_id === state.province);
        if (row) {
          const provSummary = JSON.parse(JSON.stringify(fallbackSummary));
          provSummary.entity_name = row.entity_name;
          provSummary.target_pop = row.target_pop;
          provSummary.screened_9d = row.screened_9d;
          provSummary.screened_9d_pct = row.screened_9d_pct;
          provSummary.domains = row.domains;
          return provSummary;
        }
      }
      return fallbackSummary;
    });
    if (!data) return;

    document.getElementById('kpi-target-pop').textContent = data.target_pop.toLocaleString();
    document.getElementById('kpi-screened-count').textContent = data.screened_9d.toLocaleString();
    document.getElementById('kpi-coverage-badge').textContent = `${data.screened_9d_pct}%`;

    const areaLabelEl = document.getElementById('kpi-target-area-label');
    if (areaLabelEl) {
      areaLabelEl.textContent = `${data.entity_name || 'ทั้งประเทศ'}`;
    }

    // Active domain KPI
    const activeDomain = data.domains[state.domain] || {};
    document.getElementById('kpi-active-domain-title').textContent = `ความเสี่ยง: ${DOMAINS_TITLE_MAP[state.domain] || state.domain}`;
    document.getElementById('kpi-active-domain-pct').textContent = `${activeDomain.risk_pct || 0}%`;
    document.getElementById('kpi-active-domain-count').textContent = `(${(activeDomain.risk || 0).toLocaleString()} คน)`;

    const subTitleEl = document.getElementById('kpi-active-domain-subtitle');
    if (subTitleEl) {
      subTitleEl.textContent = `อัตราความเสี่ยง (${data.entity_name || 'ทั้งประเทศ'})`;
    }

    // Highest national risk domain
    if (data.highest_risk_domain) {
      document.getElementById('kpi-highest-domain-name').textContent = data.highest_risk_domain.name_th || '-';
      document.getElementById('kpi-highest-domain-pct').textContent = `${data.highest_risk_domain.risk_pct}%`;
    }

    // Render National 9-Domain Risk Ranking
    if (data.domain_rankings) {
      renderNationalDomainRankings(data.domain_rankings, data.entity_name);
    }
  } catch (err) {
    console.error('Error loading KPIs:', err);
  }
}

function renderNationalDomainRankings(rankings, areaName = 'ทั้งประเทศ') {
  const container = document.getElementById('national-domain-ranking-grid');
  if (!container || !rankings || !rankings.length) return;

  container.innerHTML = '';

  const scopeBadge = document.getElementById('domain-ranking-scope-badge');
  const sectionTitle = document.getElementById('domain-ranking-title');
  if (scopeBadge) {
    scopeBadge.textContent = `ขอบเขต: ${areaName || 'ทั้งประเทศ'}`;
  }
  if (sectionTitle) {
    sectionTitle.textContent = `จัด Rank ร้อยละที่มีความเสี่ยงสูงสุดในประเทศ (${areaName})`;
  }

  rankings.forEach(item => {
    const isActive = item.domain_id === state.domain;

    let rankBadge = `${item.rank}`;
    let rankClass = 'bg-slate-100 text-slate-700';
    if (item.rank === 1) {
      rankBadge = '🥇 อันดับ 1';
      rankClass = 'bg-amber-100 text-amber-900 border border-amber-300 font-bold';
    } else if (item.rank === 2) {
      rankBadge = '🥈 อันดับ 2';
      rankClass = 'bg-slate-200 text-slate-800 border border-slate-300 font-bold';
    } else if (item.rank === 3) {
      rankBadge = '🥉 อันดับ 3';
      rankClass = 'bg-amber-50 text-amber-900 border border-amber-200 font-bold';
    } else {
      rankBadge = `#${item.rank}`;
    }

    let sevBadge = 'bg-emerald-100 text-emerald-800 border-emerald-200';
    let progressBg = 'bg-emerald-500';
    let sevLabel = 'ต่ำ (<5%)';
    if (item.risk_pct >= 25) {
      sevBadge = 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
      progressBg = 'bg-rose-600';
      sevLabel = 'วิกฤต (≥25%)';
    } else if (item.risk_pct >= 15) {
      sevBadge = 'bg-orange-100 text-orange-800 border-orange-300 font-bold';
      progressBg = 'bg-orange-500';
      sevLabel = 'สูง (15-25%)';
    } else if (item.risk_pct >= 5) {
      sevBadge = 'bg-amber-100 text-amber-800 border-amber-300 font-semibold';
      progressBg = 'bg-amber-500';
      sevLabel = 'ปานกลาง (5-15%)';
    }

    const card = document.createElement('div');
    card.className = `p-3.5 rounded-xl border transition-all cursor-pointer relative ${
      isActive
        ? 'border-[#00d0ff] ring-2 ring-[#00d0ff]/25 bg-[#effbff] shadow-xs'
        : 'border-[#e8eff2] bg-white hover:border-[#d0d6d7] hover:shadow-xs hover:bg-[#effbff]/30'
    }`;
    card.onclick = () => selectDomain(item.domain_id);

    card.innerHTML = `
      <div class="flex items-start justify-between gap-2">
        <div class="flex items-center space-x-2">
          <span class="px-2 py-0.5 rounded-full text-xs font-mono font-bold ${rankClass}">
            ${rankBadge}
          </span>
          <div>
            <h4 class="font-bold text-xs sm:text-sm font-heading text-slate-900 tracking-tight">${item.name_th}</h4>
            <p class="text-[11px] text-slate-500 font-mono">${item.name_en}</p>
          </div>
        </div>
        <div class="text-right">
          <div class="text-lg font-extrabold font-mono text-slate-900">${item.risk_pct}%</div>
          <span class="inline-block px-1.5 py-0.2 rounded text-[10px] font-mono border ${sevBadge}">${sevLabel}</span>
        </div>
      </div>

      <!-- Risk Progress Bar -->
      <div class="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
        <div class="h-2 rounded-full ${progressBg} transition-all duration-500" style="width: ${Math.min(item.risk_pct * 3.5, 100)}%"></div>
      </div>

      <!-- Detail Numbers -->
      <div class="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-mono pt-2 border-t border-slate-100">
        <span>กลุ่มเสี่ยง: <strong class="text-slate-800">${item.risk.toLocaleString()}</strong> คน</span>
        <span>คัดกรอง: ${(item.screened || 0).toLocaleString()} คน</span>
      </div>

      ${isActive ? `
        <div class="mt-2.5 text-[11px] text-[#1d1f20] font-bold flex items-center space-x-1.5 pt-1 border-t border-[#ccf6ff]">
          <span class="w-2 h-2 rounded-full bg-[#00d0ff] animate-ping"></span>
          <span>กำลังเลือกดูมิตินี้ (Active Focus)</span>
        </div>
      ` : `
        <div class="mt-2.5 text-[11px] text-slate-400 hover:text-moph flex items-center space-x-1 pt-1 border-t border-slate-100 transition">
          <span>คลิกเพื่อดูแผนที่และตารางจัดอันดับ ➔</span>
        </div>
      `}
    `;

    container.appendChild(card);
  });
}

function selectDomain(domainId) {
  state.domain = domainId;
  const selectEl = document.getElementById('filter-domain');
  if (selectEl) selectEl.value = domainId;

  loadSummaryKPIs();
  loadRankings();
  loadChoroplethMap();
  updateFilterStatusBanner();
}

// ==========================================
// 2. Dynamic TOP Rank Leaderboard (Chart.js + Table)
// ==========================================
async function loadRankings() {
  try {
    let url = `/api/aging/rankings?year=${state.year}&domain=${state.domain}&level=${state.level}&limit=${state.limit}&order=${state.order}`;
    if (state.level === 'province' && state.zone !== 'all') {
      url += `&zone_filter=${state.zone}`;
    }

    const data = await apiFetch(url, 'heatmap_2569', (fallbackHeatmap) => {
      let rows = fallbackHeatmap.rows || [];
      if (state.level === 'province' && state.zone !== 'all') {
        rows = rows.filter(r => r.zone_id === state.zone || r.zone_id === ('0' + state.zone).slice(-2));
      }
      const rankings = rows.map(r => {
        const dom = (r.domains && r.domains[state.domain]) ? r.domains[state.domain] : {};
        const riskPct = dom.risk_pct != null ? dom.risk_pct : (r[state.domain] || 0);
        const riskCount = dom.risk != null ? dom.risk : Math.round((riskPct / 100) * (r.screened_9d || 10000));
        return {
          entity_id: r.entity_id,
          entity_name: r.entity_name,
          zone_id: r.zone_id,
          target_pop: r.target_pop,
          screened: r.screened_9d,
          screened_pct: r.screened_9d_pct,
          risk: riskCount,
          risk_pct: riskPct,
          severity_tier: dom.severity_tier || (riskPct >= 25 ? 'critical' : riskPct >= 15 ? 'high' : riskPct >= 5 ? 'moderate' : 'low')
        };
      });

      if (state.order === 'asc') {
        rankings.sort((a, b) => a.risk_pct - b.risk_pct);
      } else if (state.order === 'risk_count_desc') {
        rankings.sort((a, b) => b.risk - a.risk);
      } else if (state.order === 'coverage_desc') {
        rankings.sort((a, b) => b.screened_pct - a.screened_pct);
      } else {
        rankings.sort((a, b) => b.risk_pct - a.risk_pct);
      }

      const sliced = rankings.slice(0, state.limit).map((item, idx) => ({
        ...item,
        rank: idx + 1
      }));

      return {
        fiscal_year: state.year,
        domain_id: state.domain,
        domain_name: DOMAINS_TITLE_MAP[state.domain] || state.domain,
        rankings: sliced
      };
    });
    if (!data) return;

    const orderTitle = ORDER_TITLE_MAP[state.order] || 'อันดับพื้นที่';
    document.getElementById('leaderboard-title').textContent = `${orderTitle}: ${data.domain_name}`;

    let subText = `ปีงบฯ ${data.fiscal_year} (ระดับ${state.level === 'province' ? 'จังหวัด' : 'เขตสุขภาพ'})`;
    if (state.zone !== 'all' && state.level === 'province') {
      subText += ` [เฉพาะเขตสุขภาพที่ ${parseInt(state.zone, 10)}]`;
    }
    document.getElementById('leaderboard-subtitle').textContent = subText;
    document.getElementById('leaderboard-count-badge').textContent = `Top ${data.rankings.length}`;

    renderRankingChart(data.rankings);
    renderRankingTable(data.rankings);
  } catch (err) {
    console.error('Error loading rankings:', err);
  }
}

function renderRankingChart(rankings) {
  const ctx = document.getElementById('ranking-chart').getContext('2d');
  const labels = rankings.map(r => r.entity_name);
  
  // Decide value metric based on order
  let values = rankings.map(r => r.risk_pct);
  let metricLabel = 'อัตราความเสี่ยง (%)';
  let unitSuffix = '%';

  if (state.order === 'risk_count_desc') {
    values = rankings.map(r => r.risk);
    metricLabel = 'จำนวนผู้มีความเสี่ยง (คน)';
    unitSuffix = ' คน';
  }

  const colors = rankings.map(r => {
    if (r.risk_pct >= 25) return '#e11d48';
    if (r.risk_pct >= 15) return '#f97316';
    if (r.risk_pct >= 5) return '#f59e0b';
    return '#10b981';
  });

  if (state.chart) {
    state.chart.destroy();
  }

  state.chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: metricLabel,
        data: values,
        backgroundColor: colors,
        borderRadius: 4,
        barPercentage: 0.7
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${metricLabel}: ${ctx.parsed.x.toLocaleString()}${unitSuffix}`
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: '#f1f5f9' },
          ticks: { callback: v => `${v.toLocaleString()}${unitSuffix}`, font: { size: 10 } }
        },
        y: {
          grid: { display: false },
          ticks: { font: { size: 11, family: 'Sarabun' } }
        }
      }
    }
  });
}

function renderRankingTable(rankings) {
  const tbody = document.getElementById('ranking-table-body');
  tbody.innerHTML = '';

  rankings.forEach(r => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition cursor-pointer';
    
    // Clicking row highlights province in map and heatmap
    tr.onclick = () => {
      if (state.level === 'province' && r.entity_id) {
        state.province = r.entity_id.padStart(2, '0');
        const pSelect = document.getElementById('filter-province');
        if (pSelect) pSelect.value = state.province;
        loadSummaryKPIs();
        loadChoroplethMap();
        updateFilterStatusBanner();
      }
    };

    let rankBadge = `<span class="font-bold text-slate-700">${r.rank}</span>`;
    if (r.rank === 1) rankBadge = `<span class="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold inline-flex items-center justify-center text-xs shadow-2xs">1</span>`;
    if (r.rank === 2) rankBadge = `<span class="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold inline-flex items-center justify-center text-xs shadow-2xs">2</span>`;
    if (r.rank === 3) rankBadge = `<span class="w-5 h-5 rounded-full bg-amber-50 text-amber-800 font-bold inline-flex items-center justify-center text-xs shadow-2xs">3</span>`;

    let severityColor = 'text-emerald-700 bg-emerald-50';
    if (r.risk_pct >= 25) severityColor = 'text-rose-700 bg-rose-50 font-bold';
    else if (r.risk_pct >= 15) severityColor = 'text-orange-700 bg-orange-50 font-semibold';
    else if (r.risk_pct >= 5) severityColor = 'text-amber-700 bg-amber-50';

    const isSelected = (state.province === r.entity_id?.padStart(2, '0'));
    if (isSelected) tr.className += ' bg-emerald-50/80 font-bold';

    tr.innerHTML = `
      <td class="py-2 px-2.5 text-center">${rankBadge}</td>
      <td class="py-2 px-2.5 font-medium text-slate-900 flex items-center space-x-1.5">
        ${isSelected ? '<span class="w-2 h-2 rounded-full bg-moph"></span>' : ''}
        <span>${r.entity_name}</span>
      </td>
      <td class="py-2 px-2.5 text-right font-mono text-slate-600">${r.screened.toLocaleString()}</td>
      <td class="py-2 px-2.5 text-right font-mono text-slate-600">${r.risk.toLocaleString()}</td>
      <td class="py-2 px-2.5 text-right font-mono">
        <span class="px-1.5 py-0.5 rounded ${severityColor}">${r.risk_pct}%</span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ==========================================
// 3. D3.js Thailand Choropleth Map
// ==========================================
async function loadChoroplethMap() {
  const loading = document.getElementById('map-loading');
  if (loading) loading.style.display = 'flex';

  try {
    let url = `/api/aging/geojson?year=${state.year}&domain=${state.domain}`;
    if (state.zone !== 'all') {
      url += `&zone_filter=${state.zone}`;
    }

    const geojson = await apiFetch(url, 'geojson', (fallbackGeojson) => {
      if (window.AGING_EMBEDDED_DATA && window.AGING_EMBEDDED_DATA.heatmap_2569) {
        const rows = window.AGING_EMBEDDED_DATA.heatmap_2569.rows || [];
        const rowMap = {};
        rows.forEach(r => { rowMap[r.entity_id] = r; });

        fallbackGeojson.features.forEach(f => {
          const code = String(f.properties.pro_code || f.properties.code || f.properties.entity_id || '').padStart(2, '0');
          const r = rowMap[code];
          if (r) {
            const dom = (r.domains && r.domains[state.domain]) ? r.domains[state.domain] : {};
            f.properties.risk_pct = dom.risk_pct != null ? dom.risk_pct : (r[state.domain] || 0);
            f.properties.screened = r.screened_9d;
            f.properties.is_in_zone = (state.zone === 'all' || r.zone_id === state.zone || r.zone_id === ('0' + state.zone).slice(-2));
          }
        });
      }
      return fallbackGeojson;
    });

    if (!geojson) return;
    state.mapData = geojson;
    renderD3Map(geojson);
  } catch (err) {
    console.error('Error loading GeoJSON:', err);
  } finally {
    if (loading) loading.style.display = 'none';
  }
}

function renderD3Map(geojson) {
  const container = document.getElementById('choropleth-map-container');
  const svg = d3.select('#thailand-map-svg');
  svg.selectAll('*').remove();

  const width = container.clientWidth || 600;
  const height = container.clientHeight || 470;

  const projection = d3.geoMercator()
    .center([101.0, 13.0])
    .scale(width * 2.8)
    .translate([width / 2, height / 2]);

  const path = d3.geoPath().projection(projection);
  const tooltip = d3.select('#map-tooltip');

  const colorScale = (val) => {
    if (val >= 25) return '#e11d48';
    if (val >= 15) return '#f97316';
    if (val >= 5) return '#f59e0b';
    return '#10b981';
  };

  const g = svg.append('g');

  g.selectAll('path')
    .data(geojson.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('fill', d => colorScale(d.properties.risk_pct || 0))
    .attr('fill-opacity', d => {
      const code = String(d.properties.pro_code || d.properties.code || d.properties.entity_id || '').padStart(2, '0');
      if (state.province !== 'all') {
        return code === state.province ? 1.0 : 0.25;
      }
      if (state.zone !== 'all') {
        return d.properties.is_in_zone ? 1.0 : 0.25;
      }
      return 1.0;
    })
    .attr('stroke', d => {
      const code = String(d.properties.pro_code || d.properties.code || d.properties.entity_id || '').padStart(2, '0');
      if (state.province !== 'all' && code === state.province) return '#0f172a';
      return '#ffffff';
    })
    .attr('stroke-width', d => {
      const code = String(d.properties.pro_code || d.properties.code || d.properties.entity_id || '').padStart(2, '0');
      if (state.province !== 'all' && code === state.province) return 2.2;
      return 0.6;
    })
    .style('cursor', 'pointer')
    .style('transition', 'fill-opacity 0.2s, stroke 0.2s, stroke-width 0.2s')
    .on('mouseenter', function(event, d) {
      d3.select(this)
        .attr('stroke', '#0f172a')
        .attr('stroke-width', 2.0)
        .attr('fill-opacity', 1.0)
        .raise();

      const p = d.properties;
      tooltip
        .style('opacity', 1)
        .html(`
          <div class="font-bold text-sm text-emerald-400 font-heading">${p.entity_name || p.pro_th || 'จังหวัด'}</div>
          <div class="text-xs text-slate-300 mt-0.5">เขตสุขภาพที่: <span class="font-bold text-white font-mono">${p.zone_id || '-'}</span> | อันดับเสี่ยง: <span class="font-bold text-amber-300 font-mono">#${p.rank || '-'}</span></div>
          <div class="border-t border-slate-700 my-1"></div>
          <div class="flex justify-between space-x-3">
            <span>อัตราความเสี่ยง:</span>
            <span class="font-bold text-amber-300 font-mono">${p.risk_pct || 0}%</span>
          </div>
          <div class="flex justify-between space-x-3 text-slate-400 text-2xs">
            <span>คัดกรอง:</span>
            <span class="font-mono text-white">${(p.screened || 0).toLocaleString()} คน</span>
          </div>
          <div class="text-[10px] text-emerald-300 mt-1 italic">คลิกเพื่อกรองข้อมูลเฉพาะจังหวัดนี้</div>
        `);
    })
    .on('mousemove', function(event) {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left + 15;
      const y = event.clientY - rect.top + 15;
      tooltip.style('left', `${x}px`).style('top', `${y}px`);
    })
    .on('mouseleave', function(event, d) {
      const code = String(d.properties.pro_code || d.properties.code || d.properties.entity_id || '').padStart(2, '0');
      const isSelected = (state.province !== 'all' && code === state.province);
      
      d3.select(this)
        .attr('stroke', isSelected ? '#0f172a' : '#ffffff')
        .attr('stroke-width', isSelected ? 2.2 : 0.6)
        .attr('fill-opacity', () => {
          if (state.province !== 'all') return isSelected ? 1.0 : 0.25;
          if (state.zone !== 'all') return d.properties.is_in_zone ? 1.0 : 0.25;
          return 1.0;
        });
      tooltip.style('opacity', 0);
    })
    .on('click', function(event, d) {
      const p = d.properties;
      const code = String(p.pro_code || p.code || p.entity_id || '').padStart(2, '0');
      if (code && state.provincesList.some(pr => pr.province_code === code)) {
        if (state.province === code) {
          state.province = 'all'; // toggle back
        } else {
          state.province = code;
          const pObj = state.provincesList.find(pr => pr.province_code === code);
          if (pObj && state.zone !== 'all' && state.zone !== pObj.zone_id) {
            state.zone = pObj.zone_id;
            const zSelect = document.getElementById('filter-zone');
            if (zSelect) zSelect.value = pObj.zone_id;
            populateProvinceDropdown();
          }
        }
        const pSelect = document.getElementById('filter-province');
        if (pSelect) pSelect.value = state.province;

        loadSummaryKPIs();
        loadRankings();
        loadChoroplethMap();
        updateFilterStatusBanner();
      }
    });
}

// ==========================================
// 4. 2D Multi-Domain Heatmap Matrix
// ==========================================
async function loadHeatmap() {
  try {
    let url = `/api/aging/heatmap?year=${state.year}&level=${state.level}`;
    if (state.zone !== 'all' && state.level === 'province') {
      url += `&zone_filter=${state.zone}`;
    }
    const data = await apiFetch(url, 'heatmap_2569', (fallbackHeatmap) => {
      let rows = fallbackHeatmap.rows || [];
      if (state.zone !== 'all' && state.level === 'province') {
        rows = rows.filter(r => r.zone_id === state.zone || r.zone_id === ('0' + state.zone).slice(-2));
      }
      return { ...fallbackHeatmap, rows };
    });

    if (!data) return;
    state.heatmapRows = data.rows || [];
    filterHeatmapTable();
  } catch (err) {
    console.error('Error loading heatmap:', err);
  }
}

function renderHeatmapTable(rows) {
  const tbody = document.getElementById('heatmap-tbody');
  tbody.innerHTML = '';

  const domainKeys = [
    'd1_visual', 'd2_incontinence', 'd3_hearing',
    'd4_adl', 'd5_cognition', 'd6_depression',
    'd7_mobility', 'd8_oral', 'd9_nutrition'
  ];

  rows.forEach(r => {
    const tr = document.createElement('tr');
    const isSelected = (state.province === r.entity_id?.padStart(2, '0'));
    tr.className = `hover:bg-slate-50 transition border-b border-slate-100 cursor-pointer ${isSelected ? 'bg-emerald-50/70' : ''}`;

    tr.onclick = () => {
      if (state.level === 'province' && r.entity_id) {
        state.province = r.entity_id.padStart(2, '0');
        const pSelect = document.getElementById('filter-province');
        if (pSelect) pSelect.value = state.province;
        loadSummaryKPIs();
        loadChoroplethMap();
        updateFilterStatusBanner();
        renderHeatmapTable(rows);
      }
    };

    let cellsHtml = `
      <td class="py-2 px-3 font-semibold text-slate-900 sticky left-0 bg-white shadow-2xs flex items-center space-x-1.5">
        ${isSelected ? '<span class="w-2 h-2 rounded-full bg-moph"></span>' : ''}
        <span>${r.entity_name}</span>
      </td>
      <td class="py-2 px-2.5 text-right font-mono text-slate-600">${r.target_pop.toLocaleString()}</td>
      <td class="py-2 px-2.5 text-right font-mono font-medium text-emerald-700">${r.screened_9d_pct}%</td>
    `;

    domainKeys.forEach(did => {
      const cell = r.domains[did] || { risk_pct: 0, severity_tier: 'low' };
      const pct = cell.risk_pct;

      let badgeBg = 'bg-emerald-50 text-emerald-700';
      if (cell.severity_tier === 'critical') badgeBg = 'bg-rose-100 text-rose-800 font-bold';
      else if (cell.severity_tier === 'high') badgeBg = 'bg-orange-100 text-orange-800 font-semibold';
      else if (cell.severity_tier === 'moderate') badgeBg = 'bg-amber-100 text-amber-800';

      const isCurrentDomain = (did === state.domain);
      const activeBorder = isCurrentDomain ? 'ring-1 ring-moph font-bold' : '';

      cellsHtml += `
        <td class="py-1.5 px-2 text-center">
          <span class="inline-block px-1.5 py-0.5 rounded text-2xs font-mono ${badgeBg} ${activeBorder}" title="${cell.domain_name}: ${pct}% (${cell.risk} คน)">
            ${pct}%
          </span>
        </td>
      `;
    });

    tr.innerHTML = cellsHtml;
    tbody.appendChild(tr);
  });
}

function filterHeatmapTable() {
  const query = document.getElementById('heatmap-search')?.value.toLowerCase().trim() || '';
  let filtered = state.heatmapRows;

  if (state.province !== 'all') {
    filtered = filtered.filter(r => r.entity_id?.padStart(2, '0') === state.province);
  }

  if (query) {
    filtered = filtered.filter(r => r.entity_name.toLowerCase().includes(query));
  }

  renderHeatmapTable(filtered);
}

function exportHeatmapCSV() {
  if (!state.heatmapRows.length) return;
  const domainKeys = [
    'd1_visual', 'd2_incontinence', 'd3_hearing',
    'd4_adl', 'd5_cognition', 'd6_depression',
    'd7_mobility', 'd8_oral', 'd9_nutrition'
  ];

  let csv = '\uFEFF';
  csv += 'Area,Target_Pop,Screened_9D,Screened_Pct,Visual_Risk_Pct,Incontinence_Risk_Pct,Hearing_Risk_Pct,ADL_Risk_Pct,Cognition_Risk_Pct,Depression_Risk_Pct,Mobility_Risk_Pct,Oral_Risk_Pct,Nutrition_Risk_Pct\n';

  state.heatmapRows.forEach(r => {
    const row = [
      `"${r.entity_name}"`,
      r.target_pop,
      r.screened_9d,
      r.screened_9d_pct
    ];
    domainKeys.forEach(did => {
      row.push(r.domains[did]?.risk_pct || 0);
    });
    csv += row.join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aging_heatmap_${state.year}_${state.level}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ==========================================
// 5. Thematic Tabs Data Loaders & Renderers
// ==========================================

// --- TAB 2: DEMOGRAPHICS 5 YEARS ---
async function loadDemographicsTab() {
  try {
    const data = await apiFetch('/api/aging/demographics-5y', 'demographics_5y');
    if (!data) return;
    renderDemographicsChart(data);
    if (data.length > 0) {
      renderAgeGroupChart(data[data.length - 1]);
    }
    renderDemographicsTable(data);
  } catch (err) {
    console.error('Error loading demographics:', err);
  }
}

function renderDemographicsChart(data) {
  const canvas = document.getElementById('demographics-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (state.demographicsChart) {
    state.demographicsChart.destroy();
  }

  const labels = data.map(d => `พ.ศ. ${d.Year_TH}`);
  const popMillions = data.map(d => (d.Elderly_Population / 1000000).toFixed(2));
  const sharePct = data.map(d => d.Elderly_Pct);

  state.demographicsChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'ประชากรสูงอายุ (ล้านคน)',
          data: popMillions,
          backgroundColor: '#1d1f20',
          borderRadius: 6,
          yAxisID: 'y'
        },
        {
          label: 'สัดส่วนต่อประชากรรวม (%)',
          data: sharePct,
          type: 'line',
          borderColor: '#10b981',
          backgroundColor: '#10b981',
          borderWidth: 3,
          pointRadius: 5,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            label: (ctx) => ctx.dataset.yAxisID === 'y1' 
              ? ` สัดส่วน: ${ctx.parsed.y}%` 
              : ` จำนวน: ${ctx.parsed.y} ล้านคน`
          }
        }
      },
      scales: {
        y: {
          title: { display: true, text: 'ประชากรสูงอายุ (ล้านคน)' },
          grid: { color: '#f1f5f9' },
          beginAtZero: false,
          min: 10
        },
        y1: {
          position: 'right',
          title: { display: true, text: 'สัดส่วนประชากร (%)' },
          grid: { display: false },
          ticks: { callback: v => `${v}%` },
          min: 15,
          max: 25
        }
      }
    }
  });
}

function renderAgeGroupChart(latest) {
  const canvas = document.getElementById('age-group-chart');
  if (!canvas || !latest) return;
  const ctx = canvas.getContext('2d');

  if (state.ageGroupChart) {
    state.ageGroupChart.destroy();
  }

  state.ageGroupChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [
        `วัยต้น (60-69 ปี): ${latest.Age_60_69_Pct}%`,
        `วัยกลาง (70-79 ปี): ${latest.Age_70_79_Pct}%`,
        `วัยปลาย (80+ ปี): ${latest.Age_80_Plus_Pct}%`
      ],
      datasets: [{
        data: [latest.Age_60_69_Early, latest.Age_70_79_Mid, latest.Age_80_Plus_Late],
        backgroundColor: ['#1d1f20', '#00d0ff', '#a6ecff'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { boxWidth: 10, font: { size: 10, family: 'Sarabun' } }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${(ctx.parsed / 1000000).toFixed(2)} ล้านคน`
          }
        }
      },
      cutout: '65%'
    }
  });
}

function renderDemographicsTable(data) {
  const tbody = document.getElementById('demographics-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  data.forEach(d => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition';
    tr.innerHTML = `
      <td class="py-2.5 px-3 font-bold text-slate-800">พ.ศ. ${d.Year_TH}</td>
      <td class="py-2.5 px-3 text-right text-slate-600">${d.Total_Population.toLocaleString()}</td>
      <td class="py-2.5 px-3 text-right font-semibold text-slate-900">${d.Elderly_Population.toLocaleString()}</td>
      <td class="py-2.5 px-3 text-right font-bold text-emerald-700">${d.Elderly_Pct}%</td>
      <td class="py-2.5 px-3 text-right text-amber-700 font-semibold">${d.Aging_Index}</td>
      <td class="py-2.5 px-3 text-right">${d.Old_Age_Dependency_Ratio_OADR}</td>
      <td class="py-2.5 px-3 text-right font-semibold text-rose-600">${d.Potential_Support_Ratio} : 1</td>
      <td class="py-2.5 px-3 text-right">${d.Sex_Ratio_F_to_M} : 1</td>
      <td class="py-2.5 px-3 text-right text-slate-700">ญ ${d.Life_Expectancy_Female} / ช ${d.Life_Expectancy_Male}</td>
      <td class="py-2.5 px-3">
        <span class="px-2 py-0.5 rounded text-2xs font-semibold ${d.Elderly_Pct >= 20 ? 'bg-purple-100 text-purple-800 border border-purple-200' : 'bg-blue-100 text-blue-800 border border-blue-200'}">
          ${d.Super_Aged_Status}
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// --- TAB 3: CHRONIC DISEASES (NCDs) ---
async function loadNCDTab() {
  try {
    const data = await apiFetch('/api/aging/ncd-diseases', 'ncd_diseases');
    if (!data) return;
    state.ncdRawData = data;
    filterAndRenderNCD();
    renderNCDTable(data);
  } catch (err) {
    console.error('Error loading NCDs:', err);
  }
}

function filterNCDCategory(cat) {
  state.ncdCategory = cat;
  ['all', 'cardio', 'bone', 'neuro'].forEach(c => {
    const btn = document.getElementById(`btn-ncd-cat-${c}`);
    if (btn) {
      if (c === cat) {
        btn.className = 'px-2.5 py-1 rounded-full bg-slate-800 text-white font-bold transition shadow-xs';
      } else {
        btn.className = 'px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition';
      }
    }
  });
  filterAndRenderNCD();
}

function sortNCD(sortType) {
  state.ncdSort = sortType;
  const btnPct = document.getElementById('btn-ncd-pct');
  const btnCount = document.getElementById('btn-ncd-count');
  if (sortType === 'pct') {
    if (btnPct) btnPct.className = 'px-2.5 py-1 rounded-md font-medium bg-moph text-white shadow-2xs';
    if (btnCount) btnCount.className = 'px-2.5 py-1 rounded-md font-medium text-slate-600 hover:text-slate-900 transition';
  } else {
    if (btnCount) btnCount.className = 'px-2.5 py-1 rounded-md font-medium bg-moph text-white shadow-2xs';
    if (btnPct) btnPct.className = 'px-2.5 py-1 rounded-md font-medium text-slate-600 hover:text-slate-900 transition';
  }
  filterAndRenderNCD();
}

function filterAndRenderNCD() {
  if (!state.ncdRawData || !state.ncdRawData.length) return;
  let items = state.ncdRawData.filter(d => d.Rank !== 'OVERALL' && d.Rank !== '-');

  if (state.ncdCategory === 'cardio') {
    const cardioCodes = ['I10', 'E11', 'E78', 'I20-I25', 'I60-I69', 'N18'];
    items = items.filter(d => cardioCodes.some(c => d.ICD10_Code.includes(c) || c.includes(d.ICD10_Code)));
  } else if (state.ncdCategory === 'bone') {
    const boneCodes = ['M17', 'M81'];
    items = items.filter(d => boneCodes.some(c => d.ICD10_Code.includes(c)));
  } else if (state.ncdCategory === 'neuro') {
    const neuroCodes = ['F00-F03', 'F32-F33', 'G30'];
    items = items.filter(d => neuroCodes.some(c => d.ICD10_Code.includes(c)));
  }

  if (state.ncdSort === 'count') {
    items.sort((a, b) => (b.Estimated_Cases || 0) - (a.Estimated_Cases || 0));
  } else {
    items.sort((a, b) => (b.Prevalence_Pct || 0) - (a.Prevalence_Pct || 0));
  }

  renderNCDChart(items);
  renderNCDClinicalCards(items);
}

function renderNCDChart(diseases) {
  const canvas = document.getElementById('ncd-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (state.ncdChart) {
    state.ncdChart.destroy();
  }

  const isCount = state.ncdSort === 'count';
  const labels = diseases.map(d => `${d.Disease_Name_TH} (${d.ICD10_Code})`);
  const values = isCount ? diseases.map(d => d.Estimated_Cases) : diseases.map(d => d.Prevalence_Pct);
  const colors = [
    '#1d1f20', '#2a2c2d', '#00d0ff', '#0284c7', '#38bdf8',
    '#7dd3fc', '#94a3b8', '#cbd5e1', '#e2e8f0', '#effbff'
  ];

  state.ncdChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: isCount ? 'จำนวนผู้ป่วยคาดการณ์ (คน)' : 'อัตราความชุก (%)',
        data: values,
        backgroundColor: colors.slice(0, diseases.length),
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const d = diseases[ctx.dataIndex];
              return isCount 
                ? ` จำนวนผู้ป่วย: ${d.Estimated_Cases.toLocaleString()} คน (ความชุก ${d.Prevalence_Pct}%)`
                : ` ความชุก: ${d.Prevalence_Pct}% (${d.Estimated_Cases.toLocaleString()} คน)`;
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: v => isCount ? (v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : `${(v/1000).toFixed(0)}k`) : `${v}%`,
            font: { size: 10 }
          },
          grid: { color: '#f1f5f9' }
        },
        y: {
          ticks: { font: { size: 11, family: 'Sarabun' } },
          grid: { display: false }
        }
      }
    }
  });
}

function renderNCDClinicalCards(diseases) {
  const container = document.getElementById('ncd-clinical-cards');
  if (!container) return;
  container.innerHTML = '';

  diseases.forEach(d => {
    const card = document.createElement('div');
    card.className = 'p-3 rounded-lg border border-slate-200 bg-slate-50/70 hover:bg-slate-100/60 transition';
    card.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <span class="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold font-mono text-2xs flex items-center justify-center">
            ${d.Rank}
          </span>
          <h4 class="font-bold text-xs text-slate-900">${d.Disease_Name_TH} <span class="font-mono text-slate-500 font-normal">(${d.ICD10_Code})</span></h4>
        </div>
        <span class="font-mono font-bold text-xs text-slate-900">${d.Prevalence_Pct}%</span>
      </div>
      <p class="text-[11px] text-slate-600 mt-1.5 leading-relaxed pl-7">
        🎯 ${d.Clinical_Focus}
      </p>
    `;
    container.appendChild(card);
  });
}

function renderNCDTable(data) {
  const tbody = document.getElementById('ncd-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  data.forEach(d => {
    const isOverall = d.Rank === 'OVERALL' || d.Rank === '-';
    const tr = document.createElement('tr');
    tr.className = `hover:bg-slate-50 transition ${isOverall ? 'bg-rose-50/80 font-bold border-t-2 border-rose-200' : ''}`;
    tr.innerHTML = `
      <td class="py-2.5 px-3 text-center font-mono">${isOverall ? '★' : d.Rank}</td>
      <td class="py-2.5 px-3 font-mono font-bold text-slate-800">${d.ICD10_Code}</td>
      <td class="py-2.5 px-3 font-medium text-slate-900">${d.Disease_Name_TH}</td>
      <td class="py-2.5 px-3 text-slate-500 font-mono text-[11px]">${d.Disease_Name_EN}</td>
      <td class="py-2.5 px-3 text-right font-mono font-bold text-rose-600">${d.Prevalence_Pct}%</td>
      <td class="py-2.5 px-3 text-right font-mono text-slate-700">${d.Estimated_Cases.toLocaleString()}</td>
      <td class="py-2.5 px-3 text-slate-600 text-[11px]">${d.Clinical_Focus}</td>
    `;
    tbody.appendChild(tr);
  });
}

// --- TAB 4: MORBIDITY OPD & IPD 5-YEAR ---
async function loadMorbidityTab() {
  try {
    const type = state.morbidityType || 'OPD';
    const key = type === 'OPD' ? 'morbidity_opd' : 'morbidity_ipd';
    const data = await apiFetch(`/api/aging/morbidity-opd-ipd?care_type=${type}`, key);
    if (!data) return;
    state.morbidityRawData = data;
    renderMorbidityChart(data, type, state.morbidityMetric);
    renderMorbidityTable(data, type);
  } catch (err) {
    console.error('Error loading morbidity:', err);
  }
}

function switchMorbidityType(type) {
  state.morbidityType = type;
  const btnOpd = document.getElementById('btn-morb-opd');
  const btnIpd = document.getElementById('btn-morb-ipd');
  if (type === 'OPD') {
    if (btnOpd) btnOpd.className = 'px-3 py-1.5 rounded-md font-medium bg-moph text-white shadow-2xs';
    if (btnIpd) btnIpd.className = 'px-3 py-1.5 rounded-md font-medium text-slate-600 hover:text-slate-900 transition';
  } else {
    if (btnIpd) btnIpd.className = 'px-3 py-1.5 rounded-md font-medium bg-moph text-white shadow-2xs';
    if (btnOpd) btnOpd.className = 'px-3 py-1.5 rounded-md font-medium text-slate-600 hover:text-slate-900 transition';
  }
  loadMorbidityTab();
}

function switchMorbidityMetric(metric) {
  state.morbidityMetric = metric;
  const btnCases = document.getElementById('btn-morb-cases');
  const btnRate = document.getElementById('btn-morb-rate');
  if (metric === 'cases') {
    if (btnCases) btnCases.className = 'px-2.5 py-1.5 rounded-md font-medium bg-slate-800 text-white shadow-2xs';
    if (btnRate) btnRate.className = 'px-2.5 py-1.5 rounded-md font-medium text-slate-600 hover:text-slate-900 transition';
  } else {
    if (btnRate) btnRate.className = 'px-2.5 py-1.5 rounded-md font-medium bg-slate-800 text-white shadow-2xs';
    if (btnCases) btnCases.className = 'px-2.5 py-1.5 rounded-md font-medium text-slate-600 hover:text-slate-900 transition';
  }
  if (state.morbidityRawData && state.morbidityRawData.length) {
    renderMorbidityChart(state.morbidityRawData, state.morbidityType, metric);
  }
}

function renderMorbidityChart(data, type, metric = 'cases') {
  const canvas = document.getElementById('morbidity-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (state.morbidityChart) {
    state.morbidityChart.destroy();
  }

  const titleEl = document.getElementById('morbidity-chart-title');
  if (titleEl) {
    titleEl.textContent = type === 'OPD' 
      ? `10 อันดับการรับบริการผู้ป่วยนอก (OPD) 2565–2569 ${metric === 'rate' ? '(อัตราต่อแสนประชากร)' : '(จำนวนครั้งรับบริการ)'}`
      : `10 อันดับการนอนโรงพยาบาลผู้ป่วยใน (IPD) 2565–2569 ${metric === 'rate' ? '(อัตราต่อแสนประชากร)' : '(จำนวนรายผู้ป่วย)'}`;
  }

  const insightText = document.getElementById('morbidity-insight-text');
  if (insightText) {
    if (type === 'OPD') {
      insightText.textContent = metric === 'rate'
        ? 'กำลังแสดงอัตราการรับบริการผู้ป่วยนอก (OPD) ต่อประชากรแสนคน: บ่งชี้ความถี่การใช้บริการปฐมภูมิในแต่ละกลุ่มโรค'
        : 'กำลังแสดงข้อมูลผู้ป่วยนอก (OPD): มุ่งเน้นการติดตามควบคุมโรคเรื้อรังระดับปฐมภูมิ (เปรียบเทียบแนวโน้ม 3 ปี)';
    } else {
      insightText.textContent = metric === 'rate'
        ? 'กำลังแสดงอัตราการนอนโรงพยาบาลผู้ป่วยใน (IPD) ต่อแสนประชากร: สะท้อนอัตราการเจ็บป่วยรุนแรงที่ต้องนอน รพ.'
        : 'กำลังแสดงข้อมูลผู้ป่วยใน (IPD): การนอนรักษาตัวในโรงพยาบาลจากภาวะวิกฤต/เฉียบพลัน และภาวะแทรกซ้อน';
    }
  }

  const labels = data.map(d => d.Condition_Name_TH.length > 22 ? d.Condition_Name_TH.substring(0, 20) + '...' : d.Condition_Name_TH);

  if (metric === 'rate') {
    state.morbidityChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'อัตราต่อแสนประชากรสูงอายุ (ปี 2567)',
          data: data.map(d => d.Rate_Per_100k_2567 || 0),
          backgroundColor: '#00d0ff',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              title: (items) => data[items[0].dataIndex].Condition_Name_TH + ` (${data[items[0].dataIndex].ICD10_Code})`,
              label: (ctx) => ` อัตรา: ${(ctx.parsed.y).toLocaleString()} ต่อแสน (ผู้ป่วยปี 2567: ${(data[ctx.dataIndex].Cases_2567 || 0).toLocaleString()} ${type === 'OPD' ? 'ครั้ง' : 'ราย'})`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: v => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v
            },
            grid: { color: '#f1f5f9' },
            title: { display: true, text: 'อัตราต่อแสนประชากรสูงอายุ' }
          },
          x: {
            ticks: { font: { size: 10, family: 'Sarabun' } },
            grid: { display: false }
          }
        }
      }
    });
  } else {
    state.morbidityChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'ปี 2565',
            data: data.map(d => d.Cases_2565),
            backgroundColor: '#94a3b8',
            borderRadius: 4
          },
          {
            label: 'ปี 2566',
            data: data.map(d => d.Cases_2566),
            backgroundColor: '#0d9488',
            borderRadius: 4
          },
          {
            label: 'ปี 2567',
            data: data.map(d => d.Cases_2567),
            backgroundColor: '#1d1f20',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            callbacks: {
              title: (items) => data[items[0].dataIndex].Condition_Name_TH + ` (${data[items[0].dataIndex].ICD10_Code})`,
              label: (ctx) => ` ${ctx.dataset.label}: ${(ctx.parsed.y).toLocaleString()} ${type === 'OPD' ? 'ครั้ง' : 'ราย'}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: v => v >= 1000000 ? `${(v/1000000).toFixed(1)}M` : `${(v/1000).toFixed(0)}k`
            },
            grid: { color: '#f1f5f9' },
            title: { display: true, text: type === 'OPD' ? 'จำนวนครั้งรับบริการ (ครั้ง)' : 'จำนวนการนอน รพ. (ราย)' }
          },
          x: {
            ticks: { font: { size: 10, family: 'Sarabun' } },
            grid: { display: false }
          }
        }
      }
    });
  }
}

function renderMorbidityTable(data, type) {
  const tbody = document.getElementById('morbidity-tbody');
  const titleEl = document.getElementById('morbidity-table-title');
  if (titleEl) {
    titleEl.textContent = `ตารางสถิติ 10 อันดับการรับบริการ${type === 'OPD' ? 'ผู้ป่วยนอก (OPD)' : 'ผู้ป่วยใน (IPD)'} ย้อนหลัง 5 ปี (2565–2569)`;
  }
  if (!tbody) return;
  tbody.innerHTML = '';

  data.forEach(d => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition';
    tr.innerHTML = `
      <td class="py-2.5 px-3 text-center font-mono font-bold">${d.Rank}</td>
      <td class="py-2.5 px-3 font-mono font-bold text-slate-800">${d.ICD10_Code}</td>
      <td class="py-2.5 px-3 font-medium text-slate-900">${d.Condition_Name_TH}</td>
      <td class="py-2.5 px-3 text-slate-500 font-mono text-[11px]">${d.Condition_Name_EN}</td>
      <td class="py-2.5 px-2.5 text-right font-mono text-slate-600">${d.Cases_2565 != null ? d.Cases_2565.toLocaleString() : '-'}</td>
      <td class="py-2.5 px-2.5 text-right font-mono text-slate-600">${d.Cases_2566 != null ? d.Cases_2566.toLocaleString() : '-'}</td>
      <td class="py-2.5 px-2.5 text-right font-mono font-bold text-slate-900">${d.Cases_2567 != null ? d.Cases_2567.toLocaleString() : '-'}</td>
      <td class="py-2.5 px-2.5 text-right font-mono font-semibold text-emerald-700">${d.Rate_Per_100k_2567 != null ? d.Rate_Per_100k_2567.toLocaleString() : '-'}</td>
      <td class="py-2.5 px-2.5 text-right font-mono ${d.Growth_2565_2567_Pct >= 0 ? 'text-rose-600 font-bold' : 'text-emerald-600'}">${d.Growth_2565_2567_Pct != null ? (d.Growth_2565_2567_Pct > 0 ? '+' : '') + d.Growth_2565_2567_Pct + '%' : '-'}</td>
      <td class="py-2.5 px-3 text-slate-500 text-[11px]">${d.Remarks || '-'}</td>
    `;
    tbody.appendChild(tr);
  });
}

// --- TAB 5: TOP 10 MORTALITY CAUSES ---
async function loadMortalityTab() {
  try {
    const data = await apiFetch('/api/aging/mortality-top10', 'mortality_top10');
    if (!data) return;
    const rankedCauses = data.filter(d => d.Rank !== '-' && d.ICD10_Code !== 'Total');
    renderMortalityBarChart(rankedCauses);
    renderMortalityPieChart(rankedCauses);
    renderMortalityTable(data);
  } catch (err) {
    console.error('Error loading mortality:', err);
  }
}

function renderMortalityBarChart(causes) {
  const canvas = document.getElementById('mortality-bar-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (state.mortalityBarChart) {
    state.mortalityBarChart.destroy();
  }

  const labels = causes.map(c => c.Cause_Of_Death_TH.length > 20 ? c.Cause_Of_Death_TH.substring(0, 18) + '...' : c.Cause_Of_Death_TH);
  const deaths = causes.map(c => c.Deaths_2567);

  state.mortalityBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'จำนวนผู้เสียชีวิต (ราย: ปี 2567)',
        data: deaths,
        backgroundColor: '#e11d48',
        borderRadius: 4
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: (items) => causes[items[0].dataIndex].Cause_Of_Death_TH + ` (${causes[items[0].dataIndex].ICD10_Code})`,
            label: (ctx) => ` ผู้เสียชีวิต: ${ctx.parsed.x.toLocaleString()} ราย (อัตรา ${causes[ctx.dataIndex].Mortality_Rate_Per_100k_2567} ต่อแสน)`
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: '#f1f5f9' },
          ticks: { callback: v => `${(v/1000).toFixed(0)}k` }
        },
        y: {
          ticks: { font: { size: 11, family: 'Sarabun' } },
          grid: { display: false }
        }
      }
    }
  });
}

function renderMortalityPieChart(causes) {
  const canvas = document.getElementById('mortality-pie-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (state.mortalityPieChart) {
    state.mortalityPieChart.destroy();
  }

  const labels = causes.map(c => c.Cause_Of_Death_TH);
  const shares = causes.map(c => c.Mortality_Share_Pct_2567);
  const colors = [
    '#e11d48', '#0f294a', '#f59e0b', '#f97316', '#8b5cf6',
    '#06b6d4', '#10b981', '#64748b', '#ec4899', '#3b82f6'
  ];

  state.mortalityPieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: shares,
        backgroundColor: colors,
        borderWidth: 1.5,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: { boxWidth: 10, font: { size: 10, family: 'Sarabun' } }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.parsed}% (${causes[ctx.dataIndex].Deaths_2567.toLocaleString()} ราย)`
          }
        }
      },
      cutout: '55%'
    }
  });
}

function renderMortalityTable(data) {
  const tbody = document.getElementById('mortality-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  data.forEach(d => {
    const isTotal = d.Rank === '-' || d.ICD10_Code === 'Total';
    const tr = document.createElement('tr');
    tr.className = `hover:bg-slate-50 transition ${isTotal ? 'bg-slate-100 font-bold border-b-2 border-slate-300' : ''}`;
    tr.innerHTML = `
      <td class="py-2.5 px-3 text-center font-mono font-bold">${isTotal ? 'รวม' : d.Rank}</td>
      <td class="py-2.5 px-3 font-mono font-bold text-slate-800">${d.ICD10_Code}</td>
      <td class="py-2.5 px-3 font-medium text-slate-900">${d.Cause_Of_Death_TH}</td>
      <td class="py-2.5 px-3 text-slate-500 font-mono text-[11px]">${d.Cause_Of_Death_EN}</td>
      <td class="py-2.5 px-2.5 text-right font-mono text-slate-600">${d.Deaths_2565 != null ? d.Deaths_2565.toLocaleString() : '-'}</td>
      <td class="py-2.5 px-2.5 text-right font-mono text-slate-600">${d.Deaths_2566 != null ? d.Deaths_2566.toLocaleString() : '-'}</td>
      <td class="py-2.5 px-2.5 text-right font-mono font-bold text-slate-900">${d.Deaths_2567 != null ? d.Deaths_2567.toLocaleString() : '-'}</td>
      <td class="py-2.5 px-2.5 text-right font-mono font-semibold text-rose-700">${d.Mortality_Rate_Per_100k_2567 != null ? d.Mortality_Rate_Per_100k_2567.toLocaleString() : '-'}</td>
      <td class="py-2.5 px-2.5 text-right font-mono font-bold text-slate-800">${d.Mortality_Share_Pct_2567 != null ? d.Mortality_Share_Pct_2567 : '-'}%</td>
      <td class="py-2.5 px-2.5 text-right font-mono ${d.Growth_2565_2567_Pct >= 0 ? 'text-rose-600 font-bold' : 'text-emerald-600'}">${d.Growth_2565_2567_Pct != null ? (d.Growth_2565_2567_Pct > 0 ? '+' : '') + d.Growth_2565_2567_Pct + '%' : '-'}</td>
      <td class="py-2.5 px-3 text-slate-500 text-[11px]">${d.Remarks || '-'}</td>
    `;
    tbody.appendChild(tr);
  });
}

// --- TAB 6: BURDEN OF DISEASE (DALYs & BOD) ---
async function loadDALYsTab() {
  try {
    const data = await apiFetch('/api/aging/dalys-bod', 'dalys_bod');
    if (!data) return;
    state.dalysRawData = data;
    renderDALYsChart(data, state.dalysView);
    renderDALYsTable(data);
  } catch (err) {
    console.error('Error loading DALYs:', err);
  }
}

function switchDALYsView(view) {
  state.dalysView = view;
  const btnAbs = document.getElementById('btn-dalys-abs');
  const btnPct = document.getElementById('btn-dalys-pct');
  if (view === 'absolute') {
    if (btnAbs) btnAbs.className = 'px-3 py-1.5 rounded-md font-medium bg-moph text-white shadow-2xs';
    if (btnPct) btnPct.className = 'px-3 py-1.5 rounded-md font-medium text-slate-600 hover:text-slate-900 transition';
  } else {
    if (btnPct) btnPct.className = 'px-3 py-1.5 rounded-md font-medium bg-moph text-white shadow-2xs';
    if (btnAbs) btnAbs.className = 'px-3 py-1.5 rounded-md font-medium text-slate-600 hover:text-slate-900 transition';
  }
  if (state.dalysRawData && state.dalysRawData.length) {
    renderDALYsChart(state.dalysRawData, view);
  }
}

function renderDALYsChart(data, view = 'absolute') {
  const canvas = document.getElementById('dalys-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  if (state.dalysChart) {
    state.dalysChart.destroy();
  }

  const isPercent = view === 'percent';
  const labels = data.map(d => d.Condition_Name_TH);
  const yllData = isPercent ? data.map(d => d.YLL_Share_Pct) : data.map(d => d.YLL_Premature_Death_Years);
  const yldData = isPercent ? data.map(d => d.YLD_Share_Pct) : data.map(d => d.YLD_Disability_Years);

  state.dalysChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: isPercent ? 'สัดส่วน YLL ตายก่อนวัย (%)' : 'YLL ตายก่อนวัยอันควร (ปี)',
          data: yllData,
          backgroundColor: '#e11d48',
          borderRadius: 4
        },
        {
          label: isPercent ? 'สัดส่วน YLD อยู่อย่างทุพพลภาพ (%)' : 'YLD อยู่อย่างทุพพลภาพ/พิการ (ปี)',
          data: yldData,
          backgroundColor: '#00d0ff',
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          callbacks: {
            title: (items) => data[items[0].dataIndex].Condition_Name_TH + ` (${data[items[0].dataIndex].Condition_Name_EN})`,
            label: (ctx) => {
              const d = data[ctx.dataIndex];
              return isPercent
                ? ` ${ctx.dataset.label}: ${ctx.parsed.y}% (${ctx.datasetIndex === 0 ? d.YLL_Premature_Death_Years.toLocaleString() : d.YLD_Disability_Years.toLocaleString()} ปี)`
                : ` ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()} ปี (${ctx.datasetIndex === 0 ? d.YLL_Share_Pct : d.YLD_Share_Pct}%)`;
            },
            footer: (items) => ` รวม DALYs: ${data[items[0].dataIndex].Total_DALYs_Years.toLocaleString()} ปี (YLL:YLD = ${data[items[0].dataIndex].Ratio_YLL_to_YLD})`
          }
        }
      },
      scales: {
        x: {
          stacked: true,
          ticks: { font: { size: 11, family: 'Sarabun' } },
          grid: { display: false }
        },
        y: {
          stacked: true,
          beginAtZero: true,
          max: isPercent ? 100 : undefined,
          ticks: {
            callback: v => isPercent ? `${v}%` : `${(v/1000).toFixed(0)}k`
          },
          grid: { color: '#f1f5f9' },
          title: {
            display: true,
            text: isPercent ? 'สัดส่วนภาระโรค 100% (YLL vs YLD Share)' : 'ปีสุขภาวะที่สูญเสีย (Disability-Adjusted Life Years: DALYs)'
          }
        }
      }
    }
  });
}

function renderDALYsTable(data) {
  const tbody = document.getElementById('dalys-tbody');
  if (!tbody) return;
  tbody.innerHTML = '';

  data.forEach(d => {
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-slate-50 transition';
    tr.innerHTML = `
      <td class="py-2.5 px-3 text-center font-mono font-bold">${d.Rank}</td>
      <td class="py-2.5 px-3 font-semibold text-slate-900">${d.Condition_Name_TH}</td>
      <td class="py-2.5 px-3 text-slate-500 font-mono text-[11px]">${d.Condition_Name_EN}</td>
      <td class="py-2.5 px-3 text-right font-mono font-bold text-slate-900">${d.Total_DALYs_Years.toLocaleString()}</td>
      <td class="py-2.5 px-3 text-right font-mono text-rose-700 font-semibold">${d.YLL_Premature_Death_Years.toLocaleString()}</td>
      <td class="py-2.5 px-3 text-right font-mono text-rose-700">${d.YLL_Share_Pct}%</td>
      <td class="py-2.5 px-3 text-right font-mono text-amber-700 font-semibold">${d.YLD_Disability_Years.toLocaleString()}</td>
      <td class="py-2.5 px-3 text-right font-mono text-amber-700">${d.YLD_Share_Pct}%</td>
      <td class="py-2.5 px-3 text-center font-mono font-medium">${d.Ratio_YLL_to_YLD}</td>
      <td class="py-2.5 px-3 text-slate-600 text-[11px] font-sans">${d.Nature_Of_Burden}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ==========================================
// 6. Loop Engineering Telemetry
// ==========================================
async function loadValidationHealth() {
  try {
    const res = await fetch('/api/aging/validation-health');
    if (!res.ok) return;
    const data = await res.json();

    const pillText = document.getElementById('validation-pill-text');
    const modalBadge = document.getElementById('modal-val-badge');
    const modalTimestamp = document.getElementById('modal-val-timestamp');

    if (data.overall_status === 'HEALTHY') {
      pillText.textContent = 'Loop Engineering: 5/5 Validated';
      modalBadge.textContent = 'HEALTHY (5/5 PASSED)';
      modalBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800';
    } else {
      pillText.textContent = `Loop Engineering: Degraded (${data.total_anomalies_recorded} alerts)`;
      modalBadge.textContent = 'DEGRADED / WARNING';
      modalBadge.className = 'px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800';
    }

    if (modalTimestamp && data.timestamp) {
      modalTimestamp.textContent = `ตรวจสอบล่าสุด: ${new Date(data.timestamp).toLocaleString('th-TH')}`;
    }

    const summaryContainer = document.getElementById('modal-loops-summary');
    if (summaryContainer && data.loops) {
      summaryContainer.innerHTML = Object.entries(data.loops).map(([k, l]) => `
        <div class="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
          <span class="font-semibold text-slate-800">${l.loop_name}</span>
          <span class="font-mono font-bold text-xs ${l.is_valid ? 'text-emerald-700 bg-emerald-50' : 'text-amber-700 bg-amber-50'} px-2 py-0.5 rounded">
            ${l.status}
          </span>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Error loading validation health:', err);
  }
}

async function runLiveRevalidation() {
  const box = document.getElementById('live-telemetry-box');
  box.textContent = 'กำลังส่งคำสั่งตรวจสอบวงปิด (Running closed-loop validation)...';

  try {
    const res = await fetch('/api/aging/validation-health');
    const data = await res.json();
    box.textContent = JSON.stringify(data, null, 2);
    loadValidationHealth();
  } catch (err) {
    box.textContent = `เกิดข้อผิดพลาดในการตรวจสอบ: ${err}`;
  }
}

function openValidationModal() {
  const m = document.getElementById('validation-modal');
  if (m) m.classList.remove('hidden');
}

function closeValidationModal() {
  const m = document.getElementById('validation-modal');
  if (m) m.classList.add('hidden');
}

function toggleValidationModal() {
  const m = document.getElementById('validation-modal');
  if (m) m.classList.toggle('hidden');
}

// ==========================================
// 7. Filter Controls & Reactive Handlers
// ==========================================
function updateFilterStatusBanner() {
  const bannerYear = document.getElementById('filter-banner-year');
  const bannerDomain = document.getElementById('filter-banner-domain');
  const bannerArea = document.getElementById('filter-banner-area');
  const bannerOrder = document.getElementById('filter-banner-order');

  if (bannerYear) bannerYear.textContent = state.year;
  if (bannerDomain) bannerDomain.textContent = DOMAINS_TITLE_MAP[state.domain] || state.domain;
  if (bannerOrder) bannerOrder.textContent = ORDER_TITLE_MAP[state.order] || state.order;

  if (bannerArea) {
    if (state.province !== 'all') {
      const pObj = state.provincesList.find(p => p.province_code === state.province);
      bannerArea.textContent = `จังหวัด: ${pObj ? pObj.province_name_th : state.province}`;
    } else if (state.zone !== 'all') {
      bannerArea.textContent = `เขตสุขภาพที่ ${parseInt(state.zone, 10)}`;
    } else if (state.level === 'zone') {
      bannerArea.textContent = `เขตสุขภาพ (13 เขต)`;
    } else {
      bannerArea.textContent = 'ทั้งประเทศ (77 จังหวัด)';
    }
  }
}

function onFilterChange() {
  state.year = document.getElementById('filter-year').value;
  initDashboard();
}

function onLevelChange() {
  state.level = document.getElementById('filter-level').value;
  const zoneContainer = document.getElementById('zone-filter-container');
  const provContainer = document.getElementById('province-filter-container');

  if (state.level === 'zone') {
    if (provContainer) provContainer.classList.add('opacity-40', 'pointer-events-none');
    state.province = 'all';
    const pSelect = document.getElementById('filter-province');
    if (pSelect) pSelect.value = 'all';
  } else {
    if (provContainer) provContainer.classList.remove('opacity-40', 'pointer-events-none');
  }

  initDashboard();
}

function onZoneChange() {
  state.zone = document.getElementById('filter-zone').value;
  populateProvinceDropdown();
  initDashboard();
}

function onProvinceChange() {
  state.province = document.getElementById('filter-province').value;
  if (state.province !== 'all') {
    const pObj = state.provincesList.find(p => p.province_code === state.province);
    if (pObj && state.zone !== pObj.zone_id && state.zone !== 'all') {
      state.zone = pObj.zone_id;
      const zSelect = document.getElementById('filter-zone');
      if (zSelect) zSelect.value = pObj.zone_id;
    }
  }
  initDashboard();
}

function onDomainChange() {
  const dVal = document.getElementById('filter-domain').value;
  selectDomain(dVal);
}

function onOrderChange() {
  state.order = document.getElementById('filter-order').value;
  loadRankings();
  updateFilterStatusBanner();
}

function setLimit(limit) {
  state.limit = limit;
  const limits = [5, 10, 25, 77];
  limits.forEach(l => {
    const btn = document.getElementById(l === 77 ? 'btn-limit-all' : `btn-limit-${l}`);
    if (btn) {
      btn.className = (state.limit === l)
        ? 'px-2.5 py-1 rounded-md font-medium bg-[#1d1f20] text-white shadow-xs'
        : 'px-2.5 py-1 rounded-md font-medium text-[#434647] hover:text-[#1d1f20] hover:bg-[#effbff] transition';
    }
  });
  loadRankings();
}

function resetAllFilters() {
  state.year = '2569';
  state.level = 'province';
  state.zone = 'all';
  state.province = 'all';
  state.domain = 'd1_visual';
  state.order = 'desc';
  state.limit = 10;

  const ySelect = document.getElementById('filter-year');
  const lSelect = document.getElementById('filter-level');
  const zSelect = document.getElementById('filter-zone');
  const dSelect = document.getElementById('filter-domain');
  const oSelect = document.getElementById('filter-order');
  const sInput = document.getElementById('heatmap-search');

  if (ySelect) ySelect.value = '2569';
  if (lSelect) lSelect.value = 'province';
  if (zSelect) zSelect.value = 'all';
  if (dSelect) dSelect.value = 'd1_visual';
  if (oSelect) oSelect.value = 'desc';
  if (sInput) sInput.value = '';

  const provContainer = document.getElementById('province-filter-container');
  if (provContainer) provContainer.classList.remove('opacity-40', 'pointer-events-none');

  populateProvinceDropdown();
  setLimit(10);
  initDashboard();
}

function refreshData() {
  initDashboard();
}

// Global window exposure for HTML event handlers
window.apiFetch = apiFetch;
window.switchTab = switchTab;
window.switchMorbidityType = switchMorbidityType;
window.switchMorbidityMetric = switchMorbidityMetric;
window.filterNCDCategory = filterNCDCategory;
window.sortNCD = sortNCD;
window.switchDALYsView = switchDALYsView;
window.loadDemographicsTab = loadDemographicsTab;
window.loadNCDTab = loadNCDTab;
window.loadMorbidityTab = loadMorbidityTab;
window.loadMortalityTab = loadMortalityTab;
window.loadDALYsTab = loadDALYsTab;
window.selectDomain = selectDomain;
window.onFilterChange = onFilterChange;
window.onLevelChange = onLevelChange;
window.onZoneChange = onZoneChange;
window.onProvinceChange = onProvinceChange;
window.onDomainChange = onDomainChange;
window.onOrderChange = onOrderChange;
window.setLimit = setLimit;
window.resetAllFilters = resetAllFilters;
window.refreshData = refreshData;
window.filterHeatmapTable = filterHeatmapTable;
window.exportHeatmapCSV = exportHeatmapCSV;
window.openValidationModal = openValidationModal;
window.closeValidationModal = closeValidationModal;
window.toggleValidationModal = toggleValidationModal;
