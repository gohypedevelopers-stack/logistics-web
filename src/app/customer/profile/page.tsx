import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <div className="p-8 text-sm text-slate-500">Access denied. Please sign in.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      customerProfile: {
        include: {
          addresses: {
            include: {
              country: true,
            },
            orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
          },
        },
      },
    },
  });

  if (!user) {
    return <div className="p-8 text-sm text-slate-500">Profile not found.</div>;
  }

  const fullName = user.name?.trim() || "Account Holder";
  const email = user.email;
  const phone = user.customerProfile?.phone?.trim() || "";
  const memberSince = user.createdAt.toISOString();
  const profileUpdatedAt = user.updatedAt.toISOString();
  const primaryAddress = user.customerProfile?.addresses[0] ?? null;

  return (
    <ProfileClient
      fullName={fullName}
      email={email}
      phone={phone}
      addressCount={user.customerProfile?.addresses.length ?? 0}
      addresses={user.customerProfile?.addresses ?? []}
      memberSince={memberSince}
      profileUpdatedAt={profileUpdatedAt}
      primaryAddressLabel={primaryAddress?.label || primaryAddress?.street1 || ""}
    />
  );
}
