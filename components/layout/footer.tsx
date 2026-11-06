import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "./brand";

const columns = [
  {
    title: "Explore",
    links: [
      ["Visa guides", "/guides"],
      ["Visa path finder", "/visa-finder"],
      ["Source center", "/source-center"],
      ["The journal", "/blog"],
      ["Glossary", "/glossary"],
    ],
  },
  {
    title: "Get organized",
    links: [
      ["My dashboard", "/dashboard"],
      ["Checklists", "/dashboard/tools/checklists"],
      ["OPT day counter", "/dashboard/tools/opt-tracker"],
      ["Visa bulletin", "/dashboard/tools/visa-bulletin"],
      ["Fee calculator", "/dashboard/tools/fee-calculator"],
    ],
  },
  {
    title: "StatusClock",
    links: [
      ["Our story", "/about"],
      ["Plans & pricing", "/pricing"],
      ["Find a lawyer", "/lawyers"],
      ["Community", "/community"],
      ["Contact & help", "/contact"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="sc-footer">
      <div className="sc-container">
        <div className="sc-footer-top">
          <div>
            <span className="sc-eyebrow">For the life you’re building.</span>
            <p>
              Your next chapter
              <br />
              starts with <em>clarity.</em>
            </p>
          </div>
          <Link
            className="sc-round-link"
            href="/visa-finder"
            aria-label="Find your visa path"
          >
            <ArrowUpRight size={34} />
          </Link>
        </div>
        <div className="sc-footer-grid">
          <div className="sc-footer-about">
            <Brand light />
            <p>
              A little less uncertainty.
              <br />A lot more possibility.
              <br />
              Your U.S. immigration companion.
            </p>
          </div>
          {columns.map((c) => (
            <div key={c.title}>
              <h2>{c.title}</h2>
              {c.links.map(([label, href]) => (
                <Link key={href} href={href}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div className="sc-footer-bottom">
          <p>© {new Date().getFullYear()} StatusClock</p>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/faq">FAQs</Link>
          </div>
          <p>Made for people going places.</p>
        </div>
        <p className="sc-footer-note">
          Independent educational resources, not legal advice or a government
          service. Confirm requirements with official sources and consult a
          qualified immigration attorney about your situation.
        </p>
      </div>
    </footer>
  );
}
