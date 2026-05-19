"use client";

import { useMemo, useState } from "react";
import { Manrope } from "next/font/google";
import {
  Activity,
  ArrowRight,
  Check,
  ChevronDown,
  FileText,
  ShieldCheck,
  Zap,
} from "lucide-react";
import Link from "next/link";

const homeFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const carrierMatrix = {
  "United Kingdom (UK)": [
    {
      name: "SkyCargo",
      sub: "Premium Air Freight",
      initials: "SC",
      bg: "bg-green-100 text-green-700",
      level: "Priority",
      levelColor: "bg-orange-100 text-orange-700",
      transit: "2-4 Business Days",
      rate: "$12.40",
    },
    {
      name: "Maersk",
      sub: "LCL Container Service",
      initials: "MK",
      bg: "bg-blue-100 text-blue-700",
      level: "Economy",
      levelColor: "bg-slate-200 text-slate-700",
      transit: "18-24 Business Days",
      rate: "$3.85",
    },
    {
      name: "FedEx",
      sub: "Direct Door Courier",
      initials: "FX",
      bg: "bg-red-100 text-red-700",
      level: "Express",
      levelColor: "bg-[#1e4b7a] text-white",
      transit: "3-5 Business Days",
      rate: "$15.90",
    },
  ],
  "United States (US)": [
    {
      name: "Delta Cargo",
      sub: "Priority Air Network",
      initials: "DC",
      bg: "bg-sky-100 text-sky-700",
      level: "Priority",
      levelColor: "bg-orange-100 text-orange-700",
      transit: "3-5 Business Days",
      rate: "$13.10",
    },
    {
      name: "MSC",
      sub: "Ocean Consolidation",
      initials: "MS",
      bg: "bg-indigo-100 text-indigo-700",
      level: "Economy",
      levelColor: "bg-slate-200 text-slate-700",
      transit: "20-28 Business Days",
      rate: "$4.25",
    },
    {
      name: "UPS",
      sub: "Door Courier Express",
      initials: "UP",
      bg: "bg-amber-100 text-amber-700",
      level: "Express",
      levelColor: "bg-[#1e4b7a] text-white",
      transit: "4-6 Business Days",
      rate: "$16.75",
    },
  ],
  "Germany (DE)": [
    {
      name: "Lufthansa Cargo",
      sub: "Air Freight Connect",
      initials: "LH",
      bg: "bg-cyan-100 text-cyan-700",
      level: "Priority",
      levelColor: "bg-orange-100 text-orange-700",
      transit: "3-4 Business Days",
      rate: "$11.95",
    },
    {
      name: "Hapag-Lloyd",
      sub: "Ocean LCL Service",
      initials: "HL",
      bg: "bg-blue-100 text-blue-700",
      level: "Economy",
      levelColor: "bg-slate-200 text-slate-700",
      transit: "19-25 Business Days",
      rate: "$4.05",
    },
    {
      name: "DHL Express",
      sub: "Commercial Courier",
      initials: "DH",
      bg: "bg-yellow-100 text-yellow-700",
      level: "Express",
      levelColor: "bg-[#1e4b7a] text-white",
      transit: "3-5 Business Days",
      rate: "$15.60",
    },
  ],
  "France (FR)": [
    {
      name: "Air France KLM",
      sub: "Priority Cargo Routing",
      initials: "AF",
      bg: "bg-blue-100 text-blue-700",
      level: "Priority",
      levelColor: "bg-orange-100 text-orange-700",
      transit: "3-5 Business Days",
      rate: "$12.20",
    },
    {
      name: "CMA CGM",
      sub: "Ocean Freight Option",
      initials: "CM",
      bg: "bg-purple-100 text-purple-700",
      level: "Economy",
      levelColor: "bg-slate-200 text-slate-700",
      transit: "18-23 Business Days",
      rate: "$3.95",
    },
    {
      name: "TNT",
      sub: "Fast Parcel Network",
      initials: "TN",
      bg: "bg-rose-100 text-rose-700",
      level: "Express",
      levelColor: "bg-[#1e4b7a] text-white",
      transit: "4-6 Business Days",
      rate: "$15.20",
    },
  ],
} as const;

const faqs = [
  {
    q: "How are rates calculated?",
    a: "Rates are calculated from dimensional weight, actual weight, route availability, fuel conditions, and service speed.",
  },
  {
    q: "Are there hidden fees?",
    a: "No. We aim to present transparent pricing guidance. Final customs duties and destination taxes depend on shipment type and receiving country rules.",
  },
  {
    q: "Can I lock in a rate for future shipments?",
    a: "Yes. Fixed-rate arrangements are available for higher-volume and recurring business lanes after route review.",
  },
];

const included = [
  {
    icon: FileText,
    title: "Customs Documentation",
    desc: "Structured support for invoices, packing lists, and key export paperwork.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=900&auto=format&fit=crop",
    imageAlt: "Customs paperwork and documents",
  },
  {
    icon: Activity,
    title: "Real-Time Tracking",
    desc: "Live milestone visibility from pickup through customs and final delivery.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=900&auto=format&fit=crop",
    imageAlt: "Tracking analytics on a screen",
  },
  {
    icon: ShieldCheck,
    title: "Standard Protection",
    desc: "Baseline shipment protection and guided support for sensitive cargo flows.",
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=900&auto=format&fit=crop",
    imageAlt: "Secured logistics containers",
  },
];

const sectionTitleClass =
  "text-balance text-[1.7rem] font-bold tracking-[-0.02em] text-[#1e4b7a] sm:text-[1.95rem] lg:text-[2.25rem]";
const sectionCopyClass =
  "mx-auto mt-4 max-w-2xl text-[0.92rem] font-normal leading-7 text-slate-600 sm:text-[0.98rem]";
const cardClass =
  "rounded-[20px] border border-[#d9e2ec] bg-white p-5 shadow-[0_10px_30px_rgba(30,75,122,0.06)] sm:p-6 lg:p-7";

export default function PricingPage() {
  const [origin, setOrigin] = useState<keyof typeof carrierMatrix>("United Kingdom (UK)");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const carriers = useMemo(() => carrierMatrix[origin], [origin]);

  return (
    <div className={`${homeFont.className} min-h-screen bg-[#f6f8fc] text-[#1e4b7a]`}>
      <section className="relative isolate overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-32">
        <div className="absolute inset-0 -z-20">
          <img
            src="https://images.unsplash.com/photo-1493946740644-2d8a1f1a6aff?q=80&w=1600&auto=format&fit=crop"
            alt="Container port"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1e4b7a]/94 via-[#1e4b7a]/86 to-[#1e4b7a]/35" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-[#f6f8fc]" />

        <div className="container relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-[20px] border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#ffd6bd] backdrop-blur-xl">
                <Zap className="h-3.5 w-3.5 fill-[#fe6801] text-[#fe6801]" />
                Pricing Intelligence
              </div>
              <h1 className="text-balance text-[2.45rem] font-bold leading-[1.02] tracking-[-0.03em] text-white sm:text-[3.35rem] lg:text-[4.4rem]">
                <span className="text-white">Clear pricing for</span>{" "}
                <span className="text-[#fe6801]">global shipping decisions.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-[0.98rem] font-normal leading-7 text-slate-100 md:text-[1.06rem] md:leading-8 lg:text-[1.12rem]">
                Compare route options, review estimated cost per kilogram, and understand what is included before you commit to a shipping lane.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-[20px] bg-[#fe6801] px-7 text-sm font-bold text-white transition-colors hover:bg-[#e65d00]"
                >
                  Start Shipping
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center rounded-[20px] border border-white/25 bg-white/10 px-7 text-sm font-semibold text-white transition-colors hover:bg-white/16"
                >
                  Contact Sales
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                { value: "Live", label: "Rate Visibility" },
                { value: "Air / Ocean / Express", label: "Mode Comparison" },
                { value: "130+", label: "Country Coverage" },
                { value: "24/7", label: "Support Access" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[20px] border border-white/15 bg-white/10 px-5 py-5 text-white shadow-[0_10px_24px_rgba(30,75,122,0.18)] backdrop-blur-xl"
                >
                  <p className="text-[1.55rem] font-bold leading-none tracking-[-0.02em] sm:text-[1.8rem]">{item.value}</p>
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-200">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-8 pb-8 sm:-mt-10 sm:pb-12">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
          <div className={cardClass}>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-[20px] bg-orange-50">
                  <Activity className="h-4 w-4 text-[#1e4b7a]" />
                </div>
                <h2 className="mt-4 text-[1.3rem] font-bold tracking-[-0.02em] text-[#1e4b7a]">Instant Rate Calculator</h2>
                <p className="mt-2 max-w-xl text-[0.92rem] leading-7 text-slate-600">
                  Select an origin country to view current comparative pricing for routes into India.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:min-w-[540px]">
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Origin Country</label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value as keyof typeof carrierMatrix)}
                    className="h-12 w-full rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] px-4 text-sm font-medium text-[#1e4b7a] outline-none transition-shadow focus:shadow-[0_0_0_4px_rgba(254,104,1,0.12)]"
                  >
                    {Object.keys(carrierMatrix).map((country) => (
                      <option key={country}>{country}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Destination</label>
                  <div className="flex h-12 items-center justify-between rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] px-4 text-sm font-medium text-[#1e4b7a]">
                    <span>India</span>
                    <span className="rounded-full bg-slate-200 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                      IN
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-20 lg:pb-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
          <div className="mb-8">
            <h2 className={sectionTitleClass}>Market Comparative Rates</h2>
            <p className="mt-3 max-w-2xl text-[0.92rem] leading-7 text-slate-600">
              Comparative guidance for <span className="font-semibold text-[#1e4b7a]">{origin}</span> to India based on current network conditions.
            </p>
          </div>

          <div className="hidden overflow-hidden rounded-[20px] border border-[#d9e2ec] bg-white shadow-[0_10px_30px_rgba(30,75,122,0.06)] lg:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-slate-200 bg-[#f8fafc]">
                  <tr>
                    <th className="px-8 py-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Provider</th>
                    <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Service Level</th>
                    <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Transit Time</th>
                    <th className="px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Cost Per KG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {carriers.map((carrier) => (
                    <tr key={carrier.name} className="transition-colors hover:bg-slate-50/70">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] text-[11px] font-bold ${carrier.bg}`}>
                            {carrier.initials}
                          </div>
                          <div>
                            <p className="text-[0.95rem] font-semibold text-[#1e4b7a]">{carrier.name}</p>
                            <p className="mt-0.5 text-[0.82rem] text-slate-500">{carrier.sub}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`rounded-[20px] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${carrier.levelColor}`}>
                          {carrier.level}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-[0.92rem] font-medium text-slate-600">{carrier.transit}</td>
                      <td className="px-6 py-5 text-[1.1rem] font-bold tracking-[-0.02em] text-[#1e4b7a]">{carrier.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-100 bg-[#f8fafc] px-8 py-4">
              <p className="text-[0.82rem] text-slate-500">
                These are indicative planning rates. Final pricing depends on shipment dimensions, commodity type, and route availability.
              </p>
            </div>
          </div>

          <div className="grid gap-4 lg:hidden">
            {carriers.map((carrier) => (
              <article key={carrier.name} className={cardClass}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] text-[11px] font-bold ${carrier.bg}`}>
                      {carrier.initials}
                    </div>
                    <div>
                      <p className="text-[0.96rem] font-semibold text-[#1e4b7a]">{carrier.name}</p>
                      <p className="text-[0.84rem] text-slate-500">{carrier.sub}</p>
                    </div>
                  </div>
                  <span className={`rounded-[20px] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] ${carrier.levelColor}`}>
                    {carrier.level}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] p-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[0.86rem] text-slate-500">Transit Time</span>
                    <span className="text-[0.9rem] font-medium text-[#1e4b7a]">{carrier.transit}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[0.86rem] text-slate-500">Cost Per KG</span>
                    <span className="text-[1.05rem] font-bold tracking-[-0.02em] text-[#1e4b7a]">{carrier.rate}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
          <div className="mb-12 text-center">
            <h2 className={sectionTitleClass}>Comprehensive Value</h2>
            <p className={sectionCopyClass}>
              Every estimate is positioned as part of a broader logistics service, not just a transport line item.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {included.map(({ icon: Icon, title, desc, image, imageAlt }) => (
              <article key={title} className={cardClass}>
                <div className="overflow-hidden rounded-[16px]">
                  <img src={image} alt={imageAlt} className="h-36 w-full object-cover" loading="lazy" />
                </div>
                <h3 className="mt-5 text-[1.2rem] font-bold tracking-[-0.02em] text-[#1e4b7a]">{title}</h3>
                <p className="mt-3 text-[0.92rem] leading-7 text-slate-600">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-16">
          <div className="mb-12 text-center">
            <h2 className={sectionTitleClass}>Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={faq.q} className="overflow-hidden rounded-[20px] border border-[#d9e2ec] bg-white shadow-[0_8px_24px_rgba(30,75,122,0.05)]">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left sm:p-6"
                >
                  <span className="text-[0.98rem] font-semibold text-[#1e4b7a]">{faq.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${openFaq === index ? "rotate-180" : ""}`}
                  />
                </button>
                {openFaq === index ? (
                  <div className="border-t border-slate-100 px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                    <p className="text-[0.92rem] leading-7 text-slate-600">{faq.a}</p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-16">
          <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#1e4b7a] via-[#1e4b7a] to-[#1a2f45] p-6 text-center text-white shadow-[0_30px_70px_rgba(30,75,122,0.20)] sm:p-8 lg:p-12">
            <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#fe6801]/20 blur-3xl" />
            <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-[#fe6801]/10 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-balance text-[1.8rem] font-bold tracking-[-0.02em] sm:text-[2.1rem] lg:text-[2.7rem]">
                Ready for precise logistics pricing?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-[0.96rem] leading-7 text-slate-100">
                Talk to us about your route, shipment profile, and expected volume. We will help you shape the right service and pricing approach.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center rounded-[20px] bg-[#fe6801] px-7 text-sm font-bold text-white transition-colors hover:bg-[#e65d00]"
                >
                  Get a Custom Quote
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center rounded-[20px] border border-white/20 bg-white/10 px-7 text-sm font-semibold text-white transition-colors hover:bg-white/18"
                >
                  Contact Sales
                </Link>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 text-[12px] text-orange-100">
                <Check className="h-4 w-4" />
                Transparent pricing guidance with route-based support
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
