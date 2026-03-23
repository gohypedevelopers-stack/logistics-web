import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
// @ts-ignore - this suppresses IDE cache issues with Prisma Client generation
import { PrismaClient } from '@prisma/client'

import "dotenv/config"
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error("DATABASE_URL is not set")
}

const prismaClientSingleton = () => {
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
