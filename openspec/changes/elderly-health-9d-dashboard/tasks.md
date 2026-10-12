# Tasks

## 1. Data Ingestion & Transformation Pipeline

- [x] 1.1 Develop Python/Node.js extraction script to parse `Data_Analysis_9_Dimensions_2026.xlsx` (all 5 sheets) and generate normalized JSON dataset `elderly_health_2026.json` covering all 76 provinces and 12 Health Service Regions; verify data parity against the source spreadsheet.
- [x] 1.2 Define TypeScript interfaces and analytical utility functions for filtering by Region, Province, and Dimension, and computing dynamic Top 1–9 risk rankings; verify with automated unit tests.

## 2. Design System & Frontend Foundation

- [x] 2.1 Configure Next.js application with Tailwind CSS and CSS custom properties implementing all design tokens from `DESIGN.md` (Ink Navy `#0b3558`, Signal Blue `#006bff`, Cloud `#f8f9fb`, Paper `#ffffff`, Pebble `#f0f3f8`, Hairline `#d4e0ed`, 8px button radius, 16px/24px card radius, blue-tinted shadows); verify setup with a successful build.
- [x] 2.2 Construct core UI components (Navbar, Stat Cards, Pill Badges, Primary/Dark CTA Buttons, Filter Dropdowns/Pills) following `DESIGN.md` specs; verify component rendering and style consistency.

## 3. Landing Page & Executive Dashboard Layout

- [x] 3.1 Build the Calendly-style Landing Page featuring the hero headline, national screening executive summary stats, key findings cards, and seamless transition to the interactive dashboard; verify responsive layout on desktop and mobile.
- [x] 3.2 Implement the Filter Toolbar (Region 1–12, Province 1–76, 9 Health Dimensions) and dynamic Top 1–9 Ranking cards ordered by risk percentage (`% เสี่ยง/ผิดปกติ`); verify rankings update instantly upon changing filters.

## 4. Geographic Map & Regional Heat Map

- [x] 4.1 Implement the interactive Thailand Geographic Map using GeoJSON vector paths, choropleth risk coloring based on selected health issue, and interactive province tooltips; verify map renders all 76 provinces and responds to filter selections.
- [x] 4.2 Build the Regional Heat Map matrix (12 Health Service Regions × 9 Health Dimensions) with progressive color scaling and interactive cell selection; verify matrix calculations match sheet 3 ("ภาพรวมรายเขตสุขภาพ 1-12").

## 5. Data Table, Export & Vercel Deployment

- [x] 5.1 Implement the comprehensive province-level Data Table with real-time keyword search, multi-column sorting, pagination, and UTF-8 CSV export; verify search, sort, and export functionality with sample queries.
- [x] 5.2 Configure Vercel deployment assets (`vercel.json`, build pipeline optimization, metadata/OG tags), run `npm run build` to verify clean build output, and document deployment instructions.
