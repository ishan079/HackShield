import { getPrisma } from '@/lib/prisma'
import { failure, success } from '@/server/app'
import { PwnCollegeRepository } from '@/server/pwn-college/repository'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(): Promise<Response> {
  try {
    const entries = await new PwnCollegeRepository(getPrisma()).getLeaderboard('mini-14')
    return Response.json(success({ windowDays: 30, entries }))
  } catch (error) {
    console.error(error)
    return Response.json(
      failure('INTERNAL_ERROR', 'The cached pwn.college leaderboard is unavailable.'),
      { status: 500 }
    )
  }
}
