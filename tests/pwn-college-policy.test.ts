import { describe, expect, it } from 'vitest'
import {
  filterScoreboardRecords,
  filterSolveRecords,
  isExcludedPwnCollegeUsername,
  PWN_COLLEGE_SOLVES_CUTOFF,
} from '@/server/pwn-college/policy'

describe('pwn.college competition data policy', () => {
  it('removes only the named test accounts regardless of casing', () => {
    expect(isExcludedPwnCollegeUsername('ThisThingExists')).toBe(true)
    expect(isExcludedPwnCollegeUsername(' FKCON ')).toBe(true)
    expect(filterScoreboardRecords([
      { userId: '1', username: 'fkcon', rank: 1, solves: 99 },
      { userId: '2', username: 'real participant', rank: 2, solves: 8 },
    ])).toEqual([
      { userId: '2', username: 'real participant', rank: 2, solves: 8 },
    ])
  })

  it('keeps solves at or after noon IST on 10 November and rejects earlier records', () => {
    expect(PWN_COLLEGE_SOLVES_CUTOFF.toISOString()).toBe('2026-11-10T06:30:00.000Z')
    expect(filterSolveRecords([
      { userId: '1', module: 'm', challenge: 'old', solvedAt: new Date('2026-11-10T06:29:59.999Z') },
      { userId: '1', module: 'm', challenge: 'start', solvedAt: new Date('2026-11-10T06:30:00.000Z') },
      { userId: 'test-user', module: 'm', challenge: 'excluded', solvedAt: new Date('2026-11-10T06:31:00.000Z') },
    ], new Set(['test-user'])).map((record) => record.challenge)).toEqual(['start'])
  })
})
