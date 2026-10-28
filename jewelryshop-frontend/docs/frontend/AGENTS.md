# JewelryShop — Workspace Instructions for AI Agents

## Scope

These instructions apply when the task is about the JewelryShop frontend, UI/UX, React architecture, design-system work, or frontend/backend API integration. The repository contains separate Java/Spring Boot microservices; treat those services as the source of truth for business capabilities.

## Mandatory workflow before UI implementation

1. Inspect the actual repository tree and determine which services/frontends really exist.
2. Read actual controllers, request/response DTOs, validation rules, service methods, exception handling, JWT/security code, API Gateway routes/rewrites, configuration, and tests relevant to the proposed screens.
3. Read applicable skills before recommendations or coding. At minimum, when installed, use `react-best-practices`, `web-design-guidelines`, `ui-design`, `react`, `typescript`, `feature-arch`, `frontend-design`, and `ui-ux-pro-max` as relevant.
4. Read `DESIGN.md`. Compare all proposed UI choices with it. If Google Stitch mockups are available, inspect them and record what is represented by mockup only vs. verified backend support.
5. Produce the API capability matrix, UX journeys, screen inventory, design direction, frontend architecture, risks/gaps, and phased implementation roadmap under `docs/frontend/`.
6. Do not implement screens, install extra dependencies, change backend code, or modify API contracts during the planning-only phase.
7. Wait for explicit user approval of the plan before implementation.

## Technology direction

- Target frontend: React + TypeScript + Vite unless the existing repository establishes a different choice.
- MUI Material is the primary component library; use Emotion as its default styling engine.
- Use `i18next` and `react-i18next` for Vietnamese and English application strings.
- Prefer semantic HTML, accessible MUI components, responsive layouts, visible focus states, predictable interaction patterns, and useful loading/empty/error/success states.
- Do not introduce Tailwind CSS, shadcn/ui, a second component system, or a state-management library unless there is a specific, documented reason and user approval.
- Inspect the installed framework and library versions before applying any version-specific rule. Do not apply Next.js Server Components, App Router, or server-only rules to a Vite client application.
- Avoid unnecessary abstractions, premature global state, blanket memoization, decorative animation, and speculative dependencies.

## Rules precedence

1. User requirements and real JewelryShop business rules.
2. Verified backend API behavior, API Gateway exposure, security and tests.
3. `DESIGN.md` and approved Stitch mockups.
4. Official React Rules and React documentation.
5. Version-compatible installed skills: Vercel React Best Practices, Vercel Web Interface Guidelines, PyModel React Frontend Skills, UI/UX Pro Max, and selected community design skills.
6. General suggestions from an agent.

When rules conflict, explain the conflict and choose the narrowest rule compatible with the actual stack. Skills do not override source code, business rules, accessibility, security, or explicit project decisions.

## API and security rules

- Browser requests must use only externally exposed API Gateway routes verified from configuration.
- Never call `/internal/**` service-to-service endpoints directly from the browser.
- Never expose an internal service API key or server secret in frontend code or Vite environment variables. `VITE_*` values are public in the browser bundle.
- Do not invent endpoints, response fields, roles, status codes, prices, inventory availability, order states, payment support, account profile capabilities, reviews, wishlists, shipping, or delivery workflows.
- Backend responses are authoritative. Do not show a mutation as successful until the API confirms success.
- Do not blindly retry non-idempotent operations.
- JewelryShop does not provide shipping/delivery; do not create shipping address, delivery, or tracking flows.
- Clearly separate confirmed behavior, inference, unimplemented features, and unknowns.

## Design system and UX

- Treat `DESIGN.md` as the initial shared design direction. If the approved Stitch mockup differs, report the discrepancy and propose changes instead of silently maintaining multiple design systems.
- Keep colors, spacing, typography, radii, and interaction states in semantic MUI theme tokens where possible; avoid scattering raw hex values.
- Use product imagery and whitespace purposefully; ensure meaningful image alt text, stable image aspect ratios, responsive images, and lazy loading for non-critical imagery.
- Meet WCAG-oriented expectations: keyboard operation, visible focus, associated labels/errors, reasonable contrast, semantic heading hierarchy, reduced-motion support, and no meaning conveyed by color alone.
- Internationalize visible strings; do not hardcode UI text in components. Support `vi` and `en`, locale-aware formatting, a fallback language, and missing-key checks.
- Design explicit loading, empty, error, success, disabled, validation, unauthorized, and forbidden states for data-dependent screens.

## Code quality and verification after approval

- Follow the Rules of React: obey Hook rules, keep render pure, avoid mutating props/state, and handle effects only for external synchronization.
- Keep server state, URL query state, form state, and local UI state distinct.
- Type API request/response DTOs and avoid `any` unless the limitation is documented.
- Add/update tests for behavior; do not claim tests/build were run unless the command was actually executed.
- After implementation, run relevant lint, typecheck, test, and production build commands and report their actual output/status.
