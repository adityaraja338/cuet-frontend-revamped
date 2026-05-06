# Project Overview: CUET Corner

**Creative North Star:** "The Radiant Mentor"

CUET Corner is a high-authority educational platform designed to feel like a warm sunrise—a signal of hope and clarity for 16-17 year olds navigating the anxiety of university entrance exams. It prioritizes mentor-led guidance and clear progress visualizations over the aggressive sales tactics common in EdTech.

## Core Technologies
- **Framework:** Angular 21 (Modern component-based architecture)
- **Styling:** Tailwind CSS v4 (Utility-first with a hybrid OKLCH color strategy)
- **UI Components:** Ng-Zorro Ant Design (Ant Design for Angular)
- **State Management:** RxJS BehaviorSubjects and Signals (used in Landing Page)
- **Auth:** Google OAuth (via `angular-oauth2-oidc`)
- **Hosting:** Firebase

## Building and Running

### Development
- **Start Dev Server:** `npm run dev` or `ng serve` (Runs on `http://localhost:4200`)
- **Standard Start:** `npm start`
- **Linting:** `npm run lint`

### Production
- **Build:** `npm run build` (Outputs to `dist/cuet-frontend-revamped`)
- **SSR Server:** `npm run serve:ssr:cuet-frontend-revamped`

### Testing
- **Unit Tests:** `npm test` or `ng test`

## Development Conventions

### 1. Styling Strategy (Hybrid)
Follow the "Radiant Mentor" (Student) and "Strategic Architect" (Admin) design systems defined in `DESIGN.md`.
- **Tailwind Utilities:** Use for 90% of layout, spacing, and standard typography.
- **Scoped CSS:** Use for signature motifs (gradients, glows) and complex component states.
- **Color Model:** Prefer `oklch` for colors.
  - **Student (Radiance):** Confidence Amber (`oklch(68% 0.17 55)`).
  - **Admin (Authority):** Royal Amethyst (`oklch(45% 0.14 295)`).
- **Radius:** Bold containers use `rounded-4xl` (2rem); smaller cards use `rounded-xl`.

### 2. Architecture
- **Lazy Loading:** Modules are lazy-loaded via the router. `AdminModule` contains several sub-modules (`Dashboard`, `Resources`, `Tests`, `Batches`, `Students`, `Admins`, `EventsAndNotifications`) which must be styled with the "Strategic Architect" theme.
- **Global Service:** `GlobalService` handles shared state like `userDetails` and sidenav status.
- **Service-Driven Auth:** `StudentAuthService` and `AdminAuthService` manage session state and token cleanup.

### 3. Component Standards
- **Strict Typing:** All TypeScript code must be strictly typed. Avoid `any`.
- **Responsive-First:** Designs must be optimized for mobile (Budget Android priority).
- **Cognitive Load:** One primary idea per viewport. Use generous whitespace and large radii (`rounded-4xl`).
- **Admin Workspace:** Admin modules use a "Slim Dock" (64px) navigation to prioritize horizontal space for data management.

### 4. Branding & Tone
- **Supportive & Clear:** Lead with "What to do next?".
- **Non-FOMO:** Avoid countdowns or aggressive monetization.
- **University First:** Target "Top Central Universities" rather than just JNU in generalized copy.

---
*Refer to PRODUCT.md for brand strategy and DESIGN.md for detailed visual tokens.*
