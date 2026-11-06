"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilePlus2, FileText, AlertTriangle, ArrowRight, Sparkles } from "lucide-react";

const ALTERNATIVES = [
  {
    href: "/dashboard/tools/forms",
    icon: FileText,
    title: "Form worksheets",
    description: "Guided interviews that produce a data sheet you copy onto the official USCIS PDF.",
  },
  {
    href: "/rfe-assistant",
    icon: AlertTriangle,
    title: "RFE Response Assistant",
    description: "Paste an RFE notice for an issue breakdown, evidence checklist, and draft PDF. Pack — $39.",
  },
  {
    href: "/dashboard/documents",
    icon: Sparkles,
    title: "Document vault",
    description: "Upload passports, I-20s, EADs, and receipts so your profile and worksheets can prefill.",
  },
];

export default function DocumentGeneratePage() {
  return (
    <div className="p-4 md:p-8 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <FilePlus2 className="h-6 w-6 text-slate-500" />
          <h1 className="text-2xl font-bold">Document Generator</h1>
          <Badge variant="secondary" className="text-xs">Coming soon</Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Cover letters, I-983 training-plan drafts, and petition letters are not available yet.
          We will not show a mock generator that looks finished.
        </p>
      </div>

      <Card className="mb-8 border-amber-200 bg-amber-50/60">
        <CardContent className="p-6">
          <p className="font-semibold text-amber-900 mb-1">What this will be</p>
          <p className="text-sm text-amber-800 leading-relaxed">
            AI-drafted cover letters and support letters based on your profile, clearly labeled as drafts
            that need attorney review. Until then, use the worksheets and RFE assistant below.
          </p>
        </CardContent>
      </Card>

      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Use these instead
      </h2>
      <div className="space-y-3">
        {ALTERNATIVES.map(({ href, icon: Icon, title, description }) => (
          <Link key={href} href={href} className="block group">
            <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm group-hover:text-blue-600 transition-colors">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 shrink-0 mt-1" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Button asChild variant="outline">
          <Link href="/dashboard/documents">Back to documents</Link>
        </Button>
      </div>
    </div>
  );
}
