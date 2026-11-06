import { createApp } from '@/server/app'
import { createDatabase, runMigrations } from '@/server/database'
import { loadConfig } from '@/server/config'

async function start(): Promise<void> {
  const config = loadConfig()
  const database = createDatabase(config.DATABASE_URL)
  await runMigrations(database)

  const app = createApp({ database })
  const shutdown = async () => {
    await app.close()
    await database.end()
  }

  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)

  await app.listen({ host: config.HOST, port: config.PORT })
}

start().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
