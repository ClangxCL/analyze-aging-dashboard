# Proposal

## Why

Public health officials, geriatric researchers, and policymakers require an accessible, reliable web demonstration platform to explore elderly health vulnerability across Thailand. The Ministry of Public Health (MOPH HDC) 9-domain elderly screening records (`hdc_elderly_screening_9domains.xlsx`) contain critical multi-year epidemiological data across 13 Health Service Zones and 77 provinces, but existing workflows lack an integrated, closed-loop web application backed by a production database and rigorous automated verification.

Deploying a modern full-stack web application powered by HTML, Python (FastAPI), PostgreSQL, Playwright automated testing, and Vercel serverless deployment solves this. It operationalizes the 5-phase Loop Engineering workflow (`analyze_aging_loop_engineering_workflow.html`) to ensure every stage of the data pipeline has an active validation loop, preventing silent data errors and providing actionable insights via interactive heatmaps, TOP Rank leaderboards, and Thailand choropleth visualizations.

## What Changes

- **PostgreSQL Data Layer (`screening-data-store`)**:
  - Implement relational PostgreSQL schema and SQLAlchemy models for 9-domain elderly screening data across fiscal years (2567, 2568, 2569).
  - Store entity tables for Provinces (`province_code`, `province_name`, `zone_id`), Health Zones (`zone_id`, `zone_name`), and 9-Domain Screening Records (`target_pop`, `screened_count`, `risk_count`, `risk_pct`, and domain-specific metrics).
  - Add an Anomaly & Validation Audit table recording anomalies detected by the loop engine.

- **FastAPI Analytical API (`screening-analytics-api`)**:
  - Build asynchronous Python FastAPI REST endpoints under `backend/app/routers/` to serve aggregated KPIs, domain breakdown matrices, dynamic TOP Rank leaderboards, and GeoJSON choropleth payloads.
  - Implement endpoints for running pipeline validation checks and querying pipeline health status.

- **Closed-Loop Data Engine (`loop-validation-engine`)**:
  - Implement Python-based closed-loop validators reflecting the 5 validation loops defined in `analyze_aging_loop_engineering_workflow.html`:
    1. Ingestion & Schema Contract Loop (checks sheet structure and header signatures).
    2. Extraction & Invariant Loop (validates physical and arithmetic bounds: $Normal + Risk = Screened$, $Screened \le Target$).
    3. Hierarchical Rollup Loop (reconciles Provincial sums against Zone aggregates and National totals).
    4. Geo-Spatial Join Loop (validates 100% 2-digit MOI code alignment with Thailand GeoJSON).
    5. Analytical Serving & Telemetry Loop (verifies payload integrity before client delivery).
  - Provide automated anomaly quarantine logging (`anomalies_audit.json` / database audit table).

- **HTML5 Executive Analytics Frontend (`aging-analytics-ui`)**:
  - Deliver a responsive, accessible HTML5/JavaScript dashboard (following Atelier AI / Warm Linen Paper design language compatible with the ElderHealth platform).
  - Include KPI summary cards, interactive filter toolbars (Fiscal Year, Health Zone, Domain), dynamic TOP Rank leaderboards (Top 5 / Top 10), interactive 2D Heatmap matrix (Areas × 9 Domains), and Thailand GeoJSON choropleth map.
  - Display a live Validation Loop Health indicator showing the operational state of all 5 validation loops.

- **Playwright End-to-End Testing Suite (`e2e-playwright-testing`)**:
  - Implement automated Playwright test specs verifying page loading, filter interactions, leaderboard sorting, heatmap rendering, map tooltips, and API validation response integrity.

- **Vercel Deployment Configuration**:
  - Update `vercel.json` routing and build configuration to seamlessly deploy the FastAPI backend serverless handler alongside the static HTML frontend.

## Capabilities

### New Capabilities

- `screening-data-store`: Relational PostgreSQL schema and SQLAlchemy persistence layer managing multi-year elderly screening data, administrative boundaries, and validation audit logs.
- `screening-analytics-api`: FastAPI REST API delivering analytical queries, TOP Rank leaderboards, 2D heatmap matrix calculations, and geo-spatial payloads.
- `loop-validation-engine`: Closed-loop validation framework executing automated schema checks, arithmetic invariant enforcement, hierarchical rollups, and geo-join verification.
- `aging-analytics-ui`: Accessible HTML5 frontend providing executive KPI summaries, interactive 2D risk heatmaps, Thailand choropleth geo-visualizations, and validation health indicators.
- `e2e-playwright-testing`: Playwright test automation suite verifying end-to-end browser user interactions, data rendering, and API validation endpoints.

### Modified Capabilities

<!-- None. No existing specs currently exist under openspec/specs/. -->

## Impact

- **Backend**: Adds new router modules in `backend/app/routers/`, new models in `backend/app/models.py`, schemas in `backend/app/schemas.py`, and validation services in `backend/app/services/`.
- **Frontend**: Adds web application page (e.g. `frontend/aging_dashboard.html` or unified view) with CSS/JS assets for 9-domain elderly risk visualization.
- **Database**: Extends database connection configuration to support PostgreSQL via environment variable `DATABASE_URL` with fallback to SQLite for local development.
- **Testing**: Adds Playwright test suite under `tests/e2e/` with package configuration in `package.json`.
- **Deployment**: Configures `vercel.json` and Python dependencies in `requirements.txt` (`psycopg2-binary`, `asyncpg`, `sqlalchemy`, `fastapi`).
