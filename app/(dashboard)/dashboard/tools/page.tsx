import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timer, BarChart3, Search, FilePlus2, AlertTriangle, Clock, Wrench, ListChecks, ScrollText } from "lucide-react";

const TOOLS = [
  {
    icon: ListChecks,
    title: "Visa Checklists",
    description: "Step-by-step application guides for OPT, STEM OPT, H-1B, Green Card, J-1, L-1, O-1, TN, and more. Track progress as you complete each item.",
    href: "/dashboard/tools/checklists",
    color: "bg-indigo-50 text-indigo-600",
    badge: "New",
    phase: "Free",
  },
  {
    icon: Timer,
    title: "OPT Day Counter",
    description: "Track your OPT unemployment days in real time. Know exactly how many days you have left before hitting the 90 or 150-day limit.",
    href: "/dashboard/tools/opt-tracker",
    color: "bg-blue-50 text-blue-600",
    badge: null,
    phase: "Free",
  },
  {
    icon: BarChart3,
    title: "Visa Bulletin Tracker",
    description: "Monitor your EB-2/EB-3 priority date against the monthly Visa Bulletin. Get alerts when your date becomes current.",
    href: "/dashboard/tools/visa-bulletin",
    color: "bg-emerald-50 text-emerald-600",
    badge: null,
    phase: "Free",
  },
  {
    icon: Search,
    title: "USCIS Case Status",
    description: "Check your USCIS receipt number status instantly. Track I-765, I-485, I-140, and more in one place.",
    href: "/dashboard/tools/case-status",
    color: "bg-purple-50 text-purple-600",
    badge: null,
    phase: "Free",
  },
  {
    icon: Clock,
    title: "Processing Times",
    description: "Snapshot of published USCIS ranges by form and service center. Always verify on USCIS.gov before you file.",
    href: "/dashboard/tools/processing-times",
    color: "bg-orange-50 text-orange-600",
    badge: null,
    phase: "Free",
  },
  {
    icon: FilePlus2,
    title: "Document Generator",
    description: "Cover letters and petition drafts are not available yet. Opens a coming-soon page with worksheets and the RFE assistant as alternatives.",
    href: "/dashboard/documents/generate",
    color: "bg-pink-50 text-pink-600",
    badge: "Soon",
    phase: "Soon",
  },
  {
    icon: AlertTriangle,
    title: "RFE Assistant",
    description: "Paste your RFE notice. AI breaks down each issue, builds an evidence checklist, and drafts a response for attorney review. Pack — $39.",
    href: "/rfe-assistant",
    color: "bg-red-50 text-red-600",
    badge: "Pack",
    phase: "Pack",
  },
  {
    icon: ScrollText,
    title: "Form worksheets",
    description: "Guided interviews for I-864, I-765, I-485, N-400 and more. You get a data sheet to copy onto the official USCIS PDF.",
    href: "/dashboard/tools/forms",
    color: "bg-teal-50 text-teal-600",
    badge: "New",
    phase: "Free",
  },
];

export default function ToolsPage() {
  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Wrench className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Immigration Tools</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Checklists, trackers, worksheets, and calculators for every stage of your immigration journey</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.href} href={tool.href}>
              <Card className="h-full cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`rounded-xl p-3 ${tool.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    {tool.badge ? (
                      <Badge variant="secondary" className="text-xs">{tool.badge}</Badge>
                    ) : (
                      <Badge variant="success" className="text-xs">Free</Badge>
                    )}
                  </div>
                  <h3 className="font-bold text-base group-hover:text-primary transition-colors">{tool.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-5">{tool.description}</p>
                  <div className="mt-4 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Open tool →
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 rounded-2xl bg-gradient-to-r from-primary to-blue-700 p-6 text-white">
        <h2 className="text-lg font-bold">More tools coming soon</h2>
        <p className="mt-1 text-sm text-white/80">Document generator, attorney AMAs, and more live data tools are on the roadmap — we will ship them when they are real.</p>
      </div>
    </div>
  );
}
