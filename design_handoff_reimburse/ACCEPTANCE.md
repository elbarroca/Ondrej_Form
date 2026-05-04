# Acceptance Criteria

Per-screen QA criteria. Each item is a checkbox the build must pass before merge. Format: Given / When / Then where it adds clarity.

## Landing — `/`

- [ ] Header is sticky; on scroll past 80px the bg switches to `--surface` with `--shadow-sm`.
- [ ] All nav anchors (`Product`, `Pricing`, `FAQ`) smooth-scroll to their section.
- [ ] Hero default layout is **split**; tilted product preview is `transform: rotate(-2deg) translateY(0)` and floats with 4s loop (disabled under reduced-motion).
- [ ] "Start a free report" CTA → `/login?next=/dashboard/reports/new`.
- [ ] Problem section default is **time bars**; bars animate in on viewport-enter using `IntersectionObserver` (one-shot).
- [ ] Pricing: middle card has `--accent` border + "Most popular" pill; per-report price (€2.50) is hidden when `showPerReportPrice = false`.
- [ ] FAQ items expand/collapse; only one open at a time when in accordion mode.
- [ ] Footer shows org count placeholder, country list, and legal links.

## Login — `/login`

- [ ] Email validation runs on blur. Empty submit focuses email and shows "Email is required".
- [ ] Password input has show/hide toggle; toggle button has `aria-label`.
- [ ] "Send magic link instead" swaps the form to single-field magic-link flow without page reload.
- [ ] After magic link request, success state shows: `Check your inbox at {email}` + `Resend` after 30s.
- [ ] Failed login → generic error + 15-min lockout after 10 attempts.
- [ ] On success, redirect to `?next=` if present, else `/dashboard`.

## Dashboard shell

- [ ] Sidebar nav highlights active route (background `--surface-muted`, text `--text-strong`).
- [ ] Avatar menu opens on click and closes on `Esc` or outside-click.
- [ ] Cmd/Ctrl-K opens command palette (if implemented); `/` focuses search.
- [ ] Mobile (≤768px): sidebar collapses to a sheet, opened by hamburger.

## Dashboard — Overview

- [ ] 4 KPI cards: This month total, Pending approval, Approved, Rejected — values match `/api/reports?status=…` counts.
- [ ] Recent activity timeline shows last 10 events; each has actor avatar, action, timestamp (relative, e.g. "2h ago").
- [ ] "Create report" button → wizard step 1.

## Reports list — `/dashboard/reports`

- [ ] Filter tabs (All / Draft / Submitted / Approved / Rejected) reflect `?status=` query param.
- [ ] Search filters by title and reference, debounced 250ms.
- [ ] Empty state shows illustration + "Create your first report" CTA.
- [ ] Row click → report detail.
- [ ] Status badge color + icon matches table in `DESIGN_TOKENS.md`.

## New Report wizard — `/dashboard/reports/new`

- [ ] Step indicator shows current step bold, completed steps with check icon.
- [ ] Step 1 cannot proceed without Title + Currency.
- [ ] Step 2: drag-and-drop AND file picker both work; ≤20MB; rejects unsupported formats with inline error.
- [ ] Each receipt thumbnail shows upload progress, then OCR shimmer, then ready state.
- [ ] Step 3: every receipt requires category + amount + currency; FX rate auto-fills from /api/fx (cached 1h).
- [ ] Step 4: shows summary table, total in report currency, "Submit" button disabled until all checks green.
- [ ] Auto-save: leaving any step writes draft within 800ms.
- [ ] Submit → toast "Report sent to {approver}" + redirect to detail page.

## Report detail — `/dashboard/reports/:id`

- [ ] Header: title, reference, status badge, total, date range.
- [ ] Receipts grid: hover reveals edit/delete; click opens lightbox preview.
- [ ] Activity timeline shows all events newest-first.
- [ ] Submitter sees "Withdraw" only when `submitted` and not yet decided.
- [ ] Approver sees "Approve" + "Reject" only when status is `submitted` AND `approver_id = me`.
- [ ] "Download PDF" enabled only when status is `approved`.
- [ ] Reject opens dialog requiring ≥10-char comment.

## Approvals — `/dashboard/approvals`

- [ ] Lists only `submitted` reports where `approver_id = me`.
- [ ] Approve action shows 10s undo toast; clicking Undo reverses without audit churn.
- [ ] Empty state: "Nothing waiting on you 🎉" — no CTA.

## Team — `/dashboard/team`

- [ ] Members table with role, department, last active.
- [ ] Admin can invite, change roles, deactivate.
- [ ] Non-admin sees read-only list (no invite button).
- [ ] Invite email validation matches Zod schema.

## Billing — `/dashboard/billing`

- [ ] Shows current plan, current period usage, next invoice estimate.
- [ ] PAYG plan: line chart of submitted reports over last 6 months.
- [ ] Invoice list with download links.

## Settings — `/dashboard/settings`

- [ ] Tabs: Profile · Identity · Notifications · Org (admin only).
- [ ] Profile changes save on blur with toast confirmation.
- [ ] IBAN/BIC validation runs client-side; server re-validates.
- [ ] Email change requires re-confirmation via magic link.

## Cross-cutting

- [ ] All forms keyboard-completable.
- [ ] All async actions have loading states; no dead clicks.
- [ ] All errors recoverable with explicit Retry.
- [ ] Lighthouse: Performance ≥90, Accessibility 100, Best Practices ≥95 on `/`, `/login`, `/dashboard`.
- [ ] Bundle: route JS ≤180KB gzipped per page.
- [ ] No layout shift on initial render (CLS <0.1).
- [ ] Works in Safari 16+, Chrome 110+, Firefox 110+, Edge 110+.

## Definition of Done

A screen is done when:
1. Visual matches the prototype to within 4px / 1 token.
2. All acceptance items above are checked.
3. No `axe-core` violations.
4. Storybook story exists for every state (loading / empty / populated / error).
5. Reviewed by design + 1 engineer.
