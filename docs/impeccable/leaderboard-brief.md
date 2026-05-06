# Design Brief: Radiant Leaderboard

## 1. Feature Summary
A prestigious, supportive leaderboard for CUET aspirants to view the Top 10 performers. It transforms a standard ranking table into an aspirational "Hall of Fame" that motivates students during their exploration phase.

## 2. Primary User Action
Aspirants should feel inspired by the top performers and understand the level of excellence required for top-tier universities.

## 3. Design Direction
- **Color Strategy:** Committed (Top 3 use saturated Confidence Amber and Radiant glows).
- **Theme Scene Sentence:** A student in a quiet library at sunset, looking at a wall of prestigious alumni, feeling a mix of awe and "I can be there too."
- **Anchor References:** 
    - *The New York Times* Editorial Sports Tables (Precision + Typography).
    - *Stripe* Dashboard (Clean layout + subtle glows).
    - *Apple* Award Winner cards (Elevation + Prestige).

## 4. Scope
- **Fidelity:** Production-ready.
- **Breadth:** Single component (Top 10 list).
- **Interactivity:** Static display with subtle hover elevation on rows.
- **Time Intent:** Polished for shipping.

## 5. Layout Strategy
- **Top 3 Podium:** Elevated visual treatment at the top to give the winners "breathing room" and prestige.
- **Top 10 List:** A clean, high-authority list below the podium.
- **Typography:** `font-display` (Italic) for the rank numbers of the Top 3; `font-headline` for names; `font-body` for scores.

## 6. Key States
- **Default:** Showing Top 10 users.
- **Empty:** "The stage is set. Be the first to claim your spot." (Encouraging mentor tone).
- **Loading:** Shimmering skeleton rows following the same hierarchy.

## 7. Content Requirements
- Rank (1-10)
- Student Name
- Score / Points
- Time Taken (Scoped for future).

## 8. Recommended References
- `spatial-design.md` (Podium vs List rhythm)
- `typography.md` (Prestigious ranking numbers)
- `color-and-contrast.md` (Radiant Top 3 glows)

## 9. Open Questions
- Should we use real student photos or "Mentor Avatars" (initials/icons)? *Decision: Initials/Avatars for now to maintain academic focus.*
