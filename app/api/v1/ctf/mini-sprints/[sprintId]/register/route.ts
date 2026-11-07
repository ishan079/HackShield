import { getPrisma } from '@/lib/prisma'
import {
  failure,
  registrationSchema,
  sprintParamsSchema,
  success,
  validationFailure,
} from '@/server/app'
import {
  DuplicateRegistrationError,
  MiniSprintRepository,
  RegistrationClosedError,
  SprintNotFoundError,
} from '@/server/repositories/mini-sprint-repository'

export const runtime = 'nodejs'

interface RouteContext {
  params: Promise<{ sprintId: string }>
}

export async function POST(request: Request, context: RouteContext): Promise<Response> {
  const parsedParams = sprintParamsSchema.safeParse(await context.params)
  if (!parsedParams.success) {
    return Response.json(validationFailure(parsedParams.error), { status: 422 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json(failure('INVALID_REQUEST', 'The request body is not valid JSON.'), {
      status: 400,
    })
  }

  const parsedBody = registrationSchema.safeParse(body)
  if (!parsedBody.success) {
    return Response.json(validationFailure(parsedBody.error), { status: 422 })
  }

  try {
    const registration = await new MiniSprintRepository(getPrisma()).register(
      parsedParams.data.sprintId,
      parsedBody.data
    )
    return Response.json(success(registration), { status: 201 })
  } catch (error) {
    if (error instanceof SprintNotFoundError) {
      return Response.json(
        failure('SPRINT_NOT_FOUND', 'The requested sprint does not exist.'),
        { status: 404 }
      )
    }
    if (error instanceof RegistrationClosedError) {
      return Response.json(
        failure('REGISTRATION_CLOSED', 'Registration is closed for this sprint.'),
        { status: 409 }
      )
    }
    if (error instanceof DuplicateRegistrationError) {
      return Response.json(
        failure('ALREADY_REGISTERED', 'This participant is already registered.'),
        { status: 409 }
      )
    }
    console.error(error)
    return Response.json(
      failure('INTERNAL_ERROR', 'An unexpected server error occurred.'),
      { status: 500 }
    )
  }
}
