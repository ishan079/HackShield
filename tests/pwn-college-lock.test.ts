import { describe, expect, it, vi } from 'vitest'
import type { PrismaClient } from '@/generated/prisma/client'
import { PwnCollegeRepository } from '@/server/pwn-college/repository'

function repositoryWithLock(lock: {
  create: ReturnType<typeof vi.fn>
  updateMany: ReturnType<typeof vi.fn>
  deleteMany: ReturnType<typeof vi.fn>
}) {
  return new PwnCollegeRepository({ pwnCollegeSyncLock: lock } as unknown as PrismaClient)
}

describe('pwn.college synchronization lease', () => {
  it('does not acquire an active lease and never releases another invocation’s lock', async () => {
    const lock = {
      create: vi.fn().mockRejectedValue({ code: 'P2002' }),
      updateMany: vi.fn().mockResolvedValue({ count: 0 }),
      deleteMany: vi.fn(),
    }
    const repository = repositoryWithLock(lock)

    await expect(repository.tryAcquireSyncLock(new Date('2026-11-09T10:00:00.000Z'))).resolves.toBe(false)
    await repository.releaseSyncLock()

    expect(lock.deleteMany).not.toHaveBeenCalled()
  })

  it('uses the acquisition timestamp when releasing its own lease', async () => {
    const lockedAt = new Date('2026-11-09T10:00:00.000Z')
    const lock = {
      create: vi.fn().mockResolvedValue({}),
      updateMany: vi.fn(),
      deleteMany: vi.fn().mockResolvedValue({ count: 1 }),
    }
    const repository = repositoryWithLock(lock)

    await expect(repository.tryAcquireSyncLock(lockedAt)).resolves.toBe(true)
    await repository.releaseSyncLock()

    expect(lock.deleteMany).toHaveBeenCalledWith({
      where: { id: 'pwn-college-sync', lockedAt },
    })
  })

  it('takes over only a stale lease after the database confirms it', async () => {
    const lockedAt = new Date('2026-11-09T10:10:00.000Z')
    const lock = {
      create: vi.fn().mockRejectedValue({ code: 'P2002' }),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
      deleteMany: vi.fn(),
    }
    const repository = repositoryWithLock(lock)

    await expect(repository.tryAcquireSyncLock(lockedAt)).resolves.toBe(true)

    expect(lock.updateMany).toHaveBeenCalledWith({
      where: {
        id: 'pwn-college-sync',
        lockedAt: { lt: new Date('2026-11-09T10:00:00.000Z') },
      },
      data: { lockedAt },
    })
  })
})
