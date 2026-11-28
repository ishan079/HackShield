// @vitest-environment jsdom

import React from 'react'
import { cleanup, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/context/ThemeContext', () => ({
  useTheme: () => ({ theme: 'dark', toggleTheme: vi.fn() }),
}))

vi.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: vi.fn(), inView: true }),
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
              whileInView: _whileInView,
              viewport: _viewport,
              transition: _transition,
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
    useMotionValue: () => ({ set: vi.fn() }),
    useSpring: (v: unknown) => v,
    useTransform: () => 0,
  }
})

import MinecraftCTFPage from '@/app/ctf/defendthevillage/page'

describe('Minecraft-themed DEFEND THE VILLAGE CTF page', () => {
  const originalHardwareConcurrency = navigator.hardwareConcurrency

  beforeEach(() => {
    vi.stubGlobal('scrollTo', vi.fn())
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('hover: hover'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      configurable: true,
      value: originalHardwareConcurrency,
    })
  })

  it('renders DEFEND THE VILLAGE hero, timeline, filterable categories, rules, and About HackShield info', async () => {
    const user = userEvent.setup()
    render(<MinecraftCTFPage />)

    expect(
      screen.getByRole('heading', { level: 1, name: /Defend\s*The\s*Village/i })
    ).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /Participate Now/i })[0]).toHaveAttribute(
      'href',
      '/ctf/defendthevillage/auth'
    )
    expect(screen.getByRole('link', { name: /About HackShield/i })).toHaveAttribute(
      'href',
      '#about-hackshield'
    )
    expect(
      screen.getByRole('heading', { level: 2, name: 'Defend The Village — 2026' })
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'How It Works' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: 'Competition Guidelines' })).toBeInTheDocument()

    // Filter categories cleanly
    await user.click(screen.getByRole('button', { name: 'Defensive & Intel' }))
    expect(screen.getByRole('heading', { level: 3, name: 'SOC & Defence' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 3, name: 'Web Security' })).not.toBeInTheDocument()

    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Demystifying cybersecurity from kernel to cloud.',
      })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Meet Organizers & Team/i })).toHaveAttribute(
      'href',
      '/about'
    )
    expect(screen.getByRole('link', { name: 'Programs' })).toHaveAttribute('href', '/programs')
    expect(screen.getByRole('link', { name: 'Security Toolkit' })).toHaveAttribute(
      'href',
      '/resources'
    )

    expect(screen.queryByText(/mini ctf/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /leaderboard/i })).not.toBeInTheDocument()
  })

  it('switches to low-performance animation tier on constrained devices', async () => {
    Object.defineProperty(navigator, 'hardwareConcurrency', {
      configurable: true,
      value: 2,
    })

    const { container } = render(<MinecraftCTFPage />)

    await waitFor(() => {
      expect(container.querySelector('main')).toHaveAttribute('data-perf', 'low')
    })
    expect(container.querySelectorAll('.mc-particle')).toHaveLength(3)
  })
})
