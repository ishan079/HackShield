import { randomUUID } from 'node:crypto'
import type { PrismaClient } from '@/generated/prisma/client'
import type {
  PwnCollegeScoreboardCacheEntry,
  PwnCollegeScoreboardRecord,
  PwnCollegeSolveRecord,
  PwnCollegeSyncSource,
  PwnCollegeSyncStatus,
} from './contracts'
import { PwnCollegeSourceError } from './contracts'

type PwnCollegeDatabase = Pick<
  PrismaClient,
  '$transaction' |
  'pwnCollegeHacker' |
  'pwnCollegeScoreboardEntry' |
  'pwnCollegeSolve' |
  'pwnCollegeSyncJob' |
  'pwnCollegeSyncLock'
>

const SYNC_LOCK_ID = 'pwn-college-sync'
const SYNC_LOCK_STALE_AFTER_MS = 10 * 60 * 1000

function hasPrismaCode(error: unknown, code: string): boolean {
  return Boolean(error && typeof error === 'object' && (error as { code?: string }).code === code)
}

export class PwnCollegeRepository {
  private activeLockAt: Date | null = null

  constructor(private readonly database: PwnCollegeDatabase) {}

  async tryAcquireSyncLock(lockedAt: Date): Promise<boolean> {
    try {
      await this.database.pwnCollegeSyncLock.create({ data: { id: SYNC_LOCK_ID, lockedAt } })
      this.activeLockAt = lockedAt
      return true
    } catch (error) {
      if (!hasPrismaCode(error, 'P2002')) throw error
      const staleBefore = new Date(lockedAt.getTime() - SYNC_LOCK_STALE_AFTER_MS)
      const takeover = await this.database.pwnCollegeSyncLock.updateMany({
        where: { id: SYNC_LOCK_ID, lockedAt: { lt: staleBefore } },
        data: { lockedAt },
      })
      if (takeover.count === 1) this.activeLockAt = lockedAt
      return takeover.count === 1
    }
  }

  async releaseSyncLock(): Promise<void> {
    if (!this.activeLockAt) return
    // Match the acquisition timestamp, so an expired invocation cannot delete
    // a lease that was safely taken over by a newer invocation.
    await this.database.pwnCollegeSyncLock.deleteMany({
      where: { id: SYNC_LOCK_ID, lockedAt: this.activeLockAt },
    })
    this.activeLockAt = null
  }

  async startJob(source: PwnCollegeSyncSource, startedAt: Date): Promise<string> {
    const id = randomUUID()
    await this.database.pwnCollegeSyncJob.create({
      data: { id, source, status: 'RUNNING', startedAt },
    })
    return id
  }

  async failJob(
    id: string,
    status: Extract<PwnCollegeSyncStatus, 'FAILED' | 'REJECTED'>,
    errorCode: string,
    finishedAt: Date
  ): Promise<void> {
    await this.database.pwnCollegeSyncJob.update({
      where: { id },
      data: { status, errorCode, finishedAt },
    })
  }

  async replaceScoreboard(
    jobId: string,
    records: PwnCollegeScoreboardRecord[],
    fetchedAt: Date
  ): Promise<number> {
    if (!records.length) {
      throw new PwnCollegeSourceError('EMPTY_SCOREBOARD', 'Refusing to replace the cached scoreboard with no records.')
    }
    await this.database.$transaction(async (transaction) => {
      for (const record of records) {
        await transaction.pwnCollegeHacker.upsert({
          where: { userId: record.userId },
          create: {
            userId: record.userId,
            username: record.username,
            firstSeenAt: fetchedAt,
            lastSeenAt: fetchedAt,
          },
          update: { username: record.username, lastSeenAt: fetchedAt },
        })
      }
      await transaction.pwnCollegeScoreboardEntry.deleteMany({ where: { windowDays: 30 } })
      await transaction.pwnCollegeScoreboardEntry.createMany({
        data: records.map((record) => ({
          windowDays: 30,
          userId: record.userId,
          rank: record.rank,
          solves: record.solves,
          fetchedAt,
        })),
      })
      await transaction.pwnCollegeSyncJob.update({
        where: { id: jobId },
        data: {
          status: 'SUCCEEDED',
          receivedRows: records.length,
          retainedRows: records.length,
          finishedAt: fetchedAt,
          errorCode: null,
        },
      })
    })
    return records.length
  }

  async appendSolves(jobId: string, records: PwnCollegeSolveRecord[], fetchedAt: Date): Promise<number> {
    if (!records.length) {
      throw new PwnCollegeSourceError('EMPTY_SOLVES', 'Refusing to replace the cached solves with no records.')
    }
    const existingCount = await this.database.pwnCollegeSolve.count()
    if (existingCount > records.length) {
      throw new PwnCollegeSourceError(
        'INCOMPLETE_SOLVES_EXPORT',
        'Refusing a solves export with fewer records than the existing cache.'
      )
    }
    const userIds = [...new Set(records.map((record) => record.userId))]
    return this.database.$transaction(async (transaction) => {
      // The CSV can contain many solves for one hacker. Batch the identity
      // bookkeeping rather than opening one database round-trip per row; this
      // keeps the import comfortably inside Prisma's transaction timeout.
      await transaction.pwnCollegeHacker.createMany({
        data: userIds.map((userId) => ({
          userId,
          username: null,
          firstSeenAt: fetchedAt,
          lastSeenAt: fetchedAt,
        })),
        skipDuplicates: true,
      })
      await transaction.pwnCollegeHacker.updateMany({
        where: { userId: { in: userIds } },
        data: { lastSeenAt: fetchedAt },
      })
      await transaction.pwnCollegeSolve.createMany({
        data: records.map((record) => ({
          userId: record.userId,
          module: record.module,
          challenge: record.challenge,
          solvedAt: record.solvedAt,
          firstSeenAt: fetchedAt,
        })),
        skipDuplicates: true,
      })
      const retainedRows = await transaction.pwnCollegeSolve.count()
      await transaction.pwnCollegeSyncJob.update({
        where: { id: jobId },
        data: {
          status: 'SUCCEEDED',
          receivedRows: records.length,
          retainedRows,
          finishedAt: fetchedAt,
          errorCode: null,
        },
      })
      return retainedRows
    })
  }

  async getScoreboard(): Promise<PwnCollegeScoreboardCacheEntry[]> {
    const rows = await this.database.pwnCollegeScoreboardEntry.findMany({
      where: { windowDays: 30 },
      orderBy: [{ rank: 'asc' }, { userId: 'asc' }],
      include: { hacker: { select: { username: true } } },
    })
    return rows.flatMap((row) => {
      if (!row.hacker.username) return []
      return [{
        windowDays: 30,
        userId: row.userId,
        username: row.hacker.username,
        rank: row.rank,
        solves: row.solves,
        fetchedAt: row.fetchedAt,
      }]
    })
  }
}
