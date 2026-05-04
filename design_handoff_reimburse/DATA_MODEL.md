# Data Model

All entities, fields, types, enums, and relationships. Source of truth for both DB schema and TypeScript types.

## Conventions
- IDs: `uuid` (Postgres `gen_random_uuid()`).
- Timestamps: `timestamptz` (UTC); rendered in user locale.
- Money: integer minor units (`amount_minor`) + ISO 4217 `currency`.
- Soft delete: `deleted_at` nullable. Receipts are soft-deleted; metadata kept for audit.

## Entities

### Organization
```ts
type Organization = {
  id: string;
  name: string;                 // "Bergen kommune"
  short_code: string;           // "BK", 2 chars uppercase
  country: "NO"|"SE"|"DK"|"FI"|"IS";
  vat_number?: string;
  billing_email: string;
  default_currency: CurrencyCode;
  plan: "free" | "payg" | "org";
  logo_url?: string;
  created_at: string;
};
```

### User
```ts
type User = {
  id: string;
  org_id: string;
  email: string;                // unique
  full_name: string;
  department?: string;
  role: "admin" | "approver" | "member" | "receiver";
  iban?: string;                // ISO 13616
  bic?: string;
  tax_id?: string;
  default_currency?: CurrencyCode;
  avatar_url?: string;
  created_at: string;
  invited_at?: string;
  joined_at?: string;
};
```

### Report
```ts
type Report = {
  id: string;
  org_id: string;
  submitter_id: string;
  approver_id?: string;
  title: string;                 // 1-120 chars
  reference: string;             // "REI-2026-0042", auto-generated
  currency: CurrencyCode;
  date_from?: string;            // ISO date
  date_to?: string;
  status: "draft" | "submitted" | "approved" | "rejected";
  total_minor: number;           // sum of receipts converted to report.currency
  comment?: string;              // last approver comment
  submitted_at?: string;
  decided_at?: string;
  created_at: string;
  updated_at: string;
};
```

### Receipt
```ts
type Receipt = {
  id: string;
  report_id: string;
  file_url: string;              // signed URL or storage path
  file_name: string;
  file_size: number;             // bytes
  mime_type: "image/png"|"image/jpeg"|"image/heic"|"application/pdf";
  category: ReceiptCategory;
  amount_minor: number;
  currency: CurrencyCode;        // original
  fx_rate?: number;              // → report.currency, captured at upload
  amount_minor_in_report_currency: number;
  date?: string;                 // receipt date (ISO)
  vendor?: string;
  notes?: string;
  uploaded_at: string;
  deleted_at?: string;
};

type ReceiptCategory = "travel"|"lodging"|"meals"|"conferences"|"supplies"|"translation"|"other";
```

### ActivityEvent
```ts
type ActivityEvent = {
  id: string;
  report_id: string;
  actor_id: string;
  type: "created"|"receipt_added"|"receipt_removed"|"submitted"|"approved"|"rejected"|"comment"|"downloaded";
  payload?: Record<string, unknown>;
  created_at: string;
};
```

### Invoice (Pay-as-you-go billing)
```ts
type Invoice = {
  id: string;
  org_id: string;
  period_start: string;
  period_end: string;
  submitted_count: number;       // billable units
  unit_price_minor: 250;         // €2.50
  currency: "EUR";
  total_minor: number;
  status: "draft"|"sent"|"paid"|"overdue";
  pdf_url?: string;
};
```

## Currency code
Closed enum. Render with locale-aware `Intl.NumberFormat`.
```ts
type CurrencyCode = "EUR"|"USD"|"CAD"|"GBP"|"NOK"|"SEK"|"DKK"|"ISK"|"CHF"|"PLN"|"CZK"|"HUF"|"RON"|"BGN";
```

## Relationships
- `Organization 1—N User`
- `Organization 1—N Report`
- `User 1—N Report` (as submitter)
- `User 1—N Report` (as approver, optional)
- `Report 1—N Receipt`
- `Report 1—N ActivityEvent`
- `Organization 1—N Invoice`

## Indexes
- `report(org_id, status, updated_at desc)` — list views
- `report(approver_id, status)` — approvals queue
- `receipt(report_id, deleted_at)` — receipt grid
- `activity_event(report_id, created_at desc)` — timeline
- Unique: `user(email)`, `report(reference)`

## Row-level security (Supabase / Postgres)
- A user can read/write `report` only when `org_id = auth.org_id() AND (submitter_id = auth.uid() OR approver_id = auth.uid() OR auth.role() IN ('admin','receiver'))`.
- A user can read `receipt` only via a report they have access to.
- Audit-log inserts use `security definer` function so users can't write arbitrary `actor_id`.
