# Uploads

Uploads are stored through a provider interface so local development, S3-compatible
storage, and future media providers can share the same API boundary.

## Planned Flow

1. Validate file type and size in the client.
2. Validate file type and size again in the API.
3. Store metadata in PostgreSQL.
4. Store binary data through a storage provider.
5. Promote uploads into textures, materials, furniture assets, or inspiration images.

## Phase 1 Status

Environment variables and repository directories are prepared. The implementation
is scheduled for Phase 6.
