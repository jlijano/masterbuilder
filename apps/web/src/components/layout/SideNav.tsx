"use client";

import { ChevronLeft, ChevronRight, FileText, Home, LayoutDashboard, PenTool, Sparkles, X } from "lucide-react";
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

function SideNavBody({
  collapsed,
  onCloseMobile,
  onToggle,
  variant
}: Readonly<{
  collapsed: boolean;
  onCloseMobile?: () => void;
  onToggle?: () => void;
  variant: "desktop" | "mobile";
}>) {
  const pathname = usePathname();
  const isCollapsed = variant === "desktop" && collapsed;

  return (
    <>
      <div className={["flex w-full items-center gap-3", isCollapsed ? "justify-center" : "justify-between"].join(" ")}>
        <Link
          aria-label={isCollapsed ? PRODUCT_NAME : undefined}
          className={["flex min-h-11 items-center gap-3 rounded-md text-white", isCollapsed ? "justify-center" : "min-w-0"].join(" ")}
          href="/"
          onClick={onCloseMobile}
          title={isCollapsed ? PRODUCT_NAME : undefined}
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-950/30">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          {!isCollapsed ? (
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{PRODUCT_NAME}</span>
              <span className="block truncate text-xs text-slate-400">Design workspace</span>
            </span>
          ) : null}
        </Link>
        {variant === "desktop" ? (
          <button
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-slate-200 transition hover:border-cyan-300/40 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            onClick={onToggle}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            type="button"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        ) : (
          <button
            aria-label="Close sidebar"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-slate-200 transition hover:border-cyan-300/40 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            onClick={onCloseMobile}
            type="button"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      <nav className="mt-8 grid w-full gap-2" aria-label="Primary navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActivePath(pathname, item.href);

          return (
            <Link
              className={[
                "flex min-h-11 items-center gap-3 rounded-md border px-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-300",
                isCollapsed ? "justify-center" : "",
                isActive
                  ? "border-cyan-300/50 bg-cyan-300/15 text-cyan-100"
                  : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/[0.07] hover:text-white"
              ].join(" ")}
              href={item.href}
              key={item.href}
              onClick={onCloseMobile}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {!isCollapsed ? <span className="truncate">{item.label}</span> : <span className="sr-only">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className={["mt-auto rounded-md border border-white/10 bg-white/[0.06] p-3", isCollapsed ? "w-full text-center" : ""].join(" ")}>
        <p className="text-xs font-semibold uppercase text-cyan-100">Phase 1</p>
        {!isCollapsed ? (
          <p className="mt-2 text-xs leading-5 text-slate-400">Project, editor, and architecture routes now share one shell.</p>
        ) : null}
      </div>
    </>
  );
}

export function SideNav({
  collapsed,
  mobileOpen,
  onCloseMobile,
  onToggle
}: Readonly<{
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  onToggle: () => void;
}>) {
  return (
    <>
      <aside
        className={[
          "sticky top-0 z-30 hidden h-screen min-h-screen border-r border-white/10 bg-slate-950/95 px-3 py-4 backdrop-blur lg:flex lg:flex-col",
          collapsed ? "items-center" : ""
        ].join(" ")}
      >
        <SideNavBody collapsed={collapsed} onToggle={onToggle} variant="desktop" />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Primary navigation">
          <button
            aria-label="Close sidebar overlay"
            className="absolute inset-0 h-full w-full bg-slate-950/75 backdrop-blur-sm"
            onClick={onCloseMobile}
            type="button"
          />
          <aside className="relative flex h-full w-[min(20rem,calc(100vw-2rem))] flex-col border-r border-white/10 bg-slate-950 px-3 py-4 shadow-2xl shadow-black/50">
            <SideNavBody collapsed={false} onCloseMobile={onCloseMobile} variant="mobile" />
          </aside>
        </div>
      ) : null}
    </>
  );
}
