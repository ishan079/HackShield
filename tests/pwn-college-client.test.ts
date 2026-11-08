import { describe, expect, it, vi } from 'vitest'
import { parseSolvesCsv, PwnCollegeClient } from '@/server/pwn-college/client'
import { PwnCollegeSourceError } from '@/server/pwn-college/contracts'

const validScoreboardRow = (userId: number, name: string, rank: number, solves: number) => ({
  user_id: userId,
  name,
  rank,
  solves,
})

function response(body: unknown, status = 200, contentType = 'application/json'): Response {
  return new Response(typeof body === 'string' ? body : JSON.stringify(body), {
    status,
    headers: { 'content-type': contentType },
  })
}

describe('PwnCollegeClient', () => {
  it('collects every scoreboard page using the server-only session cookie', async () => {
    const fetchImpl = vi.fn()
      .mockResolvedValueOnce(response({
        standings: [validScoreboardRow(101, 'first-user', 1, 9)],
        pages: [1, 2],
      }))
      .mockResolvedValueOnce(response({
        standings: [validScoreboardRow(202, 'second-user', 2, 4)],
        pages: [1, 2],
      }))
    const client = new PwnCollegeClient({
      baseUrl: 'https://pwn.college',
      dojo: 'hackshield-iitp~13f8a31b',
      sessionCookie: 'session=private-value',
    }, fetchImpl)

    await expect(client.fetchScoreboard(30)).resolves.toEqual([
      { userId: '101', username: 'first-user', rank: 1, solves: 9 },
      { userId: '202', username: 'second-user', rank: 2, solves: 4 },
    ])
    expect(fetchImpl).toHaveBeenCalledTimes(2)
    expect(String(fetchImpl.mock.calls[0][0])).toContain('/_/30/1')
    expect(new Headers(fetchImpl.mock.calls[0][1].headers).get('cookie')).toBe('session=private-value')
  })

  it('rejects empty or malformed scoreboards before any cache write can occur', async () => {
    const empty = new PwnCollegeClient({
      baseUrl: 'https://pwn.college', dojo: 'hackshield-iitp~13f8a31b', sessionCookie: 'session=x',
    }, vi.fn().mockResolvedValue(response({ standings: [], pages: [1] })))
    const malformed = new PwnCollegeClient({
      baseUrl: 'https://pwn.college', dojo: 'hackshield-iitp~13f8a31b', sessionCookie: 'session=x',
    }, vi.fn().mockResolvedValue(response({ standings: null, pages: [1] })))

    await expect(empty.fetchScoreboard(30)).rejects.toMatchObject({ code: 'EMPTY_SCOREBOARD' })
    await expect(malformed.fetchScoreboard(30)).rejects.toMatchObject({ code: 'INVALID_SCOREBOARD' })
  })

  it('discovers the admin CSV at run time and parses quoted values safely', async () => {
    const fetchImpl = vi.fn()
      .mockResolvedValueOnce(response(
        '<a href="/dojo/hackshield-iitp~13f8a31b/solves/secret-token/csv">Solves</a>',
        200,
        'text/html'
      ))
      .mockResolvedValueOnce(response(
        'user_id,module,challenge,time\n101,"Web, Basics","First, Challenge",2026-11-08T00:00:00.000Z\n',
        200,
        'text/csv'
      ))
    const client = new PwnCollegeClient({
      baseUrl: 'https://pwn.college', dojo: 'hackshield-iitp~13f8a31b', sessionCookie: 'session=x',
    }, fetchImpl)

    await expect(client.fetchSolves()).resolves.toEqual([
      expect.objectContaining({ userId: '101', module: 'Web, Basics', challenge: 'First, Challenge' }),
    ])
    expect(String(fetchImpl.mock.calls[1][0])).toContain('/solves/secret-token/csv')
  })

  it('does not accept an export URL outside the authenticated pwn.college dojo', async () => {
    const client = new PwnCollegeClient({
      baseUrl: 'https://pwn.college', dojo: 'hackshield-iitp~13f8a31b', sessionCookie: 'session=x',
    }, vi.fn().mockResolvedValue(response('<a href="https://example.test/data.csv">Solves</a>', 200, 'text/html')))

    await expect(client.fetchSolves()).rejects.toMatchObject({ code: 'INVALID_CSV' })
  })

  it('rejects invalid CSV headers, unclosed quotes, and empty exports', () => {
    expect(() => parseSolvesCsv('user,module,challenge,time\n')).toThrow(PwnCollegeSourceError)
    expect(() => parseSolvesCsv('user_id,module,challenge,time\n1,"bad,challenge,2026-11-08')).toThrow(PwnCollegeSourceError)
    expect(() => parseSolvesCsv('user_id,module,challenge,time\n')).toThrow(
      expect.objectContaining({ code: 'EMPTY_SOLVES' })
    )
  })
})
