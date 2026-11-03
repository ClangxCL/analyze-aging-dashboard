# Spec Delta

## Purpose

Delivers the unified, accessible web user interface integrating KPI cards, interactive filters, Top Rank leaderboards, heatmap matrices, geographic visuals, and data export tools.

## ADDED Requirements

### Requirement: Executive Screening KPI Summary Cards
The system SHALL present high-level summary cards displaying total elderly population target, overall screening completion count and percentage, and leading risk domain for the active filter scope.

#### Scenario: Displaying national summary KPI metrics
- **WHEN** the dashboard loads for the latest fiscal year (2569) without geographic filters
- **THEN** it renders KPI cards showing nationwide target elderly, 9-domain completion rate, and the domain with the highest nationwide risk percentage

### Requirement: Interactive Global Filter Controls
The system SHALL provide synchronized filter controls for fiscal year selection (2567, 2568, 2569), administrative area scoping, and domain selection that update all visual components simultaneously.

#### Scenario: Changing fiscal year filter
- **WHEN** the user selects fiscal year 2568 from the year dropdown
- **THEN** all dashboard views (KPIs, Top Rank lists, Heatmap, and Geographic Map) refresh synchronously to display 2568 data

### Requirement: Responsive Multi-View Layout Navigation
The system SHALL enable seamless tabbed or segmented view switching between Top Rank Leaderboard, Heatmap Matrix, Geographic Map, and Granular Data Table.

#### Scenario: Switching active view tab
- **WHEN** the user clicks the "Heatmap" view tab
- **THEN** the dashboard transitions focus to the matrix visualizer while preserving the active year and domain filters

### Requirement: Data Export and Report Generation
The system SHALL provide export actions allowing users to download filtered tabular datasets in CSV/Excel formats or print an executive summary report.

#### Scenario: Exporting active ranking data
- **WHEN** the user triggers the "Export CSV" action from the Top Rank view
- **THEN** the system generates and downloads a clean CSV file containing the currently displayed ranking records
