export interface Vector2 {
  x: number;
  y: number;
}

export interface EngineFeatureFlag {
  key: "snapping" | "measurements" | "undo-redo" | "serialization";
  enabled: boolean;
}

export const DEFAULT_ENGINE_FLAGS: EngineFeatureFlag[] = [
  { key: "snapping", enabled: true },
  { key: "measurements", enabled: true },
  { key: "undo-redo", enabled: true },
  { key: "serialization", enabled: true }
];
