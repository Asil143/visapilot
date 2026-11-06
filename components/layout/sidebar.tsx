"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { ArrowUpRight, ChevronDown, Sparkles } from "lucide-react";
import { dashboardNav, toolsNav, settingsNav } from "@/config/navigation";
import { useState, useEffect } from "react";
import { Brand } from "./brand";

export function Sidebar({
  inDrawer = false,
  onClose,
}: {
  inDrawer?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const { user, isSignedIn } = useUser();
  const [toolsOpen, setToolsOpen] = useState(
    pathname.includes("/tools") || pathname.includes("/rfe-assistant"),
  );
  const [plan, setPlan] = useState("free");
  useEffect(() => {
    if (!isSignedIn) return;
    fetch("/api/user/plan")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.plan) setPlan(d.plan);
      })
      .catch(() => {});
  }, [isSignedIn]);
  function navItem(item: (typeof dashboardNav)[number]) {
    const active =
      item.href === "/dashboard"
        ? pathname === item.href
        : pathname.startsWith(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClose}
        className={active ? "sc-side-link sc-side-active" : "sc-side-link"}
        aria-current={active ? "page" : undefined}
      >
        <item.icon size={17} strokeWidth={1.5} />
        <span>{item.title === "Home" ? "Overview" : item.title}</span>
        {item.href === "/ai-assistant" && <Sparkles size={12} />}
        {item.badge && <small>{item.badge}</small>}
      </Link>
    );
  }
  return (
    <aside className={`sc-sidebar${inDrawer ? " sc-sidebar-drawer" : ""}`}>
      <div className="sc-sidebar-brand">
        <Brand light onClick={onClose} />
        <span>YOUR NEXT CHAPTER, ORGANIZED.</span>
      </div>
      <nav className="sc-sidebar-nav" aria-label="Workspace navigation">
        <span className="sc-side-label">My workspace</span>
        {dashboardNav.map(navItem)}
        <div className="sc-sidebar-tools">
          <button
            onClick={() => setToolsOpen((v) => !v)}
            aria-expanded={toolsOpen}
            aria-controls={
              inDrawer ? "mobile-workspace-tools" : "workspace-tools"
            }
          >
            <span>YOUR TOOLKIT</span>
            <ChevronDown size={13} className={toolsOpen ? "rotate-180" : ""} />
          </button>
          {toolsOpen && (
            <div id={inDrawer ? "mobile-workspace-tools" : "workspace-tools"}>
              {toolsNav.map(navItem)}
            </div>
          )}
        </div>
        <div className="sc-side-settings">{settingsNav.map(navItem)}</div>
      </nav>
      <div className="sc-sidebar-bottom">
        <Link href="/guides" className="sc-side-guide" onClick={onClose}>
          <span>
            A little clarity
            <br />
            for your next move.
          </span>
          <ArrowUpRight size={21} />
          <small>EXPLORE THE GUIDE LIBRARY</small>
        </Link>
        <div className="sc-side-user">
          {isSignedIn ? (
            <UserButton />
          ) : (
            <span className="sc-user-avatar">G</span>
          )}
          <div>
            <strong>{user?.firstName || "Guest explorer"}</strong>
            <Link href="/pricing" onClick={onClose}>
              {isSignedIn
                ? `${plan === "free" ? "Free" : plan} plan`
                : "Make this space yours"}
              <ArrowUpRight size={11} />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
