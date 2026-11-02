# Spec Delta

## Purpose

Provides an accessible, mobile-first, and bilingual (TH/EN) web interface for attendees to register across three distinct tracks (Public, Healthcare Staff, and ASEAN Member States), download accommodation resources, and verify registration status.

## ADDED Requirements

### Requirement: Accessible Header and Theme Branding
The portal SHALL display the official event branding according to the DESIGN.md and specification guidelines, featuring the Thailand Elderly Health Forum 2027 logo prominently at the top center, agency logos below it, and an accessible bilingual language toggle (TH | EN) in the top-right header.

#### Scenario: Switching language preserves form input
- **WHEN** a user fills in input fields on any registration form and clicks the language toggle button (TH | EN)
- **THEN** the interface labels, dropdown options, and validation messages switch immediately between Thai and English without reloading the page or clearing the entered form data

#### Scenario: Adjusting font accessibility sizes
- **WHEN** an elderly user clicks the font resizer controls (A- / A / A+)
- **THEN** the base typography scales smoothly across the portal while maintaining a minimum base size of 18px and button touch targets of at least 52px height

### Requirement: General Public Registration Flow
The portal SHALL provide a streamlined registration form for general public attendees, requiring personal information, multi-level cascaded address selection, occupation categorization, session room selection, and PDPA consent.

#### Scenario: Cascaded address combobox search
- **WHEN** an attendee types a province name in Thai or English into the searchable combobox
- **THEN** matching provinces are filtered in real-time, and selecting a province dynamically populates only the districts belonging to that province, followed by subdistricts and postal codes

#### Scenario: Specifying custom occupation
- **WHEN** an attendee selects the "Other" option in the occupation dropdown
- **THEN** an additional text input appears requiring the user to specify their occupation before form submission can proceed

#### Scenario: Selecting interested session rooms
- **WHEN** an attendee selects one or more session rooms (Academic Session, Medicine/Public Health, Society/Economy/Environment)
- **THEN** the selection is validated to ensure at least one room is selected, and Room 1 clearly indicates that it is an English-language session

### Requirement: Healthcare Staff Registration Flow
The portal SHALL provide a dedicated registration pathway for medical and public health personnel, capturing professional titles, positions, health regions, continuing education credit codes, and accommodation booking downloads.

#### Scenario: Filtering provinces by health region
- **WHEN** a healthcare professional selects Health Region 1 through 12
- **THEN** the province dropdown is filtered strictly to provinces within the selected health region, and changing the health region resets downstream province, district, and subdistrict selections

#### Scenario: Downloading accommodation reservation forms
- **WHEN** a registered healthcare professional clicks the accommodation download button on the form or success screen
- **THEN** the portal provides direct downloads for the hotel reservation documents uploaded by administrators

### Requirement: ASEAN Member States (AMS) Registration Flow
The portal SHALL provide an international attendee registration form that defaults to English, capturing international country origins, dietary preferences, international telephone numbers, and hotel accommodation QR codes.

#### Scenario: Default English language for AMS
- **WHEN** an international attendee accesses the ASEAN Member States registration page
- **THEN** the portal loads with English as the active language while allowing manual switching back to Thai if desired

#### Scenario: Dynamic accommodation booking with QR code fallback
- **WHEN** an attendee views the Accommodation Booking section
- **THEN** official event hotels (e.g. Novotel Bangkok Impact, Ibis Bangkok Impact) are listed with checkbox selections and QR code images, or a "QR Code coming soon" placeholder if no QR image has been uploaded by the admin

#### Scenario: Selecting custom options for dietary and country
- **WHEN** an AMS attendee selects "Other" for Country, Title, Gender, or Dietary Requirements
- **THEN** the corresponding free-text field is rendered and required for submission

### Requirement: Registration Status Verification
The portal SHALL provide a lookup interface allowing attendees to confirm their registration status by entering their first and last name.

#### Scenario: Finding existing registration
- **WHEN** an attendee inputs their first name and last name and clicks Check
- **THEN** the portal displays a green success confirmation indicating attendee category and registration date without disclosing sensitive personal data like phone, email, or street address

#### Scenario: Record not found
- **WHEN** an unregistered name is queried
- **THEN** the portal informs the user that no registration was found and offers direct navigation buttons to the registration forms
