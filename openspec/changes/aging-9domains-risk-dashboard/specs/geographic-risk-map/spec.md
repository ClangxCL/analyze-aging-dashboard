# Spec Delta

## Purpose

Provides interactive geospatial visualizations of Thailand elderly health screening risk indicators, illuminating provincial and regional disparities across the 9 screening domains.

## ADDED Requirements

### Requirement: Interactive Thailand Choropleth Map Visualization
The system SHALL render an interactive choropleth map of Thailand displaying geographic areas shaded according to elderly screening risk percentages for the selected health domain and fiscal year.

#### Scenario: Visualizing geographic risk for mobility domain
- **WHEN** the user selects Domain 7 (Mobility) and fiscal year 2569
- **THEN** the map renders all provincial polygons colored according to their respective mobility risk percentages using a standardized choropleth color scale

### Requirement: Administrative Boundary Layer Switching
The system SHALL provide seamless switching between Health Zone boundaries (13 regions) and Province boundaries (77 provinces).

#### Scenario: Switching from provincial to regional view
- **WHEN** the user toggles the map administrative boundary selector from Provinces to Health Zones
- **THEN** the map re-aggregates boundaries into 13 Health Zones with zone-level risk coloration and tooltips

### Requirement: Contextual Geographic Tooltips and Map Legend
The system SHALL display an interactive legend explaining color thresholds and present contextual details upon hovering or clicking any geographic polygon.

#### Scenario: Inspecting provincial details on map hover
- **WHEN** a user hovers over a province polygon on the map
- **THEN** the system displays a tooltip showing province name, health zone number, selected domain risk percentage, provincial rank, and screened population
