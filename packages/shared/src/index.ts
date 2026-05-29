export const PRODUCT_NAME = "House Designer";

export const SUPPORTED_UPLOAD_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/vnd.radiance",
  "model/gltf+json",
  "model/gltf-binary",
  "application/octet-stream"
] as const;

export type SupportedUploadMimeType = (typeof SUPPORTED_UPLOAD_MIME_TYPES)[number];

export type WorkspaceRole = "owner" | "admin" | "editor" | "viewer";

export type ViewportMode = "planning-2d" | "build-3d" | "walkthrough";

export interface HealthResponse {
  status: "ok";
  service: string;
  version: string;
  timestamp: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  ownerId: string;
  updatedAt: string;
  role: WorkspaceRole;
}
