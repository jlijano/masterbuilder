"use client";

import { ChevronLeft, ChevronRight, FileText, Home, LayoutDashboard, PenTool, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PRODUCT_NAME } from "@house-designer/shared";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/editor", icon: PenTool, label: "Editor" },
  { href: "/docs/architecture", icon: FileText, label: "Architecture" }
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SideNav({
  collapsed,
  onToggle
}: Readonly<{
  collapsed: boolean;
  onToggle: () => void;
}>) {
  const pathname = usePathname();

  return (
    <aside
      className={[
        "sticky top-0 z-30 hidden h-screen min-h-screen border-r border-white/10 bg-slate-950/95 px-3 py-4 backdrop-blur lg:flex lg:flex-col",
        collapsed ? "items-center" : ""
      ].join(" ")}
    >
      <div className={["flex w-full items-center gap-3", collapsed ? "justify-center" : "justify-between"].join(" ")}>
        <Link
          aria-label={collapsed ? PRODUCT_NAME : undefined}
          className={["flex min-h-11 items-center gap-3 rounded-md text-white", collapsed ? "justify-center" : "min-w-0"].join(" ")}
          href="/"
          title={collapsed ? PRODUCT_NAME : undefined}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-950/30">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          {!collapsed ? (
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{PRODUCT_NAME}</span>
              <span className="block truncate text-xs text-slate-400">Design workspace</span>
            </span>
          ) : null}
        </Link>
        <button
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-slate-200 transition hover:border-cyan-300/40 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-300"
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          type="button"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="mt-8 grid w-full gap-2" aria-label="Primary navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActivePath(pathname, item.href);

          return (
            <Link
              className={[
                "flex min-h-11 items-center gap-3 rounded-md border px-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-300",
                collapsed ? "justify-center" : "",
                isActive
                  ? "border-cyan-300/50 bg-cyan-300/15 text-cyan-100"
                  : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.07] hover:text-white"
              ].join(" ")}
              href={item.href}
              key={item.href}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {!collapsed ? <span className="truncate">{item.label}</span> : <span className="sr-only">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={["mt-auto rounded-md border border-white/10 bg-white/[0.06] p-3", collapsed ? "w-full text-center" : ""].join(" ")}>
        <p className="text-xs font-semibold uppercase text-cyan-100">Phase 1</p>
        {!collapsed ? (
          <p className="mt-2 text-xs leading-5 text-slate-400">Project, editor, and architecture routes now share one shell.</p>
        ) : null}
      </div>
    </aside>
  );
}
