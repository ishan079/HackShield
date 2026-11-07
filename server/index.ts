import { createApp } from '@/server/app'
import { getPrisma } from '@/lib/prisma'
import { loadConfig } from '@/server/config'
import { MiniSprintRepository } from '@/server/repositories/mini-sprint-repository'

async function start(): Promise<void> {
  const config = loadConfig()
  const database = getPrisma()
  const app = createApp({ repository: new MiniSprintRepository(database) })
  const shutdown = async () => {
    await app.close()
    await database.$disconnect()
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)

  await app.listen({ host: config.HOST, port: config.PORT })
}

start().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
