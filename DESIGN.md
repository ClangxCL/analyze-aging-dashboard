---
name: ElderHealth Forum 2026
description: Official design system for The 6th Thailand National Elderly Health Forum 2026
colors:
  primary: "#0f294a"
  primary-hover: "#0a1c33"
  primary-light: "#eff6ff"
  secondary: "#1d4ed8"
  secondary-hover: "#1e40af"
  secondary-light: "#dbeafe"
  accent: "#059669"
  accent-light: "#ecfdf5"
  amber: "#d97706"
  amber-light: "#fffbeb"
  surface: "#ffffff"
  background: "#f8fafc"
  card-bg: "#ffffff"
  text-main: "#0f172a"
  text-muted: "#475569"
  border-color: "#e2e8f0"
  focus-ring: "#2563eb"
typography:
  display:
    fontFamily: "'Prompt', 'Plus Jakarta Sans', sans-serif"
    fontSize: "2.5rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  heading:
    fontFamily: "'Prompt', sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "'Sarabun', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "8px"
  md: "12px"
  lg: "16px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
---

# Design System: ElderHealth Forum 2026

## Overview

ElderHealth Forum 2026 represents the official design system for **The 6th Thailand National Elderly Health Forum 2026** (มหกรรมสุขภาพผู้สูงอายุแห่งชาติครั้งที่ 6) organized by the Somdet Phra Sangkharat Yannasangwon Institute of Geriatric Medicine, Department of Medical Services, Ministry of Public Health. The system follows the Canon Health Conference Portal direction, combining high institutional credibility, crisp clinical clarity, and Universal Accessibility (WCAG 2.1 AA) for senior citizens.

## Colors

- **Primary (`#0f294a`)**: Deep Medical Navy reflecting institutional authority, medical credibility, and deep trust.
- **Secondary (`#1d4ed8`)**: Clinical Cobalt for interactive buttons, primary actions, and focused states.
- **Accent Health (`#059669`)**: Vitality Emerald for positive confirmations, active badges, and health topics.
- **Accent International (`#d97706`)**: Warm Amber for ASEAN delegates, diplomatic forms, and hotel arrangements.
- **Surfaces (`#ffffff` & `#f8fafc`)**: Crisp clinical white cards over an ice slate background, ensuring high visual clarity.
- **Text (`#0f172a` & `#475569`)**: Ultra-high contrast meeting and exceeding WCAG 2.1 AA (4.5:1 for body, 7:1+ on key headings).

## Typography

- **Heading Voice**: `Prompt` (with `Plus Jakarta Sans` for English alphanumeric elements) — geometric, clean, modern, and highly legible.
- **Body & Form Voice**: `Sarabun` — the recognized standard for Thai official, medical, and academic reading.
- **Tabular Numerals**: `font-variant-numeric: tabular-nums` applied globally to ensure dates, times, and statistics align vertically.
- **Accessibility Scaling**: Dynamic root font scales (`font-normal` at 16px, `font-large` at 19px, and `font-xlarge` at 22px).

## Layout

- **Header / Navigation**: Sticky accessibility bar with instant voice assistance indicators, high-contrast toggle, and font resizing tools.
- **Banner Area**: 1920x1080 16:9 responsive display with live preview toggling.
- **Registration Deck**: Three prominent tracks (Public/Elderly, Medical Personnel, and ASEAN) structured with generous separation and clear visual hierarchy.
- **Mobile & Touch First**: All touch targets meet or exceed 48x48px (with 56px+ for elderly primary actions), with full support for safe area insets.

## Elevation & Depth

- **Subtle Elevation**: Defined by `box-shadow: 0 4px 6px -1px rgba(15, 41, 74, 0.07)` with a crisp 1px border (`#e2e8f0`). No hard zero-blur offset shadows.
- **Hover Micro-interactions**: Smooth 2px vertical lift (`translateY(-2px)`) with softened shadow spread on cards and actionable elements.

## Shapes

- Small controls & badges: 8px radius (`rounded-sm`).
- Standard inputs & primary buttons: 12px radius (`rounded-md`).
- Content cards & containers: 16px radius (`rounded-lg`).
- Status pills & voice controls: Pill-shaped (`rounded-full`).

## Components

- **Voice Input Pill**: Interactive Web Speech API microphone toggle with red pulsing active indicator and automatic text insertion.
- **Read Note Synthesizer**: SpeechSynthesis integration providing slower, clear auditory feedback for elderly participants.
- **A4 Schedule Slider**: Vertical aspect ratio (1 : 1.414) viewer supporting touch swipe and fullscreen zoom modal.
- **Cascading Address Selector**: Dependent dropdown system mapping Province > District > Sub-district and Health Regions 1-12.

## Do's and Don'ts

### Do
- Ensure all interactive inputs have visible focus-visible rings (`3px solid #2563eb`).
- Maintain high contrast text (minimum 4.5:1 ratio).
- Use vector SVG icons with consistent 2px stroke weight.
- Provide explicit feedback on Speech-to-Text without recording audio files.

### Don't
- Do not use emoji glyphs in place of official UI icons.
- Do not use gradient text.
- Do not use nested cards or zero-blur hard block shadows.
- Do not hide critical registration requirements behind deep multi-step modals without clear step wayfinding.
