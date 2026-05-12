import Link from "next/link";
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

export default function Home() {
  const stats = [
    { val: "2,500+", label: "Daily Shipments" },
    { val: "19k", label: "Pin Codes Covered" },
    { val: "99.9%", label: "On-Time Delivery" },
    { val: "24/7", label: "Global Live Support" },
  ];

  const steps = [
    {
      step: "01",
      icon: PackageCheck,
      title: "Register & Book",
      desc: "Create your free account and book your shipment in under 2 minutes. No contracts required.",
    },
    {
      step: "02",
      icon: Activity,
      title: "Collect & Verify",
      desc: "Our agents collect from your door, verifying cargo class and weight for absolute quote accuracy.",
    },
    {
      step: "03",
      icon: Globe2,
      title: "Track & Release",
      desc: "Monitor your parcel move across continents. Automated customs clearance handles the rest.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#f6f8fc] font-sans text-slate-900">
      <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden pt-20 pb-24 md:min-h-[92vh] md:pt-24 md:pb-28">
        <div className="absolute inset-0 -z-20">
          <img
            src="/hero-bg.png"
            alt="Global high-tech logistics network"
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0e3157]/80 via-[#1e4b7a]/70 to-[#1e4b7a]/25" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-b from-transparent to-[#f6f8fc]" />

        <div className="container relative mx-auto px-6 lg:px-12">
          <div className="mx-auto max-w-4xl text-center">
            <div className="animate-fade-up mb-8 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-orange-200 backdrop-blur-xl md:px-5 md:text-[11px] md:tracking-[0.18em]">
              <Zap className="h-3.5 w-3.5 fill-orange-300 text-orange-300" />
              Next-Gen Global Logistics
            </div>

            <h1 className="animate-fade-up-delay-1 text-balance text-4xl font-black leading-[1.05] tracking-tight text-white drop-shadow-[0_12px_30px_rgba(3,20,43,0.45)] md:text-7xl [font-family:var(--font-display,var(--font-sans))]">
              Global Movement
              <br />
              <span className="animate-shimmer bg-gradient-to-r from-[#fe6801] to-[#ffd8bf] bg-clip-text text-transparent">
                Perfected.
              </span>
            </h1>

            <p className="animate-fade-up-delay-2 mx-auto mt-6 max-w-3xl text-pretty px-2 text-base font-medium leading-relaxed text-blue-50/95 md:mt-8 md:px-0 md:text-xl">
              The intelligence layer for international shipping. High-speed air cargo, precision ground networks, and complete
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
              className="animate-fade-up-delay-2 mx-auto mt-10 flex w-full max-w-3xl flex-col gap-2 rounded-[24px] border border-white/40 bg-white/20 p-2 backdrop-blur-2xl shadow-[0_25px_70px_rgba(5,28,55,0.45)] sm:mt-12 sm:flex-row sm:rounded-[30px]"
            >
              <div className="flex h-14 w-full flex-1 items-center rounded-2xl bg-white px-5 shadow-lg sm:h-16">
                <Search className="mr-4 h-6 w-6 text-slate-400" />
                <input
                  name="id"
                  type="text"
                  placeholder="Enter tracking ID or AWB..."
                  className="h-full w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400 sm:text-base md:text-lg"
                />
              </div>
              <button
                type="submit"
                className="flex h-14 items-center justify-center whitespace-nowrap rounded-2xl bg-[#1e4b7a] px-8 text-xs font-black tracking-wide text-white shadow-xl transition-all hover:-translate-y-0.5 hover:bg-[#173e67] sm:h-16 sm:px-10 sm:text-sm"
              >
                Track Journey
              </button>
            </form>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-[11px] font-semibold text-blue-50/90 sm:mt-10 sm:gap-5 sm:text-xs">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-orange-300" />
                Secure Tracking
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-orange-300" />
                Real-Time Visibility
              </span>
              <span className="inline-flex items-center gap-2">
                <Truck className="h-4 w-4 text-orange-300" />
                19,000+ Pin Codes
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-8 z-10 pb-12 md:-mt-10 md:pb-14">
        <div className="container mx-auto px-6 lg:px-16 max-w-7xl">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="animate-fade-up rounded-2xl border border-[#d8e2ef] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(21,53,89,0.08)] sm:px-5 sm:py-5"
              >
                <p className="text-2xl font-black tracking-tight text-[#1e4b7a] sm:text-3xl">{s.val}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f6f8fc] py-20 md:py-24">
        <div className="container mx-auto px-6 lg:px-16 max-w-7xl">
          <div className="mb-14 text-center md:mb-16">
            <h2 className="text-balance text-3xl font-black tracking-tight text-[#1e4b7a] md:text-4xl [font-family:var(--font-display,var(--font-sans))]">Simple Journeys. Extraordinary Logic.</h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] font-medium text-slate-500">
              We removed complexity from global shipping. One platform, total control.
            </p>
          </div>

          <div className="grid gap-7 md:grid-cols-3">
            {steps.map((s) => (
              <div
                key={s.step}
                className="group animate-fade-up relative overflow-hidden rounded-[24px] border border-[#dbe5f0] bg-white p-7 shadow-[0_6px_20px_rgba(12,37,64,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_50px_rgba(15,45,76,0.14)] md:rounded-[28px] md:p-9"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#1e4b7a] via-[#1e4b7a] to-[#fe6801]" />
                <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef4fb] transition-transform group-hover:scale-110">
                  <s.icon className="h-6 w-6 text-[#1e4b7a]" />
                </div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-orange-600">{s.step} Experience</p>
                <h3 className="mb-3 text-2xl font-black text-[#1e4b7a]">{s.title}</h3>
                <p className="text-sm font-medium leading-relaxed text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-24">
        <div className="container mx-auto px-6 lg:px-16 max-w-7xl text-center">
          <h2 className="text-[30px] font-black tracking-tight text-[#1e4b7a] md:text-[34px] [font-family:var(--font-display,var(--font-sans))]">Intelligence in Every Corridor.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm font-medium text-slate-500">
            Every shipment path is optimized for speed, predictability, and compliant delivery.
          </p>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <div className="animate-fade-up relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-[30px] bg-[#1e4b7a] p-7 text-left text-white shadow-2xl md:h-[450px] md:rounded-[36px] md:p-10">
              <div className="absolute -top-16 -right-8 h-52 w-52 rounded-full bg-orange-400/20 blur-3xl" />
              <div>
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <Plane className="h-6 w-6 text-[#fe6801]" />
                </div>
                <h3 className="mb-4 text-3xl font-black leading-[1.05] md:text-4xl [font-family:var(--font-display,var(--font-sans))]">
                  Priority
                  <br />
                  Air Cargo
                </h3>
                <p className="text-sm font-medium leading-relaxed text-orange-100">
                  Fastest path for high-value electronics, personal essentials, and time-critical deliveries.
                </p>
              </div>
              <Link
                href="/services"
                className="w-max rounded-xl bg-[#fe6801] px-7 py-3 text-sm font-black text-[#1e4b7a] transition-colors hover:bg-orange-300"
              >
                Check Air Rates
              </Link>
            </div>

            <div className="group animate-fade-up relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-[30px] border border-[#dbe5f0] bg-white p-7 text-left shadow-sm transition-all hover:shadow-xl md:h-[450px] md:rounded-[36px] md:p-10">
              <div>
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef4fb]">
                  <Truck className="h-6 w-6 text-[#1e4b7a]" />
                </div>
                <h3 className="mb-4 text-3xl font-black leading-[1.05] text-[#1e4b7a] md:text-4xl [font-family:var(--font-display,var(--font-sans))]">
                  Last-Mile
                  <br />
                  Network
                </h3>
                <p className="mb-6 text-sm font-medium leading-relaxed text-slate-500">
                  Delivery reaching 19,000+ pin codes. From Bengaluru tech hubs to Mumbai financial center.
                </p>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-orange-500" />
                  <span className="text-xs font-bold text-slate-700">Digital Proof of Delivery</span>
                </div>
              </div>
              <Link
                href="/services"
                className="inline-flex w-max items-center gap-2 text-[12px] font-black uppercase tracking-[0.18em] text-[#1e4b7a] transition-transform group-hover:translate-x-1"
              >
                Manage Network <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="animate-fade-up relative flex min-h-[360px] flex-col justify-between overflow-hidden rounded-[30px] border border-[#dbe5f0] bg-white p-7 text-left shadow-sm md:h-[450px] md:rounded-[36px] md:p-10">
              <div>
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50">
                  <BarChart3 className="h-6 w-6 text-[#1e4b7a]" />
                </div>
                <h3 className="mb-4 text-3xl font-black leading-[1.05] text-[#1e4b7a] md:text-4xl [font-family:var(--font-display,var(--font-sans))]">
                  Customs
                  <br />
                  Intelligence
                </h3>
                <p className="text-sm font-medium leading-relaxed text-slate-500">
                  Automated duty calculations and digital pre-clearance to minimize landing delays.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
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
      </section>

      <section className="bg-[#f6f8fc] py-20 md:py-24">
        <div className="container mx-auto max-w-5xl px-6 lg:px-16">
          <div className="animate-soft-float relative overflow-hidden rounded-[30px] bg-gradient-to-br from-[#1e4b7a] via-[#1e4b7a] to-[#173e67] p-10 text-center text-white shadow-[0_30px_70px_rgba(16,44,79,0.28)] md:rounded-[44px] md:p-16">
            <div className="absolute -top-20 -left-16 h-72 w-72 rounded-full bg-orange-500/25 blur-[90px]" />
            <div className="absolute -bottom-20 -right-16 h-72 w-72 rounded-full bg-orange-300/15 blur-[90px]" />

            <div className="relative z-10">
              <h2 className="text-balance text-3xl font-black tracking-tight md:text-5xl [font-family:var(--font-display,var(--font-sans))]">Ready to Ship Globally?</h2>
              <p className="mx-auto mt-5 max-w-xl text-base font-medium leading-relaxed text-orange-100/90 md:mt-6 md:text-lg">
                Join 10,000+ individuals and brands using our intelligence engine for seamless international movement.
              </p>
              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  href="/register"
                  className="rounded-2xl bg-[#fe6801] px-10 py-4 text-sm font-black text-[#1e4b7a] transition-all hover:-translate-y-0.5 hover:bg-orange-300"
                >
                  Create Free Account
                </Link>
                <Link
                  href="/services"
                  className="rounded-2xl border border-white/30 bg-white/10 px-10 py-4 text-sm font-black text-white transition-all hover:bg-white/20"
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
