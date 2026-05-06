---
name: CUET Corner
description: A warm, radiant educational platform for CUET aspirants.
colors:
  primary: "#f59e0b"
  primary-container: "#fde68a"
  on-primary: "#ffffff"
  background: "#f7f9fb"
  surface: "#ffffff"
  surface-container-low: "#f2f4f6"
  headline: "#191c1e"
  body: "#434655"
typography:
  display:
    fontFamily: "Cormorant Garamond, serif"
    fontSize: "clamp(2rem, 5vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.1
    fontStyle: "italic"
    class: "font-display"
  headline:
    fontFamily: "Manrope, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.3
    class: "font-headline"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    class: "font-body"
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.4
    class: "font-label"
rounded:
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.25rem"
  4xl: "2rem"
spacing:
  xs: "0.5rem"
  sm: "1rem"
  md: "1.5rem"
  lg: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.5rem"
  card-cuet:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.xl}"
    padding: "1.5rem"
---

# Design System: CUET Corner

## 1. Overview

**Creative North Star: "The Radiant Mentor"**

CUET Corner is designed to feel like a warm sunrise—a signal of hope and clarity for 16-17 year olds navigating the anxiety of university entrance exams. The aesthetic is "Supportive Mentor": authoritative yet approachable, replacing the cold, utilitarian feel of traditional EdTech with a prestigious, editorial experience.

This system explicitly rejects the "Batch Bazaar" clutter and FOMO-driven tactics of competitors. Instead, it prioritizes **Mentor’s Guidance**, using light and space to reduce cognitive load and build confidence through clear, beautiful progress visualizations.

**Key Characteristics:**
- **Warmth over Drama:** Amber-tinted neutrals and soft light over cold grays.
- **Clarity over Density:** One primary idea per viewport; breathing room for the story.
- **Supportive Elevation:** Surfaces that float slightly, suggesting a workspace that is organized and ready.

## 2. Colors: The Sunrise Palette

The palette is anchored in warm, radiant tones that signal optimism and guidance.

### Primary
- **Confidence Amber** (`oklch(68% 0.17 55)`): The primary brand color, used for trust anchors, primary actions, and success signals. It is "Supportive Mentor" in color form.

### Neutral
- **Warm White Background** (`oklch(99% 0.006 80)`): The primary canvas, tinted with a hint of amber to avoid eye strain and clinical coldness.
- **Headline Slate** (`oklch(14% 0.01 260)`): Near-black with a deep navy undertone for high-authority typography.
- **Body Graphite** (`oklch(38% 0.01 260)`): A softer, readable gray for long-form educational content.

### Named Rules
**The 10% Radiance Rule.** The primary Confidence Amber is used on ≤10% of any given screen. Its rarity makes it a powerful signal for "what to do next."

## 3. Typography: Editorial Authority

The typography pairing creates a "digital curator" feel, blending the prestige of print with the speed of digital. All components MUST use semantic font classes rather than generic utilities.

- **Display (`font-display`):** Cormorant Garamond (Serif, Italic). Used for KPI values and hero moments. The italic Cormorant Garamond adds an academic, elite university touch.
- **Headline (`font-headline`):** Manrope (Geometric Sans). Used for section titles, card headings, and interactive tab labels. Snappy and authoritative.
- **Body (`font-body`):** Inter (Humanist Sans). Used for all paragraph text, question content, and descriptive labels. Line length capped at 65–75ch for optimal reading.
- **Label (`font-label`):** Inter (Bold Sans). Used for eyebrows, status pills, and instructional indicators (e.g., "Your Choice").

## 4. Elevation: The Desk Workspace

CUET Corner uses a "slight lifted and floating" philosophy. Elements should feel like high-quality cards placed on a clean desk—organized and distinct.

**The Soft Shadow Rule.** Shadows are never structural or heavy. Use `0px 12px 32px rgba(25, 28, 30, 0.06)` for ambient depth. Depth is a response to organization, not a decoration.

## 5. Components: Tactile Guidance

Interactions are **soft and deliberate**, favoring calm confidence over hyper-active feedback.

### Buttons
- **Shape:** Rounded (0.75rem - 1rem radius)
- **Primary (.btn-cuet--primary):** Confidence Amber background with white text. Transition is a soft 400ms cubic-bezier.
- **Secondary (.btn-cuet--secondary):** Outlined amber; used for supportive actions.

### Cards (.card-cuet)
- **Corner Style:** Large radius (1.25rem / `rounded-xl`). **Main containers use `rounded-4xl` (2rem)** to create a bold, distinct workspace.
- **Background:** Warm white or pure white.
- **Hover Strategy:** `translateY(-4px)` with a slight increase in ambient shadow.

### Admin: The Slim Dock (.admin-dock)
- **Style:** 64px vertical navigation bar (icon-only by default).
- **Background:** High-contrast Headline Slate or pure white with a Precision Border.
- **Interaction:** Expands to 256px on hover or toggle to reveal labels, ensuring maximum horizontal space for the workspace.

### Pills (.pill-cuet)
- **Style:** Fully rounded (999px), subtle tinted background, bold uppercase Manrope text.

## 7. Implementation: Hybrid CSS Strategy

To maintain both visual precision and developer velocity, CUET Corner follows a hybrid styling approach:

### Tailwind First (Utilities)
Use **Tailwind CSS utilities** for 90% of layout, spacing, and standard typography:
- **Layout:** `flex`, `grid`, `grid-cols-*`, `gap-*`, `hidden`, `block`.
- **Spacing:** `p-*`, `m-*`, `space-y-*`.
- **Typography:** `font-display`, `font-headline`, `font-body`, `font-label`, `text-sm`, `font-bold`.
- **Visuals:** `rounded-*`, `rounded-4xl`, `shadow-*`, `opacity-*`, `bg-surface`.

### Custom Second (Complex Craft)
Use **Scoped Custom CSS** only for signature "Radiant Mentor" effects and complex component states:
- **Signature Motifs:** `sunrise-gradient`, `grade-sunrise` (glows), `radiant-bar`.
- **Complex Layouts:** `desk-workspace` (specific card treatments). Main containers act as standalone workspaces, avoiding unnecessary nesting or "editorial frames."
- **Custom Tokens:** Referencing `oklch` brand variables that aren't yet mapped to Tailwind primitives.

### Naming Convention
- **Utility:** Tailwind standard (`flex gap-4`).
- **Component:** Prefix with `pd-` (Performance Detail) or `cuet-` (Global Component).

## 8. Do's and Don'ts

Guardrails derived from the "Radiant Mentor" strategy and "Education-First" principles.

### Do:
- **Do** use `clamp()` for fluid, readable headlines across budget Android devices.
- **Do** ensure touch targets are at least 48px for mobile accessibility.
- **Do** lead with "Mentor’s Guidance"—every screen must answer "What's next?".

### Don't:
- **Don't** use side-stripe borders as colored accents on cards.
- **Don't** use gradient text; maintain solid color authority.
- **Don't** use FOMO tactics like countdown timers or "Batch Bazaar" clutter.
- **Don't** use glassmorphism as a default; keep surfaces grounded and clear.
- **Don't** use em dashes—prefer commas, colons, or parentheses for clarity.
ctics like countdown timers or "Batch Bazaar" clutter.
- **Don't** use glassmorphism as a default; keep surfaces grounded and clear.
- **Don't** use em dashes—prefer commas, colons, or parentheses for clarity.
