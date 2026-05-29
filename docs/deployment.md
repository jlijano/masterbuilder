# Deployment

The monorepo is structured for separate frontend and API deployments.

## Targets

- Web: Vercel-compatible Next.js deployment.
- API: Railway, Render, AWS, or Docker-compatible Node runtime.
- Database: managed PostgreSQL or local Docker Compose for development.

## Current Automation

GitHub Actions validate installation, linting, typechecking, tests, app builds, and
Docker image construction without requiring production secrets.

## Render

This repository includes a Render Blueprint at `render.yaml` with three resources:

- `house-designer-web`: Next.js web service.
- `house-designer-api`: NestJS API web service.
- `house-designer-db`: Render Postgres instance.

### Deploy With The Blueprint

1. Push this repository to GitHub or GitLab.
2. In Render, choose **New > Blueprint**.
3. Connect the repository and select the branch containing `render.yaml`.
4. Review the generated services and database.
5. Apply the Blueprint.

The Blueprint keeps the repository root as the build context because this is a
pnpm workspace and both apps depend on packages outside their app directories.

### Render URLs

The default environment values assume these public service URLs:

- `https://house-designer-web.onrender.com`
- `https://house-designer-api.onrender.com`

If Render assigns a different service slug, update:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_URL`
- `CORS_ORIGIN`

### Database Migrations

Phase 1 does not include domain migrations yet. Once Prisma migrations are added,
run them from a controlled release step. Render pre-deploy commands are the right
fit for paid web services, while free services should run migrations manually from
a trusted machine or temporary job before promoting the deployment.
