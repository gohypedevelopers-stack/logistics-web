export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen pt-28 pb-20">
      <div className="container mx-auto max-w-4xl px-6 lg:px-12">
        <h1 className="text-4xl font-black tracking-tight text-[#1e4b7a]">Privacy Policy</h1>
        <p className="mt-3 text-sm font-medium text-slate-500">Last updated: May 14, 2026</p>

        <div className="mt-10 space-y-8 text-slate-600">
          <section>
            <h2 className="text-xl font-bold text-[#1e4b7a]">Information We Collect</h2>
            <p className="mt-2 text-sm leading-relaxed">
              We collect account information, shipment details, and operational metadata needed to provide logistics services, tracking,
              billing, and support.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1e4b7a]">How We Use Information</h2>
            <p className="mt-2 text-sm leading-relaxed">
              Data is used to create and manage shipments, verify user access, send status and service notifications, improve platform
              reliability, and meet legal/compliance obligations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1e4b7a]">Data Sharing</h2>
            <p className="mt-2 text-sm leading-relaxed">
              We share data only with logistics partners, payment and infrastructure providers, or authorities as required to fulfill
              shipments and comply with applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1e4b7a]">Data Retention & Security</h2>
            <p className="mt-2 text-sm leading-relaxed">
              We retain records for business and legal purposes and implement technical safeguards to protect personal and shipment data
              from unauthorized access.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#1e4b7a]">Contact</h2>
            <p className="mt-2 text-sm leading-relaxed">
              For privacy requests or concerns, contact us through the support channel listed on the Contact page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
