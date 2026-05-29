import Link from "next/link";

const toolGroups = [
  "Select",
  "Wall",
  "Room",
  "Door",
  "Window",
  "Furniture",
  "Material",
  "Measure"
];

const panels = ["Asset panel", "Scene hierarchy", "Properties", "AI assistant"];

interface EditorPageProps {
  searchParams?: Promise<{
    tool?: string;
  }>;
}

export default async function EditorPage({ searchParams }: EditorPageProps) {
  const params = await searchParams;
  const activeTool = params?.tool ?? "select";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen flex-col">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
          <div>
            <Link className="text-sm font-semibold text-cyan-100 hover:text-cyan-50" href="/dashboard">
              Dashboard
            </Link>
            <h1 className="mt-1 text-xl font-semibold text-white">Editor foundation</h1>
          </div>
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/15 bg-white/10 px-4 text-sm font-semibold text-slate-100 transition hover:bg-white/15"
            href="/docs/architecture"
          >
            View roadmap
          </Link>
        </header>

        <div className="grid flex-1 lg:grid-cols-[17rem_1fr_20rem]">
          <aside className="border-b border-white/10 bg-slate-900/80 p-4 lg:border-b-0 lg:border-r">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Assets</h2>
            <div className="mt-4 grid gap-3">
              {["Sofa placeholder", "Oak flooring", "Kitchen island", "Warm wall paint"].map((asset) => (
                <div className="rounded-md border border-white/10 bg-white/[0.05] p-3" key={asset}>
                  <p className="text-sm font-semibold text-white">{asset}</p>
                  <p className="mt-1 text-xs text-slate-400">Catalog wiring arrives in Phase 6.</p>
                </div>
              ))}
            </div>
          </aside>

          <section className="flex min-h-[32rem] flex-col">
            <div className="flex flex-wrap gap-2 border-b border-white/10 bg-slate-900/60 p-3">
              {toolGroups.map((tool) => (
                <Link
                  className={[
                    "rounded-md border px-3 py-2 text-sm font-semibold transition hover:border-cyan-300/50 hover:bg-cyan-300/10",
                    activeTool === tool.toLowerCase()
                      ? "border-cyan-300/70 bg-cyan-300/15 text-cyan-100"
                      : "border-white/10 text-slate-200"
                  ].join(" ")}
                  href={`/editor?tool=${tool.toLowerCase()}`}
                  key={tool}
                >
                  {tool}
                </Link>
              ))}
            </div>
            <div className="grid flex-1 place-items-center bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px] p-6">
              <div className="max-w-xl text-center">
                <p className="text-sm font-semibold uppercase tracking-wide text-cyan-200">
                  Build viewport
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-white">3D editor route is live</h2>
                <p className="mt-3 text-sm font-semibold text-cyan-100">
                  Active tool: {activeTool}
                </p>
                <p className="mt-4 text-base leading-7 text-slate-300">
                  This page is the deployable editor foundation. React Three Fiber, Zustand state,
                  snapping tools, and scene rendering are scheduled for the next implementation
                  phases.
                </p>
              </div>
            </div>
          </section>

          <aside className="border-t border-white/10 bg-slate-900/80 p-4 lg:border-l lg:border-t-0">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Inspector</h2>
            <div className="mt-4 grid gap-3">
              {panels.map((panel) => (
                <Link
                  className="rounded-md border border-white/10 bg-white/[0.05] p-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:bg-white/10"
                  href="/docs/architecture"
                  key={panel}
                >
                  {panel}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
