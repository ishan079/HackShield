// @vitest-environment jsdom

import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import TeamSection from '@/components/TeamSection'

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
              exit: _exit,
              transition: _transition,
              whileHover: _whileHover,
              whileTap: _whileTap,
              whileInView: _whileInView,
              viewport: _viewport,
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
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }
})

describe('TeamSection Component', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders community organizers section heading and members from team content', () => {
    render(<TeamSection />)

    expect(screen.getByRole('heading', { level: 2, name: /Community Organizers/i })).toBeTruthy()

    // Key members from team content
    expect(screen.getByText('Shiwangini Shreya')).toBeTruthy()
    expect(screen.getByText('Advisor')).toBeTruthy()
    expect(screen.getByText('Aayush Babu')).toBeTruthy()
    expect(screen.getByText('Club Coordinator')).toBeTruthy()
    expect(screen.getByText('Yash Bhople')).toBeTruthy()
    expect(screen.getByText('Club Sub-coordinator')).toBeTruthy()
  })

  it('renders 4:5 portrait placeholders when image parameters are blank', () => {
    render(<TeamSection />)

    const placeholders = screen.getAllByText(/200 × 250|4:5/i)
    expect(placeholders.length).toBeGreaterThan(0)
  })

  it('renders bottom details with email and social links', () => {
    render(<TeamSection />)

    const shiwanginiEmail = screen.getByText('shiwangini_pa2508mch214@iitp.ac.in')
    expect(shiwanginiEmail).toBeTruthy()
    expect(shiwanginiEmail.getAttribute('href')).toBe('mailto:shiwangini_pa2508mch214@iitp.ac.in')

    const aayushEmail = screen.getByText('aayush_25s12res03@iitp.ac.in')
    expect(aayushEmail).toBeTruthy()
    expect(aayushEmail.getAttribute('href')).toBe('mailto:aayush_25s12res03@iitp.ac.in')
  })
})
