import { randomUUID } from 'node:crypto'
import type {
  MiniCtfSubject,
  MiniSprintDto,
  MiniSprintRegistrationDto,
  MiniSprintRegistrationRequest,
} from '@/types/api'
import {
  DuplicateRegistrationError,
  RegistrationClosedError,
  SprintNotFoundError,
} from './mini-sprint-repository'
import type { MiniSprintRegistrationStore } from './mini-sprint-store'

interface PrismaMiniSprintRow {
  id: string
  title: string
  status: string
  statusColor: string
  startsAt: Date
  endsAt: Date
  durationMinutes: number
  challengeCount: number
  difficulty: string
  format: string
  reward: string
  description: string
  registrationOpen: boolean
}

interface PrismaRegistrationRow {
  id: string
  sprintId: string
  fullName: string | null
  rollNumber: string | null
  subject: string | null
  semester: number | null
  mobileNumber: string | null
  email: string
  pwnUsername: string
  pwnUsernameNormalized: string
  status: string
  registeredAt: Date
}

interface PrismaRegistrationDatabase {
  miniSprint: {
    findMany(args: unknown): Promise<PrismaMiniSprintRow[]>
    findUnique(args: unknown): Promise<Pick<PrismaMiniSprintRow, 'registrationOpen'> | null>
  }
  miniSprintRegistration: {
    findFirst?(args: unknown): Promise<PrismaRegistrationRow | null>
    create(args: unknown): Promise<PrismaRegistrationRow>
  }
}

function toDto(row: PrismaMiniSprintRow): MiniSprintDto {
  return {
    id: row.id,
    title: row.title,
    status: row.status as MiniSprintDto['status'],
    statusColor: row.statusColor,
    startsAt: row.startsAt.toISOString(),
    endsAt: row.endsAt.toISOString(),
    durationMinutes: row.durationMinutes,
    challengeCount: row.challengeCount,
    difficulty: row.difficulty as MiniSprintDto['difficulty'],
    format: row.format as MiniSprintDto['format'],
    reward: row.reward,
    description: row.description,
    registrationOpen: row.registrationOpen,
  }
}

export class PrismaMiniSprintRepository implements MiniSprintRegistrationStore {
  constructor(private readonly database: PrismaRegistrationDatabase) {}

  async list(): Promise<MiniSprintDto[]> {
    const sprints = await this.database.miniSprint.findMany({ orderBy: { startsAt: 'asc' } })
    return sprints.map(toDto)
  }

  async register(
    sprintId: string,
    input: MiniSprintRegistrationRequest
  ): Promise<MiniSprintRegistrationDto> {
    const sprint = await this.database.miniSprint.findUnique({
      where: { id: sprintId },
      select: { registrationOpen: true },
    })

    if (!sprint) throw new SprintNotFoundError()
    if (!sprint.registrationOpen) throw new RegistrationClosedError()

    const emailNormalized = input.email.trim().toLowerCase()
    const pwnUsernameTrimmed = input.pwnUsername.trim()
    const pwnUsernameNormalized = pwnUsernameTrimmed.toLowerCase()
    const mobileNumberTrimmed = input.mobileNumber.trim()

    if (this.database.miniSprintRegistration.findFirst) {
      const existing = await this.database.miniSprintRegistration.findFirst({
        where: {
          sprintId,
          OR: [
            { emailNormalized },
            { pwnUsernameNormalized },
            { mobileNumber: mobileNumberTrimmed },
          ],
        },
      })

      if (existing) {
        const row = existing as unknown as Record<string, unknown>
        if (
          row.pwnUsernameNormalized === pwnUsernameNormalized ||
          (typeof row.pwnUsername === 'string' &&
            row.pwnUsername.trim().toLowerCase() === pwnUsernameNormalized)
        ) {
          throw new DuplicateRegistrationError(
            'username',
            'This username is already registered. Dual registration details are not allowed.'
          )
        }
        if (
          typeof row.mobileNumber === 'string' &&
          row.mobileNumber.trim() === mobileNumberTrimmed
        ) {
          throw new DuplicateRegistrationError(
            'mobileNumber',
            'This mobile number is already registered. Dual registration details are not allowed.'
          )
        }
        if (
          row.emailNormalized === emailNormalized ||
          (typeof row.email === 'string' &&
            row.email.trim().toLowerCase() === emailNormalized)
        ) {
          throw new DuplicateRegistrationError(
            'email',
            'This email address is already registered.'
          )
        }
        throw new DuplicateRegistrationError('email', 'This participant is already registered.')
      }
    }

    try {
      const row = await this.database.miniSprintRegistration.create({
        data: {
          id: randomUUID(),
          sprintId,
          fullName: input.fullName.trim(),
          rollNumber: input.rollNumber.trim(),
          subject: input.subject,
          semester: input.semester,
          mobileNumber: mobileNumberTrimmed,
          email: input.email.trim(),
          emailNormalized,
          pwnUsername: pwnUsernameTrimmed,
          pwnUsernameNormalized,
          status: 'CONFIRMED',
        },
      })

      if (
        row.fullName === null ||
        row.rollNumber === null ||
        row.subject === null ||
        row.semester === null ||
        row.mobileNumber === null
      ) {
        throw new Error('Registration participant details were not persisted.')
      }

      return {
        registrationId: row.id,
        sprintId: row.sprintId,
        fullName: row.fullName,
        rollNumber: row.rollNumber,
        subject: row.subject as MiniCtfSubject,
        semester: row.semester,
        mobileNumber: row.mobileNumber,
        email: row.email,
        pwnUsername: row.pwnUsername,
        status: row.status as MiniSprintRegistrationDto['status'],
        arenaUrl: null,
        registeredAt: row.registeredAt.toISOString(),
      }
    } catch (error) {
      if (error instanceof DuplicateRegistrationError) {
        throw error
      }
      if ((error as { code?: string }).code === 'P2002') {
        const target = (error as { meta?: { target?: unknown } }).meta?.target
        if (Array.isArray(target)) {
          if (target.some((t: string) => t.includes('username') || t.includes('pwn'))) {
            throw new DuplicateRegistrationError(
              'username',
              'This username is already registered. Dual registration details are not allowed.'
            )
          }
          if (target.some((t: string) => t.includes('mobile'))) {
            throw new DuplicateRegistrationError(
              'mobileNumber',
              'This mobile number is already registered. Dual registration details are not allowed.'
            )
          }
          if (target.some((t: string) => t.includes('email'))) {
            throw new DuplicateRegistrationError(
              'email',
              'This email address is already registered.'
            )
          }
        }
        throw new DuplicateRegistrationError('email', 'This participant is already registered.')
      }
      throw error
    }
  }
}
