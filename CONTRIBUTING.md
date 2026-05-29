# Contributing

Thanks for helping build House Designer. This project is structured as a
production monorepo, so changes should preserve package boundaries and keep the
workspace verifiable.

## Local Workflow

1. Install dependencies with `pnpm install`.
2. Copy `.env.example` to `.env`.
3. Run `pnpm lint`, `pnpm typecheck`, and `pnpm test` before opening a PR.
4. Run `pnpm build` for changes that affect app or package outputs.

## Code Style

- TypeScript is required.
- Keep files focused and reasonably sized.
- Prefer explicit domain types over loosely shaped objects.
- Avoid `any` unless the boundary cannot be represented safely.
- Add validation to API DTOs and external input boundaries.

## Pull Requests

Use small, reviewable PRs. Include a summary of changed behavior, verification
commands, and known follow-up work.
