# Accessibility

Target: **WCAG 2.2 AA**. EU public-sector procurement requires this — non-negotiable.

## Color & contrast
- Body text on background: ≥4.5:1.
- Large text (≥18.66px bold or ≥24px regular): ≥3:1.
- Interactive surfaces (button bg, input border): ≥3:1 against adjacent surface.
- Status badges: do **not** rely on color alone — every badge has an icon or shape (✓ approved, ⌛ submitted, ⚠ rejected, ● draft).
- Focus ring: 2px solid `--accent` + 2px offset transparent ring → AA contrast against any background.

## Keyboard

Every interactive element reachable & operable via keyboard.

| Key | Action |
|---|---|
| Tab / Shift+Tab | Move focus forward / back |
| Enter / Space | Activate button, toggle, link |
| Esc | Close modal, popover, dropdown |
| Arrow keys | Move within composite widgets (segmented controls, menus, tab lists, calendar) |
| Home / End | Jump to first / last in lists |
| Cmd/Ctrl + Enter | Submit form (where indicated) |
| `/` | Focus search (dashboard global) |
| `g r` | Go to Reports |
| `g a` | Go to Approvals |
| `n` | New report (from dashboard) |

- **Skip link**: first focusable element on every page is `Skip to main content` (visually hidden until focused).
- **Focus trap**: modals and the new-report wizard trap focus until dismissed.
- **Focus return**: on close, return focus to the element that opened the overlay.

## ARIA & semantics
- Use native elements first (`<button>`, `<a href>`, `<input>`, `<dialog>`). Reach for ARIA only when no native element fits.
- Form inputs: every `<input>` has a visible `<label>` linked via `for=`/`id=`. Helper text linked via `aria-describedby`. Errors linked via `aria-describedby` AND `aria-invalid="true"`.
- Status badges: `role="status"` for live status of a report.
- Toast notifications: live region `role="status"` (polite) or `role="alert"` (errors).
- Loading spinners: `aria-live="polite"` + visually-hidden text "Loading {what}".
- Tabs: `role="tablist"` / `role="tab"` / `role="tabpanel"` with `aria-selected` and `aria-controls`.
- Stepper (wizard): `role="progressbar"` with `aria-valuenow={step}` `aria-valuemax={4}`, plus visible "Step 2 of 4".
- Drag-and-drop upload: provide a parallel `<button>` "Choose file" — never drag-only.

## Screen-reader text
- Icon-only buttons have `aria-label`.
- Decorative icons: `aria-hidden="true"`.
- Visually-hidden helper text class:
  ```css
  .sr-only {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0,0,0,0);
    white-space: nowrap; border: 0;
  }
  ```

## Motion
- Respect `prefers-reduced-motion: reduce`:
  - Disable parallax on landing.
  - Replace 200ms transitions with 0ms (or ≤80ms).
  - Stop ambient/looping animations (e.g. floating cards on hero).
- Never auto-play looping motion that lasts >5s without a pause control.

## Forms
- Errors announced via live region after submission.
- Don't submit on blur. Validate on blur, submit on explicit action.
- File picker has accessible name and lists accepted formats in helper text, not only in browser dialog filter.
- Currency inputs: locale-aware decimal separator; programmatic value is always `.`-separated.

## Touch targets
- Minimum 44×44 px for any tap target (WCAG 2.5.8). Visible control may be smaller if hit area is padded.

## Language & locale
- `<html lang>` set per user preference (`en`, `nb`, `sv`, `da`, `fi`, `is`).
- Dates and currency formatted via `Intl.*` — never hand-rolled.
- Mirror layout for RTL only if you add Arabic/Hebrew (not in current scope).

## Testing checklist (per screen)
- [ ] axe-core: zero violations.
- [ ] Keyboard-only walkthrough completes the primary task.
- [ ] VoiceOver / NVDA reads each form field, label, and error.
- [ ] 200% browser zoom: no horizontal scroll on 1280px viewport.
- [ ] Windows high-contrast mode: no invisible borders.
- [ ] `prefers-reduced-motion`: no ambient animation.
