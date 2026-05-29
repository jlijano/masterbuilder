# Database

The database package owns Prisma schema, migrations, generated client access, and
seed data.

## Direction

- PostgreSQL is the primary database.
- Use explicit relations and indexes.
- Prefer structured columns for stable domain data.
- Use JSON fields only where the domain genuinely needs flexibility.
- Include ownership, team, timestamps, and soft-delete fields where appropriate.

## Phase 1 Status

The Prisma datasource and generator are present. Domain models and seed data are
scheduled for Phase 2.
