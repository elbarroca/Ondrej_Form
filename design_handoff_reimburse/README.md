# Handoff — Reimburse (Landing · Login · Dashboard)

## Overview

Reimburse is a reimbursement tool for Nordic public sector workers. The product replaces paper forms, spreadsheets, and enterprise expense software with a simple workflow: **create a report → drop receipts → submit for approval → download PDF**.

This bundle contains everything a developer needs to recreate the design in a production codebase: the HTML prototype as a visual reference, the design system, data models, validation rules, state machines, API contracts, accessibility requirements, and acceptance criteria for every flow.

## About the design files

The HTML files in this bundle are **design references**, not production code. They demonstrate the intended look, layout, copy, interactions, and information architecture. Your job is to **recreate these designs in your target codebase** (likely React + Tailwind or whatever stack is already established) using the existing component library and patterns. Do **not** ship the HTML directly — the markup is single-file, has inline scripts, and is not modularized for production.

If no codebase exists yet, recommended stack: **Next.js (App Router) + Tailwind + shadcn/ui + TanStack Query + Zod + react-hook-form + Supabase** (matches the auth and data residency requirements stated in the brief).

## Fidelity

**High-fidelity.** Final colors, typography, spacing, and copy. Recreate pixel-perfectly using your codebase's components — match colors and spacing exactly; substitute Inter for any equivalent already in your design system.

## Documents in this bundle

| File | Purpose |
|---|---|
| `README.md` | This file. Start here. |
| `GUIDELINES.md` | Section-by-section design rules (tone, layout, components, don'ts). |
| `DESIGN_TOKENS.md` | Color, type, spacing, radius, shadow tokens with hex/px values. |
| `COMPONENTS.md` | Component-by-component spec (states, props, a11y). |
| `DATA_MODEL.md` | Entities, relationships, field-level types, status enums. |
| `VALIDATION.md` | Form validation rules with Zod schemas. |
| `FLOWS.md` | State machines & user flows (auth, new report, approval). |
| `API.md` | Suggested REST/RPC endpoints and request/response shapes. |
| `ACCESSIBILITY.md` | WCAG requirements, keyboard, ARIA, focus management. |
| `ACCEPTANCE.md` | Per-screen acceptance criteria for QA. |
| `Reimburse Prototype v2.html` | The visual reference. Open in a browser. |

Read in order: README → DESIGN_TOKENS → COMPONENTS → DATA_MODEL → VALIDATION → FLOWS → API → ACCESSIBILITY → ACCEPTANCE.

## Screens / views

The product has three top-level surfaces and the dashboard has nine subviews.

### 1. Landing (`/`)

Marketing site. Public, unauthenticated.

Sections in order: **Header → Hero → Problem → How it works → Product showcase → Testimonial → Features → Pricing → FAQ → Final CTA → Footer.**

- **Hero** has 3 layouts (split / centered / stacked). Default: **split** — left text, right tilted product preview, with two floating notification cards (`Receipt added`, `FX automatic`).
- **Problem** has 3 framings (time bars / before-after / paper form). Default: **time bars** — 4 horizontal bars showing before vs after across time-spent, approval, setup, and lost-receipts metrics.
- **Product showcase** replaces the comparison table — a single browser-framed mockup of the dashboard with sidebar + KPIs + a 4-row report list. No vendor name-shaming.
- **Pricing** has 3 cards (Free / Pay as you go featured / Organization). The featured "€2.50 / submitted report" line can be hidden via the `showPerReportPrice` flag — when off, the card leads with "Pay only when you submit" and no number.
- **CTA hierarchy:** Primary `Book a 15-minute demo` (filled brand). Secondary `Try the demo` (ghost) routes to login.

### 2. Login (`/login`)

Split layout — brand-gradient aside (left, ~50%) + form (right). Aside collapses on mobile.

- Aside: logo (top), headline + lede (middle), trust checks + "book a demo" escape hatch (bottom).
- Form: `Welcome back` → email → password → row (remember-me ↔ forgot password) → `Sign in` (primary) → divider → `Email me a magic link` (secondary).
- On submit: button text → `Signing in…` for 400ms → route to dashboard. Real implementation: call Supabase Auth, handle errors inline below the relevant field.
- Magic link: same email field; submit calls `supabase.auth.signInWithOtp({ email })`. Show a toast: `Check your inbox at <email>`.

### 3. Dashboard (`/app`)

Three-zone shell: **sidebar (244px, fixed) + topbar (sticky) + content (max-width 1240px, 28px gutters)**.

- **Sidebar:** logo, org switcher, two nav groups (Workspace: Overview / My reports / Approvals[badge] / Receivables — Organization: Team / Organization / Settings), user chip at bottom.
- **Topbar:** breadcrumb left, search (`⌘K`, 240px+) + notifications (bell with red dot) + help + `New report` primary on the right.
- **Density** has 3 tokens (compact / comfy / spacious) — comfy is the default.

Subviews:

| Route | Purpose | Key elements |
|---|---|---|
| `/app` (Overview) | Mette's home page | Setup callout, 4 KPIs, recent reports, pending approvals, spend-by-category bar chart |
| `/app/reports` (My reports) | Full list | Filter pills (All/Draft/Submitted/Approved/Rejected) + search + currency + date range |
| `/app/reports/:id` (Detail) | Single report | Header with status + total, receipts grid, activity timeline, quick actions |
| `/app/reports/new` (New) | 4-step linear flow | Stepper (Details → Receipts → Categorize → Review) |
| `/app/approvals` | Approver queue | Pending list, click row → side drawer with receipts + approve/reject |
| `/app/receivables` | Finance view | KPIs, all approved reports, bulk export CSV/ZIP |
| `/app/team` | Members | Avatar + name/email + role chip + dept |
| `/app/organization` | Plan/billing/branding | Side nav within page, plan card, billing form, logo upload |
| `/app/settings` | Personal | Profile, identity & IBAN, notifications |

## Key behaviors

### Auto-save (drafts)
- New report flow auto-saves on every field blur.
- Show ambient `Saved · 12s ago` text in the flow header.
- Persist `step`, `title`, `currency`, `dateRange`, `approverId`, `receipts[]` to backend on each change.
- URL keeps the step: `/app/reports/new?step=2&id=<draft-id>`.

### Receipt drop zone (step 2)
- Accepts: drag-and-drop, paste from clipboard, file picker, mobile camera.
- Formats: PNG / JPG / PDF / HEIC, ≤20MB each.
- Upload runs in background — show a per-file progress bar; failed uploads get a retry button.
- After upload, **OCR + categorization** runs server-side (out of scope for v1 — a select drop-down with manual category is fine).

### Approvals drawer
- Right-side drawer, 520px wide, masks the rest of the dashboard.
- Body: submitter chip + receipts grid + comment textarea.
- Footer: `Reject` (ghost) and `Approve` (primary). Reject requires a comment (min 10 chars).
- Both actions show optimistic UI then refetch.

### Navigation
- Routebar at the bottom of the prototype is a **prototype affordance only**. Do not ship it.
- The top nav `Sign in` button → `/login`. Hero `Try the demo` → `/login`.
- Login submit → `/app`. Logo in dashboard sidebar → `/app` (not `/`).

## Currencies

`EUR, USD, CAD, GBP, NOK, SEK, DKK, ISK, CHF, PLN, CZK, HUF, RON, BGN`. Display ISO code in front, narrow space, tabular figures. Locale-aware formatting (Nordic vs Anglo). FX rates: pull daily ECB feed for EUR-pivoted rates; cache 24h. Always show original amount + converted amount on receipt detail.

## Tech notes

- All money values stored as **integer minor units** (cents/öre) plus an ISO 4217 code. Never floats.
- Status enum is closed: `draft | submitted | approved | rejected`. No "in_review" — the moment a report is submitted, it's pending until approved/rejected.
- All timestamps stored as UTC `timestamptz`. Render in user's locale.
- Route guard: `/app/*` requires auth. Redirect unauthenticated users to `/login?next=<original-path>`.

## What's NOT in scope

- Real receipt OCR (manual category select is enough for v1)
- SSO / SAML (Organization tier — flag with "Coming soon")
- Multi-org switching (UI is in place, backend single-org for v1)
- Localization (NO/SV/DK) — copy is in English; structure ready for i18n via a `t()` helper

## Open questions for the team

1. Should **rejected** reports be re-openable as drafts? (Recommend yes — clone to new draft.)
2. Email notification opt-out granularity — per-event or all-or-nothing? (Recommend per-event, see Settings → Notifications.)
3. Receipt retention period — GDPR right-to-erasure interaction with audit trail. (Likely 7 years for public sector accounting; flag receipt images as soft-deletable but keep the metadata.)
4. Per-report fee billing — invoice monthly or charge on submit? (Recommend monthly invoice, matches public sector procurement.)
