# Design Tokens

All values used across Reimburse. Match these exactly.

## Color

### Neutral (paper / ink)
| Token | Hex | Usage |
|---|---|---|
| `paper` | `#fafaf8` | App bg, page bg |
| `white` | `#ffffff` | Cards, panels, inputs |
| `ink` | `#0f172a` | Primary text |
| `mute` | `#64748b` | Secondary text, meta, icons |
| `line` | `#e2e8f0` | Borders, dividers |
| `line-soft` | `#eef2f6` | Inner row dividers |

### Brand
| Token | Hex | Usage |
|---|---|---|
| `brand` | `#2563eb` | Primary action, accent |
| `brand-light` | `#dbeafe` | Pill bg, badge bg |
| `brand-dark` | `#1e40af` | Hover, gradient end |
| `brand/8%` | `rgba(37,99,235,0.08)` | Active nav, soft tint |
| `brand/15%` | `rgba(37,99,235,0.15)` | Focus ring |

### Semantic
| Token | Hex | Bg | Border |
|---|---|---|---|
| `emerald` | `#10b981` | `rgba(16,185,129,0.10)` | `rgba(16,185,129,0.25)` |
| `amber` | `#f59e0b` | `rgba(245,158,11,0.10)` | `rgba(245,158,11,0.25)` |
| `red` | `#ef4444` | `rgba(239,68,68,0.10)` | `rgba(239,68,68,0.25)` |
| `slate-meta` | `#475569` | `rgba(148,163,184,0.12)` | `rgba(148,163,184,0.25)` |

### Status mapping
| Status | Bg | Text | Border |
|---|---|---|---|
| `draft` | `slate/12%` | `#475569` | `slate/25%` |
| `submitted` | `amber/10%` | `#b45309` | `amber/25%` |
| `approved` | `emerald/10%` | `#047857` | `emerald/25%` |
| `rejected` | `red/10%` | `#b91c1c` | `red/25%` |

## Typography

**Family:** Inter (with `cv11`, `ss01`). Fallback: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto`.
**Numerics:** `font-variant-numeric: tabular-nums` on all amounts and dates.

| Token | Size | Weight | Line | Tracking | Use |
|---|---|---|---|---|---|
| `display` | 36–60px (clamp) | 600 | 1.05 | -0.025em | Hero h1 |
| `h2` | 26–38px (clamp) | 600 | 1.15 | -0.02em | Section h2 |
| `h1-page` | 26px | 600 | 1.2 | -0.02em | Dashboard page head |
| `quote` | 22–30px (clamp) | 500 | 1.4 | -0.015em | Testimonial |
| `body-lg` | 17px | 400 | 1.55 | 0 | Lede |
| `body` | 14px | 400 | 1.5 | 0 | Default |
| `body-sm` | 13.5px | 400 | 1.5 | 0 | Card body |
| `meta` | 12.5px | 500 | 1.4 | 0 | Card meta |
| `meta-sm` | 11.5px | 500 | 1.4 | 0 | Receipt meta |
| `eyebrow` | 12px | 600 | 1.4 | 0.14em | Section eyebrow (uppercase) |
| `kbd` | 11px | 500 | 1 | 0 | Keyboard hint |

## Spacing

4px base. Use 4 / 8 / 12 / 14 / 16 / 18 / 20 / 24 / 28 / 32 / 48 / 64 / 96.

- Section vertical padding (landing): `96px` desktop, `64px` mobile.
- Container max-width: `1120px` (landing), `1240px` (dashboard content), `1180px` (hero split).
- Container gutters: `24px` (landing), `28px` (dashboard).
- Card gap: `12 / 18 / 24` (compact / comfy / spacious).
- Row padding y: `10 / 14 / 18` (compact / comfy / spacious).

## Radius

| Token | px | Use |
|---|---|---|
| `r-sm` | 6 | Inner kbd, pills inside inputs |
| `r-md` | 8 | Buttons (mini), badges, segments |
| `r-lg` | 10 | Inputs, primary buttons, mini cards |
| `r-xl` | 14 | Cards, panels |
| `r-2xl` | 16 | Showcase frame, feature cards |
| `r-3xl` | 18 | Pricing cards |
| `r-full` | 999 | Pills, badges, avatars |

## Shadow

| Token | Value | Use |
|---|---|---|
| `sh-sm` | `0 1px 2px rgba(15,23,42,.04)` | Resting cards |
| `sh-md` | `0 4px 16px rgba(15,23,42,.06)` | Hover lift, floating cards |
| `sh-lg` | `0 16px 40px rgba(15,23,42,.10)` | Drawer, modal |
| `sh-product` | `0 30px 80px -20px rgba(15,23,42,.18), 0 12px 30px -12px rgba(37,99,235,.10)` | Hero product preview |

## Motion

- **Default duration:** `150ms` for hover/focus.
- **Drawer / modal:** `250ms` ease-out.
- **Easing:** `cubic-bezier(.4, 0, .2, 1)` (matches Tailwind's default).
- **Float animation** (hero notification cards): `6s` ease-in-out infinite, `translateY(-6px)`.
- **No animation > 400ms** for any UI element. No autoplay carousels.

## Density tokens (dashboard)

| Token | Compact | Comfy | Spacious |
|---|---|---|---|
| `--row-pad` | 10px | 14px | 18px |
| `--card-gap` | 12px | 18px | 24px |
| `--kpi-size` | 24px | 28px | 32px |

Set `data-density` on `<body>` (or root layout div) — drives CSS variables.

## Iconography

- Source: **Feather** / **Lucide** at `1.8` stroke. Always `currentColor`.
- Sizes: `12 / 14 / 16 / 18 / 22` only.
- Icon tile (feature/step): `38–56px` square, `r-lg` to `r-xl`, `bg-brand/10`, `color-brand`.
- Never decorative. Every icon must label a thing.

## Don'ts

- ❌ No new accent colors. If you need a new state, extend `emerald/amber/red` semantically.
- ❌ No saturated backgrounds (>0.06 alpha for tinted bgs).
- ❌ No drop shadows on text. No glows.
- ❌ No emoji in product UI except `✨` in welcome message (warm tone exception).
- ❌ No gradient text except hero accent (`var(--brand)` solid is preferred).
