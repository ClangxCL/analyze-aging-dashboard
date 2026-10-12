# Proposal

## Why

Public health policymakers, regional health directors, and healthcare professionals need an executive-level, data-driven analytics platform to monitor and address elderly health vulnerabilities across Thailand's 76 provinces and 12 Health Service Regions (เขตบริการสุขภาพ). The current dataset (`Data_Analysis_9_Dimensions_2026.xlsx`) contains comprehensive elderly screening data across 9 critical health dimensions, but lacks an accessible, interactive, and visually compelling web dashboard for rapid decision-making, geographical risk identification, and regional performance comparisons.

Building this interactive dashboard with a modern, high-trust landing page (inspired by the Calendly design language in `DESIGN.md`) and deploying it to Vercel provides stakeholders with real-time filtering, automated Top 1–9 risk rankings, interactive geographic choropleth maps, regional heat maps, and granular data tables.

## What Changes

- **Elderly Health 9-Dimension Data Processing Pipeline**: Convert, validate, and structure the data from `Data_Analysis_9_Dimensions_2026.xlsx` (incorporating all 5 sheets: Provincial Top 1-5 summaries, 3-row provincial breakdowns, Regional 1-12 overviews, and raw screening counts and risk percentages for all 76 provinces across 9 dimensions) into query-optimized JSON/TypeScript datasets.
- **Multi-Level Interactive Filtering & Ranking Engine**: Provide filters for Health Service Region (เขตสุขภาพ 1-12), Province (76 provinces), and Health Dimension (9 dimensions), with dynamic Top 1 to Top 9 ranking driven by risk percentage (`% เสี่ยง/ผิดปกติ`).
- **Interactive Geographic Maps & Regional Heat Map**: 
  - GeoJSON-based Thailand Geographic Map visualizing province-level risk percentages with dynamic color scales and issue inspection tooltips.
  - Interactive Region-by-Dimension Heat Map matrix (12 Health Regions × 9 Health Dimensions) highlighting systemic regional health vulnerabilities.
- **Detailed Data Table**: Responsive, searchable, sortable, and exportable (CSV/Excel) data table presenting screening volume, risk counts, and risk percentages for each province and dimension.
- **Calendly-Inspired Executive Landing Page & UI**: Build an aesthetic landing page and dashboard application following `DESIGN.md` guidelines (Ink Navy `#0b3558`, Signal Blue `#006bff`, Cloud canvas `#f8f9fb`, Paper card `#ffffff`, modern type scale, and refined elevation/shadows).
- **Vercel Deployment Architecture**: Configure Next.js / TypeScript / Tailwind CSS stack with static asset optimization, serverless/client-side data handling, and automated Vercel deployment pipelines.

## Capabilities

### New Capabilities
- `health-analytics-engine`: Ingests, normalizes, and filters the 2026 9-dimension elderly health dataset, computing dynamic Top 1–9 risk rankings and statistical summaries across regions and provinces.
- `geographic-visualizations`: Renders interactive Thailand geographic choropleth maps and regional heat map matrices for cross-provincial and cross-regional health issue analysis.
- `landing-and-dashboard-ui`: Delivers the executive landing page and responsive analytics dashboard following the Calendly design tokens (`DESIGN.md`), with data tables and export capabilities, optimized for Vercel deployment.

### Modified Capabilities
*(None - this is a greenfield implementation for the 2026 Elderly Health Analytics platform)*

## Impact

- **New Assets**: Ingestion scripts for `Data_Analysis_9_Dimensions_2026.xlsx`, normalized JSON data artifacts, Thailand GeoJSON geometries, Next.js frontend application structure, UI components, and chart/map rendering modules.
- **Dependencies**: React, Next.js (App Router), Tailwind CSS (v4 compatible with design tokens), Lucide React, Leaflet / react-simple-maps / D3-geo for maps, Recharts / Chart.js for analytical graphics, xlsx/openpyxl for build-time data extraction.
- **Deployment**: Vercel configuration (`vercel.json` or standard Next.js Vercel preset) ensuring zero-config serverless hosting and high performance.
