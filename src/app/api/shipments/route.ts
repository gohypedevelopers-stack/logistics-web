import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendStatusEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify the user actually exists in DB (protects against stale JWT sessions)
    console.log("SESSION DEBUG:", JSON.stringify({ id: session.user.id, email: session.user.email, name: session.user.name }));
    
    let dbUser = await prisma.user.findUnique({ where: { id: session.user.id } });
    
    // Fallback: if user ID is stale (e.g. after DB reset), try to find by email
    if (!dbUser && session.user.email) {
      console.log("ID lookup failed, trying email fallback:", session.user.email);
      dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
    }
    
    // Last resort: find first user in the system (single-admin startup mode)
    if (!dbUser) {
      console.log("Email fallback also failed. Trying to find any matching user...");
      const allUsers = await prisma.user.findMany({ take: 5, select: { id: true, email: true } });
      console.log("Available users:", JSON.stringify(allUsers));
      // Try matching by name if email is not in session
      if (session.user.name) {
        dbUser = await prisma.user.findFirst({ where: { name: session.user.name } });
      }
    }
    
    if (!dbUser) {
      return NextResponse.json(
        { error: "Your session is stale. Please log out and log in again." },
        { status: 401 }
      );
    }

    let customer = await prisma.customerProfile.findUnique({
      where: { userId: dbUser.id }
    });

    if (!customer) {
       customer = await prisma.customerProfile.create({
          data: { userId: dbUser.id }
       });
    }

    const body = await request.json();
    const { originCountry, pickupDate, fullPickupAddress, weight, content, amount, receiverName, receiverPin, receiverCity, receiverAddress, carrier } = body;

    // Get or create India country
    let ind = await prisma.country.findFirst({ where: { code: "IN" } });
    if (!ind) {
       try {
         ind = await prisma.country.create({ data: { code: "IN", name: "India" }});
       } catch {
         ind = await prisma.country.findFirst({ where: { code: "IN" } });
       }
    }
    if (!ind) return NextResponse.json({ error: "Could not resolve destination country" }, { status: 500 });

    const recAddress = await prisma.address.create({
      data: {
        customerProfileId: customer.id,
        name: receiverName || "Receiver",
        street1: receiverAddress || "N/A",
        city: receiverCity || "Delhi",
        countryId: ind.id,
        postalCode: receiverPin || "000000"
      }
    });

    // Get or create origin country
    const originLabel = originCountry || "United Kingdom (UK)";
    const originCode = originLabel.includes("US") ? "US" : originLabel.includes("DE") ? "DE" : "UK";
    let originCtry = await prisma.country.findFirst({ where: { code: originCode } });
    if (!originCtry) {
       try {
         originCtry = await prisma.country.create({ data: { code: originCode, name: originLabel }});
       } catch {
         originCtry = await prisma.country.findFirst({ where: { code: originCode } });
       }
    }
    if (!originCtry) return NextResponse.json({ error: "Could not resolve origin country" }, { status: 500 });

    const pickupAddr = await prisma.address.create({
      data: {
        customerProfileId: customer.id,
        name: dbUser.name || "Sender",
        street1: fullPickupAddress || "N/A",
        city: originLabel,
        countryId: originCtry.id,
        postalCode: "N/A"
      }
    });

    const trackingId = `TRK${Date.now()}`;

    const shipment = await prisma.shipment.create({
      data: {
        trackingId,
        customerId: customer.id,
        createdById: dbUser.id,
        weight: parseFloat(weight) || 1,
        content: content || "General Goods",
        amount: parseFloat(amount) || 0,
        status: "SUBMITTED" as any,
        paymentStatus: "UNPAID",
        pickupAddressId: pickupAddr.id,
        receiverAddressId: recAddress.id,
        expectedArrivalDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    await prisma.shipmentStatusHistory.create({
       data: {
          shipmentId: shipment.id,
          status: "SUBMITTED" as any,
          notes: "Shipment submitted successfully. Awaiting admin review."
       }
    });

    try {
      if (dbUser.name) {
         await sendStatusEmail(dbUser.name, trackingId, "SUBMITTED", "Your tracking number has been generated. Pending admin review.");
      }
    } catch (emailErr) {
      console.error("Email dispatch failed (non-blocking):", emailErr);
    }

    return NextResponse.json({ success: true, shipment });
  } catch (error: any) {
    console.error("SHIPMENT CREATION ERROR:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
