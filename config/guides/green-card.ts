export interface EBCategory {
  category: string;
  title: string;
  description: string;
  requirements: string[];
  timeline: string;
  color: string;
  badge: string;
}

export const GREEN_CARD_EB_CATEGORIES: EBCategory[] = [
  {
    category: "EB-1A",
    title: "Extraordinary Ability",
    description: "For individuals with extraordinary ability in sciences, arts, education, business, or athletics. No employer sponsor required.",
    requirements: ["National or international awards/recognition", "Published work with significant citations", "Judging others' work in your field", "High salary compared to peers", "Memberships in prestigious associations"],
    timeline: "Varies by category and bulletin",
    color: "bg-yellow-50 border-yellow-200 text-yellow-900",
    badge: "bg-yellow-100 text-yellow-700",
  },
  {
    category: "EB-1B",
    title: "Outstanding Researchers & Professors",
    description: "For researchers/professors with international recognition in a specific academic area. Requires employer sponsorship.",
    requirements: ["At least 3 years research/teaching experience", "Major prizes or awards", "Membership in associations requiring outstanding achievement", "Published material about your work", "Participation as judge of others' work"],
    timeline: "Varies by category and bulletin",
    color: "bg-blue-50 border-blue-200 text-blue-900",
    badge: "bg-blue-100 text-blue-700",
  },
  {
    category: "EB-2 NIW",
    title: "National Interest Waiver",
    description: "Waives the job offer and PERM requirements for individuals whose work is in the national interest of the US. Self-petition.",
    requirements: ["Substantial merit and national importance of work", "Well-positioned to advance the endeavor", "Beneficial to waive job offer and PERM requirements", "Strong evidence: papers, citations, media, letters of support"],
    timeline: "Varies by category and bulletin",
    color: "bg-emerald-50 border-emerald-200 text-emerald-900",
    badge: "bg-emerald-100 text-emerald-700",
  },
  {
    category: "EB-2",
    title: "Advanced Degree Professionals",
    description: "For professionals with advanced degrees (master's+) or equivalent. Requires employer sponsorship and PERM labor certification.",
    requirements: ["Advanced degree (master's or bachelor's + 5 years exp)", "Employer files PERM labor certification", "I-140 petition", "Priority date must be current for your country"],
    timeline: "3–10+ years (country dependent)",
    color: "bg-indigo-50 border-indigo-200 text-indigo-900",
    badge: "bg-indigo-100 text-indigo-700",
  },
  {
    category: "EB-3",
    title: "Skilled Workers",
    description: "For skilled workers (2+ years training), professionals, and unskilled workers. Requires employer sponsorship and PERM.",
    requirements: ["Skilled: 2+ years training/experience required", "Professional: US bachelor's degree or equivalent", "Permanent full-time job offer from US employer", "PERM labor certification filed by employer"],
    timeline: "3–10+ years (country dependent)",
    color: "bg-orange-50 border-orange-200 text-orange-900",
    badge: "bg-orange-100 text-orange-700",
  },
];

export const GREEN_CARD_PROCESS_STEPS: { title: string; desc: string }[] = [
  { title: "PERM Labor Certification (EB-2/EB-3 only)", desc: "Employer proves no qualified US workers are available for the position. Check current Department of Labor processing information because this timeline changes." },
  { title: "File I-140 (Immigrant Petition)", desc: "USCIS approves your immigrant classification. Establishes your Priority Date." },
  { title: "Wait for Priority Date to Become Current", desc: "Check monthly Visa Bulletin. India and China have multi-year backlogs for EB-2/EB-3." },
  { title: "Adjustment of Status (I-485) or Consular Processing", desc: "If in the US, file I-485. If abroad, go through National Visa Center and US Embassy." },
  { title: "Biometrics Appointment", desc: "USCIS schedules you at an Application Support Center (ASC) to collect fingerprints, photo, and signature. Usually happens 3–6 weeks after filing I-485 and takes about 20 minutes. Reused for background/security checks — you generally don't need to redo it if your case stays open." },
  { title: "Medical Exam (Form I-693)", desc: "A USCIS-designated civil surgeon (not just any doctor) performs a physical exam, reviews vaccination records, and tests for certain conditions. The civil surgeon seals the completed I-693 in an envelope — do not open it. You can complete this before filing I-485 or submit it afterward in response to a request." },
  { title: "Interview (if scheduled)", desc: "Not every employment-based case gets an interview, but USCIS has increasingly required them. Bring your original documents, the I-140 approval notice, recent pay stubs, and be ready to confirm the job offer is still valid." },
  { title: "Approval and Card Production", desc: "Once approved, USCIS produces the physical card and mails it via USPS, typically within 7–30 days of approval. You'll get an approval notice (and often an email/text if you opted in) before the card itself arrives." },
  { title: "If Your Card Doesn't Arrive", desc: "If it's been more than 30 days since approval with no card, first check your USCIS online account for tracking/delivery status, then file a case inquiry through the USCIS Contact Center or a Form I-90 non-delivery request if USPS confirms it was lost." },
];

export const GREEN_CARD_FAQ: { question: string; answer: string }[] = [
  {
    question: "What's the difference between a 2-year and a 10-year green card?",
    answer:
      "If you've been married to your sponsor for less than 2 years when your green card is approved, you receive a conditional 2-year green card. You must file Form I-751 within the 90 days before it expires to remove the conditions. All other employment-based and long-married family-based green cards are issued for 10 years and are simply renewed via Form I-90.",
  },
  {
    question: "Can I switch employers while my green card process is pending?",
    answer:
      "It depends on the stage. Before I-140 approval, changing employers generally restarts the PERM/I-140 process with the new employer. After your I-140 has been approved for 180+ days AND your I-485 has been pending for 180+ days, AC21 portability lets you change to a same or similar job without restarting the process.",
  },
  {
    question: "What happens if my priority date isn't current yet?",
    answer:
      "You wait. Check the monthly Visa Bulletin — your priority date must be earlier than the 'cutoff' date listed for your category and country of birth. India and China face the longest backlogs, sometimes 10+ years for EB-2/EB-3. You cannot file I-485 (or be scheduled for a consular interview) until your date is current.",
  },
  {
    question: "What's the difference between PERM (EB-2/EB-3) and a self-petition like EB-1A or NIW?",
    answer:
      "PERM-based categories (EB-2, EB-3) require a US employer to test the labor market, prove no qualified US worker is available, and sponsor you for a specific job — you generally can't file for yourself. EB-1A (extraordinary ability) and EB-2 NIW (National Interest Waiver) let you self-petition: no job offer, no labor certification, and no employer required, but you must meet a higher evidentiary bar showing sustained acclaim or work of national importance.",
  },
  {
    question: "What does it mean for a priority date to be 'current'?",
    answer:
      "Your priority date is 'current' when it falls on or before the cutoff date USCIS/the State Department publishes each month in the Visa Bulletin for your category and country of birth. Only then can you file (or have approved) the final step of your green card — I-485 adjustment of status or a consular interview. The Visa Bulletin is published monthly at travel.state.gov and is the single source of truth for where the line stands.",
  },
  {
    question: "What's the difference between the 'Dates for Filing' and 'Final Action Dates' charts?",
    answer:
      "Both appear in the same monthly Visa Bulletin. 'Final Action Dates' is when your green card can actually be approved. 'Dates for Filing' is an earlier, more generous date that — when USCIS authorizes its use for a given month — lets you submit your I-485 application (and get a work permit and travel document) before your case can be finally approved. USCIS announces each month on its website which chart applies to I-485 filings; the State Department chart is always used for consular processing filing eligibility.",
  },
  {
    question: "Can I travel internationally while my I-485 is pending?",
    answer:
      "Generally yes, but only with an approved Advance Parole document (Form I-131) unless you're maintaining valid H-1B, L-1, or certain other status — traveling without the right documents can be treated as abandoning your green card application. This is a simplified summary; see our separate Travel Advisory guide for status-by-status details before booking anything.",
  },
  {
    question: "Can I change jobs or employers while my green card case is in progress?",
    answer:
      "It depends heavily on timing. Before your I-140 is approved, switching employers typically means starting PERM and I-140 over from scratch with the new company. Once your I-140 has been approved and your I-485 has been pending 180 days or more, AC21 job portability lets you move to a same or similar-duties job — even with a different employer — without restarting the process, as long as you can show the new role is comparable.",
  },
  {
    question: "What happens if I get laid off while my green card case is pending?",
    answer:
      "If you're laid off before I-140 approval, your case is generally tied to that employer's PERM/I-140 and may not survive the loss of the job offer — you'd likely need a new employer to start over, though you may retain your priority date. If you're laid off after your I-140 has been approved and I-485 has been pending 180+ days, AC21 portability may let you keep your case alive by finding a same-or-similar job within a reasonable time, but you'll also need to maintain lawful status (or rely on the I-485-based 180-day grace protections) in the meantime — this is a situation worth getting advice on quickly.",
  },
  {
    question: "Should I consider an EB-2 to EB-3 downgrade, or an EB-3 to EB-2 upgrade?",
    answer:
      "Because EB-2 and EB-3 sometimes move at different speeds on the Visa Bulletin (and EB-3 has occasionally been faster than EB-2 for countries like India), some people ask their employer to also file at the other category using the same PERM or a new one to keep both queues open, then use whichever priority date becomes current first. It requires employer cooperation and a new I-140 (or amendment), so it's a strategic call best made with an immigration attorney watching the Bulletin trends for your country.",
  },
  {
    question: "What is a PERM audit, and how long does it add to the timeline?",
    answer:
      "The Department of Labor randomly selects some PERM applications for audit, or triggers one due to specific red flags in the filing (e.g., unusual job requirements, foreign language requirements, or the employer's recruitment history). An audit requires the employer to submit additional documentation proving the recruitment process and job requirements were legitimate. Audits can add 6–12+ months to an already-long PERM timeline, so a clean, well-documented initial filing matters.",
  },
  {
    question: "Can my spouse and children be included in my green card application?",
    answer:
      "Yes. Your spouse and unmarried children under 21 can be included as derivative beneficiaries on your I-485 (or consular processing) once your I-140 is approved and your priority date is current, without needing a separate underlying petition. They'll each file their own I-485 (with fees) alongside or after yours, and can typically get their own work and travel authorization while the case is pending.",
  },
  {
    question: "Do I need a lawyer for an employment-based green card?",
    answer:
      "It's not legally required, but PERM and I-140 filings are almost always employer-driven and handled by immigration counsel the company retains — you typically won't be filing those yourself. For self-petitions like EB-1A or NIW, or for anything involving job changes, layoffs, or AC21 portability, an experienced attorney can meaningfully reduce the risk of a denial or a gap in status.",
  },
];
