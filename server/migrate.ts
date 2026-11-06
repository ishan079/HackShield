import { createDatabase, runMigrations } from '@/server/database'
import { loadConfig } from '@/server/config'

async function migrate(): Promise<void> {
  const config = loadConfig()
  const database = createDatabase(config.DATABASE_URL)
  try {
    await runMigrations(database)
  } finally {
    await database.end()
  }
}

migrate().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
