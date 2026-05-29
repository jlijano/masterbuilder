# Agent Guide

This repository is being built in phases as a production-grade AI-powered house
designer platform. Keep changes scoped to the active phase unless a small
cross-cutting adjustment is required to keep the workspace buildable.

## Engineering Rules

- Use TypeScript for application and package code.
- Prefer package boundaries over cross-app imports.
- Keep shared domain contracts in `packages/shared`.
- Keep browser editor geometry logic in `packages/engine`.
- Keep reusable React primitives in `packages/ui`.
- Keep database client, Prisma schema, and seed code in `packages/database`.
- Validate inputs at API boundaries.
- Do not hardcode provider secrets or production credentials.
- Add tests with the feature or bug fix that needs them.

## Commands

```bash
pnpm install
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Phase Notes

- Phase 1: repository foundation and CI scaffolding.
- Phase 2: Prisma schema, database seed data, and API CRUD foundations.
- Phase 3: web shell, dashboard, project manager, and auth abstraction.
- Phase 4+: editor, engine, materials, furniture, AI, exports, collaboration, and hardening.
