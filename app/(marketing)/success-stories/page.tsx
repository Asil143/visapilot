"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Star, ArrowRight, GraduationCap, Briefcase, Globe, TrendingUp,
  CheckCircle2, AlertCircle, MessageSquare,
} from "lucide-react";

const PATHS = [
  { icon: GraduationCap, color: "bg-blue-50 text-blue-700 border-blue-100",   label: "F-1 → OPT → H-1B",    desc: "The most common international student path to US employment authorization." },
  { icon: TrendingUp,    color: "bg-purple-50 text-purple-700 border-purple-100", label: "H-1B → Green Card",  desc: "Employer-sponsored EB-2/EB-3, or self-petition via EB-1A or EB-2 NIW." },
  { icon: Globe,         color: "bg-emerald-50 text-emerald-700 border-emerald-100", label: "OPT → STEM OPT", desc: "24-month extension for STEM degree holders with E-Verify employers." },
  { icon: Briefcase,     color: "bg-amber-50 text-amber-700 border-amber-100",  label: "TN / L-1 → Green Card", desc: "Alternative paths for Canadian/Mexican nationals and intracompany transferees." },
];

export default function SuccessStoriesPage() {
  const [form, setForm] = useState({ name: "", email: "", path: "", story: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.story) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: `Success story submission — ${form.path || "visa journey"}`,
          message: `Path: ${form.path || "not specified"}\n\n${form.story}`,
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
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <section className="py-20 border-b bg-gradient-to-b from-amber-50 to-white">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <div className="inline-flex items-center gap-1 mb-5">
            {[1,2,3,4,5].map(s => <Star key={s} className="h-5 w-5 fill-amber-400 text-amber-400" />)}
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Immigration success stories
          </h1>
          <p className="text-lg text-slate-500 leading-7">
            StatusClock is early — we don&apos;t yet have a library of verified user stories to share.
            If our tools helped you navigate your immigration journey, we&apos;d love to feature you.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-4xl space-y-16">

        {/* Common paths */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-2">Common paths we help with</h2>
          <p className="text-sm text-center text-slate-500 mb-10">
            These are the journeys StatusClock is built to support — checklists, deadline tracking, AI guidance, and attorney connections.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {PATHS.map(({ icon: Icon, color, label, desc }) => (
              <div key={label} className={`flex items-start gap-4 p-5 rounded-2xl border ${color}`}>
                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shrink-0 border">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">{label}</p>
                  <p className="text-xs opacity-80 leading-5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/guides" className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline">
              Browse all visa guides <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Share your story */}
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-8 py-6 bg-slate-900">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Share your immigration story
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Did StatusClock help you navigate a tricky immigration situation? Tell us — we&apos;ll reach out to feature your story (with your permission).
              </p>
            </div>

            <div className="p-8">
              {done ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Thank you!</h3>
                  <p className="text-sm text-slate-500 leading-6">
                    We&apos;ll review your submission and reach out to <strong>{form.email}</strong> if we&apos;d like to feature your story.
                    We&apos;ll never publish anything without your explicit permission.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Your name *</label>
                      <input
                        required type="text" value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="First name or full name"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Email *</label>
                      <input
                        required type="email" value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="you@email.com"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Visa path (optional)</label>
                    <input
                      type="text" value={form.path}
                      onChange={e => setForm(f => ({ ...f, path: e.target.value }))}
                      placeholder="e.g. F-1 → OPT → H-1B → EB-2"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Your story *</label>
                    <textarea
                      required rows={5} value={form.story}
                      onChange={e => setForm(f => ({ ...f, story: e.target.value }))}
                      placeholder="Tell us how your immigration journey went and how StatusClock helped. What did you find most useful? What was the hardest part?"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !form.name || !form.email || !form.story}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm transition-colors"
                  >
                    {loading ? "Submitting…" : "Submit my story"}
                  </button>

                  <p className="text-center text-xs text-slate-400">
                    We&apos;ll never publish your story without explicit permission. We may edit for clarity or length and will share the final version with you first.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center border-t pt-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Ready to start your journey?</h2>
          <p className="text-slate-500 mb-6 text-sm">
            Free checklists, deadline tracking, and AI-powered guidance — no credit card required.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-500 transition-colors"
            >
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/ai-assistant"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Ask the AI Assistant
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
