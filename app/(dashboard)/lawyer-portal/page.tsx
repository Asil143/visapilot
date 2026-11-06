"use client";

import { useState } from "react";
import { Scale, CheckCircle2, AlertCircle, Users, BarChart3, Bell, Mail } from "lucide-react";

const PLANNED_FEATURES = [
  { icon: Users,    title: "Verified client leads",   desc: "Receive inquiries from pre-screened immigration users matched to your practice areas." },
  { icon: BarChart3, title: "Dashboard & analytics",  desc: "Track leads, consultations, and earnings in one place." },
  { icon: Bell,     title: "Smart notifications",     desc: "Get notified instantly when a client matches your specialty and urgency level." },
  { icon: Mail,     title: "Built-in messaging",      desc: "Communicate with clients securely through the platform." },
];

export default function LawyerPortalPage() {
  const [form, setForm] = useState({ name: "", email: "", bar: "", state: "", practice: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: "Attorney partner program interest",
          message: `Bar number: ${form.bar || "not provided"}\nState: ${form.state || "not provided"}\nPractice areas: ${form.practice || "not provided"}`,
        }),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setError("Something went wrong. Please email support@statusclock.com directly.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Scale className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold">Attorney Partner Portal</h1>
          <p className="text-muted-foreground text-sm">Join the StatusClock attorney network</p>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-4 mb-8 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-900 text-sm">Coming soon</p>
          <p className="text-xs text-amber-700 leading-5 mt-0.5">
            The attorney portal is in development. We&apos;re building the infrastructure to connect licensed immigration attorneys with pre-screened clients through StatusClock. Sign up below to be notified when it launches and to reserve early partner pricing.
          </p>
        </div>
      </div>

      {/* What's coming */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-slate-900 mb-5">What the portal will include</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {PLANNED_FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="h-9 w-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{title}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interest form */}
      <div className="rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-8 py-5 bg-slate-900">
          <h2 className="text-lg font-bold text-white">Express interest in joining</h2>
          <p className="text-xs text-slate-400 mt-1">We&apos;ll reach out before launch to discuss pricing and terms.</p>
        </div>

        <div className="p-8">
          {done ? (
            <div className="text-center py-6">
              <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-3" />
              <h3 className="font-bold text-slate-900 mb-1">Got it — thanks!</h3>
              <p className="text-sm text-slate-500">
                We&apos;ll email <strong>{form.email}</strong> before the portal launches.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Your name *</label>
                  <input required type="text" value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Attorney name"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Email *</label>
                  <input required type="email" value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@lawfirm.com"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Bar number (optional)</label>
                  <input type="text" value={form.bar}
                    onChange={e => setForm(f => ({ ...f, bar: e.target.value }))}
                    placeholder="State bar number"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Licensed state(s) (optional)</label>
                  <input type="text" value={form.state}
                    onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                    placeholder="e.g. NY, CA"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Primary practice areas (optional)</label>
                <input type="text" value={form.practice}
                  onChange={e => setForm(f => ({ ...f, practice: e.target.value }))}
                  placeholder="e.g. H-1B, EB-2 NIW, O-1, Green Cards"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading || !form.name || !form.email}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm transition-colors">
                {loading ? "Submitting…" : "Submit interest"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
