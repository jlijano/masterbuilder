# Testing

Testing is layered by package and risk area.

## Planned Coverage

- Engine: snapping, measurements, wall creation, room generation, undo/redo, serialization.
- API: health, project CRUD, material CRUD, furniture, uploads, AI fallback.
- Web: dashboard rendering, project creation form, editor stores, toolbar state, material panel.
- E2E: Playwright smoke flows for dashboard and editor loading.

## Phase 1 Status

Vitest and Playwright foundations are wired through package scripts. Feature tests
are added with the relevant implementation phases.
