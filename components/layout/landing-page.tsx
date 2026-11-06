"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  CheckCheck,
  ChevronDown,
  Compass,
  FileCheck2,
  Globe2,
  GraduationCap,
  Heart,
  MoveUpRight,
  Sparkles,
} from "lucide-react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { SourceLedger } from "./source-ledger";

const journeys = [
  {
    label: "Study in the U.S.",
    href: "/guides/f1-visa",
    short: "Study",
    icon: GraduationCap,
    detail: "From your first acceptance letter to what comes after graduation.",
    tags: "F-1 · OPT · STEM OPT",
    number: "01",
  },
  {
    label: "Build my career",
    href: "/guides/h1b-visa",
    short: "Work",
    icon: BriefcaseBusiness,
    detail: "Understand the possibilities for your next professional chapter.",
    tags: "H-1B · Employment pathways",
    number: "02",
  },
  {
    label: "Make the U.S. home",
    href: "/guides/green-card",
    short: "Stay",
    icon: Globe2,
    detail: "Make sense of green card pathways and the steps along the way.",
    tags: "EB-1 · EB-2 · EB-3",
    number: "03",
  },
  {
    label: "Join my family",
    href: "/guides/family-green-card",
    short: "Reunite",
    icon: Heart,
    detail: "Get closer to the people who make anywhere feel like home.",
    tags: "Family-based immigration",
    number: "04",
  },
];

function JourneyArtwork() {
  return (
    <div
      className="sc-journey-art"
      aria-label="Illustration of an open world and a personal immigration journey"
      role="img"
    >
      <div className="sc-art-caption">
        <span>THE WORLD IS OPEN.</span>
        <span>SO IS YOUR NEXT CHAPTER.</span>
      </div>
      <div className="sc-globe">
        <svg viewBox="0 0 420 420" fill="none" aria-hidden="true">
          <defs>
            <clipPath id="globe-clip">
              <circle cx="210" cy="210" r="193" />
            </clipPath>
          </defs>
          <circle
            cx="210"
            cy="210"
            r="193"
            fill="#dce4c9"
            stroke="#748367"
            strokeWidth="1"
          />
          <g clipPath="url(#globe-clip)">
            <path
              d="M55 72 99 49 138 64 159 94 142 117 157 141 132 164 143 190 112 202 107 227 84 209 66 170 34 147 21 101Z M133 219 164 217 189 246 191 282 169 313 154 360 135 341 124 307 109 275 114 244Z M219 59 269 41 318 64 361 73 402 110 399 149 362 145 343 177 321 160 297 194 273 174 257 129 228 123 209 92Z M224 159 261 153 290 181 295 219 270 258 249 300 230 281 225 242 207 212 201 184Z M335 276 369 262 398 285 398 313 367 326 337 310Z"
              fill="#a3b18e"
            />
            {[85, 145, 210, 275, 335].map((y) => (
              <path
                key={y}
                d={`M10 ${y} Q210 ${y + (210 - y) * 0.33} 410 ${y}`}
                stroke="#728466"
                strokeWidth=".7"
                opacity=".6"
              />
            ))}
            <ellipse
              cx="210"
              cy="210"
              rx="119"
              ry="193"
              stroke="#728466"
              strokeWidth=".7"
              opacity=".6"
            />
            <ellipse
              cx="210"
              cy="210"
              rx="53"
              ry="193"
              stroke="#728466"
              strokeWidth=".7"
              opacity=".6"
            />
            <path
              d="M17 210h386M210 17v386"
              stroke="#728466"
              strokeWidth=".7"
              opacity=".6"
            />
            <path
              d="M100 149Q215 18 322 162"
              stroke="#284b3b"
              strokeWidth="1.5"
              strokeDasharray="4 5"
            />
            <circle cx="100" cy="149" r="5" fill="#284b3b" />
            <circle cx="322" cy="162" r="5" fill="#284b3b" />
          </g>
        </svg>
      </div>
      <div className="sc-art-spark">✳</div>
      <div className="sc-passport">
        <span>
          EVERY JOURNEY
          <br />
          STARTS SOMEWHERE.
        </span>
        <Globe2 size={57} strokeWidth={0.7} />
        <strong>
          Your
          <br />
          <em>next chapter.</em>
        </strong>
        <span>STATUSCLOCK / FIELD NOTES</span>
      </div>
      <div className="sc-boarding-pass">
        <div className="sc-ticket-top">
          <span>YOUR JOURNEY, SIMPLIFIED</span>
          <MoveUpRight size={19} />
        </div>
        <div className="sc-ticket-route">
          <strong>Here</strong>
          <span>
            ········
            <ArrowRight size={18} />
            ········
          </span>
          <strong>There</strong>
        </div>
        <div className="sc-ticket-bottom">
          <div>
            <small>DESTINATION</small>
            <p>A world of possibility</p>
          </div>
          <div className="sc-barcode" />
        </div>
      </div>
    </div>
  );
}

export function LandingPage() {
  const [journey, setJourney] = useState("");
  return (
    <>
      <Navbar />
      <main id="main-content">
        <section className="sc-hero sc-container">
          <div className="sc-hero-copy">
            <div className="sc-eyebrow">
              <span className="sc-status-dot" /> YOUR U.S. IMMIGRATION COMPANION
            </div>
            <h1>
              A new country.
              <br />A clearer <em>path.</em>
            </h1>
            <p className="sc-hero-intro">
              Big dreams come with big questions.
              <br className="sc-desktop-break" /> Find the guidance, tools, and
              confidence
              <br className="sc-desktop-break" /> to take your next step.
            </p>
            <div className="sc-journey-picker">
              <label htmlFor="journey">I’M HERE TO</label>
              <div>
                <select
                  id="journey"
                  value={journey}
                  onChange={(e) => setJourney(e.target.value)}
                >
                  <option value="">Find my way forward</option>
                  {journeys.map((j) => (
                    <option value={j.href} key={j.href}>
                      {j.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} aria-hidden="true" />
                <Link
                  href={journey || "/visa-finder"}
                  aria-label="Explore my path"
                >
                  <ArrowUpRight size={23} />
                </Link>
              </div>
            </div>
            <div className="sc-hero-reassurance">
              <span>
                <Check size={14} /> Free tools to get started
              </span>
              <span>No account needed</span>
            </div>
          </div>
          <JourneyArtwork />
          <div className="sc-hero-footnote">
            <span>LESS GUESSWORK. MORE GOING PLACES.</span>
            <a href="#pathways">
              Explore what’s possible <ArrowRight size={15} />
            </a>
          </div>
        </section>
        <section className="sc-source-strip">
          <div className="sc-container">
            <p>
              Good decisions start
              <br />
              <strong>with the source.</strong>
            </p>
            <a
              href="https://www.uscis.gov/"
              target="_blank"
              rel="noopener noreferrer"
            >
              USCIS <ArrowUpRight size={14} />
            </a>
            <a
              href="https://travel.state.gov/"
              target="_blank"
              rel="noopener noreferrer"
            >
              U.S. Department of State <ArrowUpRight size={14} />
            </a>
            <a
              href="https://studyinthestates.dhs.gov/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Study in the States <ArrowUpRight size={14} />
            </a>
            <span>
              Official resources.
              <br />
              Always worth a closer look.
            </span>
          </div>
        </section>
        <section id="pathways" className="sc-section sc-container">
          <div className="sc-section-heading">
            <div>
              <span className="sc-eyebrow">01 / FIND YOUR DIRECTION</span>
              <h2>
                Different dreams.
                <br />
                <em>A path for yours.</em>
              </h2>
            </div>
            <p>
              There’s no one-size-fits-all journey.
              <br />
              Start with what brings you here.
            </p>
          </div>
          <div className="sc-path-grid">
            {journeys.map((j) => (
              <Link href={j.href} className="sc-path-card" key={j.href}>
                <div className="sc-path-top">
                  <j.icon size={28} strokeWidth={1.2} />
                  <span>{j.number}</span>
                </div>
                <h3>
                  {j.short}
                  <span>↗</span>
                </h3>
                <p>{j.detail}</p>
                <div className="sc-path-tags">{j.tags}</div>
              </Link>
            ))}
          </div>
          <div className="sc-section-caption">
            <Compass size={17} />
            <span>Not sure where you fit?</span>
            <Link href="/visa-finder">
              Find your path in a few questions <ArrowRight size={15} />
            </Link>
          </div>
        </section>
        <section className="sc-toolkit">
          <div className="sc-container sc-toolkit-grid">
            <div className="sc-toolkit-copy">
              <span className="sc-eyebrow">02 / MAKE ROOM FOR WHAT’S NEXT</span>
              <h2>
                A little order.
                <br />A lot more
                <br />
                <em>peace of mind.</em>
              </h2>
              <p>
                Keep the dates, documents, and details together. Give your next
                chapter the headspace it deserves.
              </p>
              <Link href="/dashboard" className="sc-button sc-button-lime">
                Explore your workspace <ArrowUpRight size={18} />
              </Link>
              <span className="sc-toolkit-note">
                Take a look around. Make it yours when you’re ready.
              </span>
            </div>
            <div className="sc-workspace-preview">
              <div className="sc-preview-toolbar">
                <span>
                  <i />
                  <i />
                  <i />
                </span>
                <p>YOUR PERSONAL WORKSPACE</p>
                <span className="sc-preview-label">PREVIEW</span>
              </div>
              <div className="sc-preview-body">
                <div className="sc-preview-heading">
                  <div>
                    <small>ONE STEP AT A TIME</small>
                    <h3>You’ve got this.</h3>
                  </div>
                  <span className="sc-preview-avatar">SC</span>
                </div>
                <div className="sc-preview-stats">
                  <div>
                    <CalendarDays size={18} />
                    <strong>Your timeline</strong>
                    <span>See what’s coming</span>
                  </div>
                  <div>
                    <FileCheck2 size={18} />
                    <strong>Your documents</strong>
                    <span>Everything in its place</span>
                  </div>
                </div>
                <div className="sc-preview-list">
                  <div>
                    <h4>Your next steps</h4>
                    <span>START HERE</span>
                  </div>
                  {[
                    "Create your immigration profile",
                    "Add the dates that matter",
                    "Build your document checklist",
                  ].map((s, i) => (
                    <p key={s}>
                      <span className={i === 0 ? "sc-step-complete" : ""}>
                        {i === 0 ? <Check size={12} /> : i + 1}
                      </span>
                      {s}
                      <ArrowUpRight size={14} />
                    </p>
                  ))}
                </div>
                <div className="sc-preview-tip">
                  <Sparkles size={18} />
                  <p>
                    A question on your mind?
                    <br />
                    <strong>Your AI companion is a click away.</strong>
                  </p>
                  <ArrowUpRight size={18} />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="sc-section sc-container">
          <div className="sc-section-heading">
            <div>
              <span className="sc-eyebrow">03 / A TOOL FOR EVERY TURN</span>
              <h2>
                Less searching.
                <br />
                <em>More understanding.</em>
              </h2>
            </div>
            <Link href="/dashboard/tools/checklists" className="sc-text-link">
              Explore the toolkit <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="sc-resource-grid">
            {[
              {
                icon: CheckCheck,
                name: "Your next step, checked.",
                desc: "Turn a complicated process into a checklist you can actually follow.",
                link: "/dashboard/tools/checklists",
                tag: "VISA CHECKLISTS",
              },
              {
                icon: CalendarDays,
                name: "Make every day count.",
                desc: "Keep track of employment periods and your OPT unemployment days.",
                link: "/dashboard/tools/opt-tracker",
                tag: "OPT DAY COUNTER",
              },
              {
                icon: BookOpen,
                name: "The fine print, unpacked.",
                desc: "Explore guides that help you understand the terms, forms, and process.",
                link: "/guides",
                tag: "THE GUIDE LIBRARY",
              },
            ].map((r) => (
              <Link href={r.link} className="sc-resource-card" key={r.tag}>
                <div>
                  <r.icon size={25} strokeWidth={1.2} />
                  <ArrowUpRight size={21} />
                </div>
                <span className="sc-eyebrow">{r.tag}</span>
                <h3>{r.name}</h3>
                <p>{r.desc}</p>
              </Link>
            ))}
          </div>
        </section>
        <SourceLedger />
        <section className="sc-human-note sc-container">
          <div className="sc-note-symbol">✳</div>
          <div>
            <span className="sc-eyebrow">
              BUILT AROUND YOU, NOT THE PAPERWORK.
            </span>
            <h2>
              Behind every application
              <br />
              is a <em>whole life.</em>
            </h2>
            <p>
              The degree. The dream job. The people you love.
              <br />
              We’re here to help you make sense of the journey.
            </p>
            <Link href="/about" className="sc-text-link">
              Get to know StatusClock <ArrowUpRight size={17} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
