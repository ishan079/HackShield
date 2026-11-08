import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import type { Prisma } from '@/generated/prisma/client'

const schemaPath = resolve(process.cwd(), 'prisma/schema.prisma')
const migrationPath = resolve(
  process.cwd(),
  'prisma/migrations/20261109090000_add_pwn_username_normalized/migration.sql'
)

describe('Prisma mini-sprint registration schema', () => {
  it('allows the normalized pwn.college username written by the registration repository', () => {
    const registration = {
      id: '00000000-0000-0000-0000-000000000000',
      sprint: { connect: { id: 'mini-14' } },
      fullName: 'Test User',
      rollNumber: 'TEST123',
      subject: 'BS-MS AICS',
      semester: 1,
      mobileNumber: '9000000000',
      email: 'test@iitp.ac.in',
      emailNormalized: 'test@iitp.ac.in',
      pwnUsername: 'test.user',
      pwnUsernameNormalized: 'test.user',
      status: 'CONFIRMED',
    } satisfies Prisma.MiniSprintRegistrationCreateInput

    expect(registration.pwnUsernameNormalized).toBe('test.user')
  })

  it('contains a non-destructive migration that backfills existing registrations', () => {
    const schema = readFileSync(schemaPath, 'utf8')
    const migration = readFileSync(migrationPath, 'utf8')

    expect(schema).toContain('pwnUsernameNormalized')
    expect(migration).toContain('ADD COLUMN IF NOT EXISTS "pwn_username_normalized"')
    expect(migration).toContain('SET "pwn_username_normalized" = lower(btrim("pwn_username"))')
    expect(migration).toContain('SET NOT NULL')
  })
})
