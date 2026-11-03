# Spec Delta

## Purpose

Enables visual cross-domain risk exploration through an interactive matrix representation, highlighting multi-dimensional vulnerability patterns across health zones and provinces.

## ADDED Requirements

### Requirement: Cross-Domain Heatmap Matrix Generation
The system SHALL generate an interactive 2D matrix cross-referencing administrative areas (Health Zones 1–13 or Provinces) along one axis and the 9 screening domains along the second axis, populated with risk percentages.

#### Scenario: Rendering health zone risk matrix
- **WHEN** the user selects the Health Zone aggregation view for fiscal year 2569
- **THEN** the system generates a matrix displaying 13 rows (Zones 01–13) and 9 columns (Domains 1–9) populated with risk percentages

### Requirement: Dynamic Color Scaling and Risk Threshold Classification
The system SHALL apply standardized color mapping to matrix cells based on relative or absolute risk intensity, differentiating low, moderate, high, and critical risk tiers.

#### Scenario: Visual distinction of critical risk cells
- **WHEN** a domain risk percentage exceeds the upper threshold tier for that health issue
- **THEN** the corresponding cell is rendered with high-contrast alert styling indicating elevated vulnerability

### Requirement: Interactive Matrix Sorting and Cell Inspection
The system SHALL allow users to sort matrix rows by any specific domain column or by aggregate risk average, and inspect individual cells to reveal underlying counts.

#### Scenario: Sorting matrix by oral health risk
- **WHEN** a user clicks the column header for Domain 8 (Oral Health)
- **THEN** the matrix rows reorder immediately from highest to lowest oral health risk percentage

#### Scenario: Cell tooltip inspection
- **WHEN** a user hovers or taps on a matrix cell
- **THEN** a tooltip displays the administrative unit name, domain label, exact risk percentage, risk headcount, and total screened count
