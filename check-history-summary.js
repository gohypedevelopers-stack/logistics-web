const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const shipments = await p.shipment.findMany({ 
    include: { statusHistory: { orderBy: { createdAt: 'desc' } } }
  });
  shipments.forEach(s => {
    console.log(`Shipment ID: ${s.id}, Tracking: ${s.trackingId}, Current Status: ${s.status}`);
    s.statusHistory.forEach(h => {
      console.log(`  - [${h.createdAt.toISOString()}] ${h.status}: ${h.notes || ''}`);
    });
  });
}

main().catch(console.error).finally(() => p.$disconnect());
