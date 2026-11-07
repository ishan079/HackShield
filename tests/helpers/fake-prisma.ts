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
      findFirst: async ({ where }: { where: Record<string, any> }) => {
        if (where.OR && Array.isArray(where.OR)) {
          return (
            registrations.find((item) => {
              if (item.sprintId !== where.sprintId) return false
              return where.OR.some((cond: Record<string, any>) => {
                if (cond.emailNormalized && cond.emailNormalized === item.emailNormalized) return true
                if (cond.pwnUsernameNormalized && cond.pwnUsernameNormalized === item.pwnUsernameNormalized) return true
                if (cond.mobileNumber && cond.mobileNumber === item.mobileNumber) return true
                return false
              })
            }) || null
          )
        }
        return null
      },
      create: async ({ data }: { data: Record<string, string> }) => {
        const duplicateUsername = registrations.some(
          (item) => item.sprintId === data.sprintId &&
            item.pwnUsernameNormalized === data.pwnUsernameNormalized
        )
        if (duplicateUsername) {
          throw new Prisma.PrismaClientKnownRequestError('Unique constraint failed on username', {
            code: 'P2002', clientVersion: '7.10.1', meta: { target: ['pwn_username'] },
          })
        }
        const duplicateMobile = registrations.some(
          (item) => item.sprintId === data.sprintId &&
            item.mobileNumber === data.mobileNumber
        )
        if (duplicateMobile) {
          throw new Prisma.PrismaClientKnownRequestError('Unique constraint failed on mobile', {
            code: 'P2002', clientVersion: '7.10.1', meta: { target: ['mobile_number'] },
          })
        }
        const duplicateEmail = registrations.some(
          (item) => item.sprintId === data.sprintId &&
            item.emailNormalized === data.emailNormalized
        )
        if (duplicateEmail) {
          throw new Prisma.PrismaClientKnownRequestError('Unique constraint failed on email', {
            code: 'P2002', clientVersion: '7.10.1', meta: { target: ['email_normalized'] },
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
