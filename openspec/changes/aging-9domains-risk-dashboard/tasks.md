# Tasks

## 1. Data Ingestion & Transformation Pipeline

- [ ] 1.1 Develop Python extraction script (`Analyze Aging/extract_9domains_data.py`) to parse all 6 data sheets from `Analyze Aging/hdc_elderly_screening_9domains.xlsx` (Zones and Provinces for 2567, 2568, 2569) and verify script execution without errors.
- [ ] 1.2 Implement indicator calculation logic for screening coverage rate and risk percentage `(risk_count / screened_count) * 100` across all 9 domains with zero-division handling, and verify calculated values match source Excel cells.
- [ ] 1.3 Export structured, validated dataset to `Analyze Aging/hdc_elderly_screening_9d_all.json` and verify complete record counts for 13 zones, 77 provinces, 3 fiscal years, and 9 domains.

## 2. Core Analytical & TOP Rank Ranking Engine

- [ ] 2.1 Implement dynamic sorting and ranking algorithms to order provinces and health zones by risk percentage for any selected health domain, and verify Top 5 and Top 10 leaderboards display highest-risk areas accurately.
- [ ] 2.2 Implement aggregate KPI calculation logic (national/regional target population, overall 9-domain completion rate, and highest-prevalence risk domain), and verify KPI output against national benchmarks.

## 3. Heatmap Matrix Visualization Component

- [ ] 3.1 Construct the 2D Heatmap Matrix component rendering administrative units (Zones 1–13 or 77 Provinces) across columns for all 9 health screening domains, and verify proper grid layout alignment.
- [ ] 3.2 Implement standardized severity color scales (low, moderate, high, critical risk) with automated quartile thresholds, and verify distinct visual gradation across risk intensity tiers.
- [ ] 3.3 Add interactive column header sorting by domain risk percentage and hover tooltips showing risk headcounts, percentages, and screened totals, and verify tooltip and sort interactivity.

## 4. Interactive Thailand Geographic Map Component

- [ ] 4.1 Integrate Thailand GeoJSON administrative boundary geometries linked to standard 2-digit province codes and 13 health zones, and verify clean polygon rendering.
- [ ] 4.2 Bind geographic polygons to active domain risk percentages with dynamic choropleth color scales, and verify map recolors immediately upon switching health domains or fiscal years.
- [ ] 4.3 Add administrative boundary switching (Health Zones vs Provinces) and interactive hover tooltips displaying provincial rank and screening breakdown, and verify map responsiveness.

## 5. Dashboard Layout, UI Integration & Verification

- [ ] 5.1 Construct the complete dashboard application (`Analyze Aging/elderly_9domains_dashboard.html`) integrating executive KPI cards, global filter toolbar (Year, Administrative Level, Domain), and view navigation tabs, and verify layout responsiveness.
- [ ] 5.2 Implement detailed data table view with real-time text search, multi-column sorting, and CSV export functionality, and verify exported CSV file matches table contents.
- [ ] 5.3 Conduct end-to-end verification across all 9 screening domains and 3 fiscal years, confirming seamless interaction between Top Rank leaderboards, Heatmap matrix, and Geographic map.

## Workflow follow-up

- Present planning artifacts for user review.
- Run `/opsx-apply` or await user instruction before beginning implementation.
