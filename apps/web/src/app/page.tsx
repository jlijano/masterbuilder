import Link from "next/link";
import { PRODUCT_NAME } from "@house-designer/shared";

const featureCards = [
  {
    description: "Open the dashboard and project manager shell.",
    href: "/dashboard",
    title: "Sims-style build mode foundation"
  },
  {
    description: "Preview the editor foundation and scene panels.",
    href: "/editor",
    title: "Browser CAD and 3D editor architecture"
  },
  {
    description: "Review the implementation roadmap and package boundaries.",
    href: "/docs/architecture",
    title: "AI, exports, uploads, teams, and billing paths"
  }
];

export default function HomePage() {
  return (
    <section className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-10 md:px-6">
      <div className="w-full max-w-5xl">
        <div className="mb-8 inline-flex rounded-md border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-sm font-medium text-cyan-100">
          Phase 1 foundation
        </div>
        <h2 className="max-w-4xl text-5xl font-semibold tracking-normal text-white sm:text-7xl">
          {PRODUCT_NAME}
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          A production-oriented monorepo foundation for a premium AI-powered house designer,
          ready for the backend, editor engine, and polished app shell phases.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-md bg-cyan-400 px-4 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            href="/dashboard"
          >
            Open workspace
          </Link>
          <Link
            className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/15 bg-white/10 px-4 text-sm font-semibold text-slate-100 transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            href="/docs/architecture"
          >
            Read architecture
          </Link>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {featureCards.map((feature) => (
            <Link
              className="rounded-md border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/30 transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-white/[0.09] focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
              href={feature.href}
              key={feature.title}
            >
              <p className="text-sm font-semibold text-cyan-100">{feature.title}</p>
              <p className="mt-3 text-sm leading-6 text-slate-300">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
