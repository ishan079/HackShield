import Fastify, { type FastifyInstance } from 'fastify'
import { z } from 'zod'
import {
  DuplicateRegistrationError,
  MiniSprintRepository,
  RegistrationClosedError,
  SprintNotFoundError,
} from '@/server/repositories/mini-sprint-repository'
import type { ApiFailure, ApiSuccess } from '@/types/api'

export const sprintParamsSchema = z
  .object({ sprintId: z.string().regex(/^mini-[a-zA-Z0-9-]+$/) })
  .strict()

export const registrationSchema = z
  .object({
    email: z
      .string()
      .trim()
      .email()
      .refine((email) => email.toLowerCase().endsWith('@iitp.ac.in'), {
        message: 'Must be a valid IIT Patna email address.',
      }),
    pwnUsername: z.string().trim().min(2).max(64).regex(/^[a-zA-Z0-9_.-]+$/),
  })
  .strict()

function timestamp(): string {
  return new Date().toISOString()
}

export function success<T>(data: T): ApiSuccess<T> {
  return { success: true, data, timestamp: timestamp() }
}

export function failure(
  code: string,
  message: string,
  details?: { field: string; issue: string }[]
): ApiFailure {
  return {
    success: false,
    error: { code, message, ...(details ? { details } : {}) },
    timestamp: timestamp(),
  }
}

export function validationFailure(error: z.ZodError): ApiFailure {
  return failure(
    'VALIDATION_ERROR',
    'One or more fields are invalid.',
    error.issues.map((issue) => ({
      field: issue.path.join('.') || 'request',
      issue: issue.message,
    }))
  )
}

export interface CreateAppOptions {
  repository: MiniSprintRepository
  logger?: boolean
}

export function createApp({
  repository,
  logger = process.env.NODE_ENV !== 'test',
}: CreateAppOptions): FastifyInstance {
  const app = Fastify({ logger })

  app.get('/api/v1/ctf/mini-sprints', async (_request, reply) => {
    const data = await repository.list()
    return reply.code(200).send(success(data))
  })

  app.post('/api/v1/ctf/mini-sprints/:sprintId/register', async (request, reply) => {
    const parsedParams = sprintParamsSchema.safeParse(request.params)
    const parsedBody = registrationSchema.safeParse(request.body)

    if (!parsedParams.success) {
      return reply.code(422).send(validationFailure(parsedParams.error))
    }
    if (!parsedBody.success) {
      return reply.code(422).send(validationFailure(parsedBody.error))
    }

    try {
      const registration = await repository.register(
        parsedParams.data.sprintId,
        parsedBody.data
      )
      return reply.code(201).send(success(registration))
    } catch (error) {
      if (error instanceof SprintNotFoundError) {
        return reply
          .code(404)
          .send(failure('SPRINT_NOT_FOUND', 'The requested sprint does not exist.'))
      }
      if (error instanceof RegistrationClosedError) {
        return reply
          .code(409)
          .send(failure('REGISTRATION_CLOSED', 'Registration is closed for this sprint.'))
      }
      if (error instanceof DuplicateRegistrationError) {
        return reply
          .code(409)
          .send(failure('ALREADY_REGISTERED', 'This participant is already registered.'))
      }
      throw error
    }
  })

  app.setNotFoundHandler((_request, reply) =>
    reply.code(404).send(failure('NOT_FOUND', 'Endpoint not found.'))
  )

  app.setErrorHandler((error, _request, reply) => {
    if ((error as { statusCode?: number }).statusCode === 400) {
      return reply
        .code(400)
        .send(failure('INVALID_REQUEST', 'The request body is not valid JSON.'))
    }
    app.log.error(error)
    return reply
      .code(500)
      .send(failure('INTERNAL_ERROR', 'An unexpected server error occurred.'))
  })

  return app
}
