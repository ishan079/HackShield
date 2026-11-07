import { randomUUID } from 'node:crypto'
import type { Database } from '@/server/database'
import type {
  MiniCtfSubject,
  MiniSprintDto,
  MiniSprintRegistrationDto,
  MiniSprintRegistrationRequest,
} from '@/types/api'
import type { MiniSprintRegistrationStore } from './mini-sprint-store'
import { PrismaMiniSprintRepository } from './prisma-mini-sprint-repository'

interface MiniSprintRow {
  id: string
  title: string
  status: MiniSprintDto['status']
  status_color: string
  starts_at: Date
  ends_at: Date
  duration_minutes: number
  challenge_count: number
  difficulty: MiniSprintDto['difficulty']
  format: MiniSprintDto['format']
  reward: string
  description: string
  registration_open: boolean
}

interface RegistrationRow {
  id: string
  sprint_id: string
  full_name: string
  roll_number: string
  subject: string
  semester: number
  mobile_number: string
  email: string
  pwn_username: string
  status: MiniSprintRegistrationDto['status']
  registered_at: Date
}

export class DuplicateRegistrationError extends Error {
  constructor(
    public readonly field?: 'email' | 'username' | 'mobileNumber',
    message?: string
  ) {
    super(
      message ||
        (field === 'username'
          ? 'This username is already registered. Dual registration details are not allowed.'
          : field === 'mobileNumber'
          ? 'This mobile number is already registered. Dual registration details are not allowed.'
          : 'This participant is already registered.')
    )
    this.name = 'DuplicateRegistrationError'
  }
}
export class SprintNotFoundError extends Error {}
export class RegistrationClosedError extends Error {}

function toIso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString()
}

function mapSprint(row: MiniSprintRow): MiniSprintDto {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    statusColor: row.status_color,
    startsAt: toIso(row.starts_at),
    endsAt: toIso(row.ends_at),
    durationMinutes: row.duration_minutes,
    challengeCount: row.challenge_count,
    difficulty: row.difficulty,
    format: row.format,
    reward: row.reward,
    description: row.description,
    registrationOpen: row.registration_open,
  }
}

export type RepositoryDatabase = Database | Record<string, any>

export class MiniSprintRepository implements MiniSprintRegistrationStore {
  private readonly prismaRepo?: PrismaMiniSprintRepository
  private readonly rawDatabase?: Database

  constructor(database: RepositoryDatabase) {
    if (database && 'miniSprint' in database) {
      this.prismaRepo = new PrismaMiniSprintRepository(database as any)
    } else {
      this.rawDatabase = database as Database
    }
  }

  async list(): Promise<MiniSprintDto[]> {
    if (this.prismaRepo) {
      return this.prismaRepo.list()
    }
    const result = await this.rawDatabase!.query<MiniSprintRow>(
      `SELECT id, title, status, status_color, starts_at, ends_at,
              duration_minutes, challenge_count, difficulty, format,
              reward, description, registration_open
         FROM mini_sprints
        ORDER BY starts_at ASC`
    )
    return result.rows.map(mapSprint)
  }

  async register(
    sprintId: string,
    input: MiniSprintRegistrationRequest
  ): Promise<MiniSprintRegistrationDto> {
    if (this.prismaRepo) {
      return this.prismaRepo.register(sprintId, input)
    }
    const sprint = await this.rawDatabase!.query<Pick<MiniSprintRow, 'registration_open'>>(
      'SELECT registration_open FROM mini_sprints WHERE id = $1',
      [sprintId]
    )

    if (!sprint.rowCount) throw new SprintNotFoundError()
    if (!sprint.rows[0].registration_open) throw new RegistrationClosedError()

    const emailNormalized = input.email.trim().toLowerCase()
    const pwnUsernameNormalized = input.pwnUsername.trim().toLowerCase()
    const mobileNumberTrimmed = input.mobileNumber.trim()

    // Dual details check for email, username, and mobile number
    const existing = await this.rawDatabase!.query<RegistrationRow & { email_normalized?: string }>(
      `SELECT email, email_normalized, pwn_username, mobile_number
         FROM mini_sprint_registrations
        WHERE sprint_id = $1
          AND (
            email_normalized = $2
            OR lower(pwn_username) = $3
            OR mobile_number = $4
          )
        LIMIT 1`,
      [sprintId, emailNormalized, pwnUsernameNormalized, mobileNumberTrimmed]
    )

    if (existing.rowCount && existing.rows.length > 0) {
      const match = existing.rows[0]
      if (match.pwn_username?.trim().toLowerCase() === pwnUsernameNormalized) {
        throw new DuplicateRegistrationError(
          'username',
          'This username is already registered. Dual registration details are not allowed.'
        )
      }
      if (match.mobile_number?.trim() === mobileNumberTrimmed) {
        throw new DuplicateRegistrationError(
          'mobileNumber',
          'This mobile number is already registered. Dual registration details are not allowed.'
        )
      }
      if (match.email_normalized === emailNormalized || match.email?.trim().toLowerCase() === emailNormalized) {
        throw new DuplicateRegistrationError(
          'email',
          'This participant is already registered.'
        )
      }
      throw new DuplicateRegistrationError('email', 'This participant is already registered.')
    }

    try {
      const result = await this.rawDatabase!.query<RegistrationRow>(
        `INSERT INTO mini_sprint_registrations (
           id, sprint_id, full_name, roll_number, subject, semester, mobile_number,
           email, email_normalized, pwn_username, status
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'CONFIRMED')
         RETURNING id, sprint_id, full_name, roll_number, subject, semester, mobile_number,
                   email, pwn_username, status, registered_at`,
        [
          randomUUID(),
          sprintId,
          input.fullName.trim(),
          input.rollNumber.trim(),
          input.subject,
          input.semester,
          mobileNumberTrimmed,
          input.email.trim(),
          emailNormalized,
          input.pwnUsername.trim(),
        ]
      )
      const row = result.rows[0]
      return {
        registrationId: row.id,
        sprintId: row.sprint_id,
        fullName: row.full_name,
        rollNumber: row.roll_number,
        subject: row.subject as MiniCtfSubject,
        semester: row.semester,
        mobileNumber: row.mobile_number,
        email: row.email,
        pwnUsername: row.pwn_username,
        status: row.status,
        arenaUrl: null,
        registeredAt: toIso(row.registered_at),
      }
    } catch (error) {
      if (error instanceof DuplicateRegistrationError) {
        throw error
      }
      if ((error as { code?: string }).code === '23505') {
        const detail = (error as { detail?: string }).detail || ''
        if (detail.includes('pwn_username') || detail.includes('username')) {
          throw new DuplicateRegistrationError(
            'username',
            'This username is already registered. Dual registration details are not allowed.'
          )
        }
        if (detail.includes('mobile_number') || detail.includes('mobile')) {
          throw new DuplicateRegistrationError(
            'mobileNumber',
            'This mobile number is already registered. Dual registration details are not allowed.'
          )
        }
        throw new DuplicateRegistrationError('email', 'This participant is already registered.')
      }
      throw error
    }
  }
}
