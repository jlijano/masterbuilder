# Frontend

The web application uses Next.js App Router, React, TypeScript, and Tailwind CSS.

## Direction

- Dark mode first.
- Editor routes should be lazy-loaded.
- Server state belongs in TanStack Query.
- Editor-local state belongs in Zustand.
- Reusable primitives belong in `packages/ui`.
- Domain contracts should come from `packages/shared`.

## Phase 1 Status

The app contains a minimal first viewport proving workspace wiring and UI package
consumption. Dashboard, project manager, auth abstraction, and editor shell are
scheduled for later phases.
