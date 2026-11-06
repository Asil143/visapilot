"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Scale, Shield, CheckCircle2, ArrowRight, Mail, MessageSquare,
  Clock, Star, Users, FileText, AlertCircle,
} from "lucide-react";

const CASE_TYPES = [
  "H-1B Initial Petition",
  "H-1B Transfer / Amendment",
  "H-1B RFE Response",
  "OPT / STEM OPT Guidance",
  "O-1A / O-1B Petition",
  "EB-1A / EB-1B Self-Petition",
  "EB-2 NIW Self-Petition",
  "I-485 Adjustment of Status",
  "Green Card (Employer-sponsored)",
  "J-1 Waiver",
  "L-1 Intracompany Transfer",
  "TN Visa",
  "Naturalization (N-400)",
  "Other / Not sure",
];

const URGENCY_OPTIONS = [
  { value: "asap", label: "ASAP — I have a deadline in <30 days" },
  { value: "soon", label: "Soon — within the next 1–3 months" },
  { value: "planning", label: "Planning ahead — no immediate deadline" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: MessageSquare,
    title: "Submit an inquiry",
    desc: "Describe your situation, case type, and timeline. Takes under 2 minutes.",
  },
  {
    step: "02",
    icon: Users,
    title: "We pass your inquiry",
    desc: "We review your note and email a licensed immigration attorney in our referral network. A match is not guaranteed.",
  },
  {
    step: "03",
    icon: Scale,
    title: "Get a consultation",
    desc: "The attorney will reach out within 1–2 business days to schedule a free initial consultation.",
  },
];

const TRUST_SIGNALS = [
  { icon: Shield,    text: "Attorneys are licensed and in good standing with their state bar" },
  { icon: Star,      text: "Ask the attorney about fees before you retain them — StatusClock does not set legal fees" },
  { icon: FileText,  text: "Submitting an inquiry does not create an attorney-client relationship" },
  { icon: Clock,     text: "Response within 1–2 business days" },
];

export default function LawyersPage() {
  const [form, setForm] = useState({ name: "", email: "", caseType: "", urgency: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.caseType || !form.message) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: `Attorney Inquiry — ${form.caseType}`,
          message: `Case Type: ${form.caseType}\nUrgency: ${form.urgency || "Not specified"}\n\n${form.message}`,
        }),
      });
      if (!res.ok) throw new Error("Submission failed");
      setDone(true);
    } catch {
      setError("Something went wrong. Please email support@statusclock.com directly.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <section className="py-20 border-b bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-5 bg-blue-50 text-blue-700 border border-blue-100">
            <Scale className="h-4 w-4" />
            Attorney referrals
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Connect with a licensed immigration attorney
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-7">
            StatusClock is not a law firm. When your situation needs real legal counsel,
            we pass your inquiry to licensed immigration attorneys. Fees, if any, are set by the attorney — StatusClock is not a law firm.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-5xl">

        {/* How it works */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative bg-slate-50 border border-slate-200 rounded-2xl p-6">
                  <div className="text-4xl font-black text-slate-100 absolute top-4 right-5">{step.step}</div>
                  <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-6">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Trust signals */}
        <div className="mb-16 grid sm:grid-cols-2 gap-3">
          {TRUST_SIGNALS.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-white">
              <Icon className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-700">{text}</p>
            </div>
          ))}
        </div>

        {/* Inquiry form */}
        <div className="max-w-2xl mx-auto">
          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            <div className="px-8 py-6 bg-slate-900">
              <h2 className="text-xl font-bold text-white">Submit an attorney inquiry</h2>
              <p className="text-sm text-slate-400 mt-1">We&apos;ll match you with the right attorney and have them reach out within 1–2 business days.</p>
            </div>

            <div className="p-8">
              {done ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Inquiry received!</h3>
                  <p className="text-sm text-slate-500 leading-6">
                    We&apos;ll review your case and connect you with an immigration attorney within 1–2 business days.
                    Check your inbox at <strong>{form.email}</strong>.
                  </p>
                  <Link href="/dashboard" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline">
                    Go to Dashboard <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Your name *</label>
                      <input required type="text" value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Full name"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-600">Email address *</label>
                      <input required type="email" value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="you@email.com"
                        className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Case type *</label>
                    <select required value={form.caseType}
                      onChange={e => setForm(f => ({ ...f, caseType: e.target.value }))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value="">Select your case type</option>
                      {CASE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Urgency</label>
                    <div className="space-y-2">
                      {URGENCY_OPTIONS.map(opt => (
                        <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
                          <input type="radio" name="urgency" value={opt.value}
                            checked={form.urgency === opt.value}
                            onChange={e => setForm(f => ({ ...f, urgency: e.target.value }))}
                            className="text-blue-600" />
                          <span className="text-sm text-slate-700">{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600">Describe your situation *</label>
                    <textarea required rows={4} value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Briefly explain your immigration situation — current status, what you're trying to do, any deadlines or complications..."
                      className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={submitting || !form.name || !form.email || !form.caseType || !form.message}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2">
                    {submitting ? "Submitting…" : <><Mail className="h-4 w-4" /> Submit inquiry — free & no obligation</>}
                  </button>

                  <p className="text-center text-xs text-slate-400">
                    StatusClock is not a law firm and does not provide legal advice.
                    Attorneys listed are independent practitioners, not employees of StatusClock.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* When to hire an attorney */}
        <div className="mt-16 bg-amber-50 border border-amber-200 rounded-2xl p-8">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            When do you actually need an attorney?
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "You received a Request for Evidence (RFE) or NOID",
              "Your I-94 or status has already expired",
              "You've been out of status — even briefly",
              "You're self-petitioning EB-1A, EB-2 NIW, or O-1",
              "Your employer is filing your H-1B for the first time",
              "You're considering changing visa categories",
              "You have a past deportation order or criminal record",
              "You're unsure whether you're in valid status right now",
            ].map(item => (
              <div key={item} className="flex items-start gap-2 text-sm text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                {item}
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-5">
            For everything else — understanding checklists, tracking deadlines, filing fees —{" "}
            <Link href="/dashboard" className="text-blue-600 hover:underline font-medium">StatusClock&apos;s free tools</Link> are a good starting point.
          </p>
        </div>

      </div>
    </div>
  );
}
