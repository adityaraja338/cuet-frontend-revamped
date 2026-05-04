# Design System: CUET Corner

## 1. Overview

CUET Corner serves 16-17 year olds who just finished their 12th boards, anxious about what comes next, scrolling on a mid-range Android phone. The design must feel like a warm sunrise, not a film trailer.

**Guiding principles**
- Warmth over drama. Light, amber-accented surfaces signal hope and clarity.
- Clarity over density. One idea per viewport. Let the story breathe.
- Mobile-first. Single-column, 48px touch targets, no heavy parallax.

---

## 2. Color System

All colors use OKLCH. Neutrals are amber-tinted, never cold gray.

### Student / Landing palette

| Role | OKLCH | Usage |
|---|---|---|
| Primary amber | `oklch(68% 0.17 55)` | CTAs, highlights, active states, icons |
| Primary dark | `oklch(58% 0.17 55)` | Hover, pressed states |
| Primary light | `oklch(82% 0.1 55)` | Container, tinted backgrounds |
| Background | `oklch(99% 0.006 80)` | Page background (warm white) |
| Card surface | `oklch(97% 0.008 82)` | Card backgrounds |
| Tinted section | `oklch(97.5% 0.012 82)` | Alternating section fills |
| Headline text | `oklch(14% 0.01 260)` | H1–H4, near-black |
| Body text | `oklch(38% 0.01 260)` | Paragraphs, readable on mobile |
| Muted text | `oklch(48–58% 0.008 260)` | Labels, secondary info |
| Border / divider | `oklch(91% 0.016 80)` | Subtle warm-tinted separators |

### CSS variables (`:root` + `.student`)

```css
/* Global */
--student-primary: oklch(68% 0.17 55);
--student-dark-primary: oklch(58% 0.17 55);

/* Student context override — cascades via var(--primary) */
.student {
  --primary: oklch(68% 0.17 55);
  --primary-container: oklch(82% 0.1 55);
  --primary-gradient: linear-gradient(135deg, oklch(68% 0.17 55) 0%, oklch(76% 0.13 55) 100%);
}
```

### Admin palette
Admin uses `--admin-primary: #0284c7` (sky blue). All `.admin` selectors remain unchanged.

### Color strategy
**Committed** (landing hero, epilogue CTA) — amber IS the surface.
**Restrained** (student portal interior) — amber at ≤15% via icons, eyebrows, active states on neutral surfaces.

---

## 3. Typography

| Role | Font | Weight | Notes |
|---|---|---|---|
| Display / H1 | Manrope | 800 (Black) | `letter-spacing: -0.03em`, fluid via `clamp()` |
| Section H2 | Manrope | 800 | `letter-spacing: -0.02em` |
| Card titles | Manrope | 700–800 | `uppercase` + `letter-spacing: 0.02em` for labels |
| Body | Inter | 400 | 15–16px, `line-height: 1.6` |
| UI labels | Inter | 500–600 | 12–14px |
| Eyebrows | Inter or Manrope | 700 | `uppercase`, `letter-spacing: 0.3em`, 10–12px |

**Line length cap**: 65–75ch for body paragraphs.

Fonts are loaded globally via Google Fonts in `src/styles.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@200..800&display=swap');
```

---

## 4. Elevation and Depth

No 1px decorative borders. Depth comes from:
- **Tonal background shifts** — page `oklch(99%)` → card `oklch(97%)` → surface `oklch(100%)`
- **Ambient shadow** — `0px 12px 32px rgba(25, 28, 30, 0.06)`
- **Hover lift** — `translateY(-2px)` + slightly heavier shadow on interactive cards

**Radius scale**

| Context | Radius |
|---|---|
| Buttons | `0.75rem` |
| Cards (interior) | `1rem` |
| Landing cards | `1.25–1.5rem` |
| Icon containers | `0.65–0.75rem` |

---

## 5. Motion

### Rules
- **100ms** — button press
- **300ms** — state transitions (FAQ expand, nav scroll)
- **500ms** — standard content reveals
- **800ms** — hero headline clip-path reveal

### Easing
- Entrance: `cubic-bezier(0.16, 1, 0.3, 1)` (expo out) — snappy, confident
- Scroll-driven: `linear` for direct scroll-mapped properties (opacity, translate)

### Animation classes (landing page component CSS)

| Class | Keyframe | Use |
|---|---|---|
| `.animate-reveal-up` | `clip-path` bottom → open | Hero headline lines |
| `.animate-fade-in-down` | opacity + translateY(-8px) | Eyebrow badges |
| `.animate-fade-in` | opacity + translateY(16px) | General entrance |
| `.cta-pulse` | amber box-shadow pulse | Primary CTA button |

### Scroll-driven animations
`chapterProgress()` signal (0–1 per section) drives `[style.opacity]` and `[style.transform]` inline bindings. No IntersectionObserver — direct scroll math in `updateScrollMetrics()`.

### Reduced motion
```css
@media (prefers-reduced-motion: reduce) {
  .animate-reveal-up, .animate-fade-in-down, .animate-fade-in, .cta-pulse {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    clip-path: none !important;
  }
}
```

---

## 6. Landing Page Component Patterns

### Navigation
Sticky, transparent → `backdrop-filter: blur(16px)` + subtle border on scroll (`isScrolled()` signal). Mobile: logo + hamburger only; section links in a slide-down overlay.

### Lever cards (`.lever-card`)
Warm-tinted card with large faded number, amber icon container (top-right), title in uppercase Manrope, body in Inter. Bottom edge has a 3px amber progress bar driven by `chapterProgress()`. Hover: `translateY(-4px)` + shadow.

### Platform features (`.platform-feature`)
Horizontal list item with 40px circular amber icon container, title + copy. Hover: amber tinted background, icon scale(1.1).

### FAQ accordion (`.faq-item`, `.faq-question`, `.faq-answer`)
Border-bottom separators only (no card). Chevron rotates 180° on open (`faq-icon--open`). Answer uses `max-height` transition from 0 to 200px.

### Stat strip (`.stat-strip__card`)
Three inline cards: warm white background, amber-tinted border, center-aligned value + label.

### Phone mockup (`.phone-mockup`)
CSS-rendered dark frame + inner warm-tinted screen. Amber scanner line animates top-to-bottom driven by chapterProgress.

### Epilogue CTA section
Full amber-drenched background (`oklch(68% 0.17 55)`). Dark text on amber — not white, to avoid readability issues. Primary button: dark surface on amber.

---

## 7. Student Portal Interior Patterns

Uses `src/styles.css` global component classes. Key ones:

- **`.cuet-card`** — base card; variants: `--editorial`, `--premium`, `--glass`, `--tonal`
- **`.stat-card`** — dashboard KPI cards; color variants via `--blue`, `--indigo`, `--sky`, `--green`, `--amber`
- **`.content-card`** — resource/test list items with icon + body
- **`.section-head`** — eyebrow + title + optional action link
- **`.cuet-page-hero`** — page-level heading with eyebrow + title + subtitle
- **`.pill`** — badge chip; variants: `--free`, `--paid`, `--domain`, `--warn`, `--live`

---

## 8. Do's and Don'ts

### Do
- Use warm amber for active states, primary actions, and trust anchors (eyebrows, active nav)
- Single column on mobile (<640px) — budget Android is primary
- Use `clamp()` for fluid headline sizes
- Touch targets ≥ 48px
- Entrance animations with clip-path for hero text, opacity+translate for scroll sections
- Mention batch enrollment as "guided preparation", never as "paid content"

### Don't
- Don't use side-stripe borders (no `border-left` accent on cards or list items)
- Don't use gradient text (`background-clip: text` with a gradient)
- Don't use glassmorphism as a default pattern
- Don't add parallax — CSS entrance animations only on mobile
- Don't use em dashes. Use commas, colons, semicolons, or parentheses
- Don't highlight free vs paid split — no pricing section on landing page
- Don't skip `prefers-reduced-motion` fallback
