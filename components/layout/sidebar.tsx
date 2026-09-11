"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, UserButton } from "@clerk/nextjs";
import { Bot, Crown, Zap, ChevronDown } from "lucide-react";
import { dashboardNav, toolsNav, settingsNav } from "@/config/navigation";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const [toolsOpen, setToolsOpen] = useState(
    pathname.includes("/tools") || pathname.includes("/rfe-assistant") || pathname.includes("/forms")
  );
  const [plan, setPlan] = useState<string>("free");

  useEffect(() => {
    fetch("/api/user/plan")
      .then(r => r.json())
      .then(d => { if (d?.plan) setPlan(d.plan); })
      .catch(() => {});
  }, []);

  const isPaid = plan !== "free";

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-slate-950 text-white">
      {/* Logo */}
      <Link href="/" className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5 hover:opacity-90 transition-opacity">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-slate-950">
          <Bot className="h-5 w-5" />
        </div>
        <span className="font-semibold text-lg tracking-tight">StatusClock</span>
      </Link>

      {/* Main Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-0.5">
          {dashboardNav.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors group",
                  isActive
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-400 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.title}</span>
                {item.href === "/ai-assistant" && !isActive && (
                  <Zap className="ml-auto h-3 w-3 text-yellow-500 opacity-70" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Tools collapsible */}
        <div className="mt-4 border-t border-white/10 pt-4">
          <button
            onClick={() => setToolsOpen(!toolsOpen)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-300 transition-colors"
          >
            <span>Tools</span>
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", toolsOpen && "rotate-180")} />
          </button>
          {toolsOpen && (
            <div className="space-y-0.5 mt-1">
              {toolsNav.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-white text-slate-950 shadow-sm"
                        : "text-slate-400 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{item.title}</span>
                    {item.badge && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{item.badge}</Badge>}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Account */}
        <div className="mt-4 border-t border-white/10 pt-4 space-y-0.5">
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Account</p>
          {settingsNav.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-white text-slate-950 shadow-sm"
                    : "text-slate-400 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.title}
              </Link>
            );
          })}
        </div>

        {/* Upgrade CTA — only for free users */}
        {!isPaid && (
          <div className="mt-4 mx-1 rounded-lg border border-white/10 bg-white/[0.06] p-4">
            <div className="flex items-center gap-2 mb-1.5">
              <Crown className="h-4 w-4 text-blue-300" />
              <p className="font-semibold text-sm text-white">Unlock more</p>
            </div>
            <p className="text-xs text-slate-400 leading-4">
              Unlimited AI queries, document analysis, and SMS deadline alerts.
            </p>
            <Link
              href="/pricing"
              className="mt-3 flex w-full items-center justify-center rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-slate-100 transition-colors"
            >
              View Plans — from $19
            </Link>
          </div>
        )}
      </nav>

      {/* User section */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <UserButton />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-white">{user?.firstName} {user?.lastName}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge variant={isPaid ? "info" : "secondary"} className="text-[10px] px-1.5 py-0 capitalize">
                {isPaid ? plan : "Free"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
