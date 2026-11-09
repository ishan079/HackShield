import type { PwnCollegeClient } from './client'
import type { PwnCollegeSourceResult, PwnCollegeSyncSource } from './contracts'
import { PwnCollegeSourceError } from './contracts'
import type { PwnCollegeRepository } from './repository'

function rejected(error: unknown): boolean {
  return error instanceof PwnCollegeSourceError && [
    'INVALID_SCOREBOARD',
    'INVALID_CSV',
    'EMPTY_SCOREBOARD',
    'EMPTY_SOLVES',
    'INCOMPLETE_SOLVES_EXPORT',
  ].includes(error.code)
}

async function syncSource(
  source: PwnCollegeSyncSource,
  repository: PwnCollegeRepository,
  action: (jobId: string, now: Date) => Promise<{ receivedRows: number; retainedRows: number }>,
  now: () => Date
): Promise<PwnCollegeSourceResult> {
  const startedAt = now()
  const jobId = await repository.startJob(source, startedAt)
  try {
    const result = await action(jobId, now())
    return { source, status: 'SUCCEEDED', ...result, errorCode: null }
  } catch (error) {
    const sourceError = error instanceof PwnCollegeSourceError ? error : null
    if (!sourceError) {
      // Preserve operational evidence without logging a source payload, session,
      // CSV capability URL, or database connection details.
      const operationalError = error as { name?: unknown; code?: unknown }
      console.error('pwn.college cache synchronization failed unexpectedly', {
        source,
        errorName: typeof operationalError?.name === 'string' ? operationalError.name : 'Error',
        errorCode: typeof operationalError?.code === 'string' ? operationalError.code : null,
      })
    }
    const status = rejected(error) ? 'REJECTED' : 'FAILED'
    await repository.failJob(jobId, status, sourceError?.code ?? 'UNEXPECTED_ERROR', now())
    return {
      source,
      status,
      receivedRows: null,
      retainedRows: null,
      errorCode: sourceError?.code ?? 'UNEXPECTED_ERROR',
    }
  }
}

export async function syncPwnCollege(
  repository: PwnCollegeRepository,
  client: Pick<PwnCollegeClient, 'fetchScoreboard' | 'fetchSolves'>,
  now: () => Date = () => new Date()
): Promise<PwnCollegeSourceResult[]> {
  const scoreboard = await syncSource('scoreboard', repository, async (jobId, fetchedAt) => {
    const records = await client.fetchScoreboard(30)
    const retainedRows = await repository.replaceScoreboard(jobId, records, fetchedAt)
    return { receivedRows: records.length, retainedRows }
  }, now)
  const solves = await syncSource('solves', repository, async (jobId, fetchedAt) => {
    const records = await client.fetchSolves()
    const retainedRows = await repository.appendSolves(jobId, records, fetchedAt)
    return { receivedRows: records.length, retainedRows }
  }, now)
  return [scoreboard, solves]
}
