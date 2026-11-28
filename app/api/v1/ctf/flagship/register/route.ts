import { getPrisma } from '@/lib/prisma'
import { failure, success, validationFailure } from '@/server/app'
import { flagshipRegistrationSchema } from '@/server/flagship'
import {
  DuplicateFlagshipRegistrationError,
  FlagshipRegistrationRepository,
} from '@/server/repositories/flagship-registration-repository'

export const runtime = 'nodejs'

export async function POST(request: Request): Promise<Response> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json(failure('INVALID_REQUEST', 'The request body is not valid JSON.'), { status: 400 })
  }
  const parsed = flagshipRegistrationSchema.safeParse(body)
  if (!parsed.success) return Response.json(validationFailure(parsed.error), { status: 422 })

  try {
    const repository = new FlagshipRegistrationRepository(getPrisma())
    return Response.json(success(await repository.register(parsed.data)), { status: 201 })
  } catch (error) {
    if (error instanceof DuplicateFlagshipRegistrationError) {
      return Response.json(failure('ALREADY_REGISTERED', error.message), { status: 409 })
    }
    console.error(error)
    return Response.json(failure('INTERNAL_ERROR', 'An unexpected server error occurred.'), { status: 500 })
  }
}
