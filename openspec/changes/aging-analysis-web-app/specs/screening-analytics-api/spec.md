# Spec Delta

## Purpose

Exposes asynchronous REST API endpoints for querying multi-year elderly screening indicators, dynamic ranking leaderboards, cross-domain heatmap matrices, and geographic choropleth payloads.

## ADDED Requirements

### Requirement: Query national and regional KPI summaries
The system SHALL provide an API endpoint returning high-level summary KPIs for a selected fiscal year, including total elderly population, 9-domain screening coverage percentage, and top vulnerability domain.

#### Scenario: Fetching summary KPIs for fiscal year 2569
- **WHEN** a client issues GET `/api/aging/summary?year=2569`
- **THEN** the API returns total target population, overall screening coverage rate, and national risk percentages across all 9 domains with HTTP status 200

### Requirement: Generate dynamic TOP Rank risk leaderboards
The system SHALL provide an API endpoint returning provinces or health zones ranked by elderly risk percentage for any specified domain and fiscal year, supporting configurable limits.

#### Scenario: Requesting Top 10 provinces for visual impairment
- **WHEN** a client requests GET `/api/aging/rankings?year=2569&domain=d1_visual&level=province&limit=10`
- **THEN** the API returns an ordered array of the 10 provinces with highest visual risk percentages, including province code, province name, screened count, and risk percentage

### Requirement: Serve 2D domain risk heatmap matrix
The system SHALL deliver an endpoint providing a comprehensive matrix of administrative units cross-referenced with all 9 screening domains, categorized by risk severity tiers.

#### Scenario: Requesting complete provincial heatmap matrix
- **WHEN** a client requests GET `/api/aging/heatmap?year=2569&level=province`
- **THEN** the API returns rows for all 77 provinces with computed risk percentages, screened totals, and quartile-based severity classifications across all 9 domains

### Requirement: Stream geographic choropleth feature collections
The system SHALL provide GeoJSON feature collections augmented with active domain screening metrics for interactive map rendering.

#### Scenario: Fetching choropleth data for depression screening
- **WHEN** a client requests GET `/api/aging/geojson?year=2569&domain=d6_depression`
- **THEN** the API returns valid GeoJSON polygons where each province feature includes `risk_pct`, `screened`, `target_pop`, and ranking rank in its properties
