"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Search, ArrowRight } from "lucide-react";

const faqs = [
  {
    category: "About StatusClock",
    items: [
      {
        q: "What is StatusClock?",
        a: "StatusClock is a free immigration information platform for international students and professionals in the U.S. We provide step-by-step checklists, an AI assistant, deadline tracking, and plain-language guides covering F-1, OPT, STEM OPT, H-1B, J-1, and Green Card pathways.",
      },
      {
        q: "Is StatusClock a law firm or immigration attorney service?",
        a: "No. StatusClock is an information and tools platform — not a law firm. We do not provide legal advice, and using StatusClock does not create an attorney-client relationship. For case-specific guidance, especially if you've received an RFE, NOID, or any government notice, always consult a licensed immigration attorney.",
      },
      {
        q: "Is StatusClock free to use?",
        a: "Yes — visa checklists, the OPT day counter, fee calculator, and visa bulletin are free. The AI assistant needs a free account (10 questions per month). Paid packs unlock unlimited AI for a window and the RFE analyzer.",
      },
      {
        q: "Do I need to create an account?",
        a: "Not for basic use. Checklists, guides, and several tools are accessible without signing in. Creating a free account lets you save your checklist progress, sync across devices, and access the AI Assistant.",
      },
    ],
  },
  {
    category: "OPT & STEM OPT",
    items: [
      {
        q: "When should I apply for OPT?",
        a: "You can apply up to 90 days before your program end date, within 30 days of the DSO recommendation, and no later than 60 days after program completion. Check USCIS's live processing-time tool rather than relying on a fixed range. Your EAD card must arrive before you can start working.",
      },
      {
        q: "How long does OPT last?",
        a: "Standard post-completion OPT is 12 months. If you have a qualifying STEM degree and your employer is E-Verify enrolled, you can apply for a 24-month STEM OPT extension, giving you up to 36 months total.",
      },
      {
        q: "What happens if USCIS doesn't process my OPT before my graduation date?",
        a: "You have a 60-day grace period after your program end date. As long as your OPT application was filed before your grace period ended and while you were in valid F-1 status, you remain in valid status while the application is pending. You just can't work until the EAD arrives.",
      },
      {
        q: "Do I need a job offer to apply for OPT?",
        a: "No — you can apply for OPT without a job offer. However, you must be employed or actively seeking employment during OPT. If you are unemployed for more than 90 cumulative days during standard OPT (or 150 days during STEM OPT), you may fall out of status.",
      },
      {
        q: "What is the STEM OPT reporting requirement?",
        a: "During STEM OPT, you must submit validation reports to your DSO every 6 months confirming your employment and training. Your employer must also complete a Formal Training Plan (I-983). Failure to report on time can jeopardize your status.",
      },
    ],
  },
  {
    category: "H-1B Visa",
    items: [
      {
        q: "What is the H-1B cap lottery?",
        a: "Each year, USCIS receives more H-1B registrations than the 85,000 statutory cap numbers (65,000 regular cap + 20,000 for U.S. master's degree holders). USCIS uses beneficiary-centric selection, and it publishes the registration window dates for each cycle.",
      },
      {
        q: "Can I work while my H-1B is pending?",
        a: "If you are on OPT or STEM OPT and an eligible H-1B change-of-status request is timely filed, cap-gap may extend F-1 status and employment authorization. Under the current rule, the extension generally ends April 1 of the requested H-1B fiscal year, or earlier if the request ends.",
      },
      {
        q: "What is an H-1B transfer?",
        a: "If you are already in H-1B status with one employer and want to change jobs, your new employer files an H-1B transfer (also called a 'portability' petition). You can start working for the new employer as soon as the petition is filed — you don't have to wait for approval.",
      },
      {
        q: "How long can I stay on H-1B?",
        a: "Initial H-1B approval is for up to 3 years, with one extension of up to 3 more years (6 years total). Beyond 6 years, extensions are possible if you have an approved I-140 petition or a pending PERM labor certification that is more than 365 days old.",
      },
      {
        q: "What is an RFE and what should I do if I receive one?",
        a: "An RFE (Request for Evidence) is a notice from USCIS asking for more documentation to support your petition. You typically have 87 days to respond. An RFE is not a denial — respond thoroughly with your attorney's help. StatusClock's RFE Assistant can help you understand common RFE types.",
      },
    ],
  },
  {
    category: "Green Card",
    items: [
      {
        q: "What is the EB-2 vs EB-3 category?",
        a: "EB-2 is for professionals with advanced degrees or exceptional ability. EB-3 is for skilled workers, professionals, and unskilled workers. EB-2 generally has shorter wait times for most countries. Indian and Chinese nationals face extremely long backlogs in both categories due to per-country annual limits.",
      },
      {
        q: "What is PERM labor certification?",
        a: "PERM (Program Electronic Review Management) is the first step in most employer-sponsored green card cases. Your employer must conduct a supervised job search to prove no qualified U.S. workers are available for the role. The process typically takes 8–18 months.",
      },
      {
        q: "What is priority date and why does it matter?",
        a: "Your priority date is typically the date USCIS receives your I-140 petition (or the PERM filing date). The Visa Bulletin published monthly by the State Department shows which priority dates are 'current' — meaning a visa number is available and you can proceed with adjustment of status.",
      },
      {
        q: "Can I change jobs while my green card is pending?",
        a: "Yes, under AC21 portability, if your I-485 has been pending for 180+ days, you can change to a 'same or similar' job without jeopardizing your green card case. Consult an attorney before doing so, as the analysis is fact-specific.",
      },
    ],
  },
  {
    category: "Account & Billing",
    items: [
      {
        q: "How do I delete my account?",
        a: "Email support@statusclock.com from the address on your account and we will delete your data. Event packs are one-time. If you have All-Access, tell us to stop renewing it.",
      },
      {
        q: "Can I get a refund?",
        a: "All purchases are final and non-refundable unless required by law. If you believe you were charged in error, contact us at support@statusclock.com within 14 days of the charge.",
      },
      {
        q: "Is my data secure?",
        a: "We use TLS in transit and encryption at rest via our database provider. Sign-in is handled by Clerk. During beta, paid plans are activated after a manual payment screenshot — we do not store card numbers. See our Privacy Policy for details.",
      },
      {
        q: "Can I use StatusClock on mobile?",
        a: "Yes. The marketing site and dashboard work in a mobile browser. There is no native app yet.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <span className="font-medium text-slate-800 text-sm leading-5">{q}</span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-7 border-t border-slate-100 bg-slate-50">
          {a}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [query, setQuery] = useState("");

  const filtered = faqs.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.q.toLowerCase().includes(query.toLowerCase()) ||
        item.a.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  const total = faqs.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-b bg-slate-50">
        <div className="container mx-auto px-4 py-14 max-w-3xl text-center">
          <p className="text-sm font-medium text-blue-600 mb-2">Got questions?</p>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-slate-500 mb-8">
            Answers to the most common questions about U.S. immigration and StatusClock.
            {" "}<span className="text-slate-400">{total} questions across {faqs.length} categories.</span>
          </p>
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* FAQ content */}
      <div className="container mx-auto px-4 py-14 max-w-3xl">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-lg font-medium text-slate-600 mb-2">No results found</p>
            <p className="text-sm">Try different keywords, or{" "}
              <Link href="/contact" className="text-blue-600 hover:underline">contact us</Link> directly.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {filtered.map((cat) => (
              <div key={cat.category}>
                <h2 className="text-lg font-semibold text-slate-900 mb-5 flex items-center gap-2">
                  <span className="h-px flex-1 bg-slate-100" />
                  <span>{cat.category}</span>
                  <span className="h-px flex-1 bg-slate-100" />
                </h2>
                <div className="space-y-3">
                  {cat.items.map((item) => (
                    <FAQItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Still have questions */}
        <div className="mt-16 bg-blue-50 border border-blue-100 rounded-2xl p-8 text-center">
          <h3 className="font-semibold text-slate-900 text-lg mb-2">Still have questions?</h3>
          <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">
            Can&apos;t find what you&apos;re looking for? Our AI Assistant can answer general immigration
            questions, or contact us directly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/ai-assistant"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-colors text-sm"
            >
              Ask the AI Assistant <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 font-semibold px-6 py-2.5 rounded-xl hover:bg-slate-50 transition-colors text-sm"
            >
              Contact us
            </Link>
          </div>
          <p className="mt-5 text-xs text-slate-400">
            For case-specific legal advice,{" "}
            <Link href="/lawyers" className="text-blue-500 hover:underline">find a licensed immigration attorney</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
