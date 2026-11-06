"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { formatDateLong } from "@/lib/utils/date";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  AlertTriangle, Sparkles, CheckCircle2, Circle, ChevronDown,
  FileText, Copy, Download, Info, Clock, AlertCircle, Mail,
  Phone, MessageSquare, ArrowRight, Building2, User,
} from "lucide-react";

// ─── Service center lookup from receipt number prefix ─────────────────────────
const SERVICE_CENTERS: Record<string, { name: string; address: string }> = {
  WAC: { name: "USCIS California Service Center", address: "P.O. Box 30111, Laguna Niguel, CA 92607-0111" },
  EAC: { name: "USCIS Vermont Service Center",    address: "75 Lower Welden Street, St. Albans, VT 05479" },
  LIN: { name: "USCIS Nebraska Service Center",   address: "P.O. Box 82521, Lincoln, NE 68501-2521" },
  SRC: { name: "USCIS Texas Service Center",      address: "P.O. Box 851488, Mesquite, TX 75185-1488" },
  MSC: { name: "USCIS National Benefits Center",  address: "P.O. Box 648003, Lee's Summit, MO 64064" },
  IOE: { name: "USCIS (Online Filing)",           address: "myuscis.gov — online response" },
};

function getServiceCenter(receipt: string) {
  const prefix = receipt?.slice(0, 3).toUpperCase();
  return SERVICE_CENTERS[prefix] ?? { name: "USCIS Service Center", address: "[Service Center Address]" };
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface RFEIssue {
  title: string;
  description: string;
  checklist: string[];
  sampleResponse: string;
  resolved: boolean;
}

interface RFEAnalysis {
  issueCount: number;
  deadline: string;
  visaType: string;
  issues: RFEIssue[];
}

interface Profile {
  full_name?: string;
  employer?: string;
  visa_type?: string;
}

const SAMPLE_RFE = `USCIS — California Service Center
Form I-129, Petition for H-1B Nonimmigrant Worker
Receipt: WAC2512345678

REQUEST FOR EVIDENCE

Issue 1: Specialty Occupation
The evidence submitted does not sufficiently establish that the proffered position qualifies as a specialty occupation under 8 C.F.R. §214.2(h)(4)(ii). The position of "Software Engineer" as described does not demonstrate that a bachelor's degree in a specific specialty is normally required for the position.

Issue 2: Employer-Employee Relationship
The documentation submitted does not sufficiently demonstrate that the petitioner will maintain a valid employer-employee relationship with the beneficiary throughout the period of the requested H-1B status.

You must respond to this notice within 87 days from the date of this notice.`;

// ─── PDF generation (client-side, no server needed) ──────────────────────────
async function generatePDF(
  analysis: RFEAnalysis,
  receiptNumber: string,
  profile: Profile | null,
  coverLetter: string
) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
  const sc = getServiceCenter(receiptNumber);
  const margin = 20;
  const pageWidth = 215.9;
  const usable = pageWidth - margin * 2;
  let y = margin;
  let pageNum = 1;

  const addFooter = () => {
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor("#94a3b8");
    doc.text(`StatusClock · RFE Response Package · Page ${pageNum}`, margin, 278);
    doc.text("DRAFT — REQUIRES ATTORNEY REVIEW BEFORE SUBMISSION", pageWidth - margin, 278, { align: "right" });
    pageNum++;
  };

  const newPage = () => { addFooter(); doc.addPage(); y = margin; };

  const addText = (text: string, fontSize: number, bold = false, color = "#000000") => {
    doc.setFontSize(fontSize);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(color);
    const lines = doc.splitTextToSize(text, usable);
    lines.forEach((line: string) => {
      if (y > 260) { newPage(); }
      doc.text(line, margin, y);
      y += fontSize * 0.45;
    });
  };

  const addSpace = (mm = 4) => { y += mm; };
  const addLine = () => {
    doc.setDrawColor("#e2e8f0");
    doc.line(margin, y, margin + usable, y);
    y += 5;
  };

  // ── Cover Page ──
  addText("RFE RESPONSE PACKAGE", 18, true, "#1e3a8a");
  addSpace(2);
  addText(`${analysis.visaType} — Request for Evidence`, 12, false, "#475569");
  addSpace(6);
  addLine();

  addText("Addressed To:", 9, true, "#64748b");
  addSpace(1);
  addText(sc.name, 10, true);
  addText(sc.address, 10);
  addSpace(4);

  if (receiptNumber) { addText(`Receipt Number: ${receiptNumber}`, 10, true); addSpace(1); }
  if (profile?.employer) { addText(`Petitioner (Employer): ${profile.employer}`, 10); addSpace(1); }
  if (profile?.full_name) { addText(`Beneficiary: ${profile.full_name}`, 10); addSpace(1); }
  addText(`Response Deadline: ${analysis.deadline}`, 10, true, "#dc2626");
  addText(`Issues Identified: ${analysis.issueCount}`, 10);
  addSpace(4);
  addLine();

  // ── Cover Letter ──
  newPage();
  addText("COVER LETTER", 14, true, "#1e3a8a");
  addSpace(4);
  const clLines = coverLetter.split("\n");
  clLines.forEach(line => {
    addText(line || " ", 10);
    if (!line) addSpace(1);
  });

  // ── Response sections per issue ──
  analysis.issues.forEach((issue, idx) => {
    newPage();

    addText(`ISSUE ${idx + 1}: ${issue.title.replace(/^Issue \d+:\s*/i, "").toUpperCase()}`, 13, true, "#1e3a8a");
    addSpace(2);
    addText("USCIS Concern:", 9, true, "#64748b");
    addText(issue.description, 10);
    addSpace(4);

    addText("EVIDENCE CHECKLIST", 10, true, "#059669");
    addSpace(2);
    issue.checklist.forEach((item, i) => {
      addText(`${i + 1}. ${item}`, 10);
      addSpace(1);
    });
    addSpace(4);

    addText("DRAFT RESPONSE", 10, true, "#7c3aed");
    addSpace(2);
    addText(issue.sampleResponse, 10);
    addSpace(6);
    addLine();
    addText("[ Attach supporting documents listed above after this section ]", 9, false, "#94a3b8");
  });

  // ── Disclaimer ──
  newPage();
  addText("IMPORTANT DISCLAIMER", 12, true, "#dc2626");
  addSpace(3);
  addText(
    "This package was prepared with AI assistance and is intended as a starting framework only. " +
    "All response content, evidence selection, and legal arguments must be reviewed, verified, and " +
    "finalized by a licensed U.S. immigration attorney before submission to USCIS. " +
    "RFE responses have strict deadlines — typically 87 days from the notice date. " +
    "Late or incomplete responses may result in denial.",
    10
  );
  addSpace(6);
  addText("Generated by StatusClock · statusclock.com", 9, false, "#94a3b8");

  addFooter();
  doc.save(`RFE-Response-Package-${receiptNumber || "StatusClock"}.pdf`);
}

// ─── Cover letter builder ─────────────────────────────────────────────────────
function buildCoverLetter(analysis: RFEAnalysis, receiptNumber: string, profile: Profile | null): string {
  const sc = getServiceCenter(receiptNumber);
  const today = formatDateLong(new Date());
  const beneficiary = profile?.full_name || "[Beneficiary Name]";
  const employer = profile?.employer || "[Employer / Petitioner Name]";

  return `${today}

${sc.name}
${sc.address}

Re: Response to Request for Evidence
Receipt Number: ${receiptNumber || "[Receipt Number]"}
Petition Type: ${analysis.visaType}
Petitioner: ${employer}
Beneficiary: ${beneficiary}
Response Deadline: ${analysis.deadline}

Dear USCIS Officer:

We write on behalf of ${employer} ("Petitioner") in response to the Request for Evidence ("RFE") issued in connection with the above-referenced ${analysis.visaType} petition for ${beneficiary} ("Beneficiary").

The Petitioner respectfully submits the following evidence to address each issue raised in the RFE. We are confident that the enclosed documentation fully satisfies the evidentiary requirements set forth by USCIS.

This response addresses ${analysis.issueCount} issue${analysis.issueCount !== 1 ? "s" : ""} identified in the RFE:

${analysis.issues.map((iss, i) => `  ${i + 1}. ${iss.title}`).join("\n")}

The evidence submitted herewith demonstrates that the Petitioner and Beneficiary fully satisfy all applicable statutory and regulatory requirements. Should you require any additional information, please do not hesitate to contact the undersigned.

Respectfully submitted,

_______________________________
[Attorney Name], Esq.
[Law Firm Name]
[Address]
[Phone] | [Email]
[Attorney Bar Number]

Enclosures: As listed per issue response sections`;
}

// ─── Deadline parser ─────────────────────────────────────────────────────────
function parseDeadlineDate(deadlineStr: string): string | null {
  const daysMatch = deadlineStr.match(/(\d+)\s*days?/i);
  if (daysMatch) {
    const d = new Date();
    d.setDate(d.getDate() + parseInt(daysMatch[1]));
    return d.toISOString().split("T")[0];
  }
  const monthsMatch = deadlineStr.match(/(\d+)\s*months?/i);
  if (monthsMatch) {
    const d = new Date();
    d.setMonth(d.getMonth() + parseInt(monthsMatch[1]));
    return d.toISOString().split("T")[0];
  }
  return null;
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RFEAssistantPage() {
  const { isSignedIn, user } = useUser();
  const [step, setStep] = useState<"paste" | "analyze" | "response">("paste");
  const [rfeText, setRfeText] = useState("");
  const [receiptNumber, setReceiptNumber] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<RFEAnalysis | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [expanded, setExpanded] = useState<number | null>(0);
  const [copied, setCopied] = useState<number | null>(null);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState({ name: user?.fullName ?? "", email: user?.emailAddresses?.[0]?.emailAddress ?? "", description: "", phone: "" });
  const [ticketSent, setTicketSent] = useState(false);
  const [deadlineAdded, setDeadlineAdded] = useState(false);

  async function handleAnalyze() {
    if (!isSignedIn) {
      setError("Sign in to analyze an RFE. The analyzer is included in the RFE Response Pack ($39) or All-Access.");
      return;
    }
    setAnalyzing(true);
    setError(null);
    try {
      // Fetch profile for personalization
      const [rfeRes, profRes] = await Promise.all([
        fetch("/api/rfe-analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rfeText }),
        }),
        fetch("/api/profile"),
      ]);
      const data = await rfeRes.json().catch(() => ({}));
      if (rfeRes.status === 401) {
        throw new Error("Sign in to analyze an RFE.");
      }
      if (rfeRes.status === 403) {
        throw new Error("The RFE analyzer is included in the RFE Response Pack ($39) or All-Access.");
      }
      if (!rfeRes.ok) throw new Error(data.error || "Analysis failed");
      if (profRes.ok) {
        const prof = await profRes.json();
        if (prof) setProfile({ full_name: prof.full_name, employer: prof.employer, visa_type: prof.visa_type });
      }
      // Extract receipt number from text if not manually entered
      let finalReceipt = receiptNumber;
      if (!receiptNumber) {
        const match = rfeText.match(/\b([A-Z]{3}\d{10,13})\b/);
        if (match) { finalReceipt = match[1]; setReceiptNumber(match[1]); }
      }
      setAnalysis({ ...data, issues: data.issues.map((i: Omit<RFEIssue, "resolved">) => ({ ...i, resolved: false })) });
      setStep("analyze");

      // Auto-add deadline to timeline for signed-in users
      if (user && data.deadline) {
        const dueDate = parseDeadlineDate(data.deadline);
        if (dueDate) {
          fetch("/api/deadlines", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: `RFE Deadline — ${data.visaType || "Visa Case"}`,
              description: finalReceipt ? `Receipt: ${finalReceipt}` : "Added from RFE Assistant",
              due_date: dueDate,
              priority: "critical",
            }),
          }).then(r => { if (r.ok) setDeadlineAdded(true); }).catch(() => {});
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  }

  function toggleResolved(idx: number) {
    if (!analysis) return;
    setAnalysis({ ...analysis, issues: analysis.issues.map((iss, i) => i === idx ? { ...iss, resolved: !iss.resolved } : iss) });
  }

  function handleCopy(idx: number) {
    if (!analysis) return;
    navigator.clipboard.writeText(analysis.issues[idx].sampleResponse);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  }

  async function handleExportPDF() {
    if (!analysis) return;
    setExporting(true);
    try {
      const coverLetter = buildCoverLetter(analysis, receiptNumber, profile);
      await generatePDF(analysis, receiptNumber, profile, coverLetter);
    } finally {
      setExporting(false);
    }
  }

  async function handleTicketSubmit() {
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: ticketForm.name,
        email: ticketForm.email,
        subject: "Complex RFE Case — Expert Help Request",
        message: `Phone: ${ticketForm.phone}\n\nCase description:\n${ticketForm.description}\n\nReceipt: ${receiptNumber || "Not provided"}`,
      }),
    });
    setTicketSent(true);
  }

  const resolvedCount = analysis?.issues.filter(i => i.resolved).length ?? 0;
  const coverLetter = analysis ? buildCoverLetter(analysis, receiptNumber, profile) : "";

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <AlertTriangle className="h-6 w-6 text-orange-500" />
          <h1 className="text-2xl font-bold">RFE Response Assistant</h1>
          <Badge variant="warning" className="text-xs">Pack · $39</Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Paste your USCIS Request for Evidence — AI breaks it down, builds an evidence checklist, drafts response frameworks, and exports a draft PDF for attorney review.
        </p>
      </div>

      {/* ── Step 1: Paste ── */}
      {step === "paste" && (
        <div className="space-y-4">
          {!isSignedIn && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800 flex flex-col sm:flex-row sm:items-center gap-3">
              <p className="flex-1">Sign in, then buy the RFE Response Pack ($39) or All-Access to run the analyzer.</p>
              <Link href="/sign-in" className="text-xs font-semibold underline shrink-0">Sign in</Link>
            </div>
          )}
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <Label>Paste your RFE notice</Label>
                  <Textarea
                    value={rfeText}
                    onChange={e => setRfeText(e.target.value)}
                    placeholder="Paste the full text from your USCIS Request for Evidence notice here..."
                    rows={10}
                    className="font-mono text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Receipt Number <span className="text-muted-foreground font-normal">(optional — for cover letter)</span></Label>
                  <Input
                    placeholder="e.g. WAC2512345678"
                    value={receiptNumber}
                    onChange={e => setReceiptNumber(e.target.value.toUpperCase())}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Service Center <span className="text-muted-foreground font-normal">(auto-detected)</span></Label>
                  <Input
                    value={receiptNumber ? getServiceCenter(receiptNumber).name : "Enter receipt number above"}
                    readOnly
                    className="text-muted-foreground bg-slate-50 text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                  <div className="flex items-start gap-2 flex-1">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" /> {error}
                  </div>
                  {(error.includes("Sign in") || error.includes("Pack")) && (
                    <Link href={error.includes("Sign in") ? "/sign-in" : "/pricing"} className="text-xs font-semibold text-red-800 underline shrink-0">
                      {error.includes("Sign in") ? "Sign in" : "See pricing"}
                    </Link>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <button onClick={() => { setRfeText(SAMPLE_RFE); setReceiptNumber("WAC2512345678"); }} className="text-xs text-primary hover:underline">
                  Try sample RFE (H-1B)
                </button>
                <Button onClick={handleAnalyze} disabled={!rfeText.trim() || analyzing}>
                  {analyzing
                    ? <><Sparkles className="mr-2 h-4 w-4 animate-pulse" />Analyzing with AI…</>
                    : <><Sparkles className="mr-2 h-4 w-4" />Analyze RFE</>}
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 flex gap-3">
            <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold">What you get with the RFE Response Pack — $39</p>
              <ul className="mt-1 space-y-0.5 list-disc list-inside text-xs text-blue-700">
                <li>AI identifies every USCIS issue with plain-English explanation</li>
                <li>Specific evidence checklist for each issue</li>
                <li>Attorney-style draft response for each issue</li>
                <li>Cover letter addressed to the correct service center</li>
                <li>Complete PDF export — ready to hand to your attorney</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── Step 2: Analysis ── */}
      {step === "analyze" && analysis && (
        <div>
          <Card className="mb-5 border-orange-200 bg-orange-50/50">
            <CardContent className="p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-orange-100 p-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-bold text-sm">
                    {analysis.issueCount} Issue{analysis.issueCount !== 1 ? "s" : ""} Identified
                    {analysis.visaType && <span className="ml-2 font-normal text-muted-foreground">· {analysis.visaType}</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">{resolvedCount} of {analysis.issues.length} addressed</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="font-semibold text-red-600">{analysis.deadline}</span>
                </div>
                <Button size="sm" onClick={() => setStep("response")}>
                  <FileText className="mr-2 h-4 w-4" /> Build Package
                </Button>
              </div>
            </CardContent>
          </Card>

          {receiptNumber && (
            <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground bg-slate-50 border rounded-lg px-3 py-2">
              <Building2 className="h-3.5 w-3.5" />
              <span>Response addressed to: <strong>{getServiceCenter(receiptNumber).name}</strong></span>
              {profile?.employer && <><span>·</span><User className="h-3.5 w-3.5" /><span>Petitioner: <strong>{profile.employer}</strong></span></>}
            </div>
          )}
          {deadlineAdded && (
            <div className="mb-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>RFE deadline added to your <Link href="/dashboard/timeline" className="underline font-medium">Timeline</Link></span>
            </div>
          )}

          <div className="space-y-3">
            {analysis.issues.map((issue, idx) => (
              <Card key={idx} className={issue.resolved ? "opacity-60" : ""}>
                <button className="w-full" onClick={() => setExpanded(expanded === idx ? null : idx)}>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button onClick={e => { e.stopPropagation(); toggleResolved(idx); }} className="shrink-0">
                          {issue.resolved
                            ? <CheckCircle2 className="h-5 w-5 text-green-500" />
                            : <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />}
                        </button>
                        <div className="text-left">
                          <p className="font-semibold text-sm">{issue.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{issue.description}</p>
                        </div>
                      </div>
                      <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform shrink-0 ${expanded === idx ? "rotate-180" : ""}`} />
                    </div>
                  </CardHeader>
                </button>
                {expanded === idx && (
                  <CardContent className="px-4 pb-4 pt-0">
                    <Separator className="mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Evidence Checklist</p>
                        <ul className="space-y-2">
                          {issue.checklist.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs">
                              <div className="h-4 w-4 rounded border border-slate-300 shrink-0 mt-0.5 flex items-center justify-center">
                                <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                              </div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Draft Response</p>
                          <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => handleCopy(idx)}>
                            <Copy className="h-3 w-3 mr-1" />{copied === idx ? "Copied!" : "Copy"}
                          </Button>
                        </div>
                        <pre className="whitespace-pre-wrap font-mono text-xs bg-slate-50 rounded-lg p-3 leading-5 max-h-48 overflow-y-auto text-muted-foreground">
                          {issue.sampleResponse}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={() => { setStep("paste"); setAnalysis(null); }}>
              Paste New RFE
            </Button>
            <Button onClick={() => setStep("response")}>
              <Download className="mr-2 h-4 w-4" /> Export PDF Package
            </Button>
          </div>
        </div>
      )}

      {/* ── Step 3: Full Response Package + PDF ── */}
      {step === "response" && analysis && (
        <div className="space-y-4">
          {/* Cover Letter Preview */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" /> Cover Letter
                </CardTitle>
                <Badge variant="success" className="text-xs">Auto-generated</Badge>
              </div>
            </CardHeader>
            <Separator />
            <CardContent className="p-5">
              <pre className="whitespace-pre-wrap font-mono text-xs bg-slate-50 rounded-lg p-4 leading-5 text-slate-700 max-h-72 overflow-y-auto">
                {coverLetter}
              </pre>
            </CardContent>
          </Card>

          {/* Response sections */}
          {analysis.issues.map((issue, i) => (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-sm">{issue.title}</p>
                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handleCopy(i)}>
                    <Copy className="h-3 w-3 mr-1.5" />{copied === i ? "Copied!" : "Copy Response"}
                  </Button>
                </div>
                <div className="mb-3">
                  <p className="text-xs font-semibold text-green-700 mb-1.5">Evidence to attach:</p>
                  <ul className="space-y-1">
                    {issue.checklist.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator className="my-3" />
                <p className="text-xs font-semibold text-purple-700 mb-1.5">Draft Response:</p>
                <pre className="whitespace-pre-wrap font-mono text-xs bg-slate-50 rounded-lg p-3 leading-5 text-slate-700">
                  {issue.sampleResponse}
                </pre>
              </CardContent>
            </Card>
          ))}

          {/* Export + actions */}
          <div className="flex gap-3 flex-wrap">
            <Button onClick={handleExportPDF} disabled={exporting} className="flex-1">
              {exporting
                ? <><Sparkles className="mr-2 h-4 w-4 animate-pulse" />Generating PDF…</>
                : <><Download className="mr-2 h-4 w-4" />Download PDF Package</>}
            </Button>
            <Button variant="outline" onClick={() => setStep("analyze")}>
              ← Back to Issues
            </Button>
          </div>

          {/* Attorney Review Upsell */}
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-slate-50">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
                <Building2 className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-sm">Attorney Review Add-on</h3>
                  <Badge className="bg-purple-600 text-white text-xs">$149</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  This AI package must be reviewed by a licensed attorney before USCIS submission. Deadline:{" "}
                  <strong className="text-red-600">{analysis.deadline}</strong>.
                </p>
                <ul className="text-xs text-muted-foreground space-y-0.5 mb-3">
                  {[
                    "Attorney verifies every issue and evidence item",
                    "Co-signed cover letter and response package",
                    "48-hour turnaround",
                  ].map(item => (
                    <li key={item} className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3 w-3 text-purple-500 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
                <Button
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => {
                    setTicketForm(f => ({ ...f, description: `Attorney Review — ${analysis?.visaType || "Visa"} RFE${receiptNumber ? ` (Receipt: ${receiptNumber})` : ""}` }));
                    setTicketOpen(true);
                    setTimeout(() => document.getElementById("concierge-section")?.scrollIntoView({ behavior: "smooth" }), 100);
                  }}
                >
                  <ArrowRight className="h-3.5 w-3.5 mr-1.5" /> Request Attorney Review — $149
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* ── Concierge Section ── */}
          <Card id="concierge-section" className="border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50 mt-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-base">Is your case complex?</h3>
                    <Badge variant="info" className="text-xs">Concierge</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Multiple RFEs, prior denials, employer issues, O-1/EB-1 cases, or overlapping petitions? Our immigration specialists review your full case and guide you through every step — priced based on complexity.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs">
                    {[
                      { icon: Mail,  label: "Email us", value: "rfe@statusclock.com" },
                      { icon: Phone, label: "Call / WhatsApp", value: "+1 (555) 000-0000" },
                      { icon: Clock, label: "Response time", value: "Within 24 hours" },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-2 bg-white rounded-lg border px-3 py-2">
                        <item.icon className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        <div>
                          <p className="text-muted-foreground">{item.label}</p>
                          <p className="font-semibold text-slate-700">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {!ticketSent ? (
                    ticketOpen ? (
                      <div className="bg-white rounded-xl border p-4 space-y-3">
                        <p className="text-sm font-semibold">Tell us about your case</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Your Name</Label>
                            <Input className="h-8 text-sm" value={ticketForm.name} onChange={e => setTicketForm(f => ({ ...f, name: e.target.value }))} />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Email</Label>
                            <Input className="h-8 text-sm" type="email" value={ticketForm.email} onChange={e => setTicketForm(f => ({ ...f, email: e.target.value }))} />
                          </div>
                          <div className="col-span-2 space-y-1">
                            <Label className="text-xs">Phone / WhatsApp (optional)</Label>
                            <Input className="h-8 text-sm" value={ticketForm.phone} onChange={e => setTicketForm(f => ({ ...f, phone: e.target.value }))} />
                          </div>
                          <div className="col-span-2 space-y-1">
                            <Label className="text-xs">Briefly describe your situation</Label>
                            <Textarea
                              rows={3}
                              className="text-sm resize-none"
                              placeholder="e.g. H-1B RFE with 3 issues, prior denial in 2023, employer uncooperative with documentation..."
                              value={ticketForm.description}
                              onChange={e => setTicketForm(f => ({ ...f, description: e.target.value }))}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1" onClick={handleTicketSubmit} disabled={!ticketForm.email || !ticketForm.description}>
                            <ArrowRight className="h-3.5 w-3.5 mr-1.5" /> Submit — We&apos;ll reach out within 24h
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setTicketOpen(false)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50" onClick={() => setTicketOpen(true)}>
                        <MessageSquare className="h-4 w-4 mr-2" /> Get Expert Help →
                      </Button>
                    )
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                      <CheckCircle2 className="h-4 w-4" />
                      Request received! We&apos;ll email you within 24 hours with next steps and pricing.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
