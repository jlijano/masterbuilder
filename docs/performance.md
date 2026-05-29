# Performance

The editor is expected to handle large scenes, heavy assets, and responsive local
interactions.

## Planned Strategy

- Route-level code splitting for editor modules.
- Lazy-loaded Three.js and asset-heavy views.
- Memoized scene graph rendering.
- Texture compression pipeline.
- Asset streaming interfaces.
- Web worker foundation for geometry operations.
- IndexedDB cache foundation for project and asset data.
- Virtualized catalog and hierarchy lists.

## Phase 1 Status

The package boundaries are ready for separating deterministic engine logic from
React rendering work.
