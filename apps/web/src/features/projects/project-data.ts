import type {
  DesignProject,
  EditorScene,
  FurnitureAsset,
  MaterialPreset,
  Point2D
} from "./project-types";

export const GRID_SIZE = 20;

export const defaultMaterials: MaterialPreset[] = [
  { color: "#cbd5e1", id: "mat-soft-plaster", name: "Soft plaster", opacity: 1, roughness: 0.74 },
  { color: "#8b5cf6", id: "mat-evening-violet", name: "Evening violet", opacity: 1, roughness: 0.62 },
  { color: "#14b8a6", id: "mat-teal-tile", name: "Teal tile", opacity: 1, roughness: 0.34 },
  { color: "#f59e0b", id: "mat-warm-oak", name: "Warm oak", opacity: 1, roughness: 0.48 },
  { color: "#475569", id: "mat-charcoal", name: "Charcoal composite", opacity: 1, roughness: 0.55 }
];

export const furnitureAssets: FurnitureAsset[] = [
  { assetId: "sofa-modern", category: "Living room", depth: 70, height: 32, name: "Modern sofa", width: 150 },
  { assetId: "table-coffee", category: "Living room", depth: 54, height: 18, name: "Coffee table", width: 92 },
  { assetId: "bed-queen", category: "Bedroom", depth: 160, height: 36, name: "Queen bed", width: 140 },
  { assetId: "island-kitchen", category: "Kitchen", depth: 82, height: 36, name: "Kitchen island", width: 160 },
  { assetId: "desk-studio", category: "Office", depth: 60, height: 30, name: "Studio desk", width: 120 },
  { assetId: "floor-lamp", category: "Lighting", depth: 32, height: 72, name: "Floor lamp", width: 32 }
];

const now = () => new Date().toISOString();

export function createId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 100000)}`;
}

export function snapPoint(point: Point2D, gridSize = GRID_SIZE): Point2D {
  return {
    x: Math.round(point.x / gridSize) * gridSize,
    y: Math.round(point.y / gridSize) * gridSize
  };
}

export function createEmptyScene(): EditorScene {
  return {
    furniture: [],
    materials: [...defaultMaterials],
    rooms: [],
    walls: []
  };
}

export function createSampleScene(): EditorScene {
  const wallMaterial = defaultMaterials[0]?.id ?? "mat-soft-plaster";
  const floorMaterial = defaultMaterials[3]?.id ?? "mat-warm-oak";
  const accentMaterial = defaultMaterials[2]?.id ?? "mat-teal-tile";

  return {
    furniture: [
      {
        assetId: "sofa-modern",
        category: "Living room",
        depth: 70,
        height: 32,
        id: createId("furniture"),
        materialId: accentMaterial,
        name: "Modern sofa",
        rotation: 0,
        type: "furniture",
        width: 150,
        x: 350,
        y: 340
      },
      {
        assetId: "table-coffee",
        category: "Living room",
        depth: 54,
        height: 18,
        id: createId("furniture"),
        materialId: wallMaterial,
        name: "Coffee table",
        rotation: 0,
        type: "furniture",
        width: 92,
        x: 380,
        y: 250
      }
    ],
    materials: [...defaultMaterials],
    rooms: [
      {
        id: createId("room"),
        materialId: floorMaterial,
        name: "Living studio",
        points: [
          { x: 220, y: 160 },
          { x: 620, y: 160 },
          { x: 620, y: 460 },
          { x: 220, y: 460 }
        ],
        type: "room"
      }
    ],
    walls: [
      {
        end: { x: 620, y: 160 },
        height: 280,
        id: createId("wall"),
        materialId: wallMaterial,
        start: { x: 220, y: 160 },
        thickness: 12,
        type: "wall"
      },
      {
        end: { x: 620, y: 460 },
        height: 280,
        id: createId("wall"),
        materialId: wallMaterial,
        start: { x: 620, y: 160 },
        thickness: 12,
        type: "wall"
      },
      {
        end: { x: 220, y: 460 },
        height: 280,
        id: createId("wall"),
        materialId: wallMaterial,
        start: { x: 620, y: 460 },
        thickness: 12,
        type: "wall"
      },
      {
        end: { x: 220, y: 160 },
        height: 280,
        id: createId("wall"),
        materialId: wallMaterial,
        start: { x: 220, y: 460 },
        thickness: 12,
        type: "wall"
      }
    ]
  };
}

export function createProject(name: string, description = "", withSampleScene = true): DesignProject {
  const timestamp = now();

  return {
    createdAt: timestamp,
    description,
    id: createId("project"),
    name,
    scene: withSampleScene ? createSampleScene() : createEmptyScene(),
    updatedAt: timestamp
  };
}

export function cloneScene(scene: EditorScene): EditorScene {
  return JSON.parse(JSON.stringify(scene)) as EditorScene;
}

export function getMaterialColor(scene: EditorScene, materialId: string): string {
  return scene.materials.find((material) => material.id === materialId)?.color ?? "#94a3b8";
}
