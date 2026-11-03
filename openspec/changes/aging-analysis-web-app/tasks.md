# Tasks

## 1. Database Layer & PostgreSQL Relational Schema

- [x] 1.1 Create SQLAlchemy models for Health Service Zones (`Zone`), Provinces (`Province`), 9-Domain Screening Records (`Screening9D`), and Anomaly Audit Logs (`AnomalyAudit`) in `backend/app/models.py`, supporting PostgreSQL dialect with SQLite fallback, and verify table creation via Python script.
- [x] 1.2 Write database migration and seeder script (`backend/app/seed_aging_data.py`) to extract records from `Analyze Aging/hdc_elderly_screening_9domains.xlsx` and populate tables for fiscal years 2567-2569, verifying record counts for 13 zones and 77 provinces.
- [x] 1.3 Add database unit tests in `tests/test_aging_db.py` to verify primary key uniqueness, foreign key constraints between zones and provinces, and audit logging persistence, confirming all unit tests pass with `pytest`.

## 2. Closed-Loop Validation Engine

- [x] 2.1 Implement `backend/app/services/loop_validator.py` covering the 5 validation loops (Ingestion schema check, arithmetic invariant verification, hierarchical rollup reconciliation, geo-spatial topology check, and serving contract guardrails), and verify validator returns structured status objects.
- [x] 2.2 Implement automated anomaly logging that records invariant failures to `anomalies_audit.json` and the `AnomalyAudit` database table, verifying invalid record quarantine behavior with synthetic corrupted data test cases.
- [x] 2.3 Write comprehensive unit tests in `tests/test_loop_validator.py` verifying each of the 5 validation loops with both valid and corrupted input samples, confirming 100% test pass rate with `pytest`.

## 3. FastAPI Analytics REST Endpoints

- [x] 3.1 Create Pydantic v2 schemas for KPIs, TOP Rank leaderboard entries, heatmap cells, GeoJSON properties, and validation telemetry in `backend/app/schemas.py`, and verify schema validation on mock payloads.
- [x] 3.2 Implement FastAPI router `backend/app/routers/aging.py` exposing `/api/aging/summary`, `/api/aging/rankings`, `/api/aging/heatmap`, `/api/aging/geojson`, and `/api/aging/validation-health`, and register router in `backend/app/main.py`.
- [x] 3.3 Add API integration tests in `tests/test_aging_api.py` asserting correct HTTP status codes, query parameter filtering (year, domain, administrative level, limit), and JSON response structures across all endpoints.

## 4. Responsive HTML5 Dashboard UI

- [x] 4.1 Create modern HTML5 application interface `frontend/aging_dashboard.html` with Tailwind CSS styling, responsive grid layout, executive KPI summary cards, and global filter toolbar (Fiscal Year 2567-2569, Health Zone 1-13, 9 Domains), verifying visual structure in browser.
- [x] 4.2 Implement client-side JavaScript logic in `frontend/js/aging_app.js` to render dynamic TOP Rank leaderboards (Top 5 / Top 10 bar charts with Chart.js) and 2D multi-domain risk heatmap matrix with quartile severity coloring, verifying interactive filter synchronization.
- [x] 4.3 Integrate D3.js Thailand choropleth map in `frontend/aging_dashboard.html` joining GeoJSON polygons with active domain risk percentages, displaying detailed provincial hover tooltips, and verify map recolors when switching domains.
- [x] 4.4 Implement live Validation Loop Health status widget in the dashboard header displaying the real-time operational status of the 5 validation loops fetched from `/api/aging/validation-health`.

## 5. Playwright E2E Test Suite & Vercel Deployment Configuration

- [x] 5.1 Initialize Playwright configuration (`playwright.config.ts`) and create E2E test specs in `tests/e2e/aging_dashboard.spec.ts` asserting dashboard mount, KPI card hydration, domain filter switching, leaderboard updates, map tooltips, and validation badge rendering.
- [x] 5.2 Execute the Playwright test suite using `npx playwright test` and verify that all end-to-end browser scenarios pass cleanly without console warnings.
- [x] 5.3 Update `vercel.json` and `backend/app/main.py` to route `/aging` and `/api/aging/(.*)` correctly, document environment variable configuration (`DATABASE_URL`), and verify that the serverless build configuration validates successfully.

## Workflow follow-up

- Present planning artifacts for user review.
- Run `/openspec-apply-change` or await user instruction before beginning implementation.
