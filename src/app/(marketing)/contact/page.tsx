import Link from "next/link";
import { Manrope } from "next/font/google";
import { Mail, MapPin, Navigation, Phone, Send, ShieldCheck, Zap } from "lucide-react";

const homeFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const sectionTitleClass =
  "text-balance text-[1.6rem] font-bold tracking-[-0.02em] text-[#1e4b7a] sm:text-[1.85rem] lg:text-[2.15rem]";
const cardClass =
  "rounded-[20px] border border-[#d9e2ec] bg-white p-5 shadow-[0_10px_30px_rgba(30,75,122,0.06)] sm:p-6 lg:p-7";

export default function ContactPage() {
  return (
    <div className={`${homeFont.className} min-h-screen bg-[#f6f8fc] text-[#1e4b7a]`}>
      <section className="relative isolate overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-32">
        <div className="absolute inset-0 -z-20">
          <img
            src="https://images.unsplash.com/photo-1494412651409-8963ce7935a7?q=80&w=1600&auto=format&fit=crop"
            alt="Operations support and logistics movement"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1e4b7a]/94 via-[#1e4b7a]/86 to-[#1e4b7a]/40" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-[#f6f8fc]" />

        <div className="container relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-[20px] border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#ffd6bd] backdrop-blur-xl">
                <Zap className="h-3.5 w-3.5 fill-[#fe6801] text-[#fe6801]" />
                Support & Distribution Network
              </div>
              <h1 className="text-balance text-[2.3rem] font-bold leading-[1.03] tracking-[-0.03em] text-white sm:text-[3.1rem] lg:text-[4.1rem]">
                <span className="text-white">Contact our operations</span>{" "}
                <span className="text-[#fe6801]">team.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-[0.96rem] font-normal leading-7 text-slate-100 md:text-[1.04rem] md:leading-8">
                From volume pricing requests to active shipment support, our team helps customers with route planning, tracking issues, and urgent operational needs.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="mailto:support@ship2sell.com"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-[20px] bg-[#fe6801] px-7 text-sm font-bold text-white transition-colors hover:bg-[#e65d00]"
                >
                  <Mail className="h-4 w-4" />
                  Email Support
                </Link>
                <Link
                  href="/tracking"
                  className="inline-flex h-12 items-center justify-center rounded-[20px] border border-white/25 bg-white/10 px-7 text-sm font-semibold text-white transition-colors hover:bg-white/16"
                >
                  Track a Shipment
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                { value: "24/5", label: "Operations Support" },
                { value: "Fast", label: "Priority Escalation" },
                { value: "US + IN", label: "Hub Coverage" },
                { value: "Live", label: "Shipment Guidance" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[20px] border border-white/15 bg-white/10 px-5 py-5 text-white shadow-[0_10px_24px_rgba(30,75,122,0.18)] backdrop-blur-xl"
                >
                  <p className="text-[1.5rem] font-bold leading-none tracking-[-0.02em] sm:text-[1.75rem]">{item.value}</p>
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-200">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-8 pb-16 sm:-mt-10 sm:pb-20 lg:pb-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
            <div className={cardClass}>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-[20px] bg-orange-50">
                  <Navigation className="h-5 w-5 text-[#1e4b7a]" />
                </div>
                <div>
                  <h2 className="text-[1.2rem] font-bold tracking-[-0.02em] text-[#1e4b7a]">Request Support</h2>
                  <p className="mt-1 text-[0.88rem] text-slate-600">Share your shipment details and our team will review the request.</p>
                </div>
              </div>

              <div className="grid gap-5">
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Primary Contact</label>
                  <input
                    type="text"
                    placeholder="e.g. Jane Doe, Global Supply Chain"
                    className="h-13 w-full rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] px-5 text-sm font-medium text-slate-800 outline-none transition-shadow focus:shadow-[0_0_0_4px_rgba(254,104,1,0.12)]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Business Email</label>
                  <input
                    type="email"
                    placeholder="your.name@enterprise.com"
                    className="h-13 w-full rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] px-5 text-sm font-medium text-slate-800 outline-none transition-shadow focus:shadow-[0_0_0_4px_rgba(254,104,1,0.12)]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Monthly Shipping Volume</label>
                  <select className="h-13 w-full rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] px-5 text-sm font-medium text-slate-700 outline-none transition-shadow focus:shadow-[0_0_0_4px_rgba(254,104,1,0.12)]">
                    <option>Less than 500 kg / month</option>
                    <option>500 to 2,000 kg / month</option>
                    <option>More than 2,000 kg / month</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Shipment Details</label>
                  <textarea
                    placeholder="Share the origin, destination, cargo type, and timing requirements..."
                    className="h-36 w-full resize-none rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] p-5 text-sm font-medium text-slate-800 outline-none transition-shadow focus:shadow-[0_0_0_4px_rgba(254,104,1,0.12)]"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-[0.95fr_1.05fr]">
                  <Link
                    href="mailto:support@ship2sell.com"
                    className="inline-flex h-13 items-center justify-center gap-2 rounded-[20px] bg-[#fe6801] px-6 text-sm font-bold text-white transition-colors hover:bg-[#e65d00]"
                  >
                    <Send className="h-4 w-4" />
                    Send Request
                  </Link>
                  <div className="rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] px-5 py-3 text-[0.84rem] leading-6 text-slate-600">
                    This request opens your email support path and helps our team handle route, pricing, or tracking issues faster.
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="overflow-hidden rounded-[20px] border border-[#d9e2ec] bg-white shadow-[0_10px_30px_rgba(30,75,122,0.06)]">
                <div className="relative h-52 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1200&auto=format&fit=crop"
                    alt="Warehouse operations"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#1e4b7a]/72 to-[#1e4b7a]/26" />
                  <div className="absolute left-6 top-6 rounded-[20px] border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur-xl">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-200">Operations Coverage</p>
                    <p className="mt-1 text-[1rem] font-bold tracking-[-0.02em]">US + India Coordination</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-[20px] bg-[#1e4b7a] p-6 text-white shadow-[0_18px_40px_rgba(30,75,122,0.18)]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[20px] bg-white text-[#1e4b7a]">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-200">US Operations Hub</p>
                  <h3 className="mt-2 text-[1.15rem] font-bold tracking-[-0.02em] text-white">New York Metro Logistics Terminal</h3>
                  <p className="mt-4 text-[0.94rem] font-semibold text-orange-100">+1 (800) 902-8321</p>
                </div>

                <div className={cardClass}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-[20px] bg-orange-50">
                    <MapPin className="h-5 w-5 text-[#1e4b7a]" />
                  </div>
                  <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#fe6801]">India Operations Hub</p>
                  <h3 className="mt-2 text-[1.15rem] font-bold tracking-[-0.02em] text-[#1e4b7a]">Delhi Domestic Customs Gateway</h3>
                  <p className="mt-4 text-[0.94rem] font-semibold text-slate-700">+91 11-2093-1123</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-[20px] bg-gradient-to-br from-[#1e4b7a] via-[#1e4b7a] to-[#295989] p-6 text-white shadow-[0_20px_46px_rgba(30,75,122,0.20)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-[1.15rem] font-bold tracking-[-0.02em]">Direct Support Channel</h3>
                    <p className="mt-2 text-[0.9rem] text-orange-100">support@ship2sell.com</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-white/10">
                    <Mail className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[20px] border border-white/10 bg-white/10 px-4 py-3 text-[0.84rem] text-slate-100">
                    Business route planning
                  </div>
                  <div className="rounded-[20px] border border-white/10 bg-white/10 px-4 py-3 text-[0.84rem] text-slate-100">
                    Shipment support and escalation
                  </div>
                </div>
              </div>

              <div className="rounded-[20px] border border-[#d9e2ec] bg-white p-5 shadow-[0_10px_30px_rgba(30,75,122,0.06)] sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[20px] bg-orange-50">
                    <ShieldCheck className="h-5 w-5 text-[#1e4b7a]" />
                  </div>
                  <div>
                    <h3 className="text-[1.05rem] font-bold text-[#1e4b7a]">Priority support for active shipments</h3>
                    <p className="mt-2 text-[0.88rem] leading-7 text-slate-600">
                      If your shipment is already in transit, include the tracking ID or AWB in your message so the operations team can respond faster.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
