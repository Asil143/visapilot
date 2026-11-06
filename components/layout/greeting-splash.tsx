"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bot } from "lucide-react";

const GREETINGS = [
  { text: "Hello", lang: "English", from: "#1d4ed8", via: "#2563eb", to: "#06b6d4" },
  { text: "Hola", lang: "Español", from: "#c026d3", via: "#e11d48", to: "#f97316" },
  { text: "नमस्ते", lang: "हिन्दी", from: "#b45309", via: "#dc2626", to: "#db2777" },
  { text: "నమస్కారం", lang: "తెలుగు", from: "#047857", via: "#0ea5e9", to: "#4f46e5" },
];

const STORAGE_KEY = "statusclock_greeted";
const STEP_MS = 550;

export function GreetingSplash() {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [idx, setIdx] = useState(0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const alreadyGreeted = sessionStorage.getItem(STORAGE_KEY);
    if (!alreadyGreeted) sessionStorage.setItem(STORAGE_KEY, "1");
    Promise.resolve().then(() => {
      if (!alreadyGreeted && !reduceMotion) setVisible(true);
      setMounted(true);
    });
  }, [reduceMotion]);

  useEffect(() => {
    if (!visible || closing) return;
    if (idx >= GREETINGS.length - 1) {
      const t = setTimeout(() => setClosing(true), STEP_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIdx((i) => i + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [visible, closing, idx]);

  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(() => setVisible(false), 700);
    return () => clearTimeout(t);
  }, [closing]);

  if (!mounted || !visible) return null;

  const g = GREETINGS[idx];

  function skip() {
    if (!closing) setClosing(true);
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] cursor-pointer select-none overflow-hidden bg-[#05060f]"
      initial={{ clipPath: "circle(150% at 50% 50%)" }}
      animate={{ clipPath: closing ? "circle(0% at 50% 50%)" : "circle(150% at 50% 50%)" }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      onClick={skip}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " " || e.key === "Escape") {
          e.preventDefault();
          skip();
        }
      }}
      role="dialog"
      aria-label="Welcome to StatusClock. Press Enter to skip."
      tabIndex={0}
    >
      <AnimatePresence>
        <motion.div
          key={idx}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 30% 20%, ${g.from}55, transparent 55%), radial-gradient(circle at 75% 80%, ${g.to}55, transparent 55%), linear-gradient(135deg, ${g.from}, ${g.via}, ${g.to})`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        />
      </AnimatePresence>

      <div className="relative flex h-full flex-col items-center justify-center px-6">
        <div className="mb-10 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[#1d4ed8]">
            <Bot className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold tracking-wide text-white/90">StatusClock</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <span
              className="text-[clamp(3rem,10vw,6.5rem)] font-black leading-none tracking-tight text-white"
              style={{ fontFamily: "system-ui, 'Noto Sans', 'Noto Sans Devanagari', 'Noto Sans Telugu', sans-serif" }}
            >
              {g.text}
            </span>
            <span className="mt-3 text-xs font-semibold uppercase tracking-[0.35em] text-white/70 sm:text-sm">
              {g.lang}
            </span>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center gap-1.5" aria-hidden="true">
          {GREETINGS.map((item, i) => (
            <span
              key={item.lang}
              className={`h-1 rounded-full transition-all duration-500 ${
                i === idx ? "w-8 bg-white" : i < idx ? "w-1.5 bg-white/70" : "w-1.5 bg-white/25"
              }`}
            />
          ))}
        </div>

        <p className="absolute bottom-8 text-[11px] uppercase tracking-[0.25em] text-white/70">
          Press Enter or tap to skip
        </p>
      </div>
    </motion.div>
  );
}
