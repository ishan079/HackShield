'use client'

import React from 'react'
import { motion, Variants } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const styles: Record<string, React.CSSProperties> = {
  section: {
    position: 'relative',
    overflow: 'hidden',
    padding: '120px 20px',
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.35s ease',
  },
  glowBorder: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    zIndex: 0,
  },
  glowBorderTop: {
    position: 'absolute',
    top: 0,
    left: '10%',
    right: '10%',
    height: '1px',
    background:
      'linear-gradient(90deg, transparent, rgba(232, 132, 91, 0.5), transparent)',
  },
  glowBorderBottom: {
    position: 'absolute',
    bottom: 0,
    left: '10%',
    right: '10%',
    height: '1px',
    background:
      'linear-gradient(90deg, transparent, rgba(232, 132, 91, 0.3), transparent)',
  },
  orbBase: {
    position: 'absolute',
    borderRadius: '50%',
    pointerEvents: 'none',
    zIndex: 0,
  },
  orb1: {
    width: '400px',
    height: '400px',
    background:
      'radial-gradient(circle, rgba(232, 132, 91, 0.12) 0%, transparent 70%)',
    top: '-100px',
    right: '-50px',
  },
  orb2: {
    width: '300px',
    height: '300px',
    background:
      'radial-gradient(circle, var(--accent-subtle) 0%, transparent 70%)',
    bottom: '-80px',
    left: '-30px',
  },
  orb3: {
    width: '250px',
    height: '250px',
    background:
      'radial-gradient(circle, rgba(232, 132, 91, 0.08) 0%, transparent 70%)',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
  content: {
    position: 'relative',
    zIndex: 1,
    maxWidth: '800px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
  },
  heading: {
    fontSize: 'clamp(2rem, 5vw, 3.2rem)',
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
    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
    color: 'var(--text-secondary)',
    lineHeight: 1.7,
    maxWidth: '600px',
    margin: 0,
  },
  buttonGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    justifyContent: 'center',
    marginTop: '16px',
  },
  buttonBase: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 32px',
    borderRadius: '50px',
    fontSize: '1rem',
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
    padding: '60px 48px',
    borderRadius: '28px',
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
  cardInnerGlow: {
    position: 'absolute',
    top: '-50%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80%',
    height: '200px',
    background:
      'radial-gradient(ellipse, rgba(232, 132, 91, 0.08) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
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

const orbFloat = (delay = 0) => ({
  animate: {
    y: [0, -20, 0],
    scale: [1, 1.05, 1],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut' as const,
      delay,
    },
  },
})

const glowPulse = {
  animate: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut' as const,
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
      <motion.div style={styles.glowBorder} {...glowPulse}>
        <div style={styles.glowBorderTop} />
        <div style={styles.glowBorderBottom} />
      </motion.div>

      <motion.div
        style={{ ...styles.orbBase, ...styles.orb1 }}
        {...orbFloat(0)}
      />
      <motion.div
        style={{ ...styles.orbBase, ...styles.orb2 }}
        {...orbFloat(2)}
      />
      <motion.div
        style={{ ...styles.orbBase, ...styles.orb3 }}
        {...orbFloat(4)}
      />

      <motion.div
        style={styles.cardWrapper}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
      >
        <div style={styles.cardInnerGlow} />

        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '28px',
            pointerEvents: 'none',
            zIndex: 0,
          }}
          animate={{
            boxShadow: [
              '0 0 20px rgba(232, 132, 91, 0.05), inset 0 0 20px rgba(232, 132, 91, 0.02)',
              '0 0 40px rgba(232, 132, 91, 0.1), inset 0 0 40px rgba(232, 132, 91, 0.04)',
              '0 0 20px rgba(232, 132, 91, 0.05), inset 0 0 20px rgba(232, 132, 91, 0.02)',
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

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

