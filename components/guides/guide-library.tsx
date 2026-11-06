"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  BriefcaseBusiness,
  Compass,
  Globe2,
  GraduationCap,
  Heart,
  Plane,
  Search,
  Sprout,
} from "lucide-react";
import { visaGuides } from "@/config/navigation";

const categories = ["All guides", "Study", "Work", "Green cards", "Travel"];
const guideDetails = [
  { category: "Study", icon: GraduationCap, label: "A NEW BEGINNING" },
  { category: "Work", icon: BriefcaseBusiness, label: "AFTER GRADUATION" },
  { category: "Work", icon: Globe2, label: "YOUR NEXT CAREER MOVE" },
  { category: "Green cards", icon: Sprout, label: "PUTTING DOWN ROOTS" },
  { category: "Green cards", icon: Heart, label: "CLOSER TO YOUR PEOPLE" },
  { category: "Study", icon: BookOpen, label: "A WORLD OF EXPERIENCE" },
  { category: "Travel", icon: Plane, label: "THERE AND BACK AGAIN" },
];

export function GuideLibrary() {
  const [category, setCategory] = useState("All guides");
  const [query, setQuery] = useState("");
  const guides = visaGuides
    .map((g, i) => ({ ...g, ...guideDetails[i], number: i + 1 }))
    .filter(
      (g) =>
        (category === "All guides" || g.category === category) &&
        `${g.title} ${g.subtitle}`
          .toLowerCase()
          .includes(query.toLowerCase().trim()),
    );
  return (
    <div className="sc-library sc-container">
      <header className="sc-library-header">
        <div>
          <span className="sc-eyebrow">THE STATUSCLOCK GUIDE LIBRARY</span>
          <h1>
            A little knowledge.
            <br />
            <em>A world of possibility.</em>
          </h1>
          <p>
            Understand your options, untangle the terminology,
            <br className="sc-desktop-break" /> and feel more prepared for what
            comes next.
          </p>
        </div>
        <div className="sc-library-mark" aria-hidden="true">
          <BookOpen size={58} strokeWidth={0.75} />
          <span>
            FIELD NOTES
            <br />
            FOR YOUR FUTURE
          </span>
        </div>
      </header>
      <div className="sc-library-controls">
        <div role="group" aria-label="Filter guides by topic">
          {categories.map((c) => (
            <button
              key={c}
              aria-pressed={c === category}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="sc-library-search">
          <Search size={17} />
          <input
            aria-label="Search the guide library"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a guide…"
            type="search"
          />
        </label>
      </div>
      <p className="sc-library-count" aria-live="polite">
        {guides.length} {guides.length === 1 ? "guide" : "guides"} to help you
        move forward
      </p>
      <div className="sc-library-grid">
        {guides.map((g) => (
          <Link
            href={`/guides/${g.slug}`}
            className="sc-library-card"
            key={g.slug}
          >
            <div
              className={`sc-library-art sc-library-art-${g.category.toLowerCase().replace(" ", "-")}`}
            >
              <span>FIELD GUIDE / {String(g.number).padStart(2, "0")}</span>
              <g.icon size={68} strokeWidth={0.8} />
              <span>{g.label}</span>
              <div className="sc-library-art-circle" />
            </div>
            <div className="sc-library-card-copy">
              <span className="sc-eyebrow">{g.category}</span>
              <h2>{g.title}</h2>
              <p>{g.subtitle}</p>
              <span className="sc-library-read">
                Open the guide <ArrowUpRight size={18} />
              </span>
            </div>
          </Link>
        ))}
      </div>
      {guides.length === 0 && (
        <div className="sc-library-empty">
          <Search size={30} strokeWidth={1} />
          <h2>No guides found just yet.</h2>
          <p>Try a different search or explore all our guides.</p>
          <button
            className="sc-button sc-button-small"
            onClick={() => {
              setQuery("");
              setCategory("All guides");
            }}
          >
            Show all guides <ArrowUpRight size={16} />
          </button>
        </div>
      )}
      <div className="sc-library-help">
        <Compass size={33} strokeWidth={1} />
        <div>
          <h2>Not sure where to begin?</h2>
          <p>A few questions can point you toward a useful starting place.</p>
        </div>
        <Link href="/visa-finder" className="sc-button">
          Find my path <ArrowUpRight size={17} />
        </Link>
      </div>
    </div>
  );
}
