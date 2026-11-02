# Spec Delta

## Purpose

Empowers system administrators to manage registrations, configure dynamic forms and CMS assets, export verified attendee lists, and monitor real-time operational analytics through a secure administrative back-office.

## ADDED Requirements

### Requirement: Administrative Authentication and Security Controls
The back-office SHALL enforce secure administrative authentication using hashed credentials (bcrypt or Argon2), mandatory password change upon initial login, session expiration, and automatic account lockout after consecutive failed attempts.

#### Scenario: Seed account initial login requires password change
- **WHEN** an administrator logs in for the first time using the seed credentials
- **THEN** the system forces a password reset dialog before permitting access to administrative dashboards or management tools

#### Scenario: Lockout after repeated failed attempts
- **WHEN** five consecutive invalid login attempts are made against an administrative account
- **THEN** the system locks the account for a designated cooldown period and logs the event in security audit logs

### Requirement: Attendee Directory Management
The back-office SHALL provide segmented directory tables for Public, Healthcare Staff, and ASEAN Member States attendees with search, multi-criteria filtering, pagination, manual creation, and soft-delete capabilities.

#### Scenario: Soft-deleting an attendee with confirmation
- **WHEN** an administrator deletes an attendee record after confirming the prompt
- **THEN** the system performs a soft-delete by updating `deleted_at`, removes the attendee from active counts, and records an entry in `audit_logs`

#### Scenario: Filtering attendees by specific attributes
- **WHEN** an administrator filters the ASEAN directory by dietary preference or country
- **THEN** the directory table updates dynamically to display only matching participants

### Requirement: Dynamic Content and Form Schema CMS
The back-office SHALL provide CMS interfaces for managing news carousel slides (images/videos), schedule board files (PDF, image, CSV), session rooms, dynamic form field definitions, and ASEAN hotel accommodation QR codes.

#### Scenario: Uploading hotel QR code for ASEAN accommodations
- **WHEN** an administrator uploads a new QR code image for a hotel option in the ASEAN accommodation manager
- **THEN** the QR image is immediately reflected on the public registration portal without code changes or service restarts

#### Scenario: Adding dynamic form fields
- **WHEN** an administrator adds a custom text or dropdown field to a registration form
- **THEN** the field is presented on the public form and attendee responses are stored within an extra attributes JSON column

### Requirement: Data Export in CSV and Excel Formats
The back-office SHALL allow administrators to export attendee datasets to CSV (encoded in UTF-8 with BOM for Thai language compatibility in Microsoft Excel) and Excel (.xlsx) formats according to active filters.

#### Scenario: Exporting attendee list with UTF-8 BOM
- **WHEN** an administrator exports public attendee records to CSV
- **THEN** the downloaded CSV file includes the UTF-8 Byte Order Mark (BOM) so that Thai characters render accurately in Excel, and the export action is recorded in `audit_logs`

### Requirement: Real-Time Operational Analytics Dashboard
The back-office SHALL render interactive real-time summary cards and charts visualizing total registrations, daily trends, staff medical positions, public occupations, and ASEAN country/dietary breakdowns.

#### Scenario: Real-time dashboard filtering
- **WHEN** an administrator applies a date range filter on the dashboard
- **THEN** summary metrics and Chart.js visualizations reload via API to present aggregated figures for the selected period
