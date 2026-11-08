'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { PillarItem } from '@/types'

const pillars: PillarItem[] = [
  {
    title: 'Learn',
    description: 'Build real security skills from the ground up.',
    icon: (
      <svg
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="var(--accent)" />
        <path d="M2 17l10 5 10-5" stroke="var(--accent)" />
        <path d="M2 12l10 5 10-5" stroke="var(--accent)" />
      </svg>
    ),
  },
  {
    title: 'Compete',
    description: 'Participate in Capture The Flag (CTF) events.',
    icon: (
      <svg
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
      </svg>
    ),
  },
  {
    title: 'Build',
    description: 'Create tools, research projects, and solutions.',
    icon: (
      <svg
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    title: 'Collaborate',
    description: 'Work with a passionate community of learners.',
    icon: (
      <svg
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
]

export default function Pillars() {
  const { ref, inView } = useInView({
    threshold: 0.15,
    triggerOnce: true,
  })

  return (
    <section
      ref={ref}
      style={{
        width: '100%',
        padding: '0',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          width: '100%',
          maxWidth: '1280px',
          margin: '0 auto',
        }}
        className="hs-pillars-grid"
      >
        {pillars.map((item, idx) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.55,
              delay: idx * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              padding: '16px 28px',
              borderRight:
                idx < pillars.length - 1
                  ? '1px solid var(--border-subtle)'
                  : 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              textAlign: 'left',
              transition: 'transform 0.25s ease',
            }}
            className="hs-pillar-col"
          >
            <div style={{ marginBottom: '12px' }}>{item.icon}</div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '8px',
                letterSpacing: '-0.01em',
              }}
            >
              {item.title}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                margin: 0,
                maxWidth: '220px',
              }}
            >
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hs-pillars-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .hs-pillar-col {
            border-right: none !important;
            border-bottom: 1px solid var(--border-subtle);
            padding: 16px 14px !important;
          }
        }
        @media (max-width: 500px) {
          .hs-pillars-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}

