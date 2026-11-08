import { getPrisma } from '@/lib/prisma'
import { failure, success } from '@/server/app'
import { PwnCollegeClient } from '@/server/pwn-college/client'
import { PwnCollegeRepository } from '@/server/pwn-college/repository'
import { syncPwnCollege } from '@/server/pwn-college/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function isAuthorized(request: Request): boolean {
  const token = process.env.PWN_COLLEGE_SYNC_TOKEN?.trim() || process.env.CRON_SECRET?.trim()
  return Boolean(token) && request.headers.get('authorization') === `Bearer ${token}`
}

export async function POST(request: Request): Promise<Response> {
  if (!isAuthorized(request)) {
    return Response.json(failure('UNAUTHORIZED', 'A valid synchronization token is required.'), {
      status: 401,
    })
  }
  try {
    const results = await syncPwnCollege(
      new PwnCollegeRepository(getPrisma()),
      PwnCollegeClient.fromEnvironment()
    )
    const allSucceeded = results.every((result) => result.status === 'SUCCEEDED')
    return Response.json(success({ results }), { status: allSucceeded ? 200 : 502 })
  } catch (error) {
    console.error(error)
    return Response.json(
      failure('INTERNAL_ERROR', 'pwn.college synchronization could not be started.'),
      { status: 500 }
    )
  }
}
