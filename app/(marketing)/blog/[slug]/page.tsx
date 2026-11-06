import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichText } from "@/components/ui/rich-text";
import { ArrowLeft, Clock, Calendar, Share2, Bookmark, Bot, ArrowRight } from "lucide-react";

const ARTICLES: Record<string, {
  title: string; category: string; badge: string; date: string; readTime: string;
  author: string; body: string; relatedSlugs: string[];
}> = {
  "h1b-2026-lottery-results": {
    title: "H-1B FY2026 Lottery Results (Historical Snapshot)",
    category: "H-1B",
    badge: "Archive",
    date: "May 27, 2026",
    readTime: "4 min read",
    author: "StatusClock Editorial",
    relatedSlugs: ["rfe-rates-specialty-occupation-2026", "uscis-processing-times-may-2026"],
    body: `This is a historical FY2026 snapshot. For current registration dates, selection data, and beneficiary-centric rules, use the live H-1B tracker and official USCIS notices.

USCIS completed the H-1B random selection process for fiscal year 2026 (FY2026), selecting approximately 85,000 registrations to meet the statutory cap — 65,000 under the regular cap and 20,000 under the advanced degree exemption.

**Selection Statistics**

USCIS received approximately 470,000 unique registrations this year, continuing the high-volume trend from recent years. The overall selection rate was approximately 18% for the regular cap and 14% for the advanced degree exemption.

Lottery participants were notified through their myUSCIS accounts beginning May 25, 2026.

**What Happens Next**

Selected registrants must file a complete H-1B cap-subject petition between April 1 and June 30, 2026. Petitions must be filed at the service center designated during the registration process (California SC or Vermont SC).

Required documents include:
- Form I-129 with H classification supplement
- Labor Condition Application (LCA) certified by the Department of Labor
- Evidence of specialty occupation and beneficiary's qualifying degree
- Employer support letter
- Filing fees (I-129 base fee $730 + ACWIA fee + Fraud Prevention fee $500)

**Premium Processing**

Premium processing (Form I-907, $2,805 fee) guarantees a 15 business-day response. USCIS has confirmed premium processing is available for FY2026 H-1B petitions.

**For Those Not Selected**

Registrations not selected remain in a "reserve" pool. USCIS may conduct additional selections from this pool if the agency determines it needs more petitions to meet the cap. Historically, reserve selections have occurred between August and October.

Employers who did not get selected should consider alternatives such as:
- H-1B1 (for Chilean and Singaporean nationals)
- TN visa (for Canadian and Mexican nationals)
- O-1A visa (for individuals with extraordinary ability)
- E-3 (for Australian nationals)
- Cap-exempt H-1B employment (through qualifying nonprofits, universities, or government research organizations)`,
  },
  "uscis-processing-times-may-2026": {
    title: "USCIS I-765 Processing Times — May 2026 Snapshot",
    category: "Processing Times",
    badge: "Archive",
    date: "May 22, 2026",
    readTime: "3 min read",
    author: "StatusClock Editorial",
    relatedSlugs: ["h1b-2026-lottery-results", "stem-opt-extension-new-rules"],
    body: `This is a May 2026 historical snapshot. USCIS processing estimates change; use the live USCIS processing-time tool for a current estimate.

USCIS updated its published processing times for May 2026, with the most significant change being a reduction in I-765 (Employment Authorization Document) processing times at the Potomac Service Center.

**Key Changes**

Initial OPT applications (I-765 under category (c)(3)(A)) filed at Potomac SC are now showing approval in 3–5 months, down from 5–8 months earlier this year. This follows a USCIS initiative to reduce the EAD backlog that accumulated during 2023–2024.

STEM OPT extensions (category (c)(3)(C)) are processing in 2–3 months, a notable improvement that should provide relief for F-1 students transitioning from OPT to STEM OPT.

**How to Check Your Processing Time**

USCIS publishes processing times at uscis.gov/tools/processing-times. Applicants can check their specific form type, service center, and visa classification. The StatusClock Processing Times tool also aggregates this data with trend indicators.

**What to Do If You're Outside the Range**

If your application has been pending longer than the published processing time, you may submit an e-request (case inquiry) through the USCIS website. USCIS will typically respond within 30 days. If no response, applicants may contact the USCIS Contact Center at 1-800-375-5283.`,
  },
  "eb2-india-priority-date-movement": {
    title: "EB-2 India Priority Dates — June 2026 Snapshot",
    category: "Green Card",
    badge: "Visa Bulletin",
    date: "May 15, 2026",
    readTime: "4 min read",
    author: "StatusClock Editorial",
    relatedSlugs: ["naturalization-record-numbers-2026", "h1b-2026-lottery-results"],
    body: `The June 2026 Visa Bulletin shows one of the largest single-month advances for EB-2 India in recent years, moving the Final Action Date forward by approximately 8 months to January 1, 2014.

**What This Means**

Applicants born in India with an EB-2 priority date on or before January 1, 2014 may now be able to file Form I-485 (Adjustment of Status) or proceed with consular processing, depending on their situation.

The Dates for Filing chart, which USCIS has confirmed will be used for I-485 purposes this month, shows an even more favorable cutoff of June 1, 2015 for EB-2 India.

**Why Dates Moved**

State Department attributed the forward movement to lower-than-expected demand in the EB-2 India category during the first half of FY2026, combined with visa numbers freed up from other employment-based categories. Demand tends to fluctuate month to month, so applicants should not assume this rate of movement will continue.

**EB-3 India Update**

EB-3 India advanced more modestly, moving approximately 2 months to November 1, 2012. EB-3 India often lags EB-2 India due to higher overall petition volume.

**What Applicants Should Do**

If your priority date is now current:
- Contact your employer's immigration attorney immediately
- Gather supporting documents (birth certificate, passport, medical exam results)
- Prepare Form I-485, I-131 (Advance Parole), and I-765 (EAD) concurrently
- Budget for the current I-485 filing fee ($1,440); there is no separate biometric fee under the current USCIS fee schedule

**Retrogression Risk**

Priority dates can and do retrogress. If you become eligible to file, do so promptly rather than waiting. Once an I-485 is filed, you generally maintain your place in line even if dates retrogress.`,
  },
  "stem-opt-extension-new-rules": {
    title: "STEM OPT 2025: What Changed and How to Avoid Common Denials",
    category: "OPT / STEM OPT",
    badge: "Guide",
    date: "May 10, 2026",
    readTime: "5 min read",
    author: "StatusClock Editorial",
    relatedSlugs: ["uscis-processing-times-may-2026", "rfe-rates-specialty-occupation-2026"],
    body: `The STEM OPT extension allows F-1 students who graduated with a STEM degree to extend their post-completion OPT by 24 months, for a total of 36 months of work authorization. This guide covers the current requirements and the most common reasons for denial.

**Core Eligibility Requirements**

To qualify for STEM OPT extension, you must:
- Have completed a bachelor's, master's, or doctoral degree in a DHS-designated STEM field
- Be currently in a valid OPT period (cannot apply after OPT expires)
- Have a job offer from an employer that is enrolled in E-Verify
- Have your employer sign a Training Plan (Form I-983)
- File Form I-765 with your DSO-endorsed I-20 showing the STEM extension

**The 60-Day Filing Window**

You must file your STEM OPT application within 60 days of your DSO issuing your new I-20 with the STEM extension recommendation. Because USCIS processing takes 2–3 months, your DSO should issue the I-20 at least 90 days before your OPT expires to give you enough time.

If USCIS doesn't process your application before your OPT EAD expires, your employment authorization is automatically extended by 180 days (cap-gap rule for STEM OPT).

**Top Reasons for Denial**

- **Employer not E-Verify enrolled**: USCIS verifies this. If your employer deactivated or never joined E-Verify, your application will be denied.
- **Training Plan (I-983) incomplete**: Every section must be filled out, including the specific learning objectives and how the employer will evaluate progress.
- **STEM degree not on DHS list**: Verify your CIP code at the DHS STEM Designated Degree Program List before filing.
- **Filed too late**: USCIS requires the I-765 to be filed while your current OPT is still valid. Filing even one day after expiration is grounds for denial.
- **Mismatch between I-20 and employment**: The employer on your I-983 and your actual employer must match.

**Reporting Requirements**

STEM OPT students must complete validation reports every 6 months, and Form I-983 evaluations at 12 and 24 months. Missing these reports can jeopardize future immigration applications. StatusClock's dashboard tracks all STEM OPT reporting deadlines automatically.`,
  },
  "rfe-rates-specialty-occupation-2026": {
    title: "H-1B RFE Rates Hit 30% in 2026 — What USCIS Is Targeting",
    category: "H-1B",
    badge: "Analysis",
    date: "April 28, 2026",
    readTime: "4 min read",
    author: "StatusClock Editorial",
    relatedSlugs: ["h1b-2026-lottery-results", "stem-opt-extension-new-rules"],
    body: `Request for Evidence (RFE) rates for H-1B petitions have climbed to approximately 30% in early FY2026, according to USCIS data obtained through FOIA requests. The vast majority target the "specialty occupation" standard.

**What Is a Specialty Occupation RFE?**

USCIS issues specialty occupation RFEs when the agency is not satisfied that the proffered position normally requires — at minimum — a bachelor's degree in a specific specialty. Under 8 CFR 214.2(h)(4), the petitioner must establish this requirement by showing:

- A baccalaureate or higher degree in the specific specialty is the normal minimum entry requirement for the position, OR
- The degree requirement is common to the industry in parallel positions among similar organizations, OR
- The employer normally requires a degree or its equivalent for the position, OR
- The duties are so specialized and complex that the knowledge required to perform them is usually associated with attainment of a baccalaureate degree

**Fields with Highest RFE Rates**

Based on reported data:
- Software Quality Assurance / Testing: ~42% RFE rate
- Business Analyst / IT Project Manager: ~38%
- Marketing / Market Research Analyst: ~35%
- Management Consultant: ~32%
- Software Engineer / Developer: ~18%

**How to Respond**

An effective specialty occupation RFE response should include:
- Detailed breakdown of actual day-to-day duties with percentage of time estimates
- Industry wage surveys (OES, OFLC) showing degree requirements for similar roles
- Expert opinion letters from industry professionals
- Company organizational charts showing degree requirements for comparable positions
- Evidence that the beneficiary's degree directly relates to the job duties

If you received an RFE, the StatusClock RFE Assistant can help you build a response framework quickly. You should also consult an immigration attorney for RFEs on complex cases.`,
  },
  "naturalization-record-numbers-2026": {
    title: "Naturalization Applications Hit Record High in FY2025",
    category: "Citizenship",
    badge: "Data",
    date: "April 18, 2026",
    readTime: "3 min read",
    author: "StatusClock Editorial",
    relatedSlugs: ["eb2-india-priority-date-movement", "h1b-2026-lottery-results"],
    body: `USCIS processed a record 1.05 million naturalization applications in fiscal year 2025, the highest number in the agency's history. Approximately 878,000 individuals were naturalized as U.S. citizens during the same period.

**Who Applied**

The top countries of origin for naturalization applicants in FY2025 were:
- Mexico: ~152,000
- India: ~74,000
- Philippines: ~55,000
- Cuba: ~47,000
- Dominican Republic: ~38,000
- China: ~36,000
- Vietnam: ~30,000

India's position reflects the large population of long-term employment-based green card holders now reaching the 5-year LPR milestone required for naturalization.

**Processing Times**

USCIS has reduced N-400 processing times to a national average of 8–14 months following additional staffing and process improvements. Some field offices, particularly in smaller cities, are processing in as few as 5–6 months.

**Eligibility Reminder**

To apply for naturalization, you must generally:
- Have been a lawful permanent resident (LPR) for at least 5 years (3 years if married to a U.S. citizen)
- Have been physically present in the U.S. for at least half of the required period
- Have maintained continuous residence (no single trips abroad longer than 6 months)
- Be a person of good moral character
- Pass the English language test and civics test

The N-400 filing fee is $760 (plus $85 biometrics for applicants aged 14–78). USCIS offers fee waivers for qualifying low-income applicants.`,
  },
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) notFound();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/blog" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Explainers
        </Link>

        {/* Article header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="destructive" className="text-xs">{article.badge}</Badge>
            <Badge variant="outline" className="text-xs">{article.category}</Badge>
          </div>
          <h1 className="text-3xl font-bold leading-snug mb-4">{article.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {article.date}</span>
            <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {article.readTime}</span>
            <span>By {article.author}</span>
          </div>
        </div>

        <div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 leading-relaxed">
          This is an explainer, not live news. Figures may be outdated. Confirm current dates on{" "}
          <Link href="/visa-bulletin" className="font-semibold underline">Visa Bulletin</Link>
          {" "}and{" "}
          <a href="https://www.uscis.gov" target="_blank" rel="noopener noreferrer" className="font-semibold underline">USCIS.gov</a>.
        </div>

        {/* Article body */}
        <RichText
          text={article.body}
          className="prose prose-sm max-w-none mb-8 space-y-4"
          paragraphClassName="text-muted-foreground leading-7"
          headingClassName="text-xl font-bold mt-8 mb-3 text-foreground"
          listClassName="list-disc list-inside space-y-1.5 text-muted-foreground text-sm my-3"
        />

        {/* Actions */}
        <div className="flex gap-3 mb-10">
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
          <Button variant="outline" size="sm">
            <Bookmark className="mr-2 h-4 w-4" /> Save
          </Button>
        </div>

        {/* AI CTA */}
        <Card className="mb-10 border-primary/20 bg-primary/5">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="rounded-xl bg-primary text-white p-3 shrink-0">
              <Bot className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">Have questions about this update?</p>
              <p className="text-xs text-muted-foreground mt-1 leading-4">Ask the StatusClock AI Assistant — it&apos;s trained on USCIS policies, processing times, and immigration law.</p>
            </div>
            <Link href="/ai-assistant">
              <Button size="sm">Ask AI <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-xs text-yellow-800">
          <strong>Disclaimer:</strong> This article is for informational purposes only and does not constitute legal advice. Immigration law changes frequently — consult a licensed immigration attorney for advice specific to your situation.
        </div>
      </div>
    </div>
  );
}
