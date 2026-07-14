import Link from "next/link";
import { Manrope } from "next/font/google";
import {
  Search,
  Plane,
  ArrowRight,
  Globe2,
  Truck,
  CheckCircle2,
  PackageCheck,
  Activity,
  BarChart3,
  Zap,
  ShieldCheck,
} from "lucide-react";

const homeFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function Home() {
  const sectionTitleClass =
    "text-balance text-[1.5rem] font-bold tracking-[-0.02em] text-[#1e4b7a] sm:text-[1.75rem] lg:text-[2rem]";
  const sectionCopyClass =
    "mx-auto mt-4 max-w-2xl text-[0.88rem] font-normal leading-7 text-slate-600 sm:text-[0.95rem]";
  const cardClass =
    "rounded-[20px] border border-[#d9e2ec] bg-white p-5 shadow-[0_10px_30px_rgba(30,75,122,0.06)] sm:p-6 lg:p-7";

  const stats = [
    { val: "2,500+", label: "Daily Shipments" },
    { val: "19k", label: "Pin Codes Covered" },
    { val: "99.9%", label: "On-Time Delivery" },
    { val: "24/7", label: "Global Live Support" },
  ];

  const steps = [
    {
      step: "01",
      label: "Booking",
      icon: PackageCheck,
      title: "Register & Book",
      desc: "Create your free account and book your shipment in under 2 minutes. No contracts required.",
    },
    {
      step: "02",
      label: "Collection",
      icon: Activity,
      title: "Collect & Verify",
      desc: "Our agents collect from your door, verifying cargo class and weight for absolute quote accuracy.",
    },
    {
      step: "03",
      label: "Tracking",
      icon: Globe2,
      title: "Track & Release",
      desc: "Monitor your parcel move across continents. Automated customs clearance handles the rest.",
    },
  ];

  const processFlow = [
    {
      step: "01",
      label: "Search",
      icon: Search,
      title: "Log on or enter your tracking ID",
      desc: "Customers can start from the home page, open tracking, and immediately search for the shipment they want to follow.",
    },
    {
      step: "02",
      label: "Book",
      icon: PackageCheck,
      title: "Create the shipment request",
      desc: "The booking flow stays short so users can add origin, destination, and package details without friction.",
    },
    {
      step: "03",
      label: "Pickup",
      icon: Truck,
      title: "Confirm the pickup arrangement",
      desc: "Once the request is in, our team confirms the collection point and validates cargo details before dispatch.",
    },
    {
      step: "04",
      label: "Waiting",
      icon: Activity,
      title: "Waiting means the shipment is not dispatched yet",
      desc: "If a shipment shows waiting, the order is registered and being prepared for the next movement stage.",
    },
    {
      step: "05",
      label: "Transit",
      icon: Globe2,
      title: "In transit means it has left the origin point",
      desc: "Customers can follow live progress as the shipment moves through the logistics network.",
    },
    {
      step: "06",
      label: "Complete",
      icon: CheckCircle2,
      title: "Delivered means the journey is complete",
      desc: "The final status confirms the shipment has reached the destination and the process is closed.",
    },
  ];

  const processNotes = [
    {
      label: "Minimum Booking",
      body: "Please share complete shipment details before dispatch so the status flow stays accurate.",
    },
    {
      label: "No Merging",
      body: "Each booking is processed exactly as received. Shipments are not consolidated into a single status entry.",
    },
    {
      label: "Billing",
      body: "Every package is reviewed against the confirmed weight and service lane before final billing is prepared.",
    },
    {
      label: "Weight Billing",
      body: "Weight is rounded to the nearest billing slab before the order is finalized.",
    },
    {
      label: "B2C Support",
      body: "For personal shipments, use the contact page for help with tracking, pickup, or delivery questions.",
    },
    {
      label: "B2B Rates",
      body: "For business accounts and monthly movement plans, speak with our operations team for route-based pricing.",
    },
  ];

  return (
    <div className={`${homeFont.className} flex min-h-screen flex-col bg-[#f6f8fc] text-[#1e4b7a]`}>
      <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden pt-20 pb-20 sm:pb-24 md:min-h-[92vh] md:pt-24 md:pb-28">
        <div className="absolute inset-0 -z-20">
          <img
            src="/hero-bg.png"
            alt="Global high-tech logistics network"
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#1e4b7a]/88 via-[#1e4b7a]/72 to-[#1e4b7a]/35" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-[#f6f8fc]" />
        <div className="absolute -left-16 top-24 -z-10 h-56 w-56 rounded-full bg-[#fe6801]/18 blur-3xl" />
        <div className="absolute -right-16 bottom-10 -z-10 h-64 w-64 rounded-full bg-[#1e4b7a]/35 blur-3xl" />

        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 xl:gap-16">
            <div className="max-w-3xl text-center lg:text-left">
              <div className="animate-fade-up mb-6 inline-flex items-center gap-2 rounded-[20px] border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#ffd6bd] backdrop-blur-xl sm:mb-8 md:px-5 md:text-[11px] md:tracking-[0.18em]">
              <Zap className="h-3.5 w-3.5 fill-[#fe6801] text-[#fe6801]" />
              Next-Gen Global Logistics
              </div>

              <h1 className="animate-fade-up-delay-1 text-balance text-[2.15rem] font-bold leading-[1.04] tracking-[-0.03em] text-white drop-shadow-[0_12px_30px_rgba(3,20,43,0.45)] sm:text-[2.9rem] lg:text-[3.8rem] xl:text-[4.65rem]">
                <span className="text-white">Worldwide Delivery</span>
                <br />
                <span className="animate-shimmer bg-gradient-to-r from-[#fe6801] via-[#ff8a39] to-[#ffd8bf] bg-clip-text text-transparent">
                  Experts.
                </span>
              </h1>

              <p className="animate-fade-up-delay-2 mx-auto mt-5 max-w-3xl px-1 text-[0.9rem] font-normal leading-7 text-slate-100 sm:px-2 md:mt-7 md:px-0 md:text-[0.98rem] md:leading-8 lg:mx-0 lg:text-[1.02rem]">
                The intelligence layer for international shipping. High-speed air cargo, ocean freight coordination, and complete
                transparency from pickup to delivery.
              </p>

              <form
                action={async (formData) => {
                  "use server";
                  const id = formData.get("id");
                  if (id) {
                    const { redirect } = await import("next/navigation");
                    redirect(`/tracking?id=${id}`);
                  }
                }}
                className="animate-fade-up-delay-2 mx-auto mt-10 grid w-full max-w-3xl grid-cols-[1fr_auto] items-center gap-3 rounded-[20px] border border-white/35 bg-white/18 p-3 backdrop-blur-2xl shadow-[0_25px_70px_rgba(5,28,55,0.45)] sm:mt-12 sm:flex sm:items-center lg:mx-0"
              >
                <div className="flex h-14 w-full items-center rounded-[20px] bg-white px-4 shadow-lg sm:h-16 sm:flex-1 sm:px-5">
                  <Search className="mr-3 h-5 w-5 text-slate-400 sm:mr-4 sm:h-6 sm:w-6" />
                  <input
                    name="id"
                    type="text"
                    placeholder="Enter tracking ID or AWB..."
                    className="h-full w-full bg-transparent text-sm font-semibold text-[#1e4b7a] outline-none placeholder:text-slate-400 sm:text-base md:text-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="flex h-12 items-center justify-center whitespace-nowrap rounded-[18px] bg-[#fe6801] px-4 text-[11px] font-black tracking-wide text-white shadow-xl transition-all hover:-translate-y-0.5 hover:bg-[#e65d00] sm:h-16 sm:px-10 sm:text-sm"
                >
                  Track Journey
                </button>
              </form>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-[11px] font-semibold text-slate-100 sm:mt-10 sm:gap-5 sm:text-xs lg:justify-start">
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#fe6801]" />
                  Secure Tracking
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#fe6801]" />
                  Real-Time Visibility
                </span>
                <span className="inline-flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[#fe6801]" />
                  19,000+ Pin Codes
                </span>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 text-left sm:max-w-md lg:mt-10">
                <div className="rounded-[20px] border border-white/15 bg-white/10 px-4 py-4 backdrop-blur-xl">
                  <p className="text-[1.12rem] font-bold tracking-[-0.02em] text-white">Air + Ocean</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-orange-200">Integrated Lanes</p>
                </div>
                <div className="rounded-[20px] border border-white/15 bg-[#fe6801]/16 px-4 py-4 backdrop-blur-xl">
                  <p className="text-[1.12rem] font-bold tracking-[-0.02em] text-white">Customs</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-orange-100">Digital Clearance</p>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative mx-auto h-[440px] max-w-[410px]">
                <div className="absolute left-0 top-6 w-[58%] overflow-hidden rounded-[28px] border border-white/15 bg-white/10 p-2 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                  <img
                    src="https://images.unsplash.com/photo-1494412651409-8963ce7935a7?q=80&w=900&auto=format&fit=crop"
                    alt="Cargo airplane on runway"
                    className="h-[240px] w-full rounded-[22px] object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute right-0 top-20 w-[60%] overflow-hidden rounded-[28px] border border-white/15 bg-white/10 p-2 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                  <img
                    src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=900&auto=format&fit=crop"
                    alt="Cargo ship at port"
                    className="h-[200px] w-full rounded-[22px] object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute bottom-10 left-[16%] w-[68%] overflow-hidden rounded-[28px] border border-white/15 bg-white/10 p-2 shadow-[0_24px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                  <img
                    src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?q=80&w=900&auto=format&fit=crop"
                    alt="Logistics containers and operations"
                    className="h-[165px] w-full rounded-[22px] object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="absolute right-2 top-4 rounded-[20px] border border-white/15 bg-[#1e4b7a]/82 px-4 py-3 text-white shadow-[0_20px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-200">Brand Lane</p>
                  <p className="mt-1 text-[1.15rem] font-bold tracking-[-0.02em]">Air. Ocean. Ground.</p>
                </div>
                <div className="absolute bottom-0 left-2 rounded-[20px] border border-white/15 bg-[#fe6801] px-4 py-3 text-white shadow-[0_20px_50px_rgba(254,104,1,0.26)]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-50">Live Operations</p>
                  <p className="mt-1 text-[1.1rem] font-bold tracking-[-0.02em]">Connected Logistics View</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-8 pb-12 md:-mt-10 md:pb-14">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-16">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5 md:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="animate-fade-up rounded-[20px] border border-[#d9e2ec] bg-white px-4 py-4 shadow-[0_10px_24px_rgba(30,75,122,0.08)] sm:px-5 sm:py-5"
              >
                <p className="text-[1.45rem] font-bold leading-none tracking-[-0.02em] text-[#1e4b7a] sm:text-[1.65rem]">{s.val}</p>
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f6f8fc] py-16 sm:py-18 md:py-22 lg:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-16">
          <div className="mb-14 text-center md:mb-16">
            <h2 className={sectionTitleClass}>
              <span className="text-[#1e4b7a]">Simple Journeys.</span>{" "}
              <span className="text-[#fe6801]">Extraordinary Logic.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[0.88rem] font-normal leading-7 text-slate-600 sm:text-[0.95rem]">
              We removed complexity from global shipping. One platform, total control.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-5 lg:gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.step}
                className={`${cardClass} group animate-fade-up relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(30,75,122,0.12)]`}
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-[20px] bg-[#edf2f7] transition-transform group-hover:scale-105">
                  <s.icon className="h-6 w-6 text-[#1e4b7a]" />
                </div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#fe6801]">
                  <s.icon className="h-3.5 w-3.5" />
                  <span>{s.step} {s.label}</span>
                </div>
                <h3 className="mb-3 min-h-[1.4rem] text-[1.12rem] font-bold leading-[1.25] tracking-[-0.02em] text-[#1e4b7a]">{s.title}</h3>
                <p className="text-[0.88rem] font-normal leading-7 text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-16">
          <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
            <div>
              <h2 className={sectionTitleClass}>
                <span className="text-[#1e4b7a]">Across every mode,</span>{" "}
                <span className="text-[#fe6801]">with one connected view.</span>
              </h2>
              <p className="mt-5 max-w-xl text-[0.9rem] leading-7 text-slate-600 sm:text-[0.96rem]">
                Air freight, ocean coordination, customs handling, and last-mile execution should feel like one journey, not disconnected systems.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  "Air cargo planning with faster high-priority handling",
                  "Ocean movement structured around dependable lane visibility",
                  "Warehouse and delivery coordination linked to live updates",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100">
                      <CheckCircle2 className="h-3 w-3 text-[#fe6801]" />
                    </div>
                    <p className="text-[0.88rem] leading-7 text-slate-600 sm:text-[0.94rem]">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto h-[360px] w-full max-w-[620px] sm:h-[430px]">
              <div className="absolute left-0 top-0 w-[56%] overflow-hidden rounded-[24px] border border-[#d9e2ec] bg-white p-2 shadow-[0_18px_46px_rgba(30,75,122,0.12)]">
                <img
                  src="https://images.unsplash.com/photo-1569154941061-e231b4725ef1?q=80&w=900&auto=format&fit=crop"
                  alt="Air freight aircraft"
                  className="h-[180px] w-full rounded-[18px] object-cover sm:h-[220px]"
                  loading="lazy"
                />
              </div>
              <div className="absolute right-0 top-14 w-[54%] overflow-hidden rounded-[24px] border border-[#d9e2ec] bg-white p-2 shadow-[0_18px_46px_rgba(30,75,122,0.12)]">
                <img
                  src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?q=80&w=900&auto=format&fit=crop"
                  alt="Ocean freight shipping port"
                  className="h-[170px] w-full rounded-[18px] object-cover sm:h-[210px]"
                  loading="lazy"
                />
              </div>
              <div className="absolute bottom-0 left-[14%] w-[60%] overflow-hidden rounded-[24px] border border-[#d9e2ec] bg-white p-2 shadow-[0_18px_46px_rgba(30,75,122,0.12)]">
                <img
                  src="https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=900&auto=format&fit=crop"
                  alt="Warehouse and freight operations"
                  className="h-[160px] w-full rounded-[18px] object-cover sm:h-[200px]"
                  loading="lazy"
                />
              </div>
              <div className="absolute left-4 top-4 rounded-[20px] bg-[#1e4b7a] px-4 py-3 text-white shadow-[0_18px_40px_rgba(30,75,122,0.16)]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-200">Brand Mode</p>
                <p className="mt-1 text-[1rem] font-bold tracking-[-0.02em]">Air, Ocean, Delivery</p>
              </div>
              <div className="absolute bottom-4 right-4 rounded-[20px] bg-[#fe6801] px-4 py-3 text-white shadow-[0_18px_40px_rgba(254,104,1,0.2)]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-orange-50">Live Visibility</p>
                <p className="mt-1 text-[1rem] font-bold tracking-[-0.02em]">One Connected Flow</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-18 md:py-22 lg:py-24">
        <div className="container mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-16">
          <h2 className={sectionTitleClass}>
            <span className="text-[#1e4b7a]">Intelligence in Every</span>{" "}
            <span className="text-[#fe6801]">Corridor.</span>
          </h2>
          <p className={sectionCopyClass}>
            Every shipment path is optimized for speed, predictability, and compliant delivery.
          </p>

          <div className="mt-12 grid gap-4 text-left sm:mt-14 sm:gap-5 lg:gap-6 md:grid-cols-3">
            <div className="animate-fade-up group relative overflow-hidden rounded-[20px] border border-[#d9e2ec] bg-white text-left shadow-[0_10px_30px_rgba(30,75,122,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(30,75,122,0.12)]">
              <div className="relative h-40 overflow-hidden sm:h-44">
                <img src="https://images.unsplash.com/photo-1529074963764-98f45c47344b?q=80&w=900&auto=format&fit=crop" alt="Air cargo operations" className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1e4b7a]/78 to-[#1e4b7a]/45" />
              </div>
              <div className="flex flex-col gap-8 p-5 sm:p-6 lg:p-7">
                <div>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[20px] bg-[#edf2f7]">
                    <Plane className="h-6 w-6 text-[#fe6801]" />
                  </div>
                  <h3 className="mb-4 min-h-[4rem] text-[1.35rem] font-bold leading-[1.15] tracking-[-0.02em] text-[#1e4b7a] sm:text-[1.5rem] lg:text-[1.65rem]">
                    Priority
                    <br />
                    Air Cargo
                  </h3>
                  <p className="max-w-[32ch] text-[0.88rem] font-normal leading-7 text-slate-600">
                    Fastest path for high-value electronics, personal essentials, and time-critical deliveries.
                  </p>
                </div>
                <Link
                  href="/services"
                  className="inline-flex w-max items-center justify-center rounded-[20px] bg-[#fe6801] px-6 py-3 text-sm font-black text-white transition-colors hover:bg-[#e65d00]"
                >
                  Check Air Rates
                </Link>
              </div>
            </div>

            <div className="group animate-fade-up relative overflow-hidden rounded-[20px] border border-[#d9e2ec] bg-white text-left shadow-[0_10px_30px_rgba(30,75,122,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(30,75,122,0.12)]">
              <div className="relative h-40 overflow-hidden sm:h-44">
                <img src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=900&auto=format&fit=crop" alt="Last-mile delivery vehicles" className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1e4b7a]/60 to-transparent" />
              </div>
              <div className="flex flex-col gap-8 p-5 sm:p-6 lg:p-7">
                <div>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[20px] bg-[#edf2f7]">
                    <Truck className="h-6 w-6 text-[#1e4b7a]" />
                  </div>
                  <h3 className="mb-4 min-h-[4rem] text-[1.35rem] font-bold leading-[1.15] tracking-[-0.02em] text-[#1e4b7a] sm:text-[1.5rem] lg:text-[1.65rem]">
                    Last-Mile
                    <br />
                    Network
                  </h3>
                  <p className="mb-6 max-w-[32ch] text-[0.88rem] font-normal leading-7 text-slate-600">
                    Delivery reaching 19,000+ pin codes. From Bengaluru tech hubs to Mumbai financial center.
                  </p>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#fe6801]" />
                    <span className="text-[0.78rem] font-semibold tracking-[0.02em] text-[#1e4b7a]">Digital Proof of Delivery</span>
                  </div>
                </div>
                <Link
                  href="/services"
                  className="inline-flex w-max items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#1e4b7a] transition-transform group-hover:translate-x-1"
                >
                  Manage Network <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="animate-fade-up group relative overflow-hidden rounded-[20px] border border-[#d9e2ec] bg-white text-left shadow-[0_10px_30px_rgba(30,75,122,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(30,75,122,0.12)]">
              <div className="relative h-40 overflow-hidden bg-slate-100 sm:h-44">
                <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=900&auto=format&fit=crop" alt="Customs compliance workflow" className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1e4b7a]/12 to-[#fe6801]/12" />
              </div>
              <div className="flex flex-col gap-8 p-5 sm:p-6 lg:p-7">
                <div>
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[20px] bg-orange-50">
                    <BarChart3 className="h-6 w-6 text-[#1e4b7a]" />
                  </div>
                  <h3 className="mb-4 min-h-[4rem] text-[1.35rem] font-bold leading-[1.15] tracking-[-0.02em] text-[#1e4b7a] sm:text-[1.5rem] lg:text-[1.65rem]">
                    Customs
                    <br />
                    Intelligence
                  </h3>
                  <p className="max-w-[32ch] text-[0.88rem] font-normal leading-7 text-slate-600">
                    Automated duty calculations and digital pre-clearance to minimize landing delays.
                  </p>
                </div>
                <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
                  <p className="mb-2 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Platform Health</p>
                  <div className="flex justify-center gap-1">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="h-6 w-1.5 animate-pulse rounded-full bg-orange-400"
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f8fc] py-16 sm:py-18 md:py-22 lg:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-16">
          <div className="rounded-[30px] border border-[#d9e2ec] bg-white p-5 shadow-[0_24px_60px_rgba(30,75,122,0.08)] sm:p-7 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-12">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-[20px] border border-[#d9e2ec] bg-[#f8fbff] px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#1e4b7a]">
                  <PackageCheck className="h-3.5 w-3.5 text-[#fe6801]" />
                  Order Status Process
                </div>
                <h2 className="text-balance text-[1.45rem] font-bold tracking-[-0.03em] text-[#1e4b7a] sm:text-[1.75rem] lg:text-[2rem]">
                  To check the status of your shipment, follow these steps:
                </h2>

                <ol className="mt-8 space-y-4">
                  {processFlow.map((item) => (
                    <li
                      key={item.step}
                      className="relative rounded-[24px] border border-[#e6edf5] bg-[#fbfdff] p-5 pl-16 shadow-[0_8px_22px_rgba(30,75,122,0.04)] sm:pl-18"
                    >
                      <span className="absolute left-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-[#1e4b7a] text-[0.8rem] font-extrabold text-white shadow-[0_8px_18px_rgba(30,75,122,0.18)]">
                        {item.step}
                      </span>
                      <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-orange-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#fe6801]">
                        <item.icon className="h-3.5 w-3.5" />
                        <span>{item.label}</span>
                      </div>
                      <h3 className="text-[1rem] font-bold leading-[1.35] tracking-[-0.02em] text-[#1e4b7a] sm:text-[1.05rem]">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-[0.88rem] leading-7 text-slate-600 sm:text-[0.95rem]">{item.desc}</p>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h3 className="text-[1.4rem] font-bold tracking-[-0.03em] text-[#1e4b7a] sm:text-[1.65rem]">
                  Additional Notes & Pricing
                </h3>

                <div className="mt-6 space-y-4">
                  {processNotes.map((note) => (
                    <div key={note.label} className="rounded-[22px] border border-[#e6edf5] bg-[#fbfdff] p-4 sm:p-5">
                      <p className="text-[0.78rem] font-extrabold uppercase tracking-[0.2em] text-[#fe6801]">{note.label}</p>
                      <p className="mt-2 text-[0.88rem] leading-7 text-slate-600 sm:text-[0.94rem]">{note.body}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 rounded-[24px] bg-[#1e4b7a] px-5 py-5 text-white shadow-[0_18px_40px_rgba(30,75,122,0.18)]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-200">Support</p>
                  <p className="mt-2 text-[0.92rem] leading-7 text-slate-100">
                    For live shipment help, use the tracking page or contact page to get status guidance from the team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f8fc] py-16 sm:py-18 md:py-22 lg:py-24">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-16">
          <div className="animate-soft-float relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#1e4b7a] via-[#1e4b7a] to-[#1a2f45] p-6 text-center text-white shadow-[0_30px_70px_rgba(30,75,122,0.28)] sm:p-8 md:p-12 lg:p-16">
            <div className="absolute -top-20 -left-16 h-72 w-72 rounded-full bg-[#fe6801]/25 blur-[90px]" />
            <div className="absolute -bottom-20 -right-16 h-72 w-72 rounded-full bg-orange-300/15 blur-[90px]" />

            <div className="relative z-10">
              <h2 className="text-balance text-[1.65rem] font-bold tracking-[-0.02em] sm:text-[1.9rem] lg:text-[2.35rem]">
                <span className="text-white">Ready to Ship</span>{" "}
                <span className="text-[#fe6801]">International?</span>
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[0.9rem] font-normal leading-7 text-orange-100/90 md:mt-6 md:text-[0.98rem] md:leading-8">
                Join 10,000+ individuals and brands using our intelligence engine for seamless international movement.
              </p>
              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="rounded-[20px] bg-[#fe6801] px-8 py-4 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:bg-[#e65d00]"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/services"
                  className="rounded-[20px] border border-white/30 bg-white/10 px-8 py-4 text-sm font-black text-white transition-all hover:bg-white/20"
                >
                  Explore Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
