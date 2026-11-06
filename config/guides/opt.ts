import type { Guide } from "@/types";

export const OPT_GUIDE: Guide = {
  slug: "opt-stem-opt",
  visa_type: "OPT",
  title: "OPT & STEM OPT Guide",
  subtitle: "Work authorization for F-1 students after graduation",
  overview:
    "Optional Practical Training (OPT) allows F-1 students to work in their field of study for up to 12 months. STEM OPT is a 24-month extension for eligible STEM graduates, for a total of 36 months.",
  processing_times: "Use USCIS's live processing-time tool by form, category, and office; fixed ranges become stale quickly.",
  fees: "Form I-765: $470 online / $520 paper.",
  last_updated: "November 2026",
  steps: [
    {
      title: "Request OPT Recommendation from DSO",
      description:
        "Contact your DSO 3–4 months before graduation to start the OPT process.",
      action_items: [
        "Meet with your DSO",
        "Confirm graduation date",
        "DSO updates SEVIS and issues new I-20 with OPT recommendation",
        "Receive OPT I-20 from DSO",
      ],
      estimated_time: "Up to 90 days before program end",
    },
    {
      title: "File Form I-765 with USCIS",
      description: "Submit your OPT application to USCIS.",
      action_items: [
        "Complete Form I-765 (Application for Employment Authorization)",
        "Gather required documents: I-20, passport copy, I-94, 2 passport photos",
        "Pay $470 online or $520 on paper for Form I-765",
        "Submit application (can file online or by mail)",
        "Keep copy of everything submitted",
      ],
      uscis_link: "https://www.uscis.gov/i-765",
      estimated_time: "Apply 90–60 days before program end",
    },
    {
      title: "Handle an RFE or Denial",
      description:
        "If USCIS finds your application incomplete or ineligible, they'll issue a Request for Evidence (RFE) or a denial. Don't panic — most RFEs are fixable if you respond correctly and on time.",
      action_items: [
        "Read the RFE notice carefully to see exactly what USCIS is asking for",
        "Respond by the deadline printed on the notice (usually 30–87 days) — late responses are treated as abandoned applications",
        "Send certified copies of the requested evidence, not originals unless specifically asked",
        "If denied, talk to your DSO immediately — a denial does not on its own end your F-1 status, but it does mean no work authorization",
        "Consider consulting an immigration attorney for a denial based on eligibility or a missed deadline",
      ],
      estimated_time: "Varies — respond as soon as possible after receiving notice",
    },
    {
      title: "Receive EAD Card",
      description: "USCIS mails your Employment Authorization Document (EAD).",
      action_items: [
        "Track case status at egov.uscis.gov",
        "Verify all info on EAD card is correct",
        "Note your OPT start and end dates",
        "You cannot start work before EAD start date",
      ],
      estimated_time: "Check USCIS live processing times",
    },
    {
      title: "Report Employment to DSO",
      description: "F-1 rules require you to report employment.",
      action_items: [
        "Report employer name, address, start date to DSO within 10 days of starting",
        "Employment must be in your field of study",
        "Maximum 20 hours/week if still enrolled",
        "Report unemployment periods (max 90 days)",
      ],
    },
    {
      title: "Apply for STEM OPT Extension (if eligible)",
      description: "STEM graduates can apply for a 24-month extension.",
      action_items: [
        "Employer must be E-Verify enrolled",
        "Submit I-983 Training Plan signed by employer and student",
        "File I-765 extension 90 days before OPT expiry",
        "Submit to DSO first, then file with USCIS",
      ],
      uscis_link: "https://www.uscis.gov/opt",
      estimated_time: "Apply 90 days before OPT end date",
    },
    {
      title: "Automatic 180-Day Extension While STEM OPT Is Pending",
      description:
        "If your DSO recommends the STEM OPT extension and you file Form I-765 with USCIS before your current OPT authorization expires, your F-1 status and work authorization automatically extend for up to 180 days (or until USCIS decides your case, whichever is earlier) while the extension is pending.",
      action_items: [
        "Confirm your DSO recommended the STEM extension in SEVIS before your OPT end date",
        "File I-765 for the STEM extension before your current EAD expires — late filing forfeits the automatic extension",
        "Keep working under the same terms during the pending period; you do not need a new EAD to keep working",
        "If USCIS denies the extension, your automatic work authorization ends immediately and you enter your 60-day grace period",
        "Watch your case status closely — this bridge only lasts up to 180 days even if USCIS takes longer",
      ],
      estimated_time: "Up to 180 days, or until USCIS adjudicates the extension",
    },
    {
      title: "Meet I-983 Reporting and Evaluation Obligations",
      description:
        "STEM OPT comes with ongoing compliance duties tied to your Form I-983 Training Plan — these aren't optional, and missing them can jeopardize your status.",
      action_items: [
        "Validate your SEVP Portal information (address, employer, etc.) every 6 months, even if nothing changed",
        "Report any material changes — new employer, supervisor, work location, or reduction in hours — to your DSO within 10 days",
        "Complete a self-evaluation on the I-983 Training Plan at the 12-month mark, signed by you and your supervisor",
        "Complete a final evaluation at the end of the 24-month STEM extension and submit it to your DSO",
        "Be aware your employer may be subject to a site visit by DHS to confirm the training plan is being followed",
      ],
      estimated_time: "Ongoing — every 6 months, plus 12-month and final evaluations",
    },
    {
      title: "End of OPT: 60-Day Grace Period",
      description:
        "Once your OPT or STEM OPT work authorization ends, you get a 60-day grace period to wrap up your stay in the US, unless you're transitioning to another status.",
      action_items: [
        "If not changing status, you have 60 days to prepare to depart the US, transfer to a new SEVIS program, or begin a new degree",
        "You cannot work during the 60-day grace period, even if you have unused unemployment days left",
        "If your H-1B change of status is timely filed and eligible, cap-gap can extend F-1 status and employment authorization; the current regulatory end date is generally April 1 of the fiscal year for which H-1B status is requested",
        "If transferring schools or starting a new program, make sure your SEVIS record is transferred before the grace period ends",
        "Talk to your DSO about your plans well before your authorization ends so your SEVIS record reflects the right next step",
      ],
      estimated_time: "60 days after OPT/STEM OPT end date",
    },
  ],
  faq: [
    {
      question: "How many days can I be unemployed during OPT?",
      answer:
        "Standard OPT: maximum 90 days total unemployment. STEM OPT: maximum 150 days total (including time unemployed during standard OPT). Exceeding this limit violates your F-1 status.",
    },
    {
      question: "Does freelancing or self-employment count for OPT?",
      answer:
        "Self-employment is allowed on standard OPT if you are working in your field of study. Self-employment is NOT allowed on STEM OPT — your employer must be an E-Verify enrolled company.",
    },
    {
      question: "What if my OPT application is still pending when my program ends?",
      answer:
        "If you applied on time (before program end) and have a USCIS receipt notice, you are in a 180-day cap-gap bridge until your EAD arrives or is denied. Check your receipt notice date carefully.",
    },
    {
      question: "Can I do OPT again after completing a second or higher degree?",
      answer:
        "Yes. OPT eligibility resets each time you complete a new, higher educational level — for example, bachelor's then master's, or master's then PhD. You generally cannot use standard OPT twice at the same degree level, but a new degree at a higher level unlocks a fresh 12-month OPT period.",
    },
    {
      question: "What counts as a qualifying STEM degree?",
      answer:
        "Your degree must appear on the DHS STEM Designated Degree Program list, identified by its CIP (Classification of Instructional Programs) code. This code is printed on your I-20 under your degree information. Check the current list on the ICE Study in the States website — some fields you might expect to qualify (like general business) don't, while others are more inclusive than you'd guess.",
    },
    {
      question: "Can I get a second STEM OPT extension?",
      answer:
        "Yes, but only two STEM OPT extensions are allowed in your lifetime, and each must be based on a different, STEM-qualifying degree — you can't get two extensions off the same degree. So a student who used a STEM extension after a bachelor's degree could potentially use a second one after completing a qualifying STEM master's or PhD.",
    },
    {
      question: "How often do I need to report while on STEM OPT?",
      answer:
        "You must validate your information in the SEVP Portal (or with your DSO) every 6 months, even if nothing has changed. Separately, any material change — new employer, address, or a reduction to fewer than 20 hours/week — must be reported within 10 days of the change.",
    },
    {
      question: "What happens if I miss a reporting deadline?",
      answer:
        "Missing the 6-month validation or a 10-day change report can lead your DSO to terminate your SEVIS record for a status violation, which immediately ends your work authorization. If you realize you missed a deadline, contact your DSO right away — catching up quickly, before SEVIS is flagged, is usually your best option.",
    },
    {
      question: "Can I travel internationally while on OPT or STEM OPT?",
      answer:
        "Yes, but it carries real risk, especially with a pending application or after a gap in employment. See our full Travel Advisory guide for what documents to carry and when travel is safe.",
    },
    {
      question: "Does volunteer or unpaid work count toward my OPT employment requirement?",
      answer:
        "It can, as long as it's bona fide work in your field of study, at least 20 hours/week, and you can document it (an offer letter, supervisor confirmation, or organizational verification). Unpaid internships that wouldn't legally require pay for a non-immigrant worker can qualify too — but work invented just to stop the unemployment clock does not.",
    },
    {
      question: "Is there a minimum number of hours I need to work on OPT?",
      answer:
        "Yes — you need to average at least 20 hours per week for the work to count as qualifying employment and avoid accruing unemployment days. You can combine multiple part-time jobs to reach 20 hours/week, as long as all of them relate to your field of study.",
    },
    {
      question: "Can I change employers while on OPT or STEM OPT?",
      answer:
        "Yes. Your EAD is not tied to a specific employer, so you don't need a new EAD to switch jobs. Just report the change to your DSO within 10 days. On STEM OPT specifically, a new employer means a new I-983 Training Plan and the new employer must also be E-Verify enrolled.",
    },
  ],
};
