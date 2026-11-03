# Spec Delta

## Purpose

Provides a reliable analytical engine to ingest, validate, and process 9-domain elderly health screening records from Excel datasets, computing coverage rates, risk ratios, and dynamic multi-criteria rankings across administrative levels.

## ADDED Requirements

### Requirement: Ingestion and Normalization of Multi-Year 9-Domain Datasets
The system SHALL ingest multi-year elderly screening data from `Analyze Aging/hdc_elderly_screening_9domains.xlsx` across fiscal years 2567, 2568, and 2569 for both Health Zones (1–13) and Provinces (77 provinces), extracting all 9 health screening domains.

#### Scenario: Successful ingestion of latest and historical sheets
- **WHEN** the engine loads the source Excel workbook
- **THEN** it parses target population, total screened, normal counts, and risk counts for years 2567, 2568, and 2569 without data loss

### Requirement: Calculation of Screening Coverage and Domain Risk Percentages
The system SHALL compute screening coverage percentage against target population and risk percentage per domain as `(risk_count / screened_count) * 100` for each administrative unit and fiscal year.

#### Scenario: Valid risk percentage computation
- **WHEN** an administrative unit has 10,000 screened individuals and 1,500 identified with risk in Visual screening
- **THEN** the system calculates the risk percentage as exactly 15.00% and marks coverage relative to target elderly

#### Scenario: Division by zero protection
- **WHEN** an administrative unit has 0 screened elderly recorded for a domain
- **THEN** the system returns a safe 0.00% risk percentage and flags the record with a zero-volume indicator

### Requirement: Dynamic TOP Rank Generation by Health Domain
The system SHALL generate sorted rankings of provinces or health zones by risk percentage in descending order for any selected health domain, supporting Top 5, Top 10, and complete rank views.

#### Scenario: Query Top 10 provinces for depression risk
- **WHEN** a user or client queries the top 10 provinces for depression (2Q) risk in fiscal year 2569
- **THEN** the system returns the 10 provinces with the highest depression risk percentages sorted from highest to lowest with their rank indices (1 to 10)

#### Scenario: Tie-breaking in rankings
- **WHEN** two provinces share identical risk percentages in a domain
- **THEN** the system breaks ties deterministically using total risk headcount followed by Thai alphabetical name order
