"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { ArrowUpRight, ChevronDown, Menu } from "lucide-react";
import { Brand } from "./brand";
import { SiteSearch } from "./site-search";
import { toolsNav } from "@/config/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const links = [
  { href: "/guides", label: "Visa guides" },
  { href: "/source-center", label: "Source center" },
  { href: "/lawyers", label: "Find a lawyer" },
];

export function Navbar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsTrigger = useRef<HTMLButtonElement>(null);
  return (
    <header className="sc-header">
      <div className="sc-nav sc-container">
        <Brand />
        <nav className="sc-desktop-nav" aria-label="Main navigation">
          <Link
            href="/guides"
            aria-current={pathname.startsWith("/guides") ? "page" : undefined}
          >
            Visa guides
          </Link>
          <div
            className="sc-nav-dropdown"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget))
                setToolsOpen(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setToolsOpen(false);
                toolsTrigger.current?.focus();
              }
            }}
          >
            <button
              ref={toolsTrigger}
              onClick={() => setToolsOpen((v) => !v)}
              aria-expanded={toolsOpen}
              aria-controls="nav-tools"
            >
              Your toolkit <ChevronDown size={13} />
            </button>
            {toolsOpen && (
              <div id="nav-tools" className="sc-tools-menu">
                <span className="sc-eyebrow">
                  A little clarity goes a long way
                </span>
                {toolsNav.map((t) => (
                  <Link
                    href={t.href}
                    key={t.href}
                    onClick={() => setToolsOpen(false)}
                  >
                    <t.icon size={20} />
                    <div>
                      <strong>{t.title}</strong>
                      <small>{t.description}</small>
                    </div>
                    <ArrowUpRight size={15} />
                  </Link>
                ))}
              </div>
            )}
          </div>
          {links.slice(1).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname.startsWith(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="sc-nav-actions">
          <SiteSearch compact />
          <span className="sc-desktop-auth">
            {isSignedIn ? (
              <UserButton />
            ) : (
              <SignInButton mode="modal">
                <button className="sc-signin">Log in</button>
              </SignInButton>
            )}
          </span>
          <Link
            href={isSignedIn ? "/dashboard" : "/visa-finder"}
            className="sc-button sc-button-small sc-nav-cta"
          >
            {isSignedIn ? "My dashboard" : "Find my path"}
            <ArrowUpRight size={16} />
          </Link>
          <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
            <DialogTrigger asChild>
              <button className="sc-mobile-toggle" aria-label="Open navigation">
                <Menu size={23} />
              </button>
            </DialogTrigger>
            <DialogContent className="sc-mobile-dialog">
              <DialogTitle className="sr-only">Navigation</DialogTitle>
              <DialogDescription className="sr-only">
                Explore StatusClock guides and tools.
              </DialogDescription>
              <Brand onClick={() => setMobileOpen(false)} />
              <nav aria-label="Mobile navigation" className="sc-mobile-links">
                {[
                  ...links,
                  { href: "/pricing", label: "Plans & pricing" },
                  { href: "/dashboard", label: "My dashboard" },
                ].map((l) => (
                  <Link
                    href={l.href}
                    key={l.href}
                    onClick={() => setMobileOpen(false)}
                  >
                    {l.label}
                    <ArrowUpRight size={20} />
                  </Link>
                ))}
                <span className="sc-eyebrow">Your toolkit</span>
                {toolsNav.map((t) => (
                  <Link
                    className="sc-mobile-tool"
                    key={t.href}
                    href={t.href}
                    onClick={() => setMobileOpen(false)}
                  >
                    <t.icon size={18} />
                    {t.title}
                  </Link>
                ))}
              </nav>
              {!isSignedIn && (
                <SignInButton mode="modal">
                  <button
                    className="sc-button"
                    onClick={() => setMobileOpen(false)}
                  >
                    Log in to your account
                    <ArrowUpRight size={18} />
                  </button>
                </SignInButton>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
