import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Bot, AlertCircle, ExternalLink } from "lucide-react";
import { GREEN_CARD_EB_CATEGORIES as EB_CATEGORIES, GREEN_CARD_PROCESS_STEPS as PROCESS_STEPS, GREEN_CARD_FAQ as FAQ } from "@/config/guides";

export const metadata = {
  title: "Green Card Guide",
  description: "Employment-based green card guide — EB-1, EB-2, EB-3, and NIW pathways explained.",
};

export default function GreenCardGuidePage() {
  return (
    <div className="sc-guide-article min-h-screen bg-background">
      <div className="sc-guide-hero"><div className="sc-guide-breadcrumb"><Link href="/guides">The guide library</Link><span>/</span><span>FIELD GUIDE 04</span></div>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">

              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Permanent Residency</Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Green Card — Employment-Based</h1>
            <p className="mt-4 text-lg text-muted-foreground">EB-1, EB-2 NIW, EB-2, and EB-3 pathways explained with timelines</p>
            <div className="mt-6 rounded-lg bg-white border shadow-sm p-4 max-w-xl">
              <p className="text-sm font-semibold text-foreground mb-2">
                ⚡ Self-petition options (no employer needed):
              </p>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary">EB-1A Extraordinary Ability</Badge>
                <Badge variant="secondary">EB-2 NIW National Interest</Badge>
                <Badge variant="secondary">EB-1B Outstanding Researcher*</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">*EB-1B requires employer sponsor but no PERM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-12">

            {/* EB Categories */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Employment-Based Categories</h2>
              <div className="space-y-4">
                {EB_CATEGORIES.map(cat => (
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
              <h2 className="text-2xl font-bold mb-6">The Green Card Process</h2>
              <div className="space-y-4">
                {PROCESS_STEPS.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-bold">{i+1}</div>
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
                The State Department publishes a monthly Visa Bulletin showing which priority dates are
                &ldquo;current&rdquo; for each country. India and China face backlogs of <strong>10–50+ years</strong> for
                EB-2/EB-3 categories. EB-1A and EB-2 NIW are typically current for India (check monthly).
              </p>
              <a href="https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-primary font-medium hover:underline">
                Check current Visa Bulletin <ExternalLink className="h-4 w-4" />
              </a>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {FAQ.map((item, i) => (
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
                <h3 className="font-semibold mb-3">Which path is right for me?</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { type: "Researcher/PhD", path: "EB-1B or EB-2 NIW" },
                    { type: "Tech worker (FAANG)", path: "EB-2 via employer" },
                    { type: "Exceptional talent", path: "EB-1A self-petition" },
                    { type: "Skilled professional", path: "EB-3 via employer" },
                  ].map(({type, path}) => (
                    <div key={type} className="flex justify-between py-1.5 border-b last:border-0">
                      <span className="text-muted-foreground">{type}</span>
                      <span className="font-medium text-primary">{path}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4 flex gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500 shrink-0" />
                <p className="text-xs text-orange-800">Green card applications are complex and errors can be costly. Always work with a licensed immigration attorney.</p>
              </CardContent>
            </Card>

            <Card className="bg-primary text-white border-0">
              <CardContent className="p-5">
                <Bot className="h-6 w-6 mb-3" />
                <p className="font-semibold">Am I eligible for NIW?</p>
                <p className="mt-1 text-sm opacity-80">Ask our AI to evaluate your EB-2 NIW eligibility.</p>
                <Button variant="secondary" className="mt-4 w-full" asChild>
                  <Link href="/ai-assistant">Ask AI <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
