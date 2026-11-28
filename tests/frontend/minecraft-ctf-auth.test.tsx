// @vitest-environment jsdom

import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/context/ThemeContext', () => ({ useTheme: () => ({ theme: 'dark', toggleTheme: vi.fn() }) }))
vi.mock('@/lib/api', () => ({
  api: { preRegisterFlagship: vi.fn().mockResolvedValue({ success: true, data: { registrationId: 'test-registration', ctfdUsername: 'test.participant', status: 'REGISTERED', registeredAt: '2026-11-28T00:00:00.000Z' } }) },
}))
vi.mock('framer-motion', async () => {
  const ReactModule = await import('react')
  const components = new Map<string, React.ComponentType<Record<string, unknown>>>()
  const motion = new Proxy({}, { get: (_target, tag: string) => {
    const existing = components.get(tag)
    if (existing) return existing
    const component = ReactModule.forwardRef<HTMLElement, Record<string, unknown>>(({ children, initial: _initial, animate: _animate, exit: _exit, transition: _transition, layoutId: _layoutId, ...props }, ref) => ReactModule.createElement(tag, { ...props, ref }, children as React.ReactNode))
    components.set(tag, component)
    return component
  } })
  return { motion, MotionConfig: ({ children }: { children: React.ReactNode }) => <>{children}</>, AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</> }
})

import MinecraftCTFAuthPage from '@/app/ctf/defendthevillage/auth/page'

describe('Defend The Village registration page', () => {
  beforeEach(() => vi.stubGlobal('scrollTo', vi.fn()))
  afterEach(() => { cleanup(); vi.unstubAllGlobals() })

  it('shows only registration and enforces client-side contact and username rules', async () => {
    const user = userEvent.setup()
    render(<MinecraftCTFAuthPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Defend The Village' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Sign In' })).not.toBeInTheDocument()
    expect(screen.getByLabelText('CTFd Username')).toHaveAttribute('maxLength', '64')
    expect(screen.getByLabelText('Mobile Number')).toHaveAttribute('maxLength', '10')

    await user.type(screen.getByLabelText('Full Name'), 'Test Participant')
    await user.type(screen.getByLabelText('Roll No.'), '2401CS01')
    await user.selectOptions(screen.getByLabelText('Subject'), 'BSc CSDA')
    await user.selectOptions(screen.getByLabelText('Semester'), '3')
    await user.type(screen.getByLabelText('Institute Email'), 'participant@iitp.ac.in')
    await user.type(screen.getByLabelText('CTFd Username'), 'bad name')
    await user.tab()
    expect(screen.getByRole('alert')).toHaveTextContent('spaces are not allowed')
    expect(screen.getByLabelText('CTFd Username')).toHaveAttribute('aria-invalid', 'true')
    await user.type(screen.getByLabelText('Mobile Number'), '9876543210')
    await user.click(screen.getByRole('button', { name: 'Submit Registration' }))
    expect(screen.getByRole('alert')).toHaveTextContent('spaces are not allowed')

    await user.clear(screen.getByLabelText('CTFd Username'))
    await user.type(screen.getByLabelText('CTFd Username'), 'test.participant')
    await user.click(screen.getByRole('button', { name: 'Submit Registration' }))
    expect(screen.getByRole('status')).toHaveTextContent('Registration complete for test.participant.')
  })
})
