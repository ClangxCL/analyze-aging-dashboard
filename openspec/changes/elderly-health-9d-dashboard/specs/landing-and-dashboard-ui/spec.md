# Spec Delta

## Purpose

Provides an executive landing page and responsive health analytics dashboard implementing the Calendly design language and ready for Vercel deployment.

## ADDED Requirements

### Requirement: Calendly-Inspired Landing Page and Header
The system SHALL present an executive landing page adhering to the design specifications in `DESIGN.md`, featuring Ink Navy (`#0b3558`) typography, Signal Blue (`#006bff`) primary action triggers, Cloud (`#f8f9fb`) canvas, Paper (`#ffffff`) cards, and subtle blue-tinted elevation shadows.

#### Scenario: Landing page hero navigation
- **WHEN** user arrives at the root URL
- **THEN** the system displays the hero section with key statistical highlights, executive summary metrics, and a direct CTA button to explore the interactive analytics dashboard

### Requirement: Interactive Health Analytics Dashboard
The system SHALL provide an analytics dashboard workspace incorporating filter controls, dynamic Top 1–9 cards, geographic map views, regional heat maps, and detailed summary tables in a cohesive layout.

#### Scenario: Filter control responsiveness
- **WHEN** user adjusts filter selections in the dashboard toolbar
- **THEN** all dashboard components (rankings, geographic map, heat map, and table) update synchronously to reflect the filtered dataset

### Requirement: Comprehensive Data Table
The system SHALL render a responsive data table presenting province-level screening statistics, 9-dimension risk counts, and percentages with real-time text search, column sorting, and CSV export.

#### Scenario: Search and sorting in data table
- **WHEN** user types a province name or clicks a column header
- **THEN** the table instantly filters matching records or sorts rows in ascending/descending order

#### Scenario: CSV data export
- **WHEN** user clicks the "Export CSV" button
- **THEN** the system downloads the currently filtered tabular dataset as a UTF-8 encoded CSV file

### Requirement: Vercel Deployment Compatibility
The application SHALL be configured for zero-configuration or standard deployment on Vercel with optimized static generation and fast serverless execution.

#### Scenario: Production build for Vercel
- **WHEN** the deployment build command executes on Vercel
- **THEN** the build succeeds without error and serves optimized assets with minimal bundle sizes
