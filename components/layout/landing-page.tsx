"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { visaGuides } from "@/config/navigation";
import {
  Bot, Calendar, ListChecks, ArrowRight, CheckCircle2,
  Clock, Shield, Zap, FileText, TrendingUp,
  GraduationCap, BriefcaseBusiness, Microscope, Building2, BadgeCheck,
  type LucideIcon,
} from "lucide-react";

// ─── Typing hook ─────────────────────────────────────────────────────────────
const WORDS = ["OPT application", "STEM OPT I-983", "H-1B RFE response", "cap-gap rules", "Green Card EB-2 NIW"];

function useTyping() {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState("");
  const [del, setDel] = useState(false);
  useEffect(() => {
    const word = WORDS[idx];
    let t: ReturnType<typeof setTimeout>;
    if (!del && text.length < word.length) t = setTimeout(() => setText(word.slice(0, text.length + 1)), 55);
    else if (!del && text.length === word.length) t = setTimeout(() => setDel(true), 1800);
    else if (del && text.length > 0) t = setTimeout(() => setText(text.slice(0, -1)), 30);
    else t = setTimeout(() => { setDel(false); setIdx((i) => (i + 1) % WORDS.length); }, 0);
    return () => clearTimeout(t);
  }, [text, del, idx]);
  return text;
}

// ─── Checklist cycling data ───────────────────────────────────────────────────
const CHECKLISTS = [
  {
    title: "OPT Checklist",
    subtitle: "F-1 Optional Practical Training",
    phase: "Phase 2 of 7 — File I-765",
    color: "#f97316",
    bgColor: "#fff7ed",
    badge: "12 months",
    items: [
      "Apply 90 days before graduation date",
      "Receive EAD card before start date",
      "Report employer to DSO within 10 days",
      "Update SEVP Portal with employer info",
      "Track unemployment — max 90 days",
    ],
  },
  {
    title: "STEM OPT Guide",
    subtitle: "I-983 Reporting — Step by Step",
    phase: "Phase 4 of 9 — Submit to DSO",
    color: "#2563eb",
    bgColor: "#eff6ff",
    badge: "24 months",
    items: [
      "Download Form I-983 from ICE.gov",
      "Employer completes Sections 2, 3 & 4",
      "Submit signed I-983 to DSO",
      "Report employer within 10 days",
      "Schedule first 6-month evaluation",
    ],
  },
  {
    title: "H-1B Checklist",
    subtitle: "Specialty Occupation Work Visa",
    phase: "Phase 3 of 8 — Petition Filed",
    color: "#16a34a",
    bgColor: "#f0fdf4",
    badge: "3–6 years",
    items: [
      "Employer files LCA with DOL",
      "Submit H-1B petition to USCIS",
      "Receive I-797 approval notice",
      "Cap-gap bridges OPT to Oct 1",
      "Update I-9 with new status",
    ],
  },
  {
    title: "Green Card",
    subtitle: "EB-2 / EB-3 Employer Sponsored",
    phase: "Phase 2 of 6 — PERM Filed",
    color: "#7c3aed",
    bgColor: "#faf5ff",
    badge: "EB-2/EB-3",
    items: [
      "Employer files PERM labor cert",
      "File I-140 immigrant petition",
      "Check Visa Bulletin monthly",
      "File I-485 when priority date current",
      "Attend biometrics appointment",
    ],
  },
];

// ─── 3D tilt card ─────────────────────────────────────────────────────────────
function TiltCard() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 20 });

  function onMouse(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function onLeave() { x.set(0); y.set(0); }

  const [listIdx, setListIdx] = useState(0);
  const [checked, setChecked] = useState<number[]>([]);
  const current = CHECKLISTS[listIdx];

  const [prevListIdx, setPrevListIdx] = useState(listIdx);
  if (listIdx !== prevListIdx) {
    setPrevListIdx(listIdx);
    setChecked([]);
  }

  useEffect(() => {
    if (checked.length >= current.items.length) {
      const t = setTimeout(() => setListIdx((i) => (i + 1) % CHECKLISTS.length), 1400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setChecked((p) => [...p, p.length]), 850);
    return () => clearTimeout(t);
  }, [checked, current.items.length]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouse}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1000 }}
      className="relative w-full max-w-sm mx-auto select-none"
    >
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/10">
        {/* Header */}
        <AnimatePresence mode="wait">
          <motion.div
            key={listIdx + "-h"}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.25 }}
            className="flex items-center justify-between mb-5"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: current.bgColor }}>
                <Bot className="h-4 w-4" style={{ color: current.color }} />
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm">{current.title}</p>
                <p className="text-slate-400 text-xs">{current.subtitle}</p>
              </div>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: current.bgColor, color: current.color }}>
              {current.badge}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Phase */}
        <AnimatePresence mode="wait">
          <motion.div
            key={listIdx + "-p"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg"
            style={{ backgroundColor: current.bgColor }}
          >
            <div className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: current.color }} />
            <p className="text-xs font-medium" style={{ color: current.color }}>{current.phase}</p>
          </motion.div>
        </AnimatePresence>

        {/* Items */}
        <AnimatePresence mode="wait">
          <motion.div
            key={listIdx + "-items"}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.25 }}
            className="space-y-2.5 mb-5"
          >
            {current.items.map((item, i) => (
              <motion.div
                key={item}
                className="flex items-start gap-2.5"
                animate={{ opacity: i <= checked.length ? 1 : 0.3 }}
              >
                <motion.div
                  animate={checked.includes(i) ? { scale: [1, 1.25, 1] } : {}}
                  transition={{ duration: 0.25 }}
                  className="mt-0.5 h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
                  style={{
                    borderColor: checked.includes(i) ? "#22c55e" : "#e2e8f0",
                    backgroundColor: checked.includes(i) ? "#22c55e" : "transparent",
                  }}
                >
                  <AnimatePresence>
                    {checked.includes(i) && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                <span className={`text-xs leading-4 ${checked.includes(i) ? "text-slate-400 line-through" : "text-slate-700"}`}>
                  {item}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-[10px] text-slate-400 mb-1.5">
            <span>Progress</span>
            <span className="font-semibold" style={{ color: current.color }}>
              {Math.round((checked.length / current.items.length) * 100)}%
            </span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: current.color }}
              animate={{ width: `${(checked.length / current.items.length) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Bento cells ──────────────────────────────────────────────────────────────
function BentoAI() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const delays = [1000, 2400, 5500];
    const t = setTimeout(() => setStep((s) => (s >= 2 ? 0 : s + 1)), delays[step] ?? 1000);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <div className="h-full flex flex-col p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-7 w-7 rounded-lg bg-blue-100 flex items-center justify-center">
          <Bot className="h-4 w-4 text-blue-600" />
        </div>
        <p className="font-semibold text-sm text-slate-800">AI Assistant</p>
        <div className="ml-auto flex items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] text-slate-400">Live</span>
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-hidden">
        <AnimatePresence>
          {step >= 1 && (
            <motion.div key="q" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
              <div className="h-5 w-5 rounded-full bg-slate-200 shrink-0 mt-0.5" />
              <div className="rounded-2xl rounded-tl-none bg-slate-100 px-3 py-2 text-[11px] text-slate-700 max-w-[85%]">
                What happens if I exceed 150 days unemployed on STEM OPT?
              </div>
            </motion.div>
          )}
          {step >= 2 && (
            <motion.div key="a" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 flex-row-reverse">
              <div className="h-5 w-5 rounded-full bg-blue-600 shrink-0 mt-0.5 flex items-center justify-center">
                <Bot className="h-3 w-3 text-white" />
              </div>
              <div className="rounded-2xl rounded-tr-none bg-blue-50 border border-blue-100 px-3 py-2 text-[11px] text-slate-700 max-w-[85%]">
                Your F-1 status is violated and USCIS may terminate your SEVIS record. Consult an attorney immediately.
                <p className="mt-1 text-[9px] text-slate-400">Source: USCIS STEM OPT Guidelines</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Link href="/ai-assistant" className="mt-3 text-xs text-blue-600 flex items-center gap-1 hover:gap-2 transition-all font-medium">
        Try AI Assistant <ArrowRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

function BentoDeadlines() {
  const items = [
    { label: "OPT Application Window", days: 45, max: 90, color: "#f97316" },
    { label: "STEM OPT 6-mo Eval", days: 23, max: 180, color: "#2563eb" },
    { label: "H-1B Registration", days: 67, max: 365, color: "#7c3aed" },
  ];
  return (
    <div className="h-full p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-7 w-7 rounded-lg bg-orange-100 flex items-center justify-center">
          <Calendar className="h-4 w-4 text-orange-600" />
        </div>
        <p className="font-semibold text-sm text-slate-800">Upcoming Deadlines</p>
      </div>
      <div className="space-y-3.5">
        {items.map((d, i) => (
          <motion.div key={d.label} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <div className="flex justify-between text-[10px] mb-1.5">
              <span className="text-slate-600">{d.label}</span>
              <span className="font-semibold" style={{ color: d.color }}>{d.days}d left</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: d.color }}
                initial={{ width: 0 }}
                whileInView={{ width: `${100 - (d.days / d.max) * 100}%` }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.3, duration: 0.9, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function BentoOPT() {
  const [days, setDays] = useState(0);
  useEffect(() => {
    let n = 0;
    const t = setInterval(() => { n += 2; setDays(n); if (n >= 67) clearInterval(t); }, 18);
    return () => clearInterval(t);
  }, []);
  const pct = (days / 90) * 100;
  const color = days > 70 ? "#ef4444" : days > 50 ? "#f97316" : "#16a34a";
  return (
    <div className="h-full flex flex-col items-center justify-center p-5 text-center">
      <div className="h-7 w-7 rounded-lg bg-green-100 flex items-center justify-center mb-3">
        <TrendingUp className="h-4 w-4 text-green-600" />
      </div>
      <p className="text-[10px] text-slate-500 mb-1">OPT Unemployment Days</p>
      <motion.p className="text-4xl font-black mb-1" style={{ color }}>{days}</motion.p>
      <p className="text-[10px] text-slate-400 mb-3">of 90 max</p>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ backgroundColor: color }} animate={{ width: `${pct}%` }} transition={{ duration: 0.04 }} />
      </div>
      <p className="mt-1.5 text-[10px] text-slate-400">{90 - days} days remaining</p>
    </div>
  );
}

function BentoStats() {
  const stats = [
    { icon: ListChecks, value: "12", label: "Visa Checklists", color: "text-indigo-600", bg: "bg-indigo-50" },
    { icon: Shield, value: "2", label: "RFE Guides", color: "text-red-600", bg: "bg-red-50" },
    { icon: FileText, value: "9", label: "STEM Phases", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: Zap, value: "Free", label: "No sign-up needed", color: "text-amber-600", bg: "bg-amber-50" },
  ];
  return (
    <div className="h-full grid grid-cols-2 gap-2.5 p-4">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`flex flex-col items-center justify-center rounded-xl p-3 text-center ${s.bg}`}
          >
            <Icon className={`h-4 w-4 mb-1.5 ${s.color}`} />
            <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
            <p className="text-[9px] text-slate-500 leading-tight mt-0.5">{s.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}

// ─── Stage selector ───────────────────────────────────────────────────────────
type Stage = "f1" | "opt" | "stem" | "h1b" | "gc";
const stages: { id: Stage; label: string; icon: LucideIcon }[] = [
  { id: "f1", label: "F-1 Student", icon: GraduationCap },
  { id: "opt", label: "OPT", icon: BriefcaseBusiness },
  { id: "stem", label: "STEM OPT", icon: Microscope },
  { id: "h1b", label: "H-1B", icon: Building2 },
  { id: "gc", label: "Green Card", icon: BadgeCheck },
];
const stageContent: Record<Stage, { headline: string; subtext: string; urgency: string; urgencyColor: string; accentBg: string; items: string[]; cta: string; href: string }> = {
  f1: {
    headline: "Build your paper trail now — before you need it",
    subtext: "USCIS can demand proof of every semester you were enrolled. Most F-1 students don't collect this until they're in an RFE — by then it's too late.",
    urgency: "Start collecting documents from Day 1",
    urgencyColor: "text-blue-600", accentBg: "bg-blue-50",
    items: ["Save course syllabi every semester — USCIS demands them all", "Report every address change within 10 days", "Keep every I-20 ever issued — never throw them away", "Save tuition receipts and 6 months of bank statements"],
    cta: "F-1 RFE Prevention Checklist", href: "/dashboard/tools/checklists/rfe-f1-maintenance",
  },
  opt: {
    headline: "You have 90 days before graduation to apply",
    subtext: "Miss the 90-day filing window and you lose OPT eligibility entirely. Once on OPT, 90 days max unemployed — clock starts from EAD start date, not when you find a job.",
    urgency: "90-day application window — don't miss it",
    urgencyColor: "text-orange-600", accentBg: "bg-orange-50",
    items: ["Apply 90 days before graduation — not after", "Report your employer to DSO AND SEVP Portal within 10 days", "Track unemployment — max 90 days during OPT", "New job? Report the new employer within 10 days"],
    cta: "OPT Application Checklist", href: "/dashboard/tools/checklists/opt",
  },
  stem: {
    headline: "Your I-983 must be signed before you start work",
    subtext: "Most common STEM OPT mistake: students start work before DSO approves the I-983. That's a status violation. You have 10 days after Day 1 to report your employer.",
    urgency: "10-day reporting window starts from Day 1",
    urgencyColor: "text-red-600", accentBg: "bg-red-50",
    items: ["I-983 must be DSO-approved before you start", "Employer fills Sections 2, 3, 4 — you cannot do this yourself", "Report employer to DSO AND SEVP Portal within 10 days", "6-month self-evaluations required throughout STEM OPT"],
    cta: "STEM OPT Step-by-Step Guide", href: "/dashboard/tools/checklists/stem-opt-reporting",
  },
  h1b: {
    headline: "Lottery in March. Cap-gap protects you until Oct 1.",
    subtext: "H-1B has a 65,000 cap. Your employer files the petition — but you need to understand every step, especially cap-gap if you're currently on OPT or STEM OPT.",
    urgency: "Registration opens March each year",
    urgencyColor: "text-purple-600", accentBg: "bg-purple-50",
    items: ["Employer registers in USCIS system each March", "If selected, petition filed by June 30", "Cap-gap bridges OPT → H-1B from April 1 to Oct 1", "Premium processing: 15 business day decision"],
    cta: "H-1B Checklist", href: "/dashboard/tools/checklists/h1b",
  },
  gc: {
    headline: "Green card takes years — start planning early",
    subtext: "EB-2 NIW or employer-sponsored EB-2/EB-3 — both involve priority dates, labor certification, and often 5–10 year waits depending on your country of birth.",
    urgency: "Priority dates — check the Visa Bulletin monthly",
    urgencyColor: "text-green-600", accentBg: "bg-green-50",
    items: ["EB-2 NIW: self-petition, prove national interest", "EB-2/EB-3: employer files PERM labor certification first", "Track your priority date against monthly Visa Bulletin", "Concurrent I-485 possible when priority date is current"],
    cta: "Green Card Checklist", href: "/dashboard/tools/checklists/green-card",
  },
};

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function LandingPage() {
  const typedText = useTyping();
  const [activeStage, setActiveStage] = useState<Stage>("stem");
  const content = stageContent[activeStage];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white pt-20 pb-20">
        <div className="surface-grid absolute inset-0 pointer-events-none opacity-60" />

        <div className="container mx-auto px-4 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[75vh]">
            {/* Left */}
            <div>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1.5 mb-6 shadow-sm shadow-slate-900/5">
                  <Shield className="h-3.5 w-3.5 text-blue-600" />
                  <span className="text-sm text-slate-700 font-medium">Deadline tracking and document guidance for US immigration</span>
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl sm:text-6xl font-black text-slate-950 leading-[1.05] tracking-tight mb-6"
              >
                Confused about{" "}
                <span className="text-blue-700">
                  {typedText || " "}
                  <span className="animate-pulse text-blue-600">|</span>
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl"
              >
                Step-by-step checklists, AI guidance, and deadline tracking —
                built for international students navigating the US immigration system.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 mb-6"
              >
                <Button size="xl" asChild>
                  <Link href="/dashboard/tools/checklists">
                    Browse Checklists Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="xl" variant="outline" asChild>
                  <Link href="/ai-assistant">Try AI Assistant</Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4 text-sm text-slate-400"
              >
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500" /> Free to use</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500" /> No sign-up for checklists</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500" /> No credit card</span>
              </motion.div>
            </div>

            {/* Right: tilt card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <TiltCard />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Bento grid ───────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <FadeUp>
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 text-xs">Dashboard preview</Badge>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Everything in one place</h2>
              <p className="mt-3 text-slate-500 max-w-xl mx-auto">AI assistant, deadline tracker, OPT counter, and 12 checklists — all working together.</p>
            </div>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <FadeUp delay={0.05}>
              <div className="md:row-span-2 rounded-lg border border-slate-200 bg-white min-h-[280px] flex flex-col overflow-hidden hover:shadow-sm transition-shadow">
                <BentoAI />
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div className="md:col-span-2 rounded-lg border border-slate-200 bg-white min-h-[160px] hover:shadow-sm transition-shadow">
                <BentoDeadlines />
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="rounded-lg border border-slate-200 bg-white min-h-[160px] hover:shadow-sm transition-shadow">
                <BentoStats />
              </div>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="rounded-lg border border-slate-200 bg-white min-h-[160px] hover:shadow-sm transition-shadow">
                <BentoOPT />
              </div>
            </FadeUp>

            <FadeUp delay={0.25}>
              <Link href="/dashboard/tools/checklists" className="block">
                <div className="rounded-lg border border-blue-200 bg-blue-50 min-h-[160px] p-5 flex flex-col justify-between group hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer">
                  <div>
                    <div className="h-8 w-8 rounded-xl bg-blue-100 flex items-center justify-center mb-3">
                      <ListChecks className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="font-bold text-slate-900 text-sm">12 Visa Checklists</p>
                    <p className="text-[11px] text-slate-500 mt-1 leading-4">OPT · STEM OPT · H-1B · Green Card · RFE prevention</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-blue-600 font-medium mt-3 group-hover:gap-2 transition-all">
                    Browse all <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Stage selector ───────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <FadeUp>
            <div className="text-center mb-10">
              <Badge variant="secondary" className="mb-3 text-xs">Personalized</Badge>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Where are you right now?</h2>
              <p className="mt-3 text-slate-500">Pick your current visa stage — we&apos;ll show you exactly what to do next.</p>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {stages.map((stage) => {
                const Icon = stage.icon;
                return (
                <button
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-semibold transition-all border ${
                    activeStage === stage.id
                      ? "bg-slate-950 text-white border-slate-950 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {stage.label}
                </button>
              )})}
            </div>
          </FadeUp>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStage}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
              className="max-w-4xl mx-auto"
            >
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug">{content.headline}</h3>
                    <p className="text-sm text-slate-600 leading-6 mb-4">{content.subtext}</p>
                    <div className={`flex items-center gap-2 text-sm font-semibold ${content.urgencyColor} mb-6 px-3 py-2 rounded-lg ${content.accentBg} w-fit`}>
                      <Clock className="h-4 w-4" />
                      {content.urgency}
                    </div>
                    <Button asChild className="bg-slate-900 hover:bg-slate-800 text-white">
                      <Link href={content.href}>
                        {content.cta} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                  <div className="space-y-2.5">
                    {content.items.map((item, i) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="flex items-start gap-3 bg-white rounded-md p-3.5 border border-slate-200"
                      >
                        <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── Visa Guides ──────────────────────────────────────── */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <FadeUp>
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-3 text-xs">Free guides</Badge>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Understand every visa type</h2>
              <p className="mt-3 text-slate-500">Detailed, jargon-free guides for every major US visa category</p>
            </div>
          </FadeUp>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
            {visaGuides.map((guide, i) => (
              <FadeUp key={guide.slug} delay={i * 0.08}>
                <Link href={`/guides/${guide.slug}`} className="block h-full">
                  <div className="h-full rounded-lg border border-slate-200 bg-white p-6 group hover:shadow-sm hover:border-slate-300 transition-all cursor-pointer">
                    <div className={`inline-flex rounded-xl p-3 text-2xl mb-4 ${guide.color}`}>{guide.icon}</div>
                    <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{guide.title}</h3>
                    <p className="mt-1 text-sm text-slate-500 leading-relaxed">{guide.subtitle}</p>
                    <div className="mt-4 flex items-center text-sm text-blue-600 font-medium">
                      Read guide <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── RFE callout ──────────────────────────────────────── */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <FadeUp>
            <div className="max-w-5xl mx-auto rounded-lg bg-white border border-red-200 p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="h-14 w-14 rounded-md bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                <Shield className="h-7 w-7 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-lg text-slate-900">RFE Prevention Guides</h3>
                  <Badge variant="destructive" className="text-xs">Real USCIS RFE Patterns</Badge>
                </div>
                <p className="text-sm text-slate-600 leading-6">
                  Built from actual USCIS Requests for Evidence — know which documents to collect from Day 1 of F-1 enrollment so you&apos;re never caught off guard.
                </p>
              </div>
              <Button variant="outline" className="shrink-0 border-red-300 text-red-700 hover:bg-red-50 bg-white" asChild>
                <Link href="/dashboard/tools/checklists">
                  View RFE Guides <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-950">
        <div className="container mx-auto px-4 text-center">
          <FadeUp>
            <div className="flex justify-center gap-3 mb-8">
              {[ListChecks, Bot, FileText].map((Icon, i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.2, delay: i * 0.3, repeat: Infinity, ease: "easeInOut" }}
                  className="h-12 w-12 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center"
                >
                  <Icon className="h-5 w-5 text-white" />
                </motion.div>
              ))}
            </div>
            <h2 className="text-4xl font-black text-white tracking-tight mb-4">
              Your status is too important to guess
            </h2>
            <p className="text-blue-100 max-w-xl mx-auto mb-8">
              Free checklists, AI guidance, and deadline tracking. No sign-up needed to browse the checklists.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" asChild className="bg-white text-blue-700 hover:bg-blue-50 border-0 shadow-lg font-semibold">
                <Link href="/dashboard/tools/checklists">
                  Browse Checklists Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                <Link href="/sign-up">Create Free Account</Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </div>
  );
}
