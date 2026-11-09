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
})
