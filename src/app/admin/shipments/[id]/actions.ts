"use server";

import prisma from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { sendStatusEmail } from "@/lib/email";
import { after } from 'next/server';

export async function updateShipmentAction(formData: FormData) {
  const id = formData.get("shipmentId") as string;
  const status = formData.get("status") as any;
  const paymentStatus = formData.get("paymentStatus") as any;
  const notes = formData.get("notes") as string;
  const location = formData.get("location") as string;
  const awb = formData.get("awb") as string;
  const rejectionReason = formData.get("rejectionReason") as string;

  if (!id || !status) return;

  console.log(`ADMIN ACTION: Updating shipment ${id} to status: ${status}, payment: ${paymentStatus}`);

  const shipmentData = await prisma.shipment.findUnique({
    where: { id },
    include: { customer: { include: { user: true } } }
  });

  if (!shipmentData) return;

  const hasStatusChanged = shipmentData.status !== status;
  const hasUpdates = notes || location;

  await prisma.shipment.update({
    where: { id },
    data: { 
      status, 
      paymentStatus: paymentStatus || "UNPAID",
      rejectionReason: status === "REJECTED" ? rejectionReason : null,
      awb: awb || undefined,
      ...( (hasStatusChanged || hasUpdates) ? {
        statusHistory: {
          create: {
            status: status,
            notes: notes || null,
            location: location || null
          }
        }
      } : {})
    } as any
  });

  if (hasStatusChanged && shipmentData.customer.user.name) {
    after(async () => {
      try {
        console.log("[AFTER_HOOK] Dispatching background email notification...");
        await sendStatusEmail(
          shipmentData.customer.user.name!, 
          shipmentData.trackingId, 
          status.replace(/_/g, ' '), 
          notes
        );
      } catch (err) {
        console.error("[AFTER_HOOK] Email failed:", err);
      }
    });
  }

  // Critical paths first for immediate UI update
  revalidatePath(`/admin/shipments/${id}`);
  revalidatePath(`/admin/shipments`);
  
  // Secondary paths can be in the background if we want to squeeze more speed, 
  // but for reliability of counts, we'll do them here or in after.
  after(() => {
    revalidatePath(`/admin/dashboard`);
    revalidatePath(`/customer`);
    revalidatePath(`/customer/shipments`);
    revalidatePath(`/customer/track`);
  });
}
