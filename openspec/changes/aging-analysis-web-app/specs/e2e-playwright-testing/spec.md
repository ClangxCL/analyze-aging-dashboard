# Spec Delta

## Purpose

Automates end-to-end browser testing using Playwright to verify core user journeys, data filter transitions, interactive map and heatmap rendering, and API validation loop contracts.

## ADDED Requirements

### Requirement: Test dashboard initial mount and KPI hydration
The test suite SHALL verify that the application loads without console errors and hydrates KPI overview cards from API responses.

#### Scenario: Dashboard boot smoke test
- **WHEN** Playwright launches the browser and navigates to the dashboard URL
- **THEN** all KPI cards display numeric values without NaN or undefined text and the page title matches expectations

### Requirement: Test dynamic filter switching and data synchronization
The test suite SHALL verify that switching fiscal years or screening domains updates all dashboard components synchronously.

#### Scenario: Switching domain updates leaderboard and map
- **WHEN** Playwright selects domain `d5_cognition` from the dropdown
- **THEN** the ranking table header displays Cognition, the top rank items update, and choropleth polygon fill styles change

### Requirement: Test validation loop status endpoint and UI badge reflection
The test suite SHALL verify that the validation health endpoint returns expected loop statuses and the UI renders corresponding status badges.

#### Scenario: Validation loop status verification
- **WHEN** Playwright queries the backend validation endpoint and verifies UI badges
- **THEN** all 5 validation loops display verified status badges with valid timestamp metadata
