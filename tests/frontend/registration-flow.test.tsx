// @vitest-environment jsdom

import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { push, registerMiniSprint } = vi.hoisted(() => ({
  push: vi.fn(),
  registerMiniSprint: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useSearchParams: () =>
    new URLSearchParams('type=mini&register=mini-14'),
}))

vi.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: vi.fn(), inView: true }),
}))

vi.mock('@/lib/api', () => ({
  api: { registerMiniSprint },
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
              whileHover: _whileHover,
              whileTap: _whileTap,
              layoutId: _layoutId,
              ...props
            },
            ref
          ) =>
            ReactModule.createElement(
              tag,
              { ...props, ref },
              children as React.ReactNode
            )
        )
        components.set(tag, component)
        return component
      },
    }
  )

  return {
    motion,
    AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
  }
})

import CTFPage from '@/app/ctf/page'
import { MINI_CTF_DECLARATION } from '@/components/MiniCtfRulebookModal'

async function acceptRulebook(user: ReturnType<typeof userEvent.setup>) {
  await user.click(
    await screen.findByRole('button', { name: 'Read the Mini CTF Rulebook' })
  )
  expect(
    await screen.findByRole('dialog', { name: 'pwn.college Rulebook' })
  ).toBeVisible()
  await user.click(screen.getByRole('button', { name: 'Close rulebook' }))
  await user.type(screen.getByRole('textbox', { name: 'Declaration' }), MINI_CTF_DECLARATION)
}

describe('Mini CTF frontend registration flow', () => {
  beforeEach(() => {
    push.mockReset()
    registerMiniSprint.mockReset()
    vi.stubGlobal('scrollTo', vi.fn())
    Element.prototype.scrollIntoView = vi.fn()
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('submits the direct-link form and renders confirmation', async () => {
    registerMiniSprint.mockResolvedValue({
      success: true,
      data: {
        registrationId: 'reg_123',
        sprintId: 'mini-14',
        email: 'student@iitp.ac.in',
        pwnUsername: 'student.pwn',
        status: 'CONFIRMED',
        arenaUrl: null,
        registeredAt: '2026-11-07T03:00:00.000Z',
      },
      timestamp: '2026-11-07T03:00:00.000Z',
    })
    const user = userEvent.setup()
    render(<CTFPage />)

    expect(
      await screen.findByRole('heading', { name: 'Mini CTF registration' })
    ).toBeVisible()
    await acceptRulebook(user)
    await user.type(
      screen.getByPlaceholderText('Your institute email address'),
      'student@iitp.ac.in'
    )
    await user.type(
      screen.getByPlaceholderText('Your pwn.college username'),
      'student.pwn'
    )
    await user.click(
      screen.getByRole('button', { name: 'Register for this sprint' })
    )

    expect(registerMiniSprint).toHaveBeenCalledWith('mini-14', {
      email: 'student@iitp.ac.in',
      pwnUsername: 'student.pwn',
    })
    expect(await screen.findByText(/Registration confirmed\. Reference: reg_123/)).toBeVisible()
    expect(
      screen.getByRole('button', { name: 'Registration confirmed' })
    ).toBeDisabled()
  })

  it('renders backend registration errors without losing form values', async () => {
    registerMiniSprint.mockResolvedValue({
      success: false,
      error: {
        code: 'ALREADY_REGISTERED',
        message: 'This participant is already registered.',
      },
      timestamp: '2026-11-07T03:00:00.000Z',
    })
    const user = userEvent.setup()
    render(<CTFPage />)

    const email = await screen.findByPlaceholderText(
      'Your institute email address'
    )
    const username = screen.getByPlaceholderText('Your pwn.college username')
    await acceptRulebook(user)
    await user.type(email, 'student@iitp.ac.in')
    await user.type(username, 'student.pwn')
    await user.click(
      screen.getByRole('button', { name: 'Register for this sprint' })
    )

    expect(
      await screen.findByText('This participant is already registered.')
    ).toBeVisible()
    expect(email).toHaveValue('student@iitp.ac.in')
    expect(username).toHaveValue('student.pwn')
  })

  it('requires opening the rulebook and the exact declaration before enabling registration', async () => {
    const user = userEvent.setup()
    render(<CTFPage />)

    await screen.findByRole('heading', { name: 'Mini CTF registration' })
    const registrationButton = screen.getByRole('button', {
      name: 'Register for this sprint',
    })
    expect(registrationButton).toBeDisabled()
    await user.click(
      screen.getByRole('button', { name: 'Read the Mini CTF Rulebook' })
    )
    expect(
      await screen.findByRole('dialog', { name: 'pwn.college Rulebook' })
    ).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Close rulebook' }))
    const declaration = screen.getByRole('textbox', { name: 'Declaration' })
    await user.type(declaration, 'I agree')
    expect(screen.getByText('The declaration must match exactly.')).toBeVisible()
    expect(registrationButton).toBeDisabled()
    await user.clear(declaration)
    await user.type(declaration, MINI_CTF_DECLARATION)
    expect(registrationButton).toBeEnabled()
    await user.click(
      registrationButton
    )

    expect(registerMiniSprint).not.toHaveBeenCalled()
    expect(
      screen.getByText('Institute email and pwn.college username are required.')
    ).toBeVisible()
  })

  it.each([
    [
      'student@example.com',
      'student.pwn',
      'Enter a valid @iitp.ac.in institute email address.',
    ],
    [
      'student@iitp.ac.in',
      'not valid!',
      'Username must be 2–64 characters using letters, numbers, dots, hyphens, or underscores.',
    ],
  ])(
    'blocks invalid participant details before calling the API',
    async (emailValue, usernameValue, message) => {
      const user = userEvent.setup()
      render(<CTFPage />)
      await acceptRulebook(user)

      await user.type(
        await screen.findByPlaceholderText('Your institute email address'),
        emailValue
      )
      await user.type(
        screen.getByPlaceholderText('Your pwn.college username'),
        usernameValue
      )
      await user.click(
        screen.getByRole('button', { name: 'Register for this sprint' })
      )

      expect(registerMiniSprint).not.toHaveBeenCalled()
      expect(screen.getByText(message)).toBeVisible()
    }
  )

  it('submits trimmed values when Enter is pressed', async () => {
    registerMiniSprint.mockResolvedValue({
      success: false,
      error: { code: 'TEST', message: 'Handled response.' },
      timestamp: '2026-11-07T03:00:00.000Z',
    })
    const user = userEvent.setup()
    render(<CTFPage />)
    await acceptRulebook(user)

    await user.type(
      await screen.findByPlaceholderText('Your institute email address'),
      '  student@iitp.ac.in  '
    )
    const username = screen.getByPlaceholderText('Your pwn.college username')
    await user.type(username, '  student.pwn  ')
    await user.type(username, '{Enter}')

    expect(registerMiniSprint).toHaveBeenCalledWith('mini-14', {
      email: 'student@iitp.ac.in',
      pwnUsername: 'student.pwn',
    })
  })
})
