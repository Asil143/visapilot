"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { Bot, Menu, X, ChevronDown, CheckSquare, Clock, Bot as BotIcon, BarChart3, Calculator } from "lucide-react";
import { useState } from "react";

const toolsLinks = [
  { href: "/dashboard/tools/checklists",   label: "Visa Checklists", icon: CheckSquare, desc: "Step-by-step checklists for every visa" },
  { href: "/dashboard/tools/opt-tracker",  label: "OPT Day Counter", icon: Clock,       desc: "Track your 90-day unemployment limit"  },
  { href: "/dashboard/tools/visa-bulletin",label: "Visa Bulletin",   icon: BarChart3,   desc: "Priority date tracker & wait estimator"},
  { href: "/dashboard/tools/fee-calculator",label: "Fee Calculator", icon: Calculator,  desc: "Calculate USCIS filing fees"            },
  { href: "/ai-assistant",                  label: "AI Assistant",   icon: BotIcon,     desc: "Ask immigration questions 24/7"         },
];

const navLinks = [
  { href: "/guides", label: "Guides" },
  { href: "/lawyers", label: "Find a Lawyer" },
  { href: "/pricing", label: "Pricing" },
];

export function Navbar() {
  const { isSignedIn } = useUser();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);

  const isToolsActive = toolsLinks.some((t) => pathname.startsWith(t.href));

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg tracking-tight text-slate-950">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-950 text-white">
            <Bot className="h-5 w-5" />
          </div>
          StatusClock
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">BETA</Badge>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {/* Tools dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setToolsOpen(true)}
            onMouseLeave={() => setToolsOpen(false)}
          >
            <button
              className={cn(
                "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
                isToolsActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              Tools
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", toolsOpen && "rotate-180")} />
            </button>

            {toolsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-72">
                <div className="bg-white border border-slate-200 rounded-lg shadow-xl shadow-slate-900/10 overflow-hidden">
                  <div className="p-1.5">
                    {toolsLinks.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        className="flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                      >
                        <div className="h-8 w-8 rounded-md bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-blue-50 transition-colors">
                          <tool.icon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">{tool.label}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{tool.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname.startsWith(link.href) ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {isSignedIn ? (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <UserButton />
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm">Get Started Free</Button>
              </SignUpButton>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-1">
          {/* Tools expandable */}
          <button
            onClick={() => setMobileToolsOpen(!mobileToolsOpen)}
            className="w-full flex items-center justify-between py-2 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Tools
            <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", mobileToolsOpen && "rotate-180")} />
          </button>
          {mobileToolsOpen && (
            <div className="pl-3 space-y-1 pb-1">
              {toolsLinks.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  <tool.icon className="h-4 w-4" />
                  {tool.label}
                </Link>
              ))}
            </div>
          )}

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 flex flex-col gap-2">
            {isSignedIn ? (
              <Button asChild><Link href="/dashboard">Dashboard</Link></Button>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full">Get Started Free</Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
