import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
// @ts-ignore - this suppresses IDE cache issues with Prisma Client generation
import { PrismaClient } from '@prisma/client'

import "dotenv/config"
const connectionString = process.env.DATABASE_URL
if (connectionString) {
  console.log(`[PRISMA] Database connection URL found (length: ${connectionString.length})`);
} else {
  console.error("[PRISMA] CRITICAL: DATABASE_URL is missing from environment variables.");
}

const prismaClientSingleton = () => {
  if (!connectionString) {
    console.warn("[PRISMA] Initializing default client (no connection string). Build mode likely.");
    return new PrismaClient();
  }
  console.log("[PRISMA] Creating new PrismaClient instance with pool adapter...");
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool as any)
  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
