'use client'

import React from 'react'
import { useTheme } from '@/context/ThemeContext'

export default function GrainOverlay() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        contain: 'strict',
        transition: 'background 0.35s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          background: isDark
            ? 'radial-gradient(ellipse at 50% 0%, rgba(56, 189, 248, 0.08) 0%, rgba(168, 85, 247, 0.06) 40%, rgba(10, 15, 20, 0) 80%)'
            : 'radial-gradient(ellipse at 50% 0%, rgba(56, 189, 248, 0.10) 0%, rgba(168, 85, 247, 0.08) 40%, rgba(248, 249, 250, 0) 80%)',
          opacity: 0.9,
        }}
      />

      <div
        className="hs-orb-1"
        style={{
          position: 'absolute',
          top: '-15%',
          left: '-10%',
          width: '1100px',
          height: '1000px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle at 45% 45%, rgba(56, 189, 248, 0.17) 0%, rgba(56, 189, 248, 0.10) 28%, rgba(14, 165, 233, 0.035) 55%, transparent 72%)'
            : 'radial-gradient(circle at 45% 45%, rgba(56, 189, 248, 0.14) 0%, rgba(56, 189, 248, 0.08) 28%, rgba(14, 165, 233, 0.025) 55%, transparent 72%)',
          willChange: 'transform',
        }}
      />

      <div
        className="hs-orb-2"
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-15%',
          width: '1150px',
          height: '1050px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.16) 0%, rgba(129, 140, 248, 0.09) 30%, rgba(129, 140, 248, 0.03) 58%, transparent 75%)'
            : 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.12) 0%, rgba(129, 140, 248, 0.07) 30%, rgba(129, 140, 248, 0.02) 58%, transparent 75%)',
          willChange: 'transform',
        }}
      />

      <div
        className="hs-orb-3"
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '-10%',
          width: '1100px',
          height: '1000px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.13) 0%, rgba(6, 182, 212, 0.075) 30%, rgba(6, 182, 212, 0.025) 58%, transparent 72%)'
            : 'radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.10) 0%, rgba(6, 182, 212, 0.055) 30%, rgba(6, 182, 212, 0.02) 58%, transparent 72%)',
          willChange: 'transform',
        }}
      />

      <div
        className="hs-orb-4"
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: '1200px',
          height: '1100px',
          borderRadius: '50%',
          background: isDark
            ? 'radial-gradient(circle at 50% 50%, rgba(244, 63, 94, 0.12) 0%, rgba(232, 132, 91, 0.07) 32%, rgba(232, 132, 91, 0.02) 60%, transparent 75%)'
            : 'radial-gradient(circle at 50% 50%, rgba(244, 114, 182, 0.11) 0%, rgba(216, 104, 62, 0.055) 32%, rgba(216, 104, 62, 0.015) 60%, transparent 75%)',
          willChange: 'transform',
        }}
      />

      <style>{`
        .hs-orb-1 {
          animation: hsOrbMove1 28s ease-in-out infinite alternate;
        }

        .hs-orb-2 {
          animation: hsOrbMove2 32s ease-in-out infinite alternate;
        }

        .hs-orb-3 {
          animation: hsOrbMove3 30s ease-in-out infinite alternate;
        }

        .hs-orb-4 {
          animation: hsOrbMove4 34s ease-in-out infinite alternate;
        }

        @keyframes hsOrbMove1 {
          0% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(80px, 50px, 0); }
          100% { transform: translate3d(30px, 100px, 0); }
        }

        @keyframes hsOrbMove2 {
          0% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(-90px, 60px, 0); }
          100% { transform: translate3d(-40px, -40px, 0); }
        }

        @keyframes hsOrbMove3 {
          0% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(90px, -50px, 0); }
          100% { transform: translate3d(-20px, -80px, 0); }
        }

        @keyframes hsOrbMove4 {
          0% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(-80px, -70px, 0); }
          100% { transform: translate3d(50px, -30px, 0); }
        }
      `}</style>
    </div>
  )
}

