"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  CheckCircle2, ArrowRight, Bot, Shield, Calendar, Target,
  ChevronLeft, Sparkles, AlertCircle, Star,
} from "lucide-react";

const visaOptions = [
  { value: "F-1 Student", label: "F-1 Student", icon: "🎓", desc: "Enrolled at a US university", color: "#eff6ff", border: "#bfdbfe", textColor: "#1d4ed8" },
  { value: "OPT", label: "OPT", icon: "💼", desc: "Post-graduation work authorization", color: "#f0fdf4", border: "#86efac", textColor: "#15803d" },
  { value: "STEM OPT", label: "STEM OPT", icon: "🔬", desc: "24-month STEM OPT extension", color: "#faf5ff", border: "#d8b4fe", textColor: "#6d28d9" },
  { value: "H-1B", label: "H-1B", icon: "🏢", desc: "Specialty occupation work visa", color: "#f0fdf4", border: "#86efac", textColor: "#15803d" },
  { value: "H-4", label: "H-4 Dependent", icon: "👥", desc: "Spouse/dependent of H-1B holder", color: "#ecfeff", border: "#a5f3fc", textColor: "#0891b2" },
  { value: "J-1", label: "J-1 Exchange", icon: "🌍", desc: "Exchange visitor program", color: "#fff7ed", border: "#fed7aa", textColor: "#c2410c" },
  { value: "L-1A", label: "L-1A/L-1B", icon: "🏗️", desc: "Intracompany transferee", color: "#ecfeff", border: "#a5f3fc", textColor: "#0891b2" },
  { value: "O-1A", label: "O-1A/O-1B", icon: "⭐", desc: "Extraordinary ability visa", color: "#fdf4ff", border: "#e9d5ff", textColor: "#9333ea" },
  { value: "Green Card (Pending I-485)", label: "I-485 Pending", icon: "🌿", desc: "Adjustment of status in progress", color: "#f0fdf4", border: "#86efac", textColor: "#15803d" },
  { value: "Green Card (LPR)", label: "Green Card (LPR)", icon: "✅", desc: "Permanent resident", color: "#fffbeb", border: "#fde68a", textColor: "#d97706" },
  { value: "TN", label: "TN Visa", icon: "🇨🇦", desc: "Canadian/Mexican professional", color: "#fef2f2", border: "#fecaca", textColor: "#dc2626" },
  { value: "Other", label: "Other / Exploring", icon: "🔍", desc: "Different status or exploring", color: "#f8fafc", border: "#e2e8f0", textColor: "#64748b" },
];

const countries = ["India", "China", "Mexico", "Philippines", "Brazil", "Nigeria", "South Korea", "Pakistan", "Canada", "United Kingdom", "Other"];

const goals = [
  { id: "h1b", icon: "🎯", label: "Win H-1B lottery", desc: "Find sponsors, prepare for cap season" },
  { id: "opt", icon: "📋", label: "OPT/STEM OPT filing", desc: "Application checklists and deadlines" },
  { id: "greencard", icon: "🌿", label: "Get a green card", desc: "EB-2 NIW, EB-1A, or employer-sponsored" },
  { id: "rfe", icon: "⚡", label: "Respond to an RFE", desc: "Build a strong RFE response fast" },
  { id: "travel", icon: "✈️", label: "Travel safely", desc: "Know the rules before leaving the US" },
  { id: "job", icon: "💼", label: "Find a sponsoring job", desc: "Jobs that actively sponsor H-1B" },
  { id: "attorney", icon: "⚖️", label: "Find an attorney", desc: "Verified attorneys with fixed fees" },
  { id: "understand", icon: "📚", label: "Understand my options", desc: "Explore all possible visa paths" },
];

const STEPS = [
  { id: 1, label: "Visa Status", icon: Shield },
  { id: 2, label: "Background", icon: Target },
  { id: 3, label: "Key Dates", icon: Calendar },
  { id: 4, label: "Your Goals", icon: Star },
  { id: 5, label: "All Set!", icon: Sparkles },
];

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Profile state
  const [visaType, setVisaType] = useState("");
  const [country, setCountry] = useState("");
  const [employer, setEmployer] = useState("");
  const [eadExpiry, setEadExpiry] = useState("");
  const [i94Expiry, setI94Expiry] = useState("");
  const [passportExpiry, setPassportExpiry] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  function toggleGoal(id: string) {
    setSelectedGoals(g => g.includes(id) ? g.filter(x => x !== id) : [...g, id]);
  }

  const [now] = useState(() => Date.now());
  function daysUntil(d: string) {
    if (!d) return null;
    return Math.ceil((new Date(d).getTime() - now) / 86400000);
  }

  function checklistForVisa(visa: string) {
    const map: Record<string, string> = {
      "F-1 Student": "/dashboard/tools/checklists/opt",
      OPT: "/dashboard/tools/checklists/opt",
      "STEM OPT": "/dashboard/tools/checklists/stem-opt",
      "H-1B": "/dashboard/tools/checklists/h1b",
      "H-4": "/dashboard/tools/checklists/h4",
      "J-1": "/dashboard/tools/checklists/j1",
      "L-1A": "/dashboard/tools/checklists/l1",
      "O-1A": "/dashboard/tools/checklists/o1",
      "Green Card (Pending I-485)": "/dashboard/tools/checklists/green-card",
      "Green Card (LPR)": "/dashboard/tools/checklists/green-card",
      TN: "/dashboard/tools/checklists/tn",
    };
    return map[visa] ?? "/dashboard/tools/checklists";
  }

  async function finish() {
    setLoading(true);
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visa_type: visaType,
          country_of_birth: country,
          employer,
          ead_expiry: eadExpiry || null,
          i94_expiry: i94Expiry || null,
          passport_expiry: passportExpiry || null,
          goals: selectedGoals,
          onboarding_complete: true,
        }),
      });
    } finally {
      setLoading(false);
      router.push("/dashboard");
    }
  }

  const canNext = step === 1 ? !!visaType : step === 2 ? !!country : true;
  const selectedVisa = visaOptions.find(v => v.value === visaType);

  // Alerts preview
  const alerts = [
    { label: "EAD Expiry", days: daysUntil(eadExpiry), date: eadExpiry },
    { label: "I-94 Expiry", days: daysUntil(i94Expiry), date: i94Expiry },
    { label: "Passport Expiry", days: daysUntil(passportExpiry), date: passportExpiry },
  ].filter(a => a.days !== null && a.days > 0);

  return (
    <div className="sc-legacy-page min-h-screen flex items-center justify-center p-4" style={{ background: "linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #f5f3ff 100%)" }}>
      <div className="w-full max-w-2xl">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#2563eb" }}>
            <Bot className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold">StatusClock</span>
        </div>

        {/* Progress bar */}
        <div className="flex items-center justify-between mb-8 px-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = step > s.id;
            const current = step === s.id;
            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className="h-9 w-9 rounded-full flex items-center justify-center transition-all"
                    style={{
                      backgroundColor: done ? "#16a34a" : current ? "#2563eb" : "#e2e8f0",
                      color: done || current ? "#ffffff" : "#94a3b8",
                    }}
                  >
                    {done ? <CheckCircle2 className="h-5 w-5" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className="text-[10px] mt-1 font-medium hidden sm:block" style={{ color: current ? "#2563eb" : done ? "#16a34a" : "#94a3b8" }}>
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2" style={{ backgroundColor: done ? "#16a34a" : "#e2e8f0" }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="rounded-3xl shadow-xl overflow-hidden" style={{ backgroundColor: "#ffffff" }}>

          {/* Step 1: Visa status */}
          {step === 1 && (
            <div className="p-8">
              <h1 className="text-2xl font-bold mb-1">What is your current visa status?</h1>
              <p className="text-sm mb-6" style={{ color: "#64748b" }}>
                Hi{user?.firstName ? ` ${user.firstName}` : ""}! Select your current status and we&apos;ll personalize everything for you.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {visaOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setVisaType(opt.value)}
                    className="flex flex-col items-start p-3 rounded-2xl border-2 text-left transition-all hover:shadow-sm"
                    style={{
                      backgroundColor: visaType === opt.value ? opt.color : "#ffffff",
                      borderColor: visaType === opt.value ? opt.textColor : "#e2e8f0",
                    }}
                  >
                    <span className="text-2xl mb-2">{opt.icon}</span>
                    <span className="font-bold text-sm" style={{ color: visaType === opt.value ? opt.textColor : "#0f172a" }}>{opt.label}</span>
                    <span className="text-[10px] mt-0.5 leading-tight" style={{ color: "#94a3b8" }}>{opt.desc}</span>
                    {visaType === opt.value && (
                      <CheckCircle2 className="h-4 w-4 mt-1.5" style={{ color: opt.textColor }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Background */}
          {step === 2 && (
            <div className="p-8">
              <h1 className="text-2xl font-bold mb-1">Tell us your background</h1>
              <p className="text-sm mb-6" style={{ color: "#64748b" }}>Your country of birth determines your visa bulletin priority date queue.</p>

              {selectedVisa && (
                <div className="flex items-center gap-3 p-3 rounded-xl mb-6" style={{ backgroundColor: selectedVisa.color }}>
                  <span className="text-2xl">{selectedVisa.icon}</span>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: selectedVisa.textColor }}>{selectedVisa.label}</p>
                    <p className="text-xs" style={{ color: "#64748b" }}>{selectedVisa.desc}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block" style={{ color: "#475569" }}>Country of birth</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {countries.map(c => (
                      <button
                        key={c}
                        onClick={() => setCountry(c)}
                        className="px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all"
                        style={{
                          backgroundColor: country === c ? "#eff6ff" : "#ffffff",
                          borderColor: country === c ? "#2563eb" : "#e2e8f0",
                          color: country === c ? "#1d4ed8" : "#475569",
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block" style={{ color: "#475569" }}>
                    {["F-1 Student", "OPT", "STEM OPT", "J-1"].includes(visaType) ? "University / School" : "Current Employer"}
                  </label>
                  <input
                    type="text"
                    value={employer}
                    onChange={e => setEmployer(e.target.value)}
                    placeholder={["F-1 Student", "OPT", "STEM OPT", "J-1"].includes(visaType) ? "e.g. MIT, UT Austin, Stanford..." : "e.g. Google, Amazon, Pfizer..."}
                    className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none"
                    style={{ borderColor: "#e2e8f0" }}
                  />
                </div>

                {country === "India" && (visaType === "H-1B" || visaType.includes("Green Card")) && (
                  <div className="p-4 rounded-xl" style={{ backgroundColor: "#fff7ed", border: "1px solid #fed7aa" }}>
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-orange-900">India green card backlog</p>
                        <p className="text-xs text-orange-700 mt-0.5">India EB-2 has a 50+ year backlog. StatusClock will show you EB-1A and EB-1C paths that bypass the queue entirely.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Key dates */}
          {step === 3 && (
            <div className="p-8">
              <h1 className="text-2xl font-bold mb-1">Add your key dates</h1>
              <p className="text-sm mb-6" style={{ color: "#64748b" }}>We&apos;ll alert you before anything expires. You can always add more later in your profile.</p>

              <div className="space-y-4">
                {(visaType === "OPT" || visaType === "STEM OPT") && (
                  <div>
                    <label className="text-sm font-semibold mb-1.5 block" style={{ color: "#475569" }}>EAD Expiry Date <span className="text-red-500">*</span></label>
                    <input type="date" value={eadExpiry} onChange={e => setEadExpiry(e.target.value)} className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none" style={{ borderColor: "#e2e8f0" }} />
                    {eadExpiry && daysUntil(eadExpiry) !== null && (
                      <p className="text-xs mt-1 font-semibold" style={{ color: daysUntil(eadExpiry)! < 90 ? "#dc2626" : "#16a34a" }}>
                        {daysUntil(eadExpiry)} days remaining
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="text-sm font-semibold mb-1.5 block" style={{ color: "#475569" }}>I-94 Authorized Stay Expiry</label>
                  <input type="date" value={i94Expiry} onChange={e => setI94Expiry(e.target.value)} className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none" style={{ borderColor: "#e2e8f0" }} />
                  <p className="text-[10px] mt-1" style={{ color: "#94a3b8" }}>Check at i94.cbp.dhs.gov</p>
                </div>

                <div>
                  <label className="text-sm font-semibold mb-1.5 block" style={{ color: "#475569" }}>Passport Expiry Date</label>
                  <input type="date" value={passportExpiry} onChange={e => setPassportExpiry(e.target.value)} className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none" style={{ borderColor: "#e2e8f0" }} />
                </div>
              </div>

              {alerts.length > 0 && (
                <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe" }}>
                  <p className="text-xs font-bold text-blue-900 mb-2">Your dashboard will show these alerts:</p>
                  {alerts.map(a => (
                    <div key={a.label} className="flex items-center justify-between text-xs mb-1">
                      <span className="text-blue-800">{a.label}</span>
                      <span className="font-bold" style={{ color: a.days! < 90 ? "#dc2626" : "#16a34a" }}>{a.days} days</span>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs mt-4 text-center" style={{ color: "#94a3b8" }}>
                <button onClick={() => setStep(4)} className="underline">Skip this step</button> — you can add dates anytime in My Profile
              </p>
            </div>
          )}

          {/* Step 4: Goals */}
          {step === 4 && (
            <div className="p-8">
              <h1 className="text-2xl font-bold mb-1">What do you need help with?</h1>
              <p className="text-sm mb-6" style={{ color: "#64748b" }}>Select all that apply. We&apos;ll prioritize these in your dashboard. (You can change this later)</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {goals.map(goal => {
                  const selected = selectedGoals.includes(goal.id);
                  return (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className="flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all"
                      style={{
                        backgroundColor: selected ? "#eff6ff" : "#ffffff",
                        borderColor: selected ? "#2563eb" : "#e2e8f0",
                      }}
                    >
                      <span className="text-2xl shrink-0">{goal.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm" style={{ color: selected ? "#1d4ed8" : "#0f172a" }}>{goal.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#94a3b8" }}>{goal.desc}</p>
                      </div>
                      {selected && <CheckCircle2 className="h-5 w-5 text-blue-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 5: Done */}
          {step === 5 && (
            <div className="p-8 text-center">
              <div className="h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: "linear-gradient(135deg, #2563eb, #7c3aed)" }}>
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold mb-2">You are all set!</h1>
              <p className="text-sm mb-8" style={{ color: "#64748b" }}>
                Your personalized immigration dashboard is ready. Here&apos;s what&apos;s waiting for you:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 text-left">
                {[
                  { icon: "🔔", title: "Deadline alerts", desc: alerts.length > 0 ? `${alerts.length} alert${alerts.length > 1 ? "s" : ""} configured` : "Add dates in My Profile" },
                  { icon: "🤖", title: "AI Assistant", desc: `Personalized for ${visaType || "your visa"}` },
                  { icon: "🎯", title: "Your goals", desc: selectedGoals.length > 0 ? `${selectedGoals.length} goal${selectedGoals.length > 1 ? "s" : ""} set` : "Dashboard personalized" },
                ].map(item => (
                  <div key={item.title} className="p-4 rounded-2xl" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0" }}>
                    <span className="text-2xl">{item.icon}</span>
                    <p className="font-semibold text-sm mt-2">{item.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>{item.desc}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={finish}
                disabled={loading}
                className="w-full py-4 rounded-2xl text-base font-bold text-white flex items-center justify-center gap-2 transition-all"
                style={{ background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)" }}
              >
                {loading ? "Setting up your dashboard..." : <>Go to My Dashboard <ArrowRight className="h-5 w-5" /></>}
              </button>
            </div>
          )}

          {/* Navigation */}
          {step < 5 && (
            <div className="px-8 pb-6 flex items-center justify-between">
              <button
                onClick={() => step > 1 ? setStep(step - 1) : router.push(checklistForVisa(visaType))}
                className="flex items-center gap-1 text-sm font-medium px-4 py-2 rounded-xl transition-all"
                style={{ color: "#64748b" }}
              >
                <ChevronLeft className="h-4 w-4" />
                {step > 1 ? "Back" : "Skip setup"}
              </button>
              <button
                onClick={() => setStep(step + 1)}
                disabled={!canNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40 transition-all"
                style={{ backgroundColor: "#2563eb" }}
              >
                {step === 4 ? "See my dashboard" : "Continue"} <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <p className="text-center text-xs mt-4" style={{ color: "#94a3b8" }}>
          Your data is encrypted and never shared. You can edit everything later in Settings.
        </p>
      </div>
    </div>
  );
}
