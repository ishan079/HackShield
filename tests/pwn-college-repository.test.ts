import { describe, expect, it, vi } from 'vitest'
import type { PrismaClient } from '@/generated/prisma/client'
import { PwnCollegeRepository } from '@/server/pwn-college/repository'

describe('pwn.college cache repository', () => {
  it('batches repeated hacker identities while appending a solves export', async () => {
    const transaction = {
      pwnCollegeHacker: {
        createMany: vi.fn().mockResolvedValue({ count: 2 }),
        updateMany: vi.fn().mockResolvedValue({ count: 2 }),
      },
      pwnCollegeSolve: {
        createMany: vi.fn().mockResolvedValue({ count: 3 }),
        count: vi.fn().mockResolvedValue(3),
      },
      pwnCollegeSyncJob: {
        update: vi.fn().mockResolvedValue({}),
      },
    }
    const database = {
      pwnCollegeSolve: { count: vi.fn().mockResolvedValue(0) },
      $transaction: vi.fn(async (callback: (value: typeof transaction) => Promise<unknown>) => callback(transaction)),
    }
    const repository = new PwnCollegeRepository(database as unknown as PrismaClient)
    const fetchedAt = new Date('2026-11-09T17:45:00.000Z')

    await expect(repository.appendSolves('solves-job', [
      { userId: '100', module: 'welcome', challenge: 'terminal', solvedAt: fetchedAt },
      { userId: '100', module: 'welcome', challenge: 'desktop', solvedAt: fetchedAt },
      { userId: '200', module: 'web', challenge: 'first', solvedAt: fetchedAt },
    ], fetchedAt)).resolves.toBe(3)

    expect(transaction.pwnCollegeHacker.createMany).toHaveBeenCalledWith({
      data: [
        { userId: '100', username: null, firstSeenAt: fetchedAt, lastSeenAt: fetchedAt },
        { userId: '200', username: null, firstSeenAt: fetchedAt, lastSeenAt: fetchedAt },
      ],
      skipDuplicates: true,
    })
    expect(transaction.pwnCollegeHacker.updateMany).toHaveBeenCalledWith({
      where: { userId: { in: ['100', '200'] } },
      data: { lastSeenAt: fetchedAt },
    })
  })

  it('excludes unregistered hackers, then ranks only registered participants by solve count and finish time', async () => {
    const database = {
      pwnCollegeScoreboardEntry: {
        findMany: vi.fn().mockResolvedValue([
          { userId: '0', rank: 1, solves: 101, hacker: { username: 'not-registered', solves: [{ solvedAt: new Date('2026-11-10T06:40:00.000Z') }] } },
          { userId: '1', rank: 2, solves: 100, hacker: { username: 'later', solves: [{ solvedAt: new Date('2026-11-10T08:00:00.000Z') }] } },
          { userId: '2', rank: 3, solves: 100, hacker: { username: 'first', solves: [{ solvedAt: new Date('2026-11-10T07:00:00.000Z') }] } },
          { userId: '3', rank: 4, solves: 99, hacker: { username: 'blank-name', solves: [{ solvedAt: new Date('2026-11-10T06:45:00.000Z') }] } },
        ]),
      },
      miniSprintRegistration: {
        findMany: vi.fn().mockResolvedValue([
          { pwnUsernameNormalized: 'first', fullName: 'First Student' },
          { pwnUsernameNormalized: 'later', fullName: 'Later Student' },
          { pwnUsernameNormalized: 'blank-name', fullName: '   ' },
        ]),
      },
    }
    const repository = new PwnCollegeRepository(database as unknown as PrismaClient)

    await expect(repository.getLeaderboard('mini-14')).resolves.toEqual([
      { rank: 1, realName: 'First Student', username: 'first', solves: 100, completedAt: new Date('2026-11-10T07:00:00.000Z') },
      { rank: 2, realName: 'Later Student', username: 'later', solves: 100, completedAt: new Date('2026-11-10T08:00:00.000Z') },
    ])
  })
})
