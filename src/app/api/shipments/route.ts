import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import {
  buildReferenceNumber,
  buildShipmentTrackingId,
  createTrackingSummary,
} from "@/lib/shipment-utils";
import { sendStatusEmail } from "@/lib/email";

const createShipmentSchema = z.object({
  collectionType: z.enum(["PICKUP", "WAREHOUSE_DROP"]).default("PICKUP"),
  pickupCountryId: z.string().min(1, "Pickup country is required."),
  destinationCountryId: z.string().min(1, "Destination country is required."),
  warehouseId: z.string().optional().nullable(),
  pickupLocation: z.string().trim().optional().nullable(),
  pickupCity: z.string().trim().optional().nullable(),
  destinationLocation: z.string().trim().optional().nullable(),
  destinationCity: z.string().trim().optional().nullable(),
  pickupDate: z.string().optional().nullable(),
  pcs: z.coerce.number().int().positive("PCS must be greater than zero."),
  weight: z.coerce.number().positive("Weight must be greater than zero."),
  description: z.string().trim().min(3, "Description is required."),
  declaredValue: z.coerce.number().min(0, "Declared value cannot be negative."),
  referenceNo: z.string().trim().optional().nullable(),
  receiverName: z.string().trim().optional().nullable(),
  receiverPhone: z.string().trim().optional().nullable(),
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createShipmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid shipment payload." },
        { status: 400 },
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { customerProfile: true },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "Your session is stale. Please log in again." },
        { status: 401 },
      );
    }

    const payload = parsed.data;

    if (payload.collectionType === "PICKUP") {
      if (!payload.pickupLocation || payload.pickupLocation.trim().length < 5) {
        return NextResponse.json(
          { error: "Pickup location is required." },
          { status: 400 },
        );
      }

      if (!payload.pickupCity || payload.pickupCity.trim().length < 2) {
        return NextResponse.json(
          { error: "Pickup city is required." },
          { status: 400 },
        );
      }

      if (!payload.receiverName || payload.receiverName.trim().length < 2) {
        return NextResponse.json(
          { error: "Receiver name is required." },
          { status: 400 },
        );
      }

      if (!payload.receiverPhone || payload.receiverPhone.trim().length < 5) {
        return NextResponse.json(
          { error: "Receiver phone is required." },
          { status: 400 },
        );
      }
    }

    const [pickupCountry, destinationCountry] = await Promise.all([
      prisma.country.findFirst({
        where: { id: payload.pickupCountryId, isActive: true },
      }),
      prisma.country.findFirst({
        where: { id: payload.destinationCountryId, isActive: true },
      }),
    ]);

    if (!pickupCountry || !destinationCountry) {
      return NextResponse.json(
        { error: "Selected country is not currently supported." },
        { status: 400 },
      );
    }

    const route = await prisma.route.findFirst({
      where: {
        originCountryId: payload.pickupCountryId,
        destinationCountryId: payload.destinationCountryId,
        isActive: true,
      },
      orderBy: [{ transitDays: "asc" }, { createdAt: "asc" }],
    });

    const warehouse =
      payload.collectionType === "WAREHOUSE_DROP"
        ? await prisma.warehouse.findFirst({
            where: {
              id: payload.warehouseId ?? undefined,
              countryId: payload.pickupCountryId,
              isActive: true,
            },
          })
        : null;

    if (payload.collectionType === "WAREHOUSE_DROP" && !warehouse) {
      return NextResponse.json(
        { error: "Please select a valid warehouse for warehouse drop." },
        { status: 400 },
      );
    }

    const customerProfile =
      dbUser.customerProfile ??
      (await prisma.customerProfile.create({
        data: {
          userId: dbUser.id,
          companyName: dbUser.name ?? undefined,
        },
      }));

    const pickupDate = payload.pickupDate ? new Date(payload.pickupDate) : null;
    const trackingId = buildShipmentTrackingId();
    const referenceNo = payload.referenceNo || buildReferenceNumber();
    const status = "CREATED";

    const shipment = await prisma.$transaction(async (tx) => {
      const pickupAddress = await tx.address.create({
        data:
          payload.collectionType === "WAREHOUSE_DROP" && warehouse
            ? {
                customerProfileId: customerProfile.id,
                label: `Warehouse Drop - ${warehouse.code}`,
                name: warehouse.name,
                phone: warehouse.phone,
                street1: warehouse.street1,
                street2: warehouse.street2,
                city: warehouse.city,
                state: warehouse.state,
                postalCode: warehouse.postalCode,
                countryId: warehouse.countryId,
              }
            : {
                customerProfileId: customerProfile.id,
                label: "Shipment Pickup",
                name: dbUser.name || customerProfile.companyName || "Sender",
                street1: payload.pickupLocation!,
                city: payload.pickupCity!,
                countryId: pickupCountry.id,
              },
      });

      const receiverAddress = await tx.address.create({
        data: {
          customerProfileId: customerProfile.id,
          label: "Shipment Receiver",
          name: payload.receiverName || "Receiver details pending",
          phone: payload.receiverPhone || null,
          street1: payload.destinationLocation || `${destinationCountry.name} delivery details pending`,
          city: payload.destinationCity || destinationCountry.name,
          countryId: destinationCountry.id,
        },
      });

      return tx.shipment.create({
        data: {
          trackingId,
          referenceNo,
          collectionType: payload.collectionType,
          customerId: customerProfile.id,
          createdById: dbUser.id,
          routeId: route?.id,
          warehouseId: warehouse?.id,
          countryId: destinationCountry.id,
          pickupAddressId: pickupAddress.id,
          receiverAddressId: receiverAddress.id,
          receiverName: payload.receiverName || null,
          receiverPhone: payload.receiverPhone || null,
          pickupDate,
          pcs: payload.pcs,
          weight: payload.weight,
          content: payload.description,
          amount: payload.declaredValue,
          status,
          paymentStatus: "UNPAID",
          statusHistory: {
            create: {
              status,
              location: warehouse?.city ?? payload.pickupCity ?? pickupCountry.name,
              notes:
                payload.collectionType === "WAREHOUSE_DROP" && warehouse
                  ? `${createTrackingSummary(status)} Warehouse drop selected at ${warehouse.name}.`
                  : !route
                    ? `${createTrackingSummary(status)} Route assignment is pending review by operations.`
                    : createTrackingSummary(status),
            },
          },
        },
        include: {
          country: true,
          route: {
            include: {
              originCountry: true,
              destinationCountry: true,
            },
          },
        },
      });
    });

    revalidatePath("/customer/dashboard");
    revalidatePath("/customer/shipments");
    revalidatePath("/customer/track");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/shipments");

    if (dbUser.name) {
      try {
        await sendStatusEmail(
          dbUser.name,
          trackingId,
          "Shipment created",
          createTrackingSummary(status),
        );
      } catch (error) {
        console.error("[SHIPMENTS_POST] Non-blocking email failure", error);
      }
    }

    return NextResponse.json({ success: true, shipment });
  } catch (error) {
    console.error("[SHIPMENTS_POST] Failed to create shipment", error);

    return NextResponse.json(
      { error: "Unable to create shipment right now." },
      { status: 500 },
    );
  }
}
