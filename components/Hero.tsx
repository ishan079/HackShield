'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

export default function Hero() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        padding: '108px 24px 20px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        flex: 1,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(320px, 1.15fr) minmax(320px, 1.1fr)',
          alignItems: 'center',
          gap: '48px',
        }}
        className="hs-hero-grid"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          style={{ zIndex: 2 }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <span
              style={{
                width: '28px',
                height: '2px',
                background: 'var(--accent)',
                display: 'inline-block',
                borderRadius: '1px',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
              }}
            >
              IIT PATNA CET CYBERSECURITY CLUB
            </span>
          </div>

          <h1
            style={{
              margin: '0 0 16px 0',
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(2.8rem, 5.5vw, 4.6rem)',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
            }}
          >
            Hack. Learn. Defend.
            <br />
            <span
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontStyle: 'italic',
                fontWeight: 400,
                color: 'var(--accent)',
                display: 'inline-block',
                marginTop: '4px',
              }}
            >
              Together.
            </span>
          </h1>

          <p
            style={{
              margin: '0 0 28px 0',
              fontFamily: 'var(--font-sans)',
              fontSize: '1.12rem',
              lineHeight: 1.75,
              color: 'var(--text-secondary)',
              maxWidth: '480px',
              fontWeight: 400,
            }}
          >
            A student-driven cybersecurity community at IIT Patna for learning,
            building, researching and competing in security.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <a
              href="https://chat.whatsapp.com/Kk4EPaNeHkp8oNQZ8O0ZR7"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'var(--accent)',
                color: '#ffffff',
                fontFamily: 'var(--font-sans)',
                fontWeight: 700,
                fontSize: '0.96rem',
                padding: '14px 26px',
                borderRadius: '8px',
                textDecoration: 'none',
                boxShadow: '0 10px 24px -6px var(--accent-glow)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--accent-hover)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow =
                  '0 14px 28px -4px var(--accent-glow)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'var(--accent)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow =
                  '0 10px 24px -6px var(--accent-glow)'
              }}
            >
              <span>Join the Community</span>
              <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>↗</span>
            </a>

            <a
              href="#story"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontWeight: 600,
                fontSize: '0.96rem',
                padding: '13px 24px',
                borderRadius: '8px',
                border: '1px solid var(--border-strong)',
                textDecoration: 'none',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.background = 'var(--bg-card-hover)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-strong)'
                e.currentTarget.style.background = 'var(--bg-card)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <span style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>
                ▷
              </span>
              <span>Our Story</span>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: '440px',
            zIndex: 1,
          }}
        >
          <div
            id="binary-tree-anchor"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              minHeight: '440px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          />
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hs-hero-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }
      `}</style>
    </section>
  )
}
