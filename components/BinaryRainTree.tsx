'use client'

import React, { useRef, useEffect, useCallback } from 'react'
import { useTheme } from '@/context/ThemeContext'
import { TreeParticle, AmbientParticle } from '@/types'

interface PaletteColor {
  r: number
  g: number
  b: number
  weight: number
}

export default function BinaryRainTree() {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const particlesRef = useRef<TreeParticle[]>([])
  const ambientParticlesRef = useRef<AmbientParticle[]>([])
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  })
  const lastFlickerRef = useRef(0)
  const smoothProgressRef = useRef(0)

  const PALETTE: PaletteColor[] =
    theme === 'light'
      ? [
          { r: 195, g: 80, b: 38, weight: 0.5 },
          { r: 155, g: 58, b: 26, weight: 0.25 },
          { r: 115, g: 42, b: 20, weight: 0.15 },
          { r: 215, g: 105, b: 58, weight: 0.1 },
        ]
      : [
          { r: 232, g: 132, b: 91, weight: 0.5 },
          { r: 255, g: 172, b: 128, weight: 0.25 },
          { r: 212, g: 98, b: 54, weight: 0.15 },
          { r: 255, g: 210, b: 180, weight: 0.1 },
        ]

  // Normalized Bonsai Tree Geometry Test (nx: 0..1, ny: 0..1)
  const isInsideTree = useCallback((nx: number, ny: number): boolean => {
    const distToSegment = (
      px: number,
      py: number,
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ) => {
      const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2
      if (l2 === 0) return Math.hypot(px - x1, py - y1)
      let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2
      t = Math.max(0, Math.min(1, t))
      return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)))
    }

    const inEllipse = (cx: number, cy: number, rx: number, ry: number) => {
      return (nx - cx) ** 2 / rx ** 2 + (ny - cy) ** 2 / ry ** 2 <= 1
    }

    // Roots
    if (distToSegment(nx, ny, 0.49, 0.68, 0.32, 0.78) < 0.038) return true
    if (distToSegment(nx, ny, 0.32, 0.78, 0.12, 0.85) < 0.024) return true
    if (distToSegment(nx, ny, 0.12, 0.85, 0.01, 0.88) < 0.014) return true
    if (distToSegment(nx, ny, 0.48, 0.74, 0.26, 0.86) < 0.022) return true
    if (distToSegment(nx, ny, 0.49, 0.7, 0.38, 0.89) < 0.018) return true

    if (distToSegment(nx, ny, 0.51, 0.68, 0.68, 0.78) < 0.038) return true
    if (distToSegment(nx, ny, 0.68, 0.78, 0.88, 0.85) < 0.024) return true
    if (distToSegment(nx, ny, 0.88, 0.85, 0.99, 0.88) < 0.014) return true
    if (distToSegment(nx, ny, 0.52, 0.74, 0.74, 0.86) < 0.022) return true
    if (distToSegment(nx, ny, 0.51, 0.7, 0.62, 0.89) < 0.018) return true

    if (ny >= 0.66 && ny <= 0.92 && Math.abs(nx - 0.5) < 0.045) return true

    // Trunk
    if (ny >= 0.42 && ny <= 0.7) {
      const p = (ny - 0.42) / 0.28
      const halfWidth = 0.028 + p * 0.038
      if (Math.abs(nx - 0.5) <= halfWidth) return true
    }

    // Branches
    if (distToSegment(nx, ny, 0.5, 0.44, 0.36, 0.34) < 0.03) return true
    if (distToSegment(nx, ny, 0.36, 0.34, 0.22, 0.3) < 0.022) return true
    if (distToSegment(nx, ny, 0.22, 0.3, 0.1, 0.34) < 0.016) return true

    if (distToSegment(nx, ny, 0.5, 0.44, 0.64, 0.34) < 0.03) return true
    if (distToSegment(nx, ny, 0.64, 0.34, 0.78, 0.3) < 0.022) return true
    if (distToSegment(nx, ny, 0.78, 0.3, 0.9, 0.34) < 0.016) return true

    if (distToSegment(nx, ny, 0.5, 0.44, 0.46, 0.25) < 0.024) return true
    if (distToSegment(nx, ny, 0.5, 0.44, 0.54, 0.25) < 0.024) return true
    if (distToSegment(nx, ny, 0.5, 0.25, 0.5, 0.14) < 0.02) return true

    // Canopy
    if (inEllipse(0.5, 0.13, 0.13, 0.08)) return true
    if (inEllipse(0.5, 0.22, 0.2, 0.11)) return true

    if (inEllipse(0.36, 0.19, 0.15, 0.1)) return true
    if (inEllipse(0.24, 0.26, 0.13, 0.08)) return true
    if (inEllipse(0.14, 0.33, 0.1, 0.07)) return true

    if (inEllipse(0.64, 0.19, 0.15, 0.1)) return true
    if (inEllipse(0.76, 0.26, 0.13, 0.08)) return true
    if (inEllipse(0.86, 0.33, 0.1, 0.07)) return true

    if (inEllipse(0.42, 0.31, 0.13, 0.08)) return true
    if (inEllipse(0.58, 0.31, 0.13, 0.08)) return true

    if (inEllipse(0.5, 0.26, 0.44, 0.22)) {
      const n = (Math.sin(nx * 38) + Math.cos(ny * 38)) * 0.5
      if (n > 0.42 && ny < 0.44) return true
    }

    return false
  }, [])

  // Initialize Particles (Tree Characters + Ambient Minimalist Rain Streams)
  const initParticles = useCallback(
    (w: number, h: number) => {
      const chars: TreeParticle[] = []
      const fontSize = 13
      const charPool = ['1', '0', '0', '1', '1', '0', '.', '1', '0', '1']
      const cols = 56
      const rows = 42

      let id = 0

      // Tree particles
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const nx = (col + 0.5) / cols
          const ny = (row + 0.5) / rows

          if (isInsideTree(nx, ny)) {
            const rand = Math.random()
            let color = PALETTE[0]
            let cumulative = 0
            for (const p of PALETTE) {
              cumulative += p.weight
              if (rand <= cumulative) {
                color = p
                break
              }
            }

            const baseOpacity =
              theme === 'light'
                ? 0.45 + Math.random() * 0.55
                : 0.35 + Math.random() * 0.65

            let detachThreshold = 0.05 + Math.random() * 0.25
            if (ny >= 0.38 && ny < 0.65) {
              detachThreshold = 0.25 + Math.random() * 0.3
            } else if (ny >= 0.65) {
              detachThreshold = 0.48 + Math.random() * 0.32
            }

            const chosenChar =
              charPool[Math.floor(Math.random() * charPool.length)]
            const lingersAsRain = Math.random() < 0.4

            chars.push({
              id: id++,
              nx,
              ny,
              char: chosenChar,
              treeChar: chosenChar,
              color,
              baseOpacity,
              currentOpacity: baseOpacity,
              targetOpacity: baseOpacity,
              fontSize,
              flickerSpeed: 0.045 + Math.random() * 0.075,
              detachThreshold,
              rainX: Math.random() * w,
              rainY: Math.random() * h,
              rainSpeed: 0.38 + Math.random() * 0.52,
              scrambleInterval: Math.floor(32 + Math.random() * 42),
              scrambleTimer: Math.floor(Math.random() * 30),
              isHead: Math.random() < 0.025,
              isAmbient: false,
              lingersAsRain,
            })
          }
        }
      }

      // Ambient rain streams
      const ambientCount = Math.floor(w / 48)
      const ambient: AmbientParticle[] = []
      for (let i = 0; i < ambientCount; i++) {
        const color = PALETTE[Math.floor(Math.random() * PALETTE.length)]
        ambient.push({
          id: id++,
          rainX: Math.random() * w,
          rainY: Math.random() * h,
          rainSpeed: 0.32 + Math.random() * 0.48,
          char: Math.random() > 0.5 ? '1' : '0',
          color,
          baseOpacity:
            theme === 'light'
              ? 0.035 + Math.random() * 0.06
              : 0.025 + Math.random() * 0.07,
          fontSize: 12 + Math.floor(Math.random() * 2),
          scrambleInterval: Math.floor(36 + Math.random() * 48),
          scrambleTimer: Math.floor(Math.random() * 30),
          isHead: Math.random() < 0.02,
          isAmbient: true,
        })
      }

      ambientParticlesRef.current = ambient
      return chars
    },
    [isInsideTree, PALETTE, theme]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let viewWidth = window.innerWidth
    let viewHeight = window.innerHeight

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1
      viewWidth = window.innerWidth
      viewHeight = window.innerHeight
      canvas.width = viewWidth * dpr
      canvas.height = viewHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      particlesRef.current = initParticles(viewWidth, viewHeight)
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    // Mouse proximity listener
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current.active = false
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    const charPool = ['1', '0', '0', '1', '1', '0', '.', '1', '0', '1']

    // Animation Loop
    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, viewWidth, viewHeight)

      const scrollY = window.scrollY || window.pageYOffset || 0
      const targetProgress = Math.min(1, Math.max(0, scrollY / 650))

      smoothProgressRef.current +=
        (targetProgress - smoothProgressRef.current) * 0.035
      const progress = smoothProgressRef.current

      const anchor = document.getElementById('binary-tree-anchor')
      let anchorRect = {
        left: viewWidth * 0.52,
        top: 140,
        width: Math.min(560, viewWidth * 0.44),
        height: 520,
      }

      if (anchor) {
        const r = anchor.getBoundingClientRect()
        if (r.width > 50 && r.height > 50) {
          anchorRect = {
            left: r.left,
            top: r.top,
            width: r.width,
            height: r.height,
          }
        }
      }

      const particles = particlesRef.current
      const ambient = ambientParticlesRef.current
      const mouse = mouseRef.current

      // Random character flicker
      if (progress < 0.6 && timestamp - lastFlickerRef.current > 65) {
        lastFlickerRef.current = timestamp
        const count = Math.floor(particles.length * 0.075)
        for (let i = 0; i < count; i++) {
          const idx = Math.floor(Math.random() * particles.length)
          if (particles[idx]) {
            particles[idx].targetOpacity =
              theme === 'light'
                ? 0.45 + Math.random() * 0.55
                : 0.35 + Math.random() * 0.65
            if (Math.random() > 0.4) {
              particles[idx].treeChar = Math.random() > 0.5 ? '1' : '0'
            }
          }
        }
      }

      // Ambient rain particles
      if (progress > 0.02) {
        const ambientAlphaMult = Math.min(0.22, progress * 0.28)
        for (let i = 0; i < ambient.length; i++) {
          const p = ambient[i]

          p.rainY += p.rainSpeed
          if (p.rainY > viewHeight + 20) {
            p.rainY = -20
            p.rainX = Math.random() * viewWidth
          }

          p.scrambleTimer++
          if (p.scrambleTimer >= p.scrambleInterval) {
            p.scrambleTimer = 0
            p.char =
              Math.random() > 0.45 ? (Math.random() > 0.5 ? '1' : '0') : '.'
          }

          let alpha = p.baseOpacity * ambientAlphaMult
          if (p.isHead) alpha = Math.min(0.24, alpha * 1.15)

          if (mouse.active) {
            const dist = Math.hypot(p.rainX - mouse.x, p.rainY - mouse.y)
            if (dist < 75) {
              alpha = Math.min(0.3, alpha + (1 - dist / 75) * 0.12)
            }
          }

          if (alpha > 0.008) {
            ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`
            ctx.font = `600 ${p.fontSize}px "JetBrains Mono", monospace`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(p.char, p.rainX, p.rainY)
          }
        }
      }

      // Tree particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        const treeScreenX = anchorRect.left + p.nx * anchorRect.width
        const treeScreenY = anchorRect.top + p.ny * anchorRect.height

        let renderX = treeScreenX
        let renderY = treeScreenY
        let renderChar = p.treeChar

        p.currentOpacity +=
          (p.targetOpacity - p.currentOpacity) * p.flickerSpeed
        let alpha = p.currentOpacity

        if (progress < p.detachThreshold) {
          const swayFactor = Math.max(0, 0.75 - p.ny) / 0.75
          const swayPhase = timestamp * 0.0024 + p.nx * 2.8 + p.ny * 2.2
          const treeSwayX = Math.sin(swayPhase) * swayFactor * 7
          const treeSwayY = Math.cos(swayPhase * 0.7) * swayFactor * 2.5

          renderX = treeScreenX + treeSwayX
          renderY = treeScreenY + treeSwayY
          renderChar = p.treeChar

          const pulseCycle = (timestamp % 3200) / 3200
          const waveY = 1.05 - pulseCycle * 1.15
          const distToWave = Math.abs(p.ny - waveY)
          if (distToWave < 0.09) {
            const waveGlow = (1 - distToWave / 0.09) * 0.45
            alpha = Math.min(1.0, alpha + waveGlow)
          }

          if (mouse.active) {
            const dx = renderX - mouse.x
            const dy = renderY - mouse.y
            const dist = Math.hypot(dx, dy)
            if (dist < 95 && dist > 0) {
              const pushForce = (1 - dist / 95) * 14 * swayFactor
              renderX += (dx / dist) * pushForce
              renderY += (dy / dist) * pushForce
              const glowBoost = (1 - dist / 95) * 0.6
              alpha = Math.min(1.0, alpha + glowBoost)
            }
          }
        } else {
          const localT = Math.min(1, (progress - p.detachThreshold) / 0.35)

          p.rainY += p.rainSpeed
          if (p.rainY > viewHeight + 20) {
            p.rainY = -20
            p.rainX = Math.random() * viewWidth
          }

          p.scrambleTimer++
          if (p.scrambleTimer >= p.scrambleInterval) {
            p.scrambleTimer = 0
            p.char = charPool[Math.floor(Math.random() * charPool.length)]
          }
          renderChar = p.char

          const scatterX =
            Math.sin(timestamp * 0.0012 + p.id) * 8 * (1 - localT)
          const scatterY =
            Math.cos(timestamp * 0.0012 + p.id) * 6 * (1 - localT)

          renderX = treeScreenX + (p.rainX - treeScreenX) * localT + scatterX
          renderY = treeScreenY + (p.rainY - treeScreenY) * localT + scatterY

          const targetRainFade = p.lingersAsRain ? 0.15 : 0
          alpha = alpha * (1 - localT * (1 - targetRainFade))
          if (p.isHead && p.lingersAsRain) {
            alpha = Math.min(0.24, alpha * 1.15)
          }
        }

        if (mouse.active && alpha > 0.01) {
          const dist = Math.hypot(renderX - mouse.x, renderY - mouse.y)
          if (dist < 85) {
            const glowBoost =
              (1 - dist / 85) *
              (progress < p.detachThreshold ? 0.55 : 0.14)
            alpha = Math.min(
              progress < p.detachThreshold ? 1.0 : 0.28,
              alpha + glowBoost
            )
          }
        }

        if (alpha > 0.008) {
          ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`
          ctx.font = `600 ${p.fontSize}px "JetBrains Mono", "Space Grotesk", monospace`
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(renderChar, renderX, renderY)
        }
      }

      animFrameRef.current = requestAnimationFrame(draw)
    }

    animFrameRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [initParticles, theme])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        display: 'block',
      }}
    />
  )
}

