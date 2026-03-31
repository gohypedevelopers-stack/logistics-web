"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { sendStatusEmail } from "@/lib/email";
import {
  createTrackingSummary,
  createTrackingTitle,
  normalizeShipmentStatus,
} from "@/lib/shipment-utils";

function cleanValue(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function revalidateShipmentViews(id: string) {
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/shipments");
  revalidatePath(`/admin/shipments/${id}`);
  revalidatePath("/customer/dashboard");
  revalidatePath("/customer/shipments");
  revalidatePath(`/customer/shipments/${id}`);
  revalidatePath("/customer/track");
}

export async function updateShipmentAction(formData: FormData) {
  const shipmentId = cleanValue(formData.get("shipmentId"));
  const requestedStatus = cleanValue(formData.get("status"));
  const paymentStatus = cleanValue(formData.get("paymentStatus"));
  const notes = cleanValue(formData.get("notes"));
  const location = cleanValue(formData.get("location"));
  const awb = cleanValue(formData.get("awb"));
  const referenceNo = cleanValue(formData.get("referenceNo"));
  const rejectionReason = cleanValue(formData.get("rejectionReason"));

  if (!shipmentId) {
    throw new Error("Shipment ID is required.");
  }

  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    include: {
      customer: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!shipment) {
    throw new Error("Shipment not found.");
  }

  const nextStatus = normalizeShipmentStatus(requestedStatus ?? shipment.status);
  const previousStatus = normalizeShipmentStatus(shipment.status);
  const hasStatusChanged = nextStatus !== previousStatus;
  const shouldWriteHistory = hasStatusChanged || Boolean(notes) || Boolean(location);

  await prisma.$transaction(async (tx) => {
    await tx.shipment.update({
      where: { id: shipmentId },
      data: {
        status: nextStatus as any,
        paymentStatus: (paymentStatus ?? shipment.paymentStatus) as any,
        ...(formData.has("awb") ? { awb } : {}),
        ...(formData.has("referenceNo") ? { referenceNo } : {}),
        ...(formData.has("rejectionReason")
          ? {
              rejectionReason:
                nextStatus === "REJECTED" ? rejectionReason : null,
            }
          : {}),
      },
    });

    if (shouldWriteHistory) {
      await tx.shipmentStatusHistory.create({
        data: {
          shipmentId,
          status: nextStatus as any,
          location,
          notes: notes ?? createTrackingSummary(nextStatus),
        },
      });
    }
  });

  revalidateShipmentViews(shipmentId);

  if (hasStatusChanged && shipment.customer.user?.name) {
    after(async () => {
      try {
        await sendStatusEmail(
          shipment.customer.user.name!,
          shipment.trackingId,
          nextStatus.replace(/_/g, " "),
          notes ?? createTrackingSummary(nextStatus),
        );
      } catch (error) {
        console.error("[UPDATE_SHIPMENT_ACTION] Email dispatch failed", error);
      }
    });
  }

  return { success: true };
}

export async function addTrackingEventAction(formData: FormData) {
  const shipmentId = cleanValue(formData.get("shipmentId"));
  const title = cleanValue(formData.get("title"));
  const note = cleanValue(formData.get("note"));
  const location = cleanValue(formData.get("location"));
  const requestedStatus = cleanValue(formData.get("status"));

  if (!shipmentId) {
    throw new Error("Shipment ID is required.");
  }

  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    select: {
      id: true,
      status: true,
    },
  });

  if (!shipment) {
    throw new Error("Shipment not found.");
  }

  const nextStatus = requestedStatus
    ? normalizeShipmentStatus(requestedStatus)
    : null;
  const effectiveStatus = nextStatus ?? normalizeShipmentStatus(shipment.status);
  const shouldCreateEvent = Boolean(title || note || location);

  await prisma.$transaction(async (tx) => {
    if (nextStatus && nextStatus !== normalizeShipmentStatus(shipment.status)) {
      await tx.shipment.update({
        where: { id: shipmentId },
        data: {
          status: nextStatus as any,
        },
      });

      await tx.shipmentStatusHistory.create({
        data: {
          shipmentId,
          status: nextStatus as any,
          location,
          notes: note ?? createTrackingSummary(nextStatus),
        },
      });
    }

    if (shouldCreateEvent) {
      await tx.shipmentEvent.create({
        data: {
          shipmentId,
          title: title ?? createTrackingTitle(effectiveStatus),
          status: effectiveStatus as any,
          location,
          note: note ?? createTrackingSummary(effectiveStatus),
        },
      });
    }
  });

  revalidateShipmentViews(shipmentId);

  return { success: true };
}
