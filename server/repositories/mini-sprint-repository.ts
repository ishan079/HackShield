import { randomUUID } from 'node:crypto'
import type { Database } from '@/server/database'
import type {
  MiniSprintDto,
  MiniSprintRegistrationDto,
  MiniSprintRegistrationRequest,
} from '@/types/api'

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
  email: string
  pwn_username: string
  status: MiniSprintRegistrationDto['status']
  registered_at: Date
}

export class DuplicateRegistrationError extends Error {}
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

export class MiniSprintRepository {
  constructor(private readonly database: Database) {}

  async list(): Promise<MiniSprintDto[]> {
    const result = await this.database.query<MiniSprintRow>(
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
    const sprint = await this.database.query<Pick<MiniSprintRow, 'registration_open'>>(
      'SELECT registration_open FROM mini_sprints WHERE id = $1',
      [sprintId]
    )

    if (!sprint.rowCount) throw new SprintNotFoundError()
    if (!sprint.rows[0].registration_open) throw new RegistrationClosedError()

    try {
      const result = await this.database.query<RegistrationRow>(
        `INSERT INTO mini_sprint_registrations (
           id, sprint_id, email, email_normalized, pwn_username, status
         ) VALUES ($1, $2, $3, $4, $5, 'CONFIRMED')
         RETURNING id, sprint_id, email, pwn_username, status, registered_at`,
        [
          randomUUID(),
          sprintId,
          input.email.trim(),
          input.email.trim().toLowerCase(),
          input.pwnUsername.trim(),
        ]
      )
      const row = result.rows[0]
      return {
        registrationId: row.id,
        sprintId: row.sprint_id,
        email: row.email,
        pwnUsername: row.pwn_username,
        status: row.status,
        arenaUrl: null,
        registeredAt: toIso(row.registered_at),
      }
    } catch (error) {
      if ((error as { code?: string }).code === '23505') {
        throw new DuplicateRegistrationError()
      }
      throw error
    }
  }
}
