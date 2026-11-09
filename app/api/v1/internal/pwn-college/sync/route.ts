import { getPrisma } from '@/lib/prisma'
import { failure, success } from '@/server/app'
import { PwnCollegeClient } from '@/server/pwn-college/client'
import { PwnCollegeRepository } from '@/server/pwn-college/repository'
import { syncPwnCollege } from '@/server/pwn-college/service'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function hasAuthorization(request: Request, token: string | undefined): boolean {
  const value = token?.trim()
  return Boolean(value) && request.headers.get('authorization') === `Bearer ${value}`
}

function isManualRequestAuthorized(request: Request): boolean {
  return hasAuthorization(request, process.env.PWN_COLLEGE_SYNC_TOKEN) ||
    hasAuthorization(request, process.env.CRON_SECRET)
}

function isCronRequestAuthorized(request: Request): boolean {
  return hasAuthorization(request, process.env.CRON_SECRET)
}

async function synchronize(): Promise<Response> {
  const repository = new PwnCollegeRepository(getPrisma())
  let lockAcquired = false
  try {
    lockAcquired = await repository.tryAcquireSyncLock(new Date())
    if (!lockAcquired) {
      return Response.json(failure('SYNC_IN_PROGRESS', 'A pwn.college synchronization is already running.'), {
        status: 409,
      })
    }

    const results = await syncPwnCollege(repository, PwnCollegeClient.fromEnvironment())
    const allSucceeded = results.every((result) => result.status === 'SUCCEEDED')
    return Response.json(success({ results }), { status: allSucceeded ? 200 : 502 })
  } catch (error) {
    console.error(error)
    return Response.json(
      failure('INTERNAL_ERROR', 'pwn.college synchronization could not be started.'),
      { status: 500 }
    )
  } finally {
    if (lockAcquired) await repository.releaseSyncLock()
  }
}

export async function POST(request: Request): Promise<Response> {
  if (!isManualRequestAuthorized(request)) {
    return Response.json(failure('UNAUTHORIZED', 'A valid synchronization token is required.'), { status: 401 })
  }
  return synchronize()
}

export async function GET(request: Request): Promise<Response> {
  if (!isCronRequestAuthorized(request)) {
    return Response.json(failure('UNAUTHORIZED', 'A valid Cron authorization token is required.'), { status: 401 })
  }
  return synchronize()
}
