# Deployment

The monorepo is structured for separate frontend and API deployments.

## Targets

- Web: Vercel-compatible Next.js deployment.
- API: Railway, Render, AWS, or Docker-compatible Node runtime.
- Database: managed PostgreSQL or local Docker Compose for development.

## Current Automation

GitHub Actions validate installation, linting, typechecking, tests, app builds, and
Docker image construction without requiring production secrets.
