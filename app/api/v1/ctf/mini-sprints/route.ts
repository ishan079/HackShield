import { getPrisma } from '@/lib/prisma'
import { failure, success } from '@/server/app'
import { MiniSprintRepository } from '@/server/repositories/mini-sprint-repository'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
  try {
    const data = await new MiniSprintRepository(getPrisma()).list()
    return Response.json(success(data), { status: 200 })
  } catch (error) {
    console.error(error)
    return Response.json(
      failure('INTERNAL_ERROR', 'An unexpected server error occurred.'),
      { status: 500 }
    )
  }
}
