import { describe, expect, it } from 'vitest'
import { FROZEN_MINI_CTF_LEADERBOARD } from '@/server/pwn-college/frozen-mini-ctf-leaderboard'

describe('frozen Mini CTF leaderboard', () => {
  it('preserves the approved all-named final standings without the unapproved account', () => {
    expect(FROZEN_MINI_CTF_LEADERBOARD).toHaveLength(10)
    expect(FROZEN_MINI_CTF_LEADERBOARD.map((entry) => entry.rank)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(FROZEN_MINI_CTF_LEADERBOARD).toEqual(expect.arrayContaining([
      expect.objectContaining({ username: 'weowshaapsd', realName: 'Aditya Adep', solves: 16 }),
      expect.objectContaining({ username: 'fkcon', realName: 'Ayush Babu', solves: 8 }),
      expect.objectContaining({ username: 'ThisThingExists', realName: 'Shashank', solves: 2 }),
      expect.objectContaining({ username: 'Republic_001', realName: 'Nil Raj', solves: 5 }),
      expect.objectContaining({ username: '404error', realName: 'Mili Jha', solves: 1, rank: 10 }),
    ]))
    expect(FROZEN_MINI_CTF_LEADERBOARD.some((entry) => entry.username === 'hacker_203')).toBe(false)
  })
})
