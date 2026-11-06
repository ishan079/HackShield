'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  Trophy,
  Flag,
  Terminal,
  Globe,
  Lock,
  Search,
  Binary,
  Radio,
  Calendar,
  Users,
  ArrowUpRight,
  ArrowLeft,
  Zap,
  Clock,
  Award,
  ChevronRight,
} from 'lucide-react'
import {
  CTFCategory,
  PastCTFEvent,
  MiniCTFSprint,
  MiniStatItem,
} from '@/types'

function CTFContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialType = searchParams.get('type') === 'mini' ? 'mini' : 'flagship'
  const [activeTab, setActiveTab] = useState(initialType)
  const [flippedSprintId, setFlippedSprintId] = useState<string | null>(null)
  const [regForm, setRegForm] = useState({
    email: '',
    pwnUsername: '',
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const type = searchParams.get('type')
    if (type === 'mini') {
      setActiveTab('mini')
    } else if (type === 'flagship') {
      setActiveTab('flagship')
    }
  }, [searchParams])

  const handleTabChange = (tab: 'flagship' | 'mini') => {
    setActiveTab(tab)
    router.push(`/ctf?type=${tab}`, { scroll: false })
  }

  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const { ref: categoriesRef } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const { ref: eventsRef } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Flagship Countdown timer
  const [timeLeft, setTimeLeft] = useState({
    days: 42,
    hours: 14,
    minutes: 36,
    seconds: 50,
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 }
        if (prev.hours > 0)
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        if (prev.days > 0)
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          }
        return prev
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const categories: CTFCategory[] = [
    {
      name: 'Web Exploitation',
      icon: <Globe size={24} color="var(--accent)" />,
      tag: 'WEB',
      desc: 'SQL injections, XSS, SSRF, JWT forgery, OAuth bypasses, and Prototype Pollution in contemporary microservices.',
    },
    {
      name: 'Binary Exploitation (Pwn)',
      icon: <Terminal size={24} color="var(--accent)" />,
      tag: 'PWN',
      desc: 'Buffer overflows, ROP chain crafting, heap spray vulnerabilities, format strings, and kernel space privilege escalation.',
    },
    {
      name: 'Reverse Engineering',
      icon: <Binary size={24} color="var(--accent)" />,
      tag: 'REV',
      desc: 'Dissecting compiled ELF/PE executables, x86/ARM assembly analysis with Ghidra & IDA Pro, anti-debugging defeat, and packing unraveling.',
    },
    {
      name: 'Cryptography',
      icon: <Lock size={24} color="var(--accent)" />,
      tag: 'CRYPTO',
      desc: 'Breaking weak RSA implementations, elliptic curve discrete log attacks, padding oracles, and zero-knowledge proof flaws.',
    },
    {
      name: 'Digital Forensics & Stego',
      icon: <Search size={24} color="var(--accent)" />,
      tag: 'FORENSICS',
      desc: 'Memory dump analysis with Volatility, PCAP network traffic inspection, filesystem carving, and steganographic data extraction.',
    },
    {
      name: 'OSINT & Recon',
      icon: <Radio size={24} color="var(--accent)" />,
      tag: 'OSINT',
      desc: 'Open source intelligence gathering, geolocation identification, metadata extraction, and footprint analysis across threat actors.',
    },
  ]

  const pastEvents: PastCTFEvent[] = [
    {
      title: 'HackShield CTF 2024',
      date: 'October 12–14, 2024',
      type: 'National Level · Jeopardy Style',
      teams: '640+ Teams',
      firstPlace: 'Team Bi0s (Amrita)',
      prizePool: '₹50,000',
      status: 'Archived',
    },
    {
      title: 'Rookie CTF — Spring 2024',
      date: 'April 5, 2024',
      type: 'Beginner Friendly · Intra-College',
      teams: '180+ Participants',
      firstPlace: '0xNullPointers (IIT Patna)',
      prizePool: 'Swag & Badges',
      status: 'Archived',
    },
    {
      title: 'HackShield CTF 2023',
      date: 'November 3–5, 2023',
      type: 'Inaugural Edition',
      teams: '420+ Teams',
      firstPlace: 'Invaders (IIT Roorkee)',
      prizePool: '₹30,000',
      status: 'Archived',
    },
  ]

  const miniSprints: MiniCTFSprint[] = [
    {
      id: 'mini-14',
      title: 'Mini CTF #14: OAuth & Web Infiltration',
      status: 'REGISTRATION OPEN',
      statusColor: '#10b981',
      date: 'Next Saturday · 6:00 PM – 9:00 PM IST',
      duration: '3 Hours',
      challenges: '6 Targeted Boxes',
      difficulty: 'Intermediate',
      format: 'Solo or Duos',
      reward: "500 Club XP + 'Web Infiltrator' Digital Badge",
      description:
        'Fast-paced sprint targeting modern OAuth redirect leaks, SSRF escalation in AWS metadata, and JWT signature forgery.',
    },
  ]

  const miniStats: MiniStatItem[] = [
    {
      label: 'Sprint Duration',
      val: '2–3 Hours',
      icon: <Clock size={18} color="var(--accent)" />,
    },
    {
      label: 'Frequency',
      val: 'Bi-Weekly',
      icon: <Calendar size={18} color="var(--accent)" />,
    },
    {
      label: 'Team Format',
      val: 'Solo or Duos',
      icon: <Users size={18} color="var(--accent)" />,
    },
    {
      label: 'Rewards',
      val: 'Club XP & Badges',
      icon: <Award size={18} color="var(--accent)" />,
    },
  ]

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 1,
        background: 'transparent',
        minHeight: '100vh',
        paddingTop: '100px',
        paddingBottom: '90px',
        color: 'var(--text-primary)',
        transition: 'color 0.35s ease',
      }}
    >
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          ref={heroRef}
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '45px' }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--accent-dim)',
              border: '1px solid var(--accent)',
              borderRadius: '999px',
              padding: '6px 18px',
              marginBottom: '20px',
              fontSize: '0.82rem',
              letterSpacing: '1px',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            <Flag size={14} /> Official Competitions Hub
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: '18px',
              color: 'var(--text-primary)',
            }}
          >
            Crack The Cipher.
            <br />
            <span
              style={{
                color: 'var(--accent)',
                fontStyle: 'italic',
                fontFamily: 'Georgia, serif',
              }}
            >
              Capture The Flag.
            </span>
          </h1>
          <p
            style={{
              maxWidth: 680,
              margin: '0 auto',
              fontSize: '1.12rem',
              lineHeight: 1.75,
              color: 'var(--text-secondary)',
            }}
          >
            Choose between our high-stakes national annual championship and our
            regular, fast-paced intra-club skill sprints.
          </p>
        </motion.div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '50px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '6px',
              borderRadius: '9999px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderTop: '1.5px solid var(--border-specular)',
              borderBottom: '1px solid var(--border-bottom)',
              boxShadow: 'var(--shadow-card)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              gap: '6px',
              maxWidth: '100%',
            }}
          >
            <button
              type="button"
              onClick={() => handleTabChange('flagship')}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 28px',
                borderRadius: '9999px',
                border: 'none',
                background: 'transparent',
                color:
                  activeTab === 'flagship' ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.96rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'color 0.25s ease',
                outline: 'none',
                whiteSpace: 'nowrap',
                zIndex: 1,
              }}
            >
              {activeTab === 'flagship' && (
                <motion.div
                  layoutId="ctf-active-pill"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '9999px',
                    background:
                      'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
                    boxShadow: '0 4px 18px var(--accent-glow)',
                    zIndex: -1,
                  }}
                />
              )}
              <Trophy
                size={18}
                color={activeTab === 'flagship' ? '#ffffff' : 'var(--accent)'}
              />
              <span>Flagship CTF</span>
              <span
                style={{
                  fontSize: '0.68rem',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background:
                    activeTab === 'flagship'
                      ? 'rgba(255, 255, 255, 0.25)'
                      : 'var(--accent-dim)',
                  color: activeTab === 'flagship' ? '#ffffff' : 'var(--accent)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Annual National
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('mini')}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 28px',
                borderRadius: '9999px',
                border: 'none',
                background: 'transparent',
                color:
                  activeTab === 'mini' ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.96rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'color 0.25s ease',
                outline: 'none',
                whiteSpace: 'nowrap',
                zIndex: 1,
              }}
            >
              {activeTab === 'mini' && (
                <motion.div
                  layoutId="ctf-active-pill"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '9999px',
                    background:
                      'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
                    boxShadow: '0 4px 18px var(--accent-glow)',
                    zIndex: -1,
                  }}
                />
              )}
              <Zap
                size={18}
                color={activeTab === 'mini' ? '#ffffff' : 'var(--accent)'}
              />
              <span>Mini CTF</span>
              <span
                style={{
                  fontSize: '0.68rem',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background:
                    activeTab === 'mini'
                      ? 'rgba(255, 255, 255, 0.25)'
                      : 'var(--accent-dim)',
                  color: activeTab === 'mini' ? '#ffffff' : 'var(--accent)',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Bi-Weekly Sprints
              </span>
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'flagship' && (
            <motion.div
              key="flagship-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <div
                style={{
                  position: 'relative',
                  borderRadius: '28px',
                  background: 'var(--card-gradient)',
                  border: '1px solid var(--border-subtle)',
                  borderTop: '1.5px solid var(--border-specular)',
                  borderBottom: '1px solid var(--border-bottom)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  padding: '48px',
                  marginBottom: '80px',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '30px',
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  <div style={{ maxWidth: 540 }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'var(--accent)',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        letterSpacing: '1.5px',
                        padding: '4px 12px',
                        borderRadius: '999px',
                        textTransform: 'uppercase',
                        marginBottom: '16px',
                      }}
                    >
                      <Trophy size={13} /> UPCOMING FLAGSHIP TOURNAMENT
                    </div>
                    <h2
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '2.5rem',
                        fontWeight: 800,
                        margin: '0 0 12px',
                        color: 'var(--text-primary)',
                      }}
                    >
                      HackShield CTF 2025
                    </h2>
                    <p
                      style={{
                        fontSize: '1.05rem',
                        lineHeight: 1.7,
                        color: 'var(--text-secondary)',
                        margin: '0 0 24px',
                      }}
                    >
                      Our 36-hour jeopardy-style cybersecurity tournament
                      featuring 30+ bespoke challenges built from scratch by IIT
                      Patna researchers. Win cash prizes, exclusive hardware
                      badges, and direct interviews with security sponsors.
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        gap: '24px',
                        flexWrap: 'wrap',
                        color: 'var(--text-muted)',
                        fontSize: '0.95rem',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <Calendar size={18} color="var(--accent)" /> March 2025
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <Trophy size={18} color="var(--accent)" /> ₹1,00,000+
                        Prize Pool
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <Users size={18} color="var(--accent)" /> Teams of 1–4
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderTop: '1px solid rgba(255, 255, 255, 0.22)',
                      borderBottom: '1px solid var(--border-bottom)',
                      borderRadius: '24px',
                      padding: '28px',
                      textAlign: 'center',
                      minWidth: '280px',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      boxShadow:
                        'inset 0 2px 4px rgba(0, 0, 0, 0.40), var(--shadow-sm)',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-muted)',
                        letterSpacing: '1px',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                      }}
                    >
                      Registration Opens In
                    </span>
                    <div
                      style={{
                        display: 'flex',
                        gap: '12px',
                        justifyContent: 'center',
                        margin: '18px 0',
                      }}
                    >
                      {[
                        { label: 'DAYS', val: timeLeft.days },
                        { label: 'HOURS', val: timeLeft.hours },
                        { label: 'MINS', val: timeLeft.minutes },
                        { label: 'SECS', val: timeLeft.seconds },
                      ].map((unit, i) => (
                        <div key={i} style={{ minWidth: '55px' }}>
                          <div
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '1.8rem',
                              fontWeight: 800,
                              color: 'var(--text-primary)',
                              background: 'var(--bg-surface)',
                              borderRadius: '8px',
                              padding: '8px 4px',
                              border: '1px solid var(--border-subtle)',
                            }}
                          >
                            {String(unit.val).padStart(2, '0')}
                          </div>
                          <span
                            style={{
                              fontSize: '0.65rem',
                              color: 'var(--accent)',
                              letterSpacing: '1px',
                              fontWeight: 700,
                            }}
                          >
                            {unit.label}
                          </span>
                        </div>
                      ))}
                    </div>

                    <a
                      href="#register"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        width: '100%',
                        boxSizing: 'border-box',
                        background: 'var(--accent)',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        padding: '12px 20px',
                        borderRadius: '10px',
                        textDecoration: 'none',
                        boxShadow: '0 4px 16px var(--accent-glow)',
                        transition: 'background 0.2s, transform 0.2s',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = 'translateY(-2px)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = 'translateY(0)')
                      }
                    >
                      Pre-Register Now <ArrowUpRight size={18} />
                    </a>
                  </div>
                </div>
              </div>

              <div ref={categoriesRef} style={{ marginBottom: '90px' }}>
                <div style={{ textAlign: 'center', marginBottom: '45px' }}>
                  <span
                    style={{
                      color: 'var(--accent)',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}
                  >
                    Challenge Domains
                  </span>
                  <h2
                    style={{
                      fontSize: '2.2rem',
                      fontWeight: 800,
                      marginTop: '8px',
                      color: 'var(--text-primary)',
                    }}
                  >
                    Six Flagship CTF Disciplines
                  </h2>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '24px',
                  }}
                >
                  {categories.map((cat, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderTop: '1.5px solid var(--border-specular)',
                        borderBottom: '1px solid var(--border-bottom)',
                        borderRadius: '26px',
                        padding: '28px',
                        boxShadow: 'var(--shadow-card)',
                        backdropFilter: 'blur(14px)',
                        WebkitBackdropFilter: 'blur(14px)',
                        transition: 'all 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor =
                          'rgba(255, 255, 255, 0.30)'
                        e.currentTarget.style.borderTopColor =
                          'rgba(255, 255, 255, 0.58)'
                        e.currentTarget.style.transform = 'translateY(-4px)'
                        e.currentTarget.style.boxShadow =
                          'var(--shadow-card-hover)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          'var(--border-subtle)'
                        e.currentTarget.style.borderTopColor =
                          'var(--border-specular)'
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'var(--shadow-card)'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '16px',
                        }}
                      >
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            background: 'var(--accent-dim)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {cat.icon}
                        </div>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.75rem',
                            color: 'var(--accent)',
                            background: 'var(--accent-dim)',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontWeight: 700,
                          }}
                        >
                          {cat.tag}
                        </span>
                      </div>
                      <h3
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          marginBottom: '8px',
                        }}
                      >
                        {cat.name}
                      </h3>
                      <p
                        style={{
                          fontSize: '0.95rem',
                          lineHeight: 1.6,
                          color: 'var(--text-secondary)',
                          margin: 0,
                        }}
                      >
                        {cat.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div ref={eventsRef}>
                <div style={{ textAlign: 'center', marginBottom: '45px' }}>
                  <span
                    style={{
                      color: 'var(--accent)',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}
                  >
                    Hall of Fame
                  </span>
                  <h2
                    style={{
                      fontSize: '2.2rem',
                      fontWeight: 800,
                      marginTop: '8px',
                      color: 'var(--text-primary)',
                    }}
                  >
                    Flagship Archive & Past Champions
                  </h2>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                  }}
                >
                  {pastEvents.map((event, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '20px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-subtle)',
                        borderTop: '1.5px solid var(--border-specular)',
                        borderBottom: '1px solid var(--border-bottom)',
                        borderRadius: '24px',
                        padding: '24px 30px',
                        boxShadow: 'var(--shadow-card)',
                        backdropFilter: 'blur(14px)',
                        WebkitBackdropFilter: 'blur(14px)',
                        transition: 'all 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor =
                          'rgba(255, 255, 255, 0.30)'
                        e.currentTarget.style.borderTopColor =
                          'rgba(255, 255, 255, 0.58)'
                        e.currentTarget.style.boxShadow =
                          'var(--shadow-card-hover)'
                        e.currentTarget.style.transform = 'translateY(-3px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor =
                          'var(--border-subtle)'
                        e.currentTarget.style.borderTopColor =
                          'var(--border-specular)'
                        e.currentTarget.style.boxShadow = 'var(--shadow-card)'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--accent)',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                          }}
                        >
                          {event.type}
                        </span>
                        <h3
                          style={{
                            fontSize: '1.4rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            margin: '4px 0 6px',
                          }}
                        >
                          {event.title}
                        </h3>
                        <div
                          style={{
                            display: 'flex',
                            gap: '16px',
                            color: 'var(--text-muted)',
                            fontSize: '0.9rem',
                          }}
                        >
                          <span>{event.date}</span>
                          <span>·</span>
                          <span>{event.teams}</span>
                        </div>
                      </div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '24px',
                        }}
                      >
                        <div style={{ textAlign: 'right' }}>
                          <div
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                              textTransform: 'uppercase',
                            }}
                          >
                            Champions
                          </div>
                          <div
                            style={{
                              fontSize: '1rem',
                              fontWeight: 700,
                              color: 'var(--text-primary)',
                            }}
                          >
                            {event.firstPlace}
                          </div>
                        </div>
                        <div
                          style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            background: 'var(--accent-dim)',
                            border: '1px solid var(--accent)',
                            fontSize: '0.85rem',
                            color: 'var(--accent)',
                            fontWeight: 700,
                          }}
                        >
                          Writeups Available
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  marginTop: '60px',
                  padding: '28px 36px',
                  borderRadius: '26px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderTop: '1.5px solid var(--border-specular)',
                  borderBottom: '1px solid var(--border-bottom)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '24px',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '18px',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Zap size={24} color="#10b981" />
                  </div>
                  <div>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                      }}
                    >
                      Looking for regular skill sprints?
                    </h4>
                    <p
                      style={{
                        margin: '4px 0 0',
                        fontSize: '0.94rem',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      Jump into our bi-weekly 2–3 hour Mini CTF arena, rookie
                      freshers onboarding, and earn club badges.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleTabChange('mini')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '9999px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1.5px solid #10b981',
                    color: '#10b981',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.15)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#10b981'
                    e.currentTarget.style.color = '#ffffff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      'rgba(16, 185, 129, 0.15)'
                    e.currentTarget.style.color = '#10b981'
                  }}
                >
                  <span>Explore Mini CTF Track</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'mini' && (
            <motion.div
              key="mini-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <div
                style={{
                  position: 'relative',
                  borderRadius: '28px',
                  background: 'var(--card-gradient)',
                  border: '1px solid var(--border-subtle)',
                  borderTop: '1.5px solid var(--border-specular)',
                  borderBottom: '1px solid var(--border-bottom)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  padding: '40px 48px',
                  marginBottom: '50px',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '30px',
                  }}
                >
                  <div style={{ maxWidth: 620 }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(16, 185, 129, 0.15)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        color: '#10b981',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        letterSpacing: '1.2px',
                        padding: '4px 12px',
                        borderRadius: '6px',
                        textTransform: 'uppercase',
                        marginBottom: '14px',
                      }}
                    >
                      <Zap size={14} /> BI-WEEKLY SPRINT ARENA
                    </div>
                    <h2
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '2.4rem',
                        fontWeight: 800,
                        margin: '0 0 12px',
                        color: 'var(--text-primary)',
                      }}
                    >
                      Mini CTF & Speedrun Sprints
                    </h2>
                    <p
                      style={{
                        fontSize: '1.05rem',
                        lineHeight: 1.7,
                        color: 'var(--text-secondary)',
                        margin: '0 0 20px',
                      }}
                    >
                      Fast, focused 2-to-3 hour competitions designed to sharpen
                      practical exploitation speed, test fresh boxes built by
                      club members, and climb the internal IIT Patna club
                      leaderboard.
                    </p>
                  </div>

                  <a
                    href="#mini-sprints"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'var(--accent)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.96rem',
                      padding: '14px 26px',
                      borderRadius: '9999px',
                      textDecoration: 'none',
                      boxShadow: '0 4px 18px var(--accent-glow)',
                    }}
                  >
                    <span>View Upcoming Sprints</span>
                    <span>↓</span>
                  </a>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginTop: '32px',
                    paddingTop: '24px',
                    borderTop: '1px solid var(--border-subtle)',
                  }}
                >
                  {miniStats.map((stat, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: 'var(--accent-dim)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {stat.icon}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            textTransform: 'uppercase',
                            fontWeight: 600,
                          }}
                        >
                          {stat.label}
                        </div>
                        <div
                          style={{
                            fontSize: '0.98rem',
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                          }}
                        >
                          {stat.val}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div id="mini-sprints" style={{ marginBottom: '80px' }}>
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                  <span
                    style={{
                      color: 'var(--accent)',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                    }}
                  >
                    Upcoming Arenas
                  </span>
                  <h2
                    style={{
                      fontSize: '2.1rem',
                      fontWeight: 800,
                      marginTop: '8px',
                      color: 'var(--text-primary)',
                    }}
                  >
                    Active & Scheduled Mini CTFs
                  </h2>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '22px',
                  }}
                >
                  {miniSprints.map((sprint) => {
                    const isFlipped = flippedSprintId === sprint.id

                    return (
                      <div
                        key={sprint.id}
                        style={{ perspective: '1600px', width: '100%' }}
                      >
                        <AnimatePresence mode="wait" initial={false}>
                          {!isFlipped ? (
                            <motion.div
                              key="front"
                              initial={{ rotateY: 90, opacity: 0 }}
                              animate={{ rotateY: 0, opacity: 1 }}
                              exit={{ rotateY: -90, opacity: 0 }}
                              transition={{
                                duration: 0.38,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              style={{
                                transformStyle: 'preserve-3d',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-subtle)',
                                borderTop: '1.5px solid var(--border-specular)',
                                borderBottom: '1px solid var(--border-bottom)',
                                borderRadius: '26px',
                                padding: '30px 36px',
                                boxShadow: 'var(--shadow-card)',
                                backdropFilter: 'blur(14px)',
                                WebkitBackdropFilter: 'blur(14px)',
                                transition:
                                  'border-color 0.25s ease, box-shadow 0.25s ease',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor =
                                  'rgba(255, 255, 255, 0.30)'
                                e.currentTarget.style.borderTopColor =
                                  'rgba(255, 255, 255, 0.58)'
                                e.currentTarget.style.boxShadow =
                                  'var(--shadow-card-hover)'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor =
                                  'var(--border-subtle)'
                                e.currentTarget.style.borderTopColor =
                                  'var(--border-specular)'
                                e.currentTarget.style.boxShadow =
                                  'var(--shadow-card)'
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  justifyContent: 'space-between',
                                  alignItems: 'flex-start',
                                  gap: '16px',
                                  marginBottom: '14px',
                                }}
                              >
                                <div>
                                  <div
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '10px',
                                      marginBottom: '8px',
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: '0.72rem',
                                        fontWeight: 800,
                                        letterSpacing: '1px',
                                        padding: '3px 10px',
                                        borderRadius: '6px',
                                        background: `${sprint.statusColor}22`,
                                        border: `1px solid ${sprint.statusColor}66`,
                                        color: sprint.statusColor,
                                        textTransform: 'uppercase',
                                      }}
                                    >
                                      ● {sprint.status}
                                    </span>
                                    <span
                                      style={{
                                        fontFamily: 'var(--font-mono)',
                                        fontSize: '0.78rem',
                                        color: 'var(--text-muted)',
                                      }}
                                    >
                                      {sprint.date}
                                    </span>
                                  </div>
                                  <h3
                                    style={{
                                      fontSize: '1.45rem',
                                      fontWeight: 800,
                                      color: 'var(--text-primary)',
                                      margin: 0,
                                    }}
                                  >
                                    {sprint.title}
                                  </h3>
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setFlippedSprintId(sprint.id)
                                  }
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background:
                                      sprint.status === 'REGISTRATION OPEN'
                                        ? 'var(--accent)'
                                        : 'var(--bg-surface)',
                                    color:
                                      sprint.status === 'REGISTRATION OPEN'
                                        ? '#ffffff'
                                        : 'var(--text-primary)',
                                    border: '1px solid var(--border-strong)',
                                    padding: '10px 22px',
                                    borderRadius: '9999px',
                                    fontSize: '0.90rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    boxShadow:
                                      sprint.status === 'REGISTRATION OPEN'
                                        ? '0 4px 14px var(--accent-glow)'
                                        : 'none',
                                    transition: 'all 0.2s ease',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform =
                                      'scale(1.03)'
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)'
                                  }}
                                >
                                  <span>
                                    {sprint.status === 'REGISTRATION OPEN'
                                      ? 'Join Sprint'
                                      : 'View Arena'}
                                  </span>
                                  <ArrowUpRight size={16} />
                                </button>
                              </div>

                              <p
                                style={{
                                  color: 'var(--text-secondary)',
                                  fontSize: '0.98rem',
                                  lineHeight: 1.65,
                                  margin: '0 0 20px',
                                }}
                              >
                                {sprint.description}
                              </p>

                              <div
                                style={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: '20px',
                                  paddingTop: '16px',
                                  borderTop: '1px solid var(--border-subtle)',
                                  fontSize: '0.88rem',
                                  color: 'var(--text-muted)',
                                }}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                  }}
                                >
                                  <Clock size={16} color="var(--accent)" />{' '}
                                  {sprint.duration}
                                </div>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                  }}
                                >
                                  <Flag size={16} color="var(--accent)" />{' '}
                                  {sprint.challenges}
                                </div>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                  }}
                                >
                                  <Award size={16} color="var(--accent)" />{' '}
                                  {sprint.reward}
                                </div>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    marginLeft: 'auto',
                                  }}
                                >
                                  <span
                                    style={{
                                      padding: '2px 8px',
                                      borderRadius: '4px',
                                      background: 'var(--bg-surface)',
                                      fontWeight: 700,
                                      fontSize: '0.78rem',
                                      color: 'var(--accent)',
                                    }}
                                  >
                                    {sprint.difficulty}
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div
                              key="back"
                              initial={{ rotateY: -90, opacity: 0 }}
                              animate={{ rotateY: 0, opacity: 1 }}
                              exit={{ rotateY: 90, opacity: 0 }}
                              transition={{
                                duration: 0.38,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              style={{
                                transformStyle: 'preserve-3d',
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-subtle)',
                                borderTop: '1.5px solid var(--border-specular)',
                                borderBottom: '1px solid var(--border-bottom)',
                                borderRadius: '26px',
                                padding: '34px 38px',
                                boxShadow: 'var(--shadow-card)',
                                backdropFilter: 'blur(14px)',
                                WebkitBackdropFilter: 'blur(14px)',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  gap: '14px',
                                  marginBottom: '16px',
                                }}
                              >
                                <h3
                                  style={{
                                    fontFamily: 'var(--font-display)',
                                    fontSize: '1.65rem',
                                    fontWeight: 700,
                                    color: 'var(--text-primary)',
                                    margin: 0,
                                    letterSpacing: '-0.01em',
                                  }}
                                >
                                  Mini CTF registration
                                </h3>
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '14px',
                                  }}
                                >
                                  <span
                                    style={{
                                      fontSize: '0.94rem',
                                      fontWeight: 700,
                                      color: '#ea580c',
                                      letterSpacing: '0.2px',
                                    }}
                                  >
                                    Coming soon
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setFlippedSprintId(null)}
                                    aria-label="Back to sprint details"
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '6px',
                                      background: 'var(--bg-surface)',
                                      border: '1px solid var(--border-subtle)',
                                      color: 'var(--text-secondary)',
                                      padding: '6px 14px',
                                      borderRadius: '999px',
                                      fontSize: '0.82rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.color =
                                        'var(--text-primary)'
                                      e.currentTarget.style.borderColor =
                                        'var(--accent)'
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.color =
                                        'var(--text-secondary)'
                                      e.currentTarget.style.borderColor =
                                        'var(--border-subtle)'
                                    }}
                                  >
                                    <ArrowLeft size={14} />
                                    <span>Back</span>
                                  </button>
                                </div>
                              </div>

                              <div
                                style={{
                                  height: '1px',
                                  background: 'var(--border-subtle)',
                                  marginBottom: '20px',
                                }}
                              />

                              <p
                                style={{
                                  color: 'var(--text-secondary)',
                                  fontSize: '0.96rem',
                                  lineHeight: 1.6,
                                  margin: '0 0 24px',
                                }}
                              >
                                Registration is planned for early November. This
                                form will open once the date is confirmed.
                              </p>

                              <h4
                                style={{
                                  fontSize: '1.08rem',
                                  fontWeight: 700,
                                  color: 'var(--text-primary)',
                                  margin: '0 0 18px',
                                  letterSpacing: '-0.01em',
                                }}
                              >
                                Participant details
                              </h4>

                              <div style={{ marginBottom: '20px' }}>
                                <label
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '0.92rem',
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                    marginBottom: '8px',
                                  }}
                                >
                                  <span>Institute email</span>
                                  <span
                                    style={{
                                      fontSize: '0.78rem',
                                      fontWeight: 500,
                                      color: 'var(--text-muted)',
                                    }}
                                  >
                                    Required
                                  </span>
                                </label>
                                <input
                                  type="email"
                                  placeholder="Your institute email address"
                                  value={regForm.email}
                                  onChange={(e) =>
                                    setRegForm({
                                      ...regForm,
                                      email: e.target.value,
                                    })
                                  }
                                  style={{
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    padding: '13px 16px',
                                    borderRadius: '12px',
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-subtle)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'all 0.2s ease',
                                    fontFamily: 'inherit',
                                  }}
                                  onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--accent)'
                                    e.target.style.boxShadow =
                                      '0 0 0 3px var(--accent-glow)'
                                  }}
                                  onBlur={(e) => {
                                    e.target.style.borderColor =
                                      'var(--border-subtle)'
                                    e.target.style.boxShadow = 'none'
                                  }}
                                />
                                <div
                                  style={{
                                    fontSize: '0.82rem',
                                    color: 'var(--text-muted)',
                                    marginTop: '6px',
                                    lineHeight: 1.4,
                                  }}
                                >
                                  Use the email address provided by your
                                  institute.
                                </div>
                              </div>

                              <div style={{ marginBottom: '26px' }}>
                                <label
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '0.92rem',
                                    fontWeight: 600,
                                    color: 'var(--text-primary)',
                                    marginBottom: '8px',
                                  }}
                                >
                                  <span>pwn.college username</span>
                                  <span
                                    style={{
                                      fontSize: '0.78rem',
                                      fontWeight: 500,
                                      color: 'var(--text-muted)',
                                    }}
                                  >
                                    Required
                                  </span>
                                </label>
                                <input
                                  type="text"
                                  placeholder="Your pwn.college username"
                                  value={regForm.pwnUsername}
                                  onChange={(e) =>
                                    setRegForm({
                                      ...regForm,
                                      pwnUsername: e.target.value,
                                    })
                                  }
                                  style={{
                                    width: '100%',
                                    boxSizing: 'border-box',
                                    padding: '13px 16px',
                                    borderRadius: '12px',
                                    background: 'var(--bg-surface)',
                                    border: '1px solid var(--border-subtle)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    transition: 'all 0.2s ease',
                                    fontFamily: 'inherit',
                                  }}
                                  onFocus={(e) => {
                                    e.target.style.borderColor = 'var(--accent)'
                                    e.target.style.boxShadow =
                                      '0 0 0 3px var(--accent-glow)'
                                  }}
                                  onBlur={(e) => {
                                    e.target.style.borderColor =
                                      'var(--border-subtle)'
                                    e.target.style.boxShadow = 'none'
                                  }}
                                />
                                <div
                                  style={{
                                    fontSize: '0.82rem',
                                    color: 'var(--text-muted)',
                                    marginTop: '6px',
                                    lineHeight: 1.4,
                                  }}
                                >
                                  Enter your username, not your password.
                                </div>
                              </div>

                              <button
                                type="button"
                                disabled
                                style={{
                                  width: '100%',
                                  padding: '14px 20px',
                                  borderRadius: '12px',
                                  background: 'rgba(120, 120, 128, 0.45)',
                                  border: '1px solid var(--border-subtle)',
                                  color: '#ffffff',
                                  fontSize: '0.98rem',
                                  fontWeight: 700,
                                  cursor: 'not-allowed',
                                  textAlign: 'center',
                                  marginBottom: '14px',
                                  opacity: 0.88,
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                Registration opening soon
                              </button>

                              <div
                                style={{
                                  fontSize: '0.84rem',
                                  color: 'var(--text-muted)',
                                  lineHeight: 1.5,
                                }}
                              >
                                Entries are not being collected yet.
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderTop: '1.5px solid var(--border-specular)',
                  borderBottom: '1px solid var(--border-bottom)',
                  borderRadius: '28px',
                  padding: '40px',
                  marginBottom: '60px',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <span
                    style={{
                      color: 'var(--accent)',
                      textTransform: 'uppercase',
                      letterSpacing: '2px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                    }}
                  >
                    Protocol
                  </span>
                  <h3
                    style={{
                      fontSize: '1.8rem',
                      fontWeight: 800,
                      color: 'var(--text-primary)',
                      marginTop: '6px',
                    }}
                  >
                    How Mini CTFs Operate
                  </h3>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '24px',
                  }}
                >
                  {[
                    {
                      step: '01',
                      title: 'Speed Run Window',
                      desc: 'Each sprint runs for strictly 2.5 to 3 hours on our self-hosted CTFd instance.',
                    },
                    {
                      step: '02',
                      title: 'Dynamic Point Decay',
                      desc: 'First bloods receive massive point bonuses; challenge points decay as more competitors solve.',
                    },
                    {
                      step: '03',
                      title: 'Live Debrief & Writeups',
                      desc: 'Immediately following the flag countdown, challenge authors present step-by-step solutions on Discord.',
                    },
                    {
                      step: '04',
                      title: 'Club XP & Selection',
                      desc: 'Top scorers earn club badges and fast-track invitations to the official inter-IIT CTF traveling squad.',
                    },
                  ].map((rule, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '24px',
                        borderRadius: '18px',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.18)',
                        borderBottom: '1px solid var(--border-bottom)',
                        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.40)',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--accent)',
                          fontWeight: 800,
                          fontSize: '1.2rem',
                          marginBottom: '8px',
                        }}
                      >
                        {rule.step}
                      </div>
                      <h4
                        style={{
                          fontSize: '1.05rem',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                          marginBottom: '6px',
                        }}
                      >
                        {rule.title}
                      </h4>
                      <p
                        style={{
                          fontSize: '0.88rem',
                          lineHeight: 1.6,
                          color: 'var(--text-secondary)',
                          margin: 0,
                        }}
                      >
                        {rule.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                style={{
                  marginTop: '40px',
                  padding: '28px 36px',
                  borderRadius: '26px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderTop: '1.5px solid var(--border-specular)',
                  borderBottom: '1px solid var(--border-bottom)',
                  backdropFilter: 'blur(14px)',
                  WebkitBackdropFilter: 'blur(14px)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '24px',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '18px',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: 'var(--accent-dim)',
                      border: '1px solid var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Trophy size={24} color="var(--accent)" />
                  </div>
                  <div>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: '1.2rem',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                      }}
                    >
                      Ready for the national tournament stage?
                    </h4>
                    <p
                      style={{
                        margin: '4px 0 0',
                        fontSize: '0.94rem',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      HackShield CTF 2025 is our 36-hour national championship
                      featuring ₹1,00,000+ prize pool and top teams across
                      India.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleTabChange('flagship')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '9999px',
                    background: 'var(--accent-dim)',
                    border: '1.5px solid var(--accent)',
                    color: 'var(--accent)',
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 14px var(--accent-glow)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--accent)'
                    e.currentTarget.style.color = '#ffffff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--accent-dim)'
                    e.currentTarget.style.color = 'var(--accent)'
                  }}
                >
                  <span>Explore Flagship Tournament</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function CTFPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ color: 'var(--accent)' }}>Loading CTF Arenas...</div>
        </div>
      }
    >
      <CTFContent />
    </Suspense>
  )
}

