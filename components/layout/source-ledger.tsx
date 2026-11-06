import Link from "next/link";
import { ArrowUpRight, Check, ExternalLink, ShieldCheck } from "lucide-react";

const sources = [
  {
    name: "USCIS",
    label: "Forms, current fees & case status",
    href: "https://www.uscis.gov/sites/default/files/document/forms/g-1055.pdf",
    kind: "Government source",
  },
  {
    name: "DOS Visa Bulletin",
    label: "Priority dates & visa availability",
    href: "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html",
    kind: "Updated monthly",
  },
  {
    name: "Study in the States",
    label: "F-1, OPT & STEM reporting",
    href: "https://studyinthestates.dhs.gov/",
    kind: "DHS / SEVP",
  },
  {
    name: "DOJ EOIR",
    label: "Authorized legal representatives",
    href: "https://www.justice.gov/eoir/recognition-accreditation-roster-reports",
    kind: "Verify a provider",
  },
];

export function SourceLedger({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className={`sc-source-ledger${compact ? " sc-source-ledger-compact" : ""}`}
    >
      <div className="sc-source-ledger-heading">
        <div>
          <span className="sc-eyebrow">
            <ShieldCheck size={13} /> SOURCE FIRST
          </span>
          <h2>
            Clarity should show
            <br />
            <em>where it comes from.</em>
          </h2>
        </div>
        <p>
          Rules and timelines move. We make the official source part of the
          experience so you can verify the detail that matters to you.
        </p>
      </div>
      <div className="sc-source-ledger-grid">
        {sources.map((source) => (
          <a
            href={source.href}
            target="_blank"
            rel="noopener noreferrer"
            key={source.name}
            className="sc-source-ledger-card"
          >
            <div className="sc-source-ledger-card-top">
              <span className="sc-source-mark">
                <Check size={14} />
              </span>
              <small>{source.kind}</small>
              <ArrowUpRight size={17} />
            </div>
            <strong>{source.name}</strong>
            <p>{source.label}</p>
            <span className="sc-source-ledger-link">
              Open official source <ExternalLink size={12} />
            </span>
          </a>
        ))}
      </div>
      <div className="sc-source-ledger-foot">
        <span>
          <Check size={13} /> Every guide links back to the agency that owns the
          rule.
        </span>
        <Link href="/source-center">
          Explore the source center <ArrowUpRight size={15} />
        </Link>
      </div>
    </section>
  );
}
