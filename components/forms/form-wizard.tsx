"use client";

import { useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2 } from "lucide-react";

export interface FormQuestion {
  id: string;
  part: string;
  partTitle: string;
  label: string;
  question: string;
  hint: string;
  optional?: boolean;
  options?: string[];
}

export interface FormPart {
  id: string;
  title: string;
}

export type Fields = Record<string, string>;

interface Message {
  role: "assistant" | "user";
  content: string;
}

export type WizardColor =
  | "blue" | "purple" | "sky" | "emerald" | "rose"
  | "amber" | "indigo" | "teal" | "violet" | "orange";

// Tailwind needs literal class names to appear in source for JIT to pick them
// up — this map keeps every variant's classes fully spelled out so the
// per-form `color` prop can vary at runtime without breaking styling.
const THEME: Record<WizardColor, {
  iconBg: string; iconText: string; avatarBg: string;
  userBubble: string; progressBar: string;
  optionHover: string; inputFocus: string; button: string;
}> = {
  blue: { iconBg: "bg-blue-50", iconText: "text-blue-600", avatarBg: "bg-blue-600", userBubble: "bg-blue-600", progressBar: "bg-blue-500", optionHover: "hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700", inputFocus: "focus:border-blue-400", button: "bg-blue-600 hover:bg-blue-700" },
  purple: { iconBg: "bg-purple-50", iconText: "text-purple-600", avatarBg: "bg-purple-600", userBubble: "bg-purple-600", progressBar: "bg-purple-500", optionHover: "hover:border-purple-400 hover:bg-purple-50 hover:text-purple-700", inputFocus: "focus:border-purple-400", button: "bg-purple-600 hover:bg-purple-700" },
  sky: { iconBg: "bg-sky-50", iconText: "text-sky-600", avatarBg: "bg-sky-600", userBubble: "bg-sky-600", progressBar: "bg-sky-500", optionHover: "hover:border-sky-400 hover:bg-sky-50 hover:text-sky-700", inputFocus: "focus:border-sky-400", button: "bg-sky-600 hover:bg-sky-700" },
  emerald: { iconBg: "bg-emerald-50", iconText: "text-emerald-600", avatarBg: "bg-emerald-600", userBubble: "bg-emerald-600", progressBar: "bg-emerald-500", optionHover: "hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-700", inputFocus: "focus:border-emerald-400", button: "bg-emerald-600 hover:bg-emerald-700" },
  rose: { iconBg: "bg-rose-50", iconText: "text-rose-600", avatarBg: "bg-rose-600", userBubble: "bg-rose-600", progressBar: "bg-rose-500", optionHover: "hover:border-rose-400 hover:bg-rose-50 hover:text-rose-700", inputFocus: "focus:border-rose-400", button: "bg-rose-600 hover:bg-rose-700" },
  amber: { iconBg: "bg-amber-50", iconText: "text-amber-600", avatarBg: "bg-amber-600", userBubble: "bg-amber-600", progressBar: "bg-amber-500", optionHover: "hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700", inputFocus: "focus:border-amber-400", button: "bg-amber-600 hover:bg-amber-700" },
  indigo: { iconBg: "bg-indigo-50", iconText: "text-indigo-600", avatarBg: "bg-indigo-600", userBubble: "bg-indigo-600", progressBar: "bg-indigo-500", optionHover: "hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700", inputFocus: "focus:border-indigo-400", button: "bg-indigo-600 hover:bg-indigo-700" },
  teal: { iconBg: "bg-teal-50", iconText: "text-teal-600", avatarBg: "bg-teal-600", userBubble: "bg-teal-600", progressBar: "bg-teal-500", optionHover: "hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700", inputFocus: "focus:border-teal-400", button: "bg-teal-600 hover:bg-teal-700" },
  violet: { iconBg: "bg-violet-50", iconText: "text-violet-600", avatarBg: "bg-violet-600", userBubble: "bg-violet-600", progressBar: "bg-violet-500", optionHover: "hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700", inputFocus: "focus:border-violet-400", button: "bg-violet-600 hover:bg-violet-700" },
  orange: { iconBg: "bg-orange-50", iconText: "text-orange-600", avatarBg: "bg-orange-600", userBubble: "bg-orange-600", progressBar: "bg-orange-500", optionHover: "hover:border-orange-400 hover:bg-orange-50 hover:text-orange-700", inputFocus: "focus:border-orange-400", button: "bg-orange-600 hover:bg-orange-700" },
};

export interface WizardNotice {
  tone: "amber" | "green" | "blue";
  text: React.ReactNode;
}

const NOTICE_STYLES: Record<WizardNotice["tone"], string> = {
  amber: "bg-amber-50 border-amber-200 text-amber-800",
  green: "bg-green-50 border-green-200 text-green-800",
  blue: "bg-blue-50 border-blue-200 text-blue-800",
};

export interface FormWizardProps {
  formNumber: string;
  /** e.g. "Affidavit of Support" — combined with formNumber for headings. */
  subtitle: string;
  formTypeForSubmission: string;
  icon: LucideIcon;
  color: WizardColor;
  questions: FormQuestion[];
  parts: FormPart[];
  description: string;
  subtext?: string;
  notices?: WizardNotice[];
  normalize: (fieldId: string, raw: string) => string;
  /** Called once on mount; return prefilled field values (e.g. from profile/documents). */
  prefill?: () => Promise<Fields>;
}

export function FormWizard({
  formNumber, subtitle, formTypeForSubmission, icon: Icon, color,
  questions, parts, description, subtext, notices, normalize, prefill,
}: FormWizardProps) {
  const theme = THEME[color];
  const [messages, setMessages] = useState<Message[]>([]);
  const [fields, setFields] = useState<Fields>({});
  const [currentQuestion, setCurrentQuestion] = useState<FormQuestion | null>(null);
  const [input, setInput] = useState("");
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [started, setStarted] = useState(false);
  const [prefillCount, setPrefillCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!prefill) return;
    prefill().then((f) => {
      const count = Object.keys(f).length;
      if (count > 0) {
        setFields(f);
        setPrefillCount(count);
      }
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function startForm() {
    setStarted(true);
    const first = questions.find((q) => !fields[q.id]) ?? questions[0];
    setCurrentQuestion(first);
    const openingMsg: Message = prefillCount > 0
      ? { role: "assistant", content: `✓ Pre-filled ${prefillCount} field${prefillCount > 1 ? "s" : ""} from your profile.\n\nLet's fill in the remaining questions:\n\n${first.question}` }
      : { role: "assistant", content: first.question };
    setMessages([openingMsg]);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function advanceQuestion(currentQ: FormQuestion, userAnswer: string, normalized: string) {
    const updatedFields = { ...fields, [currentQ.id]: normalized };
    setFields(updatedFields);

    const currentIdx = questions.findIndex((q) => q.id === currentQ.id);
    const nextQ = questions[currentIdx + 1] ?? null;
    setProgress(Math.round(((currentIdx + 1) / questions.length) * 100));
    setMessages((prev) => [...prev, { role: "user", content: userAnswer }]);

    if (nextQ) {
      const partChanged = nextQ.part !== currentQ.part;
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: partChanged
          ? `✓ Saved.\n\n**${nextQ.part}: ${nextQ.partTitle}**\n\n${nextQ.question}`
          : `✓ Saved.\n\n${nextQ.question}`,
      }]);
      setCurrentQuestion(nextQ);
    } else {
      setIsComplete(true);
      setCurrentQuestion(null);
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: `✅ Worksheet complete for Form ${formNumber}.\n\nYour answers are saved as a data sheet organized by Part and Item number. Download the official USCIS PDF and copy your answers into it — StatusClock does not file with USCIS or generate a filled official form.`,
      }]);
      fetch("/api/forms/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form_type: formTypeForSubmission, fields: updatedFields }),
      }).catch(console.error);
    }
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function sendAnswer() {
    if (!input.trim() || !currentQuestion) return;
    const userAnswer = input.trim();
    setInput("");
    advanceQuestion(currentQuestion, userAnswer, normalize(currentQuestion.id, userAnswer));
  }

  function skipQuestion() {
    if (!currentQuestion) return;
    advanceQuestion(currentQuestion, "Skip", "N/A");
  }

  const currentPart = currentQuestion ? parts.find((p) => p.id === currentQuestion.part) : null;

  if (!started) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center">
        <div className={`w-14 h-14 rounded-2xl ${theme.iconBg} flex items-center justify-center mb-5`}>
          <Icon className={`h-7 w-7 ${theme.iconText}`} />
        </div>
        <h1 className="text-2xl font-bold mb-2">{formNumber} {subtitle}</h1>
        <p className="text-muted-foreground text-sm max-w-md mb-2">{description}</p>
        {subtext && <p className="text-xs text-slate-500 max-w-sm mb-6">{subtext}</p>}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {parts.map((p) => (
            <span key={p.id} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{p.id}</span>
          ))}
        </div>
        {prefillCount > 0 && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 text-sm text-green-800 max-w-md">
            <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
            <span><strong>{prefillCount} field{prefillCount > 1 ? "s" : ""}</strong> pre-filled from your profile — we&apos;ll skip to unanswered questions.</span>
          </div>
        )}
        {notices?.map((n, i) => (
          <div key={i} className={`flex items-start gap-2 rounded-xl px-4 py-3 mb-4 text-sm max-w-md border ${NOTICE_STYLES[n.tone]}`}>
            <span>{n.text}</span>
          </div>
        ))}
        <Button size="lg" onClick={startForm} className={`px-8 ${theme.button}`}>
          {prefillCount > 0
            ? `Continue ${formNumber} (${questions.length - prefillCount} questions left) →`
            : `Start ${formNumber} worksheet →`}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="border-b bg-white px-6 py-2.5 flex items-center gap-4 shrink-0">
        <Icon className={`h-5 w-5 ${theme.iconText} shrink-0`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">Form {formNumber} — {subtitle}</p>
          {currentPart && <p className="text-xs text-muted-foreground truncate">{currentPart.id} · {currentPart.title}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-36 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full ${theme.progressBar} rounded-full transition-all duration-500`} style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs text-muted-foreground w-8 text-right">{progress}%</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col bg-slate-50">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className={`w-7 h-7 rounded-full ${theme.avatarBg} text-white text-[10px] font-bold flex items-center justify-center mr-2 shrink-0 mt-0.5`}>SC</div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm whitespace-pre-wrap leading-relaxed ${
                  m.role === "user"
                    ? `${theme.userBubble} text-white rounded-br-sm`
                    : "bg-white text-slate-800 border border-slate-200 rounded-bl-sm shadow-sm"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isComplete && (
              <div className="flex justify-center pt-2">
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 text-sm text-green-700 font-medium">
                  <CheckCircle2 className="h-4 w-4" /> Worksheet saved — copy these answers into the official USCIS PDF
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {!isComplete && (
            <div className="border-t bg-white p-3 space-y-2">
              {currentQuestion?.optional && (
                <div className="flex justify-end">
                  <button onClick={skipQuestion} className="text-xs text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors">
                    Skip (not applicable)
                  </button>
                </div>
              )}
              {currentQuestion?.options ? (
                <div className="flex flex-col gap-1.5">
                  {currentQuestion.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => advanceQuestion(currentQuestion, opt, normalize(currentQuestion.id, opt))}
                      className={`w-full text-left rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm transition-colors ${theme.optionHover}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  {currentQuestion && (
                    <span className="text-[10px] text-slate-400 shrink-0 hidden sm:block max-w-[90px] truncate">{currentQuestion.hint}</span>
                  )}
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendAnswer()}
                    placeholder="Type your answer…"
                    className={`flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:bg-white transition-colors ${theme.inputFocus}`}
                  />
                  <Button size="sm" onClick={sendAnswer} disabled={!input.trim()} className={`h-9 w-9 p-0 rounded-xl shrink-0 ${theme.button}`}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
