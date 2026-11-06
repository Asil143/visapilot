import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { F1_GUIDE } from "@/config/guides";
import { CheckCircle2, ArrowRight, ExternalLink, Bot, AlertCircle } from "lucide-react";

export const metadata = {
  title: "F-1 Student Visa Guide",
  description:
    "Complete F-1 student visa guide for international students — from I-20 to OPT.",
};

export default function F1GuidePage() {
  const guide = F1_GUIDE;

  return (
    <div className="sc-guide-article min-h-screen bg-background">
      {/* Hero */}
      <div className="sc-guide-hero"><div className="sc-guide-breadcrumb"><Link href="/guides">The guide library</Link><span>/</span><span>FIELD GUIDE 01</span></div>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">

              <Badge variant="info">F-1 Student Visa</Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">{guide.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{guide.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span>Processing: {guide.processing_times}</span>
              <span>·</span>
              <span>Fees: {guide.fees}</span>
              <span>·</span>
              <span>Updated: {guide.last_updated}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview */}
            <section>
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-muted-foreground leading-7">{guide.overview}</p>
            </section>

            {/* Steps */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Step-by-Step Guide</h2>
              <div className="space-y-6">
                {guide.steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1 pb-6 border-b last:border-0">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="font-semibold text-lg">{step.title}</h3>
                        {step.estimated_time && (
                          <Badge variant="secondary" className="text-xs">
                            {step.estimated_time}
                          </Badge>
                        )}
                      </div>
                      <p className="mt-2 text-muted-foreground text-sm">{step.description}</p>
                      <ul className="mt-3 space-y-2">
                        {step.action_items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      {step.uscis_link && (
                        <a
                          href={step.uscis_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          Official USCIS resource <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {guide.faq.map((item, i) => (
                  <Card key={i}>
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-sm">{item.question}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-6">
                        {item.answer}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Facts */}
            <Card>
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold">Quick Facts</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Visa type</span>
                    <Badge variant="info">F-1</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SEVIS fee</span>
                    <span className="font-medium">$350</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Visa fee (MRV)</span>
                    <span className="font-medium">$185</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Processing</span>
                    <span className="font-medium">Varies by post</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Legal disclaimer */}
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-5">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-orange-900">Not legal advice</p>
                    <p className="mt-1 text-xs text-orange-700">
                      This guide provides general information only. For your specific
                      situation, consult a licensed immigration attorney.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Assistant CTA */}
            <Card className="bg-primary text-white border-0">
              <CardContent className="p-5">
                <Bot className="h-6 w-6 mb-3" />
                <p className="font-semibold">Have a specific question?</p>
                <p className="mt-1 text-sm text-primary-foreground/80">
                  Ask our AI assistant for personalized F-1 guidance.
                </p>
                <Button variant="secondary" className="mt-4 w-full" asChild>
                  <Link href="/ai-assistant">
                    Ask AI Assistant <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Next guide */}
            <Card>
              <CardContent className="p-5">
                <p className="text-xs text-muted-foreground mb-2">Next guide</p>
                <Link
                  href="/guides/opt-stem-opt"
                  className="font-semibold text-sm hover:text-primary flex items-center justify-between"
                >
                  OPT & STEM OPT Guide
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
