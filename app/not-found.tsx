import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, ArrowLeft, Search, Home, BookOpen, MessageCircle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 text-center">
      {/* Illustration */}
      <div className="relative mb-8">
        <div className="w-32 h-32 rounded-3xl bg-primary/10 flex items-center justify-center">
          <Bot className="h-16 w-16 text-primary/40" />
        </div>
        <div className="absolute -top-3 -right-3 w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl">
          404
        </div>
      </div>

      {/* Text */}
      <h1 className="text-3xl font-bold mb-2">Page not found</h1>
      <p className="text-muted-foreground text-lg max-w-md leading-6 mb-8">
        This page doesn&apos;t exist — or it may have moved. Let&apos;s get you back on track.
      </p>

      {/* Quick links */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        <Link href="/">
          <Button>
            <Home className="mr-2 h-4 w-4" /> Home
          </Button>
        </Link>
        <Link href="/dashboard/tools/checklists">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Free checklists
          </Button>
        </Link>
        <Link href="/guides">
          <Button variant="outline">
            <MessageCircle className="mr-2 h-4 w-4" /> Visa guides
          </Button>
        </Link>
      </div>

      {/* Helpful links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl w-full">
        {[
          { href: "/guides/f1-visa", icon: BookOpen, title: "F-1 Visa Guide", desc: "Status, OPT, and travel rules" },
          { href: "/guides/h1b-visa", icon: BookOpen, title: "H-1B Guide", desc: "Specialty occupation petition" },
          { href: "/dashboard/tools", icon: Search, title: "Immigration Tools", desc: "Calculators and trackers" },
        ].map(link => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl border p-4 text-left hover:bg-accent hover:shadow-sm transition-all group"
            >
              <Icon className="h-5 w-5 text-primary mb-2" />
              <p className="font-semibold text-sm group-hover:text-primary transition-colors">{link.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{link.desc}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
