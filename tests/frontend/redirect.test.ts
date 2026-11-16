// @vitest-environment jsdom

import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'
import nextConfig from '@/next.config.mjs'

import RegisterPage from '@/app/register/page'

describe('Registration closed routing', () => {
  it('redirects the retired Mini CTF direct-registration link before the page renders', async () => {
    const config = nextConfig('phase-production-build')
    expect(config.redirects).toBeDefined()

    const redirects = await config.redirects!()
    expect(redirects).toEqual([
      {
        source: '/ctf',
        has: [
          {
            type: 'query',
            key: 'register',
            value: 'mini-14',
          },
        ],
        destination: '/ctf?type=mini',
        permanent: false,
      },
    ])
  })

  it('shows the closed-registration status for legacy /register visits', () => {
    render(React.createElement(RegisterPage))
    expect(
      screen.getByRole('heading', { name: 'No current event registrations are active.' })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Return home' })).toHaveAttribute('href', '/')
  })
})
