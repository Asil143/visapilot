"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Compass,
  ExternalLink,
  RotateCcw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type AnswerKey = "goal" | "location" | "profile" | "priority";
type Answers = Partial<Record<AnswerKey, string>>;

const questions: Array<{
  id: AnswerKey;
  eyebrow: string;
  title: string;
  description: string;
  options: Array<{ value: string; label: string; detail: string }>;
}> = [
  {
    id: "goal",
    eyebrow: "01 · Your goal",
    title: "What are you trying to do in the United States?",
    description:
      "Start with the outcome you want. You can refine the result in the next steps.",
    options: [
      {
        value: "study",
        label: "Study or train",
        detail: "University, college, English program, or vocational training",
      },
      {
        value: "work",
        label: "Work for a U.S. employer",
        detail: "A new job, post-graduation work, or a long-term role",
      },
      {
        value: "transfer",
        label: "Transfer within my company",
        detail: "Move to a U.S. office of an international employer",
      },
      {
        value: "exchange",
        label: "Join an exchange program",
        detail: "Research, teaching, internship, or cultural exchange",
      },
      {
        value: "permanent",
        label: "Pursue permanent residence",
        detail: "Employment-based or family-based green card planning",
      },
    ],
  },
  {
    id: "location",
    eyebrow: "02 · Where you are",
    title: "Where are you in the process?",
    description:
      "Some pathways are designed for consular processing; others may allow a change or extension of status.",
    options: [
      {
        value: "outside",
        label: "Outside the U.S.",
        detail: "I am planning a future move or applying from abroad",
      },
      {
        value: "student",
        label: "In the U.S. as a student",
        detail: "I have or expect to have F-1 student status",
      },
      {
        value: "worker",
        label: "In the U.S. working",
        detail: "I currently hold work-authorized or employment-based status",
      },
      {
        value: "other",
        label: "In the U.S. in another status",
        detail: "Visitor, dependent, exchange, or another status",
      },
    ],
  },
  {
    id: "profile",
    eyebrow: "03 · Your profile",
    title: "Which description fits you best?",
    description:
      "This helps us separate education, employer, and self-petition routes.",
    options: [
      {
        value: "student",
        label: "I am pursuing a degree or recently graduated",
        detail: "F-1, CPT, OPT, or STEM OPT may be relevant",
      },
      {
        value: "offer",
        label: "I have a U.S. job offer or sponsor",
        detail: "An employer may support a temporary or permanent route",
      },
      {
        value: "multinational",
        label: "I work for a multinational company",
        detail: "An intracompany transfer may be worth researching",
      },
      {
        value: "extraordinary",
        label: "I have strong achievements in my field",
        detail: "Awards, publications, press, or major contributions",
      },
      {
        value: "family",
        label: "I have a qualifying family relationship",
        detail: "A U.S. citizen or permanent resident relative may petition",
      },
    ],
  },
  {
    id: "priority",
    eyebrow: "04 · What matters most",
    title: "What is your biggest priority right now?",
    description:
      "There is no wrong answer. This changes the order we show your research paths.",
    options: [
      {
        value: "speed",
        label: "Start as soon as possible",
        detail: "I care most about the fastest realistic next step",
      },
      {
        value: "work",
        label: "Work authorization",
        detail: "I need a lawful way to work or keep working",
      },
      {
        value: "permanence",
        label: "A long-term plan",
        detail: "I want a path that can lead to a green card",
      },
      {
        value: "flexibility",
        label: "Flexibility",
        detail: "I want options if my job, school, or family situation changes",
      },
    ],
  },
];

type Result = {
  name: string;
  tag: string;
  summary: string;
  why: string;
  next: string;
  href: string;
  source: string;
  color: string;
};

const resultCatalog: Record<string, Result> = {
  f1: {
    name: "F-1 Student Visa",
    tag: "Study",
    summary:
      "The primary route for academic study at a U.S. school certified by SEVP.",
    why: "Your goal includes studying or you are already on a student track.",
    next: "Compare schools, request an I-20, and understand funds, intent, and status maintenance before applying.",
    href: "/guides/f1-visa",
    source: "https://studyinthestates.dhs.gov/students",
    color: "blue",
  },
  opt: {
    name: "OPT / STEM OPT",
    tag: "Work after study",
    summary:
      "Temporary work authorization connected to qualifying F-1 study and a field-related role.",
    why: "You are a student or recent graduate and want work authorization tied to your degree.",
    next: "Confirm your program end date with your DSO, map the I-765 window, and track unemployment limits.",
    href: "/guides/opt-stem-opt",
    source: "https://studyinthestates.dhs.gov/students-stem-opt",
    color: "purple",
  },
  h1b: {
    name: "H-1B Specialty Occupation",
    tag: "Employer-sponsored work",
    summary:
      "A common employer-sponsored route for specialty-occupation roles requiring a related degree or equivalent.",
    why: "You have a U.S. employer or want a longer-term employer-sponsored work plan.",
    next: "Ask the employer whether the role qualifies, whether registration is required, and how timing affects your current status.",
    href: "/guides/h1b-visa",
    source:
      "https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations",
    color: "green",
  },
  l1: {
    name: "L-1 Intracompany Transfer",
    tag: "Company transfer",
    summary:
      "For qualifying executives, managers, or specialized-knowledge employees transferring within a multinational company.",
    why: "You already work for an international company with a qualifying U.S. relationship.",
    next: "Document the company relationship, your qualifying employment abroad, and the role you will perform in the U.S.",
    href: "/visa-comparison",
    source:
      "https://www.uscis.gov/working-in-the-united-states/temporary-workers/l-1-intracompany-transferee-visa",
    color: "orange",
  },
  o1: {
    name: "O-1 Extraordinary Ability",
    tag: "High achievement",
    summary:
      "A petition-based route for people with extraordinary ability or achievement in sciences, education, business, athletics, or the arts.",
    why: "You described a record of notable achievements and may have evidence beyond a standard résumé.",
    next: "Inventory awards, press, judging, publications, original contributions, compensation, and expert letters.",
    href: "/visa-comparison",
    source:
      "https://www.uscis.gov/working-in-the-united-states/temporary-workers/o-1-visa-individuals-with-extraordinary-ability-or-achievement",
    color: "rose",
  },
  greenCard: {
    name: "Employment or Family Green Card",
    tag: "Permanent residence",
    summary:
      "Permanent residence planning may involve an employer, a self-petition, or a qualifying family relationship.",
    why: "Your priority is a long-term plan or you have an employer or family relationship that may support one.",
    next: "Identify the category, country of chargeability, priority-date mechanics, and whether a sponsor or petitioner is required.",
    href: "/guides/green-card",
    source: "https://www.uscis.gov/green-card",
    color: "emerald",
  },
  j1: {
    name: "J-1 Exchange Visitor",
    tag: "Exchange program",
    summary:
      "A program-based route for approved exchange categories such as research, teaching, internships, and training.",
    why: "Your goal is an approved exchange, research, teaching, internship, or training program.",
    next: "Confirm the program category and whether the two-year home-residence rule could apply to your situation.",
    href: "/guides/j1-visa",
    source: "https://j1visa.state.gov/programs/",
    color: "amber",
  },
};

function getResults(answers: Answers): Result[] {
  const results: string[] = [];
  if (answers.goal === "study") results.push("f1");
  if (answers.goal === "exchange") results.push("j1");
  if (answers.goal === "transfer" || answers.profile === "multinational")
    results.push("l1");
  if (answers.profile === "extraordinary") results.push("o1");
  if (
    answers.goal === "permanent" ||
    answers.priority === "permanence" ||
    answers.profile === "family"
  )
    results.push("greenCard");
  if (answers.goal === "work" || answers.profile === "offer") {
    if (answers.location === "student" || answers.profile === "student")
      results.push("opt");
    results.push("h1b");
  }
  if (answers.location === "student" && !results.includes("opt"))
    results.push("opt");
  if (results.length === 0) results.push("h1b", "f1", "greenCard");

  return [...new Set(results)]
    .map((key) => resultCatalog[key])
    .filter(Boolean)
    .slice(0, 3);
}

function colorClasses(color: string) {
  const map: Record<string, string> = {
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    purple: "border-purple-200 bg-purple-50 text-purple-700",
    green: "border-green-200 bg-green-50 text-green-700",
    orange: "border-orange-200 bg-orange-50 text-orange-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
  };
  return map[color] ?? map.blue;
}

export default function VisaFinderPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [complete, setComplete] = useState(false);
  const question = questions[step];
  const results = useMemo(() => getResults(answers), [answers]);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const hasInteracted = useRef(false);
  useEffect(() => {
    if (hasInteracted.current)
      questionHeading.current?.focus({ preventScroll: true });
  }, [step, complete]);

  function choose(value: string) {
    hasInteracted.current = true;
    const next = { ...answers, [question.id]: value };
    setAnswers(next);
    if (step === questions.length - 1) setComplete(true);
    else setStep((current) => current + 1);
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setComplete(false);
  }

  return (
    <div className="sc-finder min-h-screen text-foreground">
      <div className="border-b border-border">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" /> Back to StatusClock
          </Link>
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Visa Path Finder
          </span>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-5 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
            <Compass className="h-7 w-7" />
          </div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-blue-700">
            A clearer starting point
          </p>
          <h1 className="sc-finder-title">
            Every journey starts
            <br />
            with a <em>little clarity.</em>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            Answer four simple questions and get a personalized research map for
            your U.S. immigration journey. It takes about two minutes.
          </p>
        </div>

        <div className="sc-finder-question mx-auto mt-10 max-w-3xl rounded-lg border border-border bg-card p-5 sm:p-8">
          {!complete ? (
            <>
              <div className="mb-8 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Question {step + 1} of {questions.length}
                  </p>
                  <div className="mt-3 h-2 w-40 overflow-hidden rounded-full bg-slate-100 sm:w-64">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all"
                      style={{
                        width: `${((step + 1) / questions.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <ShieldCheck
                  className="h-5 w-5 text-green-600"
                  aria-label="Private on this device"
                />
              </div>

              <p className="text-sm font-bold text-blue-700">
                {question.eyebrow}
              </p>
              <h2
                ref={questionHeading}
                tabIndex={-1}
                className="mt-2 text-2xl font-bold tracking-tight text-slate-950"
              >
                {question.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                {question.description}
              </p>

              <div className="mt-7 grid gap-3">
                {question.options.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => choose(option.value)}
                    className="sc-finder-option group flex items-start justify-between gap-4 rounded-md border border-border p-4 text-left transition hover:border-primary/50 hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span>
                      <span className="block font-semibold text-slate-900">
                        {option.label}
                      </span>
                      <span className="mt-1 block text-sm leading-5 text-slate-500">
                        {option.detail}
                      </span>
                    </span>
                    <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600" />
                  </button>
                ))}
              </div>

              {step > 0 && (
                <button
                  type="button"
                  onClick={() => setStep((current) => current - 1)}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
                >
                  <ArrowLeft className="h-4 w-4" /> Previous question
                </button>
              )}
            </>
          ) : (
            <div>
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                    <Sparkles className="h-3.5 w-3.5" /> Your research map is
                    ready
                  </div>
                  <h2
                    ref={questionHeading}
                    tabIndex={-1}
                    className="text-2xl font-bold tracking-tight text-slate-950"
                  >
                    Start with these pathways
                  </h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                    These are research starting points, not a legal
                    recommendation. Your facts, nationality, status history, and
                    timing can change the answer.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-900"
                >
                  <RotateCcw className="h-4 w-4" /> Start over
                </button>
              </div>

              <div className="mt-7 space-y-4">
                {results.map((result, index) => (
                  <article
                    key={result.name}
                    className="rounded-2xl border border-slate-200 p-5 sm:p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-lg font-black ${colorClasses(result.color)}`}
                      >
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-slate-950">
                            {result.name}
                          </h3>
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[11px] font-bold ${colorClasses(result.color)}`}
                          >
                            {result.tag}
                          </span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {result.summary}
                        </p>
                        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                          <div className="rounded-xl bg-slate-50 p-3.5">
                            <span className="font-bold text-slate-800">
                              Why it appeared
                            </span>
                            <p className="mt-1 leading-5 text-slate-500">
                              {result.why}
                            </p>
                          </div>
                          <div className="rounded-xl bg-slate-50 p-3.5">
                            <span className="font-bold text-slate-800">
                              Your next move
                            </span>
                            <p className="mt-1 leading-5 text-slate-500">
                              {result.next}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-4">
                          <Link
                            href={result.href}
                            className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-900"
                          >
                            Read the StatusClock guide{" "}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                          <a
                            href={result.source}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
                          >
                            Official source{" "}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl bg-slate-950 p-5 text-center sm:flex-row sm:text-left">
                <div>
                  <p className="font-bold text-white">
                    Want a plan that remembers your dates?
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Create a free account to organize your profile, dates, and
                    documents.
                  </p>
                </div>
                <Button
                  asChild
                  className="shrink-0 bg-white text-slate-950 hover:bg-slate-100"
                >
                  <Link href="/sign-up">
                    Create free account <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-5 text-muted-foreground">
          StatusClock provides general educational information, not legal
          advice. Immigration rules and government processing practices change;
          verify important details with the official agency and a licensed
          attorney.
        </p>
      </div>
    </div>
  );
}
