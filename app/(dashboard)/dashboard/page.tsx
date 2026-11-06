"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Clock3,
  FileText,
  FolderOpen,
  GraduationCap,
  Sparkles,
  UserRound,
  Compass,
  CircleAlert,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { GuestPreviewBanner } from "@/components/ui/guest-preview-banner";
import { formatDateLong, formatDateShort } from "@/lib/utils/date";

function daysUntil(dateStr: string) {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

interface DeadlineAlert {
  label: string;
  days: number;
  date: string;
  priority: "critical" | "high" | "medium";
  action: string;
  actionHref: string;
}

interface StemDeadline {
  date: string; // ISO yyyy-mm-dd
  label: string;
  type: "validation" | "evaluation";
  daysUntil: number;
  isPast: boolean;
}

function addMonths(dateStr: string, months: number): string {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split("T")[0];
}

function computeStemOptDeadlines(startDate: string): StemDeadline[] {
  const deadlines: StemDeadline[] = [];
  const schedule = [
    { months: 6, type: "validation" as const },
    { months: 12, type: "validation" as const },
    { months: 12, type: "evaluation" as const },
    { months: 18, type: "validation" as const },
    { months: 24, type: "validation" as const },
    { months: 24, type: "evaluation" as const },
  ];
  const labels: Record<string, string> = {
    validation: "Validation report — confirm address & employer in SEVIS",
    evaluation: "Form I-983 (page 5) — Evaluation of Student Progress",
  };
  for (const s of schedule) {
    const date = addMonths(startDate, s.months);
    const days = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
    deadlines.push({
      date,
      label: labels[s.type],
      type: s.type,
      daysUntil: days,
      isPast: days < 0,
    });
  }
  return deadlines;
}

function computeAlerts(profile: Record<string, string>): DeadlineAlert[] {
  const alerts: DeadlineAlert[] = [];

  const checks = [
    {
      key: "eadExpiry",
      label: "OPT / STEM OPT End Date",
      criticalDays: 45,
      highDays: 90,
      action: "File STEM OPT or H-1B",
      actionHref: "/dashboard/tools/opt-tracker",
    },
    {
      key: "i94Expiry",
      label: "I-94 Authorized Stay Ends",
      criticalDays: 30,
      highDays: 60,
      action: "Consult attorney immediately",
      actionHref: "/lawyers",
    },
    {
      key: "visaStampExpiry",
      label: "Visa Stamp Expires",
      criticalDays: 30,
      highDays: 60,
      action: "Get new stamp before traveling",
      actionHref: "/guides/travel-advisory",
    },
    {
      key: "passportExpiry",
      label: "Passport Expires",
      criticalDays: 90,
      highDays: 180,
      action: "Renew passport at your consulate",
      actionHref: "/guides/travel-advisory",
    },
  ];

  for (const check of checks) {
    const days = daysUntil(profile[check.key]);
    if (days === null || days <= 0) continue;
    if (days > 365) continue;
    alerts.push({
      label: check.label,
      days,
      date: profile[check.key],
      priority:
        days <= check.criticalDays
          ? "critical"
          : days <= check.highDays
            ? "high"
            : "medium",
      action: check.action,
      actionHref: check.actionHref,
    });
  }

  return alerts.sort((a, b) => a.days - b.days);
}

const quickActions = [
  {
    title: "Your timeline",
    description: "See the dates that matter",
    href: "/dashboard/timeline",
    icon: CalendarDays,
  },
  {
    title: "Your documents",
    description: "Keep everything together",
    href: "/dashboard/documents",
    icon: FileText,
  },
  {
    title: "Your cases",
    description: "Follow your applications",
    href: "/dashboard/cases",
    icon: FolderOpen,
  },
  {
    title: "Your checklists",
    description: "One step at a time",
    href: "/dashboard/tools/checklists",
    icon: Check,
  },
];

export default function DashboardPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [profile, setProfile] = useState<Record<string, string> | null>(null);
  const [alerts, setAlerts] = useState<DeadlineAlert[]>([]);
  const [stemDeadlines, setStemDeadlines] = useState<StemDeadline[]>([]);
  const [caseCount, setCaseCount] = useState(0);

  useEffect(() => {
    if (!isSignedIn) {
      Promise.resolve().then(() => {
        setProfile({});
        setAlerts([]);
        setCaseCount(0);
      });
      return;
    }
    Promise.all([
      fetch("/api/profile").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/cases").then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([profileData, casesData]) => {
        if (profileData && !profileData.error) {
          // Redirect new users to onboarding only when explicitly false (column must exist)
          if (profileData.onboarding_complete === false) {
            router.push("/onboarding");
            return;
          }
          const p: Record<string, string> = {
            visaType: profileData.visa_type ?? "",
            countryOfBirth: profileData.country_of_birth ?? "",
            employer: profileData.employer ?? "",
            eadExpiry: profileData.ead_expiry ?? "",
            i94Expiry: profileData.i94_expiry ?? "",
            visaStampExpiry: profileData.visa_stamp_expiry ?? "",
            passportExpiry: profileData.passport_expiry ?? "",
            greenCardStage: profileData.green_card_stage ?? "",
            greenCardCategory: profileData.green_card_category ?? "",
            stemOptStartDate: profileData.stem_opt_start_date ?? "",
          };
          setProfile(p);
          setAlerts(computeAlerts(p));
          if (p.stemOptStartDate)
            setStemDeadlines(computeStemOptDeadlines(p.stemOptStartDate));
        } else {
          setProfile({});
        }
        if (Array.isArray(casesData)) setCaseCount(casesData.length);
      })
      .catch(() => setProfile({}));
  }, [isSignedIn, router]);

  const profileSetUp = !!profile?.visaType;
  const criticalCount = alerts.filter((a) => a.priority === "critical").length;

  return (
    <div className="sc-overview">
      <div className="sc-overview-heading">
        <div>
          <span className="sc-eyebrow">YOUR NEXT CHAPTER</span>
          <h1>
            {profileSetUp
              ? `Welcome back${user?.firstName ? `, ${user.firstName}` : ""}.`
              : "Make yourself at home."}
          </h1>
          <p>
            {profileSetUp
              ? [profile?.visaType, profile?.employer, profile?.countryOfBirth]
                  .filter(Boolean)
                  .join(" · ")
              : "A little less to keep in your head. A clear place to start."}
          </p>
        </div>
        <Link
          href="/dashboard/profile"
          className="sc-button sc-button-outline sc-button-small"
        >
          <UserRound size={15} />
          {profileSetUp ? "My profile" : "Set up my profile"}
        </Link>
      </div>
      {!isSignedIn && (
        <GuestPreviewBanner
          title="A space for your next chapter."
          description="You’re exploring as a guest. Sign in to save your profile, dates, and documents."
        />
      )}
      {criticalCount > 0 && (
        <div className="sc-urgent-alert" role="status">
          <CircleAlert size={18} />
          {criticalCount} upcoming deadline
          {criticalCount > 1 ? "s need" : " needs"} your attention.
          <Link href="/dashboard/timeline">
            Review timeline <ArrowRight size={14} />
          </Link>
        </div>
      )}
      {!profileSetUp && (
        <section className="sc-setup-card">
          <div>
            <span className="sc-eyebrow">LET’S START WITH YOU</span>
            <h2>
              Big plans.
              <br />
              <em>Small first steps.</em>
            </h2>
            <p>
              Add your visa type and important dates.
              <br />
              We’ll help you see what’s coming next.
            </p>
            <Link
              href="/dashboard/profile"
              className="sc-button sc-button-small"
            >
              Build my profile <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="sc-setup-steps">
            <span className="sc-setup-orbit" aria-hidden="true">
              ✳
            </span>
            {[
              "Tell us a little about your journey",
              "Add your key immigration dates",
              "Find everything in one place",
            ].map((s, i) => (
              <div key={s}>
                <span>0{i + 1}</span>
                <p>{s}</p>
                {i === 2 ? <Check size={16} /> : <ArrowUpRight size={15} />}
              </div>
            ))}
          </div>
        </section>
      )}
      <div className="sc-dashboard-quick">
        {quickActions.map((a) => (
          <Link href={a.href} key={a.href}>
            <a.icon size={21} strokeWidth={1.3} />
            <ArrowUpRight size={15} />
            <h2>{a.title}</h2>
            <p>{a.description}</p>
          </Link>
        ))}
      </div>
      <div className="sc-dashboard-columns">
        <div className="sc-dashboard-primary">
          <section className="sc-dash-panel">
            <div className="sc-panel-heading">
              <div>
                <span className="sc-eyebrow">ON YOUR HORIZON</span>
                <h2>Dates to keep in view.</h2>
              </div>
              <Link
                href="/dashboard/timeline"
                aria-label="View your full timeline"
              >
                <ArrowUpRight size={20} />
              </Link>
            </div>
            {profile === null ? (
              <div className="sc-dashboard-empty" role="status">
                <Clock3 size={30} strokeWidth={1} />
                <h3>Getting your workspace ready…</h3>
              </div>
            ) : alerts.length ? (
              <div className="sc-deadline-list">
                {alerts.map((alert) => (
                  <Link href={alert.actionHref} key={alert.label}>
                    <div className={`sc-days sc-days-${alert.priority}`}>
                      <strong>{alert.days}</strong>
                      <span>DAYS</span>
                    </div>
                    <div>
                      <h3>{alert.label}</h3>
                      <p>{formatDateLong(alert.date)}</p>
                      <small>{alert.action}</small>
                    </div>
                    <ArrowUpRight size={17} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="sc-dashboard-empty">
                <div className="sc-empty-calendar">
                  <CalendarDays size={34} strokeWidth={1} />
                  <span>+</span>
                </div>
                <h3>
                  {profileSetUp
                    ? "A little breathing room."
                    : "Your next step starts here."}
                </h3>
                <p>
                  {profileSetUp
                    ? "No upcoming deadlines from your saved dates in the next year. Review your profile to keep your timeline up to date."
                    : "Add your important dates to see a personal timeline of what’s ahead."}
                </p>
                <Link href="/dashboard/profile" className="sc-text-link">
                  {profileSetUp ? "Review my dates" : "Add my first date"}
                  <ArrowRight size={14} />
                </Link>
              </div>
            )}
            <div className="sc-panel-footnote">
              <Clock3 size={12} /> Based on the dates you add to your profile.
            </div>
          </section>
          {stemDeadlines.length > 0 && (
            <section className="sc-dash-panel">
              <div className="sc-panel-heading">
                <div>
                  <span className="sc-eyebrow">YOUR STEM OPT JOURNEY</span>
                  <h2>Reporting milestones.</h2>
                </div>
                <Link
                  href="/guides/opt-stem-opt"
                  aria-label="Read the STEM OPT guide"
                >
                  <ArrowUpRight size={20} />
                </Link>
              </div>
              <div className="sc-stem-list">
                {stemDeadlines.map((d, i) => (
                  <div key={i}>
                    <span className={d.isPast ? "sc-stem-past" : ""}>
                      {d.isPast ? (
                        <Clock3 size={16} />
                      ) : (
                        <CalendarDays size={16} />
                      )}
                    </span>
                    <div>
                      <h3>
                        {d.type === "validation"
                          ? "Validation report"
                          : "Form I-983 evaluation"}
                      </h3>
                      <p>{d.label}</p>
                      <small>{formatDateShort(d.date)}</small>
                    </div>
                    <strong>
                      {d.isPast ? "Past date" : `${d.daysUntil}d`}
                    </strong>
                  </div>
                ))}
              </div>
              <p className="sc-panel-footnote">
                Review reporting requirements with your DSO.
              </p>
            </section>
          )}
          <section className="sc-dash-panel sc-dashboard-reading">
            <div className="sc-panel-heading">
              <div>
                <span className="sc-eyebrow">
                  A LITTLE KNOWLEDGE GOES A LONG WAY
                </span>
                <h2>Good places to begin.</h2>
              </div>
              <Link href="/guides" aria-label="Browse all guides">
                <ArrowUpRight size={20} />
              </Link>
            </div>
            {[
              {
                title: "From student to your next chapter",
                text: "F-1, OPT, and STEM OPT",
                href: "/guides/opt-stem-opt",
                icon: GraduationCap,
              },
              {
                title: "Find a path that fits your plans",
                text: "Explore U.S. immigration pathways",
                href: "/visa-finder",
                icon: Compass,
              },
            ].map((g) => (
              <Link href={g.href} key={g.href}>
                <g.icon size={23} strokeWidth={1.2} />
                <div>
                  <h3>{g.title}</h3>
                  <p>{g.text}</p>
                </div>
                <ArrowUpRight size={17} />
              </Link>
            ))}
          </section>
        </div>
        <div className="sc-dashboard-secondary">
          <section className="sc-assistant-card">
            <Sparkles size={27} strokeWidth={1.2} />
            <span className="sc-eyebrow">YOUR AI COMPANION</span>
            <h2>
              Big question?
              <br />
              <em>Start here.</em>
            </h2>
            <p>Make sense of the terms, the process, and the possibilities.</p>
            <Link href="/ai-assistant">
              Let’s talk it through <ArrowUpRight size={18} />
            </Link>
            <small>
              Educational guidance. Verify important details with official
              sources.
            </small>
          </section>
          <section className="sc-dash-panel sc-profile-summary">
            <span className="sc-eyebrow">YOUR JOURNEY AT A GLANCE</span>
            <div>
              <span>Visa type</span>
              <strong>{profile?.visaType || "Not added yet"}</strong>
            </div>
            <div>
              <span>Cases tracked</span>
              <strong>{caseCount}</strong>
            </div>
            <div>
              <span>Upcoming dates</span>
              <strong>{alerts.length}</strong>
            </div>
            {profile?.greenCardStage && (
              <div>
                <span>Green card stage</span>
                <strong>{profile.greenCardStage}</strong>
              </div>
            )}
            <Link
              href={
                profile?.greenCardStage
                  ? "/dashboard/profile?tab=greencard"
                  : "/dashboard/profile"
              }
            >
              View my profile <ArrowUpRight size={15} />
            </Link>
          </section>
          <p className="sc-dashboard-note">
            Every journey is different. Your workspace helps you stay organized;
            it doesn’t replace professional legal advice.
          </p>
        </div>
      </div>
    </div>
  );
}
