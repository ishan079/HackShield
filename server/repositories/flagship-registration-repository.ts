import type { FlagshipRegistrationDto, FlagshipRegistrationRequest } from '@/types/api'

export class DuplicateFlagshipRegistrationError extends Error {}

interface RegistrationRow {
  id: string
  ctfdUsername: string
  status: string
  registeredAt: Date
}

interface FlagshipDatabase {
  flagshipRegistration: {
    create(args: unknown): Promise<RegistrationRow>
  }
}

export class FlagshipRegistrationRepository {
  constructor(private readonly database: FlagshipDatabase) {}

  async register(input: FlagshipRegistrationRequest): Promise<FlagshipRegistrationDto> {
    try {
      const row = await this.database.flagshipRegistration.create({
        data: {
          fullName: input.fullName.trim(),
          rollNumber: input.rollNumber.trim(),
          subject: input.subject,
          semester: input.semester,
          mobileNumber: input.mobileNumber.trim(),
          email: input.email.trim(),
          emailNormalized: input.email.trim().toLowerCase(),
          ctfdUsername: input.ctfdUsername.trim(),
          ctfdUsernameNormalized: input.ctfdUsername.trim().toLowerCase(),
          status: 'REGISTERED',
        },
      })
      return {
        registrationId: row.id,
        ctfdUsername: row.ctfdUsername,
        status: row.status as FlagshipRegistrationDto['status'],
        registeredAt: row.registeredAt.toISOString(),
      }
    } catch (error) {
      if ((error as { code?: string }).code === 'P2002') {
        throw new DuplicateFlagshipRegistrationError(
          'An account is already registered with one of these details.'
        )
      }
      throw error
    }
  }
}
