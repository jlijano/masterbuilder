import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <section className="w-full max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-cyan-200">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">Page not found</h1>
        <p className="mt-4 text-base leading-7 text-slate-300">
          This part of the design studio is not available yet.
        </p>
        <Link
          className="mt-8 inline-flex min-h-10 items-center justify-center rounded-md bg-cyan-400 px-4 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
          href="/"
        >
          Return home
        </Link>
      </section>
    </main>
  );
}
