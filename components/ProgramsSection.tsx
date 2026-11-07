'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ProgramCardItem } from '@/types'

const programs: ProgramCardItem[] = [
  {
    index: '01',
    title: 'CyberSec Bootcamp',
    duration: '6-week structured intensive',
    description:
      'From fundamentals to advanced binary exploitation. Weekly hands-on labs, hardware hacking teardowns, and personal mentorship.',
    tag: 'Ended',
    dotColor: '#d33434',
  },
  {
    index: '02',
    title: 'CTF Practice',
    duration: 'PWN College/Hack the Box',
    description:
      'Collaborative drills across web exploitation, cryptography, reverse engineering, and forensics with senior club members.',
    tag: 'EVERY WEEK',
    dotColor: '#e8845b',
  },
  {
    index: '03',
    title: 'Guest Speaker Series',
    duration: 'Monthly Industry Keynotes',
    description:
      'Experienced engineers and certified professionals share unfiltered insights.',
    tag: 'MONTHLY',
    dotColor: '#60a5fa',
  },
]

export default function ProgramsSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.12 })

  return (
    <section
      ref={ref}
      id="programs"
      style={{
        width: '100%',
        padding: '60px 0 80px',
        maxWidth: '1280px',
        margin: '0 auto',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: '32px',
          marginBottom: '56px',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '14px',
            }}
          >
            <span
              style={{
                width: '24px',
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
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
              }}
            >
              PROGRAMS
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 4.4vw, 3.6rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              margin: 0,
            }}
          >
            Build. Practice. Grow.
          </h2>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            maxWidth: '440px',
          }}
        >
          <div
            style={{
              width: '1px',
              height: '56px',
              background: 'var(--border-strong)',
              flexShrink: 0,
            }}
          />
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1rem',
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
              margin: 0,
            }}
          >
            Structured programs, expert talks, and hands-on workshops to take
            you from curious to capable.
          </p>
        </div>
      </motion.div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {programs.map((p, idx) => (
          <motion.div
            key={p.index}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.6,
              delay: idx * 0.12,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              position: 'relative',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderTop: '1.5px solid var(--border-specular)',
              borderBottom: '1px solid var(--border-bottom)',
              borderRadius: '28px',
              padding: '36px 32px',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              boxShadow: 'var(--shadow-card)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'all 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.30)'
              e.currentTarget.style.borderTopColor = 'rgba(255, 255, 255, 0.58)'
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)'
              e.currentTarget.style.borderTopColor = 'var(--border-specular)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'var(--shadow-card)'
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background:
                  'linear-gradient(90deg, var(--accent) 0%, var(--accent-subtle) 100%)',
              }}
            />

            <div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  letterSpacing: '0.1em',
                  marginBottom: '16px',
                }}
              >
                {p.index}
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.45rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: '0 0 6px 0',
                  letterSpacing: '-0.01em',
                }}
              >
                {p.title}
              </h3>

              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                  marginBottom: '18px',
                }}
              >
                {p.duration}
              </div>

              <p
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.94rem',
                  lineHeight: 1.65,
                  color: 'var(--text-secondary)',
                  margin: '0 0 28px 0',
                }}
              >
                {p.description}
              </p>
            </div>

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '999px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                width: 'fit-content',
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: p.dotColor,
                  boxShadow: `0 0 10px ${p.dotColor}`,
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: 'var(--text-primary)',
                }}
              >
                {p.tag}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

