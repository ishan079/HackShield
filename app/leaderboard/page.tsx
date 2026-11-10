import Link from 'next/link'
import { unstable_cache } from 'next/cache'
import { ArrowLeft, Crown, Trophy } from 'lucide-react'
import { getPrisma } from '@/lib/prisma'
import type { PwnCollegeLeaderboardEntry } from '@/server/pwn-college/contracts'
import { PwnCollegeRepository } from '@/server/pwn-college/repository'

export const dynamic = 'force-dynamic'

// The source is refreshed periodically; a short shared cache keeps navigation
// fast without making the leaderboard meaningfully stale.
const getCachedLeaderboard = unstable_cache(
  async () => new PwnCollegeRepository(getPrisma()).getLeaderboard('mini-14'),
  ['pwn-college-leaderboard-mini-14'],
  { revalidate: 60 }
)

function rankColor(rank: number): string {
  if (rank === 1) return '#fbbf24'
  if (rank === 2) return '#cbd5e1'
  if (rank === 3) return '#fb923c'
  return 'var(--accent)'
}

export default async function LeaderboardPage() {
  let entries: PwnCollegeLeaderboardEntry[] = []
  let unavailable = false
  try {
    entries = await getCachedLeaderboard()
  } catch (error) {
    console.error('Unable to load cached pwn.college leaderboard', error)
    unavailable = true
  }

  return (
    <main style={{ minHeight: '100vh', padding: '150px 24px 90px' }}>
      <section style={{ width: 'min(920px, 100%)', margin: '0 auto' }}>
        <Link
          href="/ctf?type=mini"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)',
            fontWeight: 700, fontSize: '0.88rem', marginBottom: '30px',
          }}
        >
          <ArrowLeft size={16} aria-hidden="true" /> Back to Mini CTF
        </Link>

        <div className="hs-glass-card" style={{ padding: 'clamp(24px, 5vw, 46px)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '18px', marginBottom: '30px' }}>
            <div>
              <p style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.75px', textTransform: 'uppercase', marginBottom: '8px' }}>
                HackShield Mini CTF
              </p>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: 800, lineHeight: 1, letterSpacing: '-0.035em', margin: 0 }}>
                Leaderboard
              </h1>
              <p style={{ marginTop: '14px', maxWidth: '590px' }}>
                Top 10 participants.
              </p>
            </div>
            <div style={{ width: '48px', height: '48px', display: 'grid', placeItems: 'center', borderRadius: '14px', background: 'var(--accent-dim)', border: '1px solid var(--accent-glow)', color: 'var(--accent)', flexShrink: 0 }}>
              <Trophy size={24} aria-hidden="true" />
            </div>
          </div>

          {unavailable ? (
            <div role="alert" style={{ padding: '22px', borderRadius: '14px', background: 'rgba(248, 113, 113, 0.1)', border: '1px solid rgba(248, 113, 113, 0.35)' }}>
              The leaderboard is temporarily unavailable. Please try again shortly.
            </div>
          ) : entries.length === 0 ? (
            <div style={{ padding: '28px', borderRadius: '14px', background: 'var(--accent-subtle)', border: '1px solid var(--accent-dim)', textAlign: 'center' }}>
              <Trophy size={26} aria-hidden="true" style={{ color: 'var(--accent)', marginBottom: '10px' }} />
              <p style={{ color: 'var(--text-primary)', fontWeight: 700 }}>No leaderboard results yet.</p>
            </div>
          ) : (
            <ol aria-label="Mini CTF leaderboard" style={{ listStyle: 'none', display: 'grid', gap: '10px', margin: 0, padding: 0 }}>
              {entries.map((entry) => (
                <li key={`${entry.rank}-${entry.username}`} style={{ display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr) auto', gap: '14px', alignItems: 'center', padding: '15px 16px', borderRadius: '14px', border: '1px solid var(--border-subtle)', background: entry.rank === 1 ? 'var(--accent-subtle)' : 'rgba(255, 255, 255, 0.025)' }}>
                  <div aria-label={`Rank ${entry.rank}`} style={{ color: rankColor(entry.rank), fontWeight: 900, fontFamily: 'var(--font-mono)', fontSize: '1.05rem', display: 'flex', justifyContent: 'center' }}>
                    {entry.rank === 1 ? <Crown size={22} aria-hidden="true" /> : `#${entry.rank}`}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    {entry.realName ? <div style={{ color: 'var(--text-primary)', fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.realName}</div> : null}
                    <div style={{ color: entry.realName ? 'var(--text-secondary)' : 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>@{entry.username}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--text-primary)', fontWeight: 900, fontSize: '1.15rem' }}>{entry.solves}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>solves</div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </main>
  )
}
