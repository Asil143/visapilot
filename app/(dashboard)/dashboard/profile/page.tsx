"use client";

import { useState, useEffect, useCallback } from "react";
import { formatDateShort } from "@/lib/utils/date";
import {
  User, Calendar, FileSearch, TrendingUp, Save, Plus, Trash2,
  CheckCircle2, AlertCircle, Clock, ShieldCheck, ChevronRight, Loader2,
} from "lucide-react";

const VISA_TYPES = [
  "F-1 Student", "OPT", "STEM OPT", "H-1B", "H-4", "J-1", "J-2",
  "L-1A", "L-1B", "L-2", "O-1A", "O-1B", "TN", "E-3",
  "Green Card (Pending I-485)", "Green Card (LPR)", "Other",
];

const COUNTRIES = [
  "India", "China", "Mexico", "Philippines", "Brazil", "Nigeria",
  "South Korea", "Pakistan", "Canada", "United Kingdom", "Other",
];

const GC_STAGES = ["Not started", "PERM in progress", "I-140 pending", "I-140 approved", "Waiting for Priority Date", "I-485 pending", "Approved"];
const GC_CATEGORIES = ["EB-1A (Extraordinary Ability)", "EB-1B (Outstanding Researcher)", "EB-1C (Multinational Manager)", "EB-2 (Advanced Degree)", "EB-2 NIW (National Interest Waiver)", "EB-3 (Skilled Worker)", "Family-based"];
const FORM_TYPES = ["I-765 (EAD)", "I-129 (H-1B/O-1/L-1)", "I-140 (Immigrant Petition)", "I-485 (Adjustment of Status)", "I-131 (Advance Parole)", "I-539 (Extension)", "DS-160 (Visa)", "Other"];

interface CaseEntry { id: string; receipt_number: string; form_type: string; label: string; last_status: string | null; last_checked_at: string | null; }

interface Profile {
  // Personal info (for form pre-fill)
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  ssn: string;
  mailingStreet: string;
  mailingCity: string;
  mailingState: string;
  mailingZip: string;
  phone: string;
  aNumber: string;
  // Immigration status
  visaType: string;
  countryOfBirth: string;
  employer: string;
  i94Expiry: string;
  i94IsDS: boolean;
  i20StartDate: string;
  i20EndDate: string;
  eadExpiry: string;
  visaStampExpiry: string;
  visaStartDate: string;
  passportExpiry: string;
  passportIssueDate: string;
  h1bStartDate: string;
  h1bExpiry: string;
  optStartDate: string;
  optEndDate: string;
  stemOptStartDate: string;
  stemOptEndDate: string;
  advanceParoleIssueDate: string;
  advanceParoleExpiry: string;
  i140ApprovalDate: string;
  h4EadIssueDate: string;
  h4EadExpiry: string;
  j1EndDate: string;
  tnStartDate: string;
  tnExpiry: string;
  l1StartDate: string;
  l1Expiry: string;
  permFilingDate: string;
  priorityDate: string;
  greenCardStage: string;
  greenCardCategory: string;
}

const empty: Profile = {
  firstName: "", lastName: "", middleName: "", dateOfBirth: "",
  ssn: "", mailingStreet: "", mailingCity: "", mailingState: "", mailingZip: "",
  phone: "", aNumber: "",
  visaType: "", countryOfBirth: "", employer: "",
  i94Expiry: "", i94IsDS: false, i20StartDate: "", i20EndDate: "",
  eadExpiry: "", visaStampExpiry: "", visaStartDate: "",
  passportExpiry: "", passportIssueDate: "",
  h1bStartDate: "", h1bExpiry: "",
  optStartDate: "", optEndDate: "",
  stemOptStartDate: "", stemOptEndDate: "",
  advanceParoleIssueDate: "", advanceParoleExpiry: "",
  i140ApprovalDate: "",
  h4EadIssueDate: "", h4EadExpiry: "",
  j1EndDate: "",
  tnStartDate: "", tnExpiry: "",
  l1StartDate: "", l1Expiry: "",
  permFilingDate: "",
  priorityDate: "", greenCardStage: "", greenCardCategory: "",
};

function fromApi(data: Record<string, string | null | boolean>): Profile {
  return {
    firstName: data.first_name as string ?? "",
    lastName: data.last_name as string ?? "",
    middleName: data.middle_name as string ?? "",
    dateOfBirth: data.date_of_birth as string ?? "",
    ssn: data.ssn as string ?? "",
    mailingStreet: data.mailing_street as string ?? "",
    mailingCity: data.mailing_city as string ?? "",
    mailingState: data.mailing_state as string ?? "",
    mailingZip: data.mailing_zip as string ?? "",
    phone: data.phone as string ?? "",
    aNumber: data.a_number as string ?? "",
    visaType: data.visa_type as string ?? "",
    countryOfBirth: data.country_of_birth as string ?? "",
    employer: data.employer as string ?? "",
    i94Expiry: data.i94_expiry as string ?? "",
    i94IsDS: (data.i94_is_ds as boolean) ?? false,
    i20StartDate: data.i20_start_date as string ?? "",
    i20EndDate: data.i20_end_date as string ?? "",
    eadExpiry: data.ead_expiry as string ?? "",
    visaStampExpiry: data.visa_stamp_expiry as string ?? "",
    visaStartDate: data.visa_start_date as string ?? "",
    passportExpiry: data.passport_expiry as string ?? "",
    passportIssueDate: data.passport_issue_date as string ?? "",
    h1bStartDate: data.h1b_start_date as string ?? "",
    h1bExpiry: data.h1b_expiry as string ?? "",
    optStartDate: data.opt_start_date as string ?? "",
    optEndDate: data.opt_end_date as string ?? "",
    stemOptStartDate: data.stem_opt_start_date as string ?? "",
    stemOptEndDate: data.stem_opt_end_date as string ?? "",
    advanceParoleIssueDate: data.advance_parole_issue_date as string ?? "",
    advanceParoleExpiry: data.advance_parole_expiry as string ?? "",
    i140ApprovalDate: data.i140_approval_date as string ?? "",
    h4EadIssueDate: data.h4_ead_issue_date as string ?? "",
    h4EadExpiry: data.h4_ead_expiry as string ?? "",
    j1EndDate: data.j1_end_date as string ?? "",
    tnStartDate: data.tn_start_date as string ?? "",
    tnExpiry: data.tn_expiry as string ?? "",
    l1StartDate: data.l1_start_date as string ?? "",
    l1Expiry: data.l1_expiry as string ?? "",
    permFilingDate: data.perm_filing_date as string ?? "",
    priorityDate: data.priority_date as string ?? "",
    greenCardStage: data.green_card_stage as string ?? "",
    greenCardCategory: data.green_card_category as string ?? "",
  };
}

function toApi(p: Profile) {
  return {
    first_name: p.firstName || null,
    last_name: p.lastName || null,
    middle_name: p.middleName || null,
    date_of_birth: p.dateOfBirth || null,
    ssn: p.ssn || null,
    mailing_street: p.mailingStreet || null,
    mailing_city: p.mailingCity || null,
    mailing_state: p.mailingState || null,
    mailing_zip: p.mailingZip || null,
    phone: p.phone || null,
    a_number: p.aNumber || null,
    visa_type: p.visaType || null,
    country_of_birth: p.countryOfBirth || null,
    employer: p.employer || null,
    i94_expiry: p.i94IsDS ? null : (p.i94Expiry || null),
    i94_is_ds: p.i94IsDS,
    i20_start_date: p.i20StartDate || null,
    i20_end_date: p.i20EndDate || null,
    ead_expiry: p.eadExpiry || null,
    visa_stamp_expiry: p.visaStampExpiry || null,
    visa_start_date: p.visaStartDate || null,
    passport_expiry: p.passportExpiry || null,
    passport_issue_date: p.passportIssueDate || null,
    h1b_start_date: p.h1bStartDate || null,
    h1b_expiry: p.h1bExpiry || null,
    opt_start_date: p.optStartDate || null,
    opt_end_date: p.optEndDate || null,
    stem_opt_start_date: p.stemOptStartDate || null,
    stem_opt_end_date: p.stemOptEndDate || null,
    advance_parole_issue_date: p.advanceParoleIssueDate || null,
    advance_parole_expiry: p.advanceParoleExpiry || null,
    i140_approval_date: p.i140ApprovalDate || null,
    h4_ead_issue_date: p.h4EadIssueDate || null,
    h4_ead_expiry: p.h4EadExpiry || null,
    j1_end_date: p.j1EndDate || null,
    tn_start_date: p.tnStartDate || null,
    tn_expiry: p.tnExpiry || null,
    l1_start_date: p.l1StartDate || null,
    l1_expiry: p.l1Expiry || null,
    perm_filing_date: p.permFilingDate || null,
    priority_date: p.priorityDate || null,
    green_card_stage: p.greenCardStage || null,
    green_card_category: p.greenCardCategory || null,
  };
}

function daysUntil(dateStr: string) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

function urgencyColor(days: number, threshold: number) {
  if (days <= threshold * 0.33) return { bg: "#fef2f2", text: "#dc2626", border: "#fecaca", label: "Critical" };
  if (days <= threshold * 0.66) return { bg: "#fff7ed", text: "#ea580c", border: "#fed7aa", label: "Warning" };
  return { bg: "#f0fdf4", text: "#16a34a", border: "#bbf7d0", label: "OK" };
}

const tabs = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "status", label: "Visa Status", icon: User },
  { id: "dates", label: "Key Dates", icon: Calendar },
  { id: "cases", label: "USCIS Cases", icon: FileSearch },
  { id: "greencard", label: "Green Card", icon: TrendingUp },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(empty);
  const [cases, setCases] = useState<CaseEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("status");
  const [newCase, setNewCase] = useState({ receipt: "", form: "", label: "" });
  const [addingCase, setAddingCase] = useState(false);
  const [checkingCase, setCheckingCase] = useState<string | null>(null);
  const [copiedCase, setCopiedCase] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [profileRes, casesRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/cases"),
      ]);
      if (profileRes.ok) {
        const data = await profileRes.json();
        if (data && !data.error) setProfile(fromApi(data));
      }
      if (casesRes.ok) {
        const data = await casesRes.json();
        if (Array.isArray(data)) setCases(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  function set(field: keyof Profile, value: string | boolean) {
    setProfile(p => ({ ...p, [field]: value }));
  }

  async function save() {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toApi(profile)),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  async function addCase() {
    if (!newCase.receipt || !newCase.form) return;
    setAddingCase(true);
    try {
      const res = await fetch("/api/cases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receipt_number: newCase.receipt, form_type: newCase.form, label: newCase.label }),
      });
      if (res.ok) {
        const data = await res.json();
        setCases(c => [data, ...c]);
        setNewCase({ receipt: "", form: "", label: "" });
      }
    } finally {
      setAddingCase(false);
    }
  }

  async function updateStatus(id: string, status: string) {
    setCheckingCase(id);
    try {
      const res = await fetch("/api/cases/check-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setCases(prev => prev.map(x => x.id === id ? { ...x, last_status: status, last_checked_at: new Date().toISOString() } : x));
      }
    } finally {
      setCheckingCase(null);
    }
  }

  async function removeCase(id: string) {
    await fetch("/api/cases", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setCases(c => c.filter(x => x.id !== id));
  }

  // Compute live alerts
  const dateAlerts = [
    { label: "I-94 Expiry", date: profile.i94Expiry, threshold: 60 },
    { label: "EAD / OPT Expiry", date: profile.eadExpiry, threshold: 90 },
    { label: "Visa Stamp Expiry", date: profile.visaStampExpiry, threshold: 60 },
    { label: "Passport Expiry", date: profile.passportExpiry, threshold: 180 },
  ]
    .filter(a => a.date)
    .map(a => ({ ...a, days: daysUntil(a.date)! }))
    .filter(a => a.days > 0)
    .sort((a, b) => a.days - b.days);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#2563eb" }} />
      </div>
    );
  }

  return (
    <div className="sc-profile sc-legacy-page p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Immigration Profile</h1>
          <p className="mt-1 text-sm" style={{ color: "#64748b" }}>
            Your personal immigration dashboard — we use this to give you personalized alerts and accurate answers.
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-70"
          style={{ backgroundColor: saved ? "#16a34a" : "#2563eb" }}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save Profile"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Form */}
        <div className="lg:col-span-2">
          {/* Tabs */}
          <div className="sc-profile-tabs flex gap-1 p-1 rounded-xl mb-6" style={{ backgroundColor: "#f1f5f9" }}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: activeTab === tab.id ? "#ffffff" : "transparent",
                    color: activeTab === tab.id ? "#1d4ed8" : "#64748b",
                    boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab: Personal Info */}
          {activeTab === "personal" && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}>
                <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 leading-relaxed">
                  This information is used to <strong>pre-fill USCIS forms</strong> like I-864, I-765, and I-485 automatically.
                  Your SSN is stored securely and never shared.
                </p>
              </div>

              {/* Legal Name */}
              <div className="p-5 rounded-2xl border" style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
                <h3 className="font-semibold mb-4 text-sm" style={{ color: "#0f172a" }}>Legal Name (as on your ID / Passport)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#475569" }}>First Name</label>
                    <input type="text" value={profile.firstName} onChange={e => set("firstName", e.target.value)}
                      placeholder="e.g. John" className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "#e2e8f0" }} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#475569" }}>Last Name</label>
                    <input type="text" value={profile.lastName} onChange={e => set("lastName", e.target.value)}
                      placeholder="e.g. Smith" className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "#e2e8f0" }} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#475569" }}>Middle Name <span style={{ color: "#94a3b8" }}>(if any)</span></label>
                    <input type="text" value={profile.middleName} onChange={e => set("middleName", e.target.value)}
                      placeholder="e.g. Michael" className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "#e2e8f0" }} />
                  </div>
                </div>
              </div>

              {/* Identity */}
              <div className="p-5 rounded-2xl border" style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
                <h3 className="font-semibold mb-4 text-sm" style={{ color: "#0f172a" }}>Identity</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#475569" }}>Date of Birth</label>
                    <input type="date" value={profile.dateOfBirth} onChange={e => set("dateOfBirth", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "#e2e8f0" }} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#475569" }}>Alien Registration Number (A-Number) <span style={{ color: "#94a3b8" }}>(if any)</span></label>
                    <input type="text" value={profile.aNumber} onChange={e => set("aNumber", e.target.value)}
                      placeholder="e.g. A-123456789" className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none font-mono" style={{ borderColor: "#e2e8f0" }} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#475569" }}>Social Security Number</label>
                    <input type="text" value={profile.ssn} onChange={e => set("ssn", e.target.value)}
                      placeholder="XXX-XX-XXXX" maxLength={11}
                      className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none font-mono" style={{ borderColor: "#e2e8f0" }} />
                    <p className="text-[10px] mt-1" style={{ color: "#94a3b8" }}>Used only to pre-fill Form I-864 and similar forms. Never shared with third parties.</p>
                  </div>
                </div>
              </div>

              {/* Mailing Address */}
              <div className="p-5 rounded-2xl border" style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
                <h3 className="font-semibold mb-4 text-sm" style={{ color: "#0f172a" }}>Mailing Address</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#475569" }}>Street Number and Name</label>
                    <input type="text" value={profile.mailingStreet} onChange={e => set("mailingStreet", e.target.value)}
                      placeholder="e.g. 123 Main St Apt 4B" className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "#e2e8f0" }} />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="col-span-2">
                      <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#475569" }}>City</label>
                      <input type="text" value={profile.mailingCity} onChange={e => set("mailingCity", e.target.value)}
                        placeholder="e.g. Houston" className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none" style={{ borderColor: "#e2e8f0" }} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#475569" }}>State</label>
                      <input type="text" value={profile.mailingState} onChange={e => set("mailingState", e.target.value.toUpperCase())}
                        placeholder="TX" maxLength={2} className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none uppercase font-mono" style={{ borderColor: "#e2e8f0" }} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#475569" }}>ZIP Code</label>
                      <input type="text" value={profile.mailingZip} onChange={e => set("mailingZip", e.target.value)}
                        placeholder="77001" maxLength={10} className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none font-mono" style={{ borderColor: "#e2e8f0" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="p-5 rounded-2xl border" style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
                <h3 className="font-semibold mb-4 text-sm" style={{ color: "#0f172a" }}>Contact</h3>
                <div>
                  <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#475569" }}>Daytime Phone Number</label>
                  <input type="tel" value={profile.phone} onChange={e => set("phone", e.target.value)}
                    placeholder="(713) 555-1234" className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none font-mono" style={{ borderColor: "#e2e8f0" }} />
                </div>
              </div>
            </div>
          )}

          {/* Tab: Visa Status */}
          {activeTab === "status" && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl border" style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
                <h3 className="font-semibold mb-4 text-sm" style={{ color: "#0f172a" }}>Current Immigration Status</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#475569" }}>Current Visa / Status</label>
                    <select
                      value={profile.visaType}
                      onChange={e => set("visaType", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                      style={{ borderColor: "#e2e8f0" }}
                    >
                      <option value="">Select visa type...</option>
                      {VISA_TYPES.map(v => <option key={v}>{v}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#475569" }}>Country of Birth</label>
                    <select
                      value={profile.countryOfBirth}
                      onChange={e => set("countryOfBirth", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                      style={{ borderColor: "#e2e8f0" }}
                    >
                      <option value="">Select country...</option>
                      {COUNTRIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#475569" }}>Current Employer / University</label>
                    <input
                      type="text"
                      value={profile.employer}
                      onChange={e => set("employer", e.target.value)}
                      placeholder="e.g. Google LLC / MIT"
                      className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                      style={{ borderColor: "#e2e8f0" }}
                    />
                  </div>
                </div>
              </div>

              {profile.visaType && (
                <div className="p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}>
                  <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Profile detected: {profile.visaType}</p>
                    <p className="text-xs text-blue-700 mt-0.5">
                      {profile.visaType === "STEM OPT"
                        ? "STEM OPT holders: make sure to fill in your EAD expiry and start STEM OPT date. Your I-983 training plan deadlines are critical."
                        : profile.visaType === "H-1B"
                        ? "H-1B holders: add your I-94 expiry and H-1B start date. If your employer sponsored a green card, add your priority date too."
                        : profile.visaType.includes("I-485")
                        ? "I-485 pending: Do NOT travel without Advance Parole. Add your priority date so we can monitor the visa bulletin for you."
                        : "Fill in your key dates so we can alert you before deadlines."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab: Key Dates */}
          {activeTab === "dates" && (
            <div className="space-y-4">
              {[
                {
                  section: "Passport",
                  color: "#eff6ff", border: "#bfdbfe", textColor: "#1d4ed8",
                  fields: [
                    { key: "passportIssueDate", label: "Issue Date", hint: "Date passport was issued", isExpiry: false },
                    { key: "passportExpiry", label: "Expiry Date", hint: "Must be valid 6+ months for re-entry", isExpiry: true },
                  ],
                },
                {
                  section: "Visa Stamp",
                  color: "#f5f3ff", border: "#ddd6fe", textColor: "#6d28d9",
                  fields: [
                    { key: "visaStartDate", label: "Valid From", hint: "Date your visa stamp became valid", isExpiry: false },
                    { key: "visaStampExpiry", label: "Expiry Date", hint: "Needed for re-entry after travel", isExpiry: true },
                  ],
                },
                {
                  section: "I-20 / F-1 Program",
                  color: "#ecfdf5", border: "#6ee7b7", textColor: "#065f46",
                  fields: [
                    { key: "i20StartDate", label: "Program Start Date", hint: "The start date on your I-20 form", isExpiry: false },
                    { key: "i20EndDate",   label: "Program End Date",   hint: "The program end date on your I-20 form", isExpiry: true  },
                  ],
                },
                {
                  section: "I-94 Authorized Stay",
                  color: "#fff7ed", border: "#fed7aa", textColor: "#c2410c",
                  fields: [],
                  custom: "i94",
                },
                {
                  section: "OPT",
                  color: "#f0fdf4", border: "#86efac", textColor: "#15803d",
                  fields: [
                    { key: "optStartDate", label: "Start Date", hint: "First day of OPT authorization", isExpiry: false },
                    { key: "optEndDate", label: "End Date", hint: "Last day of 12-month OPT period", isExpiry: true },
                  ],
                },
                {
                  section: "STEM OPT Extension",
                  color: "#faf5ff", border: "#d8b4fe", textColor: "#7c3aed",
                  fields: [
                    { key: "stemOptStartDate", label: "Start Date", hint: "First day of 24-month STEM extension", isExpiry: false },
                    { key: "stemOptEndDate", label: "End Date", hint: "Last day of 24-month STEM extension", isExpiry: true },
                  ],
                },
                {
                  section: "H-1B",
                  color: "#ecfeff", border: "#a5f3fc", textColor: "#0891b2",
                  fields: [
                    { key: "h1bStartDate", label: "Start Date", hint: "October 1 or approved H-1B start date", isExpiry: false },
                    { key: "h1bExpiry", label: "Expiry Date", hint: "End of your current H-1B approval period", isExpiry: true },
                  ],
                },
                {
                  section: "Advance Parole (I-131)",
                  color: "#fef2f2", border: "#fecaca", textColor: "#dc2626",
                  fields: [
                    { key: "advanceParoleIssueDate", label: "Issue Date", hint: "Date your Advance Parole was issued", isExpiry: false },
                    { key: "advanceParoleExpiry", label: "Expiry Date", hint: "Must return to US before this date", isExpiry: true },
                  ],
                },
                {
                  section: "H-4 EAD",
                  color: "#ecfeff", border: "#a5f3fc", textColor: "#0891b2",
                  fields: [
                    { key: "h4EadIssueDate", label: "Issue Date", hint: "Date your H-4 EAD card was issued", isExpiry: false },
                    { key: "h4EadExpiry", label: "Expiry Date", hint: "End of H-4 EAD work authorization", isExpiry: true },
                  ],
                },
                {
                  section: "J-1 / DS-2019",
                  color: "#fff7ed", border: "#fed7aa", textColor: "#c2410c",
                  fields: [
                    { key: "j1EndDate", label: "Program End Date", hint: "End date on your DS-2019 form", isExpiry: true },
                  ],
                },
                {
                  section: "TN Visa",
                  color: "#f0fdf4", border: "#86efac", textColor: "#15803d",
                  fields: [
                    { key: "tnStartDate", label: "Start Date", hint: "Date your TN was approved at the border", isExpiry: false },
                    { key: "tnExpiry", label: "Expiry Date", hint: "End of your current TN authorization", isExpiry: true },
                  ],
                },
                {
                  section: "L-1 Visa",
                  color: "#f5f3ff", border: "#ddd6fe", textColor: "#6d28d9",
                  fields: [
                    { key: "l1StartDate", label: "Start Date", hint: "Date your L-1 transfer began", isExpiry: false },
                    { key: "l1Expiry", label: "Expiry Date", hint: "End of your current L-1 approval", isExpiry: true },
                  ],
                },
                {
                  section: "Green Card",
                  color: "#fffbeb", border: "#fde68a", textColor: "#d97706",
                  fields: [
                    { key: "permFilingDate", label: "PERM Filing Date", hint: "Date your PERM labor certification was filed", isExpiry: false },
                    { key: "i140ApprovalDate", label: "I-140 Approval Date", hint: "Date USCIS approved your I-140 petition (permanent — no expiry)", isExpiry: false },
                    { key: "priorityDate", label: "Priority Date", hint: "Your place in the green card queue (usually PERM filing date)", isExpiry: false },
                  ],
                },
              ].map(({ section, color, border, textColor, fields, custom }) => (
                <div key={section} className="rounded-2xl border overflow-hidden" style={{ borderColor: border }}>
                  <div className="px-4 py-2.5" style={{ backgroundColor: color }}>
                    <p className="text-xs font-bold" style={{ color: textColor }}>{section}</p>
                  </div>
                  <div className="p-4" style={{ backgroundColor: "#ffffff" }}>
                    {/* Custom I-94 block */}
                    {custom === "i94" && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => set("i94IsDS", true)}
                            className="flex-1 py-2 rounded-lg text-xs font-semibold border-2 transition-all"
                            style={{
                              backgroundColor: profile.i94IsDS ? "#fff7ed" : "#ffffff",
                              borderColor: profile.i94IsDS ? "#c2410c" : "#e2e8f0",
                              color: profile.i94IsDS ? "#c2410c" : "#64748b",
                            }}
                          >
                            D/S — Duration of Status
                          </button>
                          <button
                            onClick={() => set("i94IsDS", false)}
                            className="flex-1 py-2 rounded-lg text-xs font-semibold border-2 transition-all"
                            style={{
                              backgroundColor: !profile.i94IsDS ? "#fff7ed" : "#ffffff",
                              borderColor: !profile.i94IsDS ? "#c2410c" : "#e2e8f0",
                              color: !profile.i94IsDS ? "#c2410c" : "#64748b",
                            }}
                          >
                            Specific Date
                          </button>
                        </div>
                        {profile.i94IsDS ? (
                          <div className="p-3 rounded-xl text-xs" style={{ backgroundColor: "#fff7ed", border: "1px solid #fed7aa" }}>
                            <p className="font-semibold text-orange-800">D/S — you can stay as long as you maintain your status</p>
                            <p className="text-orange-700 mt-1">Common for F-1, J-1 visa holders. Your I-20 end date is your real deadline.</p>
                          </div>
                        ) : (
                          <div>
                            <label className="text-xs font-semibold mb-1 block" style={{ color: "#475569" }}>Expiry Date</label>
                            <input
                              type="date"
                              value={profile.i94Expiry}
                              onChange={e => set("i94Expiry", e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                              style={{ borderColor: "#e2e8f0" }}
                            />
                            <p className="text-[10px] mt-1" style={{ color: "#94a3b8" }}>Check at i94.cbp.dhs.gov</p>
                            {profile.i94Expiry && daysUntil(profile.i94Expiry) !== null && (
                              <p className="text-[10px] font-semibold mt-0.5" style={{ color: daysUntil(profile.i94Expiry)! < 60 ? "#dc2626" : "#16a34a" }}>
                                {daysUntil(profile.i94Expiry)! > 0 ? `${daysUntil(profile.i94Expiry)} days remaining` : "EXPIRED"}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    {/* Standard fields */}
                    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${custom === "i94" ? "hidden" : ""}`}>
                      {fields.map(({ key, label, hint, isExpiry }) => {
                        const val = profile[key as keyof Profile] as string;
                        const days = daysUntil(val);
                        return (
                          <div key={key}>
                            <label className="text-xs font-semibold mb-1 block" style={{ color: "#475569" }}>{label}</label>
                            <input
                              type="date"
                              value={val}
                              onChange={e => set(key as keyof Profile, e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                              style={{ borderColor: "#e2e8f0" }}
                            />
                            <p className="text-[10px] mt-1" style={{ color: "#94a3b8" }}>{hint}</p>
                            {isExpiry && days !== null && days > 0 && (
                              <p className="text-[10px] font-semibold mt-0.5" style={{ color: days < 60 ? "#dc2626" : days < 180 ? "#ea580c" : "#16a34a" }}>
                                {days} days remaining
                              </p>
                            )}
                            {isExpiry && days !== null && days <= 0 && (
                              <p className="text-[10px] font-bold mt-0.5 text-red-600">EXPIRED</p>
                            )}
                            {!isExpiry && val && (
                              <p className="text-[10px] font-semibold mt-0.5" style={{ color: "#64748b" }}>
                                {days !== null && days < 0 ? `${Math.abs(days)} days ago` : days === 0 ? "Today" : `In ${days} days`}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab: USCIS Cases */}
          {activeTab === "cases" && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl border" style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
                <h3 className="font-semibold mb-1 text-sm" style={{ color: "#0f172a" }}>Pending USCIS Cases</h3>
                <p className="text-xs mb-4" style={{ color: "#64748b" }}>Add your receipt numbers — StatusClock will monitor status changes and alert you.</p>

                <div className="space-y-3 mb-5">
                  {cases.length === 0 && (
                    <div className="text-center py-6 rounded-xl" style={{ backgroundColor: "#f8fafc", border: "1px dashed #e2e8f0" }}>
                      <FileSearch className="h-8 w-8 mx-auto mb-2" style={{ color: "#cbd5e1" }} />
                      <p className="text-sm font-medium" style={{ color: "#94a3b8" }}>No cases added yet</p>
                    </div>
                  )}
                  {cases.map(c => {
                    const isSaving = checkingCase === c.id;
                    const status = c.last_status;
                    const isApproved = status?.toLowerCase().includes("approved") || status?.toLowerCase().includes("card was mailed");
                    const isDenied = status?.toLowerCase().includes("denied") || status?.toLowerCase().includes("rejected");
                    const isRFE = status?.toLowerCase().includes("evidence");
                    return (
                      <div key={c.id} className="p-3 rounded-xl border" style={{ borderColor: "#e2e8f0" }}>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-mono font-medium">{c.receipt_number}</p>
                            <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{c.form_type}{c.label ? ` · ${c.label}` : ""}</p>
                          </div>
                          <button
                            onClick={async () => {
                              await navigator.clipboard.writeText(c.receipt_number);
                              setCopiedCase(c.id);
                              setTimeout(() => setCopiedCase(null), 3000);
                              window.open("https://egov.uscis.gov/casestatus/mycasestatus.do", "_blank");
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                            style={{ backgroundColor: copiedCase === c.id ? "#f0fdf4" : "#eff6ff", color: copiedCase === c.id ? "#15803d" : "#2563eb" }}
                          >
                            {copiedCase === c.id ? "✓ Copied! Paste on USCIS" : "Check on USCIS ↗"}
                          </button>
                          <button onClick={() => removeCase(c.id)} className="text-red-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Manual status update */}
                        <div className="mt-2 flex items-center gap-2">
                          <select
                            value={status ?? ""}
                            onChange={e => e.target.value && updateStatus(c.id, e.target.value)}
                            disabled={isSaving}
                            className="flex-1 px-2 py-1.5 rounded-lg border text-xs focus:outline-none"
                            style={{ borderColor: "#e2e8f0", color: status ? "#0f172a" : "#94a3b8" }}
                          >
                            <option value="">— Update status manually —</option>
                            <option>Case Was Received</option>
                            <option>Fingerprint Fee Was Received</option>
                            <option>Case Is Being Actively Reviewed</option>
                            <option>Request for Evidence Was Sent</option>
                            <option>Response to RFE Was Received</option>
                            <option>Interview Was Scheduled</option>
                            <option>Case Was Approved</option>
                            <option>Card Was Mailed To Me</option>
                            <option>Card Was Picked Up By USPS</option>
                            <option>Case Was Denied</option>
                            <option>Case Was Rejected</option>
                            <option>Case Was Transferred</option>
                            <option>Case Was Closed</option>
                          </select>
                          {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" style={{ color: "#2563eb" }} />}
                        </div>

                        {status && (
                          <div className="mt-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                            style={{
                              backgroundColor: isApproved ? "#f0fdf4" : isDenied ? "#fef2f2" : isRFE ? "#fff7ed" : "#f8fafc",
                              color: isApproved ? "#15803d" : isDenied ? "#dc2626" : isRFE ? "#c2410c" : "#475569",
                            }}>
                            {status}
                            {c.last_checked_at && (
                              <span className="ml-2 font-normal" style={{ color: "#94a3b8" }}>
                                · updated {new Date(c.last_checked_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="border rounded-xl p-4" style={{ borderColor: "#e2e8f0", backgroundColor: "#f8fafc" }}>
                  <p className="text-xs font-semibold mb-3" style={{ color: "#475569" }}>Add New Case</p>
                  <div className="grid grid-cols-1 gap-2 mb-3">
                    <input
                      type="text"
                      value={newCase.receipt}
                      onChange={e => setNewCase(n => ({ ...n, receipt: e.target.value.toUpperCase() }))}
                      placeholder="Receipt number (e.g. IOE0912345678)"
                      className="w-full px-3 py-2 rounded-lg border text-sm font-mono focus:outline-none"
                      style={{ borderColor: "#e2e8f0" }}
                    />
                    <div className="flex gap-2">
                      <select
                        value={newCase.form}
                        onChange={e => setNewCase(n => ({ ...n, form: e.target.value }))}
                        className="flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none"
                        style={{ borderColor: "#e2e8f0" }}
                      >
                        <option value="">Form type...</option>
                        {FORM_TYPES.map(f => <option key={f}>{f}</option>)}
                      </select>
                      <input
                        type="text"
                        value={newCase.label}
                        onChange={e => setNewCase(n => ({ ...n, label: e.target.value }))}
                        placeholder="Label (optional)"
                        className="flex-1 px-3 py-2 rounded-lg border text-sm focus:outline-none"
                        style={{ borderColor: "#e2e8f0" }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={addCase}
                    disabled={!newCase.receipt || !newCase.form || addingCase}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-40"
                    style={{ backgroundColor: "#2563eb" }}
                  >
                    {addingCase ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    Add Case
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Green Card */}
          {activeTab === "greencard" && (
            <div className="space-y-5">
              <div className="p-5 rounded-2xl border" style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
                <h3 className="font-semibold mb-4 text-sm" style={{ color: "#0f172a" }}>Green Card Journey</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#475569" }}>Current Stage</label>
                    <select
                      value={profile.greenCardStage}
                      onChange={e => set("greenCardStage", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                      style={{ borderColor: "#e2e8f0" }}
                    >
                      <option value="">Select stage...</option>
                      {GC_STAGES.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1.5 block" style={{ color: "#475569" }}>Green Card Category</label>
                    <select
                      value={profile.greenCardCategory}
                      onChange={e => set("greenCardCategory", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border text-sm focus:outline-none"
                      style={{ borderColor: "#e2e8f0" }}
                    >
                      <option value="">Select category...</option>
                      {GC_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {profile.greenCardStage && profile.greenCardStage !== "Not started" && (
                  <div className="mt-6">
                    <p className="text-xs font-semibold mb-3" style={{ color: "#475569" }}>Journey Progress</p>
                    <div className="flex items-center gap-0">
                      {GC_STAGES.filter(s => s !== "Not started").map((stage, i, arr) => {
                        const currentIndex = arr.indexOf(profile.greenCardStage);
                        const isCompleted = i < currentIndex;
                        const isCurrent = i === currentIndex;
                        return (
                          <div key={stage} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                              <div
                                className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                                style={{
                                  backgroundColor: isCompleted ? "#16a34a" : isCurrent ? "#2563eb" : "#e2e8f0",
                                  color: isCompleted || isCurrent ? "#ffffff" : "#94a3b8",
                                }}
                              >
                                {isCompleted ? "✓" : i + 1}
                              </div>
                              <p className="text-[9px] text-center mt-1 max-w-12 leading-tight" style={{ color: isCurrent ? "#2563eb" : "#94a3b8" }}>
                                {stage.replace(" in progress", "").replace(" pending", "").replace(" approved", "")}
                              </p>
                            </div>
                            {i < arr.length - 1 && (
                              <div className="flex-1 h-0.5 mx-1" style={{ backgroundColor: isCompleted ? "#16a34a" : "#e2e8f0" }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {profile.countryOfBirth === "India" && profile.greenCardCategory?.includes("EB-2") && (
                  <div className="mt-5 p-4 rounded-xl" style={{ backgroundColor: "#fff7ed", border: "1px solid #fed7aa" }}>
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-orange-900">India EB-2 Backlog Alert</p>
                        <p className="text-xs text-orange-700 mt-1">The India EB-2 queue has an estimated wait of 50+ years at current rates. Consider exploring EB-1A or EB-1C paths which have no per-country backlog.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Live preview */}
        <div className="space-y-4">
          {/* Completion status */}
          <div className="p-4 rounded-2xl border" style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
            <p className="text-xs font-semibold mb-3" style={{ color: "#475569" }}>Profile Completeness</p>
            {[
              { label: "Full name saved", done: !!(profile.firstName && profile.lastName) },
              { label: "Date of birth", done: !!profile.dateOfBirth },
              { label: "Mailing address", done: !!(profile.mailingStreet && profile.mailingCity) },
              { label: "Visa type set", done: !!profile.visaType },
              { label: "At least one key date", done: !!(profile.i94Expiry || profile.eadExpiry || profile.passportExpiry) },
              { label: "Case number added", done: cases.length > 0 },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2 mb-2">
                {item.done
                  ? <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  : <div className="h-4 w-4 rounded-full border-2 shrink-0" style={{ borderColor: "#e2e8f0" }} />}
                <span className="text-xs" style={{ color: item.done ? "#0f172a" : "#94a3b8" }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Live deadline alerts */}
          <div className="p-4 rounded-2xl border" style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
            <p className="text-xs font-semibold mb-3" style={{ color: "#475569" }}>Your Active Alerts</p>
            {dateAlerts.length === 0 ? (
              <p className="text-xs text-center py-4" style={{ color: "#94a3b8" }}>Add key dates to see alerts here</p>
            ) : (
              <div className="space-y-2">
                {dateAlerts.map(alert => {
                  const style = urgencyColor(alert.days, alert.threshold);
                  return (
                    <div key={alert.label} className="p-3 rounded-xl" style={{ backgroundColor: style.bg, border: `1px solid ${style.border}` }}>
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold" style={{ color: style.text }}>{alert.label}</p>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: style.text + "20", color: style.text }}>
                          {alert.days}d
                        </span>
                      </div>
                      <p className="text-[10px] mt-0.5" style={{ color: style.text + "cc" }}>{style.label} — {formatDateShort(alert.date)}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cases being monitored */}
          {cases.length > 0 && (
            <div className="p-4 rounded-2xl border" style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
              <p className="text-xs font-semibold mb-3" style={{ color: "#475569" }}>Monitored Cases ({cases.length})</p>
              {cases.map(c => (
                <div key={c.id} className="flex items-center gap-2 mb-2">
                  <Clock className="h-3.5 w-3.5 shrink-0" style={{ color: "#2563eb" }} />
                  <div>
                    <p className="text-xs font-mono">{c.receipt_number}</p>
                    <p className="text-[10px]" style={{ color: "#94a3b8" }}>{c.form_type}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* AI tip based on visa */}
          {profile.visaType && (
            <div className="p-4 rounded-2xl" style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}>
              <p className="text-xs font-bold text-white mb-1">AI Insight for {profile.visaType}</p>
              <p className="text-xs text-white/80 leading-relaxed">
                {profile.visaType === "STEM OPT"
                  ? "STEM OPT holders must submit I-983 training plan within 10 days of job start and every 6 months. File H-1B lottery in March — this may be your last chance."
                  : profile.visaType === "OPT"
                  ? "OPT has a 90-day unemployment limit. Track every gap. Apply for STEM OPT extension before OPT expires if your degree qualifies."
                  : profile.visaType === "H-1B"
                  ? "H-1B can be extended beyond 6 years if your I-140 was approved 365+ days ago (AC21). Ask your employer about starting the green card process early."
                  : profile.visaType.includes("I-485")
                  ? "Never leave the US without Advance Parole while I-485 is pending. File I-131 now if you haven't. Check the visa bulletin monthly — your priority date matters."
                  : "Keep all immigration documents stored in your Document Vault. Set up alerts for expiring documents at least 90 days in advance."}
              </p>
              <a href="/ai-assistant" className="mt-3 flex items-center gap-1 text-xs font-semibold text-white/90 hover:text-white">
                Ask AI a question <ChevronRight className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
