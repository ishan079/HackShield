// @vitest-environment jsdom

import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { push } = vi.hoisted(() => ({
  push: vi.fn(),
}))

let mockSearchParams = new URLSearchParams('')

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => mockSearchParams,
}))

vi.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: vi.fn(), inView: true }),
}))

vi.mock('@/lib/api', () => ({
  api: {
    registerMiniSprint: vi.fn(),
  },
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

describe('Mini CTF page', () => {
  beforeEach(() => {
    push.mockReset()
    mockSearchParams = new URLSearchParams('')
    vi.stubGlobal('scrollTo', vi.fn())
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('renders only Mini CTF content and omits Flagship tabs or banners', () => {
    render(<CTFPage />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent(/Monthly Mini CTF/i)
    expect(
      screen.getByText(/Fast-paced monthly intra-club CTF challenges/i)
    ).toBeInTheDocument()

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
    expect(screen.queryByText(/UPCOMING FLAGSHIP TOURNAMENT/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Explore Flagship Tournament/i)).not.toBeInTheDocument()
  })

  it('links the Mini CTF card to the leaderboard', async () => {
    const user = userEvent.setup()
    render(<CTFPage />)

    expect(screen.queryByRole('button', { name: 'Join Sprint' })).not.toBeInTheDocument()
    expect(screen.getByText(/REGISTRATION CLOSED/)).toBeInTheDocument()
    expect(screen.getByText(/November 14,2026\|12:00 PM IST/)).toBeInTheDocument()
    expect(screen.getByText('96 Hours')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'View Leaderboard' }))
    expect(push).toHaveBeenCalledWith('/leaderboard')
    expect(screen.getByRole('button', { name: 'Opening leaderboard…' })).toBeDisabled()
  })
})
