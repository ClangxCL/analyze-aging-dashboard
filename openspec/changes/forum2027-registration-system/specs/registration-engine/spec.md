# Spec Delta

## Purpose

Executes server-side registration ingestion, geographic metadata querying, data validation, and transaction-safe deduplication UPSERT operations against the MySQL database.

## ADDED Requirements

### Requirement: Deterministic Name Normalization and Deduplication
The registration engine SHALL generate a deterministic `name_key` for every submitted registration by trimming whitespace, stripping common honorifics/titles, normalizing Unicode characters via NFC, and converting to lower-case.

#### Scenario: Submitting duplicate registration updates existing record
- **WHEN** an attendee submits a registration with identical normalized first and last name within the same attendee track
- **THEN** the engine performs an atomic database UPSERT (`INSERT ... ON DUPLICATE KEY UPDATE`), updates `updated_at`, overwrites existing fields with the newer submission, logs the modification to `audit_logs`, and responds with a status indicating registration details were updated

#### Scenario: Concurrent duplicate submissions
- **WHEN** two identical registration requests are dispatched concurrently
- **THEN** database-level unique constraints on `name_key` prevent insertion of duplicate rows, resolving without race condition or database corruption

### Requirement: Normalized Address and Metadata Storage
The registration engine SHALL store geographic hierarchy references (Province, District, Subdistrict) as relational database IDs rather than localized string text, ensuring language-independent data integrity and accurate reporting.

#### Scenario: Validating and persisting geographic IDs
- **WHEN** a public or staff registration payload is received with valid subdistrict ID
- **THEN** the engine verifies parent-child integrity between subdistrict, district, and province IDs before committing the transaction

### Requirement: Attendee Registration Endpoints
The registration engine SHALL expose RESTful API endpoints for public, staff, and ASEAN Member States registration with strict payload validation.

#### Scenario: Validating public registration payload
- **WHEN** a public registration payload is received with a 10-digit phone number, valid email, and at least one session room ID
- **THEN** the registration is saved and a unique reference number (Reference No.) is returned in the HTTP 200 response

#### Scenario: Validating ASEAN international phone number
- **WHEN** an ASEAN attendee submits an international telephone number with country code format (e.g. +65 or +66)
- **THEN** the registration engine accepts the international format and assigns selected accommodation options

### Requirement: Privacy-Preserving Registration Verification API
The registration engine SHALL provide a lookup endpoint `/api/check-registration` that validates whether an attendee is registered while protecting personally identifiable information (PII).

#### Scenario: Querying registration status
- **WHEN** a client posts a first name and last name to `/api/check-registration`
- **THEN** the API returns matching registration status, attendee type, and registration timestamp, omitting phone numbers, emails, and address details

#### Scenario: Enforcing rate limiting on status lookups
- **WHEN** an IP address exceeds the maximum threshold of status lookup queries per minute
- **THEN** the API responds with HTTP 429 Too Many Requests to prevent automated enumeration
