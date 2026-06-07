"use client";

import { Bell, ExternalLink, Menu, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  loadNotifications,
  NOTIFICATIONS_CHANGED_EVENT,
  type AppNotification
} from "../../features/projects/project-notifications";

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

function formatNotificationTime(createdAt: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(createdAt));
}

export function TopNav({ onOpenMobileNav }: Readonly<{ onOpenMobileNav: () => void }>) {
  const pathname = usePathname();
  const routeTitle = getRouteTitle(pathname);
  const apiUrl = process.env["NEXT_PUBLIC_API_URL"] ?? "https://house-designer-api.onrender.com";
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const visibleNotifications = useMemo(() => notifications.slice(0, 6), [notifications]);
  const notificationCountLabel = notifications.length > 99 ? "99+" : `${notifications.length}`;

  useEffect(() => {
    function refreshNotifications() {
      setNotifications(loadNotifications());
    }

    refreshNotifications();
    window.addEventListener(NOTIFICATIONS_CHANGED_EVENT, refreshNotifications);
    window.addEventListener("storage", refreshNotifications);

    return () => {
      window.removeEventListener(NOTIFICATIONS_CHANGED_EVENT, refreshNotifications);
      window.removeEventListener("storage", refreshNotifications);
    };
  }, []);

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
          <div className="relative">
            <button
              aria-expanded={isNotificationsOpen}
              aria-label={`Notifications, ${notifications.length} active`}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white/[0.06] text-slate-100 transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              onClick={() => setIsNotificationsOpen((current) => !current)}
              type="button"
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              {notifications.length > 0 ? (
                <span className="absolute -right-1 -top-1 grid min-h-5 min-w-5 place-items-center rounded-full border border-slate-950 bg-cyan-400 px-1 text-[0.65rem] font-bold leading-none text-slate-950 shadow-lg shadow-cyan-950/40">
                  {notificationCountLabel}
                </span>
              ) : null}
            </button>

            {isNotificationsOpen ? (
              <div className="absolute right-0 top-12 z-50 w-[min(26rem,calc(100vw-2rem))] overflow-hidden rounded-md border border-white/10 bg-slate-950 shadow-2xl shadow-black/50">
                <div className="border-b border-white/10 p-4">
                  <h2 className="text-base font-semibold text-white">Notifications</h2>
                  <p className="mt-1 text-sm font-semibold text-slate-400">
                    {notifications.length} active {notifications.length === 1 ? "change" : "changes"}
                  </p>
                </div>
                <div className="max-h-80 overflow-auto p-2">
                  {visibleNotifications.length > 0 ? (
                    visibleNotifications.map((notification) => (
                      <article
                        className="rounded-md border border-transparent px-3 py-3 transition hover:border-white/10 hover:bg-white/[0.06]"
                        key={notification.id}
                      >
                        <h3 className="text-sm font-semibold text-white">{notification.title}</h3>
                        <p className="mt-1 text-xs text-slate-400">
                          {notification.context} | {formatNotificationTime(notification.createdAt)}
                        </p>
                      </article>
                    ))
                  ) : (
                    <p className="px-3 py-6 text-sm text-slate-400">No active changes yet.</p>
                  )}
                </div>
                <div className="flex items-center justify-between border-t border-white/10 p-3 text-sm font-semibold">
                  <span className="text-slate-400">System change log</span>
                  <Link className="text-cyan-300 transition hover:text-cyan-100" href="/dashboard">
                    Open dashboard
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
