\
---
version: alpha
name: Lokers.biz.id Design System
description: >
  A premium, modern, AI-first job portal design system for Lokers.biz.id.
  The interface must feel fast, trustworthy, intelligent, polished, and
  significantly less complicated than traditional job portals.

colors:
  ink: "#0B1020"
  ink-soft: "#182238"
  primary: "#6D5EF5"
  primary-hover: "#5848E8"
  primary-soft: "#EEECFF"
  secondary: "#14B8A6"
  secondary-soft: "#DDF8F4"
  accent: "#F4B740"
  accent-soft: "#FFF3D6"
  background: "#F7F8FC"
  surface: "#FFFFFF"
  surface-muted: "#F0F2F7"
  border: "#E2E6EF"
  text: "#111827"
  text-muted: "#667085"
  text-subtle: "#98A2B3"
  success: "#12B76A"
  warning: "#F79009"
  error: "#F04438"
  info: "#2E90FA"
  on-primary: "#FFFFFF"

typography:
  fontFamily: "Plus Jakarta Sans"
  display:
    fontFamily: "Plus Jakarta Sans"
    fontSize: "clamp(2.5rem, 6vw, 5.5rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.04em"
  h1:
    fontSize: "clamp(2rem, 4vw, 3.75rem)"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.03em"
  h2:
    fontSize: "clamp(1.75rem, 3vw, 2.75rem)"
    fontWeight: 750
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  h3:
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  small:
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.45
  label:
    fontSize: "0.8125rem"
    fontWeight: 650
    lineHeight: 1.3
    letterSpacing: "0.01em"

rounded:
  xs: "6px"
  sm: "10px"
  md: "14px"
  lg: "20px"
  xl: "28px"
  pill: "999px"

spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "72px"
  4xl: "96px"

layout:
  maxWidth: "1280px"
  contentWidth: "1120px"
  gridGap: "24px"
  sectionGap: "96px"
  mobilePadding: "20px"
  desktopPadding: "32px"

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: "12px 18px"
    fontWeight: 700
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    borderColor: "{colors.border}"
    rounded: "{rounded.md}"
    padding: "12px 18px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    borderColor: "{colors.border}"
    rounded: "{rounded.lg}"
    padding: "24px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    borderColor: "{colors.border}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
  badge:
    rounded: "{rounded.pill}"
    padding: "6px 10px"

elevation:
  none: "none"
  subtle: "0 1px 2px rgba(16,24,40,0.04)"
  card: "0 8px 30px rgba(16,24,40,0.06)"
  floating: "0 18px 50px rgba(16,24,40,0.12)"
  glow: "0 0 0 4px rgba(109,94,245,0.12)"
---

# Overview

Lokers.biz.id is an AI-first job portal built around the promise **“Temukan Lowongan, Buat Lamaran dalam Hitungan Detik.”** The visual language must communicate three things immediately:

1. **Trust** — job information and employer identity must look credible.
2. **Speed** — searching, saving, and generating a cover letter must feel effortless.
3. **Intelligence** — AI features should feel premium and helpful, never gimmicky.

The visual direction is **premium SaaS + editorial job discovery**: spacious layouts, strong typography, restrained gradients, soft surfaces, crisp cards, subtle glass effects only where useful, and purposeful micro-interactions.

The UI must not resemble a generic job-board template. Avoid visual clutter, excessive cards, excessive pills, noisy gradients, and over-decoration.

## Colors

- **Ink** `{colors.ink}`: primary navigation, headings, dark hero sections.
- **Primary** `{colors.primary}`: primary CTA, active states, AI actions, links that need emphasis.
- **Secondary** `{colors.secondary}`: positive supporting accent, verified states, selected filters, success-adjacent UI.
- **Accent** `{colors.accent}`: premium/subscription emphasis and limited highlights.
- **Background** `{colors.background}`: global page background.
- **Surface** `{colors.surface}`: cards, panels, inputs.
- **Text** `{colors.text}`: primary content.
- **Text muted** `{colors.text-muted}`: metadata and secondary copy.
- **Semantic colors**: success, warning, error, and info are reserved for their semantic meanings.

Do not introduce arbitrary colors. If a new color is necessary, add it to the token schema first.

## Typography

Use **Plus Jakarta Sans** consistently. Do not mix multiple display fonts.

- Display: landing-page hero only.
- H1/H2: page hierarchy.
- H3: cards and section titles.
- Body: descriptions and long-form job content.
- Small/label: metadata, filters, table headings, helper text.

Use font weight and spacing to establish hierarchy rather than decorative typography.

## Layout

Use a responsive 12-column mental grid on desktop.

- Maximum content width: `{layout.maxWidth}`.
- Primary content width: `{layout.contentWidth}`.
- Desktop horizontal padding: `{layout.desktopPadding}`.
- Mobile horizontal padding: `{layout.mobilePadding}`.
- Standard component gap: `{layout.gridGap}`.
- Major section spacing: `{layout.sectionGap}`.
- Breakpoints: mobile-first with `sm 640px`, `md 768px`, `lg 1024px`, `xl 1280px`.

Job listing pages should prioritize information density without becoming cramped. Detail pages should use a two-column desktop layout: main job content + sticky action/sidebar.

## Elevation & Depth

Prefer borders and surface contrast over heavy shadows.

- Flat sections: `{elevation.none}`.
- Cards: `{elevation.card}`.
- Dropdowns/modals: `{elevation.floating}`.
- Focus ring: `{elevation.glow}`.

Glassmorphism is permitted only for the landing hero, floating navigation, and selected AI surfaces. It must never reduce text contrast or readability.

## Shapes

Use the rounded scale consistently:

- Inputs/buttons: `md`.
- Cards/panels: `lg`.
- Large hero containers: `xl`.
- Tags/status chips: `pill`.

Do not combine sharp corners with highly rounded components within the same visual group.

## Components

### Navbar

Desktop navbar is compact and premium. Logo left, primary navigation center/left, language toggle and auth/user controls right. Keep one dominant CTA.

### Hero Search

The homepage hero must make search the dominant action. Use a large search field with keyword + location controls and a primary search CTA. Include a short supporting sentence, not a wall of copy.

### JobCard

A JobCard must surface, in order:

1. Job title.
2. Company and logo.
3. Location and employment type.
4. Salary when available.
5. Posted date.
6. Short relevance/skill metadata.
7. Bookmark action.

Keep cards scannable. Avoid displaying every available database field.

### JobFilters

Desktop: persistent sidebar. Mobile: filter drawer/sheet. Filters must be grouped logically and support clear-all.

### AI Cover Letter CTA

Use primary styling with a subtle AI indicator. The CTA should communicate a concrete result: **“Buat Surat Lamaran”**, not vague labels such as “AI Magic”.

### CoverLetterEditor

Large readable editor with document-like presentation. Keep editing controls minimal. Primary actions: Save, Generate Ulang, Copy, Download.

### CVUploader

Drag-and-drop surface with clear PDF restriction, maximum size message, upload progress, parsing state, and review-before-save flow.

### Pricing

Free vs Premium vs Employer plans must be easy to compare. Highlight the recommended plan without using aggressive sales decoration.

### Dashboard Sidebar

Use a stable left navigation on desktop and compact navigation on mobile. Group job-seeker, employer, and admin navigation separately.

### Toast / Feedback

Use concise messages with one action when useful. Never expose raw API/database errors.

## Accessibility

Target WCAG 2.1 AA.

- Keyboard-accessible controls.
- Visible focus states.
- Semantic HTML.
- Labels for all form fields.
- Descriptive error messages.
- Minimum readable contrast.
- Do not rely on color alone to communicate status.
- Provide alt text for meaningful images.

## Motion

Motion should reinforce hierarchy and state changes.

- Hover/focus: 120–180ms.
- Small transitions: 180–240ms.
- Panels/modals: 240–320ms.
- Avoid continuous decorative animation.
- Respect `prefers-reduced-motion`.

## Do's and Don'ts

### Do

- Use token references such as `{colors.primary}`.
- Make the primary action obvious.
- Keep job information scannable.
- Use whitespace generously.
- Make AI functionality feel useful and controlled.
- Maintain consistent states across every page.
- Design mobile-first.

### Don't

- Do not add random gradients.
- Do not use more than one dominant CTA per section.
- Do not overuse glassmorphism.
- Do not use emoji as the primary UI icon.
- Do not hardcode colors outside the design tokens.
- Do not create visually different versions of the same component on different pages.
- Do not sacrifice accessibility for visual effects.
