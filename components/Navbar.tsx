'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { NavLinkItem } from '@/types'

const NAV_LINKS: NavLinkItem[] = [
  { to: '/', label: 'Home' },
  { to: '/programs', label: 'Programs' },
  { to: '/ctf', label: 'CTF' },
  { to: '/resources', label: 'Resources' },
  { to: '/about', label: 'About' },
]

const ShieldLogo = ({ size = 28 }: { size?: number }) => (
  <Image
    src="/favicon.svg"
    alt="HackShield Logo"
    width={size}
    height={size}
    style={{
      width: `${size}px`,
      height: `${size}px`,
      objectFit: 'contain',
      flexShrink: 0,
      display: 'block',
      filter: 'drop-shadow(0 2px 8px rgba(168, 85, 247, 0.4))',
      transition: 'transform 0.25s ease',
    }}
    priority
  />
)

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const [scrolled, setScrolled] = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pointerEvents: 'none',
          padding: scrolled ? '14px 16px 0' : '0 24px',
          gap: scrolled ? '10px' : '16px',
          transition: 'padding 0.42s cubic-bezier(0.16, 1, 0.3, 1), gap 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <Link
          href="/register"
          className="hs-register-overlay-btn"
          aria-label="Register for HackShield CTF"
          style={{
            pointerEvents: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            height: scrolled ? '44px' : '48px',
            padding: scrolled ? '0 16px' : '0 20px',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
            color: '#ffffff',
            fontSize: scrolled ? '0.84rem' : '0.88rem',
            fontWeight: 700,
            letterSpacing: '0.01em',
            textDecoration: 'none',
            border: isDark
              ? '1px solid rgba(255, 255, 255, 0.28)'
              : '1px solid rgba(255, 255, 255, 0.45)',
            boxShadow: scrolled
              ? '0 8px 24px -2px rgba(168, 85, 247, 0.55), 0 3px 10px -2px rgba(126, 34, 206, 0.5), inset 0 1px 1px 0 rgba(255, 255, 255, 0.65)'
              : '0 6px 20px -2px rgba(168, 85, 247, 0.45), inset 0 1px 1px 0 rgba(255, 255, 255, 0.55)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            transition: 'all 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
            cursor: 'pointer',
            flexShrink: 0,
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1,
            }}
          >
            Register
          </span>
          <span
            className="hs-register-arrow"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: scrolled ? '20px' : '22px',
              height: scrolled ? '20px' : '22px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.25)',
              boxShadow:
                'inset 0 1px 1px 0 rgba(255, 255, 255, 0.5), 0 1px 2px rgba(0, 0, 0, 0.15)',
              color: '#ffffff',
              fontSize: '0.82rem',
              fontWeight: 800,
              lineHeight: 1,
              transition:
                'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), width 0.42s ease, height 0.42s ease',
            }}
          >
            ↗
          </span>
        </Link>

        <header
          style={{
            pointerEvents: 'auto',
            width: scrolled ? 'min(860px, calc(100% - 32px))' : '100%',
            maxWidth: scrolled ? '860px' : '1280px',
            height: scrolled ? '54px' : '76px',
            borderRadius: scrolled ? '9999px' : '0px',
            overflow: 'hidden',
            backgroundColor: scrolled
              ? isDark
                ? 'rgba(13, 18, 25, 0.82)'
                : 'rgba(255, 255, 255, 0.90)'
              : 'transparent',
            backdropFilter: scrolled ? 'blur(16px)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
            borderTop: scrolled
              ? isDark
                ? '1px solid rgba(255, 255, 255, 0.16)'
                : '1px solid rgba(255, 255, 255, 0.95)'
              : '1px solid transparent',
            borderLeft: scrolled
              ? isDark
                ? '1px solid rgba(255, 255, 255, 0.12)'
                : '1px solid rgba(0, 0, 0, 0.08)'
              : '1px solid transparent',
            borderRight: scrolled
              ? isDark
                ? '1px solid rgba(255, 255, 255, 0.12)'
                : '1px solid rgba(0, 0, 0, 0.08)'
              : '1px solid transparent',
            borderBottom: scrolled
              ? isDark
                ? '1px solid rgba(255, 255, 255, 0.12)'
                : '1px solid rgba(0, 0, 0, 0.08)'
              : '1px solid transparent',
            boxShadow: scrolled
              ? isDark
                ? '0 20px 48px -10px rgba(0, 0, 0, 0.75), 0 8px 20px -4px rgba(0, 0, 0, 0.4), inset 0 1px 1px 0 rgba(255, 255, 255, 0.22)'
                : '0 16px 40px -10px rgba(0, 0, 0, 0.08), 0 4px 14px -2px rgba(0, 0, 0, 0.03), inset 0 1px 1px 0 rgba(255, 255, 255, 1)'
              : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSizing: 'border-box',
            flex: scrolled ? '0 1 auto' : '1 1 auto',
            transition: [
              'width 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
              'max-width 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
              'height 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
              'border-radius 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
              'background-color 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
              'border-color 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
              'box-shadow 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
              'backdrop-filter 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
              '-webkit-backdrop-filter 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
            ].join(', '),
            willChange: 'width, max-width, height, border-radius, box-shadow',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: scrolled ? '100%' : '1280px',
              height: '100%',
              padding: scrolled ? '0 10px 0 22px' : '0 32px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxSizing: 'border-box',
              transition:
                'padding 0.42s cubic-bezier(0.16, 1, 0.3, 1), max-width 0.42s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <Link
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
                cursor: 'pointer',
                userSelect: 'none',
                flexShrink: 0,
              }}
            >
              <ShieldLogo size={30} />
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.18rem',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: 'var(--text-primary)',
                    lineHeight: 1.15,
                  }}
                >
                  HackShield
                </span>
                {!scrolled && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.62rem',
                      fontWeight: 600,
                      letterSpacing: '0.14em',
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase',
                      marginTop: '2px',
                      whiteSpace: 'nowrap',
                    }}
                    className="hs-brand-sub"
                  >
                    IIT PATNA · CYBERSECURITY CLUB
                  </span>
                )}
              </div>
            </Link>

            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                position: 'relative',
              }}
              className="hs-desktop-nav"
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {NAV_LINKS.map((link, idx) => {
                const isActive =
                  link.to === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.to)

                return (
                  <Link
                    key={link.to}
                    href={link.to}
                    onMouseEnter={() => setHoveredIdx(idx)}
                    style={{
                      position: 'relative',
                      padding: '6px 14px',
                      fontSize: '0.88rem',
                      fontWeight: isActive ? 700 : 500,
                      color: isActive
                        ? 'var(--text-primary)'
                        : hoveredIdx === idx
                        ? 'var(--text-primary)'
                        : 'var(--text-secondary)',
                      textDecoration: 'none',
                      letterSpacing: '0.01em',
                      transition: 'color 0.2s ease',
                      display: 'inline-flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '9999px',
                      zIndex: 1,
                    }}
                  >
                    {hoveredIdx === idx && (
                      <motion.div
                        layoutId="nav-hover-pill"
                        transition={{
                          type: 'spring',
                          stiffness: 420,
                          damping: 32,
                        }}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          borderRadius: '9999px',
                          background: isDark
                            ? 'rgba(255, 255, 255, 0.08)'
                            : 'rgba(0, 0, 0, 0.05)',
                          border: isDark
                            ? '1px solid rgba(255, 255, 255, 0.12)'
                            : '1px solid rgba(255, 255, 255, 0.85)',
                          boxShadow: isDark
                            ? 'inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 2px 8px rgba(0, 0, 0, 0.2)'
                            : 'inset 0 1px 1px rgba(255, 255, 255, 0.95), 0 2px 8px rgba(0, 0, 0, 0.04)',
                          backdropFilter: 'blur(16px)',
                          WebkitBackdropFilter: 'blur(16px)',
                          zIndex: -1,
                        }}
                      />
                    )}

                    <span>{link.label}</span>

                    {isActive && (
                      <motion.div
                        layoutId="nav-active-indicator"
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 30,
                        }}
                        style={{
                          position: 'absolute',
                          bottom: '3px',
                          width: '16px',
                          height: '2px',
                          borderRadius: '2px',
                          background: 'var(--accent)',
                          boxShadow: '0 0 8px var(--accent-glow)',
                        }}
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexShrink: 0,
              }}
            >
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isDark
                    ? scrolled
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(255, 255, 255, 0.05)'
                    : scrolled
                    ? 'rgba(255, 255, 255, 0.75)'
                    : 'rgba(0, 0, 0, 0.04)',
                  border: isDark
                    ? '1px solid rgba(255, 255, 255, 0.14)'
                    : '1px solid rgba(0, 0, 0, 0.08)',
                  boxShadow: isDark
                    ? 'inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 2px 8px rgba(0, 0, 0, 0.25)'
                    : 'inset 0 1px 1px rgba(255, 255, 255, 1), 0 2px 6px rgba(0, 0, 0, 0.04)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  transition:
                    'transform 0.2s ease, border-color 0.2s ease, color 0.2s ease, background-color 0.3s ease',
                  flexShrink: 0,
                  outline: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.06)'
                  e.currentTarget.style.borderColor = 'var(--accent)'
                  e.currentTarget.style.color = 'var(--accent)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.borderColor = isDark
                    ? 'rgba(255, 255, 255, 0.14)'
                    : 'rgba(0, 0, 0, 0.08)'
                  e.currentTarget.style.color = 'var(--text-primary)'
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isDark ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Sun size={16} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Moon size={16} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <a
                href="https://chat.whatsapp.com/Kk4EPaNeHkp8oNQZ8O0ZR7"
                target="_blank"
                rel="noopener noreferrer"
                className="hs-join-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  height: '36px',
                  padding: '0 6px 0 14px',
                  borderRadius: '9999px',
                  background:
                    'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
                  color: '#ffffff',
                  fontSize: '0.83rem',
                  fontWeight: 700,
                  letterSpacing: '0.01em',
                  textDecoration: 'none',
                  boxShadow:
                    '0 4px 16px var(--accent-glow), inset 0 1px 1px 0 rgba(255, 255, 255, 0.45)',
                  transition:
                    'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease',
                  cursor: 'pointer',
                  flexShrink: 0,
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)'
                  e.currentTarget.style.boxShadow =
                    '0 6px 22px var(--accent-glow), inset 0 1px 1px 0 rgba(255, 255, 255, 0.6)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow =
                    '0 4px 16px var(--accent-glow), inset 0 1px 1px 0 rgba(255, 255, 255, 0.45)'
                }}
              >
                <span>Join the Club</span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.25)',
                    boxShadow:
                      'inset 0 1px 1px 0 rgba(255, 255, 255, 0.5), 0 1px 2px rgba(0, 0, 0, 0.1)',
                    color: '#ffffff',
                    fontSize: '0.84rem',
                    fontWeight: 800,
                    lineHeight: 1,
                    transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  className="hs-join-arrow"
                >
                  ↗
                </span>
              </a>

              <button
                type="button"
                aria-label="Toggle navigation menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="hs-mobile-toggle"
                style={{
                  display: 'none',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: isDark
                    ? 'rgba(255, 255, 255, 0.08)'
                    : 'rgba(255, 255, 255, 0.65)',
                  border: isDark
                    ? '1px solid rgba(255, 255, 255, 0.14)'
                    : '1px solid rgba(0, 0, 0, 0.08)',
                  boxShadow: isDark
                    ? 'inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 2px 8px rgba(0, 0, 0, 0.25)'
                    : 'inset 0 1px 1px rgba(255, 255, 255, 1), 0 2px 6px rgba(0, 0, 0, 0.04)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  cursor: 'pointer',
                  gap: '4px',
                  padding: 0,
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    width: '16px',
                    height: '2px',
                    background: 'var(--text-primary)',
                    borderRadius: '1px',
                    transition: 'all 0.25s ease',
                    transform: mobileMenuOpen
                      ? 'rotate(45deg) translate(4px, 4px)'
                      : 'none',
                  }}
                />
                <span
                  style={{
                    width: '16px',
                    height: '2px',
                    background: 'var(--text-primary)',
                    borderRadius: '1px',
                    transition: 'all 0.25s ease',
                    opacity: mobileMenuOpen ? 0 : 1,
                  }}
                />
                <span
                  style={{
                    width: '16px',
                    height: '2px',
                    background: 'var(--text-primary)',
                    borderRadius: '1px',
                    transition: 'all 0.25s ease',
                    transform: mobileMenuOpen
                      ? 'rotate(-45deg) translate(4px, -4px)'
                      : 'none',
                  }}
                />
              </button>
            </div>
          </div>
        </header>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.45)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                zIndex: 1000,
              }}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '300px',
                background: isDark
                  ? 'rgba(14, 20, 27, 0.92)'
                  : 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                borderLeft: isDark
                  ? '1px solid rgba(255, 255, 255, 0.12)'
                  : '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '-12px 0 45px rgba(0, 0, 0, 0.35)',
                zIndex: 1001,
                padding: '36px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '32px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <ShieldLogo size={30} />
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                      }}
                    >
                      HackShield
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '50%',
                      color: 'var(--text-primary)',
                      width: '34px',
                      height: '34px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                    }}
                  >
                    ✕
                  </button>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  {NAV_LINKS.map((link) => {
                    const isActive =
                      link.to === '/'
                        ? pathname === '/'
                        : pathname.startsWith(link.to)

                    return (
                      <Link
                        key={link.to}
                        href={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                          padding: '12px 18px',
                          borderRadius: '9999px',
                          fontSize: '1rem',
                          fontWeight: isActive ? 700 : 500,
                          color: isActive
                            ? 'var(--accent)'
                            : 'var(--text-primary)',
                          background: isActive
                            ? 'var(--accent-dim)'
                            : 'transparent',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <span>{link.label}</span>
                        {isActive && (
                          <span
                            style={{
                              color: 'var(--accent)',
                              fontSize: '0.8rem',
                            }}
                          >
                            ●
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>

              <div
                style={{
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '9999px',
                    background:
                      'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 16px rgba(168, 85, 247, 0.45)',
                  }}
                >
                  <span>Register</span>
                  <span>↗</span>
                </Link>
                <a
                  href="https://chat.whatsapp.com/Kk4EPaNeHkp8oNQZ8O0ZR7"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '12px',
                    borderRadius: '9999px',
                    background: 'var(--accent)',
                    color: '#ffffff',
                    fontWeight: 700,
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    boxShadow: '0 4px 16px var(--accent-glow)',
                  }}
                >
                  <span>Join the Community</span>
                  <span>↗</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .hs-register-overlay-btn:hover {
          transform: scale(1.03);
          box-shadow: 0 10px 28px -2px rgba(168, 85, 247, 0.7), inset 0 1px 1px 0 rgba(255, 255, 255, 0.75) !important;
        }
        .hs-register-overlay-btn:hover .hs-register-arrow {
          transform: translate(2px, -2px);
        }
        .hs-register-overlay-btn:active {
          transform: scale(0.97);
        }
        .hs-join-btn:hover .hs-join-arrow {
          transform: translate(2px, -2px);
        }
        @media (max-width: 920px) {
          .hs-desktop-nav {
            display: none !important;
          }
          .hs-join-btn {
            display: none !important;
          }
          .hs-mobile-toggle {
            display: flex !important;
          }
        }
        @media (max-width: 640px) {
          .hs-register-overlay-btn {
            height: 38px !important;
            padding: 0 12px !important;
            font-size: 0.80rem !important;
            gap: 5px !important;
          }
          .hs-register-arrow {
            width: 18px !important;
            height: 18px !important;
            font-size: 0.72rem !important;
          }
        }
        @media (max-width: 500px) {
          .hs-brand-sub {
            display: none !important;
          }
        }
        @media (max-width: 420px) {
          .hs-register-overlay-btn {
            height: 34px !important;
            padding: 0 10px !important;
            font-size: 0.76rem !important;
          }
          .hs-register-arrow {
            display: none !important;
          }
        }
      `}</style>
    </>
  )
}
