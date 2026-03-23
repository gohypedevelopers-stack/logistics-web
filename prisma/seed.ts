import { PrismaClient, Role, ShipmentStatus, PaymentStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding the database...');

  // Hash common password for seed users
  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Create Roles: Creator, Admin, Manager, Operations Manager, Accountant
  const staffRoles = [
    { email: 'creator@example.com', name: 'Creator User', role: Role.CREATOR },
    { email: 'admin@example.com', name: 'Admin User', role: Role.ADMIN },
    { email: 'manager@example.com', name: 'Manager User', role: Role.MANAGER },
    { email: 'ops@example.com', name: 'Operations User', role: Role.OPERATIONS_MANAGER },
    { email: 'accountant@example.com', name: 'Accountant User', role: Role.ACCOUNTANT },
  ];

  for (const staff of staffRoles) {
    await prisma.user.upsert({
      where: { email: staff.email },
      update: {
        passwordHash,
        name: staff.name,
        role: staff.role,
      },
      create: {
        email: staff.email,
        name: staff.name,
        passwordHash,
        role: staff.role,
        staffProfile: {
          create: {
            department: staff.role.toString(),
            position: 'Staff',
          },
        },
      },
    });
  }

  // 2. Create Customer
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {
      passwordHash,
      name: 'Customer Demo',
      role: Role.CUSTOMER,
    },
    create: {
      email: 'customer@example.com',
      name: 'Customer Demo',
      passwordHash,
      role: Role.CUSTOMER,
      customerProfile: {
        create: {
          companyName: 'Demo Corp',
          phone: '+1 555-0100',
        },
      },
    },
  });

  const customerProfile = await prisma.customerProfile.findUnique({
    where: { userId: customer.id },
  });

  if (!customerProfile) throw new Error("Customer profile not created");

  // 3. Create Countries and Routes
  const countryUK = await prisma.country.upsert({
    where: { code: 'GB' },
    update: {},
    create: { code: 'GB', name: 'United Kingdom' },
  });

  const countryUSA = await prisma.country.upsert({
    where: { code: 'US' },
    update: {},
    create: { code: 'US', name: 'United States' },
  });

  const countryIndia = await prisma.country.upsert({
    where: { code: 'IN' },
    update: {},
    create: { code: 'IN', name: 'India' },
  });

  const routeUKtoIN = await prisma.route.create({
    data: {
      originCountryId: countryUK.id,
      destinationCountryId: countryIndia.id,
    },
  });

  const routeUStoIN = await prisma.route.create({
    data: {
      originCountryId: countryUSA.id,
      destinationCountryId: countryIndia.id,
    },
  });

  // 4. Create Logistics Companies
  const companies = ['DHL', 'FedEx', 'UPS', 'Aramex', 'BlueDart'];
  const logCompanies = [];
  for (const name of companies) {
    const comp = await prisma.logisticsCompany.upsert({
      where: { name },
      update: {},
      create: { name, description: `Global Logistics - ${name}` },
    });
    logCompanies.push(comp);
  }

  // 5. Create Rate Cards
  await prisma.rateCard.create({
    data: {
      routeId: routeUKtoIN.id,
      weightMin: 0.1,
      weightMax: 2.0,
      basePrice: 15.0,
      currency: 'GBP',
    },
  });

  await prisma.rateCard.create({
    data: {
      routeId: routeUStoIN.id,
      weightMin: 0.1,
      weightMax: 5.0,
      basePrice: 35.0,
      currency: 'USD',
    },
  });

  // 6. Create Addresses
  const pickupAddress = await prisma.address.create({
    data: {
      customerProfileId: customerProfile.id,
      label: 'Main Office US',
      name: 'John Doe',
      street1: '123 Main St',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      countryId: countryUSA.id,
    },
  });

  const receiverAddress = await prisma.address.create({
    data: {
      customerProfileId: customerProfile.id,
      label: 'India Receiver',
      name: 'Raj Patil',
      street1: '456 MG Road',
      city: 'Delhi',
      postalCode: '110001',
      countryId: countryIndia.id,
    },
  });

  // 7. Create Shipments
  // Use a more unique tracking ID and AWB for seeding or delete existing to ensure clean seed
  const shipment = await prisma.shipment.upsert({
    where: { trackingId: 'TRK-SEED-1001' },
    update: {
      awb: 'AWB-SEED-5001',
      status: ShipmentStatus.IN_TRANSIT,
    },
    create: {
      trackingId: 'TRK-SEED-1001',
      awb: 'AWB-SEED-5001',
      customerId: customerProfile.id,
      logisticsCompanyId: logCompanies[0].id, // DHL
      routeId: routeUStoIN.id,
      pickupAddressId: pickupAddress.id,
      receiverAddressId: receiverAddress.id,
      weight: 2.5,
      content: 'Electronics Demo',
      amount: 120.0,
      paymentStatus: PaymentStatus.PAID,
      status: ShipmentStatus.IN_TRANSIT,
      expectedArrivalDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    },
  });

  // 8. Create Shipment History & Events
  const historyCount = await prisma.shipmentStatusHistory.count({
    where: { shipmentId: shipment.id }
  });

  if (historyCount === 0) {
    await prisma.shipmentStatusHistory.create({
      data: {
        shipmentId: shipment.id,
        status: ShipmentStatus.SUBMITTED,
        location: 'New York, US',
        notes: 'Shipment scheduled online.',
      },
    });

    await prisma.shipmentEvent.create({
      data: {
        shipmentId: shipment.id,
        title: 'Package Created',
        description: 'Customer created shipment in dashboard.',
      },
    });
  }

  // 9. Create Invoice
  await prisma.invoice.upsert({
    where: { invoiceNumber: 'INV-1001' },
    update: {},
    create: {
      invoiceNumber: 'INV-1001',
      shipmentId: shipment.id,
      customerId: customerProfile.id,
      amount: 120.0,
      dueDate: new Date(),
      status: PaymentStatus.PAID,
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
