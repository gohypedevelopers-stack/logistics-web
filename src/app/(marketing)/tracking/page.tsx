import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Manrope } from "next/font/google";
import {
  CheckCircle2,
  Clock,
  Headphones,
  MapPin,
  Plane,
  Search,
  ShieldCheck,
  XCircle,
  Zap,
} from "lucide-react";

const homeFont = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const sectionTitleClass =
  "text-balance text-[1.7rem] font-bold tracking-[-0.02em] text-[#1e4b7a] sm:text-[1.95rem] lg:text-[2.25rem]";
const sectionCopyClass =
  "mx-auto mt-4 max-w-2xl text-[0.92rem] font-normal leading-7 text-slate-600 sm:text-[0.98rem]";
const cardClass =
  "rounded-[20px] border border-[#d9e2ec] bg-white p-5 shadow-[0_10px_30px_rgba(30,75,122,0.06)] sm:p-6 lg:p-7";

export default async function TrackingPage({ searchParams }: { searchParams: Promise<{ id?: string }> | { id?: string } }) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.id || "";

  let shipment = null;
  if (query) {
    shipment = await prisma.shipment.findFirst({
      where: {
        OR: [{ trackingId: query }, { awb: query }],
      },
      include: {
        customer: true,
        receiverAddress: { include: { country: true } },
        pickupAddress: { include: { country: true } },
        statusHistory: { orderBy: { createdAt: "desc" } },
      },
    });
  }

  async function handleTrack(formData: FormData) {
    "use server";
    const id = formData.get("trackingId");
    if (id) redirect(`/tracking?id=${id}`);
    redirect("/tracking");
  }

  const timeline =
    shipment?.statusHistory.map((history: any, index: number) => ({
      label: history.status.replace(/_/g, " "),
      sub: history.location || "Logistics Node Update",
      time: new Date(history.createdAt).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      active: index === 0,
      notes: history.notes,
    })) || [];

  return (
    <div className={`${homeFont.className} min-h-screen bg-[#f6f8fc] pb-16 text-[#1e4b7a] sm:pb-20`}>
      <section className="relative isolate overflow-hidden pb-16 pt-28 sm:pb-20 sm:pt-32">
        <div className="absolute inset-0 -z-20">
          <img
            src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2000&auto=format&fit=crop"
            alt="Global shipment movement"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#1e4b7a]/94 via-[#1e4b7a]/88 to-[#1e4b7a]/85" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-[#f6f8fc]" />

        <div className="container relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-16">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-[20px] border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#ffd6bd] backdrop-blur-xl">
              <Zap className="h-3.5 w-3.5 fill-[#fe6801] text-[#fe6801]" />
              Tracking Intelligence
            </div>
            <h1 className="text-balance text-[2.45rem] font-bold leading-[1.02] tracking-[-0.03em] text-white sm:text-[3.35rem] lg:text-[4.3rem]">
              <span className="text-white">Real-time shipment visibility built for</span>{" "}
              <span className="text-[#fe6801]">clarity.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-[0.98rem] font-normal leading-7 text-slate-100 md:text-[1.06rem] md:leading-8 lg:text-[1.12rem]">
              Track your consignment, review milestone updates, and see the latest operational status in one consistent interface.
            </p>

            <form
              action={handleTrack}
              className="mt-8 flex w-full max-w-3xl flex-col gap-3 rounded-[20px] border border-white/35 bg-white/18 p-3 shadow-[0_25px_70px_rgba(5,28,55,0.45)] backdrop-blur-2xl sm:flex-row sm:items-center"
            >
              <div className="flex h-14 flex-1 items-center rounded-[20px] bg-white px-4 shadow-lg sm:h-16 sm:px-5">
                <Search className="mr-4 h-5 w-5 text-slate-400" />
                <input
                  name="trackingId"
                  type="text"
                  defaultValue={query}
                  placeholder="Enter Tracking ID or AWB..."
                  className="h-full w-full bg-transparent text-sm font-medium text-[#1e4b7a] outline-none placeholder:text-slate-400 sm:text-base"
                />
              </div>
              <button
                type="submit"
                className="flex h-14 items-center justify-center rounded-[20px] bg-[#fe6801] px-7 text-sm font-bold text-white transition-colors hover:bg-[#e65d00] sm:h-16"
              >
                Track Shipment
              </button>
            </form>
          </div>
        </div>
      </section>

      {!query ? (
        <section className="relative z-10 -mt-8 sm:-mt-10">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-16">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { value: "24/7", label: "Tracking Access" },
                { value: "Live", label: "Milestone Updates" },
                { value: "AWB", label: "Search Support" },
                { value: "Global", label: "Shipment Visibility" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[20px] border border-[#d9e2ec] bg-white px-5 py-5 shadow-[0_10px_24px_rgba(30,75,122,0.08)]"
                >
                  <p className="text-[1.7rem] font-bold leading-none tracking-[-0.02em] text-[#1e4b7a] sm:text-[1.9rem]">{item.value}</p>
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="py-16 sm:py-20">
              <div className="mx-auto max-w-3xl text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-orange-50">
                  <MapPin className="h-7 w-7 text-[#fe6801]" />
                </div>
                <h2 className={`${sectionTitleClass} mt-6`}>Enter a shipment reference to begin tracking.</h2>
                <p className={sectionCopyClass}>
                  Use a tracking ID or AWB above to see real-time shipment intelligence, recent movement updates, and service status.
                </p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {query && shipment ? (
        <section className="py-12 sm:py-16">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-16">
            <div className="grid gap-5 lg:grid-cols-[1.55fr_0.85fr] lg:gap-6">
              <div className="space-y-5">
                <div className={cardClass}>
                  <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Current Status</p>
                      <h2 className="text-[1.7rem] font-bold leading-[1.1] tracking-[-0.02em] text-[#1e4b7a] sm:text-[2rem]">
                        {shipment.status.replace(/_/g, " ")}
                      </h2>
                      <p className="mt-2 text-[0.94rem] font-normal text-slate-600">{timeline[0]?.sub || "In Transit"}</p>
                    </div>

                    <div className="rounded-[20px] border border-orange-100 bg-orange-50 px-5 py-4 md:min-w-[220px]">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-orange-600">Estimated Arrival</p>
                      <p className="mt-2 text-[1.2rem] font-bold tracking-[-0.02em] text-[#1e4b7a]">
                        {shipment.expectedArrivalDate
                          ? new Date(shipment.expectedArrivalDate).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "Pending review"}
                      </p>
                      <p className="mt-1 text-[12px] text-slate-500">Updated in real time</p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-start gap-4 rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] px-5 py-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[20px] bg-[#fe6801]">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[0.96rem] font-semibold text-[#1e4b7a]">Tracking ID: {shipment.trackingId}</p>
                      <p className="mt-1 text-[0.9rem] font-normal leading-6 text-slate-600">
                        {timeline[0]?.notes || "Latest operational event received for this shipment."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={cardClass}>
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-[1.3rem] font-bold tracking-[-0.02em] text-[#1e4b7a]">Tracking Workflow</h3>
                      <p className="mt-2 text-[0.92rem] text-slate-600">Recent shipment events shown from latest to earlier movement.</p>
                    </div>
                    <div className="hidden rounded-[20px] bg-[#f8fafc] px-4 py-2 text-[11px] font-semibold text-slate-500 sm:block">
                      {timeline.length} updates
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute bottom-0 left-5 top-0 w-[2px] bg-slate-200" />
                    <div className="space-y-0">
                      {timeline.map((step, index) => (
                        <div key={`${step.label}-${index}`} className="relative flex gap-4 pb-7 last:pb-0">
                          <div
                            className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
                              step.active ? "border-[#1e4b7a] bg-[#1e4b7a]" : "border-orange-200 bg-orange-50"
                            }`}
                          >
                            {step.active ? (
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            ) : (
                              <div className="h-2.5 w-2.5 rounded-full bg-[#fe6801]" />
                            )}
                          </div>

                          <div className="flex min-w-0 flex-1 flex-col gap-3 pt-1 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0">
                              <p className="text-[0.96rem] font-semibold uppercase tracking-[0.01em] text-[#1e4b7a]">{step.label}</p>
                              <p className="mt-1 text-[0.88rem] text-slate-500">{step.sub}</p>
                              {step.notes ? (
                                <p className="mt-3 rounded-[16px] border border-slate-200 bg-slate-50 p-3 text-[0.86rem] italic leading-6 text-slate-600">
                                  "{step.notes}"
                                </p>
                              ) : null}
                            </div>
                            <span
                              className={`w-max rounded-[16px] px-3 py-1.5 text-[11px] font-semibold ${
                                step.active ? "bg-[#f1f5f9] text-slate-600" : "bg-white text-slate-400"
                              }`}
                            >
                              {step.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className={cardClass}>
                  <h3 className="text-[1.3rem] font-bold tracking-[-0.02em] text-[#1e4b7a]">Shipment Intelligence</h3>

                  <div className="mt-6 space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[20px] bg-orange-50">
                        <Plane className="-rotate-45 h-4 w-4 text-[#1e4b7a]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Origin</p>
                        <p className="mt-1 text-[1rem] font-semibold text-[#1e4b7a]">{shipment.pickupAddress?.city || "Gateway Origin"}</p>
                        <p className="text-[0.86rem] text-slate-500">{shipment.pickupAddress?.country?.name || "Global Node"}</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-5">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[20px] bg-orange-50">
                          <Plane className="h-4 w-4 rotate-45 text-[#fe6801]" />
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">Destination</p>
                          <p className="mt-1 text-[1rem] font-semibold text-[#1e4b7a]">{shipment.receiverAddress?.city || "Destination Hub"}</p>
                          <p className="text-[0.86rem] text-slate-500">{shipment.receiverAddress?.country?.name || "Receiving Country"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3 rounded-[20px] border border-[#d9e2ec] bg-[#f8fafc] p-4">
                    {[
                      { label: "Weight", value: `${shipment.weight} kg` },
                      { label: "Consignment", value: shipment.content || "General Goods" },
                      { label: "Service Level", value: "Priority Intelligence" },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between gap-4 text-[0.92rem]">
                        <span className="text-slate-500">{row.label}</span>
                        <span className="text-right font-semibold text-[#1e4b7a]">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="relative mt-6 overflow-hidden rounded-[20px] border border-[#d9e2ec] bg-slate-100">
                    <img
                      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop&grayscale"
                      alt="Route map"
                      className="h-40 w-full object-cover opacity-40"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex items-center gap-2 rounded-full bg-[#1e4b7a] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-lg">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                        Real-Time GPS Active
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[20px] bg-gradient-to-br from-[#1e4b7a] via-[#1e4b7a] to-[#1a2f45] p-6 text-white shadow-[0_24px_60px_rgba(30,75,122,0.18)]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[20px] bg-white/10">
                    <ShieldCheck className="h-5 w-5 text-[#fe6801]" />
                  </div>
                  <h4 className="mt-5 text-[1.2rem] font-bold tracking-[-0.02em]">Need Assistance?</h4>
                  <p className="mt-3 text-[0.92rem] leading-7 text-slate-100">
                    Our global support team is available around the clock for shipment questions, delivery issues, and status clarification.
                  </p>
                  <div className="mt-6 flex flex-col gap-3">
                    <div className="inline-flex items-center gap-2 text-[12px] font-semibold text-orange-100">
                      <Clock className="h-4 w-4" />
                      24/7 support response
                    </div>
                    <Link
                      href="/contact"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-[20px] border border-white/15 bg-white/10 text-sm font-bold text-white transition-colors hover:bg-white/18"
                    >
                      <Headphones className="h-4 w-4" />
                      Contact Support
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {query && !shipment ? (
        <section className="py-14 sm:py-16">
          <div className="container mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-16">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] bg-red-50">
              <XCircle className="h-7 w-7 text-red-400" />
            </div>
            <h2 className={`${sectionTitleClass} mt-6`}>Shipment not found</h2>
            <p className={sectionCopyClass}>
              We could not find a shipment with reference <span className="font-semibold text-[#1e4b7a]">{query}</span>. Check the ID or AWB and try again.
            </p>
          </div>
        </section>
      ) : null}
    </div>
  );
}
