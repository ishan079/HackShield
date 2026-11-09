import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PrismaClient } from '@/generated/prisma/client'
import { createFakePrisma } from '@/tests/helpers/fake-prisma'

const state = vi.hoisted(() => ({ client: null as PrismaClient | null }))

vi.mock('@/lib/prisma', () => ({
  getPrisma: () => state.client,
}))

import { GET } from '@/app/api/v1/ctf/mini-sprints/route'
import { POST } from '@/app/api/v1/ctf/mini-sprints/[sprintId]/register/route'
import { GET as getPwnCollegeScoreboard } from '@/app/api/v1/ctf/pwn-college/scoreboard/route'
import { GET as runPwnCollegeCron, POST as syncPwnCollege } from '@/app/api/v1/internal/pwn-college/sync/route'

function registrationRequest(body: string): Request {
  return new Request('http://localhost/api/v1/ctf/mini-sprints/mini-14/register', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body,
  })
}

const context = { params: Promise.resolve({ sprintId: 'mini-14' }) }
const validParticipant = {
  fullName: 'Test Student',
  rollNumber: 'UA2504AIH103',
  subject: 'BS CSDA',
  semester: 3,
  mobileNumber: '9876543210',
}

describe('Next.js Vercel route handlers', () => {
  beforeEach(() => {
    state.client = createFakePrisma().client
  })

  it('lists mini sprints through the native API route', async () => {
    const response = await GET()
    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: [expect.objectContaining({ id: 'mini-14' })],
    })
  })

  it('registers through the native API route', async () => {
    const response = await POST(
      registrationRequest(JSON.stringify({
        ...validParticipant,
        email: 'student@iitp.ac.in', pwnUsername: 'student.pwn',
      })),
      context
    )
    expect(response.status).toBe(201)
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: { sprintId: 'mini-14', status: 'CONFIRMED' },
    })
  })

  it('accepts a pwn.college username with spaces through the native API route', async () => {
    const response = await POST(
      registrationRequest(JSON.stringify({
        ...validParticipant,
        email: 'space.user@iitp.ac.in',
        pwnUsername: 'aditya adep',
      })),
      context
    )

    expect(response.status).toBe(201)
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: { pwnUsername: 'aditya adep' },
    })
  })

  it('rejects malformed JSON through the native API route', async () => {
    const response = await POST(registrationRequest('{"email":'), context)
    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toMatchObject({
      success: false, error: { code: 'INVALID_REQUEST' },
    })
  })

  it('rejects duplicate registrations through the native API route', async () => {
    const payload = JSON.stringify({
      ...validParticipant,
      email: 'student@iitp.ac.in', pwnUsername: 'student.pwn',
    })
    expect((await POST(registrationRequest(payload), context)).status).toBe(201)
    const response = await POST(registrationRequest(payload), context)
    expect(response.status).toBe(409)
    await expect(response.json()).resolves.toMatchObject({
      success: false, error: { code: 'ALREADY_REGISTERED' },
    })
  })

  it('rejects dual entry for username through the native API route', async () => {
    const first = JSON.stringify({
      ...validParticipant,
      email: 'user1@iitp.ac.in',
      pwnUsername: 'common.username',
      mobileNumber: '9111111111',
    })
    const secondWithSameUsername = JSON.stringify({
      ...validParticipant,
      email: 'user2@iitp.ac.in',
      pwnUsername: 'common.username',
      mobileNumber: '9222222222',
    })

    expect((await POST(registrationRequest(first), context)).status).toBe(201)
    const response = await POST(registrationRequest(secondWithSameUsername), context)
    expect(response.status).toBe(409)
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      error: {
        code: 'ALREADY_REGISTERED',
        message: expect.stringContaining('username is already registered'),
      },
    })
  })

  it('rejects dual entry for mobile number through the native API route', async () => {
    const first = JSON.stringify({
      ...validParticipant,
      email: 'user1@iitp.ac.in',
      pwnUsername: 'user1.pwn',
      mobileNumber: '9876543210',
    })
    const secondWithSameMobile = JSON.stringify({
      ...validParticipant,
      email: 'user2@iitp.ac.in',
      pwnUsername: 'user2.pwn',
      mobileNumber: '9876543210',
    })

    expect((await POST(registrationRequest(first), context)).status).toBe(201)
    const response = await POST(registrationRequest(secondWithSameMobile), context)
    expect(response.status).toBe(409)
    await expect(response.json()).resolves.toMatchObject({
      success: false,
      error: {
        code: 'ALREADY_REGISTERED',
        message: expect.stringContaining('mobile number is already registered'),
      },
    })
  })

  it('serves only cached 30-day pwn.college scoreboard data to the public route', async () => {
    const response = await getPwnCollegeScoreboard()

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({
      success: true,
      data: {
        windowDays: 30,
        entries: [{ userId: '101', username: 'cached-hacker', rank: 1, solves: 9 }],
      },
    })
  })

  it('rejects an unauthenticated synchronization request before it can contact pwn.college', async () => {
    const previous = process.env.PWN_COLLEGE_SYNC_TOKEN
    process.env.PWN_COLLEGE_SYNC_TOKEN = 'test-sync-token'
    try {
      const response = await syncPwnCollege(new Request('http://localhost/api/v1/internal/pwn-college/sync', {
        method: 'POST',
      }))
      expect(response.status).toBe(401)
      await expect(response.json()).resolves.toMatchObject({
        success: false,
        error: { code: 'UNAUTHORIZED' },
      })
    } finally {
      if (previous === undefined) delete process.env.PWN_COLLEGE_SYNC_TOKEN
      else process.env.PWN_COLLEGE_SYNC_TOKEN = previous
    }
  })

  it('requires the distinct Cron secret for Vercel GET requests', async () => {
    const previousManual = process.env.PWN_COLLEGE_SYNC_TOKEN
    const previousCron = process.env.CRON_SECRET
    process.env.PWN_COLLEGE_SYNC_TOKEN = 'manual-token'
    process.env.CRON_SECRET = 'cron-token'
    try {
      const response = await runPwnCollegeCron(new Request('http://localhost/api/v1/internal/pwn-college/sync', {
        headers: { authorization: 'Bearer manual-token' },
      }))
      expect(response.status).toBe(401)
      await expect(response.json()).resolves.toMatchObject({
        success: false,
        error: { code: 'UNAUTHORIZED' },
      })
    } finally {
      if (previousManual === undefined) delete process.env.PWN_COLLEGE_SYNC_TOKEN
      else process.env.PWN_COLLEGE_SYNC_TOKEN = previousManual
      if (previousCron === undefined) delete process.env.CRON_SECRET
      else process.env.CRON_SECRET = previousCron
    }
  })
})
