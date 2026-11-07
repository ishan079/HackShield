import { Prisma } from '@/generated/prisma/client'
import type { PrismaClient } from '@/generated/prisma/client'
import type {
  MiniSprintDto,
  MiniSprintRegistrationDto,
  MiniSprintRegistrationRequest,
} from '@/types/api'

type RepositoryClient = Pick<PrismaClient, 'miniSprint' | 'miniSprintRegistration'>

export class DuplicateRegistrationError extends Error {}
export class SprintNotFoundError extends Error {}
export class RegistrationClosedError extends Error {}

export class MiniSprintRepository {
  constructor(private readonly database: RepositoryClient) {}

  async list(): Promise<MiniSprintDto[]> {
    const rows = await this.database.miniSprint.findMany({
      orderBy: { startsAt: 'asc' },
    })
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      status: row.status,
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
    }))
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

    const email = input.email.trim()
    const pwnUsername = input.pwnUsername.trim()
    try {
      const registration = await this.database.miniSprintRegistration.create({
        data: {
          sprintId,
          email,
          emailNormalized: email.toLowerCase(),
          pwnUsername,
          pwnUsernameNormalized: pwnUsername.toLowerCase(),
          status: 'CONFIRMED',
        },
      })
      return {
        registrationId: registration.id,
        sprintId: registration.sprintId,
        email: registration.email,
        pwnUsername: registration.pwnUsername,
        status: registration.status,
        arenaUrl: null,
        registeredAt: registration.registeredAt.toISOString(),
      }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new DuplicateRegistrationError()
      }
      throw error
    }
  }
}
