const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const count = await p.shipmentStatusHistory.count();
  console.log('Total History Records:', count);

  const statuses = await p.shipmentStatusHistory.findMany({
     orderBy: { createdAt: 'desc' }
  });
  statuses.forEach(h => {
     console.log(`[${h.createdAt.toISOString()}] (Shipment ${h.shipmentId}) ${h.status}`);
  });
}

main().catch(console.error).finally(() => p.$disconnect());
