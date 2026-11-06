"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

interface VisaOption {
  id: string;
  name: string;
  fullName: string;
  color: string;
  bg: string;
  border: string;
  maxDuration: string;
  workAuth: "full" | "restricted" | "none";
  spouseWork: boolean;
  selfPetition: boolean;
  requiresLottery: boolean;
  pathToGC: "direct" | "possible" | "no";
  travelFlexibility: "high" | "medium" | "low";
  processingTime: string;
  govFee: string;
  eligibility: string;
  pros: string[];
  cons: string[];
  bestFor: string;
}

const visas: VisaOption[] = [
  {
    id: "f1-opt", name: "F-1 OPT", fullName: "F-1 + Optional Practical Training",
    color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe",
    maxDuration: "12 months (36 with STEM)", workAuth: "restricted", spouseWork: false,
    selfPetition: false, requiresLottery: false, pathToGC: "possible",
    travelFlexibility: "medium", processingTime: "Live USCIS lookup", govFee: "$470 online / $520 paper",
    eligibility: "F-1 students who completed a US degree",
    pros: ["No employer cap or lottery", "Easy to get — approval rate >90%", "STEM OPT adds 2 more years", "Good time to find H-1B sponsor"],
    cons: ["Limited to 12 months (36 STEM)", "Must have job related to degree", "Unemployment limited to 90 days", "No direct path to green card"],
    bestFor: "New graduates looking to gain US work experience before H-1B",
  },
  {
    id: "h1b", name: "H-1B", fullName: "H-1B Specialty Occupation",
    color: "#16a34a", bg: "#f0fdf4", border: "#86efac",
    maxDuration: "6 years (extendable with GC)", workAuth: "full", spouseWork: true,
    selfPetition: false, requiresLottery: true, pathToGC: "direct",
    travelFlexibility: "high", processingTime: "Live USCIS lookup; 15 business days with premium", govFee: "$3,330+ online, regular employer",
    eligibility: "Bachelor's degree + specialty job + employer sponsor",
    pros: ["Full work authorization", "H-4 EAD for spouse", "Direct path to green card", "Extendable with pending GC"],
    cons: ["Selection odds vary by cycle; duplicate registrations do not improve odds", "Employer-dependent", "$3,330+ in fees paid by employer", "Long India/China green card wait"],
    bestFor: "Professionals with employer sponsors who won the lottery",
  },
  {
    id: "o1a", name: "O-1A", fullName: "O-1A Extraordinary Ability",
    color: "#7c3aed", bg: "#faf5ff", border: "#d8b4fe",
    maxDuration: "3 years (renewable)", workAuth: "full", spouseWork: false,
    selfPetition: false, requiresLottery: false, pathToGC: "possible",
    travelFlexibility: "high", processingTime: "Live USCIS lookup; 15 business days with premium", govFee: "$1,055+",
    eligibility: "Extraordinary ability — awards, publications, high salary, judging",
    pros: ["No cap or lottery", "Self-petition possible (with agent)", "Available year-round", "High salary earners often qualify"],
    cons: ["High evidence bar", "Employer (or agent) required", "No O-2 EAD for spouse", "Renewal requires sustained acclaim"],
    bestFor: "Researchers, startup founders, artists, athletes with strong achievements",
  },
  {
    id: "l1a", name: "L-1A", fullName: "L-1A Intracompany Transferee (Manager)",
    color: "#0891b2", bg: "#ecfeff", border: "#a5f3fc",
    maxDuration: "7 years", workAuth: "full", spouseWork: true,
    selfPetition: false, requiresLottery: false, pathToGC: "direct",
    travelFlexibility: "high", processingTime: "Live USCIS lookup", govFee: "$1,385+",
    eligibility: "Managers at multinational companies — 1 year abroad with same company",
    pros: ["No cap or lottery", "L-2 work authorization for spouse", "Direct EB-1C green card path", "Faster GC than EB-2/EB-3"],
    cons: ["Must have worked 1 year abroad at same company", "Manager/executive role required", "Company-dependent", "Less common"],
    bestFor: "Managers and executives transferred from foreign offices of US multinationals",
  },
  {
    id: "eb2-niw", name: "EB-2 NIW", fullName: "EB-2 National Interest Waiver",
    color: "#d97706", bg: "#fffbeb", border: "#fde68a",
    maxDuration: "Permanent", workAuth: "full", spouseWork: true,
    selfPetition: true, requiresLottery: false, pathToGC: "direct",
    travelFlexibility: "high", processingTime: "Visa Bulletin + live USCIS lookup", govFee: "$2,455+",
    eligibility: "Advanced degree + work in national interest, OR exceptional ability",
    pros: ["No employer needed — self-petition", "No PERM labor certification", "Permanent work authorization", "Spouse gets EAD while pending"],
    cons: ["Long wait for India/China nationals", "Must prove national interest (3-prong test)", "I-485 only when PD current", "No guarantee of approval"],
    bestFor: "Researchers, physicians, engineers who can self-petition without employer",
  },
  {
    id: "tn", name: "TN", fullName: "TN USMCA Professional",
    color: "#dc2626", bg: "#fef2f2", border: "#fecaca",
    maxDuration: "3 years (renewable indefinitely)", workAuth: "full", spouseWork: false,
    selfPetition: false, requiresLottery: false, pathToGC: "possible",
    travelFlexibility: "medium", processingTime: "Often same day at border", govFee: "$30+ land border / $185 visa",
    eligibility: "Canadian or Mexican citizens in TN-eligible professions",
    pros: ["No cap or lottery", "Very fast — approved at border", "Renewable indefinitely", "Low government fees"],
    cons: ["Only for Canadians and Mexicans", "Limited to TN profession list", "TD visa — spouse cannot work", "Not designed for GC intent"],
    bestFor: "Canadian/Mexican professionals (engineers, accountants, lawyers, scientists)",
  },
];

const attributeLabels: Record<string, string> = {
  maxDuration: "Max Duration",
  workAuth: "Work Authorization",
  spouseWork: "Spouse Can Work",
  selfPetition: "Self-Petition",
  requiresLottery: "Lottery Required",
  pathToGC: "Path to Green Card",
  travelFlexibility: "Travel Flexibility",
  processingTime: "Processing Time",
  govFee: "Gov't Fees (approx)",
};

function renderValue(key: string, value: unknown) {
  if (key === "workAuth") {
    if (value === "full") return <span className="text-green-600 font-medium text-sm">Full (any employer)</span>;
    if (value === "restricted") return <span className="text-yellow-600 font-medium text-sm">Restricted (field-related)</span>;
    return <span className="text-red-600 font-medium text-sm">Not authorized</span>;
  }
  if (key === "pathToGC") {
    if (value === "direct") return <span className="text-green-600 font-medium text-sm flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Direct path</span>;
    if (value === "possible") return <span className="text-yellow-600 font-medium text-sm flex items-center gap-1"><AlertCircle className="h-3.5 w-3.5" /> Possible</span>;
    return <span className="text-red-500 font-medium text-sm flex items-center gap-1"><XCircle className="h-3.5 w-3.5" /> No</span>;
  }
  if (typeof value === "boolean") {
    return value ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-400" />;
  }
  if (key === "travelFlexibility") {
    const colors: Record<string, string> = { high: "text-green-600", medium: "text-yellow-600", low: "text-red-500" };
    return <span className={`text-sm font-medium capitalize ${colors[value as string]}`}>{value as string}</span>;
  }
  return <span className="text-sm">{String(value)}</span>;
}

export function VisaComparisonTool() {
  const [selected, setSelected] = useState<string[]>(["f1-opt", "h1b", "eb2-niw"]);

  const toggleVisa = (id: string) => {
    if (selected.includes(id)) {
      if (selected.length > 1) setSelected(selected.filter((s) => s !== id));
    } else {
      if (selected.length < 4) setSelected([...selected, id]);
    }
  };

  const selectedVisas = visas.filter((v) => selected.includes(v.id));

  return (
    <div>
      {/* Visa selector */}
      <div className="mb-8">
        <p className="text-sm font-semibold mb-3" style={{ color: "#64748b" }}>Select up to 4 visas to compare</p>
        <div className="flex flex-wrap gap-2">
          {visas.map((v) => (
            <button
              key={v.id}
              onClick={() => toggleVisa(v.id)}
              className="px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all"
              style={{
                backgroundColor: selected.includes(v.id) ? v.bg : "#ffffff",
                borderColor: selected.includes(v.id) ? v.color : "#e2e8f0",
                color: selected.includes(v.id) ? v.color : "#64748b",
              }}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: "#e2e8f0" }}>
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ borderBottom: "2px solid #e2e8f0", backgroundColor: "#f8fafc" }}>
              <th className="w-44 p-4 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: "#94a3b8", borderRight: "1px solid #e2e8f0" }}>Attribute</th>
              {selectedVisas.map((v, idx) => (
                <th key={v.id} className="p-4 text-center min-w-52" style={{ borderRight: idx < selectedVisas.length - 1 ? "1px solid #e2e8f0" : undefined }}>
                  <div className="inline-flex flex-col items-center gap-1">
                    <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ backgroundColor: v.bg, color: v.color }}>{v.name}</span>
                    <span className="text-xs font-normal" style={{ color: "#94a3b8" }}>{v.fullName}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.keys(attributeLabels).map((key, i) => (
              <tr key={key} style={{ backgroundColor: i % 2 === 0 ? "#ffffff" : "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                <td className="p-4 text-xs font-semibold" style={{ color: "#64748b", borderRight: "1px solid #e2e8f0", minWidth: "160px" }}>{attributeLabels[key]}</td>
                {selectedVisas.map((v, idx) => (
                  <td key={v.id} className="p-4" style={{ borderRight: idx < selectedVisas.length - 1 ? "1px solid #e2e8f0" : undefined }}>
                    <div className="flex items-center justify-center">
                      {renderValue(key, v[key as keyof VisaOption])}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
            <tr style={{ backgroundColor: "#ffffff", borderBottom: "none" }}>
              <td className="p-4 text-xs font-semibold align-top" style={{ color: "#64748b", borderRight: "1px solid #e2e8f0" }}>Who qualifies</td>
              {selectedVisas.map((v, idx) => (
                <td key={v.id} className="p-4 text-center text-xs leading-relaxed" style={{ color: "#475569", borderRight: idx < selectedVisas.length - 1 ? "1px solid #e2e8f0" : undefined }}>{v.eligibility}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pros / Cons cards */}
      <div className="mt-10 grid gap-6" style={{ gridTemplateColumns: `repeat(${selectedVisas.length}, minmax(0, 1fr))` }}>
        {selectedVisas.map((v) => (
          <div key={v.id} className="rounded-xl border-2 overflow-hidden" style={{ borderColor: v.border }}>
            <div className="px-4 py-3" style={{ backgroundColor: v.bg }}>
              <p className="font-bold text-sm" style={{ color: v.color }}>{v.name}</p>
              <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{v.bestFor}</p>
            </div>
            <div className="p-4 bg-white">
              <p className="text-xs font-semibold text-green-700 mb-2">Pros</p>
              <ul className="space-y-1 mb-4">
                {v.pros.map((p, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />{p}
                  </li>
                ))}
              </ul>
              <p className="text-xs font-semibold text-red-600 mb-2">Cons</p>
              <ul className="space-y-1">
                {v.cons.map((c, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs">
                    <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 text-center p-8 rounded-2xl" style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}>
        <h2 className="text-2xl font-bold text-white mb-2">Not sure which path is right for you?</h2>
        <p className="text-white/80 mb-6">Our AI Assistant analyzes your situation and recommends the best immigration strategy.</p>
        <Link href="/ai-assistant" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm bg-white text-blue-700">
          Ask AI Assistant →
        </Link>
      </div>
    </div>
  );
}
