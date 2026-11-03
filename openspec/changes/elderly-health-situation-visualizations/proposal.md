# Proposal: Elderly Health Situation Interactive Visualizations (5-Year Trends 2565–2569)

## Why

While tabular and raw CSV data for the 5-year elderly health situation (2565–2569) have been compiled across demographics, screening, NCDs, morbidity, mortality, and disease burden, users lack an intuitive, interactive visual interface to compare prevalence rates, spot multi-year epidemiological shifts, and understand healthcare burdens at a glance. Developing a comprehensive interactive visualization dashboard transforms complex epidemiological metrics into clear, decision-ready charts with responsive filtering, comparative analytics, and strict data-integrity safeguards (e.g., explicit distinction between actuals and unreleased years).

## What Changes

- **Interactive Visualizations Across All 6 Epidemiological Domains**:
  - **Demographics & Population Structure**: 5-year population pyramid, 3-tier elderly brackets (60–69, 70–79, 80+), and dual-axis Aging Index vs Old-Age Dependency Ratio trajectory using Thailand Population Meter (IPSR Mahidol University).
  - **9-Domain Screening (HDC vs DMS)**: Comparative radar charts and multi-year bar charts contrasting screening coverage against abnormal/risk prevalence for all 9 health domains.
  - **Functional Ability (ADL) & Geriatric Syndromes**: 100% stacked area/bar visualizer for Social-bound (ติดสังคม), Home-bound (ติดบ้าน), and Bed-bound (ติดเตียง) transitions alongside Geriatric Syndrome prevalence breakdown.
  - **Chronic Diseases (NCDs) Prevalence Comparison**: Multi-condition comparison charts (Hypertension, Diabetes, CKD, Stroke, IHD) detailing prevalence percentage and estimated patient volume.
  - **Morbidity Rates (Top 10 OPD & IPD)**: Comparative horizontal bar and trend visualizers for leading outpatient and inpatient diagnoses (2565–2567 actuals, with strict visual badges indicating unreleased 2568–2569 data).
  - **Mortality Causes (Top 10 Causes of Death)**: Comparative cause-of-death distribution and mortality rate charts per 100,000 population (2565–2567 actuals).
  - **Burden of Disease (DALYs)**: Comparative sex-disaggregated loss charts (Male vs Female top causes) and YLD/DALY disability fraction visual breakdowns.
- **Interactive Controls & Comparative Analytics**:
  - Year selector, multi-metric overlay toggles, search filter, and dynamic unit converters (rate per 100,000 vs percentage vs headcounts).
  - Integrated export actions (CSV download and print-ready executive view).
- **Navigation Integration**:
  - Seamless dual-window routing between Window 1 (9-Domain 76-Province Screening), Window 2 (Tabular 5-Year Situation), and Window 3 (Interactive Visualizer).

## Capabilities

### New Capabilities
- `elderly-health-visualizations`: Interactive visualization suite and comparative analytics engine for Thailand's 5-year elderly health, demographic, NCD, morbidity, mortality, and DALY datasets.

### Modified Capabilities
<!-- None: Greenfield capability for the interactive visualization suite. -->

## Impact

- **Frontend Application (`health-9d-dashboard`)**:
  - Extends `Chart.js` / `react-chartjs-2` integration with custom canvas renderers, accessible tooltips, and responsive aspect ratios.
  - Enhances UI routes (`/analyze-aging` and integrated tab views in `src/app/page.tsx`).
  - Connects to existing verified data stores (`src/data/agingData.ts` and public CSV endpoints).
- **Data Integrity**: Enforces no-extrapolation rule for years 2568 and 2569 in morbidity and mortality modules, providing visual callouts for pending official releases.
- **Dependencies**: Uses existing project dependencies (`chart.js`, `react-chartjs-2`, `lucide-react`, Tailwind CSS v4). No new external packages required.
