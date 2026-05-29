import Link from "next/link";

const projects = [
  {
    href: "/editor",
    name: "Modern Courtyard Concept",
    status: "Ready for editor foundation",
    updatedAt: "Phase 1 sample"
  },
  {
    href: "/editor",
    name: "Two Floor Renovation",
    status: "Scene schema planned",
    updatedAt: "Phase 2 target"
  }
];

const modules = [
  "Projects",
  "Furniture catalog",
  "Materials",
  "Uploads",
  "AI assistant",
  "Exports",
  "Teams",
  "Billing"
];

export default function DashboardPage() {
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
              href="/editor"
            >
              Open editor
            </Link>
          </div>
        </nav>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-200">Workspace</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Project dashboard</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            This shell proves the deployed app can navigate between product surfaces while the
            backend schema, auth, and editor systems are filled in phase by phase.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-[1fr_22rem]">
          <section className="rounded-md border border-white/10 bg-white/[0.06] p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-white">Projects</h2>
              <Link className="text-sm font-semibold text-cyan-200 hover:text-cyan-100" href="/editor">
                Create sample
              </Link>
            </div>
            <div className="mt-5 grid gap-3">
              {projects.map((project) => (
                <Link
                  className="rounded-md border border-white/10 bg-slate-950/35 p-4 transition hover:border-cyan-300/40 hover:bg-slate-900/80"
                  href={project.href}
                  key={project.name}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold text-white">{project.name}</h3>
                    <span className="text-xs font-medium text-slate-400">{project.updatedAt}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">{project.status}</p>
                </Link>
              ))}
            </div>
          </section>

          <aside className="rounded-md border border-white/10 bg-white/[0.06] p-5">
            <h2 className="text-lg font-semibold text-white">Modules</h2>
            <div className="mt-5 grid gap-2">
              {modules.map((module) => (
                <Link
                  className="rounded-md border border-white/10 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-300/40 hover:bg-white/10"
                  href={module === "Projects" ? "/dashboard" : "/docs/architecture"}
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
