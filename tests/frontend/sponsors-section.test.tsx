// @vitest-environment jsdom

import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import SponsorsSection from '@/components/SponsorsSection'
import { SponsorItem } from '@/types'

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

describe('SponsorsSection Component', () => {
  afterEach(() => {
    cleanup()
  })

  const mockSponsors: SponsorItem[] = [
    {
      id: 'custom-1',
      name: 'Custom Security',
      logo: '/sponsors/custom1.svg',
      tag: 'current',
      websiteUrl: 'https://custom.example.com',
    },
    {
      id: 'custom-2',
      name: 'Past Partner',
      logo: '/sponsors/custom2.svg',
      tag: 'previous',
    },
  ]

  it('renders section title and sponsors from data/sponsors.json with both categories present', () => {
    render(<SponsorsSection />)

    expect(screen.getByRole('heading', { level: 2, name: /Our Sponsors/i })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 3, name: /Current Sponsors/i })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 3, name: /Previous Sponsors/i })).toBeTruthy()

    // Sponsors from data/sponsors.json
    expect(screen.getByText('Nextute')).toBeTruthy()
    expect(screen.getByText('XYZ')).toBeTruthy()
  })

  it('renders passed sponsor items with proper grouping and links', () => {
    render(<SponsorsSection sponsors={mockSponsors} />)

    expect(screen.getByText('Custom Security')).toBeTruthy()
    expect(screen.getByText('Past Partner')).toBeTruthy()

    const link = screen.getByLabelText(/Visit Custom Security website/i)
    expect(link).toBeTruthy()
    expect(link.getAttribute('href')).toBe('https://custom.example.com')
    expect(link.getAttribute('target')).toBe('_blank')
  })
})
