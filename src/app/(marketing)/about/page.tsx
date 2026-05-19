import Link from "next/link";
import { Manrope } from "next/font/google";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Globe2,
  ShieldCheck,
  Sparkles,
  Users,
  Warehouse,
  Zap,
} from "lucide-react";

const homeFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const sectionTitleClass =
  "text-balance text-[1.6rem] font-bold tracking-[-0.02em] text-[#1e4b7a] sm:text-[1.85rem] lg:text-[2.15rem]";
const sectionCopyClass =
  "mx-auto mt-4 max-w-2xl text-[0.88rem] font-normal leading-7 text-slate-600 sm:text-[0.95rem]";
const cardClass =
  "rounded-[20px] border border-[#d9e2ec] bg-white p-5 shadow-[0_10px_30px_rgba(30,75,122,0.06)] sm:p-6 lg:p-7";

const stats = [
  { value: "20+", label: "Countries Delivered To" },
  { value: "15k+", label: "Daily Shipments" },
  { value: "99.8%", label: "On-Time Air Freq." },
  { value: "24/7", label: "Live Intelligence" },
];

const principles = [
  {
    icon: ShieldCheck,
    eyebrow: "Reliability First",
    title: "Mission-critical reliability across global trade.",
    copy: "In the world of global trade, uncertainty is the enemy. We solve this through mission-critical processes and enterprise-tier multi-region systems that also guarantee commanding reliability.",
  },
  {
    icon: Warehouse,
    eyebrow: "Warehouse Intelligence",
    title: "Better decisions built from useful data.",
    copy: "Data is only valuable if, through our intelligence system, it has enabled you to make better decisions for tomorrow.",
  },
  {
    icon: Sparkles,
    eyebrow: "Transparency",
    title: "No shipment disappears from view.",
    copy: "At no point does a shipment disappear. Every client gets a real milestone map from staging centers across the world.",
  },
  {
    icon: Users,
    eyebrow: "Customer First",
    title: "Success measured through customer growth.",
    copy: "Our promise is built by engineers, and proved by partners. We measure our success through the growth of the businesses we transport.",
  },
];

const leadership = [
  {
    name: "Aisha Khan",
    role: "Director, Global Operations",
    copy: "Leads cross-border routing, carrier performance, and service execution between North America, Europe, and India.",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Rahul Mehta",
    role: "Head of Customs Strategy",
    copy: "Oversees brokerage readiness, clearance workflows, and documentation quality for regulated commercial cargo.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=900&auto=format&fit=crop",
  },
  {
    name: "Emily Carter",
    role: "Customer Experience Lead",
    copy: "Builds the support model that keeps high-value shipments visible, understandable, and calmly managed in transit.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=900&auto=format&fit=crop",
  },
];

const standards = [
  "Commercial invoice validation",
  "Dangerous goods route review",
  "Broker-assisted customs release",
  "Lane-level escalation management",
];

export default function AboutPage() {
  return (
    <div className={`${homeFont.className} min-h-screen bg-[#f6f8fc] text-[#1e4b7a]`}>
      <section className="relative isolate overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-32">
        <div className="absolute inset-0 -z-20">
          <img
            src="https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=2000&auto=format&fit=crop"
            alt="Global logistics aircraft in motion"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1e4b7a]/94 via-[#1e4b7a]/86 to-[#1e4b7a]/45" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-[#f6f8fc]" />

        <div className="container relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-[20px] border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#ffd6bd] backdrop-blur-xl">
                <Zap className="h-3.5 w-3.5 fill-[#fe6801] text-[#fe6801]" />
                Global Trade Intelligence
              </div>
              <h1 className="text-balance text-[2.25rem] font-bold leading-[1.03] tracking-[-0.03em] text-white sm:text-[3.05rem] lg:text-[4.15rem]">
                <span className="text-white">Intelligence in</span>
                <br />
                <span className="text-[#fe6801]">Every Mile.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-[0.94rem] font-normal leading-7 text-slate-100 md:text-[1.02rem] md:leading-8">
                We are ship2sell - the definitive intelligence layer for international logistics into India. Brilliantly combining regulatory landscapes with precision technology and human expertise.
              </p>
              <p className="mt-4 max-w-2xl text-[0.86rem] font-medium leading-7 text-slate-200 md:text-[0.92rem]">
                Directly registered across the 20 zones of linkage through unified daily intelligence.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/services"
                  className="inline-flex h-12 items-center justify-center rounded-[20px] bg-[#fe6801] px-7 text-sm font-bold text-white transition-colors hover:bg-[#e65d00]"
                >
                  Explore Services
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center rounded-[20px] border border-white/25 bg-white/10 px-7 text-sm font-semibold text-white transition-colors hover:bg-white/15"
                >
                  Talk to Our Team
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { value: "Air + Ocean", label: "Integrated Mode Planning" },
                { value: "Broker Ready", label: "Customs-Led Documentation" },
                { value: "Priority", label: "High-Value Shipment Handling" },
                { value: "Visible", label: "Real-Time Milestone Updates" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[20px] border border-white/15 bg-white/10 px-5 py-5 text-white shadow-[0_10px_24px_rgba(30,75,122,0.18)] backdrop-blur-xl"
                >
                  <p className="text-[1.28rem] font-bold leading-none tracking-[-0.02em] sm:text-[1.5rem]">{item.value}</p>
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-200">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 -mt-8 pb-10 sm:-mt-10 sm:pb-14">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.label}
                className="rounded-[20px] border border-[#d9e2ec] bg-white px-5 py-5 shadow-[0_10px_24px_rgba(30,75,122,0.08)]"
              >
                <p className="text-[1.55rem] font-bold leading-none tracking-[-0.02em] text-[#1e4b7a] sm:text-[1.8rem]">
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
          <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
            <div className="relative overflow-hidden rounded-[28px] border border-[#d9e2ec] bg-white p-3 shadow-[0_18px_42px_rgba(30,75,122,0.10)]">
              <img
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=1400&auto=format&fit=crop"
                alt="Warehouse and cargo operations team"
                className="h-[360px] w-full rounded-[22px] object-cover sm:h-[420px]"
                loading="lazy"
              />
              <div className="absolute bottom-8 left-8 max-w-xs rounded-[20px] border border-white/15 bg-[#1e4b7a]/82 px-5 py-4 text-white shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur-xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-200">Operations Story</p>
                <p className="mt-2 text-[1rem] font-bold tracking-[-0.02em]">Designed to make cross-border shipping readable.</p>
              </div>
            </div>

            <div>
              <h2 className={sectionTitleClass}>
                <span className="text-[#1e4b7a]">Solving the</span>{" "}
                <span className="text-[#fe6801]">Complex.</span>
              </h2>
              <p className="mt-5 text-[0.9rem] leading-7 text-slate-600 sm:text-[0.96rem]">
                Founded in 2018, ship2sell was born from a singular observation: the logistics industry into India wasn't suffering from a lack of transport, but a lack of transparency.
              </p>
              <p className="mt-4 text-[0.9rem] leading-7 text-slate-600 sm:text-[0.96rem]">
                India's unique geography and regulatory framework required more than just trucks and ships - it required a navigator. We built a platform that integrates real-time customs intelligence, warehouse licensing, and automated compliance into a single dashboard.
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className={cardClass}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-[20px] bg-orange-50">
                    <Warehouse className="h-5 w-5 text-[#1e4b7a]" />
                  </div>
                  <h3 className="mt-5 text-[1.04rem] font-bold tracking-[-0.02em] text-[#1e4b7a]">Unified intelligence</h3>
                  <p className="mt-3 text-[0.86rem] leading-7 text-slate-600">
                    Registered across the 20 zones of linkage, with operational signals translated into one clear system.
                  </p>
                </div>
                <div className={cardClass}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-[20px] bg-orange-50">
                    <Users className="h-5 w-5 text-[#1e4b7a]" />
                  </div>
                  <h3 className="mt-5 text-[1.04rem] font-bold tracking-[-0.02em] text-[#1e4b7a]">Human expertise</h3>
                  <p className="mt-3 text-[0.86rem] leading-7 text-slate-600">
                    Precision technology backed by people who understand customs, warehousing, and live shipment control.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-20 lg:pb-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
          <div className="mb-12 text-center sm:mb-14">
              <h2 className={sectionTitleClass}>
                <span className="text-[#1e4b7a]">Core</span>{" "}
                <span className="text-[#fe6801]">Principles</span>
              </h2>
              <p className={sectionCopyClass}>
              The values that guide us as we work across every border and every mile.
              </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.04fr_0.96fr]">
            <div className="grid gap-6">
              {principles.map((principle) => {
                const Icon = principle.icon;

                return (
                  <article key={principle.title} className={cardClass}>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[20px] bg-orange-50">
                        <Icon className="h-5 w-5 text-[#1e4b7a]" />
                      </div>
                      <div>
                        <p className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#fe6801]">
                          {principle.eyebrow}
                        </p>
                        <h3 className="mt-2 text-[1.08rem] font-bold tracking-[-0.02em] text-[#1e4b7a]">{principle.title}</h3>
                        <p className="mt-3 text-[0.88rem] leading-7 text-slate-600">{principle.copy}</p>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="space-y-6">
              <div className="overflow-hidden rounded-[20px] border border-[#d9e2ec] bg-white shadow-[0_10px_30px_rgba(30,75,122,0.06)]">
                <div className="relative h-60 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?q=80&w=1400&auto=format&fit=crop"
                    alt="Container operations from above"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e4b7a]/70 via-[#1e4b7a]/20 to-transparent" />
                  <div className="absolute bottom-5 left-5 rounded-[20px] border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur-xl">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-200">Network Discipline</p>
                    <p className="mt-1 text-[1rem] font-bold tracking-[-0.02em]">Multimodal coordination at shipment level</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[20px] bg-gradient-to-br from-[#1e4b7a] via-[#1e4b7a] to-[#2f638f] p-6 text-white shadow-[0_20px_46px_rgba(30,75,122,0.20)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-[20px] bg-white/10">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-[1.14rem] font-bold tracking-[-0.02em]">Global trade standards, made readable</h3>
                <div className="mt-5 grid gap-3">
                  {standards.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-[20px] border border-white/10 bg-white/10 px-4 py-3 text-[0.84rem] text-slate-100"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-[#fe6801]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-16 sm:pb-20 lg:pb-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
          <div className="mb-12 text-center sm:mb-14">
            <h2 className={sectionTitleClass}>
              <span className="text-[#1e4b7a]">Leadership with</span>{" "}
              <span className="text-[#fe6801]">operational depth.</span>
            </h2>
            <p className={sectionCopyClass}>
              Experienced operators, customs strategists, and customer-facing leads working from the same service model.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {leadership.map((person) => (
              <article
                key={person.name}
                className="overflow-hidden rounded-[20px] border border-[#d9e2ec] bg-white shadow-[0_10px_30px_rgba(30,75,122,0.06)]"
              >
                <div className="h-60 overflow-hidden">
                  <img
                    src={person.image}
                    alt={person.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#fe6801]">{person.role}</p>
                  <h3 className="mt-2 text-[1.08rem] font-bold tracking-[-0.02em] text-[#1e4b7a]">{person.name}</h3>
                  <p className="mt-3 text-[0.88rem] leading-7 text-slate-600">{person.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 lg:pb-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
          <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-[#1e4b7a] via-[#1e4b7a] to-[#2f638f] p-6 text-white shadow-[0_22px_60px_rgba(30,75,122,0.22)] sm:p-8 lg:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-200">Ready to Work Together</p>
                <h2 className="mt-3 text-balance text-[1.65rem] font-bold tracking-[-0.02em] text-white sm:text-[2rem] lg:text-[2.35rem]">
                  Build a clearer shipping experience for your team.
                </h2>
                <p className="mt-4 max-w-2xl text-[0.92rem] leading-7 text-slate-100 sm:text-[0.98rem]">
                  Whether you need fast cross-border air freight, customs support, or a more dependable service model, we can map the right operating structure for your shipments.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/contact"
                    className="inline-flex h-12 items-center justify-center rounded-[20px] bg-[#fe6801] px-7 text-sm font-bold text-white transition-colors hover:bg-[#e65d00]"
                  >
                    Talk to Us
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-[20px] border border-white/15 bg-white/10 px-7 text-sm font-semibold text-white transition-colors hover:bg-white/16"
                  >
                    View Services
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[20px] border border-white/10 bg-white/10 px-5 py-5 backdrop-blur-xl">
                  <p className="text-[1.3rem] font-bold tracking-[-0.02em] text-white">Lane Design</p>
                  <p className="mt-2 text-[0.84rem] leading-6 text-slate-100">Route planning aligned to urgency, compliance, and shipment value.</p>
                </div>
                <div className="rounded-[20px] border border-white/10 bg-white/10 px-5 py-5 backdrop-blur-xl">
                  <p className="text-[1.3rem] font-bold tracking-[-0.02em] text-white">Support Model</p>
                  <p className="mt-2 text-[0.84rem] leading-6 text-slate-100">Readable updates and responsive escalation for active movements.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
