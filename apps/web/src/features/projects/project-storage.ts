"use client";

import type { DesignProject } from "./project-types";
import { createProject } from "./project-data";
import { recordProjectChanges } from "./project-notifications";

const STORAGE_KEY = "house-designer-projects:v1";

function readRawProjects(): DesignProject[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as DesignProject[]) : [];
  } catch {
    return [];
  }
}

export function loadProjects(): DesignProject[] {
  const projects = readRawProjects();

  if (projects.length > 0) {
    return projects;
  }

  const sample = createProject(
    "Modern Courtyard Concept",
    "A starter scene with walls, a room, materials, and furniture."
  );
  saveProjects([sample]);
  return [sample];
}

export function saveProjects(projects: DesignProject[]): void {
  const previousProjects = readRawProjects();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  recordProjectChanges(previousProjects, projects);
}

export function loadProject(projectId: string): DesignProject | undefined {
  return loadProjects().find((project) => project.id === projectId);
}

export function upsertProject(project: DesignProject): DesignProject[] {
  const projects = loadProjects();
  const existingIndex = projects.findIndex((candidate) => candidate.id === project.id);
  const nextProject = {
    ...project,
    updatedAt: new Date().toISOString()
  };

  if (existingIndex === -1) {
    const nextProjects = [nextProject, ...projects];
    saveProjects(nextProjects);
    return nextProjects;
  }

  const nextProjects = [...projects];
  nextProjects[existingIndex] = nextProject;
  saveProjects(nextProjects);
  return nextProjects;
}

export function deleteProject(projectId: string): DesignProject[] {
  const projects = loadProjects().filter((project) => project.id !== projectId);
  saveProjects(projects);
  return projects;
}
