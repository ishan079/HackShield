import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('Mini CTF closure migration', () => {
  it('closes only mini-14 registrations and extends the event through 14 November at noon IST', async () => {
    const sql = await readFile(
      resolve(process.cwd(), 'prisma/migrations/20261113060000_close_mini_ctf_registration/migration.sql'),
      'utf8'
    )

    expect(sql).toContain('"registration_open" = FALSE')
    expect(sql).toContain("\"status\" = 'REGISTRATION_CLOSED'")
    expect(sql).toContain("TIMESTAMPTZ '2026-11-14 06:30:00+00'")
    expect(sql).toContain('"duration_minutes" = 5760')
    expect(sql).toContain("WHERE \"id\" = 'mini-14'")
    expect(sql).not.toMatch(/mini_sprint_registrations|\bDELETE\b|\bTRUNCATE\b|\bDROP\b/i)
  })
})
