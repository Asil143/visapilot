import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Bot, AlertCircle, ExternalLink, Heart } from "lucide-react";
import { FAMILY_CATEGORIES, FAMILY_PROCESS_STEPS, FAMILY_FAQ } from "@/config/guides";

export const metadata = {
  title: "Family-Based Green Card Guide",
  description: "Family-based green card guide for petitioners — immediate relative, F1, F2A, F2B, F3, and F4 categories explained.",
};

export default function FamilyGreenCardGuidePage() {
  return (
    <div className="sc-guide-article min-h-screen bg-background">
      <div className="sc-guide-hero"><div className="sc-guide-breadcrumb"><Link href="/guides">The guide library</Link><span>/</span><span>FIELD GUIDE 05</span></div>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-7 w-7 text-rose-500" />
              <Badge className="bg-rose-100 text-rose-700 border-rose-200">Permanent Residency</Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Green Card — Family-Based</h1>
            <p className="mt-4 text-lg text-muted-foreground">A guide for petitioners sponsoring a spouse, child, parent, or sibling for a green card</p>
            <div className="mt-6 rounded-lg bg-white border shadow-sm p-4 max-w-xl">
              <p className="text-sm font-semibold text-foreground mb-2">
                ⚡ No priority-date wait (Immediate Relative):
              </p>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">IR-1/CR-1 Spouse</Badge>
                <Badge variant="secondary">IR-2 Child Under 21</Badge>
                <Badge variant="secondary">IR-5 Parent</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">F1–F4 preference categories are numerically capped and require a priority-date wait — see below.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-12">

            {/* Relationship Categories */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Relationship Categories</h2>
              <div className="space-y-4">
                {FAMILY_CATEGORIES.map(cat => (
                  <div key={cat.category} className={`rounded-xl border p-5 ${cat.color}`}>
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <Badge className={`${cat.badge} border-0 font-bold`}>{cat.category}</Badge>
                        <h3 className="font-bold text-lg">{cat.title}</h3>
                      </div>
                      <Badge variant="outline" className="text-xs font-mono">
                        ~{cat.timeline}
                      </Badge>
                    </div>
                    <p className="text-sm opacity-80 mb-3">{cat.description}</p>
                    <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                      {cat.requirements.map((req, j) => (
                        <div key={j} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 opacity-70" />{req}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Process */}
            <section>
              <h2 className="text-2xl font-bold mb-6">The Family-Based Green Card Process</h2>
              <div className="space-y-4">
                {FAMILY_PROCESS_STEPS.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-600 text-white text-sm font-bold">{i + 1}</div>
                    <div className="flex-1 pb-5 border-b last:border-0">
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Visa Bulletin */}
            <section className="rounded-xl bg-slate-50 border p-6">
              <h2 className="text-xl font-bold mb-3">Visa Bulletin & Priority Dates</h2>
              <p className="text-sm text-muted-foreground leading-6">
                Immediate Relative categories (spouse, minor child, parent of a U.S. citizen) never need to check the
                Visa Bulletin — they have no annual cap. F1–F4 preference categories do: check the monthly
                Visa Bulletin for your category and country of birth. <strong>F4 (siblings)</strong> and{" "}
                <strong>F3 (married children)</strong> from Mexico, India, and the Philippines face the longest backlogs.
              </p>
              <a href="https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline">
                Check current Visa Bulletin <ExternalLink className="h-4 w-4" />
              </a>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {FAMILY_FAQ.map((item, i) => (
                  <Card key={i}>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-sm">{item.question}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-6">{item.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold mb-3">Am I an Immediate Relative or Preference category?</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { type: "Spouse of a U.S. citizen", path: "IR-1/CR-1 — no wait" },
                    { type: "Child (under 21) of a U.S. citizen", path: "IR-2 — no wait" },
                    { type: "Parent of a U.S. citizen (21+)", path: "IR-5 — no wait" },
                    { type: "Spouse of a green card holder", path: "F2A — priority date wait" },
                    { type: "Sibling of a U.S. citizen", path: "F4 — longest wait" },
                  ].map(({ type, path }) => (
                    <div key={type} className="flex justify-between py-1.5 border-b last:border-0 gap-3">
                      <span className="text-muted-foreground">{type}</span>
                      <span className="font-medium text-primary text-right">{path}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4 flex gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500 shrink-0" />
                <p className="text-xs text-orange-800">Family-based petitions involve strict relationship evidence requirements and errors can cause years of delay. Always work with a licensed immigration attorney.</p>
              </CardContent>
            </Card>

            <Card className="bg-primary text-white border-0">
              <CardContent className="p-5">
                <Bot className="h-6 w-6 mb-3" />
                <p className="font-semibold">Which category applies to my family?</p>
                <p className="mt-1 text-sm opacity-80">Ask our AI to help identify your relationship category and next steps.</p>
                <Button variant="secondary" className="mt-4 w-full" asChild>
                  <Link href="/ai-assistant">Ask AI <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground mb-2">Related</p>
                <Link href="/dashboard/tools/forms/i-130" className="flex items-center justify-between text-sm hover:text-primary mb-2">
                  Fill Form I-130 (Petitioner) <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/dashboard/tools/forms/i-864" className="flex items-center justify-between text-sm hover:text-primary mb-2">
                  Fill Form I-864 (Affidavit of Support) <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/guides/green-card" className="flex items-center justify-between text-sm hover:text-primary">
                  Employment-Based Green Card <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
