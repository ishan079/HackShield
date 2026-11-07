import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

let prismaClient: PrismaClient | undefined

export function getPrismaClient(connectionString = process.env.DATABASE_URL): PrismaClient {
  if (!connectionString) throw new Error('DATABASE_URL is required for Prisma PostgreSQL access.')

  if (!prismaClient) {
    prismaClient = new PrismaClient({ adapter: new PrismaPg({ connectionString }) })
  }

  return prismaClient
}
