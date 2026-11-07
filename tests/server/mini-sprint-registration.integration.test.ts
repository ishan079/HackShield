import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { createApp } from '@/server/app'
import { MiniSprintRepository } from '@/server/repositories/mini-sprint-repository'
import { createFakePrisma } from '@/tests/helpers/fake-prisma'

describe('Mini CTF registration backend', () => {
  let app: ReturnType<typeof createApp>
  let fake: ReturnType<typeof createFakePrisma>

  beforeEach(async () => {
    fake = createFakePrisma()
    app = createApp({
      repository: new MiniSprintRepository(fake.client),
      logger: false,
    })
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
  })

  it('lists the seeded sprint using the public DTO shape', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/ctf/mini-sprints',
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toMatchObject({
      success: true,
      data: [
        {
          id: 'mini-14',
          status: 'REGISTRATION_OPEN',
          registrationOpen: true,
          durationMinutes: 180,
          challengeCount: 6,
        },
      ],
    })
  })

  it('registers and persists a normalized participant', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/ctf/mini-sprints/mini-14/register',
      payload: {
        email: '  Student@IITP.AC.IN  ',
        pwnUsername: 'student.pwn',
      },
    })

    expect(response.statusCode).toBe(201)
    expect(response.json()).toMatchObject({
      success: true,
      data: {
        sprintId: 'mini-14',
        email: 'Student@IITP.AC.IN',
        pwnUsername: 'student.pwn',
        status: 'CONFIRMED',
        arenaUrl: null,
      },
    })

    expect(fake.registrations).toEqual([
      expect.objectContaining({
        email: 'Student@IITP.AC.IN',
        emailNormalized: 'student@iitp.ac.in',
        pwnUsername: 'student.pwn',
      }),
    ])
  })

  it('rejects duplicate email registrations case-insensitively', async () => {
    const first = {
      email: 'student@iitp.ac.in',
      pwnUsername: 'first-user',
    }
    await app.inject({
      method: 'POST',
      url: '/api/v1/ctf/mini-sprints/mini-14/register',
      payload: first,
    })

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/ctf/mini-sprints/mini-14/register',
      payload: { email: 'STUDENT@IITP.AC.IN', pwnUsername: 'second-user' },
    })

    expect(response.statusCode).toBe(409)
    expect(response.json()).toMatchObject({
      success: false,
      error: { code: 'ALREADY_REGISTERED' },
    })
  })

  it('rejects duplicate pwn.college usernames case-insensitively', async () => {
    await app.inject({
      method: 'POST',
      url: '/api/v1/ctf/mini-sprints/mini-14/register',
      payload: {
        email: 'first@iitp.ac.in',
        pwnUsername: 'Ishan079',
      },
    })

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/ctf/mini-sprints/mini-14/register',
      payload: {
        email: 'second@iitp.ac.in',
        pwnUsername: 'ishan079',
      },
    })

    expect(response.statusCode).toBe(409)
    expect(response.json()).toMatchObject({
      success: false,
      error: { code: 'ALREADY_REGISTERED' },
    })
  })

  it('returns a safe client error for malformed JSON', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/ctf/mini-sprints/mini-14/register',
      headers: { 'content-type': 'application/json' },
      payload: '{"email":',
    })

    expect(response.statusCode).toBe(400)
    expect(response.json()).toMatchObject({
      success: false,
      error: { code: 'INVALID_REQUEST' },
    })
  })

  it.each([
    [{ email: 'student@example.com', pwnUsername: 'valid-user' }, 'email'],
    [{ email: 'student@iitp.ac.in', pwnUsername: 'not valid!' }, 'pwnUsername'],
    [{ email: 'student@iitp.ac.in' }, 'pwnUsername'],
  ])('returns field validation errors for invalid payloads', async (payload, field) => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/ctf/mini-sprints/mini-14/register',
      payload,
    })

    expect(response.statusCode).toBe(422)
    expect(response.json()).toMatchObject({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        details: expect.arrayContaining([expect.objectContaining({ field })]),
      },
    })
  })

  it('returns 404 for an unknown sprint', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/ctf/mini-sprints/mini-999/register',
      payload: { email: 'student@iitp.ac.in', pwnUsername: 'student' },
    })

    expect(response.statusCode).toBe(404)
    expect(response.json()).toMatchObject({
      success: false,
      error: { code: 'SPRINT_NOT_FOUND' },
    })
  })

  it('enforces registration state from PostgreSQL', async () => {
    fake.sprints[0].registrationOpen = false
    fake.sprints[0].status = 'REGISTRATION_CLOSED'

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/ctf/mini-sprints/mini-14/register',
      payload: { email: 'student@iitp.ac.in', pwnUsername: 'student' },
    })

    expect(response.statusCode).toBe(409)
    expect(response.json()).toMatchObject({
      success: false,
      error: { code: 'REGISTRATION_CLOSED' },
    })
  })
})
