# Infrastructure

This directory is reserved for deployable infrastructure definitions.

Phase 1 keeps infrastructure intentionally light:

- `docker-compose.yml` supports local PostgreSQL, API, and web development.
- `Dockerfile` validates a containerized workspace install and development command.
- GitHub Actions validate linting, typechecking, tests, builds, and Docker images.

Future phases can add Terraform, Pulumi, Helm, or provider-specific deployment
manifests without mixing infrastructure code into app packages.
