# Tasks: Elderly Health Situation Interactive Visualizations

## 1. Chart Infrastructure & Data Module Verification

- [x] 1.1 Verify and standardize Chart.js registration in `src/components/analytics/ChartSetup.ts` with required controllers (Bar, Line, Radar, Doughnut), scales, and tooltip formatters, and verify no duplicate registration warnings appear.
- [x] 1.2 Verify `src/data/agingData.ts` exports all required 5-year structures (Demographics, ADL, Screening 9D, Chronic NCD, Morbidity Top 10, Mortality Top 10, Burden of Disease) and confirm TypeScript compiles without errors via `npx tsc --noEmit`.

## 2. Demographics & 5-Year Aging Trajectory Visualizer

- [x] 2.1 Implement `DemographicsSection.tsx` with 3-tier age bracket distribution charts (60–69, 70–79, 80+) and dual-axis line charts comparing Aging Index against Old-Age Dependency Ratio (2565–2569), verifying responsive rendering across screen sizes.
- [x] 2.2 Add interactive population metric summary cards (Total elderly, % elderly, gender sex ratio, TFR) and verify numbers match official Thailand Population Meter figures.

## 3. 9-Domain Health Screening Prevalence Comparison

- [x] 3.1 Implement `ScreeningComparisonSection.tsx` with multi-axis Radar chart and multi-year bar charts comparing HDC abnormal risk prevalence across all 9 domains (2565–2569).
- [x] 3.2 Add interactive domain filter pills and side-by-side comparison cards contrasting HDC screening coverage with DMS clinical assessment referrals, verifying that tooltip numbers display formatted percentages and person counts.

## 4. Functional Ability (ADL) & Geriatric Syndromes Distribution

- [x] 4.1 Implement `FunctionalADLSection.tsx` with 100% stacked bar chart visualizing Social-bound (96.5–97.1%), Home-bound (2.3–2.8%), and Bed-bound (0.5–0.7%) transitions from 2565 to 2569.
- [x] 4.2 Implement comparative prevalence bars for key Geriatric Syndromes (Falls, Sleep, Incontinence, Oral health), verifying that patient volume estimates and percentages match verified records.

## 5. Chronic Diseases (NCDs) Prevalence Comparison

- [x] 5.1 Implement `ChronicNCDSection.tsx` with comparative horizontal and grouped bar charts for Hypertension, Type 2 Diabetes, CKD, Stroke, and Ischemic Heart Disease.
- [x] 5.2 Add dual metric toggle (Prevalence % vs Estimated Patient Cases) and verify dynamic chart updates on toggle interaction.

## 6. Morbidity & Mortality Visualizers with Data Integrity Guards

- [x] 6.1 Implement `MorbiditySection.tsx` with comparative Top 10 OPD and IPD diagnosis rate charts for reported years (2565–2567), with explicit visual badge stating that years 2568 and 2569 are unreleased pending official consolidation.
- [x] 6.2 Implement `MortalitySection.tsx` with Top 10 causes of death bar charts for reported years (2565–2567), verifying that no synthetic or estimated values are rendered for years 2568 and 2569.

## 7. Burden of Disease (DALYs) & Disability Ratio Visualizer

- [x] 7.1 Implement `BurdenOfDiseaseSection.tsx` with gender-disaggregated comparison charts showing Top DALY loss causes for males vs females.
- [x] 7.2 Implement YLD (Years Lived with Disability) versus YLL (Years of Life Lost) proportional breakdown chart, verifying that disability burden ratios render accurately.

## 8. Dashboard Orchestration, Explorer & Navigation Integration

- [x] 8.1 Integrate all analytical sections into `AnalyzeAgingDashboard.tsx` with persistent top KPI summary cards, responsive tab switching, and clean DOM unmounting.
- [x] 8.2 Implement `ComprehensiveExplorer.tsx` with searchable, filterable data tables and direct one-click download buttons linking to all 8 verified UTF-8 BOM CSV files in `/public`.
- [x] 8.3 Verify dual-window and tri-window navigation in `Navbar.tsx` and `src/app/page.tsx`, ensuring smooth transitions between Window 1 (9-Domain 76-Province), Window 2 (Tabular Situation), and Window 3 (Interactive Visualizer).

## 9. End-to-End Build & Visual Verification

- [x] 9.1 Run `npm run build --webpack` in `health-9d-dashboard` and verify 0 compilation or linting errors.
- [x] 9.2 Launch the dev server via `npm run dev` and visually verify all charts, tooltips, responsive layouts, and CSV downloads in the browser.

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied.
- Verify the archived result.
