# Reimburse — Personas & Conversion Strategy

## Overview

Reimburse is a reimbursement tool for Nordic public sector workers. The product replaces paper forms, spreadsheets, and enterprise expense software with a simple workflow: create a report → drop receipts → submit for approval → download PDF.

The landing page must convert **decision-makers** (who buy the tool) while also resonating with **end users** (who advocate for it internally). Every section, CTA, and design choice should address a specific persona's objection or desire.

---

## Personas

### 1. The Decision Maker — Primary Conversion Target

**Who:** Finance director, department head, municipal IT buyer, procurement officer.
**Organization:** Kommuner, fylkeskommuner, government agencies (Norway/Sweden/Denmark/Finland).

| Need | Why it matters |
|------|---------------|
| Predictable cost | Public sector budgets are fixed annually. Per-user monthly SaaS fees are a non-starter. Per-transaction pricing (€2.50/report) aligns with actual usage. |
| Compliance | GDPR, EU data residency, and local public sector procurement rules are mandatory. Must demonstrate data never leaves the EU. |
| Fast adoption | No budget for training programs or months-long rollouts. The tool must work like email — zero training. |
| Social proof | Public sector buyers are risk-averse. They need to see that other municipalities/agencies already use it. |
| Approval workflow | Must fit existing org hierarchy: submitter → approver → finance/receiver. Not a flat, everyone-sees-everything model. |
| ROI story | Needs to justify the switch: "We used to spend X hours and €Y per report. Now it's minutes and €2.50." |

**Landing page hooks for this persona:**
- Hero headline: "Reimbursements, finally simple" — signals immediate problem resolution
- Social proof bar: logos/names of municipalities
- Comparison table: Reimburse vs. SAP Concur (hard numbers: 5 min vs. 3 months setup)
- Pricing: pay-per-use, no monthly fees, no contracts
- Trust badges: GDPR, EU hosting, no credit card
- Testimonial from another municipality's finance director
- FAQ answering procurement/compliance questions

**Primary CTA:** "Book a 15-minute demo" — low-friction, no commitment, human conversation. Nordic buyers prefer a personal touch over self-serve signup for B2B tools.

**Secondary CTA:** "Try the demo" — a self-serve sandbox for the curious but not-yet-ready.

---

### 2. The Submitter — Internal Advocate

**Who:** Public sector employee who travels, attends conferences, buys supplies. Files 3-4 expense reports per year.
**Pain:** Current process takes hours per report. Paper forms. Manual currency conversion. Waiting weeks for reimbursement.

| Need | Why it matters |
|------|---------------|
| Speed | They want to file a report in under 2 minutes and get back to work. |
| Receipt handling | Drag-and-drop, paste from clipboard, snap with phone. No scanners, no emailing PDFs to finance. |
| Auto-save identity | They don't want to re-enter their name, IBAN, department every single time. |
| Multi-currency | Nordic workers travel across borders. Automatic FX for NOK, SEK, DKK, EUR is table stakes. |
| Status visibility | They want to know if their report is pending, approved, or rejected — without emailing someone. |

**Landing page hooks for this persona:**
- "Drop receipts. Submit. Done." — the entire user journey in 3 words
- Animated demo/GIF showing receipt drag-and-drop
- Feature cards: auto-FX, clipboard paste, instant PDF

**Dashboard UI for this persona:**
- One-click "New report" button (prominent, always visible)
- Receipt drop zone (large, obvious, supports drag/paste/click)
- Report status: draft, submitted, approved, rejected (color-coded badges)
- Auto-filled identity fields (pre-populated from profile)

---

### 3. The Approver — Gatekeeper & Workflow Driver

**Who:** Department manager, team lead, project owner. Reviews and approves/rejects reports.
**Pain:** Reports pile up. No clear overview. Hard to distinguish urgent from routine. Approvals done via email chains.

| Need | Why it matters |
|------|---------------|
| Clear queue | A dashboard showing pending approvals, sorted by date/submitter/amount. |
| Quick actions | One-click approve/reject with optional comment. No multi-page forms per report. |
| Totals at a glance | Per-report total, currency, receipt count — visible without clicking into details. |
| Audit trail | Who submitted, when, what receipts, what FX rate was applied — all in the report history. |
| No inbox noise | Approvals happen in the tool, not via email threads. Optional email notifications only. |

**Landing page hooks for this persona:**
- "Approval workflow built-in" (feature card, comparison table)
- Screenshot of the approvals dashboard showing pending queue

**Dashboard UI for this persona:**
- Dedicated "Approvals" page with pending queue
- Approve/reject buttons on each item (or swipe actions)
- Receipt preview inline (images, PDF thumbnails)
- Comment field on rejection (required, with template suggestions)

---

### 4. The Finance Receiver — Compliance & Reporting

**Who:** Finance department staff who receives approved reports for final processing, accounting, or archiving.
**Pain:** Reports arrive in inconsistent formats. Missing receipts. Manual data entry into accounting systems. No bulk overview.

| Need | Why it matters |
|------|---------------|
| Standardized PDFs | Every report must export to a consistent, compliant PDF format. No manual reformatting. |
| Bulk overview | Dashboard showing all submitted/approved reports across the organization. Filter by date, department, status. |
| Spend categories | Receipts categorized (travel, meals, supplies, etc.) for budget tracking and reporting. |
| Download all | Export all reports for a period as a zip of PDFs. |
| API access | (Org tier) Push data into existing accounting/government systems. |

**Landing page hooks for this persona:**
- "Instant PDF generation" (feature card)
- "Organization dashboard" (feature card)
- Mention of API access in pricing (Organization tier)

**Dashboard UI for this persona:**
- "Receivables" page: all approved reports, filterable, bulk-downloadable
- Spend by category charts (simple bar/pie)
- Export options: PDF, CSV, API

---

### 5. The IT Admin — Security & Integration

**Who:** IT administrator, CISO, data protection officer.
**Pain:** New SaaS tools create security review overhead. Must verify data residency, access controls, authentication.

| Need | Why it matters |
|------|---------------|
| EU data residency | Explicit guarantee: all data stored and processed in the EU. No US cloud dependencies. |
| Access control | Role-based permissions (admin, approver, member, receiver). No privilege creep. |
| Auth standards | Email/password + magic link via Supabase Auth. Option for SSO/SAML in Organization tier. |
| Audit logging | All report actions logged (created, submitted, approved, downloaded). |
| No PII leaks | Receipt images and reports stay within the org. No sharing, no analytics selling. |

**Landing page hooks for this persona:**
- "EU data residency" in trust badges and feature cards
- "GDPR compliant" badge
- FAQ: "Where is my data stored?" and "Is this approved for government use?"

**Dashboard UI for this persona:**
- Organization settings page: manage members, roles, billing
- API key management (Organization tier)
- Activity/audit log

---

## Landing Page: Section-by-Section Conversion Map

Each section of the landing page is designed to address one or more personas at a specific stage of the decision funnel.

| Section | Target Persona | Goal | Mechanism |
|---------|---------------|------|-----------|
| **Header** | All | Immediate trust + action | Logo, clean nav, "Book a demo" CTA always visible |
| **Hero** | Decision Maker | Hook: "This solves my problem" | Emotional headline, social proof badge, trust badges (GDPR, EU), dual CTA |
| **Problem stats** | Decision Maker | Pain quantification | Hard numbers: 4 hrs/report, 3-month setup, €40/user — makes current state feel unacceptable |
| **Comparison table** | Decision Maker | Competitive positioning | Direct Reimburse vs. SAP Concur comparison. Not "better" but "built for you" |
| **How it works** | Submitter + Decision Maker | Simplicity proof | 3 steps, 3 icons, 3 sentences. Proves "no training required" visually |
| **Testimonial** | Decision Maker | Social proof | Named quote from a peer (finance director, similar org). 5-star visual |
| **Features grid** | Approver + Receiver + IT | Feature validation | 6 cards covering the key capabilities. Each card = 1 persona's objection handled |
| **Pricing** | Decision Maker | Remove cost objection | Pay-per-use vs. enterprise SaaS. "Free" tier for trial. Org tier for serious buyers |
| **FAQ** | Decision Maker + IT | Remove final objections | Covers compliance, data residency, cancellation, approval workflow, government approval |
| **Final CTA** | Decision Maker | Close | No new info. Pure emotional close + primary CTA |
| **Footer** | All | Trust + navigation | Clean links, copyright, email contact |

---

## UI Design Principles

### For the Landing Page
1. **Minimal luxury** — whitespace, clean typography, one accent color (#2563eb). Nordic aesthetic: functional, restrained, trustworthy.
2. **One primary CTA** — "Book a 15-minute demo". Repeated but never competing. Everything else is secondary.
3. **Show, don't tell** — the "how it works" section proves simplicity. The comparison table proves cost. The testimonial proves trust.
4. **Social proof everywhere** — municipality names, testimonial, trust badges, FAQ about government compliance.
5. **No dark patterns** — Nordic public sector buyers are skeptical of marketing. Be direct. Be transparent. Be boringly honest.
6. **Mobile-first** — decision-makers browse on phones. Every section must work on a 375px screen.

### For the Dashboard
1. **Role-based simplicity** — each persona sees only what they need. Submitters see "New report". Approvers see "Pending approvals". Receivers see "All reports".
2. **Zero-training UX** — every action should be obvious. No tooltips, no onboarding wizards. If it needs explaining, redesign it.
3. **Speed as a feature** — pages load instantly. Forms auto-save. Receipts upload in the background. The experience should feel lighter than email.
4. **Nordic clarity** — clean information hierarchy. No unnecessary icons, badges, or decorations. Data is the hero.
5. **Status visibility** — every report has a clear status: draft → submitted → approved/rejected. Color-coded. Unambiguous.

---

## Conversion Funnel

```
Visitor lands on / 
  → Reads hero (3 seconds to decide if relevant)
  → Scrolls to problem/solution (validates pain)
  → Checks pricing (can I afford this?)
  → Reads testimonial (do peers trust this?)
  → Clicks "Book a demo" (modal opens)
  → Fills form: name, email, org, role
  → Submits → confirmation message
  → We follow up within 24h
```

**Key conversion metrics to track:**
1. Hero bounce rate (should be < 40%)
2. Scroll depth (did they reach pricing? testimonial?)
3. "Book a demo" button clicks
4. Modal form completion rate (started vs. submitted)
5. Demo bookings per week
6. Time-to-close from demo to paid

---

## Messaging Principles

| Don't say | Say instead | Why |
|-----------|------------|-----|
| "Enterprise-grade" | "Built for public sector" | Public sector buyers distrust enterprise language |
| "AI-powered" | "Automatic FX conversion" | Be specific. "AI" is a trust-eraser in this market |
| "Revolutionary" | "Finally simple" | Underpromise, overdeliver |
| "Free trial" | "Try the demo" / "No credit card" | Demo implies guided experience. Trial implies self-serve abandonment |
| "Best-in-class" | "Approval workflow built-in" | Feature names, not adjectives |
| "Seamless integration" | "Data stored in the EU" | Compliance > convenience for this buyer |

---

## Next Steps

1. **Implement real Supabase Auth** — mock auth works for development. Real demo bookings require real accounts.
2. **Create /demo sandbox** — a live, interactive demo where visitors can create a mock report, upload a fake receipt, and download a PDF. No signup required.
3. **Set up demo booking pipeline** — CRM (HubSpot/Attio) webhook from `/api/contact`, auto-email confirmation, calendar link.
4. **A/B test CTAs** — "Book a 15-minute demo" vs. "See how it works" vs. "Talk to us". Measure which converts.
5. **Add real testimonials** — once you have users, replace the placeholder with a named, photo'd quote.
6. **Localize to NO/SV/DK** — at minimum, landing page in Norwegian, Swedish, Danish. Public sector buyers strongly prefer native language.
