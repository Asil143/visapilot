import { AlertCircle, CheckCircle2, Plane, Globe, Shield, Clock } from "lucide-react";
import Link from "next/link";
import { TRAVEL_ADVISORY_SECTIONS as sections, TRAVEL_ADVISORY_CHECKLIST as checklist } from "@/config/guides";

export default function TravelAdvisoryPage() {
  return (
    <div className="sc-guide-article min-h-screen bg-background">

      {/* Hero */}
      <section className="sc-guide-hero"><div className="sc-guide-breadcrumb"><Link href="/guides">The guide library</Link><span>/</span><span>TRAVEL FIELD GUIDE</span></div>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: "#fed7aa", color: "#9a3412" }}>
              <Plane className="h-4 w-4" />
              Travel Guide for Visa Holders
            </div>
            <h1 className="text-4xl font-bold mb-4">International Travel Advisory</h1>
            <p className="text-lg" style={{ color: "var(--muted-ink)" }}>
              Everything you need to know about traveling internationally while maintaining your US visa status — F-1, H-1B, OPT, and green card applicants.
            </p>
            <div className="flex items-start gap-2 mt-6 p-4 rounded-xl" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800 text-sm">Always consult an immigration attorney before traveling</p>
                <p className="text-sm text-red-700 mt-0.5">Travel rules are complex and fact-specific. This guide is for informational purposes only and not legal advice.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Pre-travel checklist */}
        <div className="mb-12 p-6 rounded-2xl border-2" style={{ borderColor: "var(--forest)", backgroundColor: "var(--color-secondary)" }}>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-5 w-5 text-blue-600" />
            <h2 className="font-bold text-blue-900">Pre-Travel Document Checklist</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {checklist.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className={`h-4 w-4 shrink-0 ${item.required ? "text-blue-600" : "text-gray-400"}`} />
                <span className="text-sm">{item.item}</span>
                {item.required && <span className="text-xs text-blue-600 font-semibold ml-auto">Always</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Q&A sections */}
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">{section.icon}</span>
                <h2 className="text-xl font-bold">{section.title}</h2>
              </div>
              <div className="space-y-4">
                {section.items.map((item, i) => (
                  <div key={i} className="rounded-xl border-l-4 p-4" style={{ borderColor: section.border.replace("fe", "60"), backgroundColor: section.color }}>
                    <p className="font-semibold text-sm mb-2">{item.q}</p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--muted-ink)" }}>{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Globe, title: "Check I-94 Record", desc: "Verify your current authorized stay", href: "https://i94.cbp.dhs.gov", external: true },
            { icon: Clock, title: "Consulate Wait Times", desc: "US visa appointment availability", href: "https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/wait-times.html", external: true },
            { icon: Shield, title: "Ask AI Assistant", desc: "Get personalized travel advice", href: "/ai-assistant", external: false },
          ].map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.title}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="p-4 rounded-xl border flex gap-3 items-start hover:shadow-md transition-shadow"
                style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}
              >
                <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--color-secondary)" }}>
                  <Icon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{link.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--muted-ink)" }}>{link.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
