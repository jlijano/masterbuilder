# Backend

The API uses NestJS and will expose REST endpoints first, with WebSocket gateways
added for collaboration foundations.

## Direction

- Validate all external input with DTOs and validation pipes.
- Keep provider integrations behind service interfaces.
- Keep persistence-specific code behind repositories or service boundaries.
- Enforce project ownership and team membership checks before returning private data.

## Phase 1 Status

The API currently exposes `GET /health` and includes global validation pipe setup.
Feature modules are added in Phase 2 and beyond.
