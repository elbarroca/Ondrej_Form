# API

Suggested REST shape. Backend is open — Supabase/Postgres + Next.js route handlers is the assumed default. Adapt verbs and paths to your stack's conventions; the **shapes** matter more than the URLs.

## Conventions
- All requests/responses JSON.
- Auth via session cookie. Server reads `org_id` and `user_id` from session — never trust client.
- Errors: `{ error: { code: string; message: string; field?: string } }` + appropriate HTTP status.
- Money fields are `*_minor` integers + `currency`.
- Timestamps ISO 8601 with timezone.
- Pagination: cursor-based — `?cursor={opaque}&limit=25`. Response: `{ data: [...], next_cursor: string|null }`.

## Auth

### `POST /api/auth/login`
```ts
Req: { email: string; password: string; remember?: boolean }
Res 200: { user: User }
Res 401: { error: { code: "invalid_credentials" } }
Res 429: { error: { code: "rate_limited" } }
```

### `POST /api/auth/magic-link`
```ts
Req: { email: string }
Res 200: {} // always, even if email unknown
```

### `POST /api/auth/logout`
```ts
Res 204
```

### `GET /api/auth/session`
```ts
Res 200: { user: User; org: Organization }
Res 401: {}
```

## Reports

### `GET /api/reports`
Query: `status?: ReportStatus | "all"`, `q?: string`, `cursor?`, `limit?`
```ts
Res 200: { data: Report[]; next_cursor: string|null; counts: { draft:number; submitted:number; approved:number; rejected:number } }
```

### `POST /api/reports`
```ts
Req: ReportDetailsSchema
Res 201: Report
```

### `GET /api/reports/:id`
```ts
Res 200: { report: Report; receipts: Receipt[]; events: ActivityEvent[] }
```

### `PATCH /api/reports/:id`
Only when `status = "draft" | "rejected"`.
```ts
Req: Partial<ReportDetailsSchema>
Res 200: Report
```

### `POST /api/reports/:id/submit`
```ts
Res 200: Report  // status -> "submitted"
Res 409: { error: { code: "no_receipts" | "zero_total" } }
```

### `POST /api/reports/:id/withdraw`
```ts
Res 200: Report  // submitted -> draft
```

### `DELETE /api/reports/:id`
Soft delete; only `draft`.
```ts
Res 204
```

## Receipts

### `POST /api/reports/:id/receipts`
Multipart upload. Server: virus-scan, store, kick OCR job.
```ts
Req: multipart/form-data { file: File }
Res 201: Receipt
Res 413: { error: { code: "file_too_large" } }
Res 415: { error: { code: "unsupported_format" } }
```

### `PATCH /api/receipts/:id`
```ts
Req: ReceiptEditSchema  // omit id
Res 200: Receipt
```

### `DELETE /api/receipts/:id`
Soft delete; only when parent report is `draft` or `rejected`.
```ts
Res 204
```

## Approvals

### `GET /api/approvals`
Reports awaiting current user as approver.
```ts
Res 200: { data: Report[]; next_cursor: string|null }
```

### `POST /api/reports/:id/decide`
```ts
Req: ApprovalDecisionSchema
Res 200: Report  // approved | rejected
Res 403: { error: { code: "not_approver" } }
Res 409: { error: { code: "already_decided" } }
```

### `POST /api/reports/:id/decide/undo`
Within 10s undo window.
```ts
Res 200: Report  // back to "submitted"
Res 410: { error: { code: "undo_window_expired" } }
```

## PDF

### `GET /api/reports/:id/pdf`
Streams PDF; signed URL for caching.
```ts
Res 200: application/pdf
```

## Team

### `GET /api/team`
```ts
Res 200: { members: User[]; invites: Invite[] }
```

### `POST /api/team/invite`
```ts
Req: InviteSchema
Res 201: Invite
```

### `DELETE /api/team/invite/:id`
```ts
Res 204
```

### `PATCH /api/team/:userId`
Admin only.
```ts
Req: { role?: User["role"]; department?: string }
Res 200: User
```

## Billing

### `GET /api/billing`
```ts
Res 200: { plan: Organization["plan"]; current_period: { start: string; end: string; submitted_count: number; total_minor: number }; invoices: Invoice[] }
```

## Settings

### `PATCH /api/me`
```ts
Req: ProfileSchema | IdentitySchema  // discriminate by present keys
Res 200: User
```

## Webhooks (optional, for org plan)
- `report.submitted` → POST to org-configured URL
- `report.approved` → POST
- Sign with HMAC-SHA256, header `X-Reimburse-Signature`.

## Rate limits
- Auth endpoints: 10 req / 15 min / IP.
- Uploads: 60 req / hour / user.
- Everything else: 600 req / hour / user.
- Return `429` with `Retry-After` header.
