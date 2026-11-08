import 'dotenv/config'
import { defineConfig } from 'prisma/config'

const databaseUrl =
  process.env.DATABASE_URL ||
  process.env.DATABASE_URL_POOLED ||
  'postgresql://hackshield:hackshield@localhost:5432/hackshield'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: databaseUrl },
})

