import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { ContactRound, MapPin, Star, UserRound } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AddressesPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div className="p-8 text-sm text-slate-500">Unauthorized. Please log in.</div>;
  }

  const customer = await prisma.customerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      addresses: {
        include: {
          country: true,
        },
        orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
      },
    },
  });

  return (
    <div className="mx-auto min-h-full max-w-[1500px] bg-[#f8f9fa] p-8 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-[#1E1B4B]">Address Book</h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Saved pickup and office addresses added for your shipment requests.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#1E1B4B]">Saved Addresses</h2>
            <p className="text-sm font-medium text-slate-500">
              These addresses can be used across create and schedule shipment flows.
            </p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
            {customer?.addresses.length ?? 0} saved
          </span>
        </div>

        <div className="space-y-4">
          {customer?.addresses?.length ? (
            customer.addresses.map((address) => (
              <div key={address.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="font-bold text-slate-900">{address.label || "Saved address"}</p>
                      {address.isDefault ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700">
                          <Star className="h-3.5 w-3.5" />
                          Default
                        </span>
                      ) : null}
                    </div>

                    <p className="flex items-center gap-2 text-sm text-slate-600">
                      <UserRound className="h-4 w-4 text-slate-400" />
                      {address.name}
                      {address.phone ? ` · ${address.phone}` : ""}
                    </p>

                    <p className="flex items-start gap-2 text-sm text-slate-600">
                      <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
                      <span>
                        {address.street1}
                        {address.street2 ? `, ${address.street2}` : ""}
                        {`, ${address.city}`}
                        {address.state ? `, ${address.state}` : ""}
                        {address.postalCode ? ` ${address.postalCode}` : ""}
                        {`, ${address.country.name}`}
                      </span>
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50">
                    <ContactRound className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
              <p className="font-medium text-slate-700">No addresses available yet.</p>
              <p className="mt-2 text-sm text-slate-500">
                Your logistics team can add pickup or office addresses from the admin panel.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
