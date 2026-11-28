// @vitest-environment jsdom

import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

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
          ({ children, initial: _initial, animate: _animate, transition: _transition, ...props }, ref) =>
            ReactModule.createElement(tag, { ...props, ref }, children as React.ReactNode)
        )
        components.set(tag, component)
        return component
      },
    }
  )
  return { motion }
})

import CTFBanner from '@/components/CTFBanner'

describe('Home page CTFBanner', () => {
  afterEach(() => cleanup())

  it('renders the redesigned Defend The Village banner and links to /ctf/defendthevillage', () => {
    render(<CTFBanner />)

    const bannerLink = screen.getByRole('link', {
      name: /Explore Defend The Village Flagship CTF/i,
    })
    expect(bannerLink).toHaveAttribute('href', '/ctf/defendthevillage')
    expect(screen.getByRole('heading', { level: 2, name: /Defend The Village/i })).toBeInTheDocument()
    expect(bannerLink).toHaveTextContent('Explore Defend The Village')
    expect(bannerLink).toHaveTextContent('Dec 14, 2026')
    expect(bannerLink).toHaveTextContent('Teams of 1–4')
  })
})
