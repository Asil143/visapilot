"use client";

import { useState, useMemo } from "react";
import { Search, Building2, MapPin } from "lucide-react";

const employers = [
  { name: "Amazon", industry: "Technology", city: "Seattle, WA", h1bFiled: 12400, approvalRate: 97.2, avgSalary: 165000, capExempt: false, topRoles: ["SDE", "TPM", "Data Scientist"], tier: "platinum" },
  { name: "Google (Alphabet)", industry: "Technology", city: "Mountain View, CA", h1bFiled: 10200, approvalRate: 98.1, avgSalary: 185000, capExempt: false, topRoles: ["Software Engineer", "Research Scientist", "Product Manager"], tier: "platinum" },
  { name: "Microsoft", industry: "Technology", city: "Redmond, WA", h1bFiled: 9800, approvalRate: 97.8, avgSalary: 172000, capExempt: false, topRoles: ["Software Engineer", "Cloud Architect", "PM"], tier: "platinum" },
  { name: "Meta", industry: "Technology", city: "Menlo Park, CA", h1bFiled: 6700, approvalRate: 96.4, avgSalary: 190000, capExempt: false, topRoles: ["Software Engineer", "Research Scientist", "Data Engineer"], tier: "platinum" },
  { name: "Apple", industry: "Technology", city: "Cupertino, CA", h1bFiled: 5900, approvalRate: 95.7, avgSalary: 178000, capExempt: false, topRoles: ["Software Engineer", "Hardware Engineer", "ML Engineer"], tier: "gold" },
  { name: "Infosys", industry: "IT Services", city: "Multiple US cities", h1bFiled: 28700, approvalRate: 94.1, avgSalary: 92000, capExempt: false, topRoles: ["Software Developer", "Business Analyst", "Consultant"], tier: "gold" },
  { name: "Tata Consultancy Services", industry: "IT Services", city: "Multiple US cities", h1bFiled: 21300, approvalRate: 93.8, avgSalary: 88000, capExempt: false, topRoles: ["Software Developer", "SAP Consultant", "Java Developer"], tier: "gold" },
  { name: "Wipro", industry: "IT Services", city: "Multiple US cities", h1bFiled: 14200, approvalRate: 92.6, avgSalary: 86000, capExempt: false, topRoles: ["Software Developer", "QA Engineer", "Data Analyst"], tier: "gold" },
  { name: "Cognizant", industry: "IT Services", city: "Teaneck, NJ", h1bFiled: 17800, approvalRate: 91.9, avgSalary: 90000, capExempt: false, topRoles: ["Software Developer", "Project Manager", "Business Analyst"], tier: "gold" },
  { name: "Deloitte", industry: "Consulting", city: "New York, NY", h1bFiled: 5200, approvalRate: 95.3, avgSalary: 128000, capExempt: false, topRoles: ["Consultant", "Tech Advisor", "Data Analyst"], tier: "gold" },
  { name: "MIT", industry: "University", city: "Cambridge, MA", h1bFiled: 890, approvalRate: 99.1, avgSalary: 95000, capExempt: true, topRoles: ["Research Scientist", "Postdoc", "Engineer"], tier: "cap-exempt" },
  { name: "Stanford University", industry: "University", city: "Stanford, CA", h1bFiled: 720, approvalRate: 98.9, avgSalary: 98000, capExempt: true, topRoles: ["Research Scientist", "Lecturer", "Postdoc"], tier: "cap-exempt" },
  { name: "Johns Hopkins", industry: "University", city: "Baltimore, MD", h1bFiled: 650, approvalRate: 98.7, avgSalary: 92000, capExempt: true, topRoles: ["Research Scientist", "Physician", "Postdoc"], tier: "cap-exempt" },
  { name: "JPMorgan Chase", industry: "Finance", city: "New York, NY", h1bFiled: 4800, approvalRate: 94.8, avgSalary: 155000, capExempt: false, topRoles: ["Software Engineer", "Quant Analyst", "Data Scientist"], tier: "gold" },
  { name: "Goldman Sachs", industry: "Finance", city: "New York, NY", h1bFiled: 3100, approvalRate: 95.2, avgSalary: 168000, capExempt: false, topRoles: ["Technology Analyst", "Quantitative Strategist", "Software Engineer"], tier: "gold" },
  { name: "Salesforce", industry: "Technology", city: "San Francisco, CA", h1bFiled: 2900, approvalRate: 96.1, avgSalary: 162000, capExempt: false, topRoles: ["Software Engineer", "Solutions Engineer", "Product Manager"], tier: "gold" },
  { name: "IBM", industry: "Technology", city: "Armonk, NY", h1bFiled: 6800, approvalRate: 93.4, avgSalary: 118000, capExempt: false, topRoles: ["Software Engineer", "Cloud Consultant", "Data Scientist"], tier: "gold" },
  { name: "Intel", industry: "Semiconductors", city: "Santa Clara, CA", h1bFiled: 3800, approvalRate: 96.8, avgSalary: 148000, capExempt: false, topRoles: ["Hardware Engineer", "Software Engineer", "Process Engineer"], tier: "gold" },
  { name: "Nvidia", industry: "Semiconductors", city: "Santa Clara, CA", h1bFiled: 2600, approvalRate: 97.4, avgSalary: 198000, capExempt: false, topRoles: ["ML Engineer", "GPU Engineer", "Software Engineer"], tier: "platinum" },
  { name: "Tesla", industry: "Automotive/Tech", city: "Austin, TX", h1bFiled: 2200, approvalRate: 94.6, avgSalary: 145000, capExempt: false, topRoles: ["Software Engineer", "Hardware Engineer", "Manufacturing Engineer"], tier: "gold" },
];

const industries = ["All Industries", "Technology", "IT Services", "Consulting", "University", "Finance", "Semiconductors", "Automotive/Tech"];
const tierColors: Record<string, { bg: string; color: string; label: string }> = {
  platinum: { bg: "#f5f3ff", color: "#6d28d9", label: "Platinum Sponsor" },
  gold: { bg: "#fffbeb", color: "#d97706", label: "Top Sponsor" },
  "cap-exempt": { bg: "#f0fdf4", color: "#15803d", label: "Cap-Exempt" },
};

export default function EmployerLookupPage() {
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("All Industries");
  const [capExemptOnly, setCapExemptOnly] = useState(false);
  const [sortBy, setSortBy] = useState<"h1bFiled" | "approvalRate" | "avgSalary">("h1bFiled");

  const filtered = useMemo(() => {
    return employers
      .filter((e) => {
        const q = search.toLowerCase();
        const matchesSearch = !q || e.name.toLowerCase().includes(q) || e.city.toLowerCase().includes(q) || e.topRoles.some((r) => r.toLowerCase().includes(q));
        const matchesIndustry = industry === "All Industries" || e.industry === industry;
        const matchesCap = !capExemptOnly || e.capExempt;
        return matchesSearch && matchesIndustry && matchesCap;
      })
      .sort((a, b) => b[sortBy] - a[sortBy]);
  }, [search, industry, capExemptOnly, sortBy]);

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>

      <section className="py-14" style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%)" }}>
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: "#dcfce7", color: "#15803d" }}>
            <Building2 className="h-4 w-4" />
            H-1B Data · FY2024
          </div>
          <h1 className="text-4xl font-bold mb-3">H-1B Employer Sponsorship Lookup</h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#64748b" }}>
            Illustrative snapshot of well-known H-1B sponsors — approval rates, salary bands, and common roles.
          </p>
          <p className="text-xs mt-3 max-w-lg mx-auto" style={{ color: "#64748b" }}>
            Sample data based on FY2024 USCIS / DOL public filings. Figures are rounded and not a live LCA search.
            Confirm current sponsorship with the employer and official DOL disclosure files.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Search company, city, or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm focus:outline-none"
              style={{ borderColor: "#e2e8f0" }}
            />
          </div>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm focus:outline-none"
            style={{ borderColor: "#e2e8f0" }}
          >
            {industries.map((i) => <option key={i}>{i}</option>)}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="px-3 py-2 rounded-lg border text-sm focus:outline-none"
            style={{ borderColor: "#e2e8f0" }}
          >
            <option value="h1bFiled">Sort: Most H-1Bs Filed</option>
            <option value="approvalRate">Sort: Highest Approval Rate</option>
            <option value="avgSalary">Sort: Highest Salary</option>
          </select>
          <label className="flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm" style={{ borderColor: "#e2e8f0" }}>
            <input type="checkbox" checked={capExemptOnly} onChange={(e) => setCapExemptOnly(e.target.checked)} />
            Cap-exempt only
          </label>
        </div>

        <p className="text-sm mb-4" style={{ color: "#94a3b8" }}>{filtered.length} employers found</p>

        {/* Results */}
        <div className="space-y-3">
          {filtered.map((emp) => {
            const tier = tierColors[emp.tier];
            return (
              <div key={emp.name} className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center gap-4" style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center font-bold text-lg shrink-0" style={{ backgroundColor: tier.bg, color: tier.color }}>
                    {emp.name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm">{emp.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: tier.bg, color: tier.color }}>{tier.label}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" style={{ color: "#94a3b8" }} />
                      <span className="text-xs" style={{ color: "#64748b" }}>{emp.city} · {emp.industry}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {emp.topRoles.map((r) => (
                        <span key={r} className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "#f1f5f9", color: "#64748b" }}>{r}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-6 shrink-0">
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-600">{emp.h1bFiled.toLocaleString()}</p>
                    <p className="text-[10px]" style={{ color: "#94a3b8" }}>H-1Bs filed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">{emp.approvalRate}%</p>
                    <p className="text-[10px]" style={{ color: "#94a3b8" }}>Approval rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold" style={{ color: "#0f172a" }}>${(emp.avgSalary / 1000).toFixed(0)}k</p>
                    <p className="text-[10px]" style={{ color: "#94a3b8" }}>Avg salary</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-4 rounded-xl text-center" style={{ backgroundColor: "#f8fafc" }}>
          <p className="text-sm font-medium mb-1">Want to know if your target company sponsors H-1B?</p>
          <p className="text-xs mb-3" style={{ color: "#64748b" }}>Ask our AI assistant for a detailed sponsorship analysis for any employer.</p>
          <a href="/ai-assistant" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: "#2563eb" }}>
            Ask AI Assistant →
          </a>
        </div>
      </div>

    </div>
  );
}
