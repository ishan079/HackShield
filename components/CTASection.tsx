'use client'

import type { CSSProperties } from 'react'
import { motion, Variants } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const styles: Record<string, CSSProperties> = {
  section: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
    padding: 'clamp(14px, 2vh, 24px) 16px',
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.35s ease',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '800px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '14px',
  },
  heading: {
    fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
    fontWeight: 700,
    color: 'var(--text-primary)',
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    margin: 0,
  },
  headingAccent: {
    color: 'var(--accent)',
  },
  subtext: {
    fontSize: 'clamp(0.92rem, 1.5vw, 1.05rem)',
    color: 'var(--text-secondary)',
    lineHeight: 1.55,
    maxWidth: '560px',
    margin: 0,
  },
  buttonGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center',
    marginTop: '6px',
  },
  buttonBase: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '11px 26px',
    borderRadius: '50px',
    fontSize: '0.94rem',
    fontWeight: 600,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    letterSpacing: '0.01em',
  },
  primaryButton: {
    background: 'var(--accent)',
    color: '#ffffff',
    border: 'none',
    boxShadow: '0 4px 24px var(--accent-glow)',
    fontWeight: 700,
  },
  outlinedButton: {
    background: 'var(--bg-card)',
    color: 'var(--accent)',
    border: '1.5px solid var(--accent)',
    backdropFilter: 'blur(8px)',
    fontWeight: 700,
  },
  cardWrapper: {
    position: 'relative',
    padding: 'clamp(28px, 3.5vw, 40px) clamp(20px, 3.5vw, 36px)',
    borderRadius: '24px',
    background: 'var(--bg-card)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    border: '1px solid var(--border-subtle)',
    borderTop: '1.5px solid var(--border-specular)',
    borderBottom: '1px solid var(--border-bottom)',
    boxShadow: 'var(--shadow-card)',
    maxWidth: '800px',
    width: '100%',
    zIndex: 1,
    overflow: 'hidden',
  },
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export default function CTASection() {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  })

  return (
    <section style={styles.section} ref={ref}>
      <motion.div
        style={styles.cardWrapper}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <div style={styles.content}>
          <motion.h2 style={styles.heading} variants={itemVariants}>
            Ready to Start Your{' '}
            <span style={styles.headingAccent}>Cybersecurity Journey</span>?
          </motion.h2>

          <motion.p style={styles.subtext} variants={itemVariants}>
            Join HackShield today and be part of IIT Patna&apos;s most active
            cybersecurity community.
          </motion.p>

          <motion.div style={styles.buttonGroup} variants={itemVariants}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <a
                href="https://chat.whatsapp.com/Kk4EPaNeHkp8oNQZ8O0ZR7"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...styles.buttonBase,
                  ...styles.primaryButton,
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0 6px 32px var(--accent-glow)'
                  e.currentTarget.style.background = 'var(--accent-hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0 4px 24px var(--accent-glow)'
                  e.currentTarget.style.background = 'var(--accent)'
                }}
              >
                Join the Community
                <ArrowUpRight size={18} strokeWidth={2.5} />
              </a>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/ctf"
                style={{
                  ...styles.buttonBase,
                  ...styles.outlinedButton,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--accent-dim)'
                  e.currentTarget.style.borderColor = 'var(--accent)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--bg-card)'
                  e.currentTarget.style.borderColor = 'var(--accent)'
                }}
              >
                Explore CTF
                <ArrowUpRight size={18} strokeWidth={2.5} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

