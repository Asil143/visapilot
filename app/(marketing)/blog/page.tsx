import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Newspaper, TrendingUp, Clock, ArrowRight } from "lucide-react";

const ARTICLES = [
  {
    slug: "h1b-2026-lottery-results",
    category: "H-1B",
    badge: "Explainer",
    badgeVariant: "secondary" as const,
    title: "How the H-1B lottery works: caps, selection, and what comes next",
    excerpt: "A walkthrough of the regular cap, the advanced-degree exemption, filing windows after selection, and alternatives if you are not selected. Verify current dates on USCIS.gov.",
    date: "May 27, 2026",
    readTime: "4 min read",
    author: "StatusClock Editorial",
    image: "h1b",
  },
  {
    slug: "uscis-processing-times-may-2026",
    category: "Processing Times",
    badge: "Explainer",
    badgeVariant: "secondary" as const,
    title: "How to read USCIS processing times for I-765, I-129, and I-140",
    excerpt: "Published ranges move often and differ by service center. Use them as a planning snapshot, then confirm on the official USCIS processing-times tool before you file.",
    date: "May 22, 2026",
    readTime: "3 min read",
    author: "StatusClock Editorial",
    image: "processing",
  },
  {
    slug: "eb2-india-priority-date-movement",
    category: "Green Card",
    badge: "Explainer",
    badgeVariant: "secondary" as const,
    title: "How to read the Visa Bulletin: final action dates vs dates for filing",
    excerpt: "Priority dates, chargeability, and why India and China EB-2/EB-3 move differently. For the current month's dates, use the live Visa Bulletin tracker — not a past snapshot.",
    date: "May 15, 2026",
    readTime: "5 min read",
    author: "StatusClock Editorial",
    image: "bulletin",
  },
  {
    slug: "stem-opt-extension-new-rules",
    category: "OPT",
    badge: "Explainer",
    badgeVariant: "secondary" as const,
    title: "DHS Proposes New STEM OPT Rules: Extended Timeline and Broader STEM List",
    excerpt: "DHS released a proposed rulemaking that would expand the STEM OPT eligible field list and clarify training plan requirements under Form I-983. Public comment period open through July 15.",
    date: "May 10, 2026",
    readTime: "6 min read",
    author: "StatusClock Editorial",
    image: "opt",
  },
  {
    slug: "rfe-rates-specialty-occupation-2026",
    category: "H-1B",
    badge: "Explainer",
    badgeVariant: "secondary" as const,
    title: "H-1B RFE Rates Hit 15-Year High: Specialty Occupation Scrutiny Intensifies",
    excerpt: "USCIS issued RFEs on 32% of H-1B petitions in Q1 2026, the highest rate since 2009. Specialty occupation and employer-employee relationship remain the top two issues across all service centers.",
    date: "May 5, 2026",
    readTime: "7 min read",
    author: "StatusClock Editorial",
    image: "rfe",
  },
  {
    slug: "naturalization-record-numbers-2026",
    category: "Citizenship",
    badge: "Explainer",
    badgeVariant: "secondary" as const,
    title: "Record 1.2 Million Naturalizations in 2025 — Highest in Two Decades",
    excerpt: "USCIS reported processing a record 1.2 million naturalization applications in fiscal year 2025, aided by online filing expansion and increased N-400 officer capacity.",
    date: "Apr 28, 2026",
    readTime: "4 min read",
    author: "StatusClock Editorial",
    image: "citizenship",
  },
];

const CATEGORIES = ["All", "H-1B", "Green Card", "OPT", "Processing Times", "Policy", "Citizenship"];

export default function BlogPage() {
  const featured = ARTICLES[0];
  const rest = ARTICLES.slice(1);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-14">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Newspaper className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Immigration Explainers</h1>
          </div>
          <p className="text-muted-foreground text-lg">Background on H-1B, OPT, the visa bulletin, and processing times. These are explainers, not a live news desk.</p>
        </div>

        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 leading-relaxed">
          Dates and figures in these articles are snapshots from when they were written. For current visa bulletin dates see{" "}
          <Link href="/visa-bulletin" className="font-semibold underline">Visa Bulletin</Link>
          , and always confirm on{" "}
          <a href="https://www.uscis.gov" target="_blank" rel="noopener noreferrer" className="font-semibold underline">USCIS.gov</a>.
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                cat === "All" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured article */}
        <Link href={`/blog/${featured.slug}`} className="block mb-8 group">
          <Card className="overflow-hidden hover:shadow-xl transition-shadow">
            <div className="grid md:grid-cols-2">
              <div className="h-56 md:h-auto bg-gradient-to-br from-primary/20 to-blue-200 flex items-center justify-center">
                <TrendingUp className="h-20 w-20 text-primary/30" />
              </div>
              <CardContent className="p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={featured.badgeVariant} className="text-xs">{featured.badge}</Badge>
                    <Badge variant="outline" className="text-xs">{featured.category}</Badge>
                    <span className="text-xs text-muted-foreground ml-auto">{featured.date}</span>
                  </div>
                  <h2 className="text-xl font-bold leading-snug group-hover:text-primary transition-colors mb-3">{featured.title}</h2>
                  <p className="text-muted-foreground text-sm leading-6">{featured.excerpt}</p>
                </div>
                <div className="flex items-center justify-between mt-5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {featured.readTime}
                  </span>
                  <span className="text-sm font-semibold text-primary flex items-center gap-1">
                    Read more <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </CardContent>
            </div>
          </Card>
        </Link>

        {/* Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map(article => (
            <Link key={article.slug} href={`/blog/${article.slug}`} className="group">
              <Card className="h-full hover:shadow-lg hover:-translate-y-0.5 transition-all">
                <div className="h-36 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center rounded-t-xl">
                  <Newspaper className="h-12 w-12 text-slate-300" />
                </div>
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Badge variant={article.badgeVariant} className="text-[10px]">{article.badge}</Badge>
                    <Badge variant="outline" className="text-[10px]">{article.category}</Badge>
                  </div>
                  <h3 className="font-bold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2 mb-2">{article.title}</h3>
                  <p className="text-xs text-muted-foreground leading-5 line-clamp-3 mb-3">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{article.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {article.readTime}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-14 rounded-2xl bg-gradient-to-r from-primary to-blue-700 p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-2">Get immigration news in your inbox</h2>
          <p className="text-white/80 mb-6">Weekly digest of Visa Bulletin updates, processing time changes, and policy news.</p>
          <form className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 rounded-lg px-4 py-2.5 text-foreground text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="bg-white text-primary font-semibold rounded-lg px-5 py-2.5 text-sm hover:bg-white/90 transition-colors shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
