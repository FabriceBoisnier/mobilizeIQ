import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Seeding EcoFleet demo data...");

  // --- Organization ---
  const org = await prisma.organization.create({
    data: {
      name: "EcoFleet Demo",
    },
  });

  // --- Users ---
  await prisma.user.createMany({
    data: [
      {
        orgId: org.id,
        email: "admin@ecofleet.dev",
        passwordHash: "hashedpassword1",
        role: "ADMIN",
        firstName: "Alice",
        lastName: "Admin",
        phone: "+33123456789",
      },
      {
        orgId: org.id,
        email: "manager@ecofleet.dev",
        passwordHash: "hashedpassword2",
        role: "MANAGER",
        firstName: "Bob",
        lastName: "Manager",
        phone: "+33611223344",
      },
      {
        orgId: org.id,
        email: "user@ecofleet.dev",
        passwordHash: "hashedpassword3",
        role: "USER",
        firstName: "Charlie",
        lastName: "User",
        phone: "+33799887766",
      },
    ],
    skipDuplicates: true,
  });

  // --- Vehicle types ---
  const truck = await prisma.vehicleType.create({
    data: { label: "Truck 12T", category: "Heavy" },
  });
  const van = await prisma.vehicleType.create({
    data: { label: "Van", category: "Light" },
  });

  // --- Vehicles ---
  const vehicles = await prisma.vehicle.createManyAndReturn({
    data: [
      {
        orgId: org.id,
        typeId: truck.id,
        registration: "AA-123-AA",
        vin: "VIN000001",
        brand: "Volvo",
        model: "FH",
        energy: "Diesel",
        euroStandard: "Euro VI",
        firstRegDate: new Date("2019-01-10"),
        capacityTons: 12,
        status: "ACTIVE",
      },
      {
        orgId: org.id,
        typeId: van.id,
        registration: "BB-456-BB",
        vin: "VIN000002",
        brand: "Renault",
        model: "Master",
        energy: "Diesel",
        euroStandard: "Euro VI",
        firstRegDate: new Date("2021-05-20"),
        capacityTons: 3.5,
        status: "ACTIVE",
      },
      {
        orgId: org.id,
        typeId: van.id,
        registration: "CC-789-CC",
        vin: "VIN000003",
        brand: "Mercedes",
        model: "Sprinter",
        energy: "Electric",
        euroStandard: "Zero Emission",
        firstRegDate: new Date("2023-06-15"),
        capacityTons: 3.5,
        status: "ACTIVE",
      },
      {
        orgId: org.id,
        typeId: truck.id,
        registration: "DD-147-DD",
        vin: "VIN000004",
        brand: "Scania",
        model: "R500",
        energy: "Diesel",
        euroStandard: "Euro VI",
        firstRegDate: new Date("2018-03-12"),
        capacityTons: 16,
        status: "INACTIVE",
      },
      {
        orgId: org.id,
        typeId: truck.id,
        registration: "EE-258-EE",
        vin: "VIN000005",
        brand: "DAF",
        model: "XF",
        energy: "Diesel",
        euroStandard: "Euro V",
        firstRegDate: new Date("2016-09-30"),
        capacityTons: 18,
        status: "ACTIVE",
      },
    ],
  });

  // --- Fuel logs ---
  for (const v of vehicles) {
    await prisma.fuelLog.create({
      data: {
        vehicleId: v.id,
        volumeL: 50 + Math.random() * 50,
        priceTotalEur: 80 + Math.random() * 30,
        supplier: "Total",
        filledAt: new Date(),
        odoKm: 10000 + Math.floor(Math.random() * 1000),
      },
    });
  }

  // --- Odometer logs ---
  for (const v of vehicles) {
    await prisma.odometerLog.create({
      data: {
        vehicleId: v.id,
        readingKm: 10000 + Math.floor(Math.random() * 1000),
        readAt: new Date(),
      },
    });
  }

  // --- Vehicle document ---
  await prisma.vehicleDocument.create({
    data: {
      vehicleId: vehicles[0].id,
      kind: "Insurance",
      fileUrl: "https://example.com/insurance.pdf",
      issuedAt: new Date("2024-01-01"),
      expiresAt: new Date("2025-01-01"),
    },
  });

  // --- Vehicle alert ---
  await prisma.vehicleAlert.create({
    data: {
      vehicleId: vehicles[1].id,
      kind: "Maintenance due",
      severity: "HIGH",
      dueAt: new Date("2025-02-01"),
      resolvedAt: null,
    },
  });

  // --- Maintenance order ---
  await prisma.maintenanceOrder.create({
    data: {
      vehicleId: vehicles[2].id,
      title: "Brake replacement",
      description: "Replace worn front brakes",
      status: "OPEN",
      openedAt: new Date(),
      costEur: null,
    },
  });

  // --- Emission factor ---
  const factor = await prisma.emissionFactor.create({
    data: {
      energy: "Diesel",
      unit: "L",
      factorValue: 2.64,
      source: "ADEME",
      version: "2024",
    },
  });

  // --- Emission entry ---
  await prisma.emissionEntry.create({
    data: {
      orgId: org.id,
      vehicleId: vehicles[0].id,
      periodStart: new Date("2025-01-01"),
      periodEnd: new Date("2025-01-31"),
      fuelL: 250,
      distanceKm: 1800,
      kwh: null,
      co2Kg: 250 * factor.factorValue,
    },
  });

  // --- Emission report ---
  await prisma.emissionReport.create({
    data: {
      orgId: org.id,
      label: "January 2025 Report",
      periodStart: new Date("2025-01-01"),
      periodEnd: new Date("2025-01-31"),
      totalsJson: JSON.stringify({ co2Kg: 660 }),
      pdfUrl: "https://example.com/report-jan2025.pdf",
    },
  });

  // --- Subscription ---
  await prisma.subscription.create({
    data: {
      orgId: org.id,
      plan: "PRO",
      vehiclesQuota: 50,
      unitPriceEur: 199.0,
      status: "ACTIVE",
    },
  });

  // --- Invoice ---
  await prisma.invoice.create({
    data: {
      orgId: org.id,
      amountEur: 199.0,
      periodStart: new Date("2025-01-01"),
      periodEnd: new Date("2025-01-31"),
      pdfUrl: "https://example.com/invoice-jan2025.pdf",
    },
  });

  // --- Site ---
  await prisma.site.create({
    data: {
      orgId: org.id,
      name: "Paris HQ",
      address: "10 rue de Rivoli, 75001 Paris",
    },
  });

  console.log("✅ Seeding done.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
