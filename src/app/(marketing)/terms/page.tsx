export default function TermsOfServicePage() {
  return (
    <div className="bg-white min-h-screen pt-28 pb-20">
      <div className="container mx-auto max-w-4xl px-6 lg:px-12">
        <h1 className="text-4xl font-black tracking-tight text-[#1e4b7a]">Terms of Service</h1>
        <p className="mt-3 text-sm font-medium text-slate-500">Last updated: May 14, 2026</p>

        <div className="mt-10 space-y-8 text-slate-600">
          <section>
            <h2 className="text-xl font-bold text-[#1e4b7a]">Use of Platform</h2>
            <p className="mt-2 text-sm leading-relaxed">
              By using the platform, you agree to provide accurate account and shipment details, comply with applicable laws, and avoid
              prohibited or restricted cargo categories.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1e4b7a]">Shipment Responsibilities</h2>
            <p className="mt-2 text-sm leading-relaxed">
              Customers are responsible for correct declarations, packaging standards, and supporting documentation required for customs
              and transport operations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1e4b7a]">Pricing and Payments</h2>
            <p className="mt-2 text-sm leading-relaxed">
              Rates, duties, and service fees may vary by lane, carrier, and regulatory changes. Invoices must be paid according to
              agreed terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1e4b7a]">Service Availability</h2>
            <p className="mt-2 text-sm leading-relaxed">
              We aim for high availability but cannot guarantee uninterrupted service due to carrier delays, customs actions, weather,
              or force majeure events.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1e4b7a]">Changes to Terms</h2>
            <p className="mt-2 text-sm leading-relaxed">
              We may update these terms from time to time. Continued use of the platform after updates constitutes acceptance of the
              revised terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
