import { success } from '@/server/app'
import { FROZEN_MINI_CTF_LEADERBOARD } from '@/server/pwn-college/frozen-mini-ctf-leaderboard'

export async function GET(): Promise<Response> {
  return Response.json(success({ windowDays: 30, entries: FROZEN_MINI_CTF_LEADERBOARD }))
}
