# Spec Delta

## Purpose

Provides data ingestion, normalization, filtering, and statistical ranking for the 2026 Thailand 9-Dimension Elderly Health Screening dataset across all 12 Health Service Regions and 76 provinces.

## ADDED Requirements

### Requirement: Ingestion and Normalization of 9-Dimension Health Data
The system SHALL ingest and parse the screening records across all 9 geriatric health dimensions (Vision, Oral Health, Mobility, Activities of Daily Living, Hearing, Cognition, Urinary Incontinence, Nutrition, Depression 2Q) for all 76 provinces and 12 Health Service Regions.

#### Scenario: Parse complete dataset
- **WHEN** the dataset parser processes the 2026 elderly health dataset
- **THEN** the system generates normalized province records containing screening totals, completed 9-dimension counts, and risk counts alongside risk percentages for each of the 9 dimensions

### Requirement: Multi-Dimensional Health Filter
The system SHALL allow users to filter data simultaneously or independently by Health Service Region (เขตสุขภาพ 1–12), individual Province (76 provinces), and specific Health Dimension.

#### Scenario: Filter by Health Region
- **WHEN** user selects a specific Health Service Region
- **THEN** the system filters active calculations, maps, and tables to include only the provinces belonging to the selected region

#### Scenario: Filter by Province
- **WHEN** user selects a single Province
- **THEN** the system returns detailed metrics and rankings specifically for that province

#### Scenario: Filter by Health Dimension
- **WHEN** user selects a specific Health Dimension
- **THEN** the system isolates and visualizes the risk percentage distribution for that dimension across all selected geographic units

### Requirement: Dynamic Top 1 to 9 Risk Ranking
The system SHALL calculate and rank health issues from Top 1 to Top 9 in descending order of risk percentage (`% เสี่ยง/ผิดปกติ`) for any selected geographic scope.

#### Scenario: Provincial issue ranking
- **WHEN** a user inspects a province's health risk profile
- **THEN** the system displays the 9 health dimensions ordered from Rank 1 (highest risk percentage) to Rank 9 (lowest risk percentage)

#### Scenario: Cross-province ranking for a dimension
- **WHEN** a health dimension is selected for ranking
- **THEN** the system ranks provinces in descending order of that dimension's risk percentage
