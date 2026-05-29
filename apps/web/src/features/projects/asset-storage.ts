"use client";

import type { FurnitureAsset } from "./project-types";

const ASSET_STORAGE_KEY = "house-designer-assets:v1";

function readAssets(): FurnitureAsset[] {
  const raw = window.localStorage.getItem(ASSET_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as FurnitureAsset[]) : [];
  } catch {
    return [];
  }
}

export function loadUploadedAssets(): FurnitureAsset[] {
  return readAssets();
}

export function saveUploadedAssets(assets: FurnitureAsset[]): void {
  window.localStorage.setItem(ASSET_STORAGE_KEY, JSON.stringify(assets));
}

export function deleteUploadedAsset(assetId: string): FurnitureAsset[] {
  const assets = readAssets().filter((asset) => asset.assetId !== assetId);
  saveUploadedAssets(assets);
  return assets;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the selected file."));
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("The selected file did not produce a data URL."));
        return;
      }

      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
