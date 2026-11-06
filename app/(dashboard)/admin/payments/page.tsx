"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2, XCircle, Clock, DollarSign, Users,
  ImageIcon, Loader2, ExternalLink, ShieldAlert,
} from "lucide-react";
import { format, parseISO } from "date-fns";

interface Submission {
  id: string;
  email: string;
  clerk_id: string | null;
  plan_id: string;
  plan_name: string;
  amount: number;
  tx_note: string | null;
  screenshot_url: string | null;
  status: "pending" | "activated" | "rejected";
  created_at: string;
  activated_at: string | null;
}

const STATUS_CONFIG = {
  pending:   { label: "Pending",   color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  activated: { label: "Activated", color: "bg-green-100 text-green-700 border-green-200"   },
  rejected:  { label: "Rejected",  color: "bg-red-100 text-red-700 border-red-200"         },
};

export default function AdminPaymentsPage() {
  const { isLoaded } = useUser();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "activated" | "rejected">("pending");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    fetch("/api/admin/payments")
      .then(async r => {
        if (r.status === 403) { setAccessDenied(true); setLoading(false); return; }
        const d = await r.json();
        setSubmissions(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => { setSubmissions([]); setLoading(false); });
  }, [isLoaded]);

  async function handleAction(id: string, action: "activate" | "reject") {
    setActionLoading(id + action);
    const res = await fetch("/api/admin/payments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action }),
    });
    if (res.ok) {
      setSubmissions(prev => prev.map(s =>
        s.id === id
          ? { ...s, status: action === "activate" ? "activated" : "rejected", activated_at: action === "activate" ? new Date().toISOString() : null }
          : s
      ));
    }
    setActionLoading(null);
  }

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="p-8 flex flex-col items-center justify-center py-32 gap-3 text-center">
        <ShieldAlert className="h-10 w-10 text-red-400" />
        <p className="font-semibold text-lg">Access Denied</p>
        <p className="text-muted-foreground text-sm">This page is restricted to admins only.</p>
      </div>
    );
  }

  const filtered = filter === "all" ? submissions : submissions.filter(s => s.status === filter);
  const pending   = submissions.filter(s => s.status === "pending").length;
  const activated = submissions.filter(s => s.status === "activated").length;
  const revenue   = submissions.filter(s => s.status === "activated").reduce((a, s) => a + s.amount, 0);

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6 flex gap-2">
        <span className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold">Payments</span>
        <a href="/admin/form-submissions" className="px-3 py-1.5 rounded-lg border text-xs font-semibold text-muted-foreground hover:bg-accent transition-colors">Form Submissions</a>
      </div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Payment Submissions</h1>
        <p className="text-muted-foreground text-sm">Review and activate incoming plan purchases.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Pending Review", value: pending,   icon: Clock,        color: "text-yellow-600" },
          { label: "Activated",      value: activated, icon: CheckCircle2, color: "text-green-600"  },
          { label: "Total Revenue",  value: `$${revenue}`, icon: DollarSign, color: "text-blue-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`rounded-xl bg-slate-100 p-3 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5">
        {(["pending", "activated", "rejected", "all"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f} {f !== "all" && <span className="ml-1 opacity-60">{submissions.filter(s => s.status === f).length}</span>}
          </button>
        ))}
      </div>

      {/* Submissions list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No {filter === "all" ? "" : filter} submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(sub => (
            <Card key={sub.id} className={sub.status === "pending" ? "border-yellow-200 bg-yellow-50/30" : ""}>
              <CardContent className="p-5">
                {/* Header row */}
                <div className="flex items-start gap-4 flex-wrap">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-semibold text-sm">{sub.email}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_CONFIG[sub.status].color}`}>
                        {STATUS_CONFIG[sub.status].label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                      <span className="font-medium text-slate-700">{sub.plan_name}</span>
                      <span className="font-bold text-green-600">${sub.amount}</span>
                      <span>{format(parseISO(sub.created_at), "MMM d, yyyy · h:mm a")}</span>
                    </div>
                    {sub.tx_note && (
                      <p className="text-xs text-slate-500 mt-1 italic">&quot;{sub.tx_note}&quot;</p>
                    )}
                  </div>

                  {/* Actions */}
                  {sub.status === "pending" && (
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50 h-8"
                        disabled={!!actionLoading}
                        onClick={() => handleAction(sub.id, "reject")}
                      >
                        {actionLoading === sub.id + "reject"
                          ? <Loader2 className="h-3 w-3 animate-spin" />
                          : <XCircle className="h-3 w-3 mr-1" />}
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 h-8"
                        disabled={!!actionLoading}
                        onClick={() => handleAction(sub.id, "activate")}
                      >
                        {actionLoading === sub.id + "activate"
                          ? <Loader2 className="h-3 w-3 animate-spin" />
                          : <CheckCircle2 className="h-3 w-3 mr-1" />}
                        Activate
                      </Button>
                    </div>
                  )}
                  {sub.status === "activated" && (
                    <span className="text-xs text-green-600 font-medium shrink-0">
                      ✓ Activated {sub.activated_at ? format(parseISO(sub.activated_at), "MMM d") : ""}
                    </span>
                  )}
                </div>

                {/* Inline screenshot */}
                {sub.screenshot_url ? (
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" /> Payment screenshot
                    </p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sub.screenshot_url}
                      alt="Payment screenshot"
                      className="rounded-lg border max-h-56 object-contain cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setScreenshot(sub.screenshot_url)}
                    />
                    <button
                      onClick={() => setScreenshot(sub.screenshot_url)}
                      className="text-xs text-blue-600 hover:underline mt-1 flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" /> View full size
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                    <ImageIcon className="h-3.5 w-3.5" />
                    <span>No screenshot uploaded</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Screenshot lightbox */}
      {screenshot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setScreenshot(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={screenshot} alt="Payment screenshot" className="w-full rounded-2xl shadow-2xl" />
            <button
              onClick={() => setScreenshot(null)}
              className="absolute top-3 right-3 bg-black/50 text-white rounded-full h-8 w-8 flex items-center justify-center hover:bg-black/70 text-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
