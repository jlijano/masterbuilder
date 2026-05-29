# House Designer Platform

House Designer is a production-oriented monorepo foundation for an AI-powered,
browser-based home design platform. The product direction combines SketchUp-style
modeling, Sims build mode ergonomics, modern browser CAD workflows, a real-time 3D
editor, and SaaS-ready collaboration foundations.

This repository currently contains the Phase 1 foundation: workspace structure,
shared configuration, minimal app shells, Docker support, CI foundations, and
documentation. Later phases add the full Prisma schema, editor engine, polished
dashboard, 3D viewport, upload pipeline, AI provider abstraction, exports, teams,
billing, and hardening.

## Screenshots

Screenshots will be added once the editor shell and dashboard are implemented.

## Features

- Turborepo monorepo with pnpm workspaces
- Next.js App Router web application foundation
- Browser-local project creation, project opening, and scene persistence
- Interactive editor MVP with walls, rooms, furniture, materials, undo/redo, AI demo actions, and JSON export
- NestJS API foundation with `GET /health`
- Shared TypeScript package boundaries for UI, domain contracts, engine, database, and config
- Prisma database package foundation targeting PostgreSQL
- Docker Compose for local PostgreSQL, API, and web services
- GitHub Actions foundations for CI, linting, tests, Docker build validation, and deployment hooks
- Strict TypeScript, ESLint flat config, and Prettier setup
- Security, performance, deployment, collaboration, and roadmap documentation

## Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, Zustand, TanStack Query
- Backend: Node.js, NestJS, class-validator, Zod-ready validation boundaries
- Database: PostgreSQL and Prisma
- Tooling: pnpm, Turborepo, ESLint, Prettier, Vitest, Playwright foundation
- Deployment: Docker, Docker Compose, GitHub Actions, Vercel/Railway/Render-ready structure

## Repository Structure

```txt
/
├── apps/
│   ├── api/
│   └── web/
├── packages/
│   ├── config/
│   ├── database/
│   ├── engine/
│   ├── shared/
│   └── ui/
├── docs/
├── infra/
├── .github/workflows/
├── docker-compose.yml
├── Dockerfile
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Local Setup

```bash
pnpm install
cp .env.example .env
pnpm db:generate
pnpm dev
```

The web app runs on `http://localhost:3000`.
The API runs on `http://localhost:4000`.

## Database Setup

Start PostgreSQL with Docker Compose:

```bash
docker compose up postgres
```

Then run:

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

The Phase 1 Prisma schema only establishes the datasource and client generator.
Domain models are scheduled for Phase 2.

## Environment Variables

Copy `.env.example` to `.env` for local development. The sample includes safe
placeholders for the API, web app, PostgreSQL, authentication, storage, AI, and
billing provider foundations.

## Development Commands

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm format
```

## Docker

```bash
docker compose up --build
```

This starts PostgreSQL, the Nest API, and the Next.js web app.

## API Summary

Phase 1 includes:

- `GET /health`

Planned Phase 2 endpoints include projects, editor scene persistence, furniture,
materials, uploads, exports, AI, teams, billing, and activity logs.

## Deployment

The repository includes Docker and GitHub Actions foundations that do not require
production secrets. It also includes a Render Blueprint in `render.yaml` for a
web service, API service, and PostgreSQL database. See
[docs/deployment.md](docs/deployment.md).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) and [AGENTS.md](AGENTS.md).
