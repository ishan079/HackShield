import { DataType, newDb } from 'pg-mem'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import type { Pool } from 'pg'
import { createApp } from '@/server/app'
import { runMigrations } from '@/server/database'

const validParticipant = {
  fullName: 'Test Student',
  rollNumber: 'UA2504AIH103',
  subject: 'BS CSDA',
  semester: 3,
  mobileNumber: '9876543210',
}

describe('Mini CTF registration backend', () => {
  let pool: Pool
  let app: ReturnType<typeof createApp>

  beforeEach(async () => {
    const memory = newDb({ autoCreateForeignKeyIndices: true })
    memory.public.registerFunction({
      name: 'now',
      returns: DataType.timestamptz,
      implementation: () => new Date('2026-11-07T03:00:00.000Z'),
    })
    const adapter = memory.adapters.createPg()
    pool = new adapter.Pool() as Pool
    await runMigrations(pool)
    app = createApp({ database: pool, logger: false })
    await app.ready()
  })

  afterEach(async () => {
    await app.close()
    await pool.end()
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
        ...validParticipant,
        email: '  Student@IITP.AC.IN  ',
        pwnUsername: 'student.pwn',
      },
    })

    expect(response.statusCode).toBe(201)
    expect(response.json()).toMatchObject({
      success: true,
      data: {
        sprintId: 'mini-14',
        fullName: 'Test Student',
        rollNumber: 'UA2504AIH103',
        subject: 'BS CSDA',
        semester: 3,
        mobileNumber: '9876543210',
        email: 'Student@IITP.AC.IN',
        pwnUsername: 'student.pwn',
        status: 'CONFIRMED',
        arenaUrl: null,
      },
    })

    const persisted = await pool.query(
      `SELECT full_name, roll_number, subject, semester, mobile_number,
              email, email_normalized, pwn_username
         FROM mini_sprint_registrations`
    )
    expect(persisted.rows).toEqual([
      {
        full_name: 'Test Student',
        roll_number: 'UA2504AIH103',
        subject: 'BS CSDA',
        semester: 3,
        mobile_number: '9876543210',
        email: 'Student@IITP.AC.IN',
        email_normalized: 'student@iitp.ac.in',
        pwn_username: 'student.pwn',
      },
    ])
  })

  it('rejects duplicate email registrations case-insensitively', async () => {
    const first = {
      ...validParticipant,
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
      payload: {...validParticipant, email: 'STUDENT@IITP.AC.IN', pwnUsername: 'second-user'},
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
        ...validParticipant,
        email: 'first@iitp.ac.in',
        pwnUsername: 'Ishan079',
      },
    })

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/ctf/mini-sprints/mini-14/register',
      payload: {
        ...validParticipant,
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
    [{...validParticipant, email: 'student@example.com', pwnUsername: 'valid-user'}, 'email'],
    [{...validParticipant, email: 'student@iitp.ac.in', pwnUsername: 'not valid!'}, 'pwnUsername'],
    [{...validParticipant, email: 'student@iitp.ac.in'}, 'pwnUsername'],
    [{...validParticipant, semester: 8, email: 'student@iitp.ac.in', pwnUsername: 'valid-user'}, 'semester'],
    [{...validParticipant, mobileNumber: '123', email: 'student@iitp.ac.in', pwnUsername: 'valid-user'}, 'mobileNumber'],
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
      payload: {...validParticipant, email: 'student@iitp.ac.in', pwnUsername: 'student'},
    })

    expect(response.statusCode).toBe(404)
    expect(response.json()).toMatchObject({
      success: false,
      error: { code: 'SPRINT_NOT_FOUND' },
    })
  })

  it('enforces registration state from PostgreSQL', async () => {
    await pool.query(
      `UPDATE mini_sprints
          SET registration_open = false, status = 'REGISTRATION_CLOSED'
        WHERE id = 'mini-14'`
    )

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/ctf/mini-sprints/mini-14/register',
      payload: {...validParticipant, email: 'student@iitp.ac.in', pwnUsername: 'student'},
    })

    expect(response.statusCode).toBe(409)
    expect(response.json()).toMatchObject({
      success: false,
      error: { code: 'REGISTRATION_CLOSED' },
    })
  })
})
