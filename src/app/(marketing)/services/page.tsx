"use client";

import Link from "next/link";
import { useRef } from "react";
import { Manrope } from "next/font/google";
import {
  Anchor,
  ArrowRight,
  Building2,
  Check,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Globe2,
  Map,
  Plane,
  ShieldCheck,
  Zap,
} from "lucide-react";

const homeFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const serviceCards = [
  {
    id: "air-freight",
    icon: Plane,
    title: "Air Freight",
    image: "https://images.unsplash.com/photo-1529074963764-98f45c47344b?q=80&w=900&auto=format&fit=crop",
    description:
      "Priority cargo movement across major commercial networks with door-to-door visibility for time-sensitive shipments.",
    tag: "Express Available",
    tagClass: "bg-slate-50 text-slate-600 border-slate-200",
  },
  {
    id: "ocean-freight",
    icon: Anchor,
    title: "Ocean Freight",
    image: "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?q=80&w=900&auto=format&fit=crop",
    description:
      "Connected to major ocean carriers for LCL and FCL movement at competitive global rates through Asian and European export hubs.",
    tag: "FCL / LCL",
    tagClass: "bg-slate-50 text-slate-600 border-slate-200",
  },
  {
    id: "warehousing",
    icon: Building2,
    title: "Warehousing",
    image: "https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=900&auto=format&fit=crop",
    description:
      "Short-term layover storage and dedicated B2B warehousing with inventory visibility connected directly to our logistics platform.",
    tag: "Inventory Sync",
    tagClass: "bg-slate-50 text-slate-600 border-slate-200",
  },
  {
    id: "express-courier",
    icon: Map,
    title: "Express Courier",
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=900&auto=format&fit=crop",
    description:
      "Time-critical international documents and parcels with fast pickup windows, milestone scans, and priority dispatch routing.",
    tag: "Same Day Priority",
    tagClass: "bg-slate-50 text-slate-600 border-slate-200",
  },
  {
    id: "customs-brokerage",
    icon: ShieldCheck,
    title: "Customs Brokerage",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=900&auto=format&fit=crop",
    description:
      "Licensed broker support for regulated goods, customs filing, and clearance coordination for sensitive commercial shipments.",
    tag: "Broker Support",
    tagClass: "bg-slate-50 text-slate-600 border-slate-200",
  },
];

const coverageCards = [
  {
    region: "London to Mumbai Corridor",
    tag: "UK-IN",
    desc: "Our flagship UK-India channel with 5-day air coverage and 21-day ocean connectivity.",
    tags: ["Air Freight", "LCL Ocean", "Overnight Docs"],
    status: "Fully Operational",
    statusClass: "bg-green-100 text-green-700",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1000&auto=format&fit=crop",
    imageAlt: "Air cargo route at sunrise",
  },
  {
    region: "New York to Delhi Strategic Lane",
    tag: "US-IN",
    desc: "Premium B2B routing built for technology, healthcare, and high-value commercial shipments.",
    tags: ["Priority Tier", "Temperature Sensitive", "Priority Assist"],
    status: "High Priority",
    statusClass: "bg-orange-100 text-orange-700",
    image:
      "https://images.unsplash.com/photo-1494412519320-aa613dfb7738?q=80&w=1000&auto=format&fit=crop",
    imageAlt: "Container yard from above",
  },
  {
    region: "130+ Countries Worldwide",
    tag: "GLOBAL",
    desc: "Full-service coverage across six continents with scalable support for export, import, and courier flows.",
    tags: ["Air", "Ocean", "Customs", "Last Mile"],
    status: "Global Reach",
    statusClass: "bg-blue-100 text-blue-700",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=1000&auto=format&fit=crop",
    imageAlt: "Global logistics air route",
  },
];

const faqs = [
  {
    q: "How do I track my international shipment?",
    a: "You can track your shipment in real time through our tracking portal using the unique tracking ID shared after booking.",
  },
  {
    q: "Do you handle hazardous materials on the ITAR list?",
    a: "We work within strict compliance frameworks. Certain restricted goods require pre-approval, additional documentation, and route validation.",
  },
  {
    q: "What insurance options are available for high-value goods?",
    a: "Cargo insurance options are available through our support team based on declared value, lane risk, and commodity type.",
  },
];

const sectionTitleClass =
  "text-balance text-[1.7rem] font-bold tracking-[-0.02em] text-[#1e4b7a] sm:text-[1.95rem] lg:text-[2.25rem]";
const sectionCopyClass =
  "mx-auto mt-4 max-w-2xl text-[0.92rem] font-normal leading-7 text-slate-600 sm:text-[0.98rem]";
const lightCardClass =
  "rounded-[20px] border border-[#d9e2ec] bg-white p-5 shadow-[0_10px_30px_rgba(30,75,122,0.06)] sm:p-6 lg:p-7";

export default function ServicesPage() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (direction: "left" | "right") => {
    const node = scrollerRef.current;
    if (!node) return;
    const offset = direction === "left" ? -380 : 380;
    node.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <div className={`${homeFont.className} min-h-screen bg-[#f6f8fc] text-[#1e4b7a]`}>
      <section className="relative isolate flex min-h-[72vh] items-end overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-32">
        <div className="absolute inset-0 -z-20">
          <img
            src="https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?q=80&w=2000&auto=format&fit=crop"
            alt="Container port operations"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1e4b7a]/92 via-[#1e4b7a]/78 to-[#1e4b7a]/30" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-[#f6f8fc]" />

        <div className="container relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-[20px] border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#ffd6bd] backdrop-blur-xl">
              <Zap className="h-3.5 w-3.5 fill-[#fe6801] text-[#fe6801]" />
              Core Services
            </div>
            <h1 className="text-balance text-[2.45rem] font-bold leading-[1.02] tracking-[-0.03em] text-white sm:text-[3.35rem] lg:text-[4.5rem] xl:text-[5.1rem]">
              <span className="text-white">Logistics services built for visible, reliable</span>{" "}
              <span className="text-[#fe6801]">global movement.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[0.98rem] font-normal leading-7 text-slate-100 md:text-[1.06rem] md:leading-8 lg:text-[1.12rem]">
              From final-mile delivery to customs coordination, we simplify complex shipping operations with clear service coverage,
              responsive support, and dependable execution.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center rounded-[20px] bg-[#fe6801] px-7 text-sm font-bold text-white transition-colors hover:bg-[#e65d00]"
              >
                Talk to a Specialist
              </Link>
              <Link
                href="/tracking"
                className="inline-flex h-12 items-center justify-center rounded-[20px] border border-white/25 bg-white/10 px-7 text-sm font-semibold text-white transition-colors hover:bg-white/16"
              >
                Track a Shipment
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-8 pb-8 sm:-mt-10 sm:pb-12">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: "5", label: "Service Categories" },
              { value: "130+", label: "Countries Covered" },
              { value: "24/7", label: "Operations Support" },
              { value: "Real-Time", label: "Tracking Visibility" },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-[20px] border border-[#d9e2ec] bg-white px-5 py-5 shadow-[0_10px_24px_rgba(30,75,122,0.08)]"
              >
                <p className="text-[1.7rem] font-bold leading-none tracking-[-0.02em] text-[#1e4b7a] sm:text-[1.9rem]">
                  {item.value}
                </p>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
          <div className="mb-12 text-center sm:mb-14">
            <h2 className={sectionTitleClass}>Our Core Capabilities</h2>
            <p className={sectionCopyClass}>
              The same service language, structure, and visibility across every lane so customers can understand exactly what moves where.
            </p>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-16 bg-gradient-to-r from-[#f6f8fc] to-transparent lg:block" />
            <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-[#f6f8fc] to-transparent lg:block" />
            <button
              type="button"
              onClick={() => handleScroll("left")}
              className="absolute left-0 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#d9e2ec] bg-white/90 p-2 text-[#1e4b7a] shadow-[0_10px_24px_rgba(30,75,122,0.12)] transition hover:text-[#fe6801] lg:flex"
              aria-label="Scroll services left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              className="absolute right-0 top-1/2 hidden translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#d9e2ec] bg-white/90 p-2 text-[#1e4b7a] shadow-[0_10px_24px_rgba(30,75,122,0.12)] transition hover:text-[#fe6801] lg:flex"
              aria-label="Scroll services right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div
              ref={scrollerRef}
              className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory sm:gap-5 lg:gap-6"
            >
            {serviceCards.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.id}
                  id={service.id}
                  className={`flex min-w-[260px] flex-none snap-start overflow-hidden rounded-[20px] border border-[#d9e2ec] bg-white shadow-[0_10px_30px_rgba(30,75,122,0.06)] sm:min-w-[320px] lg:min-w-[360px]`}
                >
                  <div className="flex h-full w-full flex-col">
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#1e4b7a]/32 to-transparent" />
                    </div>

                    <div className="flex h-full flex-col gap-6 p-5 sm:p-6 lg:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-[#edf2f7]">
                        <Icon className="h-5 w-5 text-[#fe6801]" />
                      </div>
                      <span
                        className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] ${service.tagClass}`}
                      >
                        {service.tag}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-[1.35rem] font-bold leading-[1.15] tracking-[-0.02em] text-[#1e4b7a] sm:text-[1.5rem]">
                        {service.title}
                      </h3>
                      <p className="mt-3 max-w-[34ch] text-[0.92rem] font-normal leading-7 text-slate-600">
                        {service.description}
                      </p>
                    </div>

                    <div className="mt-auto flex flex-wrap gap-2">
                      <span className="rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] px-3 py-1.5 text-[11px] font-semibold text-[#1e4b7a]">
                        Responsive Operations
                      </span>
                      <span className="rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] px-3 py-1.5 text-[11px] font-semibold text-[#1e4b7a]">
                        Live Visibility
                      </span>
                    </div>
                  </div>
                  </div>
                </article>
              );
            })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div>
              <div className="inline-flex items-center gap-2 rounded-[20px] bg-orange-50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#fe6801]">
                Visibility Engine
              </div>
              <h2 className={`${sectionTitleClass} mt-5 max-w-xl`}>One view across booking, movement, and delivery milestones.</h2>
              <p className="mt-5 max-w-xl text-[0.94rem] font-normal leading-7 text-slate-600 sm:text-[1rem]">
                Real-time shipment visibility with predictive ETA updates, route adjustments, and milestone alerts across your service network.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  {
                    label: "99.8% Forecast Accuracy",
                    desc: "Predictions shaped by global movement data, route history, and live scanning events.",
                  },
                  {
                    label: "Full Document Tracking",
                    desc: "Visibility from departure warehouse through customs verification and final delivery confirmation.",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100">
                      <Check className="h-3.5 w-3.5 text-[#fe6801]" />
                    </div>
                    <div>
                      <p className="text-[0.96rem] font-semibold text-[#1e4b7a]">{item.label}</p>
                      <p className="mt-1 text-[0.9rem] font-normal leading-6 text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="overflow-hidden rounded-[20px] border border-[#d9e2ec] bg-white shadow-[0_18px_50px_rgba(30,75,122,0.10)]">
                <div className="flex items-center justify-between bg-[#1e4b7a] px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-400" />
                    <div className="h-2 w-2 rounded-full bg-yellow-400" />
                    <div className="h-2 w-2 rounded-full bg-green-400" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-orange-300">Live Dashboard</span>
                  <div className="w-3" />
                </div>
                <div className="space-y-4 p-5 sm:p-6">
                  <div className="flex items-center gap-2 rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[11px] font-semibold text-slate-600 sm:text-[12px]">GN-94821 | In Transit | Live ETA Updating</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {["Air: 84", "Ocean: 58", "Docs: 24"].map((item) => (
                      <div key={item} className="rounded-[20px] border border-orange-100 bg-orange-50 p-4 text-center">
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1e4b7a]">{item}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {[
                      ["LHR to DEL", "Flight BA-214", "On Time"],
                      ["SOU to BOM", "Vessel Route", "Day 12"],
                      ["JFK to CCU", "Clearance Review", "Attention"],
                    ].map(([lane, mode, status], index) => (
                      <div
                        key={lane}
                        className="flex flex-col gap-2 rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="text-[12px] font-semibold text-[#1e4b7a]">{lane}</p>
                          <p className="text-[11px] text-slate-500">{mode}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`h-2 w-2 rounded-full ${index === 2 ? "bg-[#fe6801]" : "bg-green-500"}`} />
                          <span className="text-[11px] font-semibold text-slate-600">{status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 left-1/2 h-12 w-3/4 -translate-x-1/2 rounded-full bg-[#fe6801]/18 blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
          <div className="mb-12 text-center sm:mb-14">
            <h2 className={sectionTitleClass}>Global Coverage</h2>
            <p className={sectionCopyClass}>
              Regional expertise and trade-lane depth presented with the same clear structure customers already see on the home page.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-5 md:grid-cols-3 lg:gap-6">
            {coverageCards.map((card) => (
              <article key={card.region} className={lightCardClass}>
                <div className="overflow-hidden rounded-[16px]">
                  <img
                    src={card.image}
                    alt={card.imageAlt}
                    className="h-36 w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#1e4b7a]">{card.tag}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em] ${card.statusClass}`}>
                    {card.status}
                  </span>
                </div>
                <h3 className="mt-5 text-[1.2rem] font-bold leading-[1.2] tracking-[-0.02em] text-[#1e4b7a]">{card.region}</h3>
                <p className="mt-3 text-[0.92rem] font-normal leading-7 text-slate-600">{card.desc}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] px-3 py-1.5 text-[11px] font-semibold text-[#1e4b7a]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[20px] bg-[#1e4b7a] px-7 text-sm font-bold text-white transition-colors hover:bg-[#1a2f45]"
            >
              <Globe2 className="h-4 w-4" />
              Discuss Coverage Needs
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-16">
          <div className="mb-12 text-center">
            <h2 className={sectionTitleClass}>FAQ</h2>
            <p className={sectionCopyClass}>Answers to common logistics and shipping questions.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] p-5 shadow-[0_8px_24px_rgba(30,75,122,0.05)] transition-all hover:shadow-[0_12px_28px_rgba(30,75,122,0.08)] sm:p-6"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-[0.98rem] font-semibold text-[#1e4b7a]">
                  {faq.q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-4 border-t border-slate-200 pt-4 text-[0.92rem] font-normal leading-7 text-slate-600">{faq.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 rounded-[20px] bg-gradient-to-br from-[#1e4b7a] via-[#1e4b7a] to-[#1a2f45] p-6 text-center text-white shadow-[0_30px_70px_rgba(30,75,122,0.20)] sm:p-8">
            <h3 className="text-[1.45rem] font-bold tracking-[-0.02em] sm:text-[1.7rem]">Need a service recommendation?</h3>
            <p className="mx-auto mt-3 max-w-xl text-[0.94rem] font-normal leading-7 text-slate-100">
              Tell us your lane, shipment type, and urgency. We will guide you to the right service setup.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[20px] bg-[#fe6801] px-7 text-sm font-bold text-white transition-colors hover:bg-[#e65d00]"
              >
                Contact the Team
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
