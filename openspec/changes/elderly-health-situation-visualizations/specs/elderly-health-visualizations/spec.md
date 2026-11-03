# Spec Delta: elderly-health-visualizations

## Purpose

Provides a responsive, interactive visual analytics dashboard to examine and compare 5-year epidemiological trends (2565–2569) of Thailand's elderly population across demographics, 9-domain health screening, chronic diseases, morbidity, mortality, and disability burden.

## ADDED Requirements

### Requirement: Interactive Demographics and Aging Structure Visualizer
The system SHALL render interactive charts representing Thailand's elderly demographic trajectory (2565–2569) based on Thailand Population Meter data, including a 3-tier age bracket breakdown (60–69, 70–79, 80+) and dual-axis trend lines for Aging Index and Old-Age Dependency Ratio.

#### Scenario: Visualizing 5-year demographic shifts
- **WHEN** user selects the Demographics analytics view
- **THEN** system renders age distribution bar charts and dual-axis trend lines showing the Aging Index rise alongside dependency ratios

---

### Requirement: 9-Domain Health Screening Prevalence Comparison
The system SHALL provide interactive comparative radar and multi-year bar charts displaying abnormal risk prevalence percentages alongside screening coverage for all 9 health dimensions from HDC and DMS records.

#### Scenario: Comparing health screening prevalence across years
- **WHEN** user inspects the 9-domain screening comparison view
- **THEN** system renders radar charts comparing 2565–2569 risk prevalence across all 9 domains with interactive tooltips showing exact rates and case counts

#### Scenario: Domain-specific drilldown
- **WHEN** user filters by a specific screening domain (such as Cognitive, Vision, or Mobility)
- **THEN** system isolates the selected domain's 5-year coverage vs risk prevalence comparison

---

### Requirement: Functional Ability (ADL) and Geriatric Syndromes Distribution
The system SHALL display stacked proportional visualizations of Barthel ADL classifications (Social-bound, Home-bound, Bed-bound) across 2565–2569 alongside prevalence comparison bars for key Geriatric Syndromes.

#### Scenario: Examining functional independence trends
- **WHEN** user navigates to the Functional Ability section
- **THEN** system displays the stacked proportion of Social-bound (96.5–97.1%), Home-bound (2.3–2.8%), and Bed-bound (0.5–0.7%) elderly with corresponding patient population estimates

---

### Requirement: Chronic Diseases (NCDs) Comparative Visualizer
The system SHALL render comparative multi-condition bar and distribution charts detailing prevalence percentages and estimated patient volumes for Hypertension, Type 2 Diabetes, Chronic Kidney Disease, Stroke, and Ischemic Heart Disease.

#### Scenario: Comparing NCD prevalence across conditions
- **WHEN** user accesses the Chronic Diseases tab
- **THEN** system displays ranked condition bars with prevalence percentages and active patient headcounts

---

### Requirement: Morbidity and Mortality Comparison with Data Integrity Guards
The system SHALL render comparative ranking charts for Top 10 outpatient (OPD) morbidities, Top 10 inpatient (IPD) morbidities, and Top 10 causes of death for years 2565–2567, while strictly rendering years 2568 and 2569 as unreleased status markers without any numerical estimation or interpolation.

#### Scenario: Viewing morbidity and mortality rates for reported years
- **WHEN** user toggles OPD, IPD, or Mortality views for years 2565, 2566, or 2567
- **THEN** system displays rates per 100,000 population with ICD-10 disease group labels and rankings

#### Scenario: Handling unreleased data years (2568 and 2569)
- **WHEN** user views the 5-year timeline for morbidity or mortality
- **THEN** system explicitly displays "ยังไม่มีรายงานทางการ (เว้นว่าง)" badges for 2568 and 2569 without generating synthetic or projected data points

---

### Requirement: Burden of Disease (DALYs) Gender and Disability Breakdown
The system SHALL render gender-disaggregated comparisons of leading DALY causes and a proportional breakdown chart contrasting Years Lived with Disability (YLD) against Years of Life Lost (YLL).

#### Scenario: Comparing male and female burden of disease
- **WHEN** user navigates to the Burden of Disease section
- **THEN** system displays paired comparison bars showing top DALY causes for males versus females alongside YLD-to-DALY disability ratios

---

### Requirement: Interactive Dataset Explorer and CSV Export
The system SHALL provide an interactive search and tabular explorer accompanied by one-click CSV download actions linking directly to verified UTF-8 with BOM dataset files.

#### Scenario: Downloading domain-specific or consolidated CSVs
- **WHEN** user clicks the CSV download button for any dataset
- **THEN** system triggers download of the corresponding UTF-8 BOM-encoded CSV file
