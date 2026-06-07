"use client";

import { Bell, ExternalLink, Menu, Search } from "lucide-react";
import { usePathname } from "next/navigation";

const routeTitles: Record<string, { eyebrow: string; title: string }> = {
  "/": { eyebrow: "Workspace", title: "Home" },
  "/dashboard": { eyebrow: "Projects", title: "Dashboard" },
  "/editor": { eyebrow: "Build mode", title: "Editor" },
  "/docs/architecture": { eyebrow: "Documentation", title: "Architecture" }
};

function getRouteTitle(pathname: string) {
  if (pathname.startsWith("/docs/architecture")) {
    return routeTitles["/docs/architecture"];
  }

  if (pathname.startsWith("/editor")) {
    return routeTitles["/editor"];
  }

  if (pathname.startsWith("/dashboard")) {
    return routeTitles["/dashboard"];
  }

  return routeTitles["/"];
}

export function TopNav({ onOpenMobileNav }: Readonly<{ onOpenMobileNav: () => void }>) {
  const pathname = usePathname();
  const routeTitle = getRouteTitle(pathname);
  const apiUrl = process.env["NEXT_PUBLIC_API_URL"] ?? "https://house-designer-api.onrender.com";

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/88 px-4 py-3 backdrop-blur md:px-6">
      <div className="flex min-h-11 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            aria-label="Open sidebar"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-cyan-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-300 lg:hidden"
            onClick={onOpenMobileNav}
            type="button"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-cyan-200">{routeTitle.eyebrow}</p>
            <h1 className="truncate text-lg font-semibold text-white md:text-xl">{routeTitle.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden min-h-10 items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 text-sm text-slate-400 md:flex">
            <Search className="h-4 w-4" aria-hidden="true" />
            <span>Search workspace</span>
          </div>
          <a
            className="hidden min-h-10 items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10 md:inline-flex"
            href={`${apiUrl}/health`}
            rel="noreferrer"
            target="_blank"
          >
            API health
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
          <button
            aria-label="Notifications"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-slate-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            type="button"
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
