"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { I864_QUESTIONS } from "@/lib/forms/i864";
import {
  FileText, Download, ChevronDown, ChevronUp, Loader2,
  CheckCircle2, Clock, Eye, RefreshCw, ShieldAlert, StickyNote,
} from "lucide-react";

type Status = "submitted" | "in_review" | "completed" | "delivered";

const STATUS_CONFIG: Record<Status, { label: string; color: string }> = {
  submitted:  { label: "Submitted",  color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  in_review:  { label: "In Review",  color: "bg-blue-100 text-blue-800 border-blue-200" },
  completed:  { label: "Completed",  color: "bg-purple-100 text-purple-800 border-purple-200" },
  delivered:  { label: "Delivered",  color: "bg-green-100 text-green-800 border-green-200" },
};

interface Submission {
  id: string;
  clerk_id: string;
  form_type: string;
  fields: Record<string, string>;
  user_email: string | null;
  user_name: string | null;
  status: Status;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

// Build ordered label → value pairs for display
function orderedFields(fields: Record<string, string>) {
  return I864_QUESTIONS
    .map(q => ({ label: q.label, part: q.part, value: fields[q.id] ?? "" }))
    .filter(r => r.value && r.value !== "");
}

// Generate CSV string from a submission
function toCSV(sub: Submission): string {
  const rows = [["Part", "Field", "Answer"]];
  for (const q of I864_QUESTIONS) {
    const val = sub.fields[q.id];
    if (val) rows.push([q.part, q.label, val]);
  }
  return rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
}

function downloadCSV(sub: Submission) {
  const csv = toCSV(sub);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `I-864-${sub.user_name?.replace(/\s+/g, "_") ?? sub.clerk_id.slice(0, 8)}-${sub.id.slice(0, 8)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadAllCSV(submissions: Submission[]) {
  const header = ["Submitted At", "User Name", "User Email", "Status", ...I864_QUESTIONS.map(q => q.label)];
  const rows = submissions.map(sub => [
    new Date(sub.created_at).toLocaleString(),
    sub.user_name ?? "",
    sub.user_email ?? "",
    sub.status,
    ...I864_QUESTIONS.map(q => sub.fields[q.id] ?? ""),
  ]);
  const csv = [header, ...rows]
    .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `I-864-all-submissions-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminFormSubmissionsPage() {
  const { isLoaded } = useUser();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/form-submissions");
      if (res.status === 403) {
        setAccessDenied(true);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data);
        const noteMap: Record<string, string> = {};
        for (const s of data) noteMap[s.id] = s.admin_notes ?? "";
        setNotes(noteMap);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (isLoaded) Promise.resolve().then(load); }, [isLoaded, load]);

  async function updateStatus(id: string, status: Status) {
    setSavingId(id);
    await fetch("/api/admin/form-submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    setSavingId(null);
  }

  async function saveNotes(id: string) {
    setSavingId(id);
    await fetch("/api/admin/form-submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, admin_notes: notes[id] ?? "" }),
    });
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, admin_notes: notes[id] } : s));
    setSavingId(null);
  }

  if (!isLoaded) return <div className="p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>;

  if (accessDenied) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-96 gap-4">
        <ShieldAlert className="h-12 w-12 text-red-400" />
        <p className="text-lg font-semibold text-red-600">Admin access required</p>
      </div>
    );
  }

  const counts = { total: submissions.length } as Record<string, number>;
  for (const s of submissions) counts[s.status] = (counts[s.status] ?? 0) + 1;

  return (
    <div className="p-8 max-w-7xl">
      {/* Admin nav */}
      <div className="mb-6 flex gap-2">
        <a href="/admin/payments" className="px-3 py-1.5 rounded-lg border text-xs font-semibold text-muted-foreground hover:bg-accent transition-colors">Payments</a>
        <span className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">Form Submissions</span>
      </div>

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">I-864 Form Submissions</h1>
            <p className="text-sm text-slate-500 mt-0.5">User answers saved automatically on completion</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium text-slate-600 hover:bg-slate-50">
            <RefreshCw className="h-3.5 w-3.5" /> Refresh
          </button>
          {submissions.length > 0 && (
            <button
              onClick={() => downloadAllCSV(submissions)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
            >
              <Download className="h-3.5 w-3.5" /> Export All CSV
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: counts.total ?? 0, color: "bg-slate-50 border-slate-200" },
          { label: "Submitted", value: counts.submitted ?? 0, color: "bg-yellow-50 border-yellow-200" },
          { label: "In Review", value: counts.in_review ?? 0, color: "bg-blue-50 border-blue-200" },
          { label: "Delivered", value: counts.delivered ?? 0, color: "bg-green-50 border-green-200" },
        ].map(stat => (
          <div key={stat.label} className={`p-4 rounded-xl border ${stat.color}`}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No submissions yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map(sub => {
            const isExpanded = expandedId === sub.id;
            const ordered = orderedFields(sub.fields);
            const cfg = STATUS_CONFIG[sub.status] ?? STATUS_CONFIG.submitted;
            const isSaving = savingId === sub.id;

            return (
              <div key={sub.id} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                {/* Row header */}
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-sm">{sub.user_name || "Unknown User"}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${cfg.color}`}>
                        {cfg.label}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{sub.form_type}</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {sub.user_email} · {new Date(sub.created_at).toLocaleString()} · {ordered.length} fields filled
                    </p>
                  </div>

                  {/* Status selector */}
                  <select
                    value={sub.status}
                    onChange={e => updateStatus(sub.id, e.target.value as Status)}
                    disabled={isSaving}
                    className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-blue-400"
                  >
                    {Object.entries(STATUS_CONFIG).map(([val, { label }]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => downloadCSV(sub)}
                      title="Download CSV"
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : sub.id)}
                      className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded: fields + notes */}
                {isExpanded && (
                  <div className="border-t border-slate-100">
                    {/* Quick preview — first 6 key fields */}
                    <div className="px-5 py-3 bg-slate-50 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2">
                      {[
                        { label: "Sponsor Name", value: [sub.fields.sponsor_given_name, sub.fields.sponsor_family_name].filter(Boolean).join(" ") },
                        { label: "Date of Birth", value: sub.fields.sponsor_dob },
                        { label: "SSN", value: sub.fields.sponsor_ssn ? "●●●-●●-" + sub.fields.sponsor_ssn.slice(-4) : "" },
                        { label: "Annual Income", value: sub.fields.annual_income },
                        { label: "Employment", value: sub.fields.employment_status },
                        { label: "Citizenship", value: sub.fields.sponsor_citizenship },
                      ].filter(f => f.value).map(f => (
                        <div key={f.label}>
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{f.label}</p>
                          <p className="text-xs font-medium text-slate-800">{f.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Full field table */}
                    <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                      {(() => {
                        let lastPart = "";
                        return ordered.map((row, i) => {
                          const partHeader = row.part !== lastPart;
                          lastPart = row.part;
                          return (
                            <div key={i}>
                              {partHeader && (
                                <div className="px-5 py-1.5 bg-slate-100 sticky top-0">
                                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{row.part}</p>
                                </div>
                              )}
                              <div className="flex px-5 py-2.5 hover:bg-slate-50">
                                <span className="w-64 shrink-0 text-xs text-slate-500">{row.label}</span>
                                <span className="text-xs font-medium text-slate-800">{row.value}</span>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>

                    {/* Admin notes */}
                    <div className="px-5 py-4 border-t border-slate-100 bg-white">
                      <div className="flex items-center gap-1.5 mb-2">
                        <StickyNote className="h-3.5 w-3.5 text-slate-400" />
                        <p className="text-xs font-semibold text-slate-500">Admin Notes</p>
                      </div>
                      <div className="flex gap-2">
                        <textarea
                          value={notes[sub.id] ?? ""}
                          onChange={e => setNotes(prev => ({ ...prev, [sub.id]: e.target.value }))}
                          placeholder="Add notes about this submission (your private notes only)..."
                          rows={2}
                          className="flex-1 text-xs border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 resize-none"
                        />
                        <button
                          onClick={() => saveNotes(sub.id)}
                          disabled={isSaving}
                          className="px-3 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 disabled:opacity-50 shrink-0"
                        >
                          {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="mt-8 p-4 rounded-xl bg-slate-50 border border-slate-200">
        <p className="text-xs font-semibold text-slate-500 mb-2">Workflow</p>
        <div className="flex flex-wrap gap-3">
          {[
            { icon: Clock, label: "Submitted — user just completed the form" },
            { icon: Eye, label: "In Review — you are working on it" },
            { icon: CheckCircle2, label: "Completed — form filled, ready to send" },
            { icon: Download, label: "Delivered — PDF sent to user" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-slate-500">
              <Icon className="h-3.5 w-3.5" /> {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
