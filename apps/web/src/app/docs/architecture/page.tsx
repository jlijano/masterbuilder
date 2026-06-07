const sections = [
  {
    body: "Next.js owns the browser app, dashboard, and editor routes. NestJS owns API modules and provider boundaries.",
    title: "Apps"
  },
  {
    body: "Shared, UI, engine, database, and config packages keep implementation work modular and testable.",
    title: "Packages"
  },
  {
    body: "The next phases add Prisma models, CRUD APIs, auth, project management, and the interactive build editor.",
    title: "Roadmap"
  }
];

export default function ArchitectureDocsPage() {
  return (
    <section className="px-4 py-8 md:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <p className="text-sm font-semibold uppercase text-cyan-200">Architecture</p>
        <h2 className="mt-3 text-4xl font-semibold text-white">Production foundation</h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
          The deployed app is currently a Phase 1 foundation. These routes are intentionally wired
          so navigation, Render services, and package boundaries can be validated before deeper
          product modules are added.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {sections.map((section) => (
            <article className="rounded-md border border-white/10 bg-white/[0.06] p-5" key={section.title}>
              <h3 className="text-lg font-semibold text-white">{section.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">{section.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
