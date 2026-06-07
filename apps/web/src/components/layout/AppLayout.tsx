"use client";

import { ReactNode, useState } from "react";
import { Footer } from "./Footer";
import { MainContent } from "./MainContent";
import { SideNav } from "./SideNav";
import { TopNav } from "./TopNav";

export function AppLayout({ children }: Readonly<{ children: ReactNode }>) {
  const [isSideNavCollapsed, setIsSideNavCollapsed] = useState(false);
  const [isMobileSideNavOpen, setIsMobileSideNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div
        className={[
          "grid min-h-screen transition-[grid-template-columns] duration-200 ease-out",
          isSideNavCollapsed ? "lg:grid-cols-[5.25rem_1fr]" : "lg:grid-cols-[16rem_1fr]"
        ].join(" ")}
      >
        <SideNav
          collapsed={isSideNavCollapsed}
          mobileOpen={isMobileSideNavOpen}
          onCloseMobile={() => setIsMobileSideNavOpen(false)}
          onToggle={() => setIsSideNavCollapsed((current) => !current)}
        />
        <div className="flex min-w-0 flex-col">
          <TopNav onOpenMobileNav={() => setIsMobileSideNavOpen(true)} />
          <MainContent>{children}</MainContent>
          <Footer />
        </div>
      </div>
    </div>
  );
}
