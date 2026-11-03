# Spec Delta

## Purpose

Delivers an interactive, accessible HTML5 dashboard allowing public health users to filter screening indicators, inspect TOP Rank vulnerabilities, view 2D heatmaps, and explore Thailand choropleth maps.

## ADDED Requirements

### Requirement: Interactive filter toolbar and global state
The system SHALL provide global controls allowing users to switch fiscal years (2567, 2568, 2569), filter by Health Service Zone (Zones 1-13 or All), and select any of the 9 screening domains.

#### Scenario: Switching active screening domain
- **WHEN** the user selects "การเคลื่อนไหวร่างกาย (Mobility & Fall Risk)" from the domain selector
- **THEN** the KPI cards, TOP Rank leaderboard, 2D heatmap sorting, and choropleth map recolor to display mobility risk data immediately

### Requirement: TOP Rank leaderboard display
The system SHALL render sortable ranking tables displaying administrative areas ordered from highest to lowest elderly risk percentage with Top 5, Top 10, or All view limits.

#### Scenario: Inspecting Top 5 highest risk provinces
- **WHEN** the user sets ranking limit to Top 5
- **THEN** the leaderboard displays the 5 provinces with the highest risk percentages, indicating rank number, province name, screened count, and risk percentage bar

### Requirement: 2D Multi-domain risk heatmap
The system SHALL display an interactive 2-dimensional grid showing administrative units across rows and all 9 screening domains across columns with quartile severity coloring.

#### Scenario: Hovering over a heatmap cell
- **WHEN** the user hovers over a heatmap cell for a specific province and domain
- **THEN** a tooltip appears displaying province name, domain title, screened headcount, risk headcount, and exact risk percentage

### Requirement: Interactive Thailand choropleth map
The system SHALL render an SVG or Canvas choropleth map of Thailand shaded according to the selected domain's risk percentage with regional drill-down capabilities.

#### Scenario: Hovering over a province on the map
- **WHEN** the user hovers over a province boundary on the choropleth map
- **THEN** the province highlights and displays a tooltip with provincial rank, total elderly population, screened coverage rate, and domain risk percentage

### Requirement: Live validation loop health widget
The system SHALL display a visual indicator showing the operational state of the 5 pipeline validation loops with link to the validation report.

#### Scenario: Viewing validation health status
- **WHEN** the user navigates to the dashboard header or status panel
- **THEN** five status badges represent the health of Ingestion, Invariants, Rollup, Geo-Join, and Telemetry loops with green, yellow, or red indicators
