import { describe, expect, it, vi } from 'vitest'
import type { PwnCollegeClient } from '@/server/pwn-college/client'
import { PwnCollegeSourceError } from '@/server/pwn-college/contracts'
import type { PwnCollegeRepository } from '@/server/pwn-college/repository'
import { syncPwnCollege } from '@/server/pwn-college/service'

function repositoryMock() {
  return {
    startJob: vi.fn().mockResolvedValueOnce('scoreboard-job').mockResolvedValueOnce('solves-job'),
    replaceScoreboard: vi.fn().mockResolvedValue(2),
    appendSolves: vi.fn().mockResolvedValue(4),
    failJob: vi.fn().mockResolvedValue(undefined),
  }
}

describe('pwn.college sync safeguards', () => {
  it('does not replace the last good scoreboard when the new response is empty', async () => {
    const repository = repositoryMock()
    const client = {
      fetchScoreboard: vi.fn().mockRejectedValue(new PwnCollegeSourceError('EMPTY_SCOREBOARD', 'empty')),
      fetchSolves: vi.fn().mockResolvedValue([{ userId: '101', module: 'welcome', challenge: 'first', solvedAt: new Date() }]),
    }

    const results = await syncPwnCollege(
      repository as unknown as PwnCollegeRepository,
      client as unknown as Pick<PwnCollegeClient, 'fetchScoreboard' | 'fetchSolves'>,
      () => new Date('2026-11-08T00:00:00.000Z')
    )

    expect(repository.replaceScoreboard).not.toHaveBeenCalled()
    expect(repository.failJob).toHaveBeenCalledWith(
      'scoreboard-job', 'REJECTED', 'EMPTY_SCOREBOARD', expect.any(Date)
    )
    expect(repository.appendSolves).toHaveBeenCalledTimes(1)
    expect(results).toEqual([
      expect.objectContaining({ source: 'scoreboard', status: 'REJECTED', errorCode: 'EMPTY_SCOREBOARD' }),
      expect.objectContaining({ source: 'solves', status: 'SUCCEEDED', receivedRows: 1 }),
    ])
  })

  it('keeps the sources independent when the admin CSV is incomplete', async () => {
    const repository = repositoryMock()
    repository.appendSolves.mockRejectedValue(
      new PwnCollegeSourceError('INCOMPLETE_SOLVES_EXPORT', 'smaller export')
    )
    const client = {
      fetchScoreboard: vi.fn().mockResolvedValue([
        { userId: '101', username: 'first-user', rank: 1, solves: 5 },
      ]),
      fetchSolves: vi.fn().mockResolvedValue([{ userId: '101', module: 'welcome', challenge: 'first', solvedAt: new Date() }]),
    }

    const results = await syncPwnCollege(
      repository as unknown as PwnCollegeRepository,
      client as unknown as Pick<PwnCollegeClient, 'fetchScoreboard' | 'fetchSolves'>
    )

    expect(repository.replaceScoreboard).toHaveBeenCalledTimes(1)
    expect(repository.failJob).toHaveBeenCalledWith(
      'solves-job', 'REJECTED', 'INCOMPLETE_SOLVES_EXPORT', expect.any(Date)
    )
    expect(results[0].status).toBe('SUCCEEDED')
    expect(results[1]).toMatchObject({ status: 'REJECTED', errorCode: 'INCOMPLETE_SOLVES_EXPORT' })
  })

  it('does not append solves for a named test account identified on the scoreboard', async () => {
    const repository = repositoryMock()
    const client = {
      fetchScoreboard: vi.fn().mockResolvedValue([
        { userId: 'test-id', username: 'ThisThingExists', rank: 1, solves: 99 },
        { userId: 'real-id', username: 'real participant', rank: 2, solves: 1 },
      ]),
      fetchSolves: vi.fn().mockResolvedValue([
        { userId: 'test-id', module: 'm', challenge: 'test', solvedAt: new Date('2026-11-10T07:00:00.000Z') },
        { userId: 'real-id', module: 'm', challenge: 'real', solvedAt: new Date('2026-11-10T07:00:00.000Z') },
      ]),
    }

    await syncPwnCollege(
      repository as unknown as PwnCollegeRepository,
      client as unknown as Pick<PwnCollegeClient, 'fetchScoreboard' | 'fetchSolves'>,
      () => new Date('2026-11-10T07:05:00.000Z')
    )

    expect(repository.replaceScoreboard).toHaveBeenCalledWith(
      'scoreboard-job',
      [{ userId: 'real-id', username: 'real participant', rank: 2, solves: 1 }],
      expect.any(Date)
    )
    expect(repository.appendSolves).toHaveBeenCalledWith(
      'solves-job',
      [{ userId: 'real-id', module: 'm', challenge: 'real', solvedAt: new Date('2026-11-10T07:00:00.000Z') }],
      expect.any(Date)
    )
  })
})
