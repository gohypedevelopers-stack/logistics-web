import Link from "next/link";

export default function FraudAwarenessPage() {
  return (
    <main className="min-h-screen bg-white pt-28 pb-20">
      <div className="container mx-auto max-w-5xl px-6 lg:px-12">
        <div className="border-b border-slate-200 pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#fe6801]">SHIP2SELL</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-[#1e4b7a]">Fraud Awareness and Security Disclaimer</h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            At SHIP2SELL, we are committed to protecting your privacy and your safety. Stay vigilant against fraudulent activity by
            individuals or entities misusing the SHIP2SELL brand.
          </p>
        </div>

        <div className="mt-8 rounded-[20px] border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-900">
          Important: official communications are sent only from email addresses ending in <strong>@ship2sell.com</strong>. The only
          authorized payment email is <strong>info@ship2sell.com</strong>.
        </div>

        <article className="mt-10 space-y-8 text-slate-700">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#1e4b7a]">1. Fake Franchise and Email Scams</h2>
            <p className="text-sm leading-7">
              Fraudsters may try to impersonate SHIP2SELL to offer fake franchise opportunities. Messages or payment requests from other
              domains, WhatsApp numbers, or unsolicited phone calls are not from SHIP2SELL.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#1e4b7a]">2. Phishing and Fake Delivery Messages</h2>
            <p className="text-sm leading-7">
              Be cautious of SMS or emails that claim a delivery failed and ask you to click suspicious links or share personal details.
              Fraudulent URLs may look similar to ours but contain misspellings or unusual endings.
            </p>
            <div className="rounded-[18px] border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              Examples of suspicious links mentioned in the policy:
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>//SHIP2SELLxx[.]top/in/home[.]html</li>
                <li>https://SHIP2SELLma[.]top</li>
                <li>https://SHIP2SELLms[.]top</li>
              </ul>
              <p className="mt-3 font-medium text-slate-900">Always verify the website link carefully before taking any action.</p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#1e4b7a]">3. Payment and OTP Requests</h2>
            <p className="text-sm leading-7">
              SHIP2SELL never requests payments through unofficial channels or asks for your PIN, OTP, or other sensitive information.
              Payments are accepted only for official shipping-related services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#1e4b7a]">4. Suspicious Law Enforcement Calls</h2>
            <p className="text-sm leading-7">
              Be cautious if someone claims to be from SHIP2SELL or law enforcement and accuses you of illegal shipments in your name.
              These are scams. Do not share personal or financial details.
            </p>
            <p className="text-sm leading-7">
              If you face financial loss, report immediately to the Cyber Crime Helpline at <strong>1930</strong> or visit{" "}
              <a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#1e4b7a] underline">
                cybercrime.gov.in
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#1e4b7a]">5. Reporting Fraud</h2>
            <p className="text-sm leading-7">
              Call 1930 or report online at{" "}
              <a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#1e4b7a] underline">
                cybercrime.gov.in
              </a>
              . Report suspicious calls or SMS to{" "}
              <a href="https://sancharsaathi.gov.in/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#1e4b7a] underline">
                sancharsaathi.gov.in
              </a>{" "}
              within 3 days for prompt telecom action.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#1e4b7a]">6. Official Social Media Channels</h2>
            <p className="text-sm leading-7">SHIP2SELL only contacts customers through verified accounts:</p>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-7">
              <li>
                Facebook:{" "}
                <a href="https://www.facebook.com/SHIP2SELL" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#1e4b7a] underline">
                  facebook.com/SHIP2SELL
                </a>
              </li>
              <li>
                X (Twitter):{" "}
                <a href="https://x.com/SHIP2SELL" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#1e4b7a] underline">
                  x.com/SHIP2SELL
                </a>
              </li>
              <li>
                Instagram:{" "}
                <a
                  href="https://www.instagram.com/SHIP2SELL_official/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[#1e4b7a] underline"
                >
                  instagram.com/SHIP2SELL_official
                </a>
              </li>
            </ul>
            <p className="text-sm leading-7">Messages from any other profiles should be treated as fraudulent.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#1e4b7a]">7. Employment Scams</h2>
            <p className="text-sm leading-7">
              SHIP2SELL does not charge any fees at any stage of the hiring process, including interviews, training, background checks,
              or visa processing. Any request for payment for a job at SHIP2SELL is a scam.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#1e4b7a]">8. Liability Disclaimer</h2>
            <p className="text-sm leading-7">
              SHIP2SELL is not responsible for any losses, charges, or payments made as a result of fraudulent activity or
              impersonation. Victims should immediately contact the cybercrime helpline and the relevant authorities.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#1e4b7a]">9. Access and Authentic Communication</h2>
            <p className="text-sm leading-7">
              Always access our services through our official website at{" "}
              <a href="https://www.ship2sell.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#1e4b7a] underline">
                ship2sell.com
              </a>
              . Before responding to any communication claiming to be from SHIP2SELL, ensure the sender's email address ends with{" "}
              <strong>@ship2sell.com</strong>.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#1e4b7a]">10. Third-Party Websites</h2>
            <p className="text-sm leading-7">
              SHIP2SELL is not responsible for the content, information, or services offered by third-party websites that may link to or
              mention SHIP2SELL. Such sites are neither owned nor controlled by us.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#1e4b7a]">11. Customer Support</h2>
            <p className="text-sm leading-7">For shipment-related assistance, please use our official website.</p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#1e4b7a]">12. Common Signs of a Scam</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm leading-7">
              <li>Unexpected requests for advance payments or delivery charges.</li>
              <li>Demands for personal, banking, or card details.</li>
              <li>Misspelled or suspicious email and website addresses.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-[#1e4b7a]">13. ONDC Disclaimer</h2>
            <p className="text-sm leading-7">
              SHIP2SELL Logistics Seller App maintains a fair and non-discriminatory approach towards all logistics buyer applications
              on the ONDC Network.
            </p>
          </section>

          <div className="rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] p-5 text-sm leading-7 text-slate-600">
            If you want the related legal terms, see our{" "}
            <Link href="/terms" className="font-semibold text-[#1e4b7a] underline">
              Terms of Service
            </Link>
            {" "}and{" "}
            <Link href="/privacy" className="font-semibold text-[#1e4b7a] underline">
              Privacy Policy
            </Link>
            .
          </div>
        </article>
      </div>
    </main>
  );
}
