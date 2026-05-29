import Link from "next/link";

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
  const apiUrl = process.env["NEXT_PUBLIC_API_URL"] ?? "https://house-designer-api.onrender.com";

  return (
    <main className="min-h-screen px-6 py-8">
      <section className="mx-auto w-full max-w-5xl">
        <nav className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <Link className="text-sm font-semibold text-cyan-100 hover:text-cyan-50" href="/">
            House Designer
          </Link>
          <div className="flex flex-wrap gap-3">
            <Link
              className="inline-flex min-h-10 items-center justify-center rounded-md border border-white/15 bg-white/10 px-4 text-sm font-semibold text-slate-100 transition hover:bg-white/15"
              href="/dashboard"
            >
              Dashboard
            </Link>
            <a
              className="inline-flex min-h-10 items-center justify-center rounded-md bg-cyan-400 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              href={`${apiUrl}/health`}
              rel="noreferrer"
              target="_blank"
            >
              API health
            </a>
          </div>
        </nav>

        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-200">Architecture</p>
        <h1 className="mt-3 text-4xl font-semibold text-white">Production foundation</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">
          The deployed app is currently a Phase 1 foundation. These routes are intentionally wired
          so navigation, Render services, and package boundaries can be validated before deeper
          product modules are added.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {sections.map((section) => (
            <article className="rounded-md border border-white/10 bg-white/[0.06] p-5" key={section.title}>
              <h2 className="text-lg font-semibold text-white">{section.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">{section.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
