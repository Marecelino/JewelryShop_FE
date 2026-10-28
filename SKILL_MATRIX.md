# Recommended Skill Stack — JewelryShop React + MUI

| Priority | Source | Skill/rule | Why use it | Guardrail |
|---|---|---|---|---|
| Required | React official docs | Rules of React | Hook correctness, pure rendering, immutable state and side effects | Official guidance; apply to installed React version |
| Required | `vercel-labs/agent-skills` | `react-best-practices` | Performance, fetching, request waterfalls, rerenders and bundle cost | Contains Next.js rules too; use only rules applicable to Vite/client React |
| Required | `vercel-labs/agent-skills` | `web-design-guidelines` | UI audit covering accessibility, focus, forms, animation, typography, images | Invoke during UI audit; refresh upstream guideline when reviewing |
| Required | `PyModel/react-frontend-skills` | `react` | Component, Hook and React patterns | Check rule applicability against actual React version |
| Required | `PyModel/react-frontend-skills` | `typescript` | Typed contracts and safer async/data flow | Avoid automatic upgrades just to match skill's audited version |
| Required | `PyModel/react-frontend-skills` | `ui-design` | Accessibility, hierarchy, layout, responsive UI and form UX | Use MUI components, not Tailwind/shadcn implementations |
| Required | `PyModel/react-frontend-skills` | `feature-arch` | Feature-based frontend organization | Keep architecture proportional; do not overabstract |
| Recommended | `PyModel/react-frontend-skills` | `tanstack-query` | Server-state fetching, caching and mutation invalidation | Install/use only after endpoint workflows are mapped |
| Recommended | `PyModel/react-frontend-skills` | `react-hook-form`, `zod` | Forms and client validation | Backend validation remains authoritative |
| Recommended | `PyModel/react-frontend-skills` | `vitest`, `playwright`, `msw` | Unit/integration/E2E tests and API mocks | Add progressively; do not mock away backend constraints |
| Recommended | `PyModel/react-frontend-skills` | `vercel-composition-patterns` | Component composition patterns | Do not force patterns where simple components suffice |
| Recommended | Antigravity Awesome Skills community collection | `frontend-design` | Aesthetic intention, distinctive but restrained visual design | Community skill; inspect contents/license; accessibility and project constraints take precedence |
| Required for design phase | UI/UX Pro Max | `ui-ux-pro-max` | Structured design-system, palette, typography, interaction and UX recommendations | Explicitly constrain to React + MUI + i18next; avoid Tailwind/shadcn assumptions |
| Optional | `google-labs-code/stitch-skills` | `design-md` and relevant Stitch workflow skills | Work with Stitch screens and maintain DESIGN.md | Optional if using Stitch's UI manually; check MCP permissions first |

## Avoid redundant or irrelevant skill installs

- Do not install every skill from a huge skills catalog. Keep workspace skills task-relevant.
- The PyModel README lists `vercel-composition-patterns`; it does not list a skill named exactly `react-ui-patterns`. Use `react`, `feature-arch`, and `vercel-composition-patterns` as the closest mapped coverage unless a separate verified `react-ui-patterns` skill is added.
- Do not install `nextjs`, `tailwind`, or `shadcn` purely because they are in the source repository. They are not part of the chosen stack.
- Avoid duplicate performance rules from multiple packs unless the agent records which source is authoritative for a decision.
