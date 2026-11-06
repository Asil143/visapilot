"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Info, ChevronDown, ChevronUp, AlertCircle } from "lucide-react";

interface FeeItem {
  name: string;
  code: string;
  baseFee: number;
  smallEmployerFee?: number;
  biometricFee?: number;
  premiumFee?: number;
  notes?: string;
  required: boolean;
}

interface VisaPath {
  id: string;
  title: string;
  description: string;
  badge: string;
  badgeColor: string;
  fees: FeeItem[];
}

const visaPaths: VisaPath[] = [
  {
    id: "opt",
    title: "OPT (Optional Practical Training)",
    description: "Work authorization after F-1 graduation",
    badge: "F-1 OPT",
    badgeColor: "bg-blue-100 text-blue-800",
    fees: [
      { name: "Form I-765 (EAD Application)", code: "I-765", baseFee: 470, biometricFee: 0, required: true, notes: "$470 online or $520 on paper; no separate biometric fee" },
    ],
  },
  {
    id: "stem-opt",
    title: "STEM OPT Extension",
    description: "24-month extension for STEM degree holders",
    badge: "STEM OPT",
    badgeColor: "bg-purple-100 text-purple-800",
    fees: [
      { name: "Form I-765 (EAD Extension)", code: "I-765", baseFee: 470, required: true, notes: "$470 online or $520 on paper; must file while initial OPT is valid" },
    ],
  },
  {
    id: "h1b",
    title: "H-1B Specialty Occupation",
    description: "Employer-sponsored work visa",
    badge: "H-1B",
    badgeColor: "bg-green-100 text-green-800",
    fees: [
      { name: "Form I-129 (Petition)", code: "I-129", baseFee: 730, smallEmployerFee: 460, required: true, notes: "$730 online or $780 on paper for regular employers; $460 for small employers/nonprofits" },
      { name: "ACWIA Training Fee (≤25 employees)", code: "ACWIA-S", baseFee: 750, required: false, notes: "For employers with ≤25 full-time employees" },
      { name: "ACWIA Training Fee (>25 employees)", code: "ACWIA-L", baseFee: 1500, required: false, notes: "For employers with >25 full-time employees" },
      { name: "Fraud Prevention & Detection Fee", code: "FPDF", baseFee: 500, required: true },
      { name: "Asylum Program Fee (≤25 employees)", code: "APF-S", baseFee: 300, required: false, notes: "Reduced rate for employers with ≤25 FTE. Waived for non-profits." },
      { name: "Asylum Program Fee (>25 employees)", code: "APF-L", baseFee: 600, required: false, notes: "Standard rate. Waived for non-profits & universities." },
      { name: "Premium Processing (optional)", code: "I-907", baseFee: 2805, premiumFee: 2805, required: false, notes: "15 business day guarantee" },
    ],
  },
  {
    id: "h1b-transfer",
    title: "H-1B Transfer (Portability)",
    description: "Transfer H-1B to a new employer",
    badge: "H-1B Transfer",
    badgeColor: "bg-teal-100 text-teal-800",
    fees: [
      { name: "Form I-129 (Petition)", code: "I-129", baseFee: 730, smallEmployerFee: 460, required: true, notes: "$730 online or $780 on paper for regular employers; $460 for small employers/nonprofits" },
      { name: "ACWIA Training Fee (≤25 employees)", code: "ACWIA-S", baseFee: 750, required: false, notes: "For employers with ≤25 full-time employees" },
      { name: "ACWIA Training Fee (>25 employees)", code: "ACWIA-L", baseFee: 1500, required: false, notes: "For employers with >25 full-time employees" },
      { name: "Fraud Prevention & Detection Fee", code: "FPDF", baseFee: 500, required: true },
      { name: "Asylum Program Fee (≤25 employees)", code: "APF-S", baseFee: 300, required: false, notes: "Reduced rate for small employers; waived for nonprofits" },
      { name: "Asylum Program Fee (>25 employees)", code: "APF-L", baseFee: 600, required: false, notes: "Regular rate; waived for nonprofits" },
      { name: "Premium Processing (optional)", code: "I-907", baseFee: 2805, required: false },
    ],
  },
  {
    id: "green-card-eb",
    title: "Employment-Based Green Card (EB-2/EB-3)",
    description: "Permanent residence through employment",
    badge: "Green Card",
    badgeColor: "bg-emerald-100 text-emerald-800",
    fees: [
      { name: "PERM Labor Certification (DOL)", code: "PERM", baseFee: 0, required: true, notes: "Free to file with DOL — attorney fees vary ($3k–$6k)" },
      { name: "Form I-140 (Immigrant Petition)", code: "I-140", baseFee: 715, required: true },
      { name: "Asylum Program Fee (≤25 employees)", code: "APF-S", baseFee: 300, required: false, notes: "Reduced rate for small employers; waived for nonprofits" },
      { name: "Asylum Program Fee (>25 employees)", code: "APF-L", baseFee: 600, required: false, notes: "Regular rate; waived for nonprofits" },
      { name: "Form I-485 (Adjustment of Status)", code: "I-485", baseFee: 1440, required: true, notes: "Standard adult filing; no separate biometric fee" },
      { name: "Form I-131 (Advance Parole)", code: "I-131", baseFee: 630, required: false, notes: "Current fee for advance parole with a pending I-485; verify filing category" },
      { name: "Form I-765 (EAD with I-485)", code: "I-765", baseFee: 260, required: false, notes: "Current fee when tied to a pending I-485 filed with a fee on or after April 1, 2024" },
      { name: "Form I-864 (Affidavit of Support)", code: "I-864", baseFee: 0, required: false, notes: "Only if family-sponsored" },
      { name: "Premium Processing for I-140 (optional)", code: "I-907", baseFee: 2805, required: false },
    ],
  },
  {
    id: "eb2-niw",
    title: "EB-2 National Interest Waiver",
    description: "Self-petition green card — no employer needed",
    badge: "EB-2 NIW",
    badgeColor: "bg-yellow-100 text-yellow-800",
    fees: [
      { name: "Form I-140 (Self-Petition)", code: "I-140", baseFee: 715, required: true },
      { name: "Asylum Program Fee (self-petitioner)", code: "APF", baseFee: 300, required: true, notes: "Current self-petitioner fee; $0 for a nonprofit petitioner" },
      { name: "Premium Processing for I-140 (optional)", code: "I-907", baseFee: 2805, required: false },
      { name: "Form I-485 (Adjustment of Status)", code: "I-485", baseFee: 1440, required: false, notes: "Only after priority date is current" },
    ],
  },
  {
    id: "citizenship",
    title: "Naturalization (US Citizenship)",
    description: "Become a US citizen after green card",
    badge: "N-400",
    badgeColor: "bg-red-100 text-red-800",
    fees: [
      { name: "Form N-400 (Application)", code: "N-400", baseFee: 710, required: true, notes: "$710 online or $760 on paper; no separate biometric fee" },
    ],
  },
  {
    id: "ead-renewal",
    title: "EAD Renewal (General)",
    description: "Renew any Employment Authorization Document",
    badge: "EAD",
    badgeColor: "bg-orange-100 text-orange-800",
    fees: [
      { name: "Form I-765 (EAD Renewal)", code: "I-765", baseFee: 470, required: true },
    ],
  },
];

export default function FeeCalculatorPage() {
  const [selectedPath, setSelectedPath] = useState<string>("h1b");
  const [largeEmployer, setLargeEmployer] = useState(true);
  const [includePremium, setIncludePremium] = useState(false);
  const [includeAsylum, setIncludeAsylum] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  const path = visaPaths.find((p) => p.id === selectedPath)!;

  const isH1bPath = selectedPath === "h1b" || selectedPath === "h1b-transfer";

  const getFeeAmount = (fee: FeeItem) => {
    if (fee.code === "I-129" && isH1bPath && !largeEmployer) return fee.smallEmployerFee ?? fee.baseFee;
    return fee.baseFee;
  };

  const getActiveFees = () => {
    return path.fees.filter((fee) => {
      if (fee.code === "ACWIA-S" && (largeEmployer || !isH1bPath)) return false;
      if (fee.code === "ACWIA-L" && (!largeEmployer || !isH1bPath)) return false;
      if (fee.code === "APF-S" && (largeEmployer || !includeAsylum)) return false;
      if (fee.code === "APF-L" && (!largeEmployer || !includeAsylum)) return false;
      if ((fee.code === "APF" || fee.code === "APF-S" || fee.code === "APF-L") && !includeAsylum) return false;
      if ((fee.code === "I-907" || fee.premiumFee) && !includePremium) return false;
      return fee.required
        || (fee.code === "ACWIA-S" && !largeEmployer && isH1bPath)
        || (fee.code === "ACWIA-L" && largeEmployer && isH1bPath)
        || (fee.code === "APF-S" && !largeEmployer && includeAsylum)
        || (fee.code === "APF-L" && largeEmployer && includeAsylum)
        || (fee.code === "APF" && includeAsylum)
        || (fee.code === "I-907" && includePremium);
    });
  };

  const activeFees = getActiveFees();
  const total = activeFees.reduce((sum, f) => sum + getFeeAmount(f), 0);

  const hasEmployerOptions = isH1bPath || selectedPath === "green-card-eb";
  const hasPremiumOption = path.fees.some((f) => f.code === "I-907");
  const hasAsylumOption = path.fees.some((f) => f.code === "APF" || f.code === "APF-S" || f.code === "APF-L");

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#eff6ff" }}>
            <Calculator className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">USCIS Fee Calculator</h1>
            <p className="text-sm" style={{ color: "#64748b" }}>USCIS fee schedule — Form G-1055, edition 07/22/25</p>
          </div>
        </div>
        <div className="flex items-start gap-2 mt-3 p-3 rounded-lg" style={{ backgroundColor: "#fefce8", border: "1px solid #fde047" }}>
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-yellow-600" />
          <p className="text-xs text-yellow-800">Attorney fees, state filing fees, and translation costs are not included. Fees change periodically — always verify on uscis.gov before filing.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Path Selector */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="font-semibold text-sm uppercase tracking-wide" style={{ color: "#64748b" }}>Select Your Immigration Path</h2>
          {visaPaths.map((vp) => (
            <button
              key={vp.id}
              onClick={() => setSelectedPath(vp.id)}
              className="w-full text-left p-4 rounded-xl border-2 transition-all"
              style={{
                borderColor: selectedPath === vp.id ? "#2563eb" : "#e2e8f0",
                backgroundColor: selectedPath === vp.id ? "#eff6ff" : "#ffffff",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${vp.badgeColor}`}>{vp.badge}</span>
                  </div>
                  <p className="font-medium text-sm">{vp.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{vp.description}</p>
                </div>
                {selectedPath === vp.id && (
                  <div className="h-5 w-5 rounded-full flex items-center justify-center shrink-0 ml-3" style={{ backgroundColor: "#2563eb" }}>
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Right: Fee Breakdown */}
        <div className="space-y-4">
          {/* Options */}
          {(hasEmployerOptions || hasPremiumOption || hasAsylumOption) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {hasEmployerOptions && (
                  <div>
                    <p className="text-xs font-medium mb-1" style={{ color: "#64748b" }}>Employer Size</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setLargeEmployer(false)}
                        className="flex-1 py-1.5 text-xs rounded-md border font-medium transition-colors"
                        style={{ backgroundColor: !largeEmployer ? "#2563eb" : "#ffffff", color: !largeEmployer ? "#ffffff" : "#64748b", borderColor: !largeEmployer ? "#2563eb" : "#e2e8f0" }}
                      >
                        ≤25 employees
                      </button>
                      <button
                        onClick={() => setLargeEmployer(true)}
                        className="flex-1 py-1.5 text-xs rounded-md border font-medium transition-colors"
                        style={{ backgroundColor: largeEmployer ? "#2563eb" : "#ffffff", color: largeEmployer ? "#ffffff" : "#64748b", borderColor: largeEmployer ? "#2563eb" : "#e2e8f0" }}
                      >
                        &gt;25 employees
                      </button>
                    </div>
                  </div>
                )}
                {hasPremiumOption && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={includePremium} onChange={(e) => setIncludePremium(e.target.checked)} className="rounded" />
                    <span className="text-xs">Include Premium Processing (+$2,805)</span>
                  </label>
                )}
                {hasAsylumOption && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={includeAsylum} onChange={(e) => setIncludeAsylum(e.target.checked)} className="rounded" />
                    <span className="text-xs">Include applicable Asylum Program Fee</span>
                  </label>
                )}
              </CardContent>
            </Card>
          )}

          {/* Total */}
          <Card style={{ border: "2px solid #2563eb" }}>
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "#2563eb" }}>Total Government Fees</p>
              <p className="text-4xl font-bold" style={{ color: "#0f172a" }}>${total.toLocaleString()}</p>
              <p className="text-xs mt-1" style={{ color: "#64748b" }}>+ attorney & service fees not included</p>

              <button
                onClick={() => setShowDetails(!showDetails)}
                className="flex items-center gap-1 text-xs font-medium mt-3"
                style={{ color: "#2563eb" }}
              >
                {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {showDetails ? "Hide" : "Show"} fee breakdown
              </button>

              {showDetails && (
                <div className="mt-3 space-y-2 border-t pt-3">
                  {activeFees.map((fee) => (
                    <div key={fee.code} className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-medium">{fee.name}</p>
                        <p className="text-[10px]" style={{ color: "#94a3b8" }}>{fee.code}</p>
                      </div>
                      <p className="text-xs font-semibold shrink-0">${getFeeAmount(fee).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          {activeFees.some((f) => f.notes) && (
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-1.5 mb-2">
                  <Info className="h-3.5 w-3.5 text-blue-600" />
                  <p className="text-xs font-semibold">Notes</p>
                </div>
                {activeFees.filter((f) => f.notes).map((fee) => (
                  <div key={fee.code}>
                    <p className="text-[11px] font-medium">{fee.code}</p>
                    <p className="text-[11px]" style={{ color: "#64748b" }}>{fee.notes}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Button className="w-full" variant="outline" asChild>
            <a href="https://www.uscis.gov/forms/forms-fees" target="_blank" rel="noopener noreferrer">
              Verify on uscis.gov ↗
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
