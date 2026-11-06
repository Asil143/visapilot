import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  ExternalLink,
  FileCheck2,
  Globe2,
  Landmark,
  Scale,
  ShieldCheck,
  Timer,
} from "lucide-react";

export const metadata = {
  title: "Source Center",
  description:
    "Official U.S. immigration sources for forms, fees, case status, processing times, Visa Bulletin dates, and student reporting.",
};

const sourceGroups = [
  {
    icon: Landmark,
    eyebrow: "USCIS / DHS",
    title: "Applications and cases",
    description:
      "Use the agency that receives your filing for the current form edition, filing fee, case status, processing estimate, and case inquiry options.",
    links: [
      ["Forms and filing fees", "https://www.uscis.gov/forms/all-forms"],
      ["USCIS fee schedule (Form G-1055)", "https://www.uscis.gov/sites/default/files/document/forms/g-1055.pdf"],
      [
        "Case status",
        "https://www.uscis.gov/tools/checking-your-case-status-online",
      ],
      ["Live processing times", "https://egov.uscis.gov/processing-times/check"],
    ],
    color: "green",
  },
  {
    icon: Timer,
    eyebrow: "DEPARTMENT OF STATE",
    title: "Dates that move",
    description:
      "Visa Bulletin dates describe immigrant visa availability. Compare your priority date with the right chart and confirm whether USCIS permits the filing chart for adjustment cases.",
    links: [
      [
        "Current Visa Bulletin",
        "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html",
      ],
      [
        "Visa application fees",
        "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/fees/fees-visa-services.html",
      ],
      [
        "IV scheduling status tool",
        "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/iv-wait-times.html",
      ],
      ["USCIS Visa Bulletin info", "https://www.uscis.gov/visabulletininfo"],
    ],
    color: "clay",
  },
  {
    icon: FileCheck2,
    eyebrow: "STUDY IN THE STATES / SEVP",
    title: "Student status and reporting",
    description:
      "F-1 and STEM OPT students still work with their DSO. Use official SEVP guidance for employment, employer changes, validation reports, and the SEVP Portal.",
    links: [
      ["F-1 student resources", "https://studyinthestates.dhs.gov/students"],
      ["I-901 SEVIS fee", "https://www.ice.gov/sevis/i901"],
      ["SEVP Portal guide", "https://studyinthestates.dhs.gov/sevp-portal"],
      [
        "STEM OPT reporting",
        "https://studyinthestates.dhs.gov/stem-opt-extension-overview",
      ],
    ],
    color: "sage",
  },
  {
    icon: Scale,
    eyebrow: "LEGAL SUPPORT",
    title: "When a person should join",
    description:
      "A tool can organize facts and point to sources. Case-specific strategy, notices, status violations, and high-risk travel decisions deserve a licensed attorney or authorized representative.",
    links: [
      ["Find an immigration attorney", "/lawyers"],
      [
        "DOJ accredited representatives",
        "https://www.justice.gov/eoir/recognition-accreditation-roster-reports",
      ],
      ["Avoid immigration scams", "https://www.uscis.gov/avoid-scams"],
    ],
    color: "sand",
  },
];

export default function SourceCenterPage() {
  return (
    <div className="sc-source-center">
      <section className="sc-source-center-hero">
        <div className="sc-container">
          <div className="sc-source-center-kicker">
            <ShieldCheck size={16} /> THE TRUST LAYER
          </div>
          <h1>
            Know what to trust.
            <br />
            <em>Know what to do next.</em>
          </h1>
          <p>
            Immigration information is only useful when it is current,
            attributable, and connected to an action you can take.
          </p>
          <div className="sc-source-center-pills">
            <span>
              <Check size={14} /> Official links
            </span>
            <span>
              <Check size={14} /> Context in plain language
            </span>
            <span>
              <Check size={14} /> A clear next step
            </span>
          </div>
        </div>
      </section>
      <main className="sc-container sc-source-center-main">
        <div className="sc-source-center-intro">
          <div>
            <span className="sc-eyebrow">A FIELD GUIDE TO THE SOURCES</span>
            <h2>
              Start with the agency
              <br />
              <em>that owns the answer.</em>
            </h2>
          </div>
          <p>
            StatusClock helps you prepare and understand. The agency website,
            your notice, your DSO, or your attorney remains the authority for
            your case.
          </p>
        </div>
        <div className="sc-source-groups">
          {sourceGroups.map((group) => (
            <section
              className={`sc-source-group sc-source-group-${group.color}`}
              key={group.title}
            >
              <div className="sc-source-group-icon">
                <group.icon size={25} strokeWidth={1.2} />
              </div>
              <div className="sc-source-group-copy">
                <span className="sc-eyebrow">{group.eyebrow}</span>
                <h2>{group.title}</h2>
                <p>{group.description}</p>
                <div className="sc-source-group-links">
                  {group.links.map(([label, href]) => (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      key={label}
                    >
                      {label}
                      {href.startsWith("http") ? (
                        <ExternalLink size={14} />
                      ) : (
                        <ArrowUpRight size={14} />
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
        <section className="sc-source-center-principles">
          <div>
            <Globe2 size={26} strokeWidth={1.2} />
            <h2>How to use a changing source</h2>
          </div>
          <ol>
            <li>
              <span>01</span>
              <p>
                <strong>Read the notice you received.</strong> A receipt, I-20,
                I-797, or Visa Bulletin category changes which official page
                applies.
              </p>
            </li>
            <li>
              <span>02</span>
              <p>
                <strong>Check the date.</strong> Processing times and Visa
                Bulletin tables are snapshots, not guarantees.
              </p>
            </li>
            <li>
              <span>03</span>
              <p>
                <strong>Save your evidence.</strong> Keep a copy of the page,
                notice, filing, and the date you checked it.
              </p>
            </li>
            <li>
              <span>04</span>
              <p>
                <strong>Escalate when facts get risky.</strong> A qualified
                professional can analyze your personal history and options.
              </p>
            </li>
          </ol>
        </section>
        <div className="sc-source-center-cta">
          <div>
            <span className="sc-eyebrow">READY WHEN YOU ARE</span>
            <h2>
              Build a plan around
              <br />
              <em>the facts you have.</em>
            </h2>
          </div>
          <Link className="sc-button sc-button-lime" href="/visa-finder">
            Start with the path finder <ArrowUpRight size={17} />
          </Link>
        </div>
      </main>
    </div>
  );
}
