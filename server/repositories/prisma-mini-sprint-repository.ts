import { randomUUID } from 'node:crypto'
import type {
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
  email: string
  pwnUsername: string
  status: string
  registeredAt: Date
}

interface PrismaRegistrationDatabase {
  miniSprint: {
    findMany(args: unknown): Promise<PrismaMiniSprintRow[]>
    findUnique(args: unknown): Promise<Pick<PrismaMiniSprintRow, 'registrationOpen'> | null>
  }
  miniSprintRegistration: {
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

    try {
      const row = await this.database.miniSprintRegistration.create({
        data: {
          id: randomUUID(),
          sprintId,
          email: input.email.trim(),
          emailNormalized: input.email.trim().toLowerCase(),
          pwnUsername: input.pwnUsername.trim(),
          status: 'CONFIRMED',
        },
      })

      return {
        registrationId: row.id,
        sprintId: row.sprintId,
        email: row.email,
        pwnUsername: row.pwnUsername,
        status: row.status as MiniSprintRegistrationDto['status'],
        arenaUrl: null,
        registeredAt: row.registeredAt.toISOString(),
      }
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') {
        throw new DuplicateRegistrationError()
      }
      throw error
    }
  }
}
