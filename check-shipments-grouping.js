const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const shipments = await p.shipment.findMany({ 
    select: { 
      id: true, 
      status: true, 
      customerId: true, 
      createdById: true 
    } 
  });
  console.log(JSON.stringify(shipments, null, 2));

  const countByCustomer = await p.shipment.groupBy({
     by: ['customerId'],
     _count: true
  });
  console.log('Counts by customerId:', countByCustomer);

  const countByCreatedBy = await p.shipment.groupBy({
     by: ['createdById'],
     _count: true
  });
  console.log('Counts by createdById:', countByCreatedBy);
}

main().catch(console.error).finally(() => p.$disconnect());
