export const PWN_COLLEGE_SCOREBOARD_WINDOWS = [30] as const

export type PwnCollegeScoreboardWindow = (typeof PWN_COLLEGE_SCOREBOARD_WINDOWS)[number]

export interface PwnCollegeScoreboardRecord {
  userId: string
  username: string
  rank: number
  solves: number
}

export interface PwnCollegeSolveRecord {
  userId: string
  module: string
  challenge: string
  solvedAt: Date
}

export interface PwnCollegeScoreboardCacheEntry extends PwnCollegeScoreboardRecord {
  windowDays: PwnCollegeScoreboardWindow
  fetchedAt: Date
}

export interface PwnCollegeLeaderboardEntry {
  rank: number
  realName: string
  username: string
  solves: number
  completedAt: Date | null
}

export type PwnCollegeSyncSource = 'scoreboard' | 'solves'
export type PwnCollegeSyncStatus = 'SUCCEEDED' | 'FAILED' | 'REJECTED'

export interface PwnCollegeSourceResult {
  source: PwnCollegeSyncSource
  status: PwnCollegeSyncStatus
  receivedRows: number | null
  retainedRows: number | null
  errorCode: string | null
}

export class PwnCollegeSourceError extends Error {
  constructor(
    public readonly code:
      | 'AUTHENTICATION_FAILED'
      | 'SOURCE_UNAVAILABLE'
      | 'INVALID_SCOREBOARD'
      | 'INVALID_CSV'
      | 'EMPTY_SCOREBOARD'
      | 'EMPTY_SOLVES'
      | 'INCOMPLETE_SOLVES_EXPORT',
    message: string
  ) {
    super(message)
    this.name = 'PwnCollegeSourceError'
  }
}
