"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, MouseEvent, useEffect, useMemo, useState } from "react";
import {
  deleteUploadedAsset,
  fileToDataUrl,
  loadUploadedAssets,
  saveUploadedAssets
} from "./asset-storage";
import {
  cloneScene,
  createId,
  createProject,
  defaultMaterials,
  furnitureAssets,
  getMaterialColor,
  snapPoint
} from "./project-data";
import { loadProjects, saveProjects, upsertProject } from "./project-storage";
import type {
  DesignProject,
  EditorScene,
  EditorTool,
  FurnitureAsset,
  FurnitureObject,
  MaterialPreset,
  Point2D,
  RoomObject,
  SceneObject,
  WallObject
} from "./project-types";

interface SceneObjectPatch {
  name?: string;
  rotation?: number;
  thickness?: number;
  width?: number;
}

const viewBox = {
  height: 640,
  width: 1000
};

const tools: { id: EditorTool; label: string }[] = [
  { id: "select", label: "Select" },
  { id: "wall", label: "Wall" },
  { id: "room", label: "Room" },
  { id: "door", label: "Door" },
  { id: "window", label: "Window" },
  { id: "furniture", label: "Furniture" },
  { id: "material", label: "Paint" },
  { id: "measure", label: "Measure" }
];

function isEditorTool(value: string | null): value is EditorTool {
  return tools.some((tool) => tool.id === value);
}

function findObject(scene: EditorScene, objectId: string): SceneObject | undefined {
  return [...scene.rooms, ...scene.walls, ...scene.furniture].find((object) => object.id === objectId);
}

function objectLabel(object: SceneObject): string {
  if (object.type === "wall") {
    return "Wall";
  }

  return object.name;
}

function distance(first: Point2D, second: Point2D): number {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

function offsetPoint(point: Point2D, amount: number): Point2D {
  return { x: point.x + amount, y: point.y + amount };
}

function formatMeasurement(value: number): string {
  return `${Math.round(value / 10) / 10} m`;
}

function patternId(materialId: string): string {
  return `material-${materialId.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function getMaterialFill(scene: EditorScene, materialId: string): string {
  const material = scene.materials.find((candidate) => candidate.id === materialId);
  return material?.textureDataUrl ? `url(#${patternId(material.id)})` : material?.color ?? "#94a3b8";
}

export function EditorClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedProjectId = searchParams.get("projectId");
  const requestedTool = searchParams.get("tool");
  const [project, setProject] = useState<DesignProject | null>(null);
  const [activeTool, setActiveTool] = useState<EditorTool>("select");
  const [selectedId, setSelectedId] = useState("");
  const [selectedMaterialId, setSelectedMaterialId] = useState(defaultMaterials[0]?.id ?? "");
  const [activeAssetId, setActiveAssetId] = useState(furnitureAssets[0]?.assetId ?? "");
  const [uploadedAssets, setUploadedAssets] = useState<FurnitureAsset[]>([]);
  const [draftWallStart, setDraftWallStart] = useState<Point2D | null>(null);
  const [measureStart, setMeasureStart] = useState<Point2D | null>(null);
  const [measureEnd, setMeasureEnd] = useState<Point2D | null>(null);
  const [history, setHistory] = useState<EditorScene[]>([]);
  const [future, setFuture] = useState<EditorScene[]>([]);
  const [status, setStatus] = useState("Select a tool and click the grid.");

  const allFurnitureAssets = useMemo(
    () => [...furnitureAssets, ...uploadedAssets],
    [uploadedAssets]
  );

  useEffect(() => {
    setUploadedAssets(loadUploadedAssets());
  }, []);

  useEffect(() => {
    if (isEditorTool(requestedTool)) {
      setActiveTool(requestedTool);
      setStatus(`${tools.find((tool) => tool.id === requestedTool)?.label ?? "Tool"} tool active.`);
    }
  }, [requestedTool]);

  useEffect(() => {
    const projects = loadProjects();
    const matchedProject = requestedProjectId
      ? projects.find((candidate) => candidate.id === requestedProjectId)
      : projects[0];

    if (matchedProject) {
      setProject(matchedProject);
      setSelectedMaterialId(matchedProject.scene.materials[0]?.id ?? defaultMaterials[0]?.id ?? "");

      if (!requestedProjectId) {
        router.replace(`/editor?projectId=${matchedProject.id}`);
      }

      return;
    }

    const createdProject = createProject("Untitled design", "Created from the editor.", true);
    saveProjects([createdProject, ...projects]);
    setProject(createdProject);
    router.replace(`/editor?projectId=${createdProject.id}`);
  }, [requestedProjectId, router]);

  const selectedObject = useMemo(() => {
    if (!project || !selectedId) {
      return undefined;
    }

    return findObject(project.scene, selectedId);
  }, [project, selectedId]);

  const activeAsset = useMemo(
    () =>
      allFurnitureAssets.find((candidate) => candidate.assetId === activeAssetId) ??
      allFurnitureAssets[0],
    [activeAssetId, allFurnitureAssets]
  );

  function commitScene(nextScene: EditorScene, nextStatus: string, selectObjectId?: string) {
    setProject((currentProject) => {
      if (!currentProject) {
        return currentProject;
      }

      setHistory((currentHistory) => [cloneScene(currentProject.scene), ...currentHistory].slice(0, 50));
      setFuture([]);

      const nextProject = {
        ...currentProject,
        scene: nextScene,
        updatedAt: new Date().toISOString()
      };
      upsertProject(nextProject);
      return nextProject;
    });

    if (selectObjectId !== undefined) {
      setSelectedId(selectObjectId);
    }

    setStatus(nextStatus);
  }

  function restoreScene(nextScene: EditorScene) {
    setProject((currentProject) => {
      if (!currentProject) {
        return currentProject;
      }

      const nextProject = {
        ...currentProject,
        scene: nextScene,
        updatedAt: new Date().toISOString()
      };
      upsertProject(nextProject);
      return nextProject;
    });
  }

  function undo() {
    if (!project || history.length === 0) {
      return;
    }

    const [previousScene, ...remainingHistory] = history;
    if (!previousScene) {
      return;
    }

    setFuture((currentFuture) => [cloneScene(project.scene), ...currentFuture]);
    setHistory(remainingHistory);
    restoreScene(previousScene);
    setSelectedId("");
    setStatus("Undo applied.");
  }

  function redo() {
    if (!project || future.length === 0) {
      return;
    }

    const [nextScene, ...remainingFuture] = future;
    if (!nextScene) {
      return;
    }

    setHistory((currentHistory) => [cloneScene(project.scene), ...currentHistory]);
    setFuture(remainingFuture);
    restoreScene(nextScene);
    setSelectedId("");
    setStatus("Redo applied.");
  }

  function getSvgPoint(event: MouseEvent<SVGSVGElement>): Point2D {
    const bounds = event.currentTarget.getBoundingClientRect();
    return snapPoint({
      x: ((event.clientX - bounds.left) / bounds.width) * viewBox.width,
      y: ((event.clientY - bounds.top) / bounds.height) * viewBox.height
    });
  }

  function addRoom(point: Point2D) {
    if (!project) {
      return;
    }

    const width = 260;
    const depth = 180;
    const room: RoomObject = {
      id: createId("room"),
      materialId: selectedMaterialId,
      name: `Room ${project.scene.rooms.length + 1}`,
      points: [
        point,
        { x: point.x + width, y: point.y },
        { x: point.x + width, y: point.y + depth },
        { x: point.x, y: point.y + depth }
      ],
      type: "room"
    };

    const walls: WallObject[] = room.points.map((start, index) => ({
      end: room.points[(index + 1) % room.points.length] ?? start,
      height: 280,
      id: createId("wall"),
      materialId: selectedMaterialId,
      start,
      thickness: 12,
      type: "wall"
    }));

    commitScene(
      {
        ...project.scene,
        rooms: [...project.scene.rooms, room],
        walls: [...project.scene.walls, ...walls]
      },
      `Created ${room.name}.`,
      room.id
    );
  }

  function addFurniture(point: Point2D, type: FurnitureObject["type"]) {
    if (!project) {
      return;
    }

    const asset =
      allFurnitureAssets.find((candidate) => candidate.assetId === activeAssetId) ??
      allFurnitureAssets[0];

    if (!asset) {
      return;
    }

    const furniture: FurnitureObject = {
      assetId: asset.assetId,
      category: type === "furniture" ? asset.category : type,
      depth: type === "door" ? 16 : type === "window" ? 14 : asset.depth,
      height: type === "door" ? 210 : type === "window" ? 120 : asset.height,
      id: createId(type),
      materialId: selectedMaterialId,
      name: type === "furniture" ? asset.name : type === "door" ? "Door opening" : "Window opening",
      rotation: 0,
      type,
      width: type === "door" ? 80 : type === "window" ? 110 : asset.width,
      x: point.x,
      y: point.y
    };

    commitScene(
      {
        ...project.scene,
        furniture: [...project.scene.furniture, furniture]
      },
      `Placed ${furniture.name}.`,
      furniture.id
    );
  }

  function handleWallClick(point: Point2D) {
    if (!project) {
      return;
    }

    if (!draftWallStart) {
      setDraftWallStart(point);
      setStatus("Wall start placed. Click another grid point to finish the wall.");
      return;
    }

    if (draftWallStart.x === point.x && draftWallStart.y === point.y) {
      setStatus("Choose a different point to create a wall.");
      return;
    }

    const wall: WallObject = {
      end: point,
      height: 280,
      id: createId("wall"),
      materialId: selectedMaterialId,
      start: draftWallStart,
      thickness: 12,
      type: "wall"
    };

    setDraftWallStart(null);
    commitScene(
      {
        ...project.scene,
        walls: [...project.scene.walls, wall]
      },
      `Created wall ${formatMeasurement(distance(wall.start, wall.end))}.`,
      wall.id
    );
  }

  function handleMeasureClick(point: Point2D) {
    if (!measureStart) {
      setMeasureStart(point);
      setMeasureEnd(null);
      setStatus("Measurement start placed. Click another point.");
      return;
    }

    setMeasureEnd(point);
    setStatus(`Measurement: ${formatMeasurement(distance(measureStart, point))}.`);
  }

  function handleCanvasClick(event: MouseEvent<SVGSVGElement>) {
    if (!project) {
      return;
    }

    const point = getSvgPoint(event);

    if (activeTool === "select") {
      setSelectedId("");
      setStatus("Selection cleared.");
    }

    if (activeTool === "wall") {
      handleWallClick(point);
    }

    if (activeTool === "room") {
      addRoom(point);
    }

    if (activeTool === "furniture") {
      addFurniture(point, "furniture");
    }

    if (activeTool === "door") {
      addFurniture(point, "door");
    }

    if (activeTool === "window") {
      addFurniture(point, "window");
    }

    if (activeTool === "measure") {
      handleMeasureClick(point);
    }
  }

  function applyMaterial(objectId: string) {
    if (!project) {
      return;
    }

    const scene = project.scene;
    const nextScene: EditorScene = {
      ...scene,
      furniture: scene.furniture.map((object) =>
        object.id === objectId ? { ...object, materialId: selectedMaterialId } : object
      ),
      rooms: scene.rooms.map((object) =>
        object.id === objectId ? { ...object, materialId: selectedMaterialId } : object
      ),
      walls: scene.walls.map((object) =>
        object.id === objectId ? { ...object, materialId: selectedMaterialId } : object
      )
    };

    commitScene(nextScene, "Material assigned.", objectId);
  }

  function handleObjectClick(objectId: string, event: MouseEvent<SVGElement>) {
    event.stopPropagation();

    if (activeTool === "material") {
      applyMaterial(objectId);
      return;
    }

    setSelectedId(objectId);
    const object = project ? findObject(project.scene, objectId) : undefined;
    setStatus(`Selected ${object ? objectLabel(object) : "object"}.`);
  }

  function updateSelectedObject(patch: SceneObjectPatch) {
    if (!project || !selectedObject) {
      return;
    }

    const scene = project.scene;
    const nextScene: EditorScene = {
      ...scene,
      furniture: scene.furniture.map((object) =>
        object.id === selectedObject.id && selectedObject.type !== "wall" && selectedObject.type !== "room"
          ? ({ ...object, ...patch } as FurnitureObject)
          : object
      ),
      rooms: scene.rooms.map((object) =>
        object.id === selectedObject.id && selectedObject.type === "room"
          ? ({ ...object, ...patch } as RoomObject)
          : object
      ),
      walls: scene.walls.map((object) =>
        object.id === selectedObject.id && selectedObject.type === "wall"
          ? ({ ...object, ...patch } as WallObject)
          : object
      )
    };

    commitScene(nextScene, "Properties updated.", selectedObject.id);
  }

  function deleteSelectedObject() {
    if (!project || !selectedObject) {
      return;
    }

    const scene = project.scene;
    commitScene(
      {
        ...scene,
        furniture: scene.furniture.filter((object) => object.id !== selectedObject.id),
        rooms: scene.rooms.filter((object) => object.id !== selectedObject.id),
        walls: scene.walls.filter((object) => object.id !== selectedObject.id)
      },
      "Object deleted.",
      ""
    );
  }

  function duplicateSelectedObject() {
    if (!project || !selectedObject) {
      return;
    }

    const scene = project.scene;

    if (selectedObject.type === "wall") {
      const wall: WallObject = {
        ...selectedObject,
        end: offsetPoint(selectedObject.end, 24),
        id: createId("wall"),
        start: offsetPoint(selectedObject.start, 24)
      };
      commitScene({ ...scene, walls: [...scene.walls, wall] }, "Wall duplicated.", wall.id);
      return;
    }

    if (selectedObject.type === "room") {
      const room: RoomObject = {
        ...selectedObject,
        id: createId("room"),
        name: `${selectedObject.name} copy`,
        points: selectedObject.points.map((point) => offsetPoint(point, 24))
      };
      commitScene({ ...scene, rooms: [...scene.rooms, room] }, "Room duplicated.", room.id);
      return;
    }

    const furniture: FurnitureObject = {
      ...selectedObject,
      id: createId(selectedObject.type),
      name: `${selectedObject.name} copy`,
      x: selectedObject.x + 24,
      y: selectedObject.y + 24
    };
    commitScene(
      { ...scene, furniture: [...scene.furniture, furniture] },
      "Object duplicated.",
      furniture.id
    );
  }

  function autoFurnish() {
    if (!project) {
      return;
    }

    const center = project.scene.rooms[0]?.points[0] ?? { x: 300, y: 220 };
    const additions: FurnitureObject[] = [
      {
        assetId: "sofa-modern",
        category: "Living room",
        depth: 70,
        height: 32,
        id: createId("furniture"),
        materialId: selectedMaterialId,
        name: "AI placed sofa",
        rotation: 0,
        type: "furniture",
        width: 150,
        x: center.x + 110,
        y: center.y + 150
      },
      {
        assetId: "table-coffee",
        category: "Living room",
        depth: 54,
        height: 18,
        id: createId("furniture"),
        materialId: selectedMaterialId,
        name: "AI placed table",
        rotation: 0,
        type: "furniture",
        width: 92,
        x: center.x + 145,
        y: center.y + 80
      },
      {
        assetId: "floor-lamp",
        category: "Lighting",
        depth: 32,
        height: 72,
        id: createId("furniture"),
        materialId: selectedMaterialId,
        name: "AI placed lamp",
        rotation: 0,
        type: "furniture",
        width: 32,
        x: center.x + 310,
        y: center.y + 120
      }
    ];

    commitScene(
      { ...project.scene, furniture: [...project.scene.furniture, ...additions] },
      "Local AI demo added a balanced living-room furniture set.",
      additions[0]?.id
    );
  }

  function generatePalette() {
    if (!project) {
      return;
    }

    const aiMaterials: MaterialPreset[] = [
      {
        color: "#e2e8f0",
        id: createId("mat"),
        name: "AI cloud plaster",
        opacity: 1,
        roughness: 0.72,
        source: "ai"
      },
      {
        color: "#0f766e",
        id: createId("mat"),
        name: "AI deep teal",
        opacity: 1,
        roughness: 0.44,
        source: "ai"
      },
      {
        color: "#a16207",
        id: createId("mat"),
        name: "AI aged brass",
        opacity: 1,
        roughness: 0.38,
        source: "ai"
      }
    ];

    const nextMaterials = [...project.scene.materials, ...aiMaterials];
    setSelectedMaterialId(aiMaterials[1]?.id ?? selectedMaterialId);
    commitScene(
      { ...project.scene, materials: nextMaterials },
      "Local AI demo generated a color palette."
    );
  }

  async function uploadFurnitureAsset(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setStatus("Upload an image file for browser-preview assets. 3D model upload comes with the backend asset pipeline.");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setStatus("Keep local browser asset uploads under 4 MB for this MVP.");
      return;
    }

    try {
      const thumbnailDataUrl = await fileToDataUrl(file);
      const asset: FurnitureAsset = {
        assetId: createId("asset"),
        category: "Uploaded",
        depth: 80,
        height: 40,
        name: file.name.replace(/\.[^.]+$/, ""),
        source: "upload",
        thumbnailDataUrl,
        width: 120
      };
      const nextAssets = [asset, ...uploadedAssets];
      saveUploadedAssets(nextAssets);
      setUploadedAssets(nextAssets);
      setActiveAssetId(asset.assetId);
      setActiveTool("furniture");
      setStatus(`${asset.name} uploaded. Click the grid to place it like a Sims build item.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Asset upload failed.");
    }
  }

  async function uploadMaterialTexture(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!project || !file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setStatus("Upload an image file for a paintable material texture.");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      setStatus("Keep local browser material uploads under 4 MB for this MVP.");
      return;
    }

    try {
      const textureDataUrl = await fileToDataUrl(file);
      const material: MaterialPreset = {
        color: "#94a3b8",
        id: createId("mat-upload"),
        name: file.name.replace(/\.[^.]+$/, ""),
        opacity: 1,
        roughness: 0.55,
        source: "upload",
        textureDataUrl
      };
      setSelectedMaterialId(material.id);
      setActiveTool("material");
      commitScene(
        { ...project.scene, materials: [material, ...project.scene.materials] },
        `${material.name} texture uploaded. Click a room, wall, or object to paint it.`
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Material upload failed.");
    }
  }

  function removeUploadedAsset(assetId: string) {
    const nextAssets = deleteUploadedAsset(assetId);
    setUploadedAssets(nextAssets);

    if (activeAssetId === assetId) {
      setActiveAssetId(furnitureAssets[0]?.assetId ?? "");
    }

    setStatus("Uploaded asset removed from the catalog. Placed scene objects remain editable.");
  }

  function removeSelectedMaterial(materialId: string) {
    if (!project) {
      return;
    }

    const fallbackMaterialId =
      project.scene.materials.find((material) => material.id !== materialId)?.id ??
      defaultMaterials[0]?.id ??
      "";
    const nextScene: EditorScene = {
      ...project.scene,
      furniture: project.scene.furniture.map((object) =>
        object.materialId === materialId ? { ...object, materialId: fallbackMaterialId } : object
      ),
      materials: project.scene.materials.filter((material) => material.id !== materialId),
      rooms: project.scene.rooms.map((object) =>
        object.materialId === materialId ? { ...object, materialId: fallbackMaterialId } : object
      ),
      walls: project.scene.walls.map((object) =>
        object.materialId === materialId ? { ...object, materialId: fallbackMaterialId } : object
      )
    };

    setSelectedMaterialId(fallbackMaterialId);
    commitScene(nextScene, "Uploaded material removed and affected objects were reset.");
  }

  function exportProjectJson() {
    if (!project) {
      return;
    }

    const blob = new Blob([JSON.stringify(project, null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setStatus("Project JSON exported.");
  }

  if (!project) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-950 text-slate-100">
        <p className="text-sm font-semibold text-cyan-100">Loading editor...</p>
      </main>
    );
  }

  const scene = project.scene;
  const sceneObjects: SceneObject[] = [...scene.rooms, ...scene.walls, ...scene.furniture];
  const selectedMaterialColor = getMaterialColor(scene, selectedMaterialId);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen flex-col">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
          <div>
            <Link className="text-sm font-semibold text-cyan-100 hover:text-cyan-50" href="/dashboard">
              Dashboard
            </Link>
            <h1 className="mt-1 text-xl font-semibold text-white">{project.name}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/15 bg-white/10 px-3 text-sm font-semibold text-slate-100 transition hover:bg-white/15 disabled:opacity-40"
              disabled={history.length === 0}
              onClick={undo}
              type="button"
            >
              Undo
            </button>
            <button
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/15 bg-white/10 px-3 text-sm font-semibold text-slate-100 transition hover:bg-white/15 disabled:opacity-40"
              disabled={future.length === 0}
              onClick={redo}
              type="button"
            >
              Redo
            </button>
            <button
              className="inline-flex min-h-10 items-center justify-center rounded-md bg-cyan-400 px-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              onClick={exportProjectJson}
              type="button"
            >
              Export JSON
            </button>
          </div>
        </header>

        <div className="grid flex-1 lg:grid-cols-[18rem_1fr_21rem]">
          <aside className="border-b border-white/10 bg-slate-900/80 p-4 lg:border-b-0 lg:border-r">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Build catalog</h2>
              <label className="cursor-pointer rounded-md border border-cyan-300/40 px-2 py-1 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/10">
                Upload
                <input
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="sr-only"
                  onChange={uploadFurnitureAsset}
                  type="file"
                />
              </label>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Pick an item, then click the grid to place it. Uploaded images become reusable local
              assets.
            </p>
            <div className="mt-4 grid gap-2">
              {allFurnitureAssets.map((asset) => (
                <button
                  className={[
                    "relative rounded-md border p-3 text-left transition hover:border-cyan-300/50 hover:bg-white/10",
                    activeAssetId === asset.assetId
                      ? "border-cyan-300/60 bg-cyan-300/10"
                      : "border-white/10 bg-white/[0.05]"
                  ].join(" ")}
                  key={asset.assetId}
                  onClick={() => {
                    setActiveAssetId(asset.assetId);
                    setActiveTool("furniture");
                    setStatus(`${asset.name} selected. Click the grid to place it.`);
                  }}
                  type="button"
                >
                  {asset.thumbnailDataUrl ? (
                    <span
                      className="mb-2 block h-24 rounded border border-white/15 bg-cover bg-center"
                      style={{ backgroundImage: `url(${asset.thumbnailDataUrl})` }}
                    />
                  ) : null}
                  <span className="block text-sm font-semibold text-white">{asset.name}</span>
                  <span className="mt-1 block text-xs text-slate-400">
                    {asset.category} - {asset.width}x{asset.depth}
                  </span>
                </button>
              ))}
            </div>

            {uploadedAssets.length > 0 ? (
              <div className="mt-3 rounded-md border border-white/10 bg-slate-950/40 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Uploaded assets
                </p>
                <div className="mt-2 grid gap-2">
                  {uploadedAssets.map((asset) => (
                    <div className="flex items-center justify-between gap-2" key={asset.assetId}>
                      <span className="truncate text-xs text-slate-300">{asset.name}</span>
                      <button
                        className="rounded border border-rose-300/30 px-2 py-1 text-xs font-semibold text-rose-100 hover:bg-rose-400/10"
                        onClick={() => removeUploadedAsset(asset.assetId)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-6 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Paint</h2>
              <label className="cursor-pointer rounded-md border border-cyan-300/40 px-2 py-1 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/10">
                Texture
                <input
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="sr-only"
                  onChange={uploadMaterialTexture}
                  type="file"
                />
              </label>
            </div>
            <div className="mt-4 grid gap-2">
              {scene.materials.map((material) => (
                <button
                  className={[
                    "flex items-center gap-3 rounded-md border p-2 text-left text-sm font-semibold transition hover:border-cyan-300/50 hover:bg-white/10",
                    selectedMaterialId === material.id
                      ? "border-cyan-300/60 bg-cyan-300/10 text-cyan-100"
                      : "border-white/10 bg-white/[0.05] text-slate-100"
                  ].join(" ")}
                  key={material.id}
                  onClick={() => {
                    setSelectedMaterialId(material.id);
                    setActiveTool("material");
                    setStatus(`${material.name} selected. Click an object to paint it.`);
                  }}
                  type="button"
                >
                  <span
                    className="h-6 w-6 shrink-0 rounded border border-white/20 bg-cover bg-center"
                    style={{
                      backgroundColor: material.color,
                      backgroundImage: material.textureDataUrl ? `url(${material.textureDataUrl})` : undefined
                    }}
                  />
                  <span className="min-w-0 flex-1 truncate">{material.name}</span>
                  {material.source === "upload" || material.source === "ai" ? (
                    <span
                      className="rounded border border-rose-300/30 px-2 py-1 text-xs font-semibold text-rose-100 hover:bg-rose-400/10"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeSelectedMaterial(material.id);
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      Remove
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </aside>

          <section className="flex min-h-[38rem] flex-col">
            <div className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-slate-900/60 p-3">
              {tools.map((tool) => (
                <button
                  className={[
                    "rounded-md border px-3 py-2 text-sm font-semibold transition hover:border-cyan-300/50 hover:bg-cyan-300/10",
                    activeTool === tool.id
                      ? "border-cyan-300/70 bg-cyan-300/15 text-cyan-100"
                      : "border-white/10 text-slate-200"
                  ].join(" ")}
                  key={tool.id}
                  onClick={() => {
                    setActiveTool(tool.id);
                    setDraftWallStart(null);
                    setMeasureStart(null);
                    setMeasureEnd(null);
                    setStatus(`${tool.label} tool active.`);
                  }}
                  type="button"
                >
                  {tool.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-2 text-sm text-slate-300">
              <span>{status}</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-cyan-100">
                Tool: {activeTool}
                {activeTool === "furniture" && activeAsset ? ` - ${activeAsset.name}` : ""}
              </span>
            </div>

            <svg
              className="h-full min-h-[32rem] w-full flex-1 cursor-crosshair bg-slate-950"
              onClick={handleCanvasClick}
              role="img"
              viewBox={`0 0 ${viewBox.width} ${viewBox.height}`}
            >
              <defs>
                <pattern height="20" id="grid" patternUnits="userSpaceOnUse" width="20">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(148,163,184,0.22)" strokeWidth="1" />
                </pattern>
                {scene.materials
                  .filter((material) => material.textureDataUrl)
                  .map((material) => (
                    <pattern
                      height="80"
                      id={patternId(material.id)}
                      key={material.id}
                      patternUnits="userSpaceOnUse"
                      width="80"
                    >
                      <image
                        height="80"
                        href={material.textureDataUrl}
                        preserveAspectRatio="xMidYMid slice"
                        width="80"
                      />
                    </pattern>
                  ))}
              </defs>
              <rect fill="url(#grid)" height={viewBox.height} width={viewBox.width} x="0" y="0" />

              {scene.rooms.map((room) => (
                <polygon
                  fill={getMaterialFill(scene, room.materialId)}
                  fillOpacity="0.22"
                  key={room.id}
                  onClick={(event) => handleObjectClick(room.id, event)}
                  points={room.points.map((point) => `${point.x},${point.y}`).join(" ")}
                  stroke={selectedId === room.id ? "#67e8f9" : "rgba(255,255,255,0.35)"}
                  strokeDasharray={selectedId === room.id ? "8 5" : undefined}
                  strokeWidth="3"
                />
              ))}

              {scene.walls.map((wall) => (
                <line
                  key={wall.id}
                  onClick={(event) => handleObjectClick(wall.id, event)}
                  stroke={selectedId === wall.id ? "#67e8f9" : getMaterialColor(scene, wall.materialId)}
                  strokeLinecap="round"
                  strokeWidth={selectedId === wall.id ? wall.thickness + 6 : wall.thickness}
                  x1={wall.start.x}
                  x2={wall.end.x}
                  y1={wall.start.y}
                  y2={wall.end.y}
                />
              ))}

              {scene.furniture.map((object) => {
                const fill = getMaterialFill(scene, object.materialId);
                const asset = allFurnitureAssets.find((candidate) => candidate.assetId === object.assetId);
                const isSelected = selectedId === object.id;
                return (
                  <g
                    key={object.id}
                    onClick={(event) => handleObjectClick(object.id, event)}
                    transform={`rotate(${object.rotation} ${object.x} ${object.y})`}
                  >
                    <rect
                      fill={fill}
                      fillOpacity={object.type === "window" ? 0.42 : 0.82}
                      height={object.depth}
                      rx="4"
                      stroke={isSelected ? "#67e8f9" : "rgba(255,255,255,0.35)"}
                      strokeDasharray={object.type === "window" ? "8 4" : undefined}
                      strokeWidth={isSelected ? 4 : 2}
                      width={object.width}
                      x={object.x - object.width / 2}
                      y={object.y - object.depth / 2}
                    />
                    {asset?.thumbnailDataUrl && object.type === "furniture" ? (
                      <image
                        height={object.depth}
                        href={asset.thumbnailDataUrl}
                        opacity="0.92"
                        preserveAspectRatio="xMidYMid slice"
                        width={object.width}
                        x={object.x - object.width / 2}
                        y={object.y - object.depth / 2}
                      />
                    ) : null}
                    <text
                      fill="#f8fafc"
                      fontSize="14"
                      fontWeight="700"
                      textAnchor="middle"
                      x={object.x}
                      y={object.y + 5}
                    >
                      {object.type === "door" ? "Door" : object.type === "window" ? "Window" : object.name}
                    </text>
                  </g>
                );
              })}

              {draftWallStart ? (
                <circle cx={draftWallStart.x} cy={draftWallStart.y} fill="#22d3ee" r="8" />
              ) : null}

              {measureStart ? <circle cx={measureStart.x} cy={measureStart.y} fill="#facc15" r="7" /> : null}
              {measureStart && measureEnd ? (
                <g>
                  <line
                    stroke="#facc15"
                    strokeDasharray="8 6"
                    strokeWidth="3"
                    x1={measureStart.x}
                    x2={measureEnd.x}
                    y1={measureStart.y}
                    y2={measureEnd.y}
                  />
                  <text
                    fill="#fde68a"
                    fontSize="18"
                    fontWeight="800"
                    textAnchor="middle"
                    x={(measureStart.x + measureEnd.x) / 2}
                    y={(measureStart.y + measureEnd.y) / 2 - 12}
                  >
                    {formatMeasurement(distance(measureStart, measureEnd))}
                  </text>
                </g>
              ) : null}
            </svg>
          </section>

          <aside className="border-t border-white/10 bg-slate-900/80 p-4 lg:border-l lg:border-t-0">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Scene</h2>
            <div className="mt-3 max-h-40 overflow-auto rounded-md border border-white/10">
              {sceneObjects.map((object) => (
                <button
                  className={[
                    "block w-full border-b border-white/10 px-3 py-2 text-left text-sm transition last:border-b-0 hover:bg-white/10",
                    selectedId === object.id ? "bg-cyan-300/10 text-cyan-100" : "text-slate-200"
                  ].join(" ")}
                  key={object.id}
                  onClick={() => {
                    setSelectedId(object.id);
                    setStatus(`Selected ${objectLabel(object)}.`);
                  }}
                  type="button"
                >
                  {object.type.toUpperCase()} - {objectLabel(object)}
                </button>
              ))}
            </div>

            <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-400">Inspector</h2>
            <div className="mt-3 rounded-md border border-white/10 bg-white/[0.05] p-4">
              {selectedObject ? (
                <div className="grid gap-3">
                  <p className="text-sm font-semibold text-white">{objectLabel(selectedObject)}</p>

                  {selectedObject.type !== "wall" ? (
                    <label className="grid gap-1 text-xs font-semibold text-slate-300">
                      Name
                      <input
                        className="min-h-9 rounded-md border border-white/10 bg-slate-950 px-2 text-sm text-white outline-none focus:border-cyan-300"
                        onChange={(event) => updateSelectedObject({ name: event.target.value })}
                        value={selectedObject.name}
                      />
                    </label>
                  ) : null}

                  {selectedObject.type !== "room" && selectedObject.type !== "wall" ? (
                    <>
                      <label className="grid gap-1 text-xs font-semibold text-slate-300">
                        Rotation
                        <input
                          className="min-h-9 rounded-md border border-white/10 bg-slate-950 px-2 text-sm text-white outline-none focus:border-cyan-300"
                          onChange={(event) =>
                            updateSelectedObject({ rotation: Number(event.target.value) })
                          }
                          type="number"
                          value={selectedObject.rotation}
                        />
                      </label>
                      <label className="grid gap-1 text-xs font-semibold text-slate-300">
                        Width
                        <input
                          className="min-h-9 rounded-md border border-white/10 bg-slate-950 px-2 text-sm text-white outline-none focus:border-cyan-300"
                          onChange={(event) =>
                            updateSelectedObject({ width: Number(event.target.value) })
                          }
                          type="number"
                          value={selectedObject.width}
                        />
                      </label>
                    </>
                  ) : null}

                  {selectedObject.type === "wall" ? (
                    <label className="grid gap-1 text-xs font-semibold text-slate-300">
                      Thickness
                      <input
                        className="min-h-9 rounded-md border border-white/10 bg-slate-950 px-2 text-sm text-white outline-none focus:border-cyan-300"
                        onChange={(event) =>
                          updateSelectedObject({ thickness: Number(event.target.value) })
                        }
                        type="number"
                        value={selectedObject.thickness}
                      />
                    </label>
                  ) : null}

                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      className="inline-flex min-h-9 items-center justify-center rounded-md border border-white/15 px-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
                      onClick={duplicateSelectedObject}
                      type="button"
                    >
                      Duplicate
                    </button>
                    <button
                      className="inline-flex min-h-9 items-center justify-center rounded-md border border-rose-300/30 px-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/10"
                      onClick={deleteSelectedObject}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-6 text-slate-400">Select an object to edit its properties.</p>
              )}
            </div>

            <h2 className="mt-6 text-sm font-semibold uppercase tracking-wide text-slate-400">AI demo</h2>
            <div className="mt-3 grid gap-2">
              <button
                className="rounded-md border border-white/10 px-3 py-2 text-left text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:bg-white/10"
                onClick={autoFurnish}
                type="button"
              >
                Auto-furnish room
              </button>
              <button
                className="rounded-md border border-white/10 px-3 py-2 text-left text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:bg-white/10"
                onClick={generatePalette}
                type="button"
              >
                Generate palette
              </button>
              <div className="rounded-md border border-white/10 p-3 text-sm text-slate-300">
                Active paint swatch:
                <span
                  className="ml-2 inline-block h-4 w-4 rounded border border-white/20 align-middle"
                  style={{ backgroundColor: selectedMaterialColor }}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

