'use client'

import React from 'react'
import { motion } from 'framer-motion'
import BinaryRainTree from '@/components/BinaryRainTree'
import Hero from '@/components/Hero'
import Pillars from '@/components/Pillars'
import CTFBanner from '@/components/CTFBanner'
import ProgramsSection from '@/components/ProgramsSection'
import StatsSection from '@/components/StatsSection'
import TeamSection from '@/components/TeamSection'
import InteractiveTerminal from '@/components/InteractiveTerminal'
import CTASection from '@/components/CTASection'

export default function HomePage() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'relative',
        zIndex: 1,
        background: 'transparent',
        minHeight: '100vh',
        overflowX: 'hidden',
        color: 'var(--text-primary)',
        transition: 'color 0.35s ease',
      }}
    >
      <BinaryRainTree />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <Hero />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <Pillars />
        </div>

        <div
          style={{ maxWidth: 1280, margin: '60px auto', padding: '0 24px' }}
        >
          <CTFBanner />
        </div>

        <div
          style={{ maxWidth: 1280, margin: '40px auto', padding: '0 24px' }}
        >
          <ProgramsSection />
        </div>

        <div
          style={{ maxWidth: 1280, margin: '60px auto', padding: '0 24px' }}
        >
          <StatsSection />
        </div>

        <div
          style={{ maxWidth: 1280, margin: '40px auto', padding: '0 24px' }}
        >
          <InteractiveTerminal />
        </div>

        <div
          style={{ maxWidth: 1280, margin: '60px auto', padding: '0 24px' }}
        >
          <TeamSection />
        </div>

        <div
          style={{
            maxWidth: 1280,
            margin: '80px auto 40px',
            padding: '0 24px',
          }}
        >
          <CTASection />
        </div>
      </div>
    </motion.main>
  )
}

