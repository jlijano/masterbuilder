"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { createProject } from "./project-data";
import { deleteProject, loadProjects, saveProjects } from "./project-storage";
import type { DesignProject } from "./project-types";

const modules = [
  "Furniture catalog",
  "Materials",
  "Uploads",
  "AI assistant",
  "Exports",
  "Teams",
  "Billing"
];

export function DashboardClient() {
  const router = useRouter();
  const [projects, setProjects] = useState<DesignProject[]>([]);
  const [projectName, setProjectName] = useState("Modern Courtyard Concept");
  const [description, setDescription] = useState("A renovation concept with working local editor state.");
  const [useSampleScene, setUseSampleScene] = useState(true);

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  const sortedProjects = useMemo(
    () =>
      [...projects].sort(
        (first, second) =>
          new Date(second.updatedAt).getTime() - new Date(first.updatedAt).getTime()
      ),
    [projects]
  );

  function createNewProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = projectName.trim();

    if (!trimmedName) {
      return;
    }

    const project = createProject(trimmedName, description.trim(), useSampleScene);
    const nextProjects = [project, ...projects];
    saveProjects(nextProjects);
    setProjects(nextProjects);
    router.push(`/editor?projectId=${project.id}`);
  }

  function removeProject(projectId: string) {
    const nextProjects = deleteProject(projectId);
    setProjects(nextProjects);
  }

  return (
    <main className="min-h-screen px-6 py-8">
      <section className="mx-auto w-full max-w-6xl">
        <nav className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <Link className="text-sm font-semibold text-cyan-100 hover:text-cyan-50" href="/">
            House Designer
          </Link>
          <div className="flex flex-wrap gap-3">
            <Link
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/15 bg-white/10 px-4 text-sm font-semibold text-slate-100 transition hover:bg-white/15"
              href="/docs/architecture"
            >
              Architecture
            </Link>
            <Link
              className="inline-flex min-h-10 items-center justify-center rounded-md bg-cyan-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              href={sortedProjects[0] ? `/editor?projectId=${sortedProjects[0].id}` : "/editor"}
            >
              Open editor
            </Link>
          </div>
        </nav>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-200">Workspace</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Project dashboard</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Create real local projects, open them in the editor, and export scene data. This is
            browser persistence today and the shape the API will back in the next phase.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_22rem]">
          <section className="rounded-md border border-white/10 bg-white/[0.06] p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-white">Projects</h2>
              <span className="text-sm text-slate-400">{projects.length} saved locally</span>
            </div>

            <form className="mt-5 grid gap-3 rounded-md border border-white/10 bg-slate-950/35 p-4" onSubmit={createNewProject}>
              <label className="grid gap-2 text-sm font-medium text-slate-200">
                Project name
                <input
                  className="min-h-11 rounded-md border border-white/10 bg-slate-950 px-3 text-sm text-white outline-none transition focus:border-cyan-300"
                  onChange={(event) => setProjectName(event.target.value)}
                  value={projectName}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-200">
                Description
                <textarea
                  className="min-h-20 rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-300"
                  onChange={(event) => setDescription(event.target.value)}
                  value={description}
                />
              </label>
              <label className="flex items-center gap-3 text-sm font-medium text-slate-200">
                <input
                  checked={useSampleScene}
                  className="h-4 w-4 accent-cyan-300"
                  onChange={(event) => setUseSampleScene(event.target.checked)}
                  type="checkbox"
                />
                Start with sample walls, room, materials, and furniture
              </label>
              <button
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-cyan-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                type="submit"
              >
                Create and open project
              </button>
            </form>

            <div className="mt-5 grid gap-3">
              {sortedProjects.map((project) => (
                <article
                  className="rounded-md border border-white/10 bg-slate-950/35 p-4"
                  key={project.id}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-white">{project.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {project.description || "No description yet."}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">
                        Updated {new Date(project.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        className="inline-flex min-h-9 items-center justify-center rounded-md bg-cyan-400 px-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                        href={`/editor?projectId=${project.id}`}
                      >
                        Open
                      </Link>
                      <button
                        className="inline-flex min-h-9 items-center justify-center rounded-md border border-rose-300/30 px-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-400/10"
                        onClick={() => removeProject(project.id)}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="rounded-md border border-white/10 bg-white/[0.06] p-5">
            <h2 className="text-lg font-semibold text-white">Working modules</h2>
            <div className="mt-5 grid gap-2">
              {modules.map((module) => (
                <Link
                  className="rounded-md border border-white/10 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-300/40 hover:bg-white/10"
                  href="/editor"
                  key={module}
                >
                  {module}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
