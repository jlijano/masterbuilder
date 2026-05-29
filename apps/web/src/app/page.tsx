import { PRODUCT_NAME } from "@house-designer/shared";
import { Button } from "@house-designer/ui";

const featureCards = [
  "Sims-style build mode foundation",
  "Browser CAD and 3D editor architecture",
  "AI, exports, uploads, teams, and billing paths"
];

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-5xl">
        <div className="mb-8 inline-flex rounded-md border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-sm font-medium text-cyan-100">
          Phase 1 foundation
        </div>
        <h1 className="max-w-4xl text-5xl font-semibold tracking-normal text-white sm:text-7xl">
          {PRODUCT_NAME}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          A production-oriented monorepo foundation for a premium AI-powered house designer,
          ready for the backend, editor engine, and polished app shell phases.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button>Open workspace</Button>
          <Button variant="secondary">Read architecture</Button>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {featureCards.map((feature) => (
            <article
              className="rounded-md border border-white/10 bg-white/[0.06] p-5 shadow-xl shadow-slate-950/30"
              key={feature}
            >
              <p className="text-sm font-semibold text-cyan-100">{feature}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
