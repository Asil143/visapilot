"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Clock, Search, Info, RefreshCw, ExternalLink } from "lucide-react";

const LAST_REVIEWED = "November 6, 2026";
const USCIS_PROCESSING_TIMES_URL = "https://egov.uscis.gov/processing-times/check";

interface ProcessingRow {
  form: string;
  title: string;
  officeHint: string;
  category: string;
}

const DATA: ProcessingRow[] = [
  // Employment
  { form: "I-765", title: "Employment Authorization (Initial OPT)", officeHint: "Select category (c)(3)(B)", category: "Employment" },
  { form: "I-765", title: "Employment Authorization (STEM OPT)", officeHint: "Select category (c)(3)(C)", category: "Employment" },
  { form: "I-129 H-1B", title: "Petition for H-1B Worker", officeHint: "Select the office on your receipt", category: "Employment" },
  { form: "I-140 EB-1", title: "Immigrant Petition (EB-1)", officeHint: "Select the office on your receipt", category: "Employment" },
  { form: "I-140 EB-2/EB-3", title: "Immigrant Petition (EB-2/3)", officeHint: "Select the office on your receipt", category: "Employment" },
  { form: "I-140 EB-2 NIW", title: "EB-2 National Interest Waiver", officeHint: "Select the office on your receipt", category: "Employment" },
  // Family
  { form: "I-130", title: "Petition for Alien Relative (spouse)", officeHint: "Select the office on your receipt", category: "Family" },
  { form: "I-485", title: "Adjustment of Status (EB)", officeHint: "Select your field office", category: "Family" },
  { form: "I-485", title: "Adjustment of Status (family)", officeHint: "Select your field office", category: "Family" },
  // Student
  { form: "I-539", title: "Change of Status (F-1)", officeHint: "Select the office on your receipt", category: "Student" },
  // Travel
  { form: "I-131", title: "Travel Document (Advance Parole)", officeHint: "Select the office on your receipt", category: "Travel" },
  // Naturalization
  { form: "N-400", title: "Application for Naturalization", officeHint: "Select your field office", category: "Citizenship" },
  // Premium
  { form: "I-129 PP", title: "H-1B Premium Processing", officeHint: "15 business-day action standard", category: "Premium" },
  { form: "I-140 PP", title: "EB Petition Premium Processing", officeHint: "15 business-day action standard", category: "Premium" },
];

const CATEGORIES = ["All", "Employment", "Family", "Student", "Travel", "Citizenship", "Premium"];

export default function ProcessingTimesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = DATA.filter(row => {
    const matchesSearch = !search ||
      row.form.toLowerCase().includes(search.toLowerCase()) ||
      row.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || row.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Clock className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">USCIS Processing Times</h1>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-sm">Open USCIS&apos;s live lookup for the estimate that matches your form, category, and office</p>
          <Badge variant="outline" className="text-xs gap-1.5">
            <RefreshCw className="h-3 w-3" /> Reviewed {LAST_REVIEWED}
          </Badge>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm text-blue-800 leading-relaxed">
        USCIS processing estimates change and the service-center location may not be accurate for every case. Use the official live tool at{" "}
        <a href={USCIS_PROCESSING_TIMES_URL} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
          USCIS processing times
        </a>{" "}
        and select the form, category, and office shown for your case.
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "OPT / I-765", time: "Live lookup", color: "text-green-600", bg: "bg-green-50" },
          { label: "H-1B / I-129", time: "Live lookup", color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "EB-2/3 / I-140", time: "Live lookup", color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Premium (eligible forms)", time: "15 business days", color: "text-blue-600", bg: "bg-blue-50" },
        ].map(s => (
          <Card key={s.label}>
            <CardContent className={`p-4 ${s.bg} rounded-lg`}>
              <p className={`text-xl font-black ${s.color}`}>{s.time}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search form or description..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card className="mb-6">
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-slate-50">
                <th className="text-left px-5 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Form</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Description</th>
                <th className="text-left px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">USCIS selection</th>
                <th className="text-center px-4 py-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground">Current estimate</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="px-5 py-3">
                    <span className="font-mono text-xs font-bold text-primary">{row.form}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs">{row.title}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{row.officeHint}</td>
                  <td className="px-4 py-3 text-center">
                    <a href={USCIS_PROCESSING_TIMES_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 hover:bg-blue-200">
                      Live on USCIS <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm">No results for &quot;{search}&quot;</div>
          )}
        </CardContent>
      </Card>

      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 flex gap-3">
        <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800">
          <p className="font-semibold">About these times</p>
          <p className="mt-1 text-xs text-blue-700 leading-5">
            USCIS says its online estimates are updated periodically and may reflect data that is already about a month old. Your actual wait may vary based on case complexity and RFEs. Premium processing (Form I-907) requires qualifying action within 15 business days for eligible filings; it does not guarantee approval.
          </p>
        </div>
      </div>
    </div>
  );
}
