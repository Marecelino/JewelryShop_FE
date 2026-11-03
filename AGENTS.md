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

## SPA architecture and routing

JewelryShop is a **single-page application**. Every screen is a client-side route rendered inside one HTML shell (`index.html`). Do not create separate HTML entry points, do not use full-page `<a href>` navigations within the application, and do not reload the page during normal user flow.

**Approved routing library**: React Router DOM v7 (`react-router-dom@^7.18.5`). Do not introduce a second router. Use `BrowserRouter` (or `RouterProvider` with `createBrowserRouter`) at the application root. All routes are client-side; the server or static host must serve `index.html` for every URL.

**Route configuration** lives in `src/routes/index.tsx`. Page-level components live in `src/features/*/pages/` or `src/pages/`. Layouts are in `src/layouts/`. Never define routes inside page components.

**Confirmed route inventory** (source of truth: `docs/frontend/02-user-journeys-and-screen-inventory.md` and verified API capability matrix):

| Pattern | Screen | Layout | Access |
|---|---|---|---|
| `/` | Catalog / storefront home | `StorefrontLayout` | `ROLE_USER` or `ROLE_ADMIN` (GAP-02) |
| `/login` | Login | `RootLayout` (no nav) | Public (unauthenticated) |
| `/register` | Register | `RootLayout` (no nav) | Public (unauthenticated) |
| `/profile` | User profile (read-only) | `StorefrontLayout` | Any authenticated |
| `/products/:productId` | Product detail | `StorefrontLayout` | `ROLE_USER` or `ROLE_ADMIN` |
| `/cart` | Cart (client-side state) | `StorefrontLayout` | Any authenticated |
| `/checkout` | Order confirmation / reservation | `StorefrontLayout` | `ROLE_USER` or `ROLE_ADMIN` |
| `/orders` | Order list | `StorefrontLayout` | Any authenticated |
| `/orders/:orderReference` | Order detail + cancel | `StorefrontLayout` | Any authenticated (ownership checked by backend) |
| `/admin/products` | Product catalog management | `AdminLayout` | `ROLE_ADMIN` only |
| `/admin/inventory` | Physical inventory management | `AdminLayout` | `ROLE_ADMIN` only |
| `/admin/orders` | System-wide order oversight | `AdminLayout` | `ROLE_ADMIN` only |
| `*` | Not-found | `RootLayout` | Public |

Do not add routes not listed above without verifying backend capability and documenting the addition.

**Navigation rules**:
- Use `<Link>` or `useNavigate()` for all in-app navigation. Never use `window.location.href` for in-app navigation (reserve it only for the confirmed 401-forced logout redirect which must clear client state first).
- URL query parameters are the source of truth for catalog filter (`category`), pagination (`page`, `size`), sort (`sort`), and search state. Manage with `useSearchParams`. Reading filter state from URL enables bookmarking and browser Back/Forward.
- Do not reset pagination when only the sort order changes, and do not scroll to top when only query parameters change.
- Scroll to top on route change (path change), not on query-parameter-only updates.
- Restore scroll position correctly after browser Back navigation where the browser restores it automatically; do not fight the browser's default behavior.

**Authentication and authorization guards**:
- `ProtectedRoute` redirects unauthenticated users to `/login` and preserves the intended destination in `state.from` for post-login redirect.
- `RoleGuard` (for admin routes) renders a `403 Forbidden` screen for authenticated users without `ROLE_ADMIN`. It does not redirect to login because the user is already authenticated.
- Never hide admin routes merely by removing navigation links. The route itself must enforce role checking.
- Do not read roles from a locally computed value that could be stale. The role is decoded from the stored JWT claims at login time and written into the auth store.

**Lazy loading**:
- Wrap admin page components and the checkout/order flows in `React.lazy()` and `<Suspense>` with a skeleton fallback. The login, register, and catalog pages are in the critical path and may be eagerly loaded.

**SPA fallback and deployment**:
- For local Vite dev: the dev server automatically serves `index.html` for unknown routes. No additional configuration needed.
- For production deployment: the static host **must** be configured to serve `index.html` for all 404 paths. Record the specific host's configuration approach in the deployment section of `docs/frontend/04-frontend-architecture.md` before deploying.
  - Vite preview (built-in): `vite preview` does not configure SPA fallback. Use `--base /` and a host that supports SPA rewriting.
  - Nginx: `try_files $uri $uri/ /index.html;`
  - Vercel: `"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]`
  - Apache: `.htaccess` with `FallbackResource /index.html`

**Page titles and metadata**:
- This is a **client-rendered SPA**. Titles are set at runtime via `document.title` in each page component (or via a `useDocumentTitle` hook). Do not use a server-rendering framework.
- Every route must set a descriptive `document.title` on mount: e.g., `"Chi tiết sản phẩm — JewelryShop"`.
- Public catalog and product detail pages are not indexable by search crawlers in a pure CSR SPA without pre-rendering. Document this limitation in `docs/frontend/07-backend-gaps-and-risk-register.md`. Do not silently introduce Next.js or a pre-rendering tool to solve it; propose it as a separate decision.
- Add a `<meta name="description">` in `index.html` as a baseline for the homepage. Page-specific meta descriptions require pre-rendering, which is out of scope until explicitly approved.

**Loading and navigation reliability**:
- Every data-dependent page must render a loading skeleton (not a spinner that shifts layout) while the initial query is pending.
- Navigation during an in-flight request must not crash the component. TanStack Query's `queryClient.cancelQueries()` handles cancellation automatically when the component unmounts.
- A failed navigation-triggered query (network error, 503) must render the page's error state inline; it must never white-screen or leave the user on the previous route with stale data.
- Do not use `window.history.pushState` or `window.history.replaceState` directly. Use React Router's `navigate()` or `<Navigate>`.

**Breadcrumb navigation**:
- Use breadcrumbs on product detail pages (`Home > Products > {productName}`) and all admin sub-pages (`Admin > Products > Edit`).
- Breadcrumbs use MUI `<Breadcrumbs>` with `<Link>` components. The current page is text-only (not a link).

## Responsive navigation

- On **desktop** (≥900px): sticky `<AppBar>` with logo, primary nav links, language switcher, cart icon with badge, and account menu. Navigation links are visible inline.
- On **tablet and mobile** (<900px): the primary nav links collapse into a hamburger icon that opens a `<Drawer>` from the left. The cart icon and account icon remain visible in the `<Toolbar>`.
- The mobile drawer must trap focus when open, close on `Escape`, and return focus to the trigger button when closed.
- All interactive controls in the navigation must be keyboard accessible and have visible focus indicators.
- No critical action (login, cart, account) may be hidden on any viewport width.
- Navigation must not cause horizontal overflow at any breakpoint.

## Code quality and verification after approval

- Follow the Rules of React: obey Hook rules, keep render pure, avoid mutating props/state, and handle effects only for external synchronization.
- Keep server state, URL query state, form state, and local UI state distinct.
- Type API request/response DTOs and avoid `any` unless the limitation is documented.
- Add/update tests for behavior; do not claim tests/build were run unless the command was actually executed.
- After implementation, run relevant lint, typecheck, test, and production build commands and report their actual output/status.
