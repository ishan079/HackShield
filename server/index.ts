import { createApp } from '@/server/app'
import { loadConfig } from '@/server/config'
import { getPrismaClient } from '@/server/prisma-client'
import { PrismaMiniSprintRepository } from '@/server/repositories/prisma-mini-sprint-repository'

async function start(): Promise<void> {
  const config = loadConfig()
  const prisma = getPrismaClient(config.DATABASE_URL)

  const app = createApp({ repository: new PrismaMiniSprintRepository(prisma) })
  const shutdown = async () => {
    await app.close()
    await prisma.$disconnect()
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)

  await app.listen({ host: config.HOST, port: config.PORT })
}

start().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
