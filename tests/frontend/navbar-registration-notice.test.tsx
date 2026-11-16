// @vitest-environment jsdom

import React from 'react'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

vi.mock('@/context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'dark', toggleTheme: vi.fn() }),
}))

import Navbar from '@/components/Navbar'

describe('Navbar registration status', () => {
  afterEach(() => cleanup())

  it('keeps the desktop Register control in place and shows the closed-registration notice', async () => {
    const user = userEvent.setup()
    render(<Navbar />)

    await user.click(
      screen.getByRole('button', { name: 'Registration is currently unavailable' })
    )

    expect(screen.getByRole('dialog')).toHaveTextContent(
      'No current event registrations are active.'
    )
    expect(screen.getByRole('button', { name: 'Got it' })).toHaveFocus()

    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })

  it('shows the same notice from the mobile Register control', async () => {
    const user = userEvent.setup()
    render(<Navbar />)

    await user.click(screen.getByLabelText('Toggle navigation menu'))
    await user.click(screen.getByRole('button', { name: /^Register/ }))

    expect(screen.getByRole('dialog')).toHaveTextContent(
      'No current event registrations are active.'
    )
  })
})
