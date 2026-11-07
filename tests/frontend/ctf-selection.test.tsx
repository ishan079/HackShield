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

import CTFPage, { CTF_CATEGORIES, CTF_CATEGORIES_LIST } from '@/app/ctf/page'

describe('Dynamic CTF category selection', () => {
  beforeEach(() => {
    push.mockReset()
    mockSearchParams = new URLSearchParams('')
    vi.stubGlobal('scrollTo', vi.fn())
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('exposes category content in a structured object', () => {
    expect(CTF_CATEGORIES.flagship).toBeDefined()
    expect(CTF_CATEGORIES.mini).toBeDefined()
    expect(CTF_CATEGORIES.flagship.headingAccent).toBe('Capture The Flag.')
    expect(CTF_CATEGORIES.flagship.selectorBadge).toBe('BIANNUAL')
    expect(CTF_CATEGORIES.mini.selectorBadge).toBe('MONTHLY SPRINTS')
    expect(CTF_CATEGORIES_LIST).toHaveLength(2)
  })

  it('renders Flagship CTF content by default', () => {
    render(<CTFPage />)

    const flagshipTab = screen.getByRole('tab', { name: /Flagship CTF/i })
    const miniTab = screen.getByRole('tab', { name: /Mini CTF/i })

    expect(flagshipTab).toHaveAttribute('aria-selected', 'true')
    expect(miniTab).toHaveAttribute('aria-selected', 'false')

    // Badge
    expect(flagshipTab).toHaveTextContent('BIANNUAL')

    // Heading
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Capture The Flag.')

    // Description
    expect(
      screen.getByText(
        'Choose between our high-stakes national annual championship and our regular, fast-paced intra-club skill sprints.'
      )
    ).toBeInTheDocument()
  })

  it('dynamically switches heading, description, and active state when Mini CTF is clicked', async () => {
    const user = userEvent.setup()
    render(<CTFPage />)

    const miniTab = screen.getByRole('tab', { name: /Mini CTF/i })
    await user.click(miniTab)

    expect(push).toHaveBeenCalledWith('/ctf?type=mini', { scroll: false })

    const flagshipTab = screen.getByRole('tab', { name: /Flagship CTF/i })
    expect(miniTab).toHaveAttribute('aria-selected', 'true')
    expect(flagshipTab).toHaveAttribute('aria-selected', 'false')

    // Badge
    expect(miniTab).toHaveTextContent('MONTHLY SPRINTS')

    // Heading dynamically changes
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent(/Monthly Mini CTF/i)
    expect(heading).not.toHaveTextContent('Capture The Flag.')

    // Description dynamically changes
    expect(
      screen.getByText(/Fast-paced monthly intra-club CTF challenges/i)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(
        'Choose between our high-stakes national annual championship and our regular, fast-paced intra-club skill sprints.'
      )
    ).not.toBeInTheDocument()
  })

  it('supports keyboard navigation and activation using Space or Enter', async () => {
    const user = userEvent.setup()
    render(<CTFPage />)

    const miniTab = screen.getByRole('tab', { name: /Mini CTF/i })
    miniTab.focus()
    expect(miniTab).toHaveFocus()

    await user.keyboard(' ')

    expect(miniTab).toHaveAttribute('aria-selected', 'true')
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent(/Monthly Mini CTF/i)
  })

  it('initializes with Mini CTF content when URL parameter is ?type=mini', () => {
    mockSearchParams = new URLSearchParams('type=mini')
    render(<CTFPage />)

    const miniTab = screen.getByRole('tab', { name: /Mini CTF/i })
    expect(miniTab).toHaveAttribute('aria-selected', 'true')

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent(/Monthly Mini CTF/i)

    expect(
      screen.getByText(/Fast-paced monthly intra-club CTF challenges/i)
    ).toBeInTheDocument()
  })
})
