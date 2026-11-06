"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Bell, Menu } from "lucide-react";
import { Sidebar } from "./sidebar";
import { Brand } from "./brand";
import { SiteSearch } from "./site-search";
import { dashboardNav, toolsNav, settingsNav } from "@/config/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const current = [...dashboardNav, ...toolsNav, ...settingsNav]
    .filter(
      (p) =>
        pathname === p.href ||
        (p.href !== "/dashboard" && pathname.startsWith(p.href)),
    )
    .sort((a, b) => b.href.length - a.href.length)[0];
  return (
    <div className="sc-dashboard-shell">
      <Sidebar />
      <div className="sc-dashboard-body">
        <header className="sc-workspace-header">
          <div className="sc-workspace-mobile">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button
                  className="sc-mobile-toggle"
                  aria-label="Open workspace navigation"
                >
                  <Menu size={22} />
                </button>
              </DialogTrigger>
              <DialogContent className="sc-sidebar-dialog">
                <DialogTitle className="sr-only">Your workspace</DialogTitle>
                <DialogDescription className="sr-only">
                  Navigate your immigration dashboard and tools.
                </DialogDescription>
                <Sidebar inDrawer onClose={() => setOpen(false)} />
              </DialogContent>
            </Dialog>
            <Brand />
          </div>
          <div className="sc-breadcrumb">
            <span>My workspace</span>
            <span>/</span>
            <strong>
              {current?.title === "Home"
                ? "Overview"
                : current?.title || "Your journey"}
            </strong>
          </div>
          <div className="sc-workspace-header-actions">
            <SiteSearch />
            <Link href="/guides" className="sc-header-guide">
              Guide library <ArrowUpRight size={14} />
            </Link>
            <Link
              href="/dashboard/reminders"
              aria-label="Notifications"
              className="sc-notification"
            >
              <Bell size={18} />
            </Link>
          </div>
        </header>
        <main id="main-content" className="sc-workspace-main">
          {children}
        </main>
      </div>
    </div>
  );
}
