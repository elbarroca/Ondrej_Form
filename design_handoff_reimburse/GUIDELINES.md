# Reimburse — Design Guidelines

A short reference for how every section and component should be built. Pair this with `Reimburse Prototype v2.html`.

## Brand foundations

| Token | Value | Use |
|---|---|---|
| `--paper` | `#fafaf8` | App background |
| `--ink` | `#0f172a` | Primary text |
| `--mute` | `#64748b` | Secondary text, meta |
| `--line` | `#e2e8f0` | Borders, dividers |
| `--brand` | `#2563eb` | Primary action, accent |
| `--brand-dark` | `#1e40af` | Hover, gradient end |
| `--emerald` | `#10b981` | Approved, positive trend |
| `--amber` | `#f59e0b` | Pending, attention |
| `--red` | `#ef4444` | Rejected, destructive |

**Type:** Inter (with `cv11`, `ss01`). Weights 400/500/600. Tabular numerals on amounts.
**Radii:** 8 (controls), 10 (inputs), 14 (cards), 18 (price cards), 999 (pills).
**Shadows:** stay restrained — `shadow-sm` for hover lift, `shadow-md` for floating panels only.

## Tone of voice

Warm, human, slightly playful — but boringly honest where it matters (compliance, pricing). Never enterprise-speak. Cut every adjective you can. "Finally simple" not "revolutionary"; "Drop receipts, done" not "streamlined workflow".

## Currencies

All EU currencies plus USD and CAD: `EUR, NOK, SEK, DKK, ISK, GBP, CHF, PLN, CZK, HUF, RON, BGN, USD, CAD`. Formatting: ISO code in front, narrow space, tabular figures (`NOK 4 820,00` Nordic style; `€ 1,284.50` Anglo style — follow user locale). Never lead with money in marketing copy; lead with **time saved**.

---

## Landing page sections

### Hero
- **Goal:** make the visitor feel "this solves my problem" in 3 seconds.
- **Build:** centered eyebrow pill → 2-line headline (balance, ≤9 words, brand-blue accent on the second clause) → 1-sentence promise → primary + secondary CTA → trust strip.
- **Visual:** show a real product preview (mocked dashboard frame), not just text. Floating receipt cards / tilted dashboard / split product+text layouts are all valid — switchable via Tweaks.
- **Don't:** stack 5 trust pills, use stock photos, or "AI-powered".

### Problem
- **Goal:** quantify pain in *time*, not money. Money can come later in pricing.
- **Build:** eyebrow → headline → 3 calm columns. Each column = a number, a unit, a sentence. Use *hours / weeks / spreadsheets / paper forms* — not euros.
- **Variants worth keeping live:** hours-saved bars, before/after split, paper-form screenshot.

### How it works
- 3 steps, monospace step numbers, single-line headings, ≤16-word descriptions. Never 4+ steps.

### Product showcase (replaces the comparison table)
- **Goal:** prove simplicity by showing the actual UI. One large product card, two small annotated callouts ("Drag receipts here", "FX is automatic").
- **Build:** real screenshot or HTML mock of the dashboard inside a browser frame. Surrounding label microcopy in mute color.

### Testimonial
- One quote. One face (or initials avatar). One real-feeling org. 5 stars in brand color.
- Don't carousel until you have 4+ real ones.

### Features grid
- Exactly 6. Each card: 38px icon tile, 1-line title, 2-line description. Icon tile uses `bg-brand/10`.
- Card hover: `border-brand/30` + `translate-y(-1px)`. Nothing more.

### Pricing
- 3 cards. Middle is featured (`Most popular` ribbon, brand border, soft brand tint).
- **Per-report price (€2.50)** can be hidden via Tweak — leads with "pay only when you submit" instead.
- Always show: `tier name → price → 1-line desc → 4–6 checks → CTA`.

### FAQ
- 6 questions, 2-column grid. Each answer ≤2 sentences. Plain language. Procurement-friendly.

### Final CTA
- Brand-gradient band (135deg, brand-dark → brand). White text. Repeat the primary CTA only — no new info.

### Footer
- Centered links row + copyright. Don't sitemap-dump.

---

## Login page

- Split layout: brand-gradient aside (40-50%) + form area.
- Aside is *content*, not decoration: logo top, headline + lede middle, trust checks + "book a demo" bottom escape.
- Form: `Welcome back` → email → password → row (remember-me ↔ forgot) → primary submit → divider → magic-link secondary.
- Never autoplay redirects. Show a 400ms "Signing in…" before navigating.
- Mobile: drop the aside, keep logo in form area.

---

## Dashboard

### Layout shell
- 3 zones: **sidebar (244px) + topbar (sticky) + content**.
- Calm/spacious by default (`density="comfy"`). Compact and spacious are Tweaks. Spacious bumps row padding from 14px → 18px and adds 8px between cards.
- Max content width 1240px, gutter 28px. Don't full-bleed.

### Sidebar
- Sections: Workspace (Overview, My reports, Approvals[badge], Receivables) + Organization (Team, Organization, Settings). Group labels in 10.5px uppercase mute.
- Active item: `bg-brand/8` + brand text + brand icon.
- Footer: user chip with avatar + email, chevron right.
- Org switcher: 28px gradient mark + name + role + chevron.

### Topbar
- Breadcrumb left, search (⌘K) + bell + help + primary action right.
- Search is always 240px+. Bell uses a 7px red dot when there's news.

### Page head
- `h1` (26px, -0.02em) + 1-line `sub`. Page actions float right (Export ghost + Primary).

### KPI cards
- 4 across. Each: label + small icon → 28px tabular value → trend chip.
- Trend chip is one of: emerald up, red down, mute neutral. Chevron arrow + percent + "vs last month".

### Tables / Lists
- Prefer **list rows** over tables for record-style content (reports, approvals).
- Row grid: `icon | title+meta | status badge | amount | chevron`.
- Hover: `bg-brand/2.5%`. Click: opens detail.
- Status badges: `draft / submitted / approved / rejected` — see palette mapping below.

### Status badge mapping

| Status | Background | Text | Border |
|---|---|---|---|
| draft | `slate/12` | `#475569` | `slate/25` |
| submitted | `amber/10` | `#b45309` | `amber/25` |
| approved | `emerald/10` | `#047857` | `emerald/25` |
| rejected | `red/10` | `#b91c1c` | `red/25` |

### Side pages

- **My reports** — full-page list, filter pills (All / Draft / Submitted / Approved / Rejected), search, date range, currency filter, export. Row click → Report detail.
- **Report detail** — header (title, status, total) → activity log timeline → receipt grid (thumbs + amount + category) → actions panel (submit / download PDF / delete).
- **New report** — 4-step linear flow: name + currency → drop receipts → categorize/edit → review/submit. Auto-saves; URL keeps step.
- **Approvals** — pending queue, click row → side drawer review modal with receipts + approve/reject + comment.
- **Receivables** — finance view, all approved reports, bulk select, export CSV/ZIP.
- **Team** — members table with role chip + invite button + remove.
- **Organization** — billing, plan, custom domain, branding, audit log.
- **Settings** — profile, identity (name, IBAN, dept), notifications.

### Empty states
- 48px muted icon → 1-line headline → 1-line helper → primary CTA.
- Never show a sad face emoji.

### Modals & drawers
- Modal for confirms only. **Drawer (right, 480–560px)** for record review (approval, identity edit). Drawers don't break the dashboard context.

### Density tweaks

| Token | Compact | Comfy (default) | Spacious |
|---|---|---|---|
| Row padding | 10px | 14px | 18px |
| Card gap | 12px | 18px | 24px |
| KPI value size | 24px | 28px | 32px |

---

## Component recipes

### Buttons
- Primary: `bg-brand`, white text, `9/13.5` padding, `rounded-10`, hover `bg-brand-dark` + soft shadow.
- Ghost: white bg, ink text, line border, hover border-brand/35 + brand text.
- Mini (table-row): `5/10` padding, `rounded-7`, font-size 12.
- Destructive ghost only — never red filled by default.

### Inputs
- White bg, line border, `rounded-10`, focus ring 3px `brand/15`.
- Labels above, 13px medium. Helper below in mute 12px.

### Pills / Badges
- 11.5–12px font, 600 weight, dot prefix when status-y, tinted bg + matched border.

---

## Don'ts

- Don't lead landing copy with money.
- Don't add 4+ steps anywhere on the landing.
- Don't use red as a primary; only for destructive/rejected/down-trend.
- Don't introduce new accent colors without updating this doc.
- Don't add icons just to fill space.
- Don't use stock dashboards for the showcase — always real Reimburse UI.
