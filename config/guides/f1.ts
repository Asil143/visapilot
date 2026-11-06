import type { Guide } from "@/types";

export const F1_GUIDE: Guide = {
  slug: "f1-visa",
  visa_type: "F-1",
  title: "F-1 Student Visa Guide",
  subtitle: "Everything you need to maintain status and navigate OPT",
  overview:
    "The F-1 visa is a nonimmigrant student visa that allows foreign nationals to study at US academic institutions. Maintaining your F-1 status requires following strict rules set by SEVP (Student and Exchange Visitor Program) and your DSO (Designated School Official).",
  processing_times: "Visa appointment and issuance times vary by embassy or consulate; check the State Department's current wait-time tool.",
  fees: "I-901 SEVIS fee: $350 for F/M students. F visa application fee (MRV): $185; reciprocity or issuance fees may also apply.",
  last_updated: "November 2026",
  steps: [
    {
      title: "Get Accepted & Receive I-20",
      description: "Your US school sends you an I-20 (Certificate of Eligibility) after admission.",
      action_items: [
        "Confirm your enrollment with the school",
        "Receive Form I-20 from your DSO",
        "Review all information on I-20 for accuracy",
        "Pay SEVIS fee (Form I-901) at fmjfee.com",
      ],
      uscis_link: "https://www.ice.gov/sevis",
      estimated_time: "1–4 weeks after acceptance",
    },
    {
      title: "Apply for F-1 Visa at US Embassy/Consulate",
      description: "Schedule and attend a visa interview at the nearest US Embassy.",
      action_items: [
        "Complete DS-160 online application",
        "Pay visa application fee (MRV fee)",
        "Schedule visa interview appointment",
        "Prepare documents: I-20, SEVIS fee receipt, DS-160, passport, financial proof, admission letter",
        "Attend visa interview",
      ],
      uscis_link: "https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html",
      estimated_time: "4–8 weeks before program start",
    },
    {
      title: "Enter the US & Complete Initial Check-In",
      description: "You may enter up to 30 days before your program start date. Your school requires an initial check-in before classes begin.",
      action_items: [
        "Carry original I-20 when entering",
        "Keep your SEVIS fee receipt",
        "Verify your I-94 record at i94.cbp.dhs.gov within 3 days",
        "Complete your school's international student check-in/orientation",
        "Register for classes immediately",
      ],
      estimated_time: "Up to 30 days before program start",
    },
    {
      title: "Maintain Full-Time Enrollment & Good Standing",
      description: "Ongoing requirements throughout each semester to keep your F-1 status valid.",
      action_items: [
        "Enroll full-time each semester (usually 12+ credits undergrad, 9+ credits grad, per your school's definition)",
        "Report address changes to your DSO within 10 days of moving",
        "Keep your passport valid at all times (renew at least 6 months before expiry)",
        "Get a new travel signature on your I-20 before any trip abroad (valid 6 months, 12 months on OPT)",
        "Report changes to your major, degree level, or funding source to your DSO promptly",
        "Avoid unauthorized employment of any kind, on- or off-campus",
      ],
      estimated_time: "Every semester, ongoing",
    },
    {
      title: "Handle a School Transfer (SEVIS Transfer-Out)",
      description: "If you're moving to a different US school, your SEVIS record must be formally transferred so you don't fall out of status in the process.",
      action_items: [
        "Get accepted at the new school and request a transfer-in I-20",
        "Notify your current DSO of your intent to transfer and set a SEVIS 'release date'",
        "Continue following all F-1 rules at your current school until the release date",
        "Confirm your SEVIS record transfers to the new school on the agreed date",
        "Enroll at the new school for the next available term, generally within 5 months of the release date",
        "Complete the new school's DSO check-in before your program start date",
      ],
      uscis_link: "https://studyinthestates.dhs.gov/students/transfer/transfer-schools",
      estimated_time: "Plan 2–3 months before your intended transfer",
    },
    {
      title: "Change Your Degree Level or Program",
      description: "Moving to a new degree level (e.g., bachelor's to master's) or switching programs, even at the same school, usually requires an updated SEVIS record and I-20.",
      action_items: [
        "Get accepted into the new degree program",
        "Ask your DSO whether you need a new SEVIS ID (change of education level) or an update to your existing record",
        "Provide updated financial documentation covering the new program's cost",
        "Confirm the timing so your SEVIS record stays 'Continuing' with no gap in enrollment",
        "Review your new I-20 carefully for accuracy before signing",
      ],
      estimated_time: "4–8 weeks before the new program starts",
    },
    {
      title: "Request a Reduced Course Load (RCL)",
      description: "In limited circumstances you can drop below full-time enrollment without violating status, but only with prior DSO authorization.",
      action_items: [
        "Identify your reason: initial difficulty with English/reading, unfamiliarity with US teaching methods, improper course placement, final semester, or a documented medical condition",
        "Request RCL authorization from your DSO before dropping the class, never after",
        "Provide supporting documentation, such as a letter from a licensed medical professional or academic advisor",
        "Note that medical RCLs are capped at a combined 12 months per degree level",
        "Note that academic-difficulty RCLs are limited to one semester per degree level",
        "Confirm your DSO updates your SEVIS record to reflect the authorized RCL",
      ],
      estimated_time: "Before the semester's add/drop deadline",
    },
    {
      title: "Prepare for Graduation & the OPT Transition",
      description: "As you approach your program end date, plan your next steps well in advance, whether that's OPT, a new program, or departure.",
      action_items: [
        "Confirm your official program completion date with your DSO",
        "Decide whether to apply for Optional Practical Training (OPT), start a new degree program, or change status",
        "File Form I-765 for OPT no earlier than 90 days before your program end date, within 30 days of the DSO recommendation, and no later than 60 days after program completion",
        "Track your 60-day grace period if you're not continuing study or starting approved employment",
        "Ask your DSO to update your SEVIS record and I-20 to reflect your post-completion plan",
        "Keep copies of your final I-20, diploma or transcript, and OPT EAD once issued",
      ],
      uscis_link: "https://www.uscis.gov/opt",
      estimated_time: "Begin planning 3–5 months before your program end date",
    },
  ],
  faq: [
    {
      question: "Can I work on an F-1 visa?",
      answer:
        "On-campus employment is allowed up to 20 hours/week during classes, 40 hours during breaks. Off-campus work requires authorization (CPT or OPT). Unauthorized work is a severe violation that can result in deportation.",
    },
    {
      question: "What is the grace period after graduation?",
      answer:
        "F-1 students get a 60-day grace period after their program end date (or OPT end date) to leave the US, transfer schools, or change status.",
    },
    {
      question: "Can I travel outside the US on F-1?",
      answer:
        "Yes, with a valid visa stamp and travel signature on your I-20 (from your DSO, valid 6 months). Your visa stamp must be valid to re-enter; if expired, you'll need to apply for a new one abroad.",
    },
    {
      question: "What happens if I drop below full-time enrollment?",
      answer:
        "Dropping below full-time without DSO authorization violates your F-1 status. Contact your DSO before dropping classes. Exceptions exist for final semester, medical reasons, and academic difficulty (with DSO approval).",
    },
    {
      question: "What's the difference between CPT and OPT?",
      answer:
        "Curricular Practical Training (CPT) is off-campus work authorized by your DSO that's directly tied to your curriculum, like a required internship, and must be used before you graduate. Optional Practical Training (OPT) is employment authorization from USCIS related to your major that can be used before or after graduation and isn't tied to a specific class. Using 12 months or more of full-time CPT makes you ineligible for OPT, so use it carefully.",
    },
    {
      question: "Can I transfer schools while on F-1?",
      answer:
        "Yes. You'll need to be accepted at the new school, then work with your current DSO to set a SEVIS transfer release date. Your SEVIS record moves to the new school on that date, and you must enroll there by the next available term, generally within 5 months of the release date, to stay in status.",
    },
    {
      question: "What happens to my status if I change my major or degree level?",
      answer:
        "Changing your major at the same degree level is usually just an update your DSO makes to your existing SEVIS record. Moving to a new degree level, like bachelor's to master's, typically requires a new I-20 and SEVIS record. Talk to your DSO before the change so there's no gap in your enrollment history.",
    },
    {
      question: "Can I go part-time in my final semester?",
      answer:
        "Yes, your DSO can authorize a reduced course load if you only need a few remaining credits or one class to complete your degree in your final term. You must get this approved before dropping below full-time, and it only applies to your actual final semester of study.",
    },
    {
      question: "Can my spouse and children join me on F-2 status?",
      answer:
        "Yes, your spouse and unmarried children under 21 can get F-2 dependent visas. F-2 spouses cannot work but may study part-time; F-2 children can attend K-12 school full-time. If your spouse wants to study full-time themselves, they generally need their own F-1 status instead.",
    },
    {
      question: "Can I work remotely for a foreign employer while on F-1?",
      answer:
        "This is a gray area USCIS hasn't clearly addressed, but most DSOs advise that if you're physically present in the US, working for any employer, even a foreign one paying into a foreign bank account, counts as unauthorized employment unless it's covered by CPT or OPT. Talk to your DSO before starting any remote work arrangement.",
    },
    {
      question: "Does academic probation or dismissal affect my F-1 status?",
      answer:
        "Academic probation alone usually doesn't end your status as long as you remain enrolled full-time, but you should notify your DSO. Academic dismissal does end your F-1 status: your SEVIS record gets terminated, and you generally have a short window to depart, transfer, or appeal, so contact your DSO immediately if this happens.",
    },
    {
      question: "Can I stay in the US between finishing one program and starting a new one?",
      answer:
        "Often, yes. This is sometimes called 'bridge' or 'gap' status. If you're continuing to a higher degree level at the same or a different school without a break longer than the annual vacation, your DSO can keep your SEVIS record active as 'Continuing' instead of issuing a new I-20 with a gap, which helps you avoid triggering the 60-day grace period.",
    },
    {
      question: "What does SEVIS termination mean, and can it be fixed?",
      answer:
        "SEVIS termination means SEVP has ended your active F-1 record, usually due to a violation like unauthorized work, failing to enroll full-time, or a criminal issue. A terminated record means you're immediately out of status. Depending on the reason, you may be able to file for reinstatement with USCIS, but talk to your DSO and an immigration attorney right away.",
    },
    {
      question: "Can I travel while my SEVIS transfer is pending?",
      answer:
        "It's risky. Between your transfer release date and enrollment at the new school, you may not have a current travel signature valid for the new school, and CBP officers can question your intent to return to study. Most DSOs recommend avoiding international travel during an active transfer unless the new school's DSO has already issued a signed I-20 and travel signature before you leave.",
    },
  ],
};
