# Spec Delta

## Purpose

Provides a persistent PostgreSQL relational data model and storage layer for MOPH HDC 9-domain elderly screening metrics, geographic entities, and pipeline validation anomaly audit records.

## ADDED Requirements

### Requirement: Persist geographic administrative hierarchy
The system SHALL store and relate official administrative divisions for Thailand's healthcare system, including 13 Health Service Zones and 77 provinces with 2-digit Ministry of Interior codes.

#### Scenario: Storing provincial metadata
- **WHEN** the administrative hierarchy seed executes
- **THEN** 77 unique province records are inserted with valid 2-digit codes, official Thai names, and corresponding Health Service Zone identifiers (01 to 13)

### Requirement: Store 9-domain elderly screening metrics
The system SHALL persist screening metrics across all 9 geriatric domains for fiscal years 2567, 2568, and 2569 at both health zone and provincial levels.

#### Scenario: Inserting multi-year screening records
- **WHEN** screening datasets for fiscal years 2567, 2568, or 2569 are ingested
- **THEN** the system stores target population, total 9-domain screened counts, domain-specific screened counts, normal counts, risk counts, and risk percentages for each administrative unit

### Requirement: Record validation anomalies in audit log
The system SHALL record any validation failures or data inconsistencies identified during pipeline execution into an immutable audit table.

#### Scenario: Logging a mathematical invariant violation
- **WHEN** the validation engine detects a record where screened count exceeds target population or normal plus risk does not equal screened
- **THEN** the system logs an audit entry specifying timestamp, fiscal year, province code, rule identifier, violation details, and resolution action
