# Design Brief: Radiant Performance Report & Analysis

## 1. Feature Name & Description
**Radiant Performance Report**: A high-fidelity, editorial performance summary that transforms raw test data into a supportive "coaching session." It replaces cold charts with warm, radiant visualizations and elevated typography to build student confidence while providing clear paths for improvement.

## 2. User Stories / Job to be Done
- **Student Story:** "As an anxious CUET aspirant, I want to see my test results in a way that doesn't just judge me but shows me exactly where I am and how to get better, so I can stay motivated for JNU."
- **JTBD:** When I finish a test, I need to understand my performance hierarchy (Score -> Accuracy -> Gaps) so that I can prioritize my next hour of study without feeling overwhelmed.

## 3. Content & States (Hierarchy)
1. **The Sunrise Hero:** KPI dashboard showing Score, Accuracy, and Grade with the "Sunrise Glow."
2. **The Mentor's Card:** A prominent, full-width editorial section for coaching remarks.
3. **Radiant Analysis:** Progress bars for Correct/Incorrect/Skipped (Radiant style).
4. **Session Meta:** Compact info grid (Date, Duration, Category).
5. **Warm Leaderboard (Conditional):** Social context section, displayed **only** for "live" tests.
6. **The Review Journey:** Filtered list of questions at the bottom of the page.

## 4. Visual Direction (Radiant Mentor style)
- **Register:** Product.
- **Color Strategy:** **Committed.** Warm White background (`oklch(99% 0.006 80)`) with Confidence Amber (`oklch(68% 0.17 55)`) carrying ~30% of the visual weight in key indicators.
- **Typography:**
  - **Display:** Cormorant Garamond Italic for scores and grades.
  - **Headline:** Manrope for section titles.
  - **Body:** Inter for guidance text and question content.
- **Elevation:** "Desk Workspace" - large radius cards (1.25rem) with soft ambient shadows.

## 5. Constraints & Anti-goals
- **No Side-Stripe Borders:** Ban the use of `border-left` as an accent.
- **No Cold Neutrals:** Use amber-tinted grays only.
- **No Layout Animations:** Use transform/opacity only for state changes.
- **Mobile First:** One primary idea per viewport. Ensure question review handles long text gracefully.
- **No Comparison Metrics:** Focus on the current attempt's absolute data for this version.

## 6. Recommended References
- [spatial-design.md](spatial-design.md) - for the Desk Workspace layout.
- [color-and-contrast.md](color-and-contrast.md) - for the Radiant Amber palette.
- [typography.md](typography.md) - for the editorial serif/sans pairing.
- [interaction-design.md](interaction-design.md) - for the question review filters.

## 7. Specific Design Moves
- **Sunrise Grade:** The grade (A, B, C...) rendered in large Cormorant Garamond Italic with a soft amber glow behind it.
- **Radiant Progress Bars:** Thick, highly-rounded bars with subtle inner glows instead of flat fills.
- **The "Mentor's Card":** A full-width card for guidance with a distinct, slightly warmer background tint to make it feel like a personal note.
- **Status Dots:** Using the project's custom SVG dots (doughnut-dot-correct.svg, etc.) for question status.
