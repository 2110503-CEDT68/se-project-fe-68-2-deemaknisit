// src/app/privacy-policy/page.tsx

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full min-h-screen bg-white px-6 py-20 relative overflow-hidden">
      {/* Aesthetic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#FFD600]" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-stone-50 rounded-full blur-3xl opacity-50" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#FFD600]/5 rounded-full blur-3xl" />

      <main className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12">
          <div className="w-12 h-1 bg-[#FFD600] rounded-full mb-6" />
          <h1 className="text-[#111111] text-5xl font-black tracking-tighter uppercase italic leading-none mb-4">
            Privacy Policy
          </h1>
          <p className="text-stone-400 text-[10px] font-black uppercase tracking-[0.3em]">
            Last Updated: 28 April 2026 &nbsp;·&nbsp; Effective Under Thailand PDPA (B.E. 2562)
          </p>
        </div>

        {/* Intro banner */}
        <div className="bg-[#FFD600] rounded-2xl px-6 py-5 mb-10">
          <p className="text-[#111111] text-xs font-black uppercase tracking-[0.15em] leading-relaxed">
            This Privacy Policy is prepared in accordance with the Personal Data Protection Act B.E. 2562 (2019) (PDPA) of Thailand.
            Please read this policy carefully before using our car rental platform.
          </p>
        </div>

        <div className="flex flex-col gap-8">

          {/* Section 1 */}
          <section className="border-l-4 border-[#FFD600] pl-6">
            <h2 className="text-[#111111] text-[10px] font-black uppercase tracking-[0.25em] mb-3">
              1. Data Controller
            </h2>
            <p className="text-stone-600 text-sm font-medium leading-relaxed">
              Ratatouille Systems Co., Ltd. ("we", "us", or "our") is the Data Controller under the PDPA.
              We are responsible for determining how and why your personal data is processed when you use our car rental platform.
            </p>
            <div className="mt-3 bg-stone-50 rounded-xl px-5 py-4 text-[10px] font-black uppercase tracking-[0.15em] text-stone-500">
              Contact: support@carrental.com
            </div>
          </section>

          {/* Section 2 */}
          <section className="border-l-4 border-[#FFD600] pl-6">
            <h2 className="text-[#111111] text-[10px] font-black uppercase tracking-[0.25em] mb-3">
              2. Personal Data We Collect
            </h2>
            <p className="text-stone-600 text-sm font-medium leading-relaxed mb-3">
              We collect the following categories of personal data under PDPA Section 23:
            </p>
            <ul className="flex flex-col gap-2">
              {[
                ["Identity Data", "Full name, date of birth, national ID or passport number"],
                ["Contact Data", "Email address, telephone number, mailing address"],
                ["Account Data", "Username, encrypted password, account preferences"],
                ["Booking Data", "Rental dates, vehicle selections, pick-up/drop-off locations"],
                ["Payment Data", "Payment method type and transaction references (no full card numbers stored)"],
                ["Usage Data", "Pages visited, features used, timestamps, click patterns"],
                ["Device Data", "IP address, browser type, operating system, device identifiers"],
              ].map(([title, desc]) => (
                <li key={title} className="flex gap-3 items-start bg-stone-50 rounded-xl px-5 py-4">
                  <span className="w-2 h-2 rounded-full bg-[#FFD600] flex-shrink-0 mt-1.5" />
                  <span className="text-sm text-stone-600 font-medium">
                    <span className="text-[#111111] font-black">{title}: </span>
                    {desc}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 3 */}
          <section className="border-l-4 border-[#FFD600] pl-6">
            <h2 className="text-[#111111] text-[10px] font-black uppercase tracking-[0.25em] mb-3">
              3. Legal Basis for Processing (PDPA Section 24)
            </h2>
            <p className="text-stone-600 text-sm font-medium leading-relaxed mb-3">
              We process your personal data only when we have a lawful basis to do so:
            </p>
            <ul className="flex flex-col gap-2">
              {[
                ["Consent", "You have given clear consent for us to process your data for a specific purpose (e.g. marketing emails)."],
                ["Contract", "Processing is necessary to fulfil a contract with you, such as completing a car rental booking."],
                ["Legal Obligation", "Processing is necessary to comply with Thai law or court orders."],
                ["Legitimate Interests", "Processing is necessary for our legitimate business interests, provided these are not overridden by your rights."],
              ].map(([basis, desc]) => (
                <li key={basis} className="flex gap-3 items-start bg-stone-50 rounded-xl px-5 py-4">
                  <span className="w-2 h-2 rounded-full bg-[#FFD600] flex-shrink-0 mt-1.5" />
                  <span className="text-sm text-stone-600 font-medium">
                    <span className="text-[#111111] font-black">{basis}: </span>
                    {desc}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 4 */}
          <section className="border-l-4 border-[#FFD600] pl-6">
            <h2 className="text-[#111111] text-[10px] font-black uppercase tracking-[0.25em] mb-3">
              4. How We Use Your Personal Data
            </h2>
            <ul className="flex flex-col gap-2">
              {[
                "To create and manage your account on our platform",
                "To process, confirm, and manage your car rental bookings",
                "To send booking confirmations, updates, and support communications",
                "To verify your identity and prevent fraudulent activity",
                "To comply with legal obligations under Thai law",
                "To improve our platform's functionality and user experience",
                "To send promotional content — only with your explicit consent",
              ].map((item) => (
                <li key={item} className="flex gap-3 items-start bg-stone-50 rounded-xl px-5 py-4">
                  <span className="w-2 h-2 rounded-full bg-[#FFD600] flex-shrink-0 mt-1.5" />
                  <span className="text-sm text-stone-600 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 5 */}
          <section className="border-l-4 border-[#FFD600] pl-6">
            <h2 className="text-[#111111] text-[10px] font-black uppercase tracking-[0.25em] mb-3">
              5. Disclosure of Personal Data
            </h2>
            <p className="text-stone-600 text-sm font-medium leading-relaxed mb-3">
              We do not sell your personal data. We may disclose it only to:
            </p>
            <ul className="flex flex-col gap-2">
              {[
                ["Car Rental Providers", "To fulfil your booking and arrange vehicle handover"],
                ["Payment Processors", "To securely process your rental payments"],
                ["IT Service Providers", "Who assist in operating our platform under data processing agreements"],
                ["Regulatory Authorities", "When required by Thai law, court order, or government request"],
              ].map(([party, reason]) => (
                <li key={party} className="flex gap-3 items-start bg-stone-50 rounded-xl px-5 py-4">
                  <span className="w-2 h-2 rounded-full bg-[#FFD600] flex-shrink-0 mt-1.5" />
                  <span className="text-sm text-stone-600 font-medium">
                    <span className="text-[#111111] font-black">{party}: </span>
                    {reason}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Section 6 */}
          <section className="border-l-4 border-[#FFD600] pl-6">
            <h2 className="text-[#111111] text-[10px] font-black uppercase tracking-[0.25em] mb-3">
              6. Data Retention
            </h2>
            <p className="text-stone-600 text-sm font-medium leading-relaxed">
              We retain your personal data only as long as necessary for the purposes described in this policy,
              or as required by Thai law. Account data is retained for the duration of your account and up to
              3 years after closure. Booking records may be retained for up to 5 years for legal and tax compliance.
              You may request earlier deletion — see Section 7.
            </p>
          </section>

          {/* Section 7 — Rights */}
          <section className="border-l-4 border-[#FFD600] pl-6">
            <h2 className="text-[#111111] text-[10px] font-black uppercase tracking-[0.25em] mb-3">
              7. Your Rights Under PDPA
            </h2>
            <p className="text-stone-600 text-sm font-medium leading-relaxed mb-3">
              As a data subject under the PDPA, you have the following rights:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ["Right to be Informed", "Know what data we hold and how it is used"],
                ["Right of Access", "Request a copy of your personal data we hold"],
                ["Right to Rectification", "Correct any inaccurate or incomplete data"],
                ["Right to Erasure", "Request deletion of your data where no legal basis exists"],
                ["Right to Restrict Processing", "Limit how we use your data in certain circumstances"],
                ["Right to Data Portability", "Receive your data in a structured, machine-readable format"],
                ["Right to Object", "Object to processing based on legitimate interests"],
                ["Right to Withdraw Consent", "Withdraw consent at any time without affecting prior processing"],
              ].map(([right, desc]) => (
                <div key={right} className="bg-stone-50 rounded-xl px-5 py-4">
                  <p className="text-[#111111] text-[9px] font-black uppercase tracking-[0.15em] mb-1">{right}</p>
                  <p className="text-stone-500 text-xs font-medium">{desc}</p>
                </div>
              ))}
            </div>
            <p className="text-stone-500 text-xs font-medium mt-4 leading-relaxed">
              To exercise any of these rights, contact us at{" "}
              <a href="mailto:support@carrental.com" className="text-[#111111] font-black underline underline-offset-2">
                support@carrental.com
              </a>
              . We will respond within 30 days in accordance with the PDPA.
            </p>
          </section>

          {/* Section 8 */}
          <section className="border-l-4 border-[#FFD600] pl-6">
            <h2 className="text-[#111111] text-[10px] font-black uppercase tracking-[0.25em] mb-3">
              8. Cookies and Tracking
            </h2>
            <p className="text-stone-600 text-sm font-medium leading-relaxed">
              We use cookies to maintain your session and improve platform performance. 
              Cookies that are not strictly necessary will only be set with your consent.
              You can manage your cookie preferences through your browser settings at any time.
            </p>
          </section>

          {/* Section 9 */}
          <section className="border-l-4 border-[#FFD600] pl-6">
            <h2 className="text-[#111111] text-[10px] font-black uppercase tracking-[0.25em] mb-3">
              9. Security of Personal Data
            </h2>
            <p className="text-stone-600 text-sm font-medium leading-relaxed">
              We implement appropriate technical and organisational measures to protect your personal data
              against unauthorised access, loss, or misuse, in line with PDPA requirements.
              In the event of a data breach that affects your rights and freedoms, we will notify
              the Personal Data Protection Committee (PDPC) within 72 hours and inform you without undue delay.
            </p>
          </section>

          {/* Section 10 */}
          <section className="border-l-4 border-[#FFD600] pl-6">
            <h2 className="text-[#111111] text-[10px] font-black uppercase tracking-[0.25em] mb-3">
              10. Changes to This Policy
            </h2>
            <p className="text-stone-600 text-sm font-medium leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of significant changes
              by email or by placing a prominent notice on our platform. Continued use of our services after
              changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Section 11 */}
          <section className="border-l-4 border-[#FFD600] pl-6">
            <h2 className="text-[#111111] text-[10px] font-black uppercase tracking-[0.25em] mb-3">
              11. Contact & Complaints
            </h2>
            <p className="text-stone-600 text-sm font-medium leading-relaxed mb-3">
              If you have any concerns about how we handle your personal data, please contact us first.
              You also have the right to lodge a complaint with the Thai Personal Data Protection Committee (PDPC).
            </p>
            <div className="bg-[#111111] rounded-2xl px-6 py-5 flex flex-col gap-1">
              <p className="text-[#FFD600] text-[9px] font-black uppercase tracking-[0.25em]">Data Controller Contact</p>
              <p className="text-white text-sm font-bold">Ratatouille Systems Co., Ltd.</p>
              <a href="mailto:support@carrental.com" className="text-stone-400 text-xs font-medium underline underline-offset-2">
                support@carrental.com
              </a>
            </div>
          </section>

        </div>

        {/* Footer note */}
        <div className="mt-16 pt-8 border-t border-stone-100 text-center">
          <p className="text-stone-300 text-[8px] font-black uppercase tracking-[0.5em] select-none">
            Ratatouille Systems © 2026 &nbsp;·&nbsp; Governed by Thailand PDPA B.E. 2562
          </p>
        </div>
      </main>
    </div>
  );
}