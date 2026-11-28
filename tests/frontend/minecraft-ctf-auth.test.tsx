// @vitest-environment jsdom

import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'dark', toggleTheme: vi.fn() }),
}))

vi.mock('framer-motion', async () => {
  const ReactModule = await import('react')
  const components = new Map<string, React.ComponentType<Record<string, unknown>>>()
  const motion = new Proxy(
    {},
    {
      get: (_target, tag: string) => {
        if (components.has(tag)) return components.get(tag)
        const component = ReactModule.forwardRef<HTMLElement, Record<string, unknown>>(
          (
            {
              children,
              initial: _initial,
              animate: _animate,
              exit: _exit,
              transition: _transition,
              layoutId: _layoutId,
              ...props
            },
            ref
          ) =>
            ReactModule.createElement(tag, { ...props, ref }, children as React.ReactNode)
        )
        components.set(tag, component)
        return component
      },
    }
  )

  return {
    motion,
    MotionConfig: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  }
})

import MinecraftCTFAuthPage from '@/app/ctf/defendthevillage/auth/page'

describe('Minecraft-themed CTF Login & Register page', () => {
  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn())
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('renders login by default, validates fields, and switches to register mode', async () => {
    const user = userEvent.setup()
    render(<MinecraftCTFAuthPage />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Defend The Village' })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Back to Defend The Village/i })).toHaveAttribute(
      'href',
      '/ctf/defendthevillage'
    )

    const loginTab = screen.getByRole('tab', { name: 'Login' })
    const registerTab = screen.getByRole('tab', { name: 'Register' })
    expect(loginTab).toHaveAttribute('aria-selected', 'true')

    await user.type(screen.getByLabelText('Institute Email'), 'invalid@example.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Sign In' }))

    expect(screen.getByRole('status')).toHaveTextContent('Use a valid @iitp.ac.in email address.')

    await user.click(registerTab)
    expect(registerTab).toHaveAttribute('aria-selected', 'true')

    expect(screen.queryByLabelText('Mobile Number')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Team Name')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Team Size')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('pwn.college Username')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Password')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Confirm')).not.toBeInTheDocument()

    await user.type(screen.getByLabelText('Full Name'), 'Test Participant')
    await user.type(screen.getByLabelText('Roll No.'), '2401CS01')
    await user.selectOptions(screen.getByLabelText('Subject'), 'BSc CSDA')
    await user.selectOptions(screen.getByLabelText('Semester'), '3')
    await user.type(screen.getByLabelText('Institute Email'), 'participant@example.com')
    await user.click(screen.getByRole('button', { name: 'Submit Registration' }))

    expect(screen.getByRole('status')).toHaveTextContent(
      'Enter a valid @iitp.ac.in institute email address.'
    )

    await user.clear(screen.getByLabelText('Institute Email'))
    await user.type(screen.getByLabelText('Institute Email'), 'participant@iitp.ac.in')
    await user.click(screen.getByRole('button', { name: 'Submit Registration' }))

    expect(screen.getByRole('status')).toHaveTextContent(
      'Details validated for Test Participant (2401CS01).'
    )
  })
})
