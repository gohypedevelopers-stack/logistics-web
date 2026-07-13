import Link from "next/link";

const sections = [
  {
    title: "Use of Platform",
    body:
      "By using the platform, you agree to provide accurate account and shipment details, comply with applicable laws, and avoid prohibited or restricted cargo categories.",
  },
  {
    title: "Shipment Responsibilities",
    body:
      "Customers are responsible for correct declarations, packaging standards, and supporting documentation required for customs and transport operations.",
  },
  {
    title: "Pricing and Payments",
    body:
      "Rates, duties, and service fees may vary by lane, carrier, and regulatory changes. Invoices must be paid according to agreed terms.",
  },
  {
    title: "Service Availability",
    body:
      "We aim for high availability but cannot guarantee uninterrupted service due to carrier delays, customs actions, weather, or force majeure events.",
  },
  {
    title: "Fraud and Safety",
    body:
      "For scam warnings, impersonation guidance, and official communication rules, review our Fraud Awareness and Security Disclaimer.",
  },
  {
    title: "Changes to Terms",
    body:
      "We may update these terms from time to time. Continued use of the platform after updates constitutes acceptance of the revised terms.",
  },
];

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-white pt-28 pb-20">
      <div className="container mx-auto max-w-5xl px-6 lg:px-12">
        <div className="border-b border-slate-200 pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#fe6801]">SHIP2SELL</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#1e4b7a]">Terms of Service</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            These terms govern your use of the SHIP2SELL platform, including account access, shipment handling, payments, and service
            availability.
          </p>
        </div>

        <div className="mt-8 rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] p-5 text-sm leading-7 text-slate-600">
          Last updated: <span className="font-semibold text-slate-900">May 14, 2026</span>
        </div>

        <section className="mt-8 rounded-[24px] border border-[#d9e2ec] bg-gradient-to-br from-[#1e4b7a] to-[#14385d] p-6 text-white shadow-[0_18px_44px_rgba(30,75,122,0.12)] sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#ffd1ad]">Important Notice</p>
          <h2 className="mt-3 text-2xl font-black tracking-tight sm:text-[2rem]">Read this together with our fraud awareness guidance.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-100">
            If you receive suspicious emails, calls, or payment requests claiming to be from SHIP2SELL, verify the sender and review the
            Fraud Awareness and Security Disclaimer before responding.
          </p>
          <Link
            href="/fraud-awareness"
            className="mt-5 inline-flex items-center rounded-full bg-white px-5 py-3 text-sm font-bold text-[#1e4b7a] transition-colors hover:bg-[#f8fafc]"
          >
            Open Fraud Awareness
          </Link>
        </section>

        <article className="mt-10 grid gap-5 md:grid-cols-2">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-[22px] border border-[#d9e2ec] bg-white p-5 shadow-[0_12px_28px_rgba(30,75,122,0.05)]"
            >
              <h2 className="text-lg font-bold text-[#1e4b7a]">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{section.body}</p>
            </section>
          ))}
        </article>

        <section className="mt-8 rounded-[22px] border border-[#d9e2ec] bg-[#f8fafc] p-6">
          <h2 className="text-lg font-bold text-[#1e4b7a]">Need support?</h2>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            Use the contact page for platform questions, shipment concerns, or legal requests.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
            <Link href="/contact" className="text-[#1e4b7a] underline">
              Contact
            </Link>
            <Link href="/privacy" className="text-[#1e4b7a] underline">
              Privacy Policy
            </Link>
            <Link href="/fraud-awareness" className="text-[#1e4b7a] underline">
              Fraud Awareness
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
