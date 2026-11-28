import { beforeEach, describe, expect, it, vi } from 'vitest'

const state = vi.hoisted(() => ({ create: vi.fn() }))
vi.mock('@/lib/prisma', () => ({ getPrisma: () => ({ flagshipRegistration: { create: state.create } }) }))

import { POST } from '@/app/api/v1/ctf/flagship/register/route'

const valid = {
  fullName: 'Test Student', rollNumber: '2401CS01', subject: 'BSc CSDA', semester: 3,
  mobileNumber: '9876543210', email: 'student@iitp.ac.in', ctfdUsername: 'test.student',
}

function request(body: unknown) {
  return new Request('http://localhost/api/v1/ctf/flagship/register', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
}

describe('flagship registration route', () => {
  beforeEach(() => state.create.mockReset().mockResolvedValue({ id: 'reg-1', ctfdUsername: 'test.student', status: 'REGISTERED', registeredAt: new Date('2026-11-28T00:00:00Z') }))

  it('persists a valid participant and returns a standard 201 response', async () => {
    const response = await POST(request(valid))
    expect(response.status).toBe(201)
    await expect(response.json()).resolves.toMatchObject({ success: true, data: { registrationId: 'reg-1', status: 'REGISTERED' } })
  })

  it('rejects a username with spaces and a phone number that is not exactly ten digits', async () => {
    const username = await POST(request({ ...valid, ctfdUsername: 'not allowed' }))
    const mobile = await POST(request({ ...valid, mobileNumber: '98765432101' }))
    expect(username.status).toBe(422)
    expect(mobile.status).toBe(422)
    expect(state.create).not.toHaveBeenCalled()
  })

  it('returns a conflict for a duplicate database identifier', async () => {
    state.create.mockRejectedValueOnce({ code: 'P2002' })
    const response = await POST(request(valid))
    expect(response.status).toBe(409)
    await expect(response.json()).resolves.toMatchObject({ success: false, error: { code: 'ALREADY_REGISTERED' } })
  })
})
