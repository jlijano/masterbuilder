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

The deployed web app now includes a browser-first MVP for project creation, local
project persistence, editor tools, object selection, material assignment, undo/redo,
local AI demo actions, and JSON export. These flows intentionally use `localStorage`
until the Phase 2 API and database modules are ready to back them.
