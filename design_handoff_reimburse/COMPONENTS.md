# Components

Component-by-component spec. Match these states, props, and a11y rules in your component library.

## Button

### Variants
- **Primary:** `bg-brand`, white text, `r-lg`, `shadow:0 1px 2px rgba(37,99,235,.25)`. Hover: `bg-brand-dark` + `shadow:0 4px 12px rgba(37,99,235,.25)`. Active: `translateY(1px)`.
- **Ghost:** `bg-white`, `text-ink`, `border:1px solid line`. Hover: `border:rgba(37,99,235,.35)` + `text-brand`.
- **Mini (table-row):** padding `5/10`, `r-md`, font 12px. Variants: `ghost`, `primary`, `danger` (hover red border + text).
- **Destructive ghost only** — never a red filled button by default.

### Sizes
| Size | Padding | Font | Radius |
|---|---|---|---|
| `sm` (mini) | `5px 10px` | 12 | `r-md` |
| `md` (default) | `9px 16px` | 13.5 | `r-lg` |
| `lg` | `13px 22px` | 14 | `11px` |

### Props (suggested)
```ts
type ButtonProps = {
  variant?: "primary" | "ghost" | "mini" | "magic";
  size?: "sm" | "md" | "lg";
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;       // shows spinner, disables click
  disabled?: boolean;
  type?: "button" | "submit";
};
```

### A11y
- Always render `<button type="button">` unless inside a form (then `submit`).
- Loading state: `aria-busy="true"`, do not change visible text by default — show spinner alongside.
- Disabled state: `aria-disabled="true"` and `pointer-events:none`. Prefer `aria-disabled` over `disabled` so screen readers still announce.

## Input

- Base: `padding:10px 12px`, `r-lg`, `border:1px solid line`, `bg-white`, font 14.
- Focus: `border:brand`, `box-shadow:0 0 0 3px brand/15%`, `outline:none`.
- Error: `border:red`, `box-shadow:0 0 0 3px red/15%`. Helper text below in red.
- Disabled: `bg:paper`, `color:mute`, `cursor:not-allowed`.
- Label above the input, 13px / 500.
- Helper / error text below, 12px, mute (helper) or red (error).

```ts
type InputProps = {
  label: string;            // required for a11y
  hint?: string;
  error?: string;           // overrides hint, sets aria-invalid
  leftIcon?: ReactNode;
  rightAddon?: ReactNode;   // e.g. currency code
  required?: boolean;       // shows asterisk in label
};
```

## Select / dropdown

- Same visual as Input.
- Use a real `<select>` for short lists (currencies, departments, approvers).
- Use Combobox/Listbox (Radix or Headless UI) when search or grouping is needed.

## Badge

```ts
type BadgeProps = {
  variant: "draft" | "submitted" | "approved" | "rejected" | "neutral" | "brand";
  withDot?: boolean;        // 5px dot prefix in current color
};
```

- 11.5–12px, weight 600, padding `3px 9px`, `r-full`, 1px border.
- Status colors: see DESIGN_TOKENS.md → status mapping.

## Pill (info / pulse)

- 12px, weight 500, padding `6px 14px`, `r-full`, `border:1px solid brand/22%`, `bg:brand/6%`, `text:brand`.
- Optional pulse dot: 7px emerald with `box-shadow:0 0 0 3px rgba(16,185,129,.18)`.

## Card / Panel

- `bg-white`, `border:1px solid line`, `r-xl` (14px), shadow none at rest.
- Panel header: `padding:16px 20px`, `border-bottom:1px solid line`. Title 14.5/600 left, meta 12.5 mute right.
- Body: no padding by default; rows handle their own.

## KPI card

- `bg-white`, `r-xl`, `padding:18px`.
- Top row: label (12.5/500/mute) ↔ icon tile (28px square, `r-md`, `bg-brand/8%`).
- Value: `var(--kpi-size)` (24/28/32 by density), 600, tabular-nums, `-0.02em` tracking, `mt:6px`.
- Trend: 12px chip, emerald (up) / red (down) / mute (neutral). Chevron icon + `±N% vs last month`.
- Variants: `default` / `amber` / `emerald` / `violet` (recolors only the icon tile).

## Report row

Used in Recent reports, My reports, Receivables.

```
[icon-tile 28px] [title + meta]      [status-badge]  [amount]    [chev]
```

- Grid: `28px | 1fr | 110px | 110px | 30px`, gap `14px`.
- Padding: `var(--row-pad) 20px`.
- Border-bottom: `1px solid line-soft`. Last row: no border.
- Hover: `bg:rgba(37,99,235,.025)`.
- Click: navigate to detail. Whole row is the click target (use `<button>` or `<Link>`, not nested `<a>`s).

## Approval row

```
[avatar 32px circle] [name + bold + amount / title + when]   [Reject] [Approve]
```

- Hover (in queue page): cursor pointer; click opens drawer.
- Avatar: `bg-brand/10%`, `text-brand`, 32px circle, initials 12/600.

## Receipt card

- `r-lg`, border, hover `border:brand/30%` + `sh-sm`.
- Thumb: `height:140px`, gradient bg, doc icon centered, category pill top-left (`bg:rgba(15,23,42,.8)`, white text, 10.5/600).
- Meta: padding `10px 12px`. Name (13/600, ellipsis), row (date mute ↔ amount bold tabular).

## Drawer

- Right-anchored, `width:520px` (mobile: full-screen).
- Mask: `bg:rgba(15,23,42,.4)`, fade-in 250ms.
- Drawer: `transform:translateX(100%)` → `0`, 250ms ease-out.
- Header `padding:18px 22px` + bottom border. Footer same with top border + actions.
- Body scrolls independently.
- Close on: mask click, Esc, close button.
- Focus trap: when open, tab cycles inside drawer. Restore focus to trigger on close.

## Modal (confirms only)

- Center-anchored, `max-width:440px`, `r-xl`, `padding:24px`.
- Use only for destructive confirms (`Delete report`, `Reject without comment`).
- For record review/edit → use Drawer instead.

## Stepper (new report flow)

```
[1] Details ─── [2] Receipts ─── [3] Categorize ─── [4] Review & submit
```

- States per step: `idle` (gray num bg) / `active` (brand num bg, ink text) / `done` (emerald num bg, checkmark icon).
- Divider: `flex:1; height:1px; bg:line`.
- Click on a `done` step: navigate back to that step (preserves data).
- Click on a future step: blocked (no-op or disabled cursor).

## Filter bar

```
[pill1 active] [pill2] [pill3]  |  [search input]  [select]  [select]  ←spacer→  [More filters]
```

- Container: `bg-white`, `r-lg` (12px), `border`, `padding:12px`, `gap:8px`, wrap.
- Pills group: divider on right (`border-right:1px solid line; padding-right:8px`).
- Each pill: `padding:5px 10px`, `r-md`, font 12.5. Active: `bg:brand/8%`, `text:brand`, weight 600. Show count after label in mute weight 500.

## Activity timeline

- Vertical line on left (`bg:line`, 2px).
- Each item: 10px circle marker (`bg:white`, 2px border `line`).
- Done state: `bg:emerald`, `border:emerald`. Now state: `bg:brand`, `border:brand`.
- Item: padding `14px 20px 14px 44px`. Body 13px. When (relative time) 11.5px mute below.

## Toast / notification (recommend)

Not in prototype, but required for production:
- Top-right, stack vertically, `r-lg`, `bg-white`, `border:1px solid line`, `sh-md`.
- Variants: `success` (emerald check), `error` (red x), `info` (brand info), `warning` (amber).
- Auto-dismiss 5s. Pause on hover. Dismissable via X.
- Use for: receipt uploaded, FX rate updated, report submitted, approval sent, errors that aren't field-level.

## Sidebar nav item

- Padding `8px 12px`, `r-md`, font 13.5, gap 10, ink color.
- Icon 16px, mute color (becomes brand when active).
- Active: `bg:brand/8%`, `text:brand`.
- Hover (non-active): `bg:rgba(15,23,42,.04)`.
- Badge (e.g. Approvals count): right-aligned (`ml:auto`), `bg:brand-light`, `text:brand-dark`, 10.5/600, `padding:2px 7px`, `r-full`.

## Empty state

```
[48px muted icon]
Headline (16/600)
Helper (13.5/mute, 1 line)
[ Primary CTA ]
```

- Center-aligned, padding 64px.
- One CTA only — the next obvious action.
- Never a sad-face emoji. Never a stock illustration.
