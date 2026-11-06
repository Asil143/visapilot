"use client";

import { useState } from "react";
import { X, Copy, Check } from "lucide-react";

export const PAYMENT_METHODS = [
  { label: "Cash App", handle: "$AsilKamepalli",  href: "https://cash.app/$AsilKamepalli",    color: "#00d632", bg: "rgba(0,214,50,0.08)",   border: "rgba(0,214,50,0.25)"   },
  { label: "PayPal",   handle: "AsilKamepalli",    href: "https://paypal.me/AsilKamepalli",    color: "#009cde", bg: "rgba(0,156,222,0.08)",  border: "rgba(0,156,222,0.25)"  },
  { label: "Venmo",    handle: "@Asil-Kamepalli",  href: "https://venmo.com/u/Asil-Kamepalli", color: "#008cff", bg: "rgba(0,140,255,0.08)",  border: "rgba(0,140,255,0.25)"  },
  { label: "Chime",    handle: "$Asil-Kamepalli",  href: null,                                 color: "#73cf2e", bg: "rgba(115,207,46,0.08)", border: "rgba(115,207,46,0.25)" },
  { label: "Zelle",    handle: "331-226-7117",     href: null,                                 color: "#6d1ed4", bg: "rgba(109,30,212,0.08)", border: "rgba(109,30,212,0.25)" },
];

export interface PlanInfo { id: string; name: string; price: number; period?: string; }

const MAX_SCREENSHOT_BYTES = 5 * 1024 * 1024;
const ALLOWED_SCREENSHOT_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

export function PaymentModal({ plan, onClose, userEmail = "" }: { plan: PlanInfo; onClose: () => void; userEmail?: string }) {
  const [step, setStep] = useState<"choose" | "confirm" | "done">("choose");
  const [form, setForm] = useState({ email: userEmail, txNote: "" });
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  function copyHandle(handle: string) {
    navigator.clipboard.writeText(handle);
    setCopied(handle);
    setTimeout(() => setCopied(null), 2000);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (file && (!ALLOWED_SCREENSHOT_TYPES.has(file.type) || file.size > MAX_SCREENSHOT_BYTES)) {
      setSubmitError("Please choose a PNG, JPG, or WEBP image smaller than 5 MB.");
      setScreenshot(null);
      setScreenshotPreview(null);
      return;
    }
    setSubmitError(null);
    setScreenshot(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setScreenshotPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setScreenshotPreview(null);
    }
  }

  async function handleSubmit() {
    if (!screenshot) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(screenshot);
        reader.onload = async () => {
          try {
            const base64 = (reader.result as string).split(",")[1];
            const res = await fetch("/api/payments/submit", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: form.email,
                planId: plan.id,
                planName: plan.name,
                amount: plan.price,
                txNote: form.txNote || null,
                screenshot: { filename: screenshot.name, content: base64 },
              }),
            });
            if (!res.ok) {
              const data = await res.json().catch(() => ({}));
              reject(new Error(data.error || `Server error ${res.status}`));
            } else {
              resolve();
            }
          } catch (e) {
            reject(e);
          }
        };
        reader.onerror = () => reject(new Error("Failed to read file"));
      });
      setStep("done");
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const period = plan.period ?? (plan.id === "all-access" ? "/ year" : "one-time");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <p className="font-bold text-slate-900">{plan.name}</p>
            <p className="text-2xl font-black text-blue-600">
              ${plan.price} <span className="text-sm font-normal text-slate-400">{period}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
        </div>

        {step === "choose" && (
          <div className="p-6">
            <p className="text-sm text-slate-600 mb-2">
              Send <strong className="text-slate-900">${plan.price}</strong> with any method below, then confirm so we can activate access.
            </p>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              StatusClock uses person-to-person payment (not card checkout). We review your screenshot and usually activate access within one business day.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {PAYMENT_METHODS.map(({ label, handle, href, color, bg, border }) =>
                href ? (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="flex flex-col items-center p-3 rounded-xl border text-center no-underline hover:opacity-90 transition-opacity"
                    style={{ background: bg, borderColor: border }}>
                    <span className="text-xs font-bold mb-0.5" style={{ color }}>{label}</span>
                    <span className="text-xs text-slate-500">{handle}</span>
                  </a>
                ) : (
                  <button key={label} onClick={() => copyHandle(handle)}
                    className="flex flex-col items-center p-3 rounded-xl border text-center hover:opacity-90 transition-opacity"
                    style={{ background: bg, borderColor: border }}>
                    <span className="text-xs font-bold mb-0.5" style={{ color }}>{label}</span>
                    <span className="flex items-center gap-1 text-xs text-slate-500">
                      {copied === handle ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                      {copied === handle ? "Copied!" : handle}
                    </span>
                  </button>
                )
              )}
            </div>
            <button onClick={() => setStep("confirm")}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors">
              I&apos;ve paid — confirm my order →
            </button>
          </div>
        )}

        {step === "confirm" && (
          <div className="p-6 space-y-4">
            <p className="text-sm text-slate-600">Upload a screenshot of the completed transfer and the email we should activate.</p>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">Your email</label>
              <input type="email"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@email.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                Payment screenshot <span className="text-red-500">*</span>
              </label>
              <label className={`flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed cursor-pointer transition-colors ${screenshot ? "border-green-400 bg-green-50" : "border-slate-200 hover:border-blue-400 bg-slate-50"}`}>
                <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleFileChange} />
                {screenshotPreview ? (
                  <div className="w-full p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={screenshotPreview} alt="Payment screenshot" className="max-h-32 mx-auto rounded-lg object-contain" />
                    <p className="text-xs text-center text-green-600 mt-1.5 font-medium flex items-center justify-center gap-1">
                      <Check className="h-3 w-3" /> {screenshot?.name}
                    </p>
                  </div>
                ) : (
                  <div className="py-5 text-center">
                    <div className="text-2xl mb-1">📸</div>
                    <p className="text-xs font-medium text-slate-600">Click to upload screenshot</p>
                    <p className="text-xs text-slate-400 mt-0.5">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                )}
              </label>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-600">Transaction note <span className="text-slate-400 font-normal">(optional)</span></label>
              <textarea rows={2}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.txNote}
                onChange={e => setForm(f => ({ ...f, txNote: e.target.value }))}
                placeholder="e.g. Sent $29 via Cash App at 3:45pm"
              />
            </div>
            {submitError && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{submitError}</div>
            )}
            <div className="flex gap-2">
              <button onClick={() => setStep("choose")} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">← Back</button>
              <button onClick={handleSubmit} disabled={!form.email || !screenshot || submitting}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-sm transition-colors">
                {submitting ? "Sending…" : "Submit — activate my plan"}
              </button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="p-8 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-lg font-bold text-slate-900 mb-2">Order received!</p>
            <p className="text-sm text-slate-500 leading-6">
              We&apos;ll verify your payment and activate your <strong>{plan.name}</strong> within 2–4 hours.
              Check your email at <strong>{form.email}</strong> for confirmation.
            </p>
            <button onClick={onClose} className="mt-5 px-6 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-700 transition-colors">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
