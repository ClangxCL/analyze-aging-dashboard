# Spec Delta

## Purpose

Enforces five closed-loop validation guardrails across ingestion, transformation arithmetic, hierarchical rollups, geo-spatial topology, and runtime serving to eliminate silent data corruption.

## ADDED Requirements

### Requirement: Validate ingestion schema contracts
The system SHALL verify the existence of all mandatory source sheets, column header checksums, and expected entity counts before processing raw spreadsheet data.

#### Scenario: Ingestion sheet verification passes
- **WHEN** the ingestion validator inspects the MOPH HDC workbook
- **THEN** it confirms all 6 data sheets exist for years 2567-2569 with exactly 13 health zones, 77 provinces, and domain offsets at columns 5 and 7

### Requirement: Enforce transformation arithmetic invariants
The system SHALL evaluate physical bounds on every screening record, ensuring screened counts do not exceed target populations and sum invariants hold.

#### Scenario: Automated handling of headcount invariant
- **WHEN** an extracted record shows normal count plus risk count differing from screened count
- **THEN** the system logs the discrepancy to the audit store, recalculates the verified risk percentage, and marks the record with a validation warning flag

### Requirement: Reconcile hierarchical administrative rollups
The system SHALL verify that the bottom-up sum of provincial elderly headcounts matches Health Service Zone totals and that all 13 zones sum to the national total.

#### Scenario: Provincial rollups match zone totals
- **WHEN** the hierarchical rollup validator computes sums across provinces in Health Zone 01
- **THEN** the computed sum matches the recorded Health Zone 01 total within a 0.1% tolerance margin

### Requirement: Guarantee 100% geo-spatial topological joins
The system SHALL verify that all 77 province records resolve to a valid polygon in the Thailand GeoJSON boundary definition without orphaned or missing areas.

#### Scenario: All provinces map to GeoJSON boundaries
- **WHEN** the geo-join validator links database records with GeoJSON features
- **THEN** exactly 77 of 77 provinces achieve a confirmed join on their 2-digit Ministry of Interior code with zero unmatched keys

### Requirement: Expose pipeline validation telemetry
The system SHALL expose an endpoint detailing the pass, warning, or failure status of all 5 validation loops along with recent anomaly entries.

#### Scenario: Client checks validation health
- **WHEN** a client or monitoring tool queries GET `/api/aging/validation-health`
- **THEN** the system returns health status objects for all five validation loops and the total count of quarantined anomalies
