import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { api } from '@/lib/api'

const timestamp = '2026-11-07T02:40:00.000Z'

function success<T>(data: T) {
  return { success: true as const, data, timestamp }
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function lastRequest() {
  const [url, options] = vi.mocked(fetch).mock.lastCall ?? []
  return { url, options: options as RequestInit }
}

describe('HackShield API contract client', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('GET /ctf/mini-sprints', async () => {
    const data = [
      {
        id: 'mini-14',
        title: 'Mini CTF #14: OAuth & Web Infiltration',
        status: 'REGISTRATION_OPEN' as const,
        statusColor: '#10b981',
        startsAt: '2026-11-14T12:30:00.000Z',
        endsAt: '2026-11-14T15:30:00.000Z',
        durationMinutes: 180,
        challengeCount: 6,
        difficulty: 'Intermediate' as const,
        format: 'Solo or Duos' as const,
        reward: '500 Club XP',
        description: 'OAuth, SSRF, and JWT exploitation sprint.',
        registrationOpen: true,
      },
    ]
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(success(data)))

    await expect(api.getMiniSprints()).resolves.toEqual(success(data))
    expect(lastRequest()).toMatchObject({
      url: '/api/v1/ctf/mini-sprints',
      options: { method: 'GET', credentials: 'same-origin' },
    })
  })

  it('POST /ctf/mini-sprints/:sprintId/register', async () => {
    const request = {
      email: 'student@iitp.ac.in',
      pwnUsername: '0xstudent',
    }
    const data = {
      registrationId: 'reg_mini14_01',
      sprintId: 'mini-14',
      ...request,
      status: 'CONFIRMED' as const,
      arenaUrl: 'https://ctf.iitp.ac.in/arenas/mini-14',
      registeredAt: timestamp,
    }
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(success(data), 201))

    await expect(api.registerMiniSprint('mini/14', request)).resolves.toEqual(
      success(data)
    )
    expect(lastRequest()).toMatchObject({
      url: '/api/v1/ctf/mini-sprints/mini%2F14/register',
      options: { method: 'POST', body: JSON.stringify(request) },
    })
  })

  it('GET /ctf/flagship/status', async () => {
    const data = {
      title: 'HackShield CTF 2027',
      status: 'REGISTRATION_OPENING_SOON' as const,
      eventStart: '2027-03-15T03:30:00.000Z',
      eventEnd: '2027-03-16T15:30:00.000Z',
      registrationOpens: '2027-02-15T00:00:00.000Z',
      registrationCloses: '2027-03-14T00:00:00.000Z',
      serverTime: timestamp,
      prizePool: '₹1,00,000+',
      minTeamSize: 1,
      maxTeamSize: 4,
    }
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(success(data)))

    await expect(api.getFlagshipStatus()).resolves.toEqual(success(data))
    expect(lastRequest()).toMatchObject({
      url: '/api/v1/ctf/flagship/status',
      options: { method: 'GET' },
    })
  })

  it('POST /ctf/flagship/register', async () => {
    const request = {
      teamName: 'Null Pointers',
      email: 'captain@iitp.ac.in',
      membersCount: 4,
    }
    const data = {
      registrationId: 'reg_flagship_01',
      teamName: request.teamName,
      captainEmail: request.email,
      membersCount: request.membersCount,
      status: 'PRE_REGISTERED' as const,
      registeredAt: timestamp,
    }
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(success(data), 201))

    await expect(api.preRegisterFlagship(request)).resolves.toEqual(success(data))
    expect(lastRequest()).toMatchObject({
      url: '/api/v1/ctf/flagship/register',
      options: { method: 'POST', body: JSON.stringify(request) },
    })
  })

  it('POST /terminal/validate-flag', async () => {
    const data = {
      correct: true,
      pointsAwarded: 100,
      rank: 42,
      badgeEarned: 'Novice Cryptanalyst',
      message: 'Correct flag.',
    }
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(success(data)))

    await expect(api.validateFlag('FLAG{correct}')).resolves.toEqual(success(data))
    expect(lastRequest()).toMatchObject({
      url: '/api/v1/terminal/validate-flag',
      options: {
        method: 'POST',
        body: JSON.stringify({ flag: 'FLAG{correct}' }),
      },
    })
  })

  it('GET /terminal/challenges', async () => {
    const data = [
      {
        id: 'crypto-01',
        title: 'Dual Base64',
        prompt: 'Decode the ciphertext.',
        ciphertext: 'VkVkV01rMUhVbXBaTW14bQ==',
        hint: 'Decode twice.',
        category: 'Crypto' as const,
        points: 100,
      },
    ]
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(success(data)))

    await expect(api.getChallenges()).resolves.toEqual(success(data))
    expect(lastRequest()).toMatchObject({
      url: '/api/v1/terminal/challenges',
      options: { method: 'GET' },
    })
  })

  it('GET /stats/live', async () => {
    const data = [
      {
        key: 'activeMembers' as const,
        value: 100,
        suffix: '+',
        label: 'Active Members',
        sub: 'Across B.Tech, M.Tech & Ph.D',
      },
    ]
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(success(data)))

    await expect(api.getLiveStats()).resolves.toEqual(success(data))
    expect(lastRequest()).toMatchObject({
      url: '/api/v1/stats/live',
      options: { method: 'GET' },
    })
  })

  it('POST /programs/apply', async () => {
    const request = {
      programId: 'bootcamp-6week',
      email: 'student@iitp.ac.in',
      experienceLevel: 'Beginner' as const,
      motivation: 'I want to learn binary exploitation.',
    }
    const data = {
      applicationId: 'app_01',
      programId: request.programId,
      email: request.email,
      status: 'WAITLISTED' as const,
      submittedAt: timestamp,
    }
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(success(data), 201))

    await expect(api.applyProgram(request)).resolves.toEqual(success(data))
    expect(lastRequest()).toMatchObject({
      url: '/api/v1/programs/apply',
      options: { method: 'POST', body: JSON.stringify(request) },
    })
  })

  it('GET /resources with encoded filters', async () => {
    const data = { items: [], total: 0 }
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(success(data)))

    await expect(
      api.getResources({ category: 'tools', search: ' burp suite ' })
    ).resolves.toEqual(success(data))
    expect(lastRequest()).toMatchObject({
      url: '/api/v1/resources?category=tools&search=burp+suite',
      options: { method: 'GET' },
    })
  })

  it('preserves a backend error envelope', async () => {
    const failure = {
      success: false as const,
      error: {
        code: 'INVALID_INSTITUTE_EMAIL',
        message: 'Use an IIT Patna email address.',
        details: [{ field: 'email', issue: 'Must end in @iitp.ac.in' }],
      },
      timestamp,
    }
    vi.mocked(fetch).mockResolvedValueOnce(jsonResponse(failure, 422))

    await expect(
      api.registerMiniSprint('mini-14', {
        email: 'student@example.com',
        pwnUsername: 'student',
      })
    ).resolves.toEqual(failure)
  })

  it.each([
    ['non-JSON responses', new Response('<html>Error</html>', { status: 502 }), 'MALFORMED_RESPONSE'],
    ['invalid envelopes', jsonResponse({ data: [] }), 'CONTRACT_VIOLATION'],
    ['success bodies with error status', jsonResponse(success([]), 500), 'HTTP_ERROR'],
  ])('rejects %s', async (_label, response, expectedCode) => {
    vi.mocked(fetch).mockResolvedValueOnce(response)
    const result = await api.getMiniSprints()

    expect(result.success).toBe(false)
    if (!result.success) expect(result.error.code).toBe(expectedCode)
  })

  it('normalizes network failures', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('connection refused'))
    const result = await api.getMiniSprints()

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error).toEqual({
        code: 'NETWORK_ERROR',
        message: 'connection refused',
      })
    }
  })
})
