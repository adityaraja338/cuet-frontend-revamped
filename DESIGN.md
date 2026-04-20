# Design System Specification: Academic Precision & Tonal Depth

## 1. Overview & Creative North Star: "The Digital Curator"

This design system is engineered to move beyond the utilitarian "dashboard" feel typical of student management platforms. Our Creative North Star is **The Digital Curator**. We treat academic data not as a spreadsheet, but as a prestigious editorial experience. 

The system leverages "Soft Minimalism"—a philosophy where clarity is achieved through massive amounts of negative space, high-contrast typography, and a "No-Line" architectural philosophy. By using intentional asymmetry, overlapping floating cards, and tonal layering, we create a platform that feels authoritative yet approachable, fostering a sense of trust and institutional prestige.

---

## 2. Colors: Tonal Architecture

Our palette is anchored by a vibrant, "Electric Academic" blue, balanced against a sophisticated range of slates. We do not use borders to define space; we use light.

### Palette Highlights
- **Primary (`#004ac6`)**: Used sparingly for high-impact actions and narrative highlights.
- **Surface & Background (`#f7f9fb`)**: A soft slate that reduces eye strain compared to pure white.
- **On-Surface (`#191c1e`)**: A charcoal grey that provides high-contrast legibility without the harshness of pure black.

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders are strictly prohibited for sectioning or card containment. 
Boundaries must be defined by:
1.  **Background Color Shifts:** Placing a `surface-container-low` section against a `surface` background.
2.  **Shadow Depth:** Using ambient, diffused shadows to lift elements.
3.  **Negative Space:** Using the spacing scale to create clear mental groupings.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine paper.
*   **Base Layer:** `surface` (`#f7f9fb`)
*   **Secondary Content:** `surface-container-low` (`#f2f4f6`)
*   **Floating Cards:** `surface-container-lowest` (`#ffffff`) - This creates a natural "pop" against the slate backgrounds.

### The "Glass & Gradient" Rule
To add a premium signature, use **Glassmorphism** for navigation bars and overlay modals.
*   **Token:** `surface` at 80% opacity + 20px backdrop-blur.
*   **Signature Textures:** Apply a subtle linear gradient from `primary` (`#004ac6`) to `primary_container` (`#2563eb`) on main CTAs to give them a three-dimensional "glow" that feels modern and energetic.

---

## 3. Typography: Editorial Authority

We use a duo-font approach to balance personality with extreme legibility.

*   **Display & Headlines (Manrope):** A geometric sans-serif with a modern, "tech-forward" spirit. It is used for large statements (`display-lg` at 3.5rem) to create an editorial feel.
*   **Body & UI (Inter):** The workhorse. Inter is used for all functional data, labels, and long-form text. Its high x-height ensures clarity in complex student records.

**Typography Strategy:** 
Use extreme scale contrast. A `display-md` headline should sit near a `body-md` description to create a clear visual hierarchy that guides the student's eye through the page without needing dividers.

---

## 4. Elevation & Depth: Tonal Layering

We avoid "floating" elements that look disconnected. Instead, we use **Tonal Layering**.

*   **The Layering Principle:** Place a `surface-container-lowest` (pure white) card on a `surface-container-low` (light slate) background. This creates a "soft lift" that feels architectural rather than digital.
*   **Ambient Shadows:** For elements that require a floating state (like a primary action button or a dropdown), use a shadow tinted with the `on-surface` color.
    *   *Shadow Spec:* `0px 12px 32px rgba(25, 28, 30, 0.06)`. Large blur, very low opacity.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., in high-contrast modes), use `outline-variant` (`#c3c6d7`) at **15% opacity**. Never use 100% opaque borders.

---

## 5. Components: Bespoke Elements

### Buttons
*   **Primary:** Gradient fill (`primary` to `primary_container`), `md` rounding (0.75rem), white text.
*   **Secondary:** `surface-container-high` background with `primary` text. No border.
*   **Tertiary:** Ghost style. No background, `primary` text, shifts to `surface-container-low` on hover.

### Input Fields
*   **Style:** Minimalist. `surface-container-lowest` fill.
*   **State:** Instead of a border-color change on focus, use a 2px `primary` bottom-bar and a subtle `surface-tint` shadow.
*   **Error:** Use `error` (`#ba1a1a`) for text and `error_container` for a subtle background wash within the field.

### Cards & Lists
*   **Rule:** Forbid divider lines. Use `md` (0.75rem) or `lg` (1rem) spacing between list items.
*   **Nesting:** Student profiles should appear as `surface-container-lowest` cards nested inside a `surface-container` page wrapper.

### Specialized Academic Components
*   **Course Progress Chips:** Use `secondary_container` with `on_secondary_container` text for a muted, professional look.
*   **Status Indicators:** Use "Soft Glow" dots. A small circle of the status color (e.g., `primary` for active) with a 4px blur of the same color behind it.

---

## 6. Do's and Don'ts

### Do
*   **Do use asymmetric layouts:** Align text to a grid but allow imagery or decorative "blobs" (as seen in the reference) to break the container.
*   **Do use Manrope for numbers:** Large academic scores or percentages should use `headline-lg` Manrope for a "premium stats" feel.
*   **Do prioritize breathing room:** If you think there is enough margin, double it.

### Don't
*   **Don't use 1px dividers:** Lines create visual "noise" that interrupts the flow of information.
*   **Don't use hard corners:** Avoid `none` or `sm` rounding unless for micro-labels. Academic environments should feel safe and "smooth."
*   **Don't use pure black:** Use `on-surface` charcoal to keep the "Light & Clean" promise.
*   **Don't over-shadow:** If a section doesn't need to "float," let background color shifts do the work. Over-shadowing makes a modern system feel like 2014-era Material Design.