const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const shipments = await p.shipment.findMany({ select: { id: true, status: true } });
  shipments.forEach(s => {
    console.log(`ID: ${s.id}, STATUS: '${s.status}', TYPE: ${typeof s.status}`);
  });
}

main().catch(console.error).finally(() => p.$disconnect());
