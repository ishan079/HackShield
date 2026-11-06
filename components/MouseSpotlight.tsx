'use client'

import React, { useState, useEffect } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import { useTheme } from '@/context/ThemeContext'

export default function MouseSpotlight() {
  const { theme } = useTheme()
  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)

  const springX = useSpring(mouseX, { stiffness: 180, damping: 28 })
  const springY = useSpring(mouseY, { stiffness: 180, damping: 28 })

  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      if (!visible) setVisible(true)
    }

    const handleMouseLeave = () => {
      setVisible(false)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [mouseX, mouseY, visible])

  if (!visible) return null

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        left: springX,
        top: springY,
        width: '560px',
        height: '560px',
        marginLeft: '-280px',
        marginTop: '-280px',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0,
        contain: 'strict',
        willChange: 'transform',
        background:
          theme === 'dark'
            ? 'radial-gradient(circle at center, rgba(232, 132, 91, 0.042) 0%, rgba(232, 132, 91, 0.016) 32%, rgba(232, 132, 91, 0.004) 55%, transparent 70%)'
            : 'radial-gradient(circle at center, rgba(216, 104, 62, 0.032) 0%, rgba(216, 104, 62, 0.012) 32%, rgba(216, 104, 62, 0.003) 55%, transparent 70%)',
      }}
    />
  )
}

