import { describe, expect, it, vi } from 'vitest'
import nextConfig from '@/next.config.mjs'

const { redirect } = vi.hoisted(() => ({
  redirect: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect,
}))

import RegisterPage from '@/app/register/page'

describe('Register redirect configuration', () => {
  it('redirects /register to the mini-14 CTF registration destination in next.config', async () => {
    const config = nextConfig('phase-production-build')
    expect(config.redirects).toBeDefined()
    const redirects = await config.redirects!()
    const registerRedirect = redirects.find((r) => r.source === '/register')

    expect(registerRedirect).toBeDefined()
    expect(registerRedirect?.destination).toBe(
      '/ctf?type=mini&register=mini-14#registration-mini-14'
    )
    expect(registerRedirect?.permanent).toBe(false)
  })

  it('invokes Next.js redirect to mini-14 registration in the /register page component', () => {
    RegisterPage()
    expect(redirect).toHaveBeenCalledWith(
      '/ctf?type=mini&register=mini-14#registration-mini-14'
    )
  })
})
