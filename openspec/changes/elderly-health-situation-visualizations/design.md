# Design: Elderly Health Situation Interactive Visualizations

## Context

See `proposal.md` for motivation. The application is built on Next.js 16 (App Router) with React 19, Tailwind CSS v4, and `chart.js` / `react-chartjs-2`. Comprehensive 5-year epidemiological datasets (2565–2569) have been compiled into strongly-typed structures in `src/data/agingData.ts` and verified `utf-8-sig` CSV files in `public/`. This design specifies the interactive visualization architecture, component modularity, charting configurations, and state handling.

## Goals / Non-Goals

**Goals:**
- Provide interactive visual comparisons across all 6 core domains:
  1. **Demographics**: 5-year population trajectory, 3-tier age bracket distributions, Aging Index & Dependency Ratio dual-axis trends.
  2. **9-Domain Screening**: Comparative radar charts and multi-year bar charts contrasting HDC risk prevalence with DMS clinical assessments.
  3. **Functional Ability (ADL)**: 100% stacked bar transitions (Social-, Home-, Bed-bound) and Geriatric Syndrome prevalence bars.
  4. **Chronic Diseases (NCDs)**: Comparative multi-condition bar and patient count charts.
  5. **Morbidity (OPD & IPD Top 10)**: Comparative rate charts per 100,000 population with explicit indicators for unreleased years.
  6. **Mortality (Top 10 Causes of Death)**: Ranked cause-of-death horizontal bar charts.
  7. **Burden of Disease (DALYs)**: Comparative male vs female DALY loss charts and YLD/DALY disability ratio breakdowns.
  8. **Comprehensive Data Explorer**: Searchable, filterable tabular explorer with direct CSV downloads.
- Ensure strict compliance with data integrity: years 2568 and 2569 for morbidity and mortality must NOT use estimated figures; they must display explicit status indicators ("ยังไม่มีรายงานทางการ").
- Enable responsive rendering, high-contrast accessible color coding, and seamless tab switching.

**Non-Goals:**
- No backend server-side databases or API mutations (all interactions are client-side over verified data).
- No speculative forecasting or statistical interpolation for missing morbidity/mortality years.

## Decisions

### 1. Charting Engine: Chart.js & react-chartjs-2
- **Choice**: Utilize `chart.js` (v4.6.1) and `react-chartjs-2` (v5.3.1) which are already installed in the project.
- **Rationale**: Direct Canvas rendering ensures high frame rates, responsive tooltips, rich radar, line, and bar chart capabilities without React 19 compatibility conflicts.
- **Alternative Considered**: Recharts (peer dependency conflicts with React 19 in Next.js 16) and D3 (higher boilerplate without pre-built accessibility features).

### 2. Centralized Chart Setup (`ChartSetup.ts`)
- **Choice**: Register all required Chart.js controllers, elements, scales, and plugins in a dedicated initialization module (`src/components/analytics/ChartSetup.ts`).
- **Rationale**: Prevents repeated controller registration across components, eliminates console warnings, and standardizes default font families, tooltip styling, and responsive defaults.

### 3. Modular Analytics Component Architecture
- **Structure**:
  - `AnalyzeAgingDashboard.tsx`: Top-level orchestrator with persistent KPI summary cards and tab navigation.
  - `AgingKpiCards.tsx`: High-level summary cards (Total Elderly, Aging Index, Top NCD, ADL Social-bound %, DALY leader).
  - `DemographicsSection.tsx`: Age distribution, pyramid, dependency ratios.
  - `ScreeningComparisonSection.tsx`: Radar and bar comparisons across HDC and DMS.
  - `FunctionalADLSection.tsx`: Stacked ADL breakdown and Geriatric Syndromes.
  - `ChronicNCDSection.tsx`: NCD prevalence and case volume rankings.
  - `MorbiditySection.tsx`: Top 10 OPD & IPD rates per 100k (2565–2567 actuals + 2568–2569 unreleased badge).
  - `MortalitySection.tsx`: Top 10 Causes of death (2565–2567 actuals + 2568–2569 unreleased badge).
  - `BurdenOfDiseaseSection.tsx`: Gender-disaggregated DALYs and disability ratio breakdown.
  - `ComprehensiveExplorer.tsx`: Unified search and direct CSV download trigger.

### 4. Visual Language & Thematic Consistency
- **Palette**:
  - Primary / Demographics: Deep Navy `#0b3558` & Sky `#006bff`
  - Functional / ADL: Emerald `#10b981` (Social), Amber `#f59e0b` (Home), Rose `#ef4444` (Bed)
  - 9-Domain Screening: Indigo `#6366f1` and Teal `#14b8a6`
  - NCDs & Morbidity: Violet `#8b5cf6`, Cyan `#06b6d4`, Blue `#3b82f6`
  - Mortality & DALYs: Crimson `#dc2626` and Purple `#9333ea`
- **Containers**: White rounded-xl cards with subtle borders (`border-slate-200`), drop-shadows, and clear typographic hierarchy.

### 5. Handling Missing Years in Morbidity & Mortality
- **Data Rendering**: In datasets for OPD, IPD, and Mortality, years 2568 and 2569 contain empty values (`""` or `null`).
- **Visual Display**: Charts explicitly render bars only for 2565, 2566, and 2567. An alert badge informs users: *"ปี 2568 – 2569 ยังไม่มีการรายงานข้อมูลสถิติทางการจากกระทรวงสาธารณสุข (ตามเงื่อนไขไม่ใช้ค่าประมาณการ)"*.

## Risks / Trade-offs

- **[Risk] Chart canvas resize glitches when switching tabs**
  → *Mitigation*: Ensure each chart container has an explicit height (`h-[320px]` or `h-[380px]`) and `maintainAspectRatio: false` in Chart.js options, wrapped in a key-backed container to reset canvas state cleanly.
- **[Risk] Heavy client-side re-renders on filter changes**
  → *Mitigation*: Use React `useMemo` for filtered data subsets and chart dataset configurations.
- **[Risk] Thai character rendering in tooltips**
  → *Mitigation*: Configure Chart.js tooltip callbacks to format numbers using `Intl.NumberFormat('th-TH')` and UTF-8 strings.
