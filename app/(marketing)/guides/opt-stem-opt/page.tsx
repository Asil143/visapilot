import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OPT_GUIDE } from "@/config/guides";
import { CheckCircle2, ArrowRight, ExternalLink, Bot, AlertCircle, Clock } from "lucide-react";

export const metadata = {
  title: "OPT & STEM OPT Guide",
  description: "Complete guide to OPT and STEM OPT work authorization for F-1 international students.",
};

export default function OPTGuidePage() {
  const guide = OPT_GUIDE;
  return (
    <div className="sc-guide-article min-h-screen bg-background">
      <div className="sc-guide-hero"><div className="sc-guide-breadcrumb"><Link href="/guides">The guide library</Link><span>/</span><span>FIELD GUIDE 02</span></div>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">

              <Badge className="bg-purple-100 text-purple-700 border-purple-200">OPT / STEM OPT</Badge>
            </div>
            <h1 className="text-4xl font-bold tracking-tight">{guide.title}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{guide.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />Processing: {guide.processing_times}</span>
              <span>·</span>
              <span>Fee: {guide.fees}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-4">Overview</h2>
              <p className="text-muted-foreground leading-7">{guide.overview}</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-blue-50 border border-blue-100 p-4 text-center">
                  <p className="text-2xl font-bold text-blue-700">12 months</p>
                  <p className="text-sm text-blue-600 mt-1">Standard OPT</p>
                </div>
                <div className="rounded-lg bg-purple-50 border border-purple-100 p-4 text-center">
                  <p className="text-2xl font-bold text-purple-700">+24 months</p>
                  <p className="text-sm text-purple-600 mt-1">STEM Extension</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Step-by-Step Guide</h2>
              <div className="space-y-6">
                {guide.steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white text-sm font-bold">{i + 1}</div>
                    <div className="flex-1 pb-6 border-b last:border-0">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="font-semibold text-lg">{step.title}</h3>
                        {step.estimated_time && <Badge variant="secondary" className="text-xs">{step.estimated_time}</Badge>}
                      </div>
                      <p className="mt-2 text-muted-foreground text-sm">{step.description}</p>
                      <ul className="mt-3 space-y-2">
                        {step.action_items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />{item}
                          </li>
                        ))}
                      </ul>
                      {step.uscis_link && (
                        <a href={step.uscis_link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                          Official USCIS resource <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Unemployment Day Limits</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                  <p className="font-semibold text-orange-900">Standard OPT</p>
                  <p className="text-3xl font-bold text-orange-700 mt-1">90 days</p>
                  <p className="text-sm text-orange-600 mt-1">Maximum total unemployment days</p>
                </div>
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="font-semibold text-red-900">STEM OPT Extension</p>
                  <p className="text-3xl font-bold text-red-700 mt-1">150 days</p>
                  <p className="text-sm text-red-600 mt-1">Combined total (incl. Standard OPT days)</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {guide.faq.map((item, i) => (
                  <Card key={i}><CardContent className="p-5">
                    <h3 className="font-semibold text-sm">{item.question}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-6">{item.answer}</p>
                  </CardContent></Card>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-5 space-y-3">
                <h3 className="font-semibold">Key Deadlines</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2 p-2 bg-red-50 rounded">
                    <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    <div><p className="font-medium text-red-800">Apply OPT by</p><p className="text-red-600">90 days before graduation</p></div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-orange-50 rounded">
                    <AlertCircle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                    <div><p className="font-medium text-orange-800">Apply STEM ext by</p><p className="text-orange-600">90 days before OPT expires</p></div>
                  </div>
                  <div className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                    <Clock className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                    <div><p className="font-medium text-blue-800">Report employment</p><p className="text-blue-600">Within 10 days of starting</p></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-5">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500 shrink-0" />
                  <p className="text-xs text-orange-800">General information only. Consult a licensed immigration attorney for your specific situation.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary text-white border-0">
              <CardContent className="p-5">
                <Bot className="h-6 w-6 mb-3" />
                <p className="font-semibold">OPT questions?</p>
                <p className="mt-1 text-sm text-primary-foreground/80">Ask our AI assistant for personalized guidance.</p>
                <Button variant="secondary" className="mt-4 w-full" asChild>
                  <Link href="/ai-assistant">Ask AI Assistant <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5 space-y-2">
                <p className="text-xs text-muted-foreground mb-2">More guides</p>
                <Link href="/guides/f1-visa" className="flex items-center justify-between text-sm hover:text-primary">F-1 Student Visa <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/guides/h1b-visa" className="flex items-center justify-between text-sm hover:text-primary">H-1B Work Visa <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/guides/green-card" className="flex items-center justify-between text-sm hover:text-primary">Green Card <ArrowRight className="h-4 w-4" /></Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
