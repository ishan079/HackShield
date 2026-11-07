import 'dotenv/config'
import { defineConfig } from 'prisma/config'

const localDatabaseUrl = 'postgresql://hackshield:hackshield@localhost:5432/hackshield'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: { url: process.env.DATABASE_URL ?? localDatabaseUrl },
})
