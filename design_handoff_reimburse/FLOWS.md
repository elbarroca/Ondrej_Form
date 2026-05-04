# Flows & State Machines

## Auth flow

```
                ┌─────────────┐
                │  Landing /  │
                └──────┬──────┘
                       │ click "Log in"
                       ▼
                ┌─────────────┐
                │  /login     │ ◄────── unauthenticated redirect
                └──────┬──────┘
            password   │   magic-link
         ┌─────────────┴─────────────┐
         ▼                           ▼
   POST /auth/login          POST /auth/magic-link
         │                           │
   200 → set cookie           200 → "Check inbox"
         │                           │
         ▼                           ▼
   ┌──────────────┐          ┌──────────────┐
   │ /dashboard   │          │  Email opens │
   └──────────────┘          │  /auth/verify│
                             │  ?token=…    │
                             └──────┬───────┘
                                    ▼
                             /dashboard
```

- Session cookie: HttpOnly, Secure, SameSite=Lax, 30-day rolling.
- Magic-link tokens: 15-minute TTL, single-use.
- After login, redirect to `?next=` if present, else `/dashboard`.
- Unauthenticated request to any `/dashboard/*` route → 302 to `/login?next={original}`.

## Report state machine

```
                    create
   (none) ──────────────────────► draft
                                    │
                                    │ edit / add receipts (any time)
                                    ▼
                                  draft
                                    │ submit (≥1 receipt, total>0)
                                    ▼
                                submitted ─────────► withdraw ─► draft
                                    │  (submitter only, before decision)
                       approve      │      reject
                  ┌─────────────────┼─────────────────┐
                  ▼                                   ▼
              approved                            rejected
                  │                                   │
                  │                                   │ edit + resubmit
                  ▼                                   ▼
            paid (manual,                          submitted
            org-plan only)
```

### Allowed transitions
| From | To | Who | Guard |
|---|---|---|---|
| (none) | draft | submitter | — |
| draft | submitted | submitter | ≥1 receipt, total > 0 |
| submitted | draft | submitter | not yet decided |
| submitted | approved | approver | — |
| submitted | rejected | approver | comment ≥10 chars |
| rejected | submitted | submitter | edits saved |
| approved | paid | admin | org plan only |

### Side effects on transition
- **draft → submitted**: generate `reference` (`REI-YYYY-NNNN`), notify approver, lock receipt edits, write `submitted` event.
- **submitted → approved**: write event, notify submitter, generate signed PDF, count toward billing.
- **submitted → rejected**: write event, notify submitter with comment.
- **any → any**: append `ActivityEvent`, bump `report.updated_at`.

## New-report flow (4-step wizard)

```
  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
  │ 1. Details  │───►│ 2. Receipts │───►│ 3. Categorize│───►│ 4. Submit  │
  └─────────────┘    └─────────────┘    └─────────────┘    └──────┬──────┘
        ▲                  ▲                   ▲                  │
        └──────────────────┴───────────────────┘                  │
                       back / edit                                 ▼
                                                            ┌──────────┐
                                                            │ Approval │
                                                            └──────────┘
```

- Auto-save draft on every step transition (debounced 800ms during edit).
- "Save as draft" exits to `/dashboard/reports`.
- Closing the tab loses ≤800ms of edits — acceptable.

### Step gates
1. **Details** valid → enable Next.
2. **Receipts**: ≥1 successfully uploaded → enable Next.
3. **Categorize**: every receipt has category + amount + currency → enable Next.
4. **Submit**: review summary → enable Submit button. Hitting Submit is irreversible (modulo Withdraw).

### Upload sub-state per receipt
```
queued → uploading → scanning(OCR) → ready
                  ↘ error (retry / remove)
```
- Show progress bar for `uploading`.
- Show shimmer for `scanning`.
- OCR is best-effort — never block on it; user can fill fields manually.

## Approval flow

```
    Notification → /dashboard/approvals
                          │
                          ▼
                    Pending list
                          │ click row
                          ▼
                   Report detail
                  ┌───┴───┐
            Approve     Reject (comment required)
                  │         │
                  ▼         ▼
           Confirm dialog (10s undo toast)
                  │
                  ▼
              Decision sent
```

- 10-second undo window after decision via toast `Undo` button — within window the transition is reversible without writing audit events for both directions; after expiry, decision is final.

## Empty / error / loading states

Every list view defines all four states:
- **Loading** — skeleton (3 rows minimum).
- **Empty** — illustration + one-line copy + primary CTA.
- **Error** — short message + Retry button + link to status page.
- **Populated** — the design.

| Route | Empty CTA |
|---|---|
| `/dashboard/reports` | "Create your first report" |
| `/dashboard/approvals` | "Nothing waiting on you 🎉" (no CTA) |
| `/dashboard/team` | "Invite a teammate" |
| `/dashboard/billing` | "Start your first paid report" |
