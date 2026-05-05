# CUET Corner — Design Critique Handoff

Branch: `feat/resources-redesign`
Critique date: 2026-05-05
Design score: **21/40** (Acceptable — significant improvements needed)

---

## Product Context

CUET Corner is an exam prep platform for CUET aspirants aged 15–18, post-12th board, targeting central universities (JNU etc.) in India. Primary device: mid-range Android phone (Redmi, budget Xiaomi). Design aesthetic: "Warm Sunrise" — amber-accented, warmth over drama, single-column mobile-first.

Design system lives in `DESIGN.md`. Global CSS tokens and component classes in `src/styles.css`. Student portal at `src/app/student/`.

---

## User's Decisions (confirmed)

| Question | Decision |
|---|---|
| Account page scope | **(B)** Rethink emotional register, not just P0/P1 fixes |
| Icon gradient unification | **(A)** Replace fuchsia-purple with neutral-toned gradient; keep icons distinct by shape only |
| Font-size fix scope | **(A)** Quick fix: raise the floor (≥12px everywhere, ≥14px for interactive labels) |
| Typography upgrade | Replace Manrope at display sizes with **Fraunces** (variable serif, Google Fonts); keep Manrope for UI headings (12–24px); keep Inter for all body/labels |

---

## Confirmed Spec Violations (DESIGN.md hard bans)

| Violation | File | Notes |
|---|---|---|
| Gradient text (`background-clip: text`) | `account.component.html` lines 524–526 via `.cuet-grad-text` | Ban: explicit |
| Gradient text | `dashboard.component.css:67` | Same ban |
| Glassmorphism as default | `account.component.css` — membership sidebar card (`cuet-card--glass`) | Borderline; rethink during account redesign |
| Em dashes in copy | `account.component.html:87, 380, 543` | "— curated in one", "— pick any combination", "— check back shortly" |
| Touch targets below 48px | `res-acc-topic__header` (44px), `shell-trigger` (40px), tab pills (~28–30px), `btn-sm` test buttons (36px) | DESIGN.md: ≥48px |
| `prefers-reduced-motion` missing | `tests.component.css`, `student.component.css` | Both have hover translate + card lift animations |
| Decorative 1px borders | `res-acc-subject` (`border: 1px solid var(--res-border-soft)`), `panel__material-card` (`border: 1px solid rgba(148,163,184,0.18)`) | Depth should come from tonal shifts + ambient shadow |
| Cold-tinted surfaces | `cuet-card--tonal` uses `--color-blue-50`; `acc-feature-card:hover` uses `--color-blue-50` | Must be amber-tinted, never cold |
| Side-stripe border-left | `performances.component.css:373` — `border-left: 3px solid var(--primary)` | Explicit ban |
| Layout property transitions | `dashboard.component.css:1133`, `performances.component.css:286,395`, `exam-topbar.component.css:97` — `transition: width/padding` | Causes layout thrash on budget Android |

---

## Off-Palette Colors (not spec violations, but color system breaks)

| Color | Where used | Problem | Fix |
|---|---|---|---|
| `#d946ef` → `#9333ea` (fuchsia-purple gradient) | Video icon containers throughout Resources | Muddy and neon on warm amber backgrounds; completely off-palette | Replace with neutral-toned gradient (stone/slate family) |
| `#7c3aed` (violet) | "Paid" badge in resources/tests | Visually clashes with amber; semantic meaning conflicts with amber = active | Replace with existing `.pill--paid` amber-tinted variant |
| `#dcfce7/#16a34a` (green) / `#fef2f2/#dc2626` (red) | Free/Paid badges in topic panel | Cold, generic Tailwind defaults; off-system | Unify with `.pill--free` / `.pill--paid` from `styles.css` |

---

## Two-Color-Vocabulary Problem (single biggest cohesion issue)

`resources.component.css` uses OKLCH amber-neutral tokens throughout.
`topic-panel.component.css` (renders inside resources) uses hardcoded cold Slate colors:
- `#0f172a` → replace with `oklch(14% 0.01 260)`
- `#1e293b` → `oklch(18% 0.01 260)`
- `#94a3b8` → `oklch(60% 0.008 260)`
- `#64748b` → `oklch(48% 0.008 260)`
- `rgba(148, 163, 184, 0.18)` borders → `oklch(91% 0.016 80 / 0.18)`
- `background: #fff` → `oklch(100% 0 0)` or `var(--card-surface)` (amber-tinted)

Also: `#fff` / `#ffffff` hardcoded in ~35 locations across `test-attempt`, `performances`, `performance-detail`, `topic-panel`, `skeleton`, `dashboard`, `student` component CSS files. All should use OKLCH tokens or `var(--surface-*)` variables.

---

## Account Page — Emotional Register Problem

Current account page tone is **fintech/editorial**. Needs to be **warm companion for an anxious student**.

Copy to rewrite:
| Current | Direction |
|---|---|
| "Account dossier" (page heading) | Something like "Your profile" or just the student's name |
| "Your profile record, membership, and purchases — curated in one" | Remove em dash; warmer verb |
| "À la carte" (batch selection option label) | Plain English — "Pick what you need" |
| "Total investment" (pricing label) | "Total cost" or "Fee" |
| "Enrollment is permanent for the academic year" (small grey text below CTA) | Needs prominence — P1 issue for trust |
| "Browse batches" / "Enrollment Curator" | Fine; "Enrollment Curator" is the best-written emotional moment in the portal |
| "New batches will open for enrollment soon — check back shortly" | Remove em dash |

Structural fix: On mobile, `xl:grid-cols-12` places the enrollment CTA in a sticky sidebar that stacks below all content. Add a sticky bottom bar on mobile with the primary enrollment action, or hoist an enrollment card to the top of the single-column mobile view.

---

## Typography Upgrade Plan

**Keep:** Inter for all body text, labels, UI elements. Do not change.

**Change:** Introduce Fraunces (variable serif, Google Fonts) for display-only moments.

```css
/* Add to styles.css @import block */
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Inter:wght@400;500;600&family=Manrope:wght@200..800&display=swap');
```

Three-tier system:
| Role | Font | Sizes |
|---|---|---|
| Display / H1 / Section heroes | Fraunces (display optical size, `font-optical-sizing: auto`) | 32px+ only |
| UI headings / Card titles / Eyebrows | Manrope 700–800 | 12–24px |
| Body / Labels / UI text | Inter 400–600 | 12–16px |

**Font-size floor fix (quick):**
- Nothing below `12px` anywhere
- Interactive labels (topic rows, tab pills, badges) minimum `14px`
- Current offenders in `resources.component.css`: 0.62rem, 0.64rem, 0.68rem (all below 11px) — raise to `0.75rem` minimum, `0.875rem` for interactive
- Consolidate 11 distinct font sizes in `resources.component.css` toward 5–6 steps as a secondary goal

---

## Other Technical Debt (lower priority)

- **`!important` density**: ~100 occurrences across student CSS. Majority are ng-zorro overrides. Refactor candidates: `resources.component.css` (28), `account.component.css` (30), `topic-panel.component.css` (16) — move ng-zorro override rules to `@layer components` in `styles.css` to eliminate `!important` dependency per CLAUDE.md architecture
- **`font-family: "Inter"` per-component**: Declared in 20+ component CSS files instead of inherited from `@theme` token. Remove per-component declarations; let inheritance work
- **`btn-primary` / `btn-ghost` classes used in modals**: Verify these are defined in `styles.css`. If not, they fall through to ng-zorro defaults — causing visual inconsistency in modal CTAs
- **`shell-trigger` hover shadow**: Currently `0 16px 32px -12px oklch(68% 0.17 55 / 0.5)` — more dramatic than spec's `0px 12px 32px rgba(25,28,30,0.06)`. Tone down.

---

## Recommended Command Sequence

Run in this order:

1. ~~**`$impeccable colorize`**~~ ✓ Done (2026-05-05) — off-palette colors resolved
2. ~~**`$impeccable typeset`**~~ ✓ Done (2026-05-05) — Fraunces added; font-size floor at 0.75rem everywhere
3. **`$impeccable adapt`** — touch targets to 48px min, account mobile enrollment CTA above the fold
4. **`$impeccable bolder` account** — account page emotional register, copy rewrite, gradient text removal, glassmorphism removal, structural warmth
5. **`$impeccable polish`** — em dashes, `prefers-reduced-motion` gaps, layout-transition replacements, spec violation cleanup, `btn-primary` audit

After all steps: re-run `$impeccable critique` to verify score improvement.
