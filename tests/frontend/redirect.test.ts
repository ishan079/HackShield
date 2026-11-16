// @vitest-environment jsdom

import { render, screen } from '@testing-library/react'
import React from 'react'
import { describe, expect, it } from 'vitest'
import nextConfig from '@/next.config.mjs'

import RegisterPage from '@/app/register/page'

describe('Registration closed routing', () => {
  it('does not redirect /register to the Mini CTF registration form', async () => {
    const config = nextConfig('phase-production-build')
    expect(config.redirects).toBeUndefined()
  })

  it('shows the closed-registration status for legacy /register visits', () => {
    render(React.createElement(RegisterPage))
    expect(
      screen.getByRole('heading', { name: 'No current event registrations are active.' })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Return home' })).toHaveAttribute('href', '/')
  })
})
