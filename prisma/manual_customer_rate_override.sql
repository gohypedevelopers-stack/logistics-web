CREATE TABLE IF NOT EXISTS "CustomerRateOverride" (
  "id" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "rateCardId" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CustomerRateOverride_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CustomerRateOverride_customerId_fkey"
    FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "CustomerRateOverride_rateCardId_fkey"
    FOREIGN KEY ("rateCardId") REFERENCES "RateCard"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "CustomerRateOverride_customerId_rateCardId_key"
  ON "CustomerRateOverride"("customerId", "rateCardId");

CREATE INDEX IF NOT EXISTS "CustomerRateOverride_customerId_idx"
  ON "CustomerRateOverride"("customerId");

CREATE INDEX IF NOT EXISTS "CustomerRateOverride_rateCardId_idx"
  ON "CustomerRateOverride"("rateCardId");

CREATE TABLE IF NOT EXISTS "CustomerWarehouseRateOverride" (
  "id" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "warehouseId" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CustomerWarehouseRateOverride_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CustomerWarehouseRateOverride_customerId_fkey"
    FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id")
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "CustomerWarehouseRateOverride_warehouseId_fkey"
    FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "CustomerWarehouseRateOverride_customerId_warehouseId_key"
  ON "CustomerWarehouseRateOverride"("customerId", "warehouseId");

CREATE INDEX IF NOT EXISTS "CustomerWarehouseRateOverride_customerId_idx"
  ON "CustomerWarehouseRateOverride"("customerId");

CREATE INDEX IF NOT EXISTS "CustomerWarehouseRateOverride_warehouseId_idx"
  ON "CustomerWarehouseRateOverride"("warehouseId");
