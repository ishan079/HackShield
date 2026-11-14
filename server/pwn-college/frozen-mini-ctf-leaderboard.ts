import type { PwnCollegeLeaderboardEntry } from './contracts'

// Final 30-day standings snapshot captured after the Mini CTF. The public
// leaderboard is intentionally frozen; scheduled collection is paused on the
// server until an organizer explicitly re-enables it.
export const FROZEN_MINI_CTF_LEADERBOARD: readonly PwnCollegeLeaderboardEntry[] = [
  { rank: 1, realName: 'Aditya Hembram', username: 'Dangerousera', solves: 103, completedAt: null },
  { rank: 2, realName: 'ANURAG KUMAR', username: 'honey079', solves: 98, completedAt: null },
  { rank: 3, realName: 'Ripunjay Mishra', username: 'veduxv', solves: 54, completedAt: null },
  { rank: 4, realName: 'Aditya Adep', username: 'weowshaapsd', solves: 16, completedAt: null },
  { rank: 5, realName: 'Prince verma', username: 'Rorince069', solves: 11, completedAt: null },
  { rank: 6, realName: 'Ayush Babu', username: 'fkcon', solves: 8, completedAt: null },
  { rank: 7, realName: 'Nil Raj', username: 'Republic_001', solves: 5, completedAt: null },
  { rank: 8, realName: 'Shashank', username: 'ThisThingExists', solves: 2, completedAt: null },
  { rank: 9, realName: 'arbab alam', username: 'arbab_0000', solves: 1, completedAt: null },
  { rank: 10, realName: 'Mili Jha', username: '404error', solves: 1, completedAt: null },
]
