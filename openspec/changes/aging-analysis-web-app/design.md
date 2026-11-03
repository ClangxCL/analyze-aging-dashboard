# Design

## Context

The `Analyze Aging` project houses MOPH HDC multi-year (2567–2569) screening data across 13 Health Service Zones and 77 provinces for 9 vital health domains. The closed-loop data engineering architecture established in `analyze_aging_loop_engineering_workflow.html` defines 5 essential validation loops (Ingestion, Invariant, Rollup, Geo-Join, Serving).

The existing codebase provides a FastAPI backend (`backend/app/`), an Atelier AI styled web frontend (`frontend/`), and initial Vercel deployment specifications (`vercel.json`). This design specifies how to build an integrated, production-grade web application demo fulfilling the user's technology stack:
- **Frontend**: HTML5, Vanilla JavaScript, Tailwind CSS, D3.js & Chart.js
- **Backend**: Python 3.12, FastAPI, Pydantic v2
- **Database**: PostgreSQL (via SQLAlchemy ORM, with local SQLite fallback)
- **Testing**: Playwright for end-to-end browser automation
- **Deployment**: Vercel Serverless (`@vercel/python` and `@vercel/static`)

See `proposal.md` for motivation and `specs/` for behavioral requirements.

## Goals / Non-Goals

**Goals:**
- Deliver a responsive, high-performance HTML5 web dashboard for exploring 9-domain elderly risk rankings, heatmaps, and geographic choropleths.
- Implement a relational PostgreSQL data model in SQLAlchemy supporting 13 health zones, 77 provinces, multi-year screening records, and validation audit logs.
- Implement Python FastAPI REST endpoints delivering summary KPIs, TOP Rank leaderboards, 2D heatmap matrix calculations, GeoJSON choropleth features, and validation telemetry.
- Operationalize the 5-stage validation loop engine from `analyze_aging_loop_engineering_workflow.html` with automated anomaly quarantine.
- Author an automated Playwright test suite validating core user flows, responsive UI rendering, and API response contracts.
- Configure Vercel serverless deployment routing for zero-configuration cloud hosting.

**Non-Goals:**
- Direct write-back or mutation of source MOPH Excel workbooks.
- Live database synchronization with internal MOPH intranet servers (the demo operates on validated MOPH HDC annual snapshots).
- Individual patient identifiable health records (the application processes aggregated provincial and regional public health statistics).

## Decisions

### Decision 1: PostgreSQL Relational Schema with Multi-Dialect SQLAlchemy Support
- **Choice**: Design SQLAlchemy 2.0 models for PostgreSQL (utilizing `psycopg2-binary` and `asyncpg`) while providing automatic fallback to SQLite (`aging_data.db`) when `DATABASE_URL` is omitted.
- **Rationale**: Meets the user requirement for PostgreSQL in production (e.g., Supabase, Neon, or Vercel Postgres) while ensuring developers and automated CI environments can run tests locally without requiring an active PostgreSQL daemon.
- **Alternatives Considered**: Enforcing PostgreSQL connection only. Rejected because it breaks local testing in environments without local PostgreSQL instances.

### Decision 2: Implementation of the 5 Closed-Loop Validation Engines
- **Choice**: Encapsulate validation logic in a dedicated service module (`backend/app/services/loop_validator.py`) executing:
  1. *Ingestion Loop*: Pre-flight checks on workbook sheets, headers, and column offsets.
  2. *Transformation Loop*: Arithmetic invariants ($Normal + Risk = Screened$, $Screened \le Target$, non-negative constraints).
  3. *Rollup Loop*: Reconciliation between provincial totals, health zones, and national figures ($\Delta \le 0.1\%$).
  4. *Geo-Join Loop*: 100% key match between 2-digit Ministry of Interior codes and GeoJSON features.
  5. *Serving Loop*: Pre-delivery payload validation and client-side error boundaries.
- **Rationale**: Directly operationalizes the workflow documented in `analyze_aging_loop_engineering_workflow.html`, preventing data drift and corruption.
- **Alternatives Considered**: Ad-hoc assertions inside API route handlers. Rejected because validation logic must be reusable across CLI ETL scripts, database seeders, and live API endpoints.

### Decision 3: Vanilla HTML5 and Modern JavaScript Web Architecture
- **Choice**: Build the web application interface using semantic HTML5, modern ES6+ modules, Tailwind CSS, Chart.js (for leaderboard bar charts), and D3.js (for 2D Heatmap matrix and Thailand GeoJSON choropleth map).
- **Rationale**: Fulfills the requirement "Front-End Stack: Use HTML". Provides zero-bundle-overhead, lightning-fast first contentful paint (FCP < 100ms), and eliminates the complexity of npm/webpack/Vite bundling on Vercel.
- **Alternatives Considered**: Next.js or React SPA. Rejected to adhere strictly to the requested HTML frontend stack and avoid redundant build pipelines.

### Decision 4: Playwright End-to-End Test Suite
- **Choice**: Use `@playwright/test` to run headless browser validation tests against the HTML interface and backend API routes.
- **Rationale**: Playwright provides native support for testing SVG map paths, canvas rendering, dynamic dropdown updates, and asynchronous network assertions.
- **Alternatives Considered**: Selenium or Cypress. Playwright offers significantly faster execution, cleaner async/await syntax, and out-of-the-box cross-browser support.

### Decision 5: Vercel Serverless Architecture
- **Choice**: Configure `vercel.json` with `@vercel/python` routing `/api/(.*)` to `backend/app/main.py` and static routing for frontend HTML and assets.
- **Rationale**: Allows seamless deployment on Vercel with zero infrastructure management, automatic SSL, and instant global CDN caching for static assets.

## Risks / Trade-offs

- **[Risk]**: Vercel serverless function timeout (10s on hobby tier) when parsing raw Excel data dynamically on API requests.
  - **Mitigation**: Pre-seed screening data into PostgreSQL during build or migration; API endpoints query pre-indexed relational tables rather than parsing Excel files on demand.
- **[Risk]**: Inconsistent province names or spellings between Ministry of Interior and Ministry of Public Health datasets.
  - **Mitigation**: All database joins, API parameters, and GeoJSON properties use canonical 2-digit Ministry of Interior codes (`province_code`), with a normalized Thai name alias dictionary.
- **[Risk]**: Database connection pooling limits on serverless PostgreSQL (e.g. Supabase / Neon connection exhaustion).
  - **Mitigation**: Use SQLAlchemy connection pooling with `pool_pre_ping=True`, `pool_recycle=300`, and configure connection string pooling modes (Transaction pooler on port 6543).

## Migration Plan

1. **Database Schema Setup**: Run SQLAlchemy `Base.metadata.create_all()` or Alembic migrations against target PostgreSQL database.
2. **Data Seed & Validation Execution**: Run ETL seeding script (`backend/app/seed_aging_data.py`) which processes `Analyze Aging/hdc_elderly_screening_9domains.xlsx`, executes the 5 validation loops, and populates PostgreSQL tables.
3. **Local Testing & Playwright Verification**: Start local server and run `npx playwright test` to verify full functionality.
4. **Deploy to Vercel**: Push repository to GitHub and link to Vercel, configuring the `DATABASE_URL` environment variable.
