const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const shipments = await p.shipment.findMany({ select: { id: true, status: true, trackingId: true } });
  console.log(JSON.stringify(shipments, null, 2));
}

main().catch(console.error).finally(() => p.$disconnect());
