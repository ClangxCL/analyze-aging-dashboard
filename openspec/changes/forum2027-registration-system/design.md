# Design

## Context

The Department of Medical Services (MOPH) requires a production-grade registration system for **The 6th Thailand Elderly Health Service Forum 2027** (*"สูงวัย อยู่ดี มีพลัง: เชื่อมการดูแล สู่ผลลัพธ์ที่ยั่งยืน"*). The system must accommodate three distinct registrant audiences (General Public, Healthcare Staff across 12 Health Regions, and international ASEAN Member States delegates) while adhering to elderly accessibility standards (WCAG AA, >=18px typography, >=52px touch buttons) and institutional visual branding derived from `DESIGN.md`.

The technical stack is defined as:
- **Front-End**: Next.js / React / TypeScript / Tailwind CSS v4 implementing `DESIGN.md` design tokens (Deep Navy `#111a4a`, Midnight Ink `#011821`, Signal Orange `#ec652b`, Seafoam `#44b48b`, 8px card/button radii).
- **Back-End**: Python FastAPI with SQLAlchemy 2.0 and Pydantic v2.
- **Database**: MySQL 8.x (`Forum_2027`), `utf8mb4` charset and `utf8mb4_unicode_ci` collation.
- **Testing**: Playwright test suite covering 31 end-to-end scenarios.
- **Deployment**: Vercel configuration for web client and serverless routing.

## Goals / Non-Goals

**Goals:**
- Provide zero-latency bilingual switching (TH/EN) preserving all in-progress form inputs.
- Guarantee strict data integrity and eliminate duplicate attendee records via atomic MySQL transactions (`INSERT ... ON DUPLICATE KEY UPDATE` on deterministic `name_key` unique indexes).
- Deliver accessible, cascaded combobox search for Thai geographic entities (Province -> District -> Subdistrict) storing normalized integer IDs.
- Implement an administrative back-office with secure credential hashing (bcrypt/Argon2), news/schedule CMS, dynamic form manager, UTF-8 BOM CSV / Excel exports, and real-time Chart.js dashboards.
- Provide automated Playwright E2E verification for all 31 business scenarios.

**Non-Goals:**
- Payment gateway integration (all conference tracks are free of registration charge).
- Direct hotel reservation booking engine (delegates receive downloadable forms or scan official hotel QR codes to book directly with hotels).
- On-site RFID badge printing hardware integration.

## Decisions

### 1. Front-End: Next.js App Router with Tailwind CSS v4 and Column Design System
- **Choice**: Next.js App Router (React 18+, TypeScript) styled with Tailwind CSS v4 custom properties defined in `DESIGN.md`.
- **Rationale**: Next.js offers optimized font loading, static generation for marketing sections, and client-side state transitions. The Column style reference (`DESIGN.md`) provides an institutional, high-trust visual language (Indigo Navy `#111a4a`, Cloud Canvas `#f6f6f8`, Signal Orange `#ec652b` accents) and strict 8px component radii that aligns with government health authority standards.
- **Alternatives Considered**: Plain HTML/CSS/Vanilla JS (higher maintenance for complex cascaded comboboxes and bilingual state management) or Vue 3 (less direct alignment with the provided Vercel deployment preference).

### 2. Back-End: Python FastAPI with Asynchronous SQLAlchemy 2.0
- **Choice**: FastAPI running Python 3.11+ with SQLAlchemy 2.0 and Pydantic v2 data models.
- **Rationale**: FastAPI delivers automatic OpenAPI documentation, asynchronous request handling for high concurrency, and Pydantic validation for incoming registration payloads.
- **Alternatives Considered**: Flask (simpler, but lacks native async request handling and built-in type validation).

### 3. Database: MySQL 8.x (`Forum_2027`) with Atomic UPSERT Deduplication
- **Choice**: Dedicated MySQL 8.x database named `Forum_2027`.
- **Deduplication Engine**:
  1. Incoming first and last names are normalized using Unicode NFC (`unicodedata.normalize('NFC', text)`), stripped of leading titles/honorifics (นาย, นาง, นพ., พญ., Dr., etc.), and lowercased.
  2. A deterministic composite column `name_key VARCHAR(255)` is indexed with a `UNIQUE` constraint per registrant table (`public_registrations`, `staff_registrations`, `ams_registrations`).
  3. Form submission runs as an atomic transaction executing:
     `INSERT INTO ... ON DUPLICATE KEY UPDATE ... , updated_at = NOW()`.
  4. Previous field states are archived into `audit_logs` before update commits.
- **Alternatives Considered**: Soft validation in application code with `SELECT` followed by `INSERT/UPDATE` (susceptible to race conditions during concurrent burst submissions).

### 4. Dynamic Form Architecture & JSON Extension Column
- **Choice**: Standard core columns for primary entity attributes combined with an `extra_json JSON` column for dynamically defined form fields.
- **Rationale**: The specification allows administrators to create custom dynamic fields (radio, text, checkbox, date). Storing dynamic fields in a JSON column avoids destructive schema migrations while keeping queries straightforward.

### 5. Export Encoding: UTF-8 with BOM for Excel Compatibility
- **Choice**: Prepending the UTF-8 Byte Order Mark (`\ufeff`) to generated CSV streams and utilizing `openpyxl` for `.xlsx` generation.
- **Rationale**: Thai characters in standard UTF-8 CSVs corrupt into unreadable characters when opened directly in Windows Microsoft Excel unless the UTF-8 BOM is present.

### 6. Automated Testing: Playwright for Python/TypeScript
- **Choice**: Playwright test suite executing headless against Chromium, Firefox, and WebKit across mobile (390x844), tablet (768x1024), and desktop (1440x900) viewports.
- **Rationale**: Directly maps to the 31 required scenarios in section 7 of the specification.

## Risks / Trade-offs

- **[Risk] Vercel serverless execution timeout or MySQL connection exhaustion**
  - *Mitigation*: Configure connection pooling via SQLAlchemy `QueuePool` with sensible limits (`pool_size=5`, `max_overflow=10`, `pool_recycle=300`) and keep API request handlers stateless and lean.
- **[Risk] Heavy initial payload for 77 provinces, 900+ districts, and 7,000+ subdistricts**
  - *Mitigation*: Serve provinces and health regions initially; fetch districts and subdistricts on-demand via cached metadata endpoints (`/api/meta/districts?province_id=X`, `/api/meta/subdistricts?district_id=Y`) with client-side in-memory caching.
- **[Risk] Elderly users struggling with complex combobox interactions on mobile**
  - *Mitigation*: On viewports `< 600px`, combobox search triggers a dedicated bottom-sheet modal with large touch rows (minimum 48px height) and high-contrast text.

## Migration & Deployment Plan

1. **Database Provisioning**:
   - Create MySQL schema `Forum_2027` with `utf8mb4` charset and `utf8mb4_unicode_ci` collation.
   - Run Alembic migrations to generate all 14 core tables.
   - Execute seed script (`seed_forum2027.py`) to initialize:
     - Default Admin (`Admin@info`, password hash for `Forum@2027` with `must_change_password=True`).
     - Geographic metadata (Health Regions 1-12, Provinces, Districts, Subdistricts).
     - Standard Occupations (11 options) and 3 Session Rooms (Room 1 English, Room 2 Medical/Public Health, Room 3 Social/Economic).
     - 10 ASEAN Countries and seed hotels (Novotel, Ibis).
2. **Vercel Deployment**:
   - Configure `vercel.json` with builds for Next.js frontend and Python FastAPI API routes under `/api/*`.
   - Store MySQL connection credentials, JWT secrets, and admin seed parameters in Vercel Environment Variables.
