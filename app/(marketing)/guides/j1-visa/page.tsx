import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RichText } from "@/components/ui/rich-text";
import { CheckCircle2, AlertTriangle, ArrowRight, Bot, ChevronRight, Info } from "lucide-react";
import { J1_SECTIONS as SECTIONS, J1_FAQS as FAQS } from "@/config/guides";

export default function J1GuidePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-b">
        <div className="max-w-4xl mx-auto px-6 py-14">
          <Badge variant="secondary" className="mb-4">Visa Guide</Badge>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">🌍</span>
            <h1 className="text-4xl font-bold">J-1 Exchange Visitor Visa</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl leading-6">
            Exchange programs, research scholars, physicians in training, and cultural visitors — plus the critical two-year home residency rule explained.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Badge variant="outline" className="text-sm">Research Scholars</Badge>
            <Badge variant="outline" className="text-sm">Physicians</Badge>
            <Badge variant="outline" className="text-sm">Students</Badge>
            <Badge variant="outline" className="text-sm">Two-Year Rule</Badge>
            <Badge variant="outline" className="text-sm">J-1 Waivers</Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="md:col-span-2 space-y-10">
          {SECTIONS.map((section, i) => (
            <div key={i}>
              <h2 className="text-xl font-bold mb-4">{section.title}</h2>

              {section.isAlert && (
                <div className="rounded-xl border-2 border-orange-300 bg-orange-50 p-5 mb-4 flex gap-3">
                  <AlertTriangle className="h-6 w-6 text-orange-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-orange-900">
                    <p className="font-bold mb-2">Critical: Two-Year Home Residency Requirement</p>
                    <RichText
                      text={section.body!}
                      className="space-y-2"
                      paragraphClassName="leading-5"
                      headingClassName="font-bold text-orange-950"
                      listClassName="list-disc list-inside space-y-1 leading-5"
                    />
                  </div>
                </div>
              )}

              {section.programs && (
                <div className="grid grid-cols-2 gap-3">
                  {section.programs.map((prog, j) => {
                    const Icon = prog.icon;
                    return (
                      <div key={j} className="rounded-lg border p-4 flex gap-3">
                        <div className="rounded-md bg-orange-50 text-orange-600 p-2 h-fit shrink-0">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{prog.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5 leading-4">{prog.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {section.body && !section.isAlert && (
                <RichText
                  text={section.body}
                  className="space-y-3 text-sm"
                  paragraphClassName="text-muted-foreground leading-6"
                  headingClassName="font-bold text-foreground mb-1"
                  listClassName="list-disc list-inside space-y-1.5 text-muted-foreground leading-6"
                />
              )}
            </div>
          ))}

          {/* FAQs */}
          <div>
            <h2 className="text-xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div key={i} className="rounded-lg border p-4">
                  <p className="font-semibold text-sm mb-2 flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {faq.q}
                  </p>
                  <p className="text-sm text-muted-foreground leading-5 pl-6">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* AI CTA */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Bot className="h-5 w-5 text-primary" />
                <p className="font-bold text-sm">Ask the AI</p>
              </div>
              <p className="text-xs text-muted-foreground mb-4 leading-4">
                Get instant answers about J-1 waiver requirements, two-year rule applicability, and next steps for your situation.
              </p>
              <Link href="/ai-assistant">
                <Button size="sm" className="w-full">
                  Ask a Question <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Key Facts */}
          <Card>
            <CardContent className="p-5">
              <p className="font-bold text-sm mb-3">Key Facts</p>
              <ul className="space-y-2.5">
                {[
                  "Governed by DOS Bureau of Educational and Cultural Affairs",
                  "DS-2019 is the primary J-1 status document (not the visa stamp)",
                  "Duration of Status (D/S) — stay tied to program end date",
                  "J-2 dependents can get employment authorization",
                  "Two-year rule blocks H/L/K visas and green cards",
                  "5 waiver types — Conrad 30 is most common for physicians",
                ].map((fact, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                    {fact}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Two-year rule check */}
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <p className="font-bold text-sm text-orange-800">Check Your Status</p>
              </div>
              <p className="text-xs text-orange-700 mb-3 leading-4">
                Not sure if the two-year rule applies to you? Ask the StatusClock AI — it can walk you through the checklist.
              </p>
              <Link href="/ai-assistant">
                <Button size="sm" variant="outline" className="w-full border-orange-300 text-orange-700 hover:bg-orange-100">
                  Check Two-Year Rule
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Related guides */}
          <Card>
            <CardContent className="p-5">
              <p className="font-bold text-sm mb-3">Related Guides</p>
              <div className="space-y-2">
                {[
                  { href: "/guides/h1b-visa", label: "H-1B Work Visa" },
                  { href: "/guides/green-card", label: "Employment Green Card" },
                  { href: "/guides/f1-visa", label: "F-1 Student Visa" },
                ].map(g => (
                  <Link key={g.href} href={g.href} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ChevronRight className="h-3.5 w-3.5 text-primary" />
                    {g.label}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 flex gap-3">
            <Info className="h-4 w-4 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-800">This guide is for informational purposes only. Consult a licensed immigration attorney for advice specific to your situation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
