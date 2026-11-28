import { describe, expect, it, vi } from 'vitest'
import {
  DuplicateFlagshipRegistrationError,
  FlagshipRegistrationRepository,
} from '@/server/repositories/flagship-registration-repository'

const request = {
  fullName: 'Test Student', rollNumber: '2401CS01', subject: 'BSc CSDA' as const,
  semester: 3, mobileNumber: '9876543210', email: 'student@iitp.ac.in', ctfdUsername: 'test.student',
}

describe('flagship registration storage', () => {
  it('normalizes identifiers and stores the participant without a password', async () => {
    const create = vi.fn().mockResolvedValue({
      id: 'reg-1', ctfdUsername: 'test.student', status: 'REGISTERED', registeredAt: new Date('2026-11-28T00:00:00Z'),
    })
    const result = await new FlagshipRegistrationRepository({ flagshipRegistration: { create } }).register(request)
    expect(result).toMatchObject({ registrationId: 'reg-1', ctfdUsername: 'test.student', status: 'REGISTERED' })
    expect(create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({
      emailNormalized: 'student@iitp.ac.in', ctfdUsernameNormalized: 'test.student', status: 'REGISTERED',
    }) }))
    expect(create.mock.calls[0][0].data).not.toHaveProperty('password')
  })

  it('maps a unique database constraint to a safe duplicate response', async () => {
    const create = vi.fn().mockRejectedValue({ code: 'P2002' })
    await expect(new FlagshipRegistrationRepository({ flagshipRegistration: { create } }).register(request))
      .rejects.toBeInstanceOf(DuplicateFlagshipRegistrationError)
  })
})
