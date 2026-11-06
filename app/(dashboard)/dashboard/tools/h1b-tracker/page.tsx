"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Clock, AlertCircle, CheckCircle2, Circle, Users, FileText } from "lucide-react";

const lotteryHistory = [
  { year: "FY2025 (official USCIS report)", registrations: 470342, selected: 127624, rate: 27.1 },
];

const timeline = [
  {
    date: "FY2027 cycle",
    label: "Registration and selection",
    status: "done",
    description: "The FY2027 cap cycle is complete. USCIS publishes the exact registration and selection dates for each cycle; the registration fee is currently $215 per beneficiary.",
  },
  {
    date: "FY2027 petition period",
    label: "Selected employers file petitions",
    status: "done",
    description: "Selected employers filed full Form I-129 petitions during the period shown in their USCIS selection notices.",
  },
  {
    date: "Oct 1, 2026",
    label: "H-1B Status Begins",
    status: "done",
    description: "October 1, 2026 was the FY2027 fiscal-year start date for approved cap-subject H-1B cases with that requested start date.",
  },
  {
    date: "March 2027 (exact dates TBD)",
    label: "FY2028 Registration Window",
    status: "upcoming",
    description: "USCIS has not published the exact FY2028 registration dates. Monitor the official H-1B page before relying on a deadline.",
  },
];

const capExemptEmployers = [
  { type: "Universities & Colleges", examples: "MIT, Stanford, community colleges", icon: "🎓" },
  { type: "Nonprofit Research Organizations", examples: "Research institutes affiliated with universities", icon: "🔬" },
  { type: "Government Research Organizations", examples: "NIH, national labs", icon: "🏛️" },
  { type: "501(c)(3) Nonprofits", examples: "Hospitals, foundations", icon: "❤️" },
];

const tips = [
  { title: "Use the Master's Cap if eligible", body: "A qualifying U.S. master's degree makes a beneficiary eligible for the advanced-degree exemption as well as the regular cap; selection odds vary by cycle." },
  { title: "Consider cap-exempt employers", body: "Universities, nonprofits, and government labs are not subject to the cap. No lottery needed." },
  { title: "Explore O-1A as a backup", body: "Individuals with extraordinary ability can self-petition for O-1A without a cap." },
  { title: "Start employer conversations early", body: "Registration dates are announced annually. Employers typically begin H-1B conversations months before the registration window." },
  { title: "Premium processing for faster action", body: "Pay $2,805 for qualifying USCIS action within 15 business days after filing an eligible I-129 petition." },
];

export default function H1BTrackerPage() {
  const [activeTab, setActiveTab] = useState<"timeline" | "odds" | "tips" | "exempt">("timeline");

  const tabs = [
    { id: "timeline", label: "FY2027 / FY2028 Timeline" },
    { id: "odds", label: "Lottery Odds" },
    { id: "tips", label: "Strategy Tips" },
    { id: "exempt", label: "Cap-Exempt" },
  ] as const;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#f0fdf4" }}>
            <Trophy className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">H-1B Lottery Tracker</h1>
            <p className="text-sm" style={{ color: "#64748b" }}>FY2027 cycle complete · FY2028 dates not yet announced</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { label: "FY2025 Registrations", value: "470,342", icon: Users, color: "text-blue-600", bg: "#eff6ff" },
            { label: "FY2025 Selected Beneficiaries", value: "127,624", icon: CheckCircle2, color: "text-green-600", bg: "#f0fdf4" },
            { label: "Regular Cap", value: "65,000", icon: FileText, color: "text-purple-600", bg: "#faf5ff" },
            { label: "Master's Cap", value: "20,000", icon: Trophy, color: "text-orange-600", bg: "#fff7ed" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label}>
                <CardContent className="p-4">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: stat.bg }}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg mb-6" style={{ backgroundColor: "#f1f5f9" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 py-2 text-sm font-medium rounded-md transition-all"
            style={{
              backgroundColor: activeTab === tab.id ? "#ffffff" : "transparent",
              color: activeTab === tab.id ? "#0f172a" : "#64748b",
              boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {activeTab === "timeline" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}>
            <AlertCircle className="h-4 w-4 text-blue-600 shrink-0" />
            <p className="text-sm text-blue-800">The FY2027 cycle is complete. FY2028 registration is expected in March 2027, but USCIS has not published exact dates.</p>
          </div>
          {timeline.map((step, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: step.status === "done" ? "#16a34a" : step.status === "current" ? "#2563eb" : "#e2e8f0",
                  }}>
                  {step.status === "done" ? (
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  ) : step.status === "current" ? (
                    <Clock className="h-4 w-4 text-white" />
                  ) : (
                    <Circle className="h-4 w-4" style={{ color: "#94a3b8" }} />
                  )}
                </div>
                {i < timeline.length - 1 && <div className="w-0.5 flex-1 mt-1" style={{ backgroundColor: "#e2e8f0" }} />}
              </div>
              <Card className="flex-1 mb-2">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm">{step.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{step.date}</p>
                    </div>
                    {step.status === "current" && <Badge className="bg-blue-100 text-blue-800 shrink-0">Now</Badge>}
                    {step.status === "done" && <Badge className="bg-green-100 text-green-800 shrink-0">Done</Badge>}
                  </div>
                  <p className="text-xs mt-2" style={{ color: "#475569" }}>{step.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Lottery Odds */}
      {activeTab === "odds" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Officially Published Selection Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lotteryHistory.map((y) => (
                  <div key={y.year}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{y.year}</span>
                      <span className="text-sm font-bold" style={{ color: y.rate > 30 ? "#16a34a" : y.rate > 20 ? "#2563eb" : "#dc2626" }}>
                        {y.rate}% published ratio
                      </span>
                    </div>
                    <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: "#f1f5f9" }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${y.rate}%`,
                          backgroundColor: y.rate > 30 ? "#16a34a" : y.rate > 20 ? "#2563eb" : "#dc2626",
                        }}
                      />
                    </div>
                    <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>
                      {y.selected.toLocaleString()} selected from {y.registrations.toLocaleString()} registrations
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <div className="p-4 rounded-xl" style={{ backgroundColor: "#fef9c3", border: "1px solid #fde047" }}>
            <p className="text-sm font-semibold text-yellow-800 mb-1">Key insight</p>
            <p className="text-sm text-yellow-700">The FY2025 figure is a ratio of USCIS&apos;s published selected-beneficiary count to registrations, not a guaranteed individual probability. Selection is beneficiary-centric, so duplicate registrations do not improve an individual&apos;s odds.</p>
            <a href="https://www.uscis.gov/sites/default/files/document/reports/ola_signed_h1b_characteristics_congressional_report_FY24.pdf" target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-xs font-semibold text-yellow-900 underline">View the USCIS H-1B characteristics report ↗</a>
          </div>
        </div>
      )}

      {/* Tips */}
      {activeTab === "tips" && (
        <div className="space-y-3">
          {tips.map((tip, i) => (
            <Card key={i}>
              <CardContent className="p-4 flex gap-3">
                <div className="h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-sm font-bold text-white" style={{ backgroundColor: "#2563eb" }}>
                  {i + 1}
                </div>
                <div>
                  <p className="font-semibold text-sm">{tip.title}</p>
                  <p className="text-sm mt-1" style={{ color: "#64748b" }}>{tip.body}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="mt-4">
            <Button className="w-full" asChild>
              <a href="/ai-assistant">Ask AI for personalized H-1B advice</a>
            </Button>
          </div>
        </div>
      )}

      {/* Cap Exempt */}
      {activeTab === "exempt" && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl" style={{ backgroundColor: "#f0fdf4", border: "1px solid #86efac" }}>
            <p className="text-sm font-semibold text-green-800 mb-1">No lottery required</p>
            <p className="text-sm text-green-700">Cap-exempt employers can sponsor H-1B workers at any time of year without going through the annual lottery.</p>
          </div>
          {capExemptEmployers.map((emp) => (
            <Card key={emp.type}>
              <CardContent className="p-4 flex gap-3 items-start">
                <span className="text-2xl">{emp.icon}</span>
                <div>
                  <p className="font-semibold text-sm">{emp.type}</p>
                  <p className="text-xs mt-1" style={{ color: "#64748b" }}>{emp.examples}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card>
            <CardContent className="p-4">
              <p className="font-semibold text-sm mb-2">Also consider cap-exempt transfers</p>
              <p className="text-sm" style={{ color: "#64748b" }}>
                If you currently hold an approved H-1B (even if your employer is cap-subject), you can transfer to a new employer without going through the lottery again. This is called H-1B portability.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
