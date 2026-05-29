# Architecture

House Designer is organized as a pnpm and Turborepo monorepo with deployable apps
in `apps/` and reusable capabilities in `packages/`.

## Boundaries

- `apps/web`: browser client, editor shell, dashboard, and SaaS UI.
- `apps/api`: REST API, validation, authorization, storage, AI, exports, billing, and collaboration gateways.
- `packages/shared`: cross-runtime domain contracts.
- `packages/ui`: reusable React primitives and design system components.
- `packages/engine`: geometry, snapping, measurement, selection, history, and scene serialization logic.
- `packages/database`: Prisma schema, migrations, generated client, and seed data.
- `packages/config`: shared tooling configuration.

## Phase 1 Status

The repository foundation is in place. Later phases fill in the production schema,
feature modules, and editor systems while preserving these boundaries.
