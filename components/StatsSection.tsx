'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { StatItemType } from '@/types'

const stats: StatItemType[] = [
  { value: 600, suffix: '+', label: 'Active Members', sub: 'Across BS, BS-MS, BSc, M.Tech & MCA' },
  { value: 4, suffix: '+', label: 'CTF Competitions', sub: 'Organized & Participated' },
  { value: 50, suffix: '+', label: 'Hands-on Labs', sub: 'Offensive & Defensive Workshops' },
  { value: 2, suffix: '+', label: 'Years of Excellence', sub: 'Founded at IIT Patna in 2024' },
]

function useCounter(target: number, isInView: boolean, duration = 1800): number {
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true

    const steps = 50
    const stepTime = duration / steps
    let step = 0

    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
      const current = Math.round(eased * target)
      setCount(current)

      if (step >= steps) {
        setCount(target)
        clearInterval(timer)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [isInView, target, duration])

  return count
}

function StatItem({
  item,
  idx,
  inView,
}: {
  item: StatItemType
  idx: number
  inView: boolean
}) {
  const count = useCounter(item.value, inView)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        padding: '32px 28px',
        borderRight:
          idx < stats.length - 1 ? '1px solid var(--border-subtle)' : 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
      className="hs-stat-col"
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'clamp(2.6rem, 4vw, 3.4rem)',
          fontWeight: 800,
          color: 'var(--text-primary)',
          lineHeight: 1,
          marginBottom: '8px',
          letterSpacing: '-0.03em',
          display: 'flex',
          alignItems: 'baseline',
          gap: '2px',
        }}
      >
        <span>{count}</span>
        <span style={{ color: 'var(--accent)', fontSize: '0.75em' }}>
          {item.suffix}
        </span>
      </div>

      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.02rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: '4px',
        }}
      >
        {item.label}
      </div>

      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '0.84rem',
          color: 'var(--text-muted)',
        }}
      >
        {item.sub}
      </div>
    </motion.div>
  )
}

export default function StatsSection() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })

  return (
    <section
      ref={ref}
      style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '20px auto 70px',
        borderRadius: '28px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderTop: '1.5px solid var(--border-specular)',
        borderBottom: '1px solid var(--border-bottom)',
        boxShadow: 'var(--shadow-card)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
        }}
        className="hs-stats-grid"
      >
        {stats.map((item, idx) => (
          <StatItem key={item.label} item={item} idx={idx} inView={inView} />
        ))}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hs-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .hs-stat-col {
            border-right: none !important;
            border-bottom: 1px solid var(--border-subtle);
          }
        }
        @media (max-width: 500px) {
          .hs-stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}

