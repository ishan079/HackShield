'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'

const MountainScene = () => (
  <div
    style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      minHeight: '210px',
      overflow: 'hidden',
      background:
        'linear-gradient(180deg, #07070b 0%, #161016 40%, #2e1714 70%, #461f15 88%, #120e14 100%)',
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: '20%',
        left: '20%',
        width: '80%',
        height: '60%',
        background:
          'radial-gradient(ellipse at 40% 70%, rgba(245, 120, 65, 0.40) 0%, rgba(232, 132, 91, 0.12) 45%, transparent 75%)',
        pointerEvents: 'none',
      }}
    />

    <svg
      viewBox="0 0 440 220"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <defs>
        <linearGradient id="sunlit-peak-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffb582" />
          <stop offset="35%" stopColor="#f07a42" />
          <stop offset="70%" stopColor="#be4822" />
          <stop offset="100%" stopColor="#3d1814" />
        </linearGradient>

        <linearGradient id="shadow-peak-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#221a22" />
          <stop offset="50%" stopColor="#141118" />
          <stop offset="100%" stopColor="#08080d" />
        </linearGradient>

        <linearGradient id="dist-ridge-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#331b20" />
          <stop offset="100%" stopColor="#0e0c12" />
        </linearGradient>
      </defs>

      <polygon
        points="0,220 0,130 50,115 110,85 160,110 220,75 270,105 340,80 390,115 440,120 440,220"
        fill="url(#dist-ridge-grad)"
        opacity="0.85"
      />

      <polygon
        points="0,220 0,150 45,135 95,95 145,55 148,58 140,110 110,160 80,195 0,220"
        fill="url(#shadow-peak-grad)"
      />

      <polygon
        points="145,55 185,90 220,120 255,145 285,165 240,195 170,220 110,220 110,160 140,110 145,55"
        fill="url(#sunlit-peak-grad)"
      />

      <polygon
        points="145,55 160,75 175,70 195,100 215,95 240,125 210,140 185,115 160,95 145,55"
        fill="#ff9862"
        opacity="0.9"
      />

      <polygon
        points="70,115 95,95 115,120 90,135"
        fill="#ff7a3d"
        opacity="0.85"
      />
      <polygon
        points="95,95 145,55 130,95 105,115"
        fill="#ffb384"
        opacity="0.95"
      />

      <polygon
        points="220,120 280,85 340,125 385,150 440,160 440,220 260,220 220,160"
        fill="url(#shadow-peak-grad)"
      />
      <polygon
        points="280,85 305,105 330,100 360,130 330,145 295,120 280,85"
        fill="#d45e2c"
        opacity="0.85"
      />

      <polygon
        points="0,220 0,185 60,175 130,190 200,180 270,195 350,185 440,195 440,220"
        fill="#0a0a0f"
      />
    </svg>

    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '40%',
        background:
          'linear-gradient(180deg, transparent 0%, rgba(10, 10, 15, 0.95) 100%)',
      }}
    />
  </div>
)

export default function CTFBanner() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(260px, 340px) 1fr auto',
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
        style={{ height: '100%', minHeight: '210px' }}
        className="hs-ctf-visual"
      >
        <MountainScene />
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
            fontSize: 'clamp(1.7rem, 2.6vw, 2.3rem)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            margin: 0,
            lineHeight: 1.18,
            letterSpacing: '-0.02em',
          }}
        >
          HackShield CTF
        </h3>

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
            height: 180px !important;
            min-height: 180px !important;
          }
          .hs-ctf-text {
            padding: 28px 24px 16px !important;
          }
          .hs-ctf-action {
            padding: 0 24px 28px !important;
          }
        }
      `}</style>
    </motion.div>
  )
}