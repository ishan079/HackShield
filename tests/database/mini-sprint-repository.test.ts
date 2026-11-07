import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { runMigrations } from '@/server/database'
import {
  DuplicateRegistrationError,
  MiniSprintRepository,
} from '@/server/repositories/mini-sprint-repository'

const pgMem = await import('pg-mem').catch(() => null)
const DataType = pgMem?.DataType
const newDb = pgMem?.newDb

const validParticipant = {
  fullName: 'Ishan Kumar',
  rollNumber: 'UA2504AIH103',
  subject: 'BS AICS' as const,
  semester: 3,
  mobileNumber: '9876543210',
}

describe.skipIf(!pgMem)('MiniSprintRepository database boundary', () => {
  let pool: any
  let repository: MiniSprintRepository

  beforeEach(async () => {
    const memory = newDb({ autoCreateForeignKeyIndices: true })
    memory.public.registerFunction({
      name: 'now',
      returns: DataType.timestamptz,
      implementation: () => new Date('2026-11-07T03:00:00.000Z'),
    })
    const adapter = memory.adapters.createPg()
    pool = new adapter.Pool() as Pool
    await runMigrations(pool)
    repository = new MiniSprintRepository(pool)
  })

  afterEach(async () => {
    await pool.end()
  })

  it('loads the seeded sprint directly from the migrated database', async () => {
    await expect(repository.list()).resolves.toEqual([
      expect.objectContaining({
        id: 'mini-14',
        registrationOpen: true,
        status: 'REGISTRATION_OPEN',
      }),
    ])
  })

  it('normalizes and persists a registration without the HTTP layer', async () => {
    const registration = await repository.register('mini-14', {
      ...validParticipant,
      email: '  Ishan_UA2504AIH103@IITP.AC.IN  ',
      pwnUsername: 'Ishan079',
    })

    expect(registration).toMatchObject({
      sprintId: 'mini-14',
      ...validParticipant,
      email: 'Ishan_UA2504AIH103@IITP.AC.IN',
      pwnUsername: 'Ishan079',
      status: 'CONFIRMED',
    })

    const persisted = await pool.query(
      `SELECT full_name, roll_number, subject, semester, mobile_number,
              email_normalized, pwn_username, status
         FROM mini_sprint_registrations`
    )
    expect(persisted.rows).toEqual([
      {
        full_name: 'Ishan Kumar',
        roll_number: 'UA2504AIH103',
        subject: 'BS AICS',
        semester: 3,
        mobile_number: '9876543210',
        email_normalized: 'ishan_ua2504aih103@iitp.ac.in',
        pwn_username: 'Ishan079',
        status: 'CONFIRMED',
      },
    ])
  })

  it('maps the database uniqueness constraint to a domain error', async () => {
    await repository.register('mini-14', {
      ...validParticipant,
      email: 'ishan_ua2504aih103@iitp.ac.in',
      pwnUsername: 'Ishan079',
    })

    await expect(
      repository.register('mini-14', {
        ...validParticipant,
        email: 'ISHAN_UA2504AIH103@IITP.AC.IN',
        pwnUsername: 'another-user',
      })
    ).rejects.toBeInstanceOf(DuplicateRegistrationError)
  })
})
