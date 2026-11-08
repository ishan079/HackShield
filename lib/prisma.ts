import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

const DEFAULT_DEV_DATABASE_URL = 'postgres://hackshield:hackshield@localhost:5432/hackshield'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createPrismaClient(overrideConnectionString?: string): PrismaClient {
  const connectionString =
    overrideConnectionString ??
    process.env.DATABASE_URL_POOLED ??
    process.env.DATABASE_URL ??
    DEFAULT_DEV_DATABASE_URL

  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) })
}

export function getPrisma(connectionString?: string): PrismaClient {
  if (connectionString) {
    return createPrismaClient(connectionString)
  }
  const client = globalForPrisma.prisma ?? createPrismaClient()
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client
  return client
}
