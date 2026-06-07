"use client";

import type { DesignProject } from "./project-types";

export interface AppNotification {
  context: string;
  createdAt: string;
  id: string;
  title: string;
  type: "created" | "deleted" | "updated";
}

export const NOTIFICATIONS_CHANGED_EVENT = "house-designer-notifications:changed";

const NOTIFICATION_STORAGE_KEY = "house-designer-notifications:v1";
const MAX_NOTIFICATIONS = 50;

function createNotification(type: AppNotification["type"], project: DesignProject): AppNotification {
  const actionLabel = type === "created" ? "Created" : type === "deleted" ? "Deleted" : "Updated";
  const createdAt = new Date().toISOString();

  return {
    context: "Project workspace",
    createdAt,
    id: `${type}-${project.id}-${createdAt}`,
    title: `${actionLabel} | ${project.name}`,
    type
  };
}

function readRawNotifications(): AppNotification[] {
  const raw = window.localStorage.getItem(NOTIFICATION_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as AppNotification[]) : [];
  } catch {
    return [];
  }
}

function projectChanged(previous: DesignProject, next: DesignProject): boolean {
  return (
    previous.name !== next.name ||
    previous.description !== next.description ||
    previous.updatedAt !== next.updatedAt ||
    JSON.stringify(previous.scene) !== JSON.stringify(next.scene)
  );
}

export function loadNotifications(): AppNotification[] {
  return readRawNotifications().sort(
    (first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
  );
}

export function recordProjectChanges(previousProjects: DesignProject[], nextProjects: DesignProject[]): void {
  const previousById = new Map(previousProjects.map((project) => [project.id, project]));
  const nextById = new Map(nextProjects.map((project) => [project.id, project]));
  const notifications: AppNotification[] = [];

  for (const project of nextProjects) {
    const previousProject = previousById.get(project.id);

    if (!previousProject) {
      notifications.push(createNotification("created", project));
      continue;
    }

    if (projectChanged(previousProject, project)) {
      notifications.push(createNotification("updated", project));
    }
  }

  for (const project of previousProjects) {
    if (!nextById.has(project.id)) {
      notifications.push(createNotification("deleted", project));
    }
  }

  if (notifications.length === 0) {
    return;
  }

  const nextNotifications = [...notifications, ...loadNotifications()].slice(0, MAX_NOTIFICATIONS);
  window.localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(nextNotifications));
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED_EVENT));
}
