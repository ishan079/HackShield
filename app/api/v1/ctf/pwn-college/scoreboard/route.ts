import { getPrisma } from '@/lib/prisma'
import { failure, success } from '@/server/app'
import { PwnCollegeRepository } from '@/server/pwn-college/repository'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
  try {
    const entries = await new PwnCollegeRepository(getPrisma()).getScoreboard()
    return Response.json(success({
      windowDays: 30,
      lastFetchedAt: entries[0]?.fetchedAt.toISOString() ?? null,
      entries,
    }))
  } catch (error) {
    console.error(error)
    return Response.json(
      failure('INTERNAL_ERROR', 'The cached pwn.college scoreboard is unavailable.'),
      { status: 500 }
    )
  }
}
