import { describe, expect, it, vi } from 'vitest'
import {
  DuplicateRegistrationError,
  RegistrationClosedError,
  SprintNotFoundError,
} from '@/server/repositories/mini-sprint-repository'
import { PrismaMiniSprintRepository } from '@/server/repositories/prisma-mini-sprint-repository'

const validParticipant = {
  fullName: 'Test Student',
  rollNumber: 'UA2504AIH103',
  subject: 'BS CSDA' as const,
  semester: 3,
  mobileNumber: '9876543210',
}

function createDatabase() {
  return {
    miniSprint: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    miniSprintRegistration: {
      create: vi.fn(),
    },
  }
}

describe('PrismaMiniSprintRepository', () => {
  it('uses Prisma to normalize and persist a registration', async () => {
    const database = createDatabase()
    database.miniSprint.findUnique.mockResolvedValue({ registrationOpen: true })
    database.miniSprintRegistration.create.mockResolvedValue({
      id: 'e9a874fd-69f9-4bd8-aed7-e60ef1e966e0',
      sprintId: 'mini-14',
      ...validParticipant,
      email: 'Student@IITP.AC.IN',
      pwnUsername: 'student.pwn',
      status: 'CONFIRMED',
      registeredAt: new Date('2026-11-07T03:00:00.000Z'),
    })
    const repository = new PrismaMiniSprintRepository(database)

    await expect(
      repository.register('mini-14', {
        ...validParticipant,
        email: '  Student@IITP.AC.IN  ',
        pwnUsername: ' student.pwn ',
      })
    ).resolves.toMatchObject({
      sprintId: 'mini-14',
      email: 'Student@IITP.AC.IN',
      pwnUsername: 'student.pwn',
      status: 'CONFIRMED',
    })

    expect(database.miniSprintRegistration.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        sprintId: 'mini-14',
        ...validParticipant,
        email: 'Student@IITP.AC.IN',
        emailNormalized: 'student@iitp.ac.in',
        pwnUsername: 'student.pwn',
        pwnUsernameNormalized: 'student.pwn',
        status: 'CONFIRMED',
      }),
    })
  })

  it('keeps the registration error semantics when Prisma rejects a duplicate', async () => {
    const database = createDatabase()
    database.miniSprint.findUnique.mockResolvedValue({ registrationOpen: true })
    database.miniSprintRegistration.create.mockRejectedValue({ code: 'P2002' })
    const repository = new PrismaMiniSprintRepository(database)

    await expect(
      repository.register('mini-14', {
        ...validParticipant,
        email: 'student@iitp.ac.in',
        pwnUsername: 'student',
      })
    ).rejects.toBeInstanceOf(DuplicateRegistrationError)
  })

  it('rejects duplicate username entry to prevent dual registration details', async () => {
    const database = {
      ...createDatabase(),
      miniSprintRegistration: {
        findFirst: vi.fn().mockResolvedValue({
          sprintId: 'mini-14',
          pwnUsername: 'student',
          pwnUsernameNormalized: 'student',
          email: 'other@iitp.ac.in',
          emailNormalized: 'other@iitp.ac.in',
          mobileNumber: '9123456789',
        }),
        create: vi.fn(),
      },
    }
    database.miniSprint.findUnique.mockResolvedValue({ registrationOpen: true })
    const repository = new PrismaMiniSprintRepository(database)

    await expect(
      repository.register('mini-14', {
        ...validParticipant,
        email: 'student@iitp.ac.in',
        pwnUsername: 'student',
      })
    ).rejects.toMatchObject({
      message: expect.stringContaining('username is already registered'),
    })
  })

  it('rejects duplicate mobile number entry to prevent dual registration details', async () => {
    const database = {
      ...createDatabase(),
      miniSprintRegistration: {
        findFirst: vi.fn().mockResolvedValue({
          sprintId: 'mini-14',
          pwnUsername: 'otherstudent',
          pwnUsernameNormalized: 'otherstudent',
          email: 'other@iitp.ac.in',
          emailNormalized: 'other@iitp.ac.in',
          mobileNumber: '9876543210',
        }),
        create: vi.fn(),
      },
    }
    database.miniSprint.findUnique.mockResolvedValue({ registrationOpen: true })
    const repository = new PrismaMiniSprintRepository(database)

    await expect(
      repository.register('mini-14', {
        ...validParticipant,
        email: 'student@iitp.ac.in',
        pwnUsername: 'student',
        mobileNumber: '9876543210',
      })
    ).rejects.toMatchObject({
      message: expect.stringContaining('mobile number is already registered'),
    })
  })

  it('does not create a registration for a missing or closed sprint', async () => {
    const missing = createDatabase()
    missing.miniSprint.findUnique.mockResolvedValue(null)
    await expect(
      new PrismaMiniSprintRepository(missing).register('mini-404', {
        ...validParticipant,
        email: 'student@iitp.ac.in',
        pwnUsername: 'student',
      })
    ).rejects.toBeInstanceOf(SprintNotFoundError)

    const closed = createDatabase()
    closed.miniSprint.findUnique.mockResolvedValue({ registrationOpen: false })
    await expect(
      new PrismaMiniSprintRepository(closed).register('mini-14', {
        ...validParticipant,
        email: 'student@iitp.ac.in',
        pwnUsername: 'student',
      })
    ).rejects.toBeInstanceOf(RegistrationClosedError)
    expect(closed.miniSprintRegistration.create).not.toHaveBeenCalled()
  })
})
