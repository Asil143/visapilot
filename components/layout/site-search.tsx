"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toolsNav, visaGuides } from "@/config/navigation";

const pages = [
  ...visaGuides.map((g) => ({
    title: g.title,
    description: g.subtitle,
    href: `/guides/${g.slug}`,
    type: "Guide",
  })),
  ...toolsNav.map((t) => ({
    title: t.title,
    description: t.description || "",
    href: t.href,
    type: "Tool",
  })),
  {
    title: "Your dashboard",
    description: "Your profile, documents, deadlines and cases",
    href: "/dashboard",
    type: "Workspace",
  },
  {
    title: "Find an immigration lawyer",
    description: "Explore professional legal support",
    href: "/lawyers",
    type: "Resource",
  },
  {
    title: "Immigration glossary",
    description: "Understand common terms and acronyms",
    href: "/glossary",
    type: "Resource",
  },
];

export function SiteSearch({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, []);
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const matches = pages.filter((p) =>
    terms.every((t) => `${p.title} ${p.description}`.toLowerCase().includes(t)),
  );
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) setQuery("");
      }}
    >
      <DialogTrigger asChild>
        <button
          className={`sc-search-trigger ${compact ? "sc-search-compact" : ""}`}
          aria-label="Search guides and tools"
        >
          <Search size={18} />
          <span>Search anything</span>
          <kbd>⌘ K</kbd>
        </button>
      </DialogTrigger>
      <DialogContent className="sc-search-dialog">
        <DialogTitle>Find your next step.</DialogTitle>
        <DialogDescription>
          Search visa guides, planning tools, and resources.
        </DialogDescription>
        <label className="sc-search-input">
          <Search size={20} />
          <input
            autoComplete="off"
            aria-label="Search guides and tools"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try “STEM OPT” or “fees”"
          />
        </label>
        <div className="sc-search-results" aria-live="polite">
          {matches.length ? (
            matches.map((p) => (
              <Link key={p.href} href={p.href} onClick={() => setOpen(false)}>
                <div>
                  <small>{p.type}</small>
                  <strong>{p.title}</strong>
                  <p>{p.description}</p>
                </div>
                <ArrowUpRight size={18} />
              </Link>
            ))
          ) : (
            <p className="sc-search-empty">
              No matches for “{query}”. Try a visa name or browse the{" "}
              <Link href="/guides" onClick={() => setOpen(false)}>
                guide library
              </Link>
              .
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
