import 'dotenv/config'
import { z } from 'zod'

const configSchema = z.object({
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  DATABASE_URL: z
    .string()
    .min(1)
    .default('postgres://hackshield:hackshield@localhost:5432/hackshield'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
})

export type ServerConfig = z.infer<typeof configSchema>

export function loadConfig(environment = process.env): ServerConfig {
  const config = configSchema.parse(environment)
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = config.DATABASE_URL
  }
  return config
}
