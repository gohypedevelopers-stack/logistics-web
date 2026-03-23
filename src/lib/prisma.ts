import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
// @ts-ignore - this suppresses IDE cache issues with Prisma Client generation
import { PrismaClient } from '@prisma/client'

// Remove dotenv import to let Next.js handle environment variables natively
const connectionString = process.env.DATABASE_URL;

if (typeof window === "undefined") {
  if (connectionString) {
    console.log(`[PRISMA_INIT] Database connection URL present (length: ${connectionString.length}).`);
  } else {
    console.warn(`[PRISMA_INIT] CRITICAL: DATABASE_URL is not defined in environment variables.`);
  }
}

const prismaClientSingleton = () => {
  if (!connectionString) {
    console.warn("[PRISMA_SINGLETON] Initializing default client (missing DATABASE_URL). Only expected during static build.");
    return new PrismaClient();
  }
  
  console.log("[PRISMA_SINGLETON] Establishing new database connection pool...");
  const pool = new Pool({ 
    connectionString,
    connectionTimeoutMillis: 5000, // Fail fast if connection cannot be established
  });
  
  const adapter = new PrismaPg(pool as any);
  return new PrismaClient({ adapter });
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
