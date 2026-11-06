"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageSquareText, ExternalLink, Download } from "lucide-react";

interface FormCard {
  number: string;
  title: string;
  description: string;
  who: string;
  href?: string;
  uscisUrl: string;
  status: "available" | "coming-soon";
}

const FORMS: FormCard[] = [
  {
    number: "I-864",
    title: "Affidavit of Support",
    description: "Required when a U.S. citizen or LPR sponsors a family member for a green card. Proves the sponsor can financially support the immigrant.",
    who: "Petitioning sponsors, joint sponsors",
    href: "/dashboard/tools/forms/i-864",
    uscisUrl: "https://www.uscis.gov/i-864",
    status: "available",
  },
  {
    number: "I-765",
    title: "Application for Employment Authorization",
    description: "Apply for or renew an Employment Authorization Document (EAD / work permit) for OPT, STEM OPT, H-4, asylum, and other categories.",
    who: "OPT / STEM OPT students, H-4 spouses, asylum seekers",
    href: "/dashboard/tools/forms/i-765",
    uscisUrl: "https://www.uscis.gov/i-765",
    status: "available",
  },
  {
    number: "I-485",
    title: "Application to Register Permanent Residence",
    description: "Adjust status to lawful permanent resident (green card) from inside the United States.",
    who: "Family-based, employment-based, asylum/refugee applicants",
    href: "/dashboard/tools/forms/i-485",
    uscisUrl: "https://www.uscis.gov/i-485",
    status: "available",
  },
  {
    number: "I-130",
    title: "Petition for Alien Relatives",
    description: "U.S. citizens and LPRs file this to establish a qualifying relationship with a foreign national family member.",
    who: "U.S. citizens and LPRs petitioning for family",
    href: "/dashboard/tools/forms/i-130",
    uscisUrl: "https://www.uscis.gov/i-130",
    status: "available",
  },
  {
    number: "I-131",
    title: "Application for Travel Document",
    description: "Apply for Advance Parole, Refugee Travel Document, or Re-entry Permit to travel outside the U.S. while your immigration case is pending.",
    who: "Green card applicants, refugees, asylees",
    href: "/dashboard/tools/forms/i-131",
    uscisUrl: "https://www.uscis.gov/i-131",
    status: "available",
  },
  {
    number: "I-539",
    title: "Application to Extend/Change Nonimmigrant Status",
    description: "Extend your current visa status or change to a different nonimmigrant category without leaving the U.S.",
    who: "F-1, B-1/B-2, H-4, L-2, and other nonimmigrant visa holders",
    href: "/dashboard/tools/forms/i-539",
    uscisUrl: "https://www.uscis.gov/i-539",
    status: "available",
  },
  {
    number: "I-140",
    title: "Immigrant Petition for Alien Workers",
    description: "Employer files this to sponsor a foreign worker for a permanent employment-based green card (EB-1, EB-2, EB-3).",
    who: "Employers sponsoring foreign workers",
    href: "/dashboard/tools/forms/i-140",
    uscisUrl: "https://www.uscis.gov/i-140",
    status: "available",
  },
  {
    number: "I-90",
    title: "Application to Replace Permanent Resident Card",
    description: "Renew or replace a green card that is expired, lost, stolen, or incorrect.",
    who: "Current lawful permanent residents",
    href: "/dashboard/tools/forms/i-90",
    uscisUrl: "https://www.uscis.gov/i-90",
    status: "available",
  },
  {
    number: "N-400",
    title: "Application for Naturalization",
    description: "Apply to become a U.S. citizen. Requires 3–5 years as a permanent resident, English proficiency, and passing a civics test.",
    who: "LPRs eligible for U.S. citizenship",
    href: "/dashboard/tools/forms/n-400",
    uscisUrl: "https://www.uscis.gov/n-400",
    status: "available",
  },
  {
    number: "I-864A",
    title: "Contract Between Sponsor and Household Member",
    description: "Household members who are combining income with the primary sponsor on Form I-864 must complete this contract.",
    who: "Household members of the primary I-864 sponsor",
    href: "/dashboard/tools/forms/i-864a",
    uscisUrl: "https://www.uscis.gov/i-864a",
    status: "available",
  },
];

function blankPdfUrl(formNumber: string): string {
  return `https://www.uscis.gov/sites/default/files/document/forms/${formNumber.toLowerCase()}.pdf`;
}

export default function FormsPage() {
  const router = useRouter();
  const available = FORMS.filter(f => f.status === "available");
  const coming = FORMS.filter(f => f.status === "coming-soon");

  return (
    <div className="p-4 md:p-8 max-w-6xl">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
          <FileText className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">USCIS Form Worksheets</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Guided interviews that produce a data sheet you copy onto the official USCIS PDF
          </p>
        </div>
      </div>

      {/* How it works */}
      <div className="mb-8 rounded-xl border bg-blue-50/60 border-blue-100 p-5">
        <p className="text-sm font-semibold text-blue-800 mb-1">How it works</p>
        <p className="text-sm text-blue-700 leading-relaxed">
          Select a form below. We walk you through every question in plain English, one step at a time.
          You get a data sheet organized by Part and Item number — then you copy those answers onto the
          official USCIS PDF. StatusClock does not file with USCIS or generate a completed official form.
        </p>
      </div>

      {/* Available now */}
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Available Now</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-10">
        {available.map(form => (
          <Card
            key={form.number}
            onClick={() => router.push(form.href!)}
            className="h-full cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all group border-blue-100"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-blue-600 text-white px-2 py-0.5 text-xs font-bold">{form.number}</div>
                  <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px]">Available</Badge>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <MessageSquareText className="h-4 w-4 text-blue-400" />
                  <a
                    href={blankPdfUrl(form.number)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-400 hover:text-blue-600 transition-colors"
                    title={`Download blank Form ${form.number} PDF`}
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              </div>
              <h3 className="font-bold text-sm mb-1 group-hover:text-blue-600 transition-colors">{form.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{form.description}</p>
              <p className="text-[10px] text-slate-400 font-medium">Who files: {form.who}</p>
              <div className="mt-3 text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Start worksheet →
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coming soon */}
      {coming.length > 0 && (
        <>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Coming Soon</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {coming.map(form => (
              <Card key={form.number} className="h-full opacity-70">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="rounded-lg bg-slate-400 text-white px-2 py-0.5 text-xs font-bold">{form.number}</div>
                      <Badge variant="secondary" className="text-[10px]">Coming Soon</Badge>
                    </div>
                    <a
                      href={form.uscisUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-blue-500 transition-colors"
                      title="View on USCIS.gov"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                  <h3 className="font-bold text-sm mb-1">{form.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{form.description}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Who files: {form.who}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
