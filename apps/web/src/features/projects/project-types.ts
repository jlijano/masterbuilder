export type EditorTool =
  | "select"
  | "wall"
  | "room"
  | "door"
  | "window"
  | "furniture"
  | "material"
  | "measure";

export interface Point2D {
  x: number;
  y: number;
}

export interface MaterialPreset {
  color: string;
  id: string;
  name: string;
  opacity: number;
  roughness: number;
}

export interface WallObject {
  end: Point2D;
  height: number;
  id: string;
  materialId: string;
  start: Point2D;
  thickness: number;
  type: "wall";
}

export interface RoomObject {
  id: string;
  materialId: string;
  name: string;
  points: Point2D[];
  type: "room";
}

export interface FurnitureObject {
  assetId: string;
  category: string;
  depth: number;
  height: number;
  id: string;
  materialId: string;
  name: string;
  rotation: number;
  type: "furniture" | "door" | "window";
  width: number;
  x: number;
  y: number;
}

export type SceneObject = WallObject | RoomObject | FurnitureObject;

export interface EditorScene {
  furniture: FurnitureObject[];
  materials: MaterialPreset[];
  rooms: RoomObject[];
  walls: WallObject[];
}

export interface DesignProject {
  createdAt: string;
  description: string;
  id: string;
  name: string;
  scene: EditorScene;
  updatedAt: string;
}

export interface FurnitureAsset {
  assetId: string;
  category: string;
  depth: number;
  height: number;
  name: string;
  width: number;
}
