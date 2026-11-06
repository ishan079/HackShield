'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { BookOpen, CheckCircle2, ArrowUpRight, Terminal } from 'lucide-react'
import { ProgramTrack, WeekItem } from '@/types'

export default function ProgramsPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const { ref: weeksRef } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const [activeWeek, setActiveWeek] = useState(0)

  const weeks: WeekItem[] = [
    {
      num: '01',
      phase: 'GET ORIENTED',
      title: 'Start with the Fundamentals',
      desc: 'Build shared context for the ideas and questions that shape modern cybersecurity. Architecture of the internet, Linux command line fluency, packet capture basics, and ethical frameworks.',
      topics: [
        'Linux Shell & Kernel Internals',
        'OSI Model & TCP/IP Packet Deep-dive',
        'Threat Modeling & Attack Surfaces',
      ],
    },
    {
      num: '02',
      phase: 'GET CURIOUS',
      title: 'Open the Conversation & Prep',
      desc: 'Before jumping into exploitation, we hold informal collaborative teardowns. What does a malicious payload actually look like in memory? How do modern firewalls distinguish harmless traffic?',
      topics: [
        'Network Reconnaissance with Nmap',
        'Wireshark Packet Dissection',
        'Web Protocols (HTTP/2, WebSockets, DNS)',
      ],
    },
    {
      num: '03',
      phase: 'FOCUS',
      title: 'Vulnerability Discovery & Web Security',
      desc: 'Each session explores a fresh vulnerability class with deliberate space for live questioning, interactive breakpoints, and source code auditing.',
      topics: [
        'OWASP Top 10 Exploitation',
        'SQL Injections & Authentication Bypasses',
        'Client-side attacks (XSS, CSRF, CORS)',
      ],
    },
    {
      num: '04',
      phase: 'EXPLORE',
      title: 'Connect the Domains',
      desc: 'Cybersecurity touches multiple specialisations. We venture into penetration testing workflows, API security, container security, and foundational cryptography.',
      topics: [
        'Metasploit & Automated Exploits',
        'Symmetric vs Asymmetric Ciphers',
        'Cloud Security & Docker Sandbox Escapes',
      ],
    },
    {
      num: '05',
      phase: 'GET HANDS-ON',
      title: 'Make the Ideas Tangible',
      desc: 'Turning concepts into verifiable muscle memory. Students tackle guided, isolated vulnerable machines mimicking real-world corporate infrastructures.',
      topics: [
        'Privilege Escalation (Linux & Windows)',
        'Active Directory & Kerberos Fundamentals',
        'Real-world Lab Defenses',
      ],
    },
    {
      num: '06',
      phase: 'BRING IT TOGETHER',
      title: 'Rookie CTF + Certification',
      desc: 'Close the six-week journey with an exclusive 12-hour Rookie CTF tournament, peer code walkthroughs, and verified certificate of completion from IIT Patna HackShield.',
      topics: [
        'Jeopardy-style CTF Competition',
        'Live Writeup Submissions',
        'Mentorship Feedback & Certificate Award',
      ],
    },
  ]

  const programs: ProgramTrack[] = [
    {
      badge: 'Flagship Curriculum',
      title: '6-Week Guided Cybersecurity Track',
      timeline: '6 Consecutive Weeks · Fall & Spring Cohorts',
      desc: 'A rigorous, structured pathway taking curious undergraduates from absolute zero to confident participants capable of competing in collegiate CTFs.',
      features: [
        'Hands-on lab environments provided for every student',
        'Discord and WhatsApp dedicated peer study circles',
        'Capstone Rookie CTF with awards and certificates',
      ],
      linkText: 'Join Cohort Waiting List',
    },
    {
      badge: 'Industry Insight',
      title: 'Weekend Guest Speaker Series',
      timeline: 'Saturdays / Sundays · 1—2 Months Interval',
      desc: 'Invited practitioners from top cybersecurity companies, intelligence firms, and research labs share unfiltered views into real-world incident response and defensive engineering.',
      features: [
        'Interactive Q&A sessions with security directors & engineers',
        'Behind-the-scenes teardowns of actual zero-day discoveries',
        'Career guidance, resume reviews, and internship referrals',
      ],
      linkText: 'View Speaker Schedule',
    },
    {
      badge: 'Skill Sharpener',
      title: 'Weekly CTF Sandbox & Drills',
      timeline: 'Every Saturday Evening · 2 Hours',
      desc: 'Informal, high-energy live challenge solving. We pick challenging boxes on HackTheBox or past DEFCON/Google CTF archives and solve them together on the big screen.',
      features: [
        'Collaborative problem solving without gatekeeping',
        'Live screenshare walkthroughs by senior club members',
        'Writeup repo maintenance for club archives',
      ],
      linkText: 'Join Saturday Sessions',
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
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          ref={heroRef}
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '70px' }}
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
              fontSize: '0.85rem',
              letterSpacing: '1px',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            <BookOpen size={14} /> Club Programs & Curriculums
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: '20px',
              color: 'var(--text-primary)',
            }}
          >
            Structured Programs.
            <br />
            <span
              style={{
                color: 'var(--accent)',
                fontStyle: 'italic',
                fontFamily: 'Georgia, serif',
              }}
            >
              Tangible Mastery.
            </span>
          </h1>
          <p
            style={{
              maxWidth: 680,
              margin: '0 auto',
              fontSize: '1.15rem',
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
            }}
          >
            Whether you want a steady six-week foundational track or weekend
            masterclasses with industry veterans, HackShield creates a rigorous
            room for everyone.
          </p>
        </motion.div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px',
            marginBottom: '100px',
          }}
        >
          {programs.map((p, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              style={{
                position: 'relative',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderTop: '1.5px solid var(--border-specular)',
                borderBottom: '1px solid var(--border-bottom)',
                borderRadius: '28px',
                padding: '36px',
                boxShadow: 'var(--shadow-card)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.30)'
                e.currentTarget.style.borderTopColor =
                  'rgba(255, 255, 255, 0.58)'
                e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)'
                e.currentTarget.style.borderTopColor = 'var(--border-specular)'
                e.currentTarget.style.boxShadow = 'var(--shadow-card)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <div>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontSize: '0.74rem',
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase',
                    fontWeight: 800,
                    color: 'var(--accent)',
                    background: 'var(--accent-dim)',
                    border: '1px solid rgba(232, 132, 91, 0.28)',
                    padding: '5px 12px',
                    borderRadius: '999px',
                    marginBottom: '16px',
                    boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.2)',
                  }}
                >
                  {p.badge}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    marginBottom: '8px',
                  }}
                >
                  {p.title}
                </h3>
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    marginBottom: '18px',
                  }}
                >
                  {p.timeline}
                </div>
                <p
                  style={{
                    fontSize: '0.98rem',
                    lineHeight: 1.7,
                    color: 'var(--text-secondary)',
                    marginBottom: '24px',
                  }}
                >
                  {p.desc}
                </p>

                <div
                  style={{
                    borderTop: '1px solid var(--border-divider)',
                    paddingTop: '20px',
                    marginBottom: '28px',
                  }}
                >
                  {p.features.map((feat, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '12px',
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <CheckCircle2 size={16} color="var(--accent)" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href="https://chat.whatsapp.com/Kk4EPaNeHkp8oNQZ8O0ZR7"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '9999px',
                  border: '1px solid var(--accent)',
                  color: 'var(--accent)',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  letterSpacing: '0.01em',
                  transition: 'all 0.24s cubic-bezier(0.16, 1, 0.3, 1)',
                  background: 'var(--accent-dim)',
                  boxShadow: '0 2px 10px var(--accent-subtle)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background =
                    'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)'
                  e.currentTarget.style.color = '#ffffff'
                  e.currentTarget.style.boxShadow =
                    '0 6px 20px var(--accent-glow)'
                  e.currentTarget.style.transform = 'scale(1.02)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--accent-dim)'
                  e.currentTarget.style.color = 'var(--accent)'
                  e.currentTarget.style.boxShadow =
                    '0 2px 10px var(--accent-subtle)'
                  e.currentTarget.style.transform = 'scale(1)'
                }}
              >
                {p.linkText} <ArrowUpRight size={16} />
              </a>
            </motion.div>
          ))}
        </div>

        <div
          ref={weeksRef}
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderTop: '1.5px solid var(--border-specular)',
            borderBottom: '1px solid var(--border-bottom)',
            borderRadius: '28px',
            padding: '44px',
            boxShadow: 'var(--shadow-card)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
          }}
        >
          <div style={{ marginBottom: '36px' }}>
            <span
              style={{
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              Curriculum Roadmap
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.2rem',
                fontWeight: 800,
                marginTop: '8px',
                color: 'var(--text-primary)',
              }}
            >
              The Six-Week Cybersecurity Pathway
            </h2>
            <p
              style={{
                color: 'var(--text-secondary)',
                maxWidth: 640,
                marginTop: '8px',
                fontSize: '1rem',
              }}
            >
              From &quot;What is a vulnerability?&quot; to capturing your first live
              exploit flag. Click through each week to examine the syllabus
              breakdown.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '12px',
              marginBottom: '32px',
            }}
          >
            {weeks.map((w, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveWeek(idx)}
                style={{
                  padding: '14px 12px',
                  borderRadius: '12px',
                  border:
                    activeWeek === idx
                      ? '2px solid var(--accent)'
                      : '1px solid var(--border-subtle)',
                  background:
                    activeWeek === idx
                      ? 'var(--accent-dim)'
                      : 'var(--bg-surface)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    color:
                      activeWeek === idx ? 'var(--accent)' : 'var(--text-muted)',
                  }}
                >
                  {w.num}
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    letterSpacing: '1px',
                    color:
                      activeWeek === idx
                        ? 'var(--text-primary)'
                        : 'var(--text-muted)',
                    fontWeight: 700,
                    marginTop: '4px',
                  }}
                >
                  {w.phase}
                </div>
              </button>
            ))}
          </div>

          <motion.div
            key={activeWeek}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderTop: '1px solid rgba(255, 255, 255, 0.22)',
              borderBottom: '1px solid var(--border-bottom)',
              borderRadius: '20px',
              padding: '32px',
              boxShadow:
                'inset 0 2px 4px rgba(0, 0, 0, 0.40), var(--shadow-sm)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px',
              }}
            >
              <span
                style={{
                  background: 'var(--accent)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  padding: '4px 10px',
                  borderRadius: '6px',
                }}
              >
                WEEK {weeks[activeWeek].num}
              </span>
              <span
                style={{
                  color: 'var(--accent)',
                  letterSpacing: '1.5px',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                }}
              >
                {weeks[activeWeek].phase}
              </span>
            </div>

            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.8rem',
                fontWeight: 800,
                color: 'var(--text-primary)',
                marginBottom: '12px',
              }}
            >
              {weeks[activeWeek].title}
            </h3>
            <p
              style={{
                fontSize: '1.05rem',
                lineHeight: 1.7,
                color: 'var(--text-secondary)',
                marginBottom: '24px',
                maxWidth: 850,
              }}
            >
              {weeks[activeWeek].desc}
            </p>

            <h4
              style={{
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: '14px',
                fontWeight: 700,
              }}
            >
              Key Practical Modules Covered:
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {weeks[activeWeek].topics.map((t, i) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--accent-dim)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontSize: '0.9rem',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Terminal size={14} color="var(--accent)" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

