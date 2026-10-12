# Spec Delta

## Purpose

Delivers interactive Thailand geographic choropleth maps and regional heat map visualizations to identify geographic clusters and dimension-specific risk disparities among the elderly.

## ADDED Requirements

### Requirement: Interactive Thailand Geographic Map
The system SHALL display an interactive geographic map of Thailand rendering all provinces with choropleth color shading corresponding to the risk percentage of the selected health dimension or overall vulnerability.

#### Scenario: Visualizing risk by selected dimension
- **WHEN** user selects a health dimension from the filter
- **THEN** the map colors each province according to a multi-step color scale based on its risk percentage for that dimension

#### Scenario: Province inspection tooltip
- **WHEN** user hovers over or taps a province on the geographic map
- **THEN** the system displays a tooltip showing the province name, Health Service Region, Top 1 risk health dimension, and specific risk percentage

### Requirement: Regional Heat Map Matrix
The system SHALL provide a regional heat map matrix displaying Health Service Regions 1 through 12 along one axis and the 9 health dimensions along the other axis.

#### Scenario: Regional vulnerability comparison
- **WHEN** user views the Regional Heat Map
- **THEN** each cell displays the calculated risk percentage for that region and dimension, shaded using a sequential heat map color gradient

#### Scenario: Cell selection interaction
- **WHEN** user clicks on a heat map cell
- **THEN** the system updates the filter to that specific Health Region and dimension to reveal underlying provincial details
