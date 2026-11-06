import Link from "next/link";

export const metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using StatusClock.",
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mb-12">
    <h2 className="text-xl font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">{title}</h2>
    <div className="text-slate-600 leading-7 space-y-4">{children}</div>
  </section>
);

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-b bg-slate-50">
        <div className="container mx-auto px-4 py-14 max-w-3xl">
          <p className="text-sm font-medium text-blue-600 mb-2">Legal</p>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Terms of Service</h1>
          <p className="text-slate-500 text-sm">Last updated: October 13, 2026 &nbsp;·&nbsp; Effective: October 13, 2026</p>
        </div>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 py-14 max-w-3xl">

        {/* Intro callout */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 mb-12 text-sm text-amber-800 leading-6">
          <strong>Important:</strong> StatusClock is an information platform, not a law firm. Nothing here
          is legal advice. Always consult a licensed immigration attorney for decisions specific to
          your case.
        </div>

        <Section title="1. Acceptance of Terms">
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of StatusClock, including
            statusclock.com and any related mobile applications, APIs, or services (collectively, the &quot;Service&quot;),
            operated by StatusClock (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
          </p>
          <p>
            By creating an account, accessing, or using the Service, you confirm that you have read,
            understood, and agree to be bound by these Terms and our{" "}
            <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
            If you do not agree, you must not use the Service.
          </p>
          <p>
            We reserve the right to modify these Terms at any time. We will provide at least 14 days&apos;
            notice of material changes. Continued use after the effective date of changes constitutes
            acceptance of the revised Terms.
          </p>
        </Section>

        <Section title="2. Not Legal Advice — Important Disclaimer">
          <div className="bg-red-50 border border-red-100 rounded-lg p-4">
            <p className="font-semibold text-red-800 mb-2">StatusClock does not provide legal advice.</p>
            <p className="text-red-700 text-sm leading-6">
              All content, checklists, AI responses, guides, timelines, and tools on this platform are
              provided for general informational and educational purposes only. They do not constitute
              legal advice, legal opinions, or immigration counsel, and no attorney-client relationship
              is formed by using the Service.
            </p>
          </div>
          <p>
            Immigration law is complex, highly fact-specific, and subject to frequent regulatory change.
            Information on StatusClock may be incomplete, outdated, or not applicable to your individual
            circumstances. <strong className="text-slate-800">Always consult a licensed U.S. immigration
            attorney or accredited representative</strong> before making immigration decisions, filing
            applications, or responding to government requests.
          </p>
          <p>
            StatusClock is not responsible or liable for any immigration outcome, USCIS decision, denial,
            deportation, or other legal consequence resulting from use of or reliance on the Service.
          </p>
        </Section>

        <Section title="3. Eligibility">
          <p>
            You must be at least 13 years old to use StatusClock. If you are between 13 and 18, you
            represent that your parent or legal guardian has reviewed and agreed to these Terms on your behalf.
          </p>
          <p>
            By using the Service, you represent and warrant that: (a) you are at least 13 years old;
            (b) you have the legal capacity to enter into a binding agreement; (c) your use of the Service
            does not violate any applicable law or regulation; and (d) all information you provide is
            accurate and complete.
          </p>
        </Section>

        <Section title="4. Accounts">
          <h3 className="font-semibold text-slate-800">4.1 Registration</h3>
          <p>
            Certain features require creating an account. You agree to provide accurate, current, and
            complete information during registration and to keep your account information updated. You
            are responsible for all activity that occurs under your account.
          </p>

          <h3 className="font-semibold text-slate-800 mt-4">4.2 Account Security</h3>
          <p>
            You are responsible for maintaining the confidentiality of your login credentials. Do not
            share your password with others. Notify us immediately at{" "}
            <a href="mailto:support@statusclock.com" className="text-blue-600 hover:underline">support@statusclock.com</a>{" "}
            if you suspect unauthorized access to your account.
          </p>

          <h3 className="font-semibold text-slate-800 mt-4">4.3 Account Termination</h3>
          <p>
            You may delete your account at any time from your account settings. We reserve the right
            to suspend or terminate accounts that: violate these Terms; engage in fraudulent activity;
            have been inactive for more than 24 consecutive months; or pose a security or legal risk.
            We will provide reasonable notice before termination except in cases of serious violations.
          </p>
        </Section>

        <Section title="5. Acceptable Use">
          <p>You agree to use StatusClock only for lawful purposes and in accordance with these Terms. You agree not to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use the Service to create, submit, or file fraudulent immigration documents or misrepresent facts to USCIS, DOL, DOS, or any government agency</li>
            <li>Use the AI Assistant to generate or assist with fraudulent visa applications, fake employment verification letters, or any other deceptive government filings</li>
            <li>Attempt to gain unauthorized access to any part of the Service, other users&apos; accounts, or our infrastructure</li>
            <li>Scrape, crawl, index, or extract data from the Service in bulk using automated tools without our prior written permission</li>
            <li>Reverse engineer, decompile, or attempt to extract the source code of any part of the Service</li>
            <li>Upload or transmit malware, viruses, or any malicious code</li>
            <li>Impersonate any person, entity, or immigration official</li>
            <li>Harass, abuse, or harm other users in community spaces</li>
            <li>Use the Service to violate any applicable federal, state, local, or international law</li>
            <li>Resell or sublicense access to the Service without our written permission</li>
          </ul>
          <p>
            Violation of these rules may result in immediate account suspension, termination, and
            referral to law enforcement where appropriate.
          </p>
        </Section>

        <Section title="6. AI Assistant">
          <p>
            The AI Assistant is powered by Anthropic&apos;s Claude API and designed to answer general
            immigration questions. You acknowledge that:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>AI responses are generated automatically and may be incomplete, inaccurate, or outdated</li>
            <li>The AI Assistant does not have access to your personal immigration file, USCIS case status, or your attorney&apos;s advice</li>
            <li>Responses should be independently verified before being relied upon for any immigration action</li>
            <li>You should <strong className="text-slate-800">never</strong> enter sensitive personal identifiers (passport numbers, Alien Registration Numbers, Social Security Numbers) into the AI chat</li>
            <li>Conversations may be used by Anthropic to improve their models per Anthropic&apos;s Terms of Service, unless you have an enterprise arrangement</li>
          </ul>
        </Section>

        <Section title="7. Subscriptions and Payments">
          <h3 className="font-semibold text-slate-800">7.1 Free and Paid Features</h3>
          <p>
            Some features of StatusClock are free to use without an account (e.g., checklists, basic guides).
            Certain premium features require a paid subscription or one-time purchase.
          </p>

          <h3 className="font-semibold text-slate-800 mt-4">7.2 Billing</h3>
          <p>
            All fees are in U.S. dollars. StatusClock currently collects payment person-to-person
            (Cash App, PayPal, Venmo, Zelle, or Chime). After you send payment, upload a screenshot
            so we can confirm it and activate access — typically within one business day. We do not
            currently process card payments through Stripe or another card processor.
          </p>

          <h3 className="font-semibold text-slate-800 mt-4">7.3 Refund Policy</h3>
          <p>
            All purchases are final and non-refundable unless required by applicable law or unless
            we determine at our sole discretion that a refund is warranted. If you believe you were
            charged in error, contact us within 14 days at{" "}
            <a href="mailto:support@statusclock.com" className="text-blue-600 hover:underline">support@statusclock.com</a>.
          </p>

          <h3 className="font-semibold text-slate-800 mt-4">7.4 Price Changes</h3>
          <p>
            We reserve the right to change pricing at any time with 30 days&apos; notice. Your continued
            use of paid features after a price change constitutes acceptance of the new pricing.
          </p>

          <h3 className="font-semibold text-slate-800 mt-4">7.5 Taxes</h3>
          <p>
            You are responsible for any applicable taxes on your purchases. We will collect sales tax
            where required by law.
          </p>
        </Section>

        <Section title="8. Intellectual Property">
          <h3 className="font-semibold text-slate-800">8.1 Our Content</h3>
          <p>
            All content, branding, code, designs, checklists, guides, and other materials on StatusClock
            are owned by or licensed to us and are protected by copyright, trademark, and other laws.
            You may not copy, reproduce, modify, distribute, or create derivative works without our
            prior written consent.
          </p>

          <h3 className="font-semibold text-slate-800 mt-4">8.2 Your Content</h3>
          <p>
            You retain ownership of content you submit (e.g., community posts, feedback). By submitting
            content, you grant us a worldwide, royalty-free, non-exclusive license to use, display,
            reproduce, and distribute that content to operate and improve the Service.
          </p>
          <p>
            You represent that you own or have the rights to any content you submit, and that it does
            not violate any third-party rights or applicable laws.
          </p>

          <h3 className="font-semibold text-slate-800 mt-4">8.3 Feedback</h3>
          <p>
            If you provide feedback or suggestions about the Service, we may use that feedback without
            any obligation to you.
          </p>
        </Section>

        <Section title="9. Third-Party Links and Services">
          <p>
            StatusClock may link to third-party websites, government portals (e.g., uscis.gov, dol.gov),
            or resources. These links are provided for convenience only. We do not endorse, control,
            or take responsibility for the content or practices of any third-party site. Accessing
            third-party sites is at your own risk.
          </p>
        </Section>

        <Section title="10. Disclaimer of Warranties">
          <p>
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS
            FOR A PARTICULAR PURPOSE, ACCURACY, COMPLETENESS, NON-INFRINGEMENT, OR UNINTERRUPTED
            AVAILABILITY.
          </p>
          <p>
            WE DO NOT WARRANT THAT: (A) THE SERVICE WILL MEET YOUR REQUIREMENTS; (B) THE SERVICE
            WILL BE ERROR-FREE OR AVAILABLE AT ALL TIMES; (C) IMMIGRATION INFORMATION ON THE PLATFORM
            IS CURRENT, ACCURATE, OR COMPLETE; OR (D) AI-GENERATED RESPONSES ARE LEGALLY ACCURATE
            OR APPLICABLE TO YOUR SITUATION.
          </p>
        </Section>

        <Section title="11. Limitation of Liability">
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, STATUSCLOCK AND ITS OFFICERS, DIRECTORS,
            EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
            CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Immigration application denials, rejections, or unfavorable outcomes</li>
            <li>Missed deadlines, status violations, or accrued unlawful presence</li>
            <li>Reliance on AI-generated content or checklist information</li>
            <li>Unauthorized access to your account or data</li>
            <li>Service outages or interruptions</li>
            <li>Any other use or inability to use the Service</li>
          </ul>
          <p>
            OUR TOTAL LIABILITY TO YOU FOR ANY CLAIM ARISING FROM THESE TERMS OR YOUR USE OF THE
            SERVICE SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID TO US IN THE 12 MONTHS
            PRIOR TO THE CLAIM OR (B) $50 USD.
          </p>
          <p>Some jurisdictions do not allow the exclusion of certain warranties or the limitation of liability. In those jurisdictions, our liability is limited to the maximum extent permitted by law.</p>
        </Section>

        <Section title="12. Indemnification">
          <p>
            You agree to defend, indemnify, and hold harmless StatusClock and its officers, directors,
            employees, contractors, and agents from and against any claims, damages, losses, liabilities,
            costs, and expenses (including reasonable legal fees) arising from:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Your use of or access to the Service</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any applicable law or third-party right</li>
            <li>Content you submit to the Service</li>
          </ul>
        </Section>

        <Section title="13. Dispute Resolution">
          <h3 className="font-semibold text-slate-800">13.1 Informal Resolution</h3>
          <p>
            Before initiating any formal dispute, you agree to first contact us at{" "}
            <a href="mailto:support@statusclock.com" className="text-blue-600 hover:underline">support@statusclock.com</a>{" "}
            and give us 30 days to attempt to resolve the issue informally.
          </p>

          <h3 className="font-semibold text-slate-800 mt-4">13.2 Governing Law</h3>
          <p>
            These Terms are governed by the laws of the State of Delaware, without regard to its
            conflict of law principles. Any disputes not resolved informally shall be subject to
            the exclusive jurisdiction of the state and federal courts located in Delaware.
          </p>

          <h3 className="font-semibold text-slate-800 mt-4">13.3 Class Action Waiver</h3>
          <p>
            To the extent permitted by law, you agree to resolve disputes with us individually and
            waive any right to bring or participate in a class action lawsuit or class-wide arbitration.
          </p>
        </Section>

        <Section title="14. General Provisions">
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-slate-800">Entire Agreement:</strong> These Terms and the Privacy Policy constitute the entire agreement between you and StatusClock regarding the Service.</li>
            <li><strong className="text-slate-800">Severability:</strong> If any provision is found unenforceable, the remaining provisions remain in full effect.</li>
            <li><strong className="text-slate-800">Waiver:</strong> Our failure to enforce any provision is not a waiver of our right to enforce it in the future.</li>
            <li><strong className="text-slate-800">Assignment:</strong> You may not assign your rights under these Terms. We may assign our rights to a successor or acquirer.</li>
            <li><strong className="text-slate-800">Force Majeure:</strong> We are not liable for failure to perform due to causes beyond our reasonable control.</li>
          </ul>
        </Section>

        <Section title="15. Contact Us">
          <p>For questions about these Terms:</p>
          <div className="bg-slate-50 rounded-lg p-5 text-sm space-y-1">
            <p><strong className="text-slate-800">StatusClock — Legal Team</strong></p>
            <p>Email: <a href="mailto:support@statusclock.com" className="text-blue-600 hover:underline">support@statusclock.com</a></p>
            <p>Privacy inquiries: <a href="mailto:privacy@statusclock.com" className="text-blue-600 hover:underline">privacy@statusclock.com</a></p>
          </div>
        </Section>

        <div className="mt-10 pt-8 border-t border-slate-100 text-sm text-slate-400">
          <Link href="/privacy" className="text-blue-600 hover:underline mr-4">Privacy Policy</Link>
          <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
