class FakePrismaClientKnownRequestError extends Error {
  code: string
  constructor(message: string, options: { code: string; clientVersion?: string }) {
    super(message)
    this.code = options.code
  }
}

let Prisma: any = {
  PrismaClientKnownRequestError: FakePrismaClientKnownRequestError,
}

try {
  const generated = await import('@/generated/prisma/client')
  if (generated.Prisma) {
    Prisma = generated.Prisma
  }
} catch {}

export function createFakePrisma() {
  const sprints = [
    {
      id: 'mini-14', title: 'Mini CTF #14',
      status: 'REGISTRATION_OPEN' as 'REGISTRATION_OPEN' | 'REGISTRATION_CLOSED',
      statusColor: '#10b981', startsAt: new Date('2026-11-14T12:30:00.000Z'),
      endsAt: new Date('2026-11-14T15:30:00.000Z'), durationMinutes: 180,
      challengeCount: 6, difficulty: 'Intermediate', format: 'Solo or Duos',
      reward: '500 Club XP', description: 'Test sprint', registrationOpen: true,
      createdAt: new Date('2026-11-07T03:00:00.000Z'),
      updatedAt: new Date('2026-11-07T03:00:00.000Z'),
    },
  ]
  const registrations: Array<Record<string, unknown>> = []
  const client = {
    miniSprint: {
      findMany: async () => sprints,
      findUnique: async ({ where }: { where: { id: string } }) => {
        const sprint = sprints.find((item) => item.id === where.id)
        return sprint ? { registrationOpen: sprint.registrationOpen } : null
      },
    },
    miniSprintRegistration: {
      create: async ({ data }: { data: Record<string, string> }) => {
        const duplicate = registrations.some(
          (item) => item.sprintId === data.sprintId &&
            (item.emailNormalized === data.emailNormalized ||
             item.pwnUsernameNormalized === data.pwnUsernameNormalized)
        )
        if (duplicate) {
          throw new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
            code: 'P2002', clientVersion: '7.10.1',
          })
        }
        const row = {
          id: `registration-${registrations.length + 1}`,
          registeredAt: new Date('2026-11-07T03:00:00.000Z'), ...data,
        }
        registrations.push(row)
        return row
      },
    },
  } as unknown as PrismaClient
  return { client, sprints, registrations }
}
