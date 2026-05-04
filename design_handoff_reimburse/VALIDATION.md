# Validation

All form validation rules expressed as Zod schemas. These are the source of truth for both client (react-hook-form resolver) and server (route handlers).

## Common
```ts
import { z } from "zod";

export const Email = z.string().trim().toLowerCase().email("Enter a valid email");
export const NonEmpty = (label: string) => z.string().trim().min(1, `${label} is required`);
export const Currency = z.enum(["EUR","USD","CAD","GBP","NOK","SEK","DKK","ISK","CHF","PLN","CZK","HUF","RON","BGN"]);
export const MoneyMinor = z.number().int().nonnegative().max(1_000_000_00, "Amount looks too high — split into multiple reports");
export const IBAN = z.string().trim().toUpperCase().regex(/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/, "Enter a valid IBAN");
export const BIC = z.string().trim().toUpperCase().regex(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/, "Enter a valid BIC/SWIFT");
```

## Login
```ts
export const LoginSchema = z.object({
  email: Email,
  password: z.string().min(8, "At least 8 characters"),
  remember: z.boolean().default(true),
});
```
- Server: invalid email or password → generic `Invalid email or password` (don't leak which).
- Lock after 10 failed attempts in 15 min — return 429.

## Magic link
```ts
export const MagicLinkSchema = z.object({ email: Email });
```
- Always respond 200 even if email doesn't exist (anti-enumeration).
- Toast: `Check your inbox at {email}`.

## New report — Step 1 (Details)
```ts
export const ReportDetailsSchema = z.object({
  title: NonEmpty("Title").max(120),
  currency: Currency,
  date_from: z.string().date().optional(),
  date_to: z.string().date().optional(),
  approver_id: z.string().uuid().optional(),
}).refine(
  (d) => !d.date_from || !d.date_to || d.date_from <= d.date_to,
  { message: "End date must be after start date", path: ["date_to"] }
);
```

## New report — Step 2 (Receipts)
- File: ≤20MB, mime in `[image/png, image/jpeg, image/heic, application/pdf]`.
- Reject with: `That file is too large` / `Unsupported format — try PNG, JPG, PDF or HEIC`.
- Step is **valid** when ≥1 receipt is attached and not in error state.

## New report — Step 3 (Categorize)
```ts
export const ReceiptEditSchema = z.object({
  id: z.string().uuid(),
  category: z.enum(["travel","lodging","meals","conferences","supplies","translation","other"]),
  amount_minor: MoneyMinor,
  currency: Currency,
  date: z.string().date().optional(),
  vendor: z.string().trim().max(120).optional(),
  notes: z.string().trim().max(500).optional(),
});
```

## New report — Step 4 (Submit)
- Cannot submit if: no receipts, any receipt missing `amount_minor`, total = 0.
- On submit: lock further edits, transition `draft → submitted`, fire `submitted` activity event, notify approver.

## Approval decision
```ts
export const ApprovalDecisionSchema = z.discriminatedUnion("decision", [
  z.object({ decision: z.literal("approve"), comment: z.string().trim().max(500).optional() }),
  z.object({ decision: z.literal("reject"), comment: z.string().trim().min(10, "Tell the submitter why (min 10 chars)").max(500) }),
]);
```

## Settings — Profile
```ts
export const ProfileSchema = z.object({
  full_name: NonEmpty("Name").max(120),
  email: Email,
  department: z.string().trim().max(80).optional(),
  role_label: z.string().trim().max(80).optional(),
});
```

## Settings — Identity
```ts
export const IdentitySchema = z.object({
  iban: IBAN,
  bic: BIC.optional(),
  tax_id: z.string().trim().max(40).optional(),
  default_currency: Currency,
});
```

## Team — Invite
```ts
export const InviteSchema = z.object({
  email: Email,
  role: z.enum(["admin","approver","member","receiver"]),
  department: z.string().trim().max(80).optional(),
});
```

## Validation UX rules
- **Validate on blur**, re-validate on change once a field has been blurred and is in error.
- Show one error message per field, below the input in red 12px.
- Mark invalid input with `aria-invalid="true"` and link via `aria-describedby` to the error text id.
- On submit with errors: focus the first invalid field, scroll into view (smooth, 200ms), shake nothing.
- Server errors: surface inline if mappable to a field; otherwise toast.
