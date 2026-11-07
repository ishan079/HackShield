import { describe, expect, it } from 'vitest'
import { createFakePrisma } from '@/tests/helpers/fake-prisma'
import {
  DuplicateRegistrationError,
  MiniSprintRepository,
} from '@/server/repositories/mini-sprint-repository'

const validParticipant = {
  fullName: 'Ishan Kumar',
  rollNumber: 'UA2504AIH103',
  subject: 'BS AICS' as const,
  semester: 3,
  mobileNumber: '9876543210',
}

describe('MiniSprintRepository Prisma boundary', () => {
  it('loads the seeded sprint using Prisma DTO mapping', async () => {
    const { client } = createFakePrisma()
    await expect(new MiniSprintRepository(client).list()).resolves.toEqual([
      expect.objectContaining({
        id: 'mini-14', registrationOpen: true, status: 'REGISTRATION_OPEN',
      }),
    ])
  })

  it('normalizes and persists a registration', async () => {
    const { client, registrations } = createFakePrisma()
    const repository = new MiniSprintRepository(client)
    const registration = await repository.register('mini-14', {
      ...validParticipant,
      email: '  Ishan_UA2504AIH103@IITP.AC.IN  ', pwnUsername: 'Ishan079',
    })
    expect(registration).toMatchObject({
      sprintId: 'mini-14', email: 'Ishan_UA2504AIH103@IITP.AC.IN',
      ...validParticipant,
      pwnUsername: 'Ishan079', status: 'CONFIRMED',
    })
    expect(registrations).toEqual([
      expect.objectContaining({
        ...validParticipant,
        emailNormalized: 'ishan_ua2504aih103@iitp.ac.in',
        pwnUsernameNormalized: 'ishan079',
      }),
    ])
  })

  it('maps Prisma uniqueness failures to a domain error', async () => {
    const { client } = createFakePrisma()
    const repository = new MiniSprintRepository(client)
    await repository.register('mini-14', {
      ...validParticipant,
      email: 'ishan_ua2504aih103@iitp.ac.in', pwnUsername: 'Ishan079',
    })
    await expect(repository.register('mini-14', {
      ...validParticipant,
      email: 'ISHAN_UA2504AIH103@IITP.AC.IN', pwnUsername: 'another-user',
    })).rejects.toBeInstanceOf(DuplicateRegistrationError)
  })
})
