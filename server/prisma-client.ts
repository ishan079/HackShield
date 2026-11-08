import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/generated/prisma/client'

let prismaClient: PrismaClient | undefined

export function getPrismaClient(
  connectionString = process.env.DATABASE_URL || 'postgres://hackshield:hackshield@localhost:5432/hackshield'
): PrismaClient {
  if (!prismaClient) {
    prismaClient = new PrismaClient({ adapter: new PrismaPg({ connectionString }) })
  }

  return prismaClient
}
