"use client";

import { useState, useMemo } from "react";
import { Search, BookOpen } from "lucide-react";

const terms = [
  { term: "Adjustment of Status (AOS)", acronym: "AOS", category: "Green Card", definition: "The process of applying for permanent residence (green card) from within the United States using Form I-485, without having to return to your home country to get an immigrant visa." },
  { term: "Advance Parole", acronym: "AP", category: "Travel", definition: "A document (Form I-131) that allows certain noncitizens to re-enter the US after traveling abroad while their immigration application is pending. Essential for I-485 applicants who need to travel." },
  { term: "Alien Registration Number", acronym: "A-Number", category: "General", definition: "A unique 9-digit number assigned to non-US citizens. Found on your green card, EAD, or I-797 notice. Also called USCIS Registration Number." },
  { term: "Annual Cap", acronym: null, category: "H-1B", definition: "The statutory limit on the number of new H-1B visas issued each fiscal year: 65,000 for the regular cap plus 20,000 for the US master's degree cap." },
  { term: "Authorization to Work", acronym: null, category: "Work Auth", definition: "Legal permission to be employed in the United States. Can come from visa status (e.g., H-1B), an EAD card, or other USCIS authorization." },
  { term: "Biometrics", acronym: null, category: "General", definition: "Fingerprints, photograph, and signature collected at an Application Support Center (ASC). Required for many immigration applications including I-485, N-400, and some I-765 filings." },
  { term: "Cap-Exempt", acronym: null, category: "H-1B", definition: "H-1B employers not subject to the annual cap — primarily universities, nonprofit research organizations, and government research organizations. Can sponsor H-1B workers year-round without lottery." },
  { term: "Cap-Gap", acronym: null, category: "H-1B", definition: "For an eligible, timely filed H-1B change-of-status request, an automatic extension of F-1 status and OPT/STEM OPT employment authorization. Under the current rule, it generally ends April 1 of the fiscal year for which H-1B status is requested, or earlier if the request ends." },
  { term: "Certificate of Eligibility", acronym: "I-20 / DS-2019", category: "F-1/J-1", definition: "The I-20 is issued by schools for F-1 students; the DS-2019 is issued by exchange program sponsors for J-1 visitors. Both authorize the holder to apply for the respective visa." },
  { term: "Change of Status", acronym: "COS", category: "General", definition: "Changing from one nonimmigrant visa category to another while inside the US, without leaving. For example, changing from F-1 to H-1B. Filed on Form I-539 (or I-129 for work visas)." },
  { term: "Consular Processing", acronym: null, category: "General", definition: "Applying for an immigrant or nonimmigrant visa at a US consulate or embassy abroad, as opposed to Adjustment of Status inside the US." },
  { term: "Curricular Practical Training", acronym: "CPT", category: "F-1", definition: "Off-campus work authorization for F-1 students that is an integral part of their academic curriculum. Must be authorized by your DSO on the I-20 before you start working. Not filed with USCIS." },
  { term: "Designated School Official", acronym: "DSO", category: "F-1", definition: "An authorized official at your school who manages your SEVIS record, issues I-20 updates, authorizes CPT, and recommends OPT. Your primary point of contact for F-1 status matters." },
  { term: "Duration of Status", acronym: "D/S", category: "F-1", definition: "The period of authorized stay indicated on the I-94 as 'D/S' — meaning you can stay as long as you maintain your student status, not a fixed date. Most F-1 students have D/S on their I-94." },
  { term: "Employment Authorization Document", acronym: "EAD", category: "Work Auth", definition: "A credit card-sized document (Form I-765) that proves your right to work in the US. Required for OPT, STEM OPT, pending I-485, and other categories. Issued by USCIS." },
  { term: "Entry Without Inspection", acronym: "EWI", category: "General", definition: "Entering the United States without authorization (e.g., crossing the border without going through a port of entry). EWI creates significant bars to adjustment of status." },
  { term: "Form I-20", acronym: "I-20", category: "F-1", definition: "Certificate of Eligibility for Nonimmigrant Student Status. Issued by SEVIS-approved schools to F-1 students. Required to get the F-1 visa, enter the US, and maintain status." },
  { term: "Form I-94", acronym: "I-94", category: "General", definition: "Arrival/Departure Record issued when you enter the US. Contains your admission class (e.g., F-1, H-1B) and authorized stay period. Check yours at i94.cbp.dhs.gov." },
  { term: "Form I-129", acronym: "I-129", category: "H-1B", definition: "Petition for Nonimmigrant Worker. Used by employers to sponsor workers for H-1B, L-1, O-1, TN, and other nonimmigrant work visas. Must be filed by the employer." },
  { term: "Form I-130", acronym: "I-130", category: "Family", definition: "Petition for Alien Relative. Filed by a US citizen or permanent resident to establish a qualifying family relationship with a foreign national seeking a green card." },
  { term: "Form I-131", acronym: "I-131", category: "Travel", definition: "Application for Travel Document. Used to apply for Advance Parole, Refugee Travel Document, or Re-entry Permit. Critical for green card applicants who need to travel internationally." },
  { term: "Form I-140", acronym: "I-140", category: "Green Card", definition: "Immigrant Petition for Alien Workers. Filed by employers (or self-petitioned for EB-1A, EB-2 NIW) to establish a worker's eligibility for an employment-based green card." },
  { term: "Form I-485", acronym: "I-485", category: "Green Card", definition: "Application to Register Permanent Residence or Adjust Status. The primary form to apply for a green card inside the US. Often filed concurrently with I-140 when priority dates are current." },
  { term: "Form I-765", acronym: "I-765", category: "Work Auth", definition: "Application for Employment Authorization. Filed to get an EAD card for OPT, STEM OPT, pending I-485, and other eligibility categories." },
  { term: "Form I-797", acronym: "I-797", category: "General", definition: "Notice of Action. The official letter USCIS sends to acknowledge receipt or approve/deny your petition. Comes in several types: I-797A (approval with I-94), I-797B (approval), I-797C (receipt)." },
  { term: "Form N-400", acronym: "N-400", category: "Citizenship", definition: "Application for Naturalization. Filed by eligible green card holders (typically after 3–5 years) to become US citizens. Includes a civics interview, English test, and oath ceremony." },
  { term: "Full-Time Student Status", acronym: null, category: "F-1", definition: "F-1 students must be enrolled full-time each semester (typically 12 credits for undergrads, 9 for grads). Dropping below full-time without DSO authorization violates status." },
  { term: "Grace Period", acronym: null, category: "F-1", definition: "The 60-day period after completing your academic program during which you remain in valid F-1 status. You can prepare to depart, apply for OPT, or change status during this window." },
  { term: "Green Card", acronym: "LPR", category: "Green Card", definition: "Informal name for Permanent Resident Card (Form I-551). Grants lawful permanent residence in the US. Green cards for employment are valid for 10 years and must be renewed." },
  { term: "H-1B Lottery", acronym: null, category: "H-1B", definition: "The random selection process USCIS uses when H-1B registrations exceed the annual cap. USCIS publishes the registration dates each year. Selection is beneficiary-centric, and only selected registrants may file full H-1B petitions." },
  { term: "H-1B Portability", acronym: null, category: "H-1B", definition: "Under AC21, H-1B holders with a pending I-485 (180+ days) or an approved I-140 can change employers without losing their green card priority date or H-1B status." },
  { term: "I-140 Priority Date", acronym: null, category: "Green Card", definition: "The date USCIS received your I-140 petition (or DOL received your PERM application). Used to determine your place in line for a green card. Critical for India and China nationals due to backlogs." },
  { term: "Immigrant Visa", acronym: "IV", category: "Green Card", definition: "A visa that allows a foreign national to enter the US and become a lawful permanent resident (green card holder). Different from a nonimmigrant visa, which is temporary." },
  { term: "International Entrepreneur Rule", acronym: "IER", category: "Startup", definition: "A parole program allowing foreign entrepreneurs who have received significant investment to work in the US for up to 5 years to develop their startup." },
  { term: "Labor Certification", acronym: "PERM", category: "Green Card", definition: "Process filed with the Department of Labor (DOL) to certify that no qualified US worker is available for the position being offered to a foreign worker. Required for most EB-2 and EB-3 green cards." },
  { term: "Lawful Permanent Resident", acronym: "LPR", category: "Green Card", definition: "A foreign national who has been granted permanent residence in the US. Also called a green card holder. LPRs can live and work permanently in the US and apply for citizenship after 3–5 years." },
  { term: "Maintenance of Status", acronym: null, category: "F-1", definition: "Complying with all rules and requirements of your visa category to remain in lawful status. For F-1, this means full-time enrollment, valid I-20, valid passport, and authorized work only." },
  { term: "National Interest Waiver", acronym: "NIW", category: "Green Card", definition: "An exemption from the PERM labor certification requirement for EB-2 applicants who can demonstrate their work is in the national interest. Allows self-petition without an employer." },
  { term: "Naturalization", acronym: null, category: "Citizenship", definition: "The process by which a foreign national becomes a US citizen. Generally requires 5 years as an LPR (3 years if married to a US citizen), continuous residence, good moral character, and passing civics/English tests." },
  { term: "Nonimmigrant Visa", acronym: "NIV", category: "General", definition: "A temporary visa allowing a foreign national to enter the US for a specific purpose and time period. Includes F-1 (student), H-1B (worker), B-1/B-2 (visitor), and many others." },
  { term: "O-1A Visa", acronym: "O-1A", category: "Specialty", definition: "Visa for individuals with extraordinary ability in sciences, education, business, or athletics. No lottery required. Self-petition is possible. Requires evidence of national/international acclaim." },
  { term: "Optional Practical Training", acronym: "OPT", category: "F-1", definition: "Post-completion work authorization for F-1 students in a job related to their field of study. 12 months of work authorization filed via Form I-765. STEM degree holders can apply for a 24-month extension." },
  { term: "Out-of-Status", acronym: null, category: "General", definition: "Being in the US past your authorized stay or in violation of your visa conditions. Different from overstaying — you can be out of status without technically overstaying (e.g., working without authorization)." },
  { term: "Overstay", acronym: null, category: "General", definition: "Remaining in the US past the date on your I-94 or visa. Overstays of 180+ days trigger a 3-year bar from re-entry; overstays of 1+ year trigger a 10-year bar." },
  { term: "PERM", acronym: "PERM", category: "Green Card", definition: "Program Electronic Review Management — the DOL system for processing labor certification applications. The first step for most employer-sponsored green cards. Free to file with DOL." },
  { term: "Port of Entry", acronym: "POE", category: "General", definition: "An airport, seaport, or land border crossing where travelers enter the US and are inspected by CBP officers. Your I-94 is created (or modified) at the POE." },
  { term: "Premium Processing", acronym: null, category: "General", definition: "A paid USCIS service currently listed at $2,805 for several eligible petitions. It requires qualifying USCIS action within 15 business days for eligible H-1B and other covered filings; it does not guarantee approval." },
  { term: "Priority Date", acronym: "PD", category: "Green Card", definition: "The date that determines your place in line for an employment-based or family-based green card. For employment-based cases, it's usually the date DOL received your PERM application (or I-140 receipt date for NIW)." },
  { term: "Receipt Notice", acronym: "I-797C", category: "General", definition: "USCIS confirmation that they have received your petition or application. Contains your receipt number (e.g., EAC-, WAC-, SRC-, LIN-, MSC-) for tracking your case online." },
  { term: "Request for Evidence", acronym: "RFE", category: "General", definition: "A letter from USCIS asking for additional documentation or clarification on your petition. You typically have 87 days to respond. Failing to respond results in denial." },
  { term: "SEVIS", acronym: "SEVIS", category: "F-1/J-1", definition: "Student and Exchange Visitor Information System — the DHS database that tracks F-1 and J-1 students and exchange visitors. Your SEVIS record must be active and maintained for valid status." },
  { term: "SEVIS Fee", acronym: "I-901", category: "F-1/J-1", definition: "A one-time fee ($350 for F-1, $220 for J-1) paid to DHS via Form I-901 before applying for an F-1 or J-1 visa. Required for initial entry; not required when transferring or changing programs." },
  { term: "Special Registration", acronym: null, category: "General", definition: "Additional registration requirements for nationals of certain countries when entering the US." },
  { term: "STEM OPT Extension", acronym: "STEM OPT", category: "F-1", definition: "A 24-month extension of OPT work authorization for F-1 students who graduated with a STEM degree (per DHS's STEM list). Requires employer to be enrolled in E-Verify. Filed via I-765 with I-983 training plan." },
  { term: "Status Violation", acronym: null, category: "General", definition: "Any action that breaches the conditions of your visa — such as working without authorization, dropping below full-time enrollment (F-1), or staying past your I-94 date." },
  { term: "TN Visa", acronym: "TN", category: "Specialty", definition: "NAFTA/USMCA visa for Canadian and Mexican citizens in professional occupations listed in the treaty. No cap, no lottery, renewable indefinitely. Filed with CBP at the border or via I-129." },
  { term: "Transfer Credit", acronym: null, category: "F-1", definition: "Moving your SEVIS record from one US school to another when you change schools. Must be done through your DSOs; your SEVIS ID remains the same." },
  { term: "Unauthorized Employment", acronym: null, category: "General", definition: "Working in the US without proper authorization. For F-1 students, this means working off-campus without an EAD or DSO-authorized CPT. Can result in status termination and bar from re-entry." },
  { term: "Unlawful Presence", acronym: "ULP", category: "General", definition: "Time spent in the US without authorization, which triggers re-entry bars (3-year bar for 180+ days, 10-year bar for 1+ year). F-1/J-1 students generally don't accrue ULP until USCIS makes a formal status determination." },
  { term: "Visa Bulletin", acronym: null, category: "Green Card", definition: "A monthly DOS publication showing priority dates for employment-based and family-based green cards by country. If your priority date is before the cutoff date, your visa number is available." },
  { term: "Visa Stamp", acronym: null, category: "General", definition: "The physical visa sticker placed in your passport by a US consulate or embassy. It allows you to enter the US but does not determine your authorized stay (that's the I-94). An expired visa stamp doesn't mean you're out of status." },
];

const categories = ["All", "F-1", "H-1B", "Green Card", "Work Auth", "General", "Travel", "Citizenship", "Specialty", "Family", "F-1/J-1"];

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return terms.filter((t) => {
      const matchesCategory = activeCategory === "All" || t.category === activeCategory;
      const matchesSearch = !q || t.term.toLowerCase().includes(q) || (t.acronym?.toLowerCase().includes(q)) || t.definition.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [search, activeCategory]);

  const grouped = useMemo(() => {
    const groups: Record<string, typeof terms> = {};
    filtered.forEach((t) => {
      const letter = t.term[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(t);
    });
    return groups;
  }, [filtered]);

  return (
    <div style={{ backgroundColor: "#ffffff", minHeight: "100vh" }}>

      {/* Hero */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%)" }}>
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4" style={{ backgroundColor: "#dbeafe", color: "#1d4ed8" }}>
            <BookOpen className="h-4 w-4" />
            Immigration Reference
          </div>
          <h1 className="text-4xl font-bold mb-4">Immigration Glossary</h1>
          <p className="text-lg max-w-xl mx-auto mb-8" style={{ color: "#64748b" }}>
            {terms.length} immigration terms explained in plain English — no legalese.
          </p>
          <div className="relative max-w-lg mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Search terms, acronyms, definitions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10">
        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
              style={{
                backgroundColor: activeCategory === cat ? "#2563eb" : "#f1f5f9",
                color: activeCategory === cat ? "#ffffff" : "#64748b",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <p className="text-sm mb-6" style={{ color: "#94a3b8" }}>{filtered.length} terms</p>

        {/* Terms grouped by letter */}
        {Object.keys(grouped).sort().map((letter) => (
          <div key={letter} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-lg flex items-center justify-center font-bold text-lg" style={{ backgroundColor: "#eff6ff", color: "#2563eb" }}>
                {letter}
              </div>
              <div className="flex-1 h-px" style={{ backgroundColor: "#e2e8f0" }} />
            </div>
            <div className="space-y-3">
              {grouped[letter].map((t) => (
                <div key={t.term} className="p-4 rounded-xl border" style={{ borderColor: "#e2e8f0", backgroundColor: "#ffffff" }}>
                  <div className="flex items-start gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-sm">{t.term}</h3>
                        {t.acronym && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: "#f1f5f9", color: "#64748b" }}>{t.acronym}</span>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{t.definition}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full shrink-0" style={{ backgroundColor: "#f1f5f9", color: "#94a3b8" }}>{t.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16" style={{ color: "#94a3b8" }}>
            <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="font-medium">No terms found for &quot;{search}&quot;</p>
            <p className="text-sm mt-1">Try a different search or browse all categories</p>
          </div>
        )}
      </div>

    </div>
  );
}
