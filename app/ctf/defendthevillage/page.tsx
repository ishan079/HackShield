'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { MotionConfig, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  ArrowRight,
  ArrowUpRight,
  Binary,
  BookOpen,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  Cpu,
  Globe,
  HelpCircle,
  Lock,
  Radio,
  Search,
  Shield,
  Sparkles,
  Terminal,
  Trophy,
  Users,
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import './minecraft-ctf.css'

type PerfTier = 'high' | 'low'
type TrackFilter = 'all' | 'offensive' | 'defensive' | 'misc'

interface DisciplineItem {
  name: string
  tag: string
  track: Exclude<TrackFilter, 'all'>
  accent: string
  accentBg: string
  desc: string
  topics: string[]
  icon: React.ReactNode
}

interface PrincipleItem {
  title: string
  tag: string
  accent: string
  accentBg: string
  desc: string
  icon: React.ReactNode
}

const CTF_DISCIPLINES: DisciplineItem[] = [
  {
    name: 'Web Security',
    tag: 'WEB',
    track: 'offensive',
    accent: '#34d399',
    accentBg: 'rgba(52, 211, 153, 0.12)',
    desc: 'Exploit web applications from authentication flaws to server-side request smuggling.',
    topics: ['SQLi', 'SSRF', 'OAuth', 'JWT'],
    icon: <Globe size={20} color="#34d399" />,
  },
  {
    name: 'PWN',
    tag: 'PWN',
    track: 'offensive',
    accent: '#fb7185',
    accentBg: 'rgba(251, 113, 133, 0.12)',
    desc: 'Binary exploitation and memory corruption challenges targeting compiled services.',
    topics: ['Stack Overflow', 'ROP', 'Heap', 'Format String'],
    icon: <Terminal size={20} color="#fb7185" />,
  },
  {
    name: 'Reverse Engineering',
    tag: 'REV',
    track: 'offensive',
    accent: '#fb923c',
    accentBg: 'rgba(251, 146, 60, 0.12)',
    desc: 'Dissect ELF/PE binaries, defeat anti-debugging checks, and recover hidden logic.',
    topics: ['Ghidra', 'IDA Pro', 'x86/ARM', 'Unpacking'],
    icon: <Binary size={20} color="#fb923c" />,
  },
  {
    name: 'Cryptography',
    tag: 'CRYPTO',
    track: 'misc',
    accent: '#c084fc',
    accentBg: 'rgba(192, 132, 252, 0.14)',
    desc: 'Analyze flawed cipher implementations, number theory shortcuts, and oracle leaks.',
    topics: ['RSA', 'ECC', 'Padding Oracle', 'Block Ciphers'],
    icon: <Lock size={20} color="#c084fc" />,
  },
  {
    name: 'Digital Forensics & Steganography',
    tag: 'FORENSICS',
    track: 'defensive',
    accent: '#38bdf8',
    accentBg: 'rgba(56, 189, 248, 0.12)',
    desc: 'Inspect captured memory, network traffic, and embedded artifacts to reconstruct events.',
    topics: ['Volatility', 'PCAP', 'Disk Carving', 'Stego'],
    icon: <Search size={20} color="#38bdf8" />,
  },
  {
    name: 'OSINT & Recon',
    tag: 'OSINT',
    track: 'defensive',
    accent: '#fbbf24',
    accentBg: 'rgba(251, 191, 36, 0.12)',
    desc: 'Open-source intelligence gathering, geolocation, and public footprint correlation.',
    topics: ['Geolocation', 'Metadata', 'DNS', 'Footprinting'],
    icon: <Radio size={20} color="#fbbf24" />,
  },
  {
    name: 'AI Security',
    tag: 'AI',
    track: 'offensive',
    accent: '#a78bfa',
    accentBg: 'rgba(167, 139, 250, 0.14)',
    desc: 'Security risks in modern AI applications, agent tool boundaries, and model behavior.',
    topics: ['Prompt Injection', 'Guardrails', 'Extraction'],
    icon: <Bot size={20} color="#a78bfa" />,
  },
  {
    name: 'SOC & Defence',
    tag: 'SOC',
    track: 'defensive',
    accent: '#60a5fa',
    accentBg: 'rgba(96, 165, 250, 0.12)',
    desc: 'Real-world defense, alert triage, and incident timeline reconstruction from telemetry.',
    topics: ['SIEM Logs', 'Detection', 'Triage', 'Hardening'],
    icon: <Shield size={20} color="#60a5fa" />,
  },
  {
    name: 'Misc.',
    tag: 'MISC',
    track: 'misc',
    accent: '#e879f9',
    accentBg: 'rgba(232, 121, 249, 0.12)',
    desc: 'Restricted shell escapes, scripting puzzles, and cross-domain problem solving.',
    topics: ['Pyjail', 'Scripting', 'Protocols'],
    icon: <HelpCircle size={20} color="#e879f9" />,
  },
]

const TRACK_FILTERS: { id: TrackFilter; label: string }[] = [
  { id: 'all', label: 'All (9)' },
  { id: 'offensive', label: 'Offensive' },
  { id: 'defensive', label: 'Defensive & Intel' },
  { id: 'misc', label: 'Crypto & Misc' },
]

const EVENT_TIMELINE = [
  {
    step: '01',
    title: 'Create Team Account',
    desc: 'Sign in or register a squad of 1–4 participants using your institute email ahead of launch.',
  },
  {
    step: '02',
    title: 'Arena Opens Dec 14',
    desc: 'At 12:00 IST, 40+ bespoke challenges unlock simultaneously across all nine domains.',
  },
  {
    step: '03',
    title: '24h Jeopardy Sprint',
    desc: 'Capture flags across web, pwn, rev, crypto, forensics, and defense tracks in real time.',
  },
  {
    step: '04',
    title: 'Awards & Interviews',
    desc: 'Top scorers earn sponsored goodies, exclusive badges, and interviews with security sponsors.',
  },
]

const OPERATING_PRINCIPLES: PrincipleItem[] = [
  {
    title: 'Pragmatic Security First',
    tag: 'HANDS-ON',
    accent: '#34d399',
    accentBg: 'rgba(52, 211, 153, 0.12)',
    desc: 'Theory sets the stage. Practice steals the show. From memory buffers and network packets to reverse-engineering binaries, we dive straight into offensive and defensive security. Less slides, more bytes.',
    icon: <Terminal size={20} color="#34d399" />,
  },
  {
    title: 'Fiercely Collaborative',
    tag: 'COMMUNITY',
    accent: '#7dd3fc',
    accentBg: 'rgba(125, 211, 252, 0.12)',
    desc: 'No hacker works alone. From curious freshers to seasoned CTF warriors and alumni in top security firms and defense agencies, HackShield brings the entire crew together. Share knowledge, crack challenges, grow stronger.',
    icon: <Users size={20} color="#7dd3fc" />,
  },
  {
    title: 'Responsible & Ethical',
    tag: 'WHITE-HAT',
    accent: '#38bdf8',
    accentBg: 'rgba(56, 189, 248, 0.12)',
    desc: "With great hacking power comes great responsibility. Every lab and workshop stays within ethical boundaries, because breaking rules isn't the goal — breaking vulnerabilities is. White-hat mindset, from day one.",
    icon: <Lock size={20} color="#38bdf8" />,
  },
  {
    title: 'Systems-Level Thinking',
    tag: 'STACK-DEEP',
    accent: '#fbbf24',
    accentBg: 'rgba(251, 191, 36, 0.12)',
    desc: "From logic gates to cloud orchestration, we explore every layer of the stack. No blindly running scripts or scanners — understand what's happening under the hood, then make your move.",
    icon: <Cpu size={20} color="#fbbf24" />,
  },
]

const PORTAL_EMBERS = [
  { left: '54%', top: '18%', size: 3, delay: '0s', duration: '11s' },
  { left: '61%', top: '26%', size: 4, delay: '2.2s', duration: '12.5s' },
  { left: '69%', top: '14%', size: 3, delay: '4.1s', duration: '10.5s' },
  { left: '77%', top: '22%', size: 4, delay: '1.3s', duration: '12s' },
  { left: '85%', top: '16%', size: 3, delay: '3.4s', duration: '11.4s' },
  { left: '91%', top: '28%', size: 3, delay: '5.0s', duration: '13s' },
]

function detectPerformanceTier(): PerfTier {
  if (typeof window === 'undefined') return 'high'

  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const coarsePointer = window.matchMedia?.('(pointer: coarse)').matches
  const smallViewport = window.innerWidth < 768
  const nav = navigator as Navigator & {
    deviceMemory?: number
    connection?: { saveData?: boolean }
  }
  const lowCores = typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4
  const lowMemory = typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4
  const saveData = Boolean(nav.connection?.saveData)

  if (reducedMotion || saveData || lowCores || lowMemory || (coarsePointer && smallViewport)) {
    return 'low'
  }
  return 'high'
}

const EASE_SOOTHING: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function MinecraftCTFPage() {
  const { theme } = useTheme()
  const [perfTier, setPerfTier] = useState<PerfTier>('high')
  const [canParallax, setCanParallax] = useState(false)
  const [activeTrack, setActiveTrack] = useState<TrackFilter>('all')

  const { ref: heroRef, inView: heroInView } = useInView({
    threshold: 0.05,
    initialInView: true,
  })

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const smoothX = useSpring(pointerX, { stiffness: 55, damping: 26, mass: 0.6 })
  const smoothY = useSpring(pointerY, { stiffness: 55, damping: 26, mass: 0.6 })
  const backdropX = useTransform(smoothX, [-0.5, 0.5], [9, -9])
  const backdropY = useTransform(smoothY, [-0.5, 0.5], [7, -7])

  const targetDate = new Date('2026-12-14T12:00:00+05:30').getTime()

  const calculateTimeLeft = () => {
    const difference = targetDate - Date.now()
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / (1000 * 60)) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    window.scrollTo(0, 0)
    const detected = detectPerformanceTier()
    setPerfTier(detected)

    const finePointer = window.matchMedia?.('(hover: hover) and (pointer: fine)').matches
    setCanParallax(detected === 'high' && Boolean(finePointer))

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const visibleEmbers = useMemo(
    () => (perfTier === 'low' ? PORTAL_EMBERS.slice(0, 3) : PORTAL_EMBERS),
    [perfTier]
  )

  const filteredDisciplines = useMemo(
    () =>
      activeTrack === 'all'
        ? CTF_DISCIPLINES
        : CTF_DISCIPLINES.filter((item) => item.track === activeTrack),
    [activeTrack]
  )

  const handleHeroPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!canParallax) return
    const rect = event.currentTarget.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5)
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  const handleHeroPointerLeave = () => {
    if (!canParallax) return
    pointerX.set(0)
    pointerY.set(0)
  }

  const isLowPerf = perfTier === 'low'

  return (
    <MotionConfig reducedMotion="user">
      <main className="mc-ctf-page" data-perf={perfTier}>
        {theme === 'light' && <div className="mc-light-nav-scrim" aria-hidden="true" />}

        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <section
          ref={heroRef}
          className="mc-hero"
          data-paused={!heroInView ? 'true' : 'false'}
          aria-labelledby="mc-hero-heading"
          onPointerMove={handleHeroPointerMove}
          onPointerLeave={handleHeroPointerLeave}
        >
          <div className="mc-hero-backdrop" aria-hidden="true">
            <motion.div
              className="mc-hero-parallax"
              style={canParallax ? { x: backdropX, y: backdropY } : undefined}
            >
              <div className="mc-hero-image-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/minecraft-ctf-backdrop.jpg"
                  alt=""
                  className="mc-hero-image"
                />
              </div>
            </motion.div>

            <div className="mc-portal-aura" />
            <div className="mc-hero-vignette" />

            <div className="mc-portal-particles">
              {visibleEmbers.map((ember, idx) => (
                <span
                  key={idx}
                  className="mc-particle"
                  style={{
                    left: ember.left,
                    top: ember.top,
                    width: `${ember.size}px`,
                    height: `${ember.size}px`,
                    animationDelay: ember.delay,
                    animationDuration: ember.duration,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="mc-hero-inner">
            <div>
              <motion.div
                className="mc-eyebrow"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE_SOOTHING }}
              >
                <span className="mc-eyebrow-dot" aria-hidden="true" />
                <span>HackShield · IIT Patna Flagship CTF</span>
              </motion.div>

              <h1 id="mc-hero-heading" className="mc-minecraft-title">
                <motion.span
                  className="mc-title-stone"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.52, delay: 0.06, ease: EASE_SOOTHING }}
                >
                  Defend
                </motion.span>
                <motion.span
                  className="mc-title-stone"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.52, delay: 0.12, ease: EASE_SOOTHING }}
                >
                  The
                </motion.span>
                <motion.span
                  className="mc-title-amethyst"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.56, delay: 0.18, ease: EASE_SOOTHING }}
                >
                  Village
                </motion.span>
              </h1>

              <motion.p
                className="mc-hero-copy"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.52, delay: 0.24, ease: EASE_SOOTHING }}
              >
                Our 24-hour jeopardy cybersecurity championship featuring 40+
                original challenges built from scratch by IIT Patna researchers.
              </motion.p>

              <motion.div
                className="mc-hero-actions"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.52, delay: 0.3, ease: EASE_SOOTHING }}
              >
                <Link href="/ctf/defendthevillage/auth" className="mc-btn-primary">
                  <span>Participate Now</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
                <a href="#about-hackshield" className="mc-btn-secondary">
                  <span>About HackShield</span>
                </a>
              </motion.div>
            </div>

            <div aria-hidden="true" />
          </div>

          <motion.div
            className="mc-hero-strip"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.36, ease: EASE_SOOTHING }}
          >
            <div className="mc-hero-strip-item">
              <span className="mc-hero-strip-label">Launch Date</span>
              <span className="mc-hero-strip-value">December 14, 2026</span>
            </div>
            <div className="mc-hero-strip-item">
              <span className="mc-hero-strip-label">Format &amp; Duration</span>
              <span className="mc-hero-strip-value">24-Hour Jeopardy</span>
            </div>
            <div className="mc-hero-strip-item">
              <span className="mc-hero-strip-label">Challenge Scope</span>
              <span className="mc-hero-strip-value">40+ Challenges · 9 Domains</span>
            </div>
            <div className="mc-hero-strip-item">
              <span className="mc-hero-strip-label">Squad Size</span>
              <span className="mc-hero-strip-value">1–4 Members</span>
            </div>
          </motion.div>
        </section>

        {/* ── Main Content ───────────────────────────────────────────────── */}
        <div className="mc-main-wrap">
          {/* Flagship Event & Countdown */}
          <motion.section
            id="flagship"
            className="mc-panel"
            aria-labelledby="mc-flagship-heading"
            initial={{ opacity: 0, y: isLowPerf ? 12 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.55, ease: EASE_SOOTHING }}
          >
            <div className="mc-flagship-grid">
              <div>
                <div className="mc-kicker">Upcoming Flagship Event</div>
                <h2
                  id="mc-flagship-heading"
                  className="mc-minecraft-subhead"
                  style={{
                    fontSize: 'clamp(1.75rem, 3.2vw, 2.5rem)',
                    margin: '0 0 14px',
                    color: '#ffffff',
                    lineHeight: 1.05,
                    textShadow: '0 3px 0 #1e293b',
                  }}
                >
                  Defend The Village — 2026
                </h2>

                <p
                  style={{
                    fontSize: '0.98rem',
                    lineHeight: 1.75,
                    color: 'rgba(226, 232, 240, 0.82)',
                    margin: '0 0 24px',
                    maxWidth: '580px',
                  }}
                >
                  Built from scratch by HackShield IIT Patna across web, binary
                  exploitation, reverse engineering, cryptography, forensics,
                  and defense tracks. Top performers earn sponsored goodies,
                  exclusive badges, and direct interview opportunities with
                  security sponsors.
                </p>

                <div className="mc-spec-grid">
                  <div className="mc-spec-item">
                    <Calendar size={16} color="#7dd3fc" aria-hidden="true" />
                    <span>December 14, 2026 · 12:00 IST</span>
                  </div>
                  <div className="mc-spec-item">
                    <Clock size={16} color="#38bdf8" aria-hidden="true" />
                    <span>24 Hours · Jeopardy</span>
                  </div>
                  <div className="mc-spec-item">
                    <Users size={16} color="#34d399" aria-hidden="true" />
                    <span>Teams of 1–4</span>
                  </div>
                  <div className="mc-spec-item">
                    <Trophy size={16} color="#fbbf24" aria-hidden="true" />
                    <span>Goodies &amp; Sponsor Interviews</span>
                  </div>
                </div>
              </div>

              <div className="mc-countdown-box">
                <div className="mc-kicker" style={{ marginBottom: '4px' }}>
                  Tournament Starts In
                </div>

                <div className="mc-countdown-grid">
                  {[
                    { label: 'DAYS', val: timeLeft.days },
                    { label: 'HOURS', val: timeLeft.hours },
                    { label: 'MINS', val: timeLeft.minutes },
                    { label: 'SECS', val: timeLeft.seconds },
                  ].map((unit) => (
                    <div key={unit.label} className="mc-countdown-cell">
                      <div className="mc-countdown-val">
                        {String(unit.val).padStart(2, '0')}
                      </div>
                      <span className="mc-countdown-label">{unit.label}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/ctf/defendthevillage/auth"
                  className="mc-btn-primary"
                  style={{ width: '100%', boxSizing: 'border-box' }}
                >
                  <span>Participate Now</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </motion.section>

          {/* How It Works Timeline */}
          <section
            id="timeline"
            style={{ marginTop: '68px' }}
            aria-labelledby="mc-timeline-heading"
          >
            <motion.div
              className="mc-section-head"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, ease: EASE_SOOTHING }}
            >
              <div>
                <div className="mc-kicker">Competition Flow</div>
                <h2 id="mc-timeline-heading" className="mc-section-title">
                  How It Works
                </h2>
              </div>
              <p
                style={{
                  margin: 0,
                  maxWidth: '420px',
                  fontSize: '0.94rem',
                  lineHeight: 1.6,
                  color: 'rgba(203, 213, 225, 0.78)',
                }}
              >
                From squad setup to final standings in four straightforward
                stages.
              </p>
            </motion.div>

            <div className="mc-timeline-grid">
              {EVENT_TIMELINE.map((phase, idx) => (
                <motion.div
                  key={phase.step}
                  className="mc-step-card"
                  initial={{ opacity: 0, y: isLowPerf ? 8 : 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.42,
                    delay: isLowPerf ? 0 : idx * 0.05,
                    ease: EASE_SOOTHING,
                  }}
                >
                  <div className="mc-step-num">{phase.step}</div>
                  <h3
                    className="mc-minecraft-subhead"
                    style={{
                      fontSize: '1.08rem',
                      color: '#ffffff',
                      margin: '0 0 8px',
                    }}
                  >
                    {phase.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.88rem',
                      lineHeight: 1.6,
                      color: 'rgba(203, 213, 225, 0.78)',
                    }}
                  >
                    {phase.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Challenge Categories with Interactive Filter */}
          <section
            id="categories"
            style={{ marginTop: '72px' }}
            aria-labelledby="mc-categories-heading"
          >
            <motion.div
              className="mc-section-head"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, ease: EASE_SOOTHING }}
            >
              <div>
                <div className="mc-kicker">Challenge Domains</div>
                <h2 id="mc-categories-heading" className="mc-section-title">
                  CTF Categories
                </h2>
              </div>
              <p
                style={{
                  margin: 0,
                  maxWidth: '440px',
                  fontSize: '0.94rem',
                  lineHeight: 1.6,
                  color: 'rgba(203, 213, 225, 0.78)',
                }}
              >
                Nine offensive, defensive, and analytical security tracks across
                40+ original challenges.
              </p>
            </motion.div>

            <div className="mc-filter-bar" role="group" aria-label="Filter CTF categories by track">
              {TRACK_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  aria-pressed={activeTrack === filter.id}
                  className="mc-filter-btn"
                  onClick={() => setActiveTrack(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="mc-disciplines-grid">
              {filteredDisciplines.map((item, idx) => (
                <motion.article
                  key={item.tag}
                  className="mc-discipline-card"
                  initial={{ opacity: 0, y: isLowPerf ? 8 : 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{
                    duration: 0.4,
                    delay: isLowPerf ? 0 : Math.min(idx * 0.03, 0.2),
                    ease: EASE_SOOTHING,
                  }}
                >
                  <div>
                    <div className="mc-discipline-head">
                      <div
                        className="mc-discipline-icon"
                        style={{ background: item.accentBg }}
                      >
                        {item.icon}
                      </div>
                      <span
                        className="mc-discipline-tag"
                        style={{
                          color: item.accent,
                          background: item.accentBg,
                          border: `1px solid ${item.accent}3d`,
                        }}
                      >
                        {item.tag}
                      </span>
                    </div>

                    <h3
                      className="mc-minecraft-subhead"
                      style={{
                        fontSize: '1.14rem',
                        color: '#ffffff',
                        margin: '0 0 8px',
                      }}
                    >
                      {item.name}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.9rem',
                        lineHeight: 1.62,
                        color: 'rgba(203, 213, 225, 0.78)',
                        margin: 0,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>

                  <div className="mc-topic-row">
                    {item.topics.map((topic) => (
                      <span key={topic} className="mc-topic-chip">
                        {topic}
                      </span>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          {/* Rules, Benchmark & Preparation */}
          <section
            className="mc-info-grid"
            aria-label="Tournament Guidelines and Preparation"
          >
            <motion.div
              className="mc-panel"
              style={{ padding: '28px' }}
              initial={{ opacity: 0, y: isLowPerf ? 10 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.48, ease: EASE_SOOTHING }}
            >
              <div className="mc-kicker" style={{ marginBottom: '6px' }}>
                Rules &amp; Fair Play
              </div>
              <h2
                className="mc-minecraft-subhead"
                style={{
                  fontSize: '1.45rem',
                  color: '#ffffff',
                  margin: '0 0 18px',
                  textShadow: '0 2px 0 #1e293b',
                }}
              >
                Competition Guidelines
              </h2>

              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'grid',
                  gap: '12px',
                  fontSize: '0.92rem',
                  lineHeight: 1.6,
                  color: 'rgba(226, 232, 240, 0.82)',
                }}
              >
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={17} color="#34d399" style={{ marginTop: '3px', flexShrink: 0 }} aria-hidden="true" />
                  <span>Compete solo or in squads of up to 4 members; one account per participant.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={17} color="#34d399" style={{ marginTop: '3px', flexShrink: 0 }} aria-hidden="true" />
                  <span>Keep exploitation strictly within designated challenge containers—no platform attacks or DoS.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={17} color="#34d399" style={{ marginTop: '3px', flexShrink: 0 }} aria-hidden="true" />
                  <span>Do not share flags, direct payloads, or live solutions while the 24-hour window is active.</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              className="mc-panel"
              style={{
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '18px',
              }}
              initial={{ opacity: 0, y: isLowPerf ? 10 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.48, delay: isLowPerf ? 0 : 0.06, ease: EASE_SOOTHING }}
            >
              <div>
                <div className="mc-kicker" style={{ marginBottom: '6px' }}>
                  Track Record &amp; Practice
                </div>
                <h2
                  className="mc-minecraft-subhead"
                  style={{
                    fontSize: '1.45rem',
                    color: '#ffffff',
                    margin: '0 0 12px',
                    textShadow: '0 2px 0 #1e293b',
                  }}
                >
                  Prepare With HackShield
                </h2>

                <div
                  style={{
                    padding: '13px 15px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--mc-border-soft)',
                    marginBottom: '14px',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.94rem', color: '#ffffff', marginBottom: '3px' }}>
                    Previous Flagship: Rookie CTF 2026
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'rgba(148, 163, 184, 0.92)' }}>
                    June 5–6, 2026 · Jeopardy Style · 100+ Teams · Writeups Available
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.62, color: 'rgba(203, 213, 225, 0.78)' }}>
                  Sharpen fundamentals through our 6-week curriculum and curated
                  security toolkit before tournament day.
                </p>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                <Link href="/programs" className="mc-btn-secondary">
                  <BookOpen size={15} aria-hidden="true" />
                  <span>Programs</span>
                </Link>
                <Link href="/resources" className="mc-btn-secondary">
                  <Terminal size={15} aria-hidden="true" />
                  <span>Security Toolkit</span>
                </Link>
              </div>
            </motion.div>
          </section>

          {/* About HackShield & Operating Principles */}
          <section
            id="about-hackshield"
            className="mc-about-stack"
            aria-labelledby="mc-about-heading"
          >
            <motion.div
              className="mc-panel"
              style={{ padding: 'clamp(26px, 4vw, 40px)' }}
              initial={{ opacity: 0, y: isLowPerf ? 10 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.48, ease: EASE_SOOTHING }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#7dd3fc',
                  marginBottom: '10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                }}
              >
                <Sparkles size={15} aria-hidden="true" />
                <span>About HackShield · Our Vision</span>
              </div>

              <h2
                id="mc-about-heading"
                className="mc-minecraft-subhead"
                style={{
                  fontSize: 'clamp(1.6rem, 3vw, 2.25rem)',
                  color: '#ffffff',
                  margin: '0 0 14px',
                  lineHeight: 1.08,
                  textShadow: '0 3px 0 #1e293b',
                }}
              >
                Demystifying cybersecurity from kernel to cloud.
              </h2>

              <p
                style={{
                  fontSize: '0.98rem',
                  lineHeight: 1.75,
                  color: 'rgba(226, 232, 240, 0.84)',
                  margin: '0 0 16px',
                }}
              >
                HackShield is the premier technical security guild at the Indian
                Institute of Technology Patna. We are hackers, cryptographers,
                system architects, and reverse engineers committed to exploring
                vulnerabilities and strengthening digital resilience.
              </p>

              <p
                style={{
                  fontSize: '0.96rem',
                  lineHeight: 1.75,
                  color: 'rgba(203, 213, 225, 0.78)',
                  margin: '0 0 24px',
                }}
              >
                Cybersecurity doesn&apos;t play by the syllabus, and neither do
                we. At HackShield, we take learning beyond textbooks and into
                the trenches of real-world security. From breaking things
                (ethically, of course) to building things stronger, we equip IIT
                Patna undergraduates with hands-on tools, sandboxed labs, and a
                community that thrives on curiosity, collaboration, and a little
                bit of controlled chaos. Less theory, more hacking. More
                skills, fewer vulnerabilities.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <Link href="/about" className="mc-btn-primary">
                  <span>Meet Organizers &amp; Team</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="mc-section-head"
              style={{ marginTop: '28px', marginBottom: '12px' }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, ease: EASE_SOOTHING }}
            >
              <div>
                <div className="mc-kicker">Principles</div>
                <h2 className="mc-section-title">How We Operate</h2>
              </div>
            </motion.div>

            <div className="mc-principles-grid">
              {OPERATING_PRINCIPLES.map((principle, idx) => (
                <motion.article
                  key={principle.tag}
                  className="mc-discipline-card"
                  initial={{ opacity: 0, y: isLowPerf ? 8 : 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{
                    duration: 0.4,
                    delay: isLowPerf ? 0 : idx * 0.05,
                    ease: EASE_SOOTHING,
                  }}
                >
                  <div>
                    <div className="mc-discipline-head">
                      <div
                        className="mc-discipline-icon"
                        style={{ background: principle.accentBg }}
                      >
                        {principle.icon}
                      </div>
                      <span
                        className="mc-discipline-tag"
                        style={{
                          color: principle.accent,
                          background: principle.accentBg,
                          border: `1px solid ${principle.accent}3d`,
                        }}
                      >
                        {principle.tag}
                      </span>
                    </div>

                    <h3
                      className="mc-minecraft-subhead"
                      style={{
                        fontSize: '1.14rem',
                        color: '#ffffff',
                        margin: '0 0 8px',
                      }}
                    >
                      {principle.title}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.9rem',
                        lineHeight: 1.62,
                        color: 'rgba(203, 213, 225, 0.78)',
                        margin: 0,
                      }}
                    >
                      {principle.desc}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          {/* Community Footer Callout */}
          <motion.section
            className="mc-panel"
            style={{
              marginTop: '60px',
              padding: 'clamp(24px, 3.5vw, 36px)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
            }}
            initial={{ opacity: 0, y: isLowPerf ? 10 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.48, ease: EASE_SOOTHING }}
          >
            <div style={{ maxWidth: '620px' }}>
              <div className="mc-kicker" style={{ marginBottom: '6px' }}>
                HackShield · IIT Patna
              </div>
              <h2
                className="mc-minecraft-subhead"
                style={{
                  fontSize: 'clamp(1.35rem, 2.5vw, 1.85rem)',
                  color: '#ffffff',
                  margin: '0 0 6px',
                  textShadow: '0 2px 0 #1e293b',
                }}
              >
                Find the Pattern. Find the People.
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.94rem',
                  lineHeight: 1.6,
                  color: 'rgba(203, 213, 225, 0.78)',
                }}
              >
                Join HackShield on WhatsApp for event updates, workshops, and
                team formation ahead of Defend The Village 2026.
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              <Link href="/ctf/defendthevillage/auth" className="mc-btn-primary">
                <span>Participate Now</span>
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <a
                href="https://chat.whatsapp.com/Kk4EPaNeHkp8oNQZ8O0ZR7"
                target="_blank"
                rel="noopener noreferrer"
                className="mc-btn-secondary"
              >
                <span>Join Community</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </div>
          </motion.section>
        </div>
      </main>
    </MotionConfig>
  )
}
