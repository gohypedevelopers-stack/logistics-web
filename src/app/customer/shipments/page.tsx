import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ClientShipmentsPage from "./ClientPage";

export default async function CustomerOrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <div>Unauthorized. Please log in.</div>;
  }

  const customerProfile = await prisma.customerProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      shipments: {
        include: {
          receiverAddress: { include: { country: true } },
          country: true,
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  const shipments = customerProfile?.shipments || [];

  return <ClientShipmentsPage shipments={shipments} />;
}
