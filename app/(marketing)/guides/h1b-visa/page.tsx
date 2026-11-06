import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Bot, AlertCircle, ExternalLink } from "lucide-react";
import { H1B_STEPS as STEPS, H1B_FAQ as FAQ } from "@/config/guides";

export const metadata = {
  title: "H-1B Visa Guide",
  description: "Complete H-1B specialty occupation visa guide — lottery, petition, extensions, and transfers.",
};

export default function H1BGuidePage() {
  return (
    <div className="sc-guide-article min-h-screen bg-background">
      <div className="sc-guide-hero"><div className="sc-guide-breadcrumb"><Link href="/guides">The guide library</Link><span>/</span><span>FIELD GUIDE 03</span></div>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">

              <Badge className="bg-green-100 text-green-700 border-green-200">H-1B Work Visa</Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">H-1B Specialty Occupation Visa</h1>
            <p className="mt-4 text-lg text-muted-foreground">Lottery, petition, extensions, and employer transfers — everything you need to know</p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-white border p-3 text-center shadow-sm">
                <p className="text-xl font-bold text-green-700">85,000</p>
                <p className="text-xs text-muted-foreground">Annual cap</p>
              </div>
              <div className="rounded-lg bg-white border p-3 text-center shadow-sm">
                <p className="text-xl font-bold text-green-700">6 years</p>
                <p className="text-xs text-muted-foreground">Initial max stay</p>
              </div>
              <div className="rounded-lg bg-white border p-3 text-center shadow-sm">
                <p className="text-xl font-bold text-green-700">~March</p>
                <p className="text-xs text-muted-foreground">Lottery window</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-6">H-1B Process — Step by Step</h2>
              <div className="space-y-6">
                {STEPS.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-white text-sm font-bold">{i+1}</div>
                    <div className="flex-1 pb-6 border-b last:border-0">
                      <h3 className="font-semibold text-lg">{step.title}</h3>
                      <p className="mt-2 text-muted-foreground text-sm">{step.description}</p>
                      <ul className="mt-3 space-y-2">
                        {step.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />{item}
                          </li>
                        ))}
                      </ul>
                      {step.link && (
                        <a href={step.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                          Official resource <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">H-1B Timeline (Cap-Subject)</h2>
              <div className="space-y-2">
                {[
                  { month: "Jan–Feb", event: "Employer and attorney prepare petition documents", color: "bg-blue-100 text-blue-800" },
                  { month: "March (dates vary)", event: "USCIS announces the cap registration window", color: "bg-yellow-100 text-yellow-800" },
                  { month: "After registration closes", event: "USCIS selects and notifies registrants", color: "bg-orange-100 text-orange-800" },
                  { month: "Apr 1", event: "Filing window opens for selected registrants", color: "bg-green-100 text-green-800" },
                  { month: "Apr–Sep", event: "USCIS adjudicates petitions", color: "bg-purple-100 text-purple-800" },
                  { month: "Oct 1", event: "H-1B employment begins (new fiscal year)", color: "bg-primary/10 text-primary" },
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-4 rounded-lg p-3 ${item.color}`}>
                    <span className="font-mono text-xs font-bold w-20 shrink-0">{item.month}</span>
                    <span className="text-sm">{item.event}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {FAQ.map((item, i) => (
                  <Card key={i}><CardContent className="p-5">
                    <h3 className="font-semibold text-sm">{item.q}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-6">{item.a}</p>
                  </CardContent></Card>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold">Key Facts</h3>
                <div className="space-y-2 text-sm divide-y">
                  {[["Cap","65k + 20k masters"],["Start date","October 1"],["Initial period","3 years"],["Max stay","6 years (extendable)"],["Dual intent","Yes ✓"],["Spouse work","H-4 EAD (if I-140 approved)"]].map(([k,v]) => (
                    <div key={k} className="flex justify-between pt-2 first:pt-0">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4 flex gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500 shrink-0" />
                <p className="text-xs text-orange-800">Not legal advice. H-1B petitions are complex — errors can result in denial or RFE. Consult a licensed attorney.</p>
              </CardContent>
            </Card>

            <Card className="bg-primary text-white border-0">
              <CardContent className="p-5">
                <Bot className="h-6 w-6 mb-3" />
                <p className="font-semibold">H-1B questions?</p>
                <p className="mt-1 text-sm opacity-80">Ask our AI assistant anytime.</p>
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
