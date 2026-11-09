import type { PwnCollegeScoreboardRecord, PwnCollegeSolveRecord } from './contracts'

export const PWN_COLLEGE_EXCLUDED_USERNAMES = new Set([
  'fkcon',
  'weowshaapsd',
  'thisthingexists',
])

// 12:00 PM IST on 10 November 2026 is 06:30 UTC. The event cache must never
// retain solves from before this competition start time.
export const PWN_COLLEGE_SOLVES_CUTOFF = new Date('2026-11-10T06:30:00.000Z')

export function isExcludedPwnCollegeUsername(username: string): boolean {
  return PWN_COLLEGE_EXCLUDED_USERNAMES.has(username.trim().toLocaleLowerCase('en-US'))
}

export function filterScoreboardRecords(records: PwnCollegeScoreboardRecord[]): PwnCollegeScoreboardRecord[] {
  return records.filter((record) => !isExcludedPwnCollegeUsername(record.username))
}

export function filterSolveRecords(
  records: PwnCollegeSolveRecord[],
  excludedUserIds: ReadonlySet<string> = new Set()
): PwnCollegeSolveRecord[] {
  return records.filter(
    (record) => record.solvedAt >= PWN_COLLEGE_SOLVES_CUTOFF && !excludedUserIds.has(record.userId)
  )
}
