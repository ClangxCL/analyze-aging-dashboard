# Proposal

## Why

The Department of Medical Services (Ministry of Public Health, Thailand) is hosting **The 6th Thailand Elderly Health Service Forum 2027** under the theme *"Ageing Well: Connecting Care for Sustainable Outcomes"*. To successfully facilitate attendees across general public, healthcare professionals, and international delegates from ASEAN Member States (AMS), an accessible, bilingual (TH/EN), and high-integrity registration system is required. This web application demo solves fragmentation in attendee onboarding, eliminates duplicate submissions via atomic database deduplication, and provides organizers with real-time operational analytics and dynamic CMS control.

## What Changes

- **Bilingual Accessible Web Portal (Front-End)**: Implement a mobile-first, WCAG AA compliant frontend using Next.js/React with Tailwind CSS v4 following the Column/Institutional Deep Navy design language from `DESIGN.md`. Features include instant TH/EN switching without form data loss, A-/A/A+ font scaling, cascaded address search comboboxes (Region -> Province -> District -> Subdistrict), AMS country/dietary selection, and hotel reservation QR code viewing.
- **High-Integrity Registration & Deduplication Engine (Back-End)**: Implement a Python FastAPI backend connecting to a MySQL 8.x database named `Forum_2027`. All submissions undergo Unicode NFC normalization and title stripping to generate a deterministic `name_key`, enforcing single-active-record persistence via atomic MySQL `INSERT ... ON DUPLICATE KEY UPDATE` transactions.
- **Admin Back-Office & Real-Time Analytics**: Secure administration portal featuring bcrypt-hashed credential authentication (`Admin@info` / `Forum@2027`), mandatory first-login password rotation, rate-limiting lockout, news carousel & schedule board CMS, dynamic form schema manager, CSV (UTF-8 with BOM) & Excel (.xlsx) export, and real-time interactive Chart.js analytics.
- **End-to-End Test Suite**: Complete Playwright automated test suite covering all 31 end-to-end scenarios specified in the specification document across Chromium, Firefox, and WebKit.
- **Deployment & Documentation Package**: Production-ready deployment configuration targeting Vercel, MySQL schema migration scripts, seed data, and comprehensive `README.md` documentation.

## Capabilities

### New Capabilities
- `registration-portal`: Client-side user interface encompassing the landing page, 3 registration pathways (Public, Staff, ASEAN AMS), registration verification lookup, accessible font controls, and bilingual (TH/EN) state management.
- `registration-engine`: Server-side API endpoints for attendee registration, registration status verification, Unicode/name-key normalization, and MySQL transaction-safe deduplication UPSERT logic.
- `admin-backoffice`: Back-office portal for administrative authentication, news and schedule CMS, dynamic form configuration, attendee directory management, export generation, and real-time dashboard analytics.

### Modified Capabilities
*(None - Greenfield specification)*

## Impact

- **Frontend**: Next.js / TypeScript / Tailwind CSS v4 implementing design tokens from `DESIGN.md` (Indigo Navy `#111a4a`, Midnight Ink `#011821`, Signal Orange `#ec652b`, Seafoam `#44b48b`, Inter / SuisseIntl type scale).
- **Backend**: Python 3.11+ / FastAPI / SQLAlchemy / Pydantic / Alembic / PyMySQL / openpyxl / pandas.
- **Database**: MySQL 8.x instance (`Forum_2027`) configured with `utf8mb4` charset and `utf8mb4_unicode_ci` collation.
- **Testing**: Playwright test harness verifying all 31 scenarios under `tests/e2e/`.
- **Hosting / Deployment**: Vercel configuration (`vercel.json`) with serverless API routing or edge proxying.
