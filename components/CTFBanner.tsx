'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'

export default function CTFBanner() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px',
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr auto',
        alignItems: 'center',
        background: 'var(--bg-card)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid var(--border-subtle)',
        borderTop: '1.5px solid var(--border-specular)',
        borderBottom: '1px solid var(--border-bottom)',
        borderRadius: '28px',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-card)',
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto',
        transition: 'all 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="hs-ctf-card"
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.30)'
        e.currentTarget.style.borderTopColor = 'rgba(255, 255, 255, 0.58)'
        e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'
        e.currentTarget.style.transform = 'translateY(-3px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)'
        e.currentTarget.style.borderTopColor = 'var(--border-specular)'
        e.currentTarget.style.boxShadow = 'var(--shadow-card)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div
        style={{
          width: '300px',
          height: '375px',
          minWidth: '300px',
          minHeight: '375px',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden',
        }}
        className="hs-ctf-visual"
      >
        <Image
          src="/CTFPoster.webp"
          alt="HackShield CTF Flagship Poster"
          width={300}
          height={375}
          priority
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>

      <div
        style={{
          padding: '36px 44px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
        className="hs-ctf-text"
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
          }}
        >
          FLAGSHIP EVENT
        </span>

        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.7rem, 3vw, 3rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            margin: 0,
            lineHeight: 1.18,
            letterSpacing: '-0.02em',
          }}
        >
DEFEND THE VILLAGE        </h3>
          <h2
              style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1rem, 1.5vw, 2rem)',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  margin: 0,
                  lineHeight: 1.18,
                  letterSpacing: '-0.02em',
              }}
          >
              HackShield CTF
          </h2>

        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '0.98rem',
            color: 'var(--text-secondary)',
            margin: 0,
            lineHeight: 1.65,
            maxWidth: '480px',
          }}
        >
          Our biannual Capture The Flag — real challenges, real skills, a strong community.
        </p>
      </div>

      <div style={{ padding: '0 44px' }} className="hs-ctf-action">
        <Link
          href="/ctf"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            border: '1.5px solid var(--accent)',
            borderRadius: '8px',
            background: 'transparent',
            color: 'var(--accent)',
            fontFamily: 'var(--font-sans)',
            fontSize: '0.92rem',
            fontWeight: 600,
            textDecoration: 'none',
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--accent)'
            e.currentTarget.style.color = '#ffffff'
            e.currentTarget.style.boxShadow = '0 0 20px var(--accent-glow)'
            e.currentTarget.style.transform = 'translateY(-2px)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--accent)'
            e.currentTarget.style.boxShadow = 'none'
            e.currentTarget.style.transform = 'translateY(0)'
          }}
        >
          <span>Explore CTF</span>
          <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>↗</span>
        </Link>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hs-ctf-card {
            grid-template-columns: 1fr !important;
          }
          .hs-ctf-visual {
            width: 100% !important;
            max-width: 300px !important;
            height: 375px !important;
            min-height: 0 !important;
            margin: 0 auto !important;
          }
          .hs-ctf-text {
            padding: 28px 24px 16px !important;
          }
          .hs-ctf-action {
            padding: 0 24px 28px !important;
          }
        }
        @media (max-width: 360px) {
          .hs-ctf-visual {
            width: 100% !important;
            height: auto !important;
            aspect-ratio: 4 / 5 !important;
          }
        }
      `}</style>
    </motion.div>
  )
}
