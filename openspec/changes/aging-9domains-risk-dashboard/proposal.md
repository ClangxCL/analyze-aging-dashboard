# Proposal

## Why

Public health officers, geriatric care managers, and provincial health directors need actionable, localized insights from the Ministry of Public Health (MOPH HDC) 9-domain elderly screening data (`hdc_elderly_screening_9domains.xlsx`). Although multi-year screening records (2567–2569) exist for all 13 Health Service Zones and 77 provinces across 9 vital health domains, the raw Excel sheets lack an interactive dashboard for rapid risk identification. Healthcare teams cannot quickly pinpoint which provinces or health zones exhibit the highest vulnerability, compare risk prevalence across domains simultaneously, or explore geographic clustering of high-risk elderly populations.

Building an interactive analytics dashboard in `Analyze Aging` solves this by transforming the multi-year Excel dataset into dynamic TOP Rank leaderboards (ranking provinces and health zones by elderly risk percentage per domain), a comprehensive multi-domain Heatmap matrix, and an interactive Thailand Geographic choropleth visualization.

## What Changes

- **9-Domain Multi-Year Data Processing Pipeline**: Ingest and structure data from `Analyze Aging/hdc_elderly_screening_9domains.xlsx` covering fiscal years 2567, 2568, and 2569 across both administrative levels (13 Health Service Zones and 77 Provinces). Clean, validate, and compute key indicators including target population, screening coverage rate, normal count, risk count, and risk percentage (`(ผู้สูงอายุที่มีความเสี่ยง / ผู้สูงอายุที่ได้รับการคัดกรอง) * 100`) for all 9 health domains:
  1. การมองเห็น (Visual Impairment)
  2. การกลั้นปัสสาวะ (Urinary Incontinence)
  3. การได้ยิน (Hearing Impairment)
  4. กิจวัตรประจำวัน (ADL / Physical Dependency)
  5. ความคิดความจำ (Cognitive Decline / Dementia)
  6. ภาวะซึมเศร้า (Depression 2Q / 2Q+ risk)
  7. การเคลื่อนไหว (Mobility & Fall Risk)
  8. สุขภาพช่องปาก (Oral Health)
  9. ภาวะขาดสารอาหาร (Nutrition / Malnutrition Risk)
- **Dynamic TOP Rank Risk Leaderboard**: Multi-criteria ranking module enabling users to rank provinces and health zones from highest to lowest risk percentage for each specific health domain or across aggregated multi-domain risk indices, with configurable Top 5, Top 10, or custom thresholds.
- **Multidimensional Risk Heatmap Matrix**: Interactive matrix visualizer cross-referencing administrative areas (Health Zones 1–13 or 77 Provinces) against the 9 health screening domains, utilizing standardized color gradients (low to critical risk) with sortable columns, value overlays, and cell-level inspection popups.
- **Interactive Thailand Geographic Choropleth Map**: Geo-visualization rendering Thailand provinces and health zones shaded by risk prevalence for any selected health domain and fiscal year (2567, 2568, 2569), featuring hover tooltips with detailed screening breakdowns and provincial zoom.
- **Executive Interactive Dashboard UI**: Clean, responsive web dashboard with KPI overview cards, year switchers (2567, 2568, 2569), health zone/province filter dropdowns, domain selectors, and data export options (CSV/JSON/print-ready summary).

## Capabilities

### New Capabilities
- `screening-risk-engine`: Ingests, normalizes, and validates multi-year 9-domain elderly screening data from `Analyze Aging/hdc_elderly_screening_9domains.xlsx`, calculating screening coverage, risk headcounts, and risk percentages, while powering dynamic Top Rank ranking queries across zones and provinces.
- `risk-heatmap-matrix`: Computes and renders interactive cross-domain risk heatmaps (Administrative Area × 9 Health Domains), offering color scales, domain sorting, threshold filtering, and drill-down inspection.
- `geographic-risk-map`: Provides interactive Thailand choropleth map visualizations of elderly screening risk percentages by province and health zone with domain-specific coloring and demographic tooltips.
- `aging-dashboard-ui`: Delivers the complete user interface, including KPI cards, interactive filter toolbars, Top Rank leaderboards, view toggles (Rankings, Heatmap, Map, Data Table), and dataset export utilities.

### Modified Capabilities
<!-- None. No existing specs currently exist under openspec/specs/. -->

## Impact

- **Data Sources**: Reads and parses `Analyze Aging/hdc_elderly_screening_9domains.xlsx` (specifically sheets for Health Zones 2567–2569 and Provinces 2567–2569, plus Data Dictionary).
- **Files & Codebase**: Creates new data processing scripts and web assets within the `Analyze Aging/` directory and connected dashboard components.
- **Dependencies**: Uses client-side or lightweight web technologies (e.g., standard browser JS/TypeScript, D3/Chart.js/Plotly/Leaflet, or Python web framework if standalone) and standard data conversion tools (`openpyxl`/`pandas` or Node-based Excel parsers).
