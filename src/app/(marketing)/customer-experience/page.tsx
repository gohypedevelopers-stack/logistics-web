import { Manrope } from "next/font/google";
import {
  ArrowRight,
  BarChart2,
  Check,
  Globe2,
  MessageSquare,
  Package,
  ShieldCheck,
  Truck,
  Zap,
} from "lucide-react";
import Link from "next/link";

const homeFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const flowSteps = [
  {
    num: "01",
    title: "Premium Pickup",
    desc: "Certified pickup teams arrive on time, confirm cargo condition, and log the shipment correctly at origin.",
    icon: Package,
    image:
      "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Cargo team preparing a shipment",
  },
  {
    num: "02",
    title: "Smart Transit",
    desc: "Routing is optimized for speed, visibility, and reliable operational handoffs across the network.",
    icon: Zap,
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Cargo aircraft in transit",
  },
  {
    num: "03",
    title: "Digital Customs",
    desc: "Documents and clearance workflows are handled through a structured, trackable digital process.",
    icon: Globe2,
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Customs paperwork and laptop",
  },
  {
    num: "04",
    title: "Final Delivery",
    desc: "Certified delivery teams close the journey with live confirmation and consistent customer communication.",
    icon: Truck,
    image:
      "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Last-mile delivery handoff",
  },
];

const intelFeatures = [
  {
    title: "Customs Engine",
    desc: "Rules-based checks surface compliance risks early so the customer sees fewer surprises later.",
    icon: Globe2,
    image:
      "https://images.unsplash.com/photo-1517504734587-2890819debab?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Global logistics dashboard",
  },
  {
    title: "IoT Sensors",
    desc: "Temperature, humidity, and movement signals can be monitored for sensitive cargo categories.",
    icon: BarChart2,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Sensor hardware closeup",
  },
  {
    title: "Audit Trail",
    desc: "Document actions and route updates remain easier to trace across the shipment lifecycle.",
    icon: Package,
    image:
      "https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Document tracking and analytics",
  },
  {
    title: "Control Desk",
    desc: "Human specialists stay involved for critical cargo, urgent cases, and service escalations.",
    icon: MessageSquare,
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop",
    imageAlt: "Operations team at workstations",
  },
];

const testimonials = [
  {
    quote:
      "We moved medical prototypes from Germany to Italy with complete confidence. The visibility model gave our operating team the assurance it needed.",
    name: "Arun Mehta",
    role: "Head of Ops, Biotech Global",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&fit=crop",
    image:
      "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?q=80&w=900&auto=format&fit=crop",
    imageAlt: "Warehouse staging area",
  },
  {
    quote:
      "Predictive alerts saved us several days during peak distribution. Their workflow improved our shipment response accuracy in a measurable way.",
    name: "Sarah Collins",
    role: "Supply Chain Director, Finsure Ltd",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&fit=crop",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?q=80&w=900&auto=format&fit=crop",
    imageAlt: "Air cargo logistics",
  },
];

const sectionTitleClass =
  "text-balance text-[1.7rem] font-bold tracking-[-0.02em] text-[#1e4b7a] sm:text-[1.95rem] lg:text-[2.25rem]";
const sectionCopyClass =
  "mx-auto mt-4 max-w-2xl text-[0.92rem] font-normal leading-7 text-slate-600 sm:text-[0.98rem]";
const cardClass =
  "flex h-full flex-col rounded-[20px] border border-[#d9e2ec] bg-white p-5 shadow-[0_10px_30px_rgba(30,75,122,0.06)] sm:p-6 lg:p-7";

export default function CustomerExperiencePage() {
  return (
    <div className={`${homeFont.className} min-h-screen bg-[#f6f8fc] text-[#1e4b7a]`}>
      <section className="relative isolate overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-32">
        <div className="absolute inset-0 -z-20">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1600&auto=format&fit=crop"
            alt="Cargo aircraft"
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
                Customer Experience
              </div>
              <h1 className="text-balance text-[2.45rem] font-bold leading-[1.02] tracking-[-0.03em] text-white sm:text-[3.35rem] lg:text-[4.4rem]">
                <span className="text-white">A clearer shipment journey from origin to</span>{" "}
                <span className="text-[#fe6801]">delivery.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-[0.98rem] font-normal leading-7 text-slate-100 md:text-[1.06rem] md:leading-8 lg:text-[1.12rem]">
                ship2sell is built to give customers confidence through visibility, consistent communication, and structured support at every stage.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/login?callbackUrl=%2Fcustomer%2Ftrack"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-[20px] bg-[#fe6801] px-7 text-sm font-bold text-white transition-colors hover:bg-[#e65d00]"
                >
                  Track a Journey
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center rounded-[20px] border border-white/25 bg-white/10 px-7 text-sm font-semibold text-white transition-colors hover:bg-white/16"
                >
                  Speak with Support
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                { value: "24/7", label: "Support Coverage" },
                { value: "Live", label: "Status Visibility" },
                { value: "Fast", label: "Issue Escalation" },
                { value: "Global", label: "Delivery Reach" },
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

      <section className="relative z-10 -mt-8 pb-16 sm:-mt-10 sm:pb-20 lg:pb-24">
        <div className="container mx-auto max-w-[80rem] px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center sm:mb-14">
            <h2 className={sectionTitleClass}>The Origin-to-Destination Flow</h2>
            <p className={sectionCopyClass}>
              A consistent journey model designed to keep customers informed, aligned, and confident at each stage.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 xl:gap-8">
            {flowSteps.map((step) => {
              const Icon = step.icon;
              return (
                <article key={step.num} className={cardClass}>
                  <div className="overflow-hidden rounded-[16px]">
                    <img
                      src={step.image}
                      alt={step.imageAlt}
                      className="h-40 w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-5 flex h-11 w-11 items-center justify-center rounded-[20px] bg-orange-50">
                    <Icon className="h-5 w-5 text-[#1e4b7a]" />
                  </div>
                  <h3 className="mt-3 text-[1.15rem] font-bold tracking-[-0.02em] text-[#1e4b7a]">{step.title}</h3>
                  <p className="mt-3 text-[0.92rem] leading-7 text-slate-600">{step.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
            <div className="grid gap-6 sm:grid-cols-2">
              {intelFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.title} className={`${cardClass} gap-4`}>
                    <div className="overflow-hidden rounded-[16px]">
                      <img
                        src={feature.image}
                        alt={feature.imageAlt}
                        className="h-32 w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[20px] bg-orange-50">
                        <Icon className="h-4 w-4 text-[#1e4b7a]" />
                      </div>
                      <h3 className="text-[1rem] font-bold tracking-[-0.02em] text-[#1e4b7a]">{feature.title}</h3>
                    </div>
                    <p className="text-[0.88rem] leading-6 text-slate-600">{feature.desc}</p>
                  </article>
                );
              })}
            </div>

            <div>
              <h2 className={sectionTitleClass}>The intelligence behind the transit.</h2>
              <p className="mt-5 max-w-xl text-[0.94rem] leading-7 text-slate-600 sm:text-[1rem]">
                We do not just move cargo. We manage operational data in a way that helps customers understand status, timing, and next steps more clearly.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  {
                    label: "Live ETA Tracking",
                    desc: "Real-time ETA visibility across key milestones and delivery checkpoints.",
                  },
                  {
                    label: "Condition Monitoring",
                    desc: "Extra oversight for healthcare, electronics, and other sensitive shipments.",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100">
                      <Check className="h-3 w-3 text-[#fe6801]" />
                    </div>
                    <div className="text-[0.92rem] leading-7 text-slate-600">
                      <span className="font-semibold text-[#1e4b7a]">{item.label}</span>
                      <span>{` - ${item.desc}`}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
          <div className="overflow-hidden rounded-[20px] bg-gradient-to-br from-[#1e4b7a] via-[#1e4b7a] to-[#1a2f45] p-6 text-white shadow-[0_30px_70px_rgba(30,75,122,0.20)] sm:p-8 lg:p-10">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
              <div>
                <h2 className="text-balance text-[1.8rem] font-bold tracking-[-0.02em] sm:text-[2.1rem] lg:text-[2.6rem]">
                  Global support, local expertise
                </h2>
                <p className="mt-4 max-w-xl text-[0.96rem] leading-7 text-slate-100">
                  Teams across key hubs give customers faster answers, stronger route context, and better escalation handling when timing matters.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-4">
                  {[
                    { val: "24/7", label: "Support Coverage" },
                    { val: "15m", label: "Response Goal" },
                    { val: "50+", label: "Specialists" },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-[1.6rem] font-bold tracking-[-0.02em] text-white sm:text-[1.9rem]">{item.val}</p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-200">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[20px] border border-white/10 bg-white/10 p-5 backdrop-blur-sm sm:p-6">
                <div className="mb-5 overflow-hidden rounded-[16px]">
                  <img
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=900&auto=format&fit=crop"
                    alt="Operations team collaborating"
                    className="h-28 w-full object-cover sm:h-32"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-3">
                  {[
                    {
                      label: "Customer Support",
                      msg: "My shipment GN-94821 has reached customs. Can you expedite clearance?",
                      ours: false,
                    },
                    {
                      label: "Mumbai Operations Hub",
                      msg: "This shipment has been escalated to our senior clearance broker. Expected clearance time is about 90 minutes.",
                      ours: true,
                    },
                  ].map((message) => (
                    <div key={message.label} className={`flex items-start gap-3 ${message.ours ? "flex-row-reverse" : ""}`}>
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                          message.ours ? "bg-[#fe6801] text-white" : "bg-orange-200 text-[#1e4b7a]"
                        }`}
                      >
                        {message.ours ? "OPS" : "YOU"}
                      </div>
                      <div className={`max-w-[82%] rounded-[20px] p-4 ${message.ours ? "bg-[#1e4b7a] text-white" : "bg-white text-[#1e4b7a]"}`}>
                        <p className={`mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${message.ours ? "text-orange-200" : "text-slate-400"}`}>
                          {message.label}
                        </p>
                        <p className="text-[0.84rem] leading-6">{message.msg}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5">
                  <Link
                    href="/contact"
                    className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-[20px] bg-[#fe6801] text-sm font-bold text-white transition-colors hover:bg-[#e65d00]"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Contact Support Team
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-16">
          <div className="mb-12 text-center">
            <h2 className={sectionTitleClass}>Trusted by global teams</h2>
            <p className={sectionCopyClass}>
              Experience matters most when shipments are urgent, sensitive, or commercially important.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
            {testimonials.map((item) => (
              <article key={item.name} className={cardClass}>
                <div className="overflow-hidden rounded-[16px]">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    className="h-32 w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <p className="mt-5 text-[0.98rem] italic leading-8 text-slate-600">"{item.quote}"</p>
                <div className="mt-8 flex items-center gap-4">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="h-12 w-12 rounded-full border-2 border-white object-cover shadow-sm"
                    loading="lazy"
                  />
                  <div>
                    <p className="text-[0.96rem] font-semibold text-[#1e4b7a]">{item.name}</p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">{item.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-16">
          <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#1e4b7a] via-[#1e4b7a] to-[#1a2f45] p-6 text-center text-white shadow-[0_30px_70px_rgba(30,75,122,0.20)] sm:p-8 lg:p-12">
            <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-[#fe6801]/20 blur-3xl" />
            <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-[#fe6801]/10 blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-balance text-[1.8rem] font-bold tracking-[-0.02em] sm:text-[2.1rem] lg:text-[2.7rem]">
                Ready to improve the shipment experience?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-[0.96rem] leading-7 text-slate-100">
                Turn logistics communication, tracking visibility, and customer confidence into a real operational advantage.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex h-12 items-center justify-center rounded-[20px] bg-[#fe6801] px-7 text-sm font-bold text-white transition-colors hover:bg-[#e65d00]"
                >
                  Request a Personalized Demo
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center rounded-[20px] border border-white/20 bg-white/10 px-7 text-sm font-semibold text-white transition-colors hover:bg-white/18"
                >
                  Speak with a Specialist
                </Link>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 text-[12px] text-orange-100">
                <ShieldCheck className="h-4 w-4" />
                Customer-first visibility with operational support behind it
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
