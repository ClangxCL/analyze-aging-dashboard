# Tasks

## 1. Project Scaffolding and Design System Setup

- [x] 1.1 Scaffold the Next.js frontend directory and configure Tailwind CSS v4 with custom properties from `DESIGN.md` (Indigo Navy `#111a4a`, Midnight Ink `#011821`, Signal Orange `#ec652b`, Seafoam `#44b48b`, 8px radii) and verify styles compile cleanly.
- [x] 1.2 Copy official logo assets from `C:\Users\Piyanut\Desktop\Forum` (`Thailand Elderly Health Forum 2027.png`, `Logo igm.jpg`, `logo DMS.jpg`, `V DMS.png`) into `public/assets/logos/` with standardized filenames and verify image loading.
- [x] 1.3 Implement client-side bilingual i18n context (`locales/th.json` and `locales/en.json`) with persistent localStorage language selection and verify instant switching without state loss.
- [x] 1.4 Implement global elderly accessibility controls (A- / A / A+ font scale multipliers, high-contrast WCAG AA checks, minimum 52px button heights) and verify responsive viewports.

## 2. Database Schema, Models, and Seed Data

- [x] 2.1 Set up SQLAlchemy 2.0 models and Alembic migrations for MySQL database `Forum_2027` (`public_registrations`, `staff_registrations`, `ams_registrations`, `occupations`, `health_regions`, `provinces`, `districts`, `subdistricts`, `sessions_rooms`, `registration_rooms`, `ams_countries`, `accommodation_options`, `ams_registration_accommodations`, `site_settings`, `news_slides`, `schedule_files`, `booking_documents`, `form_fields`, `admin_users`, `audit_logs`) and verify schema migration executes successfully.
- [x] 2.2 Create seed script `seed_forum2027.py` to populate initial health regions (1-12), 77 provinces, districts, subdistricts, 11 occupations, 3 session rooms, 10 ASEAN countries, seed hotels (Novotel, Ibis), and default admin credentials (`Admin@info` with bcrypt hash and `must_change_password=True`) and verify database record counts.
- [x] 2.3 Add unique index on `(name_key)` for each registration table and verify database constraint rejection on raw duplicate key insertion.

## 3. Back-End Registration Engine & API Services

- [x] 3.1 Implement normalization service (`unicodedata.normalize('NFC')`, title removal, whitespace trimming, lowercasing) and verify deterministic `name_key` generation unit tests.
- [x] 3.2 Implement atomic UPSERT registration endpoints (`/api/register/public`, `/api/register/staff`, `/api/register/ams`) with transactional logging to `audit_logs` and verify that submitting duplicate registrations updates existing records without duplicate rows.
- [x] 3.3 Implement metadata endpoints (`/api/meta/regions`, `/api/meta/provinces`, `/api/meta/districts`, `/api/meta/subdistricts`, `/api/meta/rooms`, `/api/meta/ams-countries`, `/api/ams/accommodations`) and verify parent-child cascading responses.
- [x] 3.4 Implement privacy-preserving registration verification endpoint `/api/check-registration` with IP rate limiting and verify that attendee status is returned without leaking phone, email, or street address.

## 4. Front-End Public Portal & Multi-Track Forms

- [x] 4.1 Build Hero section, News Carousel (supporting image/video with auto-slide pause), Schedule Board (PDF/Image/Table tabs), and 5 primary navigation buttons according to `DESIGN.md` and verify desktop/tablet/mobile layouts.
- [x] 4.2 Build Public Registration Form with cascaded search combobox for Province/District/Subdistrict, dynamic "Other" occupation text input, multi-room checkboxes, and PDPA consent and verify client-side validation.
- [x] 4.3 Build Healthcare Staff Registration Form with Health Region filtering, academic titles, CME/CNE credit code, hotel reservation document download card, and verify province filtering.
- [x] 4.4 Build ASEAN Member States Registration Form with default English language, country radio buttons, dietary preferences, international phone validation, and accommodation QR code cards (with "QR Code coming soon" fallback) and verify submission.
- [x] 4.5 Build Registration Status Verification page with first/last name lookup and verify matching success/failure UI feedback.

## 5. Administrative Back-Office and Analytics Dashboard

- [x] 5.1 Implement Admin Authentication with password change enforcement, lockout after 5 failed attempts, session management, and CSRF protection and verify security tests.
- [x] 5.2 Build News Carousel & Schedule Board CMS allowing admin to upload media, reorder items, and update schedule files with instant frontend reflection.
- [x] 5.3 Build Attendee Directory with tabbed views (Public, Staff, AMS), search, multi-filters, pagination, manual creation, and soft-delete confirmation and verify record state updates.
- [x] 5.4 Build Dynamic Form Manager and ASEAN Accommodation Manager (uploading/replacing hotel QR codes, adding dynamic JSON fields, updating theme text) and verify immediate propagation to public forms.
- [x] 5.5 Implement Export Service generating CSV with UTF-8 BOM and Excel (.xlsx) files with audit logging and verify Thai character integrity in Microsoft Excel.
- [x] 5.6 Build Real-time Analytics Dashboard with summary metric cards and Chart.js visualizations (daily registration trends, staff positions, public occupations, ASEAN country & dietary distribution) and verify reactive filtering.

## 6. Playwright E2E Test Suite and Deployment Packaging

- [x] 6.1 Create Playwright end-to-end test suite under `tests/e2e/` implementing all 31 test scenarios from specification section 7 and verify 100% pass rate across Chromium, Firefox, and WebKit.
- [x] 6.2 Configure Vercel deployment manifests (`vercel.json`) and docker-compose orchestration (`docker-compose.yml`) for local and cloud environments and verify build and run scripts.
- [x] 6.3 Write comprehensive `README.md` covering architecture, installation, environment configuration, database setup (`Forum_2027`), test execution, and administration manual and verify accuracy.

## Workflow follow-up

- Review planning artifacts with the user.
- Execute `/opsx-apply` to begin implementation.
