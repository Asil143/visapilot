export interface H1BStep {
  title: string;
  description: string;
  items: string[];
  link?: string;
}

export const H1B_STEPS: H1BStep[] = [
  {
    title: "Employer Files Labor Condition Application (LCA)",
    description: "Your employer must file an LCA with the Department of Labor (DOL) before filing the H-1B petition.",
    items: ["Employer posts LCA notice at worksite for 10 business days", "DOL certifies LCA (usually 7 days)", "LCA covers job title, wage, location, and period of employment", "Wage must be prevailing wage or actual wage, whichever is higher"],
    link: "https://flag.dol.gov/",
  },
  {
    title: "H-1B Cap Registration (March each year)",
    description: "For cap-subject H-1Bs, employers must register online before the full petition is filed. USCIS conducts a lottery if registrations exceed the cap.",
    items: ["Registration dates vary; USCIS announces the exact window each year", "Registration fee: $215 per beneficiary", "Selection is beneficiary-centric — you're entered once no matter how many employers register you, so duplicate registrations no longer improve your odds", "Wait for lottery selection notice", "Only selected registrants can file a full petition"],
    link: "https://www.uscis.gov/h1b",
  },
  {
    title: "If You're Not Selected in the Lottery",
    description: "Most registrants aren't selected in a given year. You have several options for staying in status and trying again.",
    items: ["Re-register the following March — there's no limit on how many years in a row you can try", "F-1 students on OPT can bridge on a STEM OPT extension (24 extra months) if their degree qualifies and their employer is enrolled in E-Verify", "Consider cap-exempt employers — universities, affiliated nonprofits, and nonprofit or government research organizations can file H-1Bs year-round with no lottery", "Explore other visa categories your background may qualify for, such as O-1 (extraordinary ability), L-1 (intracompany transfer), TN (Canada/Mexico), or E-3 (Australian citizens)"],
  },
  {
    title: "File Form I-129 (Petition for Nonimmigrant Worker)",
    description: "If selected in the lottery, your employer files the full H-1B petition.",
    items: ["File I-129 with all required evidence", "Include specialty occupation evidence and a degree evaluation if applicable", "Pay the current I-129 fee plus any applicable ACWIA, asylum program, fraud-prevention, and employer-specific fees", "Optional: Premium Processing ($2,805) for a faster decision"],
    link: "https://www.uscis.gov/i-129",
  },
  {
    title: "Premium Processing: Is It Worth It?",
    description: "Premium Processing is an optional add-on that requires USCIS action within 15 business days for eligible H-1B petitions; it does not guarantee approval.",
    items: ["Current fee: $2,805, paid on top of standard filing fees", "USCIS must take qualifying action within 15 business days, or refund the fee", "Can be requested when the petition is filed, or upgraded later while the case is pending", "Not available during the initial cap registration step — only once the full I-129 petition is filed"],
  },
  {
    title: "H-1B Approval and Start Date",
    description: "Cap-subject H-1B start date is October 1 of the fiscal year. Cap-exempt employers can start anytime.",
    items: ["Receive I-797 Approval Notice", "Start date: October 1 (cap-subject)", "Initial period: 3 years (up to 6 years total)", "Cap-gap protects F-1 OPT students during transition"],
  },
  {
    title: "H-4 Dependents and Work Authorization",
    description: "Your spouse and unmarried children under 21 can accompany you in H-4 status, and some H-4 spouses can also work.",
    items: ["Spouse and children file I-539 to change to or extend H-4 status, usually alongside your H-1B petition or extension", "H-4 status is entirely dependent on your H-1B status — it ends if yours does", "H-4 spouses may apply for an Employment Authorization Document (EAD) via Form I-765 if you have an approved I-140, or have been granted an H-1B extension beyond 6 years under AC21", "H-4 EAD processing can take several months; work isn't authorized until the EAD is approved"],
  },
  {
    title: "Extensions, Portability, and the Green Card Transition",
    description: "H-1B can be extended beyond 6 years once a green card process is underway, and you can generally change employers without restarting the clock.",
    items: ["File I-129 extension 6 months before expiry", "If I-140 approved for 365+ days: eligible for 3-year extensions past the 6-year cap under AC21", "If PERM labor certification or I-140 has been pending 365+ days without a decision: eligible for 1-year extensions under AC21", "H-1B portability: a new employer can file a transfer petition, and you can generally start working for them as soon as USCIS receives it — you don't have to wait for approval", "The green card process typically starts with PERM labor certification, then Form I-140 — see the separate green card guide for the full path from H-1B to permanent residence"],
  },
];

export const H1B_FAQ: { q: string; a: string }[] = [
  { q: "What is the H-1B annual cap?", a: "65,000 visas per year, plus 20,000 additional for US master's degree holders. Some employers (universities, nonprofits, government research) are cap-exempt." },
  { q: "Can I work for multiple H-1B employers?", a: "Yes — you can work for multiple H-1B employers concurrently. Each employer must file a separate H-1B petition. You cannot work for an employer who has not filed on your behalf." },
  { q: "What is cap-gap?", a: "For an eligible, timely filed H-1B change-of-status request, cap-gap can automatically extend F-1 status and employment authorization. Under the current rule, the extension generally ends April 1 of the fiscal year for which H-1B status is requested, or earlier if the request is denied, withdrawn, or otherwise ends." },
  { q: "Can I travel while my H-1B extension is pending?", a: "You can travel if your current H-1B is still valid. If it expires while you're abroad, you need a valid H-1B visa stamp to re-enter. Consult an attorney before traveling with a pending extension." },
  { q: "What happens if I'm laid off on H-1B?", a: "You have a grace period of 60 days (or until your H-1B end date, whichever is shorter) to find a new employer who will file an H-1B transfer, change to another status, or depart the US." },
  { q: "Can I work part-time on an H-1B?", a: "Yes. Your employer files the LCA and I-129 petition specifying part-time hours, and the wage offered must still meet the prevailing or actual wage requirement for that reduced schedule. You're limited to the specific hours and employer listed on the approved petition." },
  { q: "Do I need a new petition if my job title or duties change with the same employer?", a: "If the change is material — a substantially different job duties, a new work location outside the area covered by your LCA, or a significant pay change — your employer must file an amended H-1B petition before you start the new role. Minor changes, like a title update with the same underlying duties and pay, generally don't require an amendment, but it's worth confirming with an immigration attorney." },
  { q: "If I transfer to a new employer, can I start working right away?", a: "Often yes. Under H-1B portability rules, you can begin working for the new employer as soon as they properly file the transfer petition (I-129) with USCIS — you don't need to wait for approval, as long as you were maintaining valid H-1B status and weren't working without authorization beforehand. If the transfer is later denied, you'd need to stop working for that employer." },
  { q: "What does it mean if my visa is stuck in \"administrative processing\" (221(g)) after my interview?", a: "A 221(g) means the consular officer needs more time or more documents before deciding your case — often for additional security screening or verification. It can take anywhere from a few weeks to several months, and there's usually no way to expedite it. Check your case status through the Consular Electronic Application Center and respond quickly to any document requests." },
  { q: "Can my H-1B really be extended past the normal 6-year limit?", a: "Yes, under the American Competitiveness in the Twenty-First Century Act (AC21). If your employer filed a PERM labor certification or I-140 at least 365 days before your 6-year limit, you can get 1-year extensions. If your I-140 is already approved, you can get 3-year extensions until you're able to file for a green card (adjustment of status)." },
  { q: "Can my spouse work in the US while I'm on H-1B?", a: "Only if they qualify for an H-4 EAD. This generally requires that you have an approved I-140 petition, or that you've been granted an H-1B extension beyond the 6-year limit under AC21. Your spouse must file Form I-765 and receive an approved EAD before starting work." },
  { q: "How long can I stay in the US if I lose my job on H-1B?", a: "You get up to a 60-day grace period (or the remainder of your authorized stay, if shorter) to find a new sponsoring employer, change to another visa status, or leave the country. You are not authorized to work during this grace period unless a new employer's H-1B petition has been filed and you're relying on portability." },
  { q: "Can I start my own business or be self-employed on an H-1B?", a: "It's very restricted. H-1B requires a genuine employer-employee relationship, meaning the petitioning entity must have the right to control your work, including hiring, firing, pay, and supervision. Owning a company that sponsors your own H-1B is possible in limited cases — for example, if an independent board of directors controls your employment terms — but it's complex and denial-prone, so get an experienced immigration attorney involved before attempting it." },
  { q: "Do I need a bachelor's degree to qualify for H-1B?", a: "You need the equivalent of a US bachelor's degree in a field related to the job (a \"specialty occupation\"). If you don't have the degree itself, USCIS allows combinations of education, specialized training, and progressively responsible work experience to be evaluated as equivalent — generally, three years of relevant work experience can substitute for one year of college." },
];
