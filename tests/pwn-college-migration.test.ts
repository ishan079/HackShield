import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

describe('pwn.college cache migration', () => {
  it('is additive and creates only the collector cache tables', async () => {
    const sql = await readFile(
      resolve(process.cwd(), 'prisma/migrations/20261109103000_add_pwn_college_cache/migration.sql'),
      'utf8'
    )

    expect(sql).toContain('CREATE TABLE IF NOT EXISTS "pwn_college_hackers"')
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS "pwn_college_scoreboard_entries"')
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS "pwn_college_solves"')
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS "pwn_college_sync_jobs"')
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS "pwn_college_sync_locks"')
    expect(sql).not.toMatch(/\bDROP\s+(TABLE|INDEX|CONSTRAINT)\b|\bDELETE\s+FROM\b|\bTRUNCATE\b/i)
    expect(sql).not.toMatch(/ALTER\s+TABLE\s+"?mini_/i)
  })

  it('removes only known test cache data and solves before the Mini CTF start', async () => {
    const sql = await readFile(
      resolve(process.cwd(), 'prisma/migrations/20261110090000_filter_pwn_college_test_and_pre_event_data/migration.sql'),
      'utf8'
    )

    expect(sql).toContain("'fkcon', 'weowshaapsd', 'thisthingexists'")
    expect(sql).toContain("TIMESTAMPTZ '2026-11-10 06:30:00+00'")
    expect(sql).not.toMatch(/mini_sprint_registrations/i)
    expect(sql).not.toMatch(/\bTRUNCATE\b|\bDROP\b/i)
  })
})
