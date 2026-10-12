# Design

## Context

See `proposal.md` for background and user goals.
The application processes screening statistics from `Data_Analysis_9_Dimensions_2026.xlsx` across 76 provinces and 12 Health Service Regions. Visual branding and component styling must conform to `C:\Users\Piyanut\Desktop\DESIGN.md` (Calendly-inspired theme: Ink Navy `#0b3558`, Signal Blue `#006bff`, Cloud `#f8f9fb`, Paper `#ffffff`, Pebble `#f0f3f8`, Hairline `#d4e0ed`). The production deployment target is Vercel.

## Goals / Non-Goals

**Goals:**
- Extract, clean, and validate all 5 sheets of `Data_Analysis_9_Dimensions_2026.xlsx` into typed, lightweight JSON datasets (`elderly_health_2026.json`).
- Implement a Next.js (App Router, TypeScript, Tailwind CSS) web application optimized for fast client-side filtering and rendering.
- Build an interactive Thailand Geographic Map (using GeoJSON / SVG) that colors provinces by risk percentage and displays issue tooltips.
- Build a Regional Heat Map matrix (12 Health Regions × 9 Dimensions) with color scales and click-through filtering.
- Provide dynamic Top 1–9 rankings sorted by risk percentage (`% เสี่ยง/ผิดปกติ`).
- Provide a responsive, searchable, sortable, and exportable (CSV) data table.
- Build an executive landing page and dashboard workspace faithful to the design tokens in `DESIGN.md`.
- Ensure zero-configuration deployment on Vercel.

**Non-Goals:**
- Real-time data editing or transactional database write operations.
- User authentication and role-based permissions (the dashboard is an executive public/internal open health dashboard).
- Complex GIS server infrastructure (Mapbox/ArcGIS); standard Thailand GeoJSON vector rendering satisfies all requirements.

## Decisions

### Decision 1: Architecture — Next.js with Static Pre-bundled Data
- **Choice**: Pre-generate normalized JSON during build/prep and load it directly into client-side state.
- **Rationale**: With 76 provinces, 12 regions, and 9 health dimensions, the entire dataset is under 200 KB. Loading this data client-side gives instant sub-millisecond filtering, eliminates backend latency, requires no database hosting costs, and runs flawlessly on Vercel's global CDN.
- **Alternatives Considered**: 
  - Express/FastAPI backend with SQLite/Postgres: adds unnecessary operational overhead and deployment complexity for static annual data.

### Decision 2: Design Token Implementation from DESIGN.md
- **Choice**: Map tokens from `DESIGN.md` directly into CSS custom properties and Tailwind CSS configuration:
  - Background: Cloud (`#f8f9fb`)
  - Surfaces: Paper (`#ffffff`), Pebble (`#f0f3f8`)
  - Text & Accents: Ink Navy (`#0b3558`), Slate Gray (`#476788`), Signal Blue (`#006bff`)
  - Elevation: 3-layer blue-tinted shadows (`rgba(71, 103, 136, ...)`)
  - Border radii: 8px (buttons/inputs), 16px/24px (cards/panels)
  - Typography: Gilroy / Manrope / Inter sans-serif stack
- **Rationale**: Guarantees distinct, high-end editorial aesthetics aligned with user specifications while strictly avoiding generic boilerplate design.
- **Alternatives Considered**: Standard default Tailwind gray/zinc palette (rejected to fulfill `DESIGN.md` guidelines).

### Decision 3: Map Visualization Engine — GeoJSON SVG Vector Rendering
- **Choice**: Use Thailand GeoJSON rendered via SVG / D3-geo projection (e.g. Albers / Mercator calibrated for Thailand) or Leaflet vector layer.
- **Rationale**: Instant rendering, no external API keys required, zero third-party tile loading latency, full styling control using CSS/SVG fills conforming to the design tokens.
- **Alternatives Considered**: Google Maps / Mapbox GL (requires API keys, rate limits, heavier download size).

### Decision 4: Interactive Regional Heat Map Matrix
- **Choice**: Render a 12-row by 9-column interactive grid with dynamic color interpolation from Mist Gray / Pebble (`#f0f3f8`) to Signal Blue (`#006bff`) and deep cobalt (`#004eba`).
- **Rationale**: Gives healthcare executives immediate cross-regional clarity on systemic issues (e.g., Vision vs Oral Health vs Mobility disparities across regions).
- **Alternatives Considered**: Standard bar chart (loses the 2-dimensional region vs dimension comparative density).

## Risks / Trade-offs

- **[Risk] Province Name Discrepancies**: The GeoJSON dataset might use English names or slightly different Thai spelling (e.g., กรุงเทพมหานคร vs กทม.) compared to the Excel spreadsheet.
  - **Mitigation**: Create an explicit bidirectional province mapping dictionary (`provinces.ts`) that maps GeoJSON feature IDs/names directly to the Thai province names in the spreadsheet.
- **[Risk] Excel Parsing at Runtime on Vercel**: Reading raw `.xlsx` on serverless functions can cause memory spikes or missing dependencies.
  - **Mitigation**: Run an offline/pre-build extraction script that outputs static JSON (`data/elderly_health_2026.json`) so the Vercel production build requires zero runtime Excel parsing.
- **[Risk] Large Screen vs Mobile Map Responsiveness**: Thailand has a tall, narrow geographic shape which can be awkward on mobile viewports.
  - **Mitigation**: Add zoom/pan controls and an optional view-toggle between Geographic Map, Heat Map, and Cards on smaller viewports.

## Migration / Deployment Plan

1. Generate normalized data JSON and verify against Excel source numbers.
2. Initialize or structure Next.js project in repository.
3. Verify local build (`npm run build`).
4. Ready for Vercel deployment via `vercel` CLI or Git repository push.
