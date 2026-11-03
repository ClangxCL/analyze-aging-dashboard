# Design

## Context

The dataset in `Analyze Aging/hdc_elderly_screening_9domains.xlsx` provides multi-year Ministry of Public Health (HDC) screening outcomes for fiscal years 2567, 2568, and 2569. It contains 7 sheets segregating 13 Health Service Zones and 77 provinces across 9 health screening domains. While rich in epidemiological depth, stakeholders require an interactive visual interface to spot regional disparities, evaluate TOP Rank vulnerabilities, and explore multi-domain heatmaps and geographic maps.

See `proposal.md` for background motivation and `specs/` for behavioral requirements.

## Goals / Non-Goals

**Goals:**
- Provide a responsive, high-performance interactive dashboard residing in `Analyze Aging/` accessible locally or via web preview.
- Implement an automated Python ETL pipeline to transform multi-year Excel sheets into an optimized, validated JSON dataset (`hdc_elderly_screening_9d_all.json`).
- Render dynamic TOP Rank leaderboards for any selected health domain and fiscal year, supporting Top 5, Top 10, and custom ranges.
- Deliver an interactive 2D Heatmap matrix (Areas × 9 Domains) with dynamic severity color ramps and sortable headers.
- Provide a Thailand GeoJSON/SVG choropleth map showing provincial and regional risk intensity with detailed hover tooltips.
- Ensure strict compliance with MOPH HDC indicator formulas and province coding conventions (Ministry of Interior 2-digit codes).

**Non-Goals:**
- Real-time querying against live MOPH HDC internal databases (this tool processes exported Excel workbooks).
- Direct mutation or editing of source Excel files.
- Patient-level clinical diagnostics (dashboard displays aggregated public health metrics).

## Decisions

### Decision 1: Pre-computed JSON Extraction vs Runtime Excel Parsing
- **Choice**: Implement a standalone Python ETL script (`extract_9domains_data.py`) that parses `hdc_elderly_screening_9domains.xlsx` and generates `hdc_elderly_screening_9d_all.json`.
- **Rationale**: Parsing multi-sheet Excel workbooks in client-side JavaScript adds considerable bundle overhead (e.g., `xlsx.full.min.js` > 1MB) and introduces client-side parse latency. Pre-compiling to a structured JSON file guarantees instantaneous dashboard loading, predictable typings, and zero runtime Excel dependencies.
- **Alternatives Considered**: In-browser XLSX parsing using SheetJS. Rejected due to slower cold-start performance and redundant client-side re-computation on every page load.

### Decision 2: Self-Contained Web Architecture with Modern Visualization Libraries
- **Choice**: Deliver an interactive HTML5/JavaScript dashboard in `Analyze Aging/` (e.g. `elderly_9domains_dashboard.html`) utilizing lightweight, battle-tested visual libraries (Chart.js for ranking leaderboards, D3/SVG for heatmaps and Thailand geographic choropleth, Tailwind CDN for styling).
- **Rationale**: A self-contained, browser-executable web interface allows instant execution via standard web server scripts (`Open_Web_App.bat`, Python `http.server`, or Node) with zero complex compilation steps, ensuring long-term maintainability.
- **Alternatives Considered**: A complex full-stack SSR framework. Rejected as overkill for an epidemiological analytics dashboard that operates on static multi-year screening snapshots.

### Decision 3: Standardized Primary Keys and Geographic Linking
- **Choice**: Key all geographical entities by official 2-digit Ministry of Interior province codes (`รหัสจังหวัด` e.g., "10" for Bangkok, "50" for Chiang Mai) and 2-digit zone codes (`รหัสเขต` "01"–"13").
- **Rationale**: Thai province names frequently experience slight orthographic variations or abbreviations across datasets (e.g., "กรุงเทพมหานคร" vs "กทม."). Numerical administrative codes provide an immutable anchor for joining screening data to Thailand GeoJSON boundary coordinates.
- **Alternatives Considered**: String-based fuzzy name matching. Rejected due to vulnerability to typographical discrepancies and silent join errors.

### Decision 4: MOPH HDC Compliant Indicator Formulas
- **Choice**: Standardize risk percentage calculation across all 9 domains as:
  $$\text{Risk \%} = \frac{\text{Risk Headcount (เสี่ยง/ผิดปกติ)}}{\text{Screened Headcount (คัดกรอง)}} \times 100$$
  and screening coverage as:
  $$\text{Coverage \%} = \frac{\text{Screened Headcount}}{\text{Target Elderly Population}} \times 100$$
- **Rationale**: Directly aligns with Ministry of Public Health HDC Report `aa86b13e8cb60cae6c3216b7e3e5f151` definitions described in the workbook's Data Dictionary sheet (`คำอธิบายตัวแปร`).
- **Alternatives Considered**: Calculating risk against total target population. Rejected because it distorts true risk prevalence in areas with incomplete screening coverage.

## Risks / Trade-offs

- **[Risk]**: Provinces with low screening numbers may show disproportionately high or low risk percentages due to small sample size.
  - **Mitigation**: Always display absolute screening volume alongside percentages; render warning badges on rankings when screening coverage is below 50%.
- **[Risk]**: Large 77 × 9 heatmap matrix may overflow narrow mobile screens.
  - **Mitigation**: Implement horizontal touch scrolling, sticky area labels, and default the initial heatmap view to the 13 Health Zones with a drill-down toggle for all 77 provinces.
- **[Risk]**: Complex Thailand GeoJSON paths may slow down map interactions.
  - **Mitigation**: Use optimized/simplified GeoJSON polygons (accuracy within 0.01 degrees) that maintain crisp provincial outlines while keeping file size under 400KB.
