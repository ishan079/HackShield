'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Shield, Users, Terminal, Lock, Cpu, Sparkles } from 'lucide-react'

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const { ref: valuesRef, inView: valuesInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const { ref: timelineRef, inView: timelineInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const values = [
    {
      icon: <Terminal size={24} color="var(--accent)" />,
      title: 'Pragmatic Security First',
      desc: 'Theory is important, but practical mastery breaks through the noise. We teach offensive and defensive skills by digging straight into memory buffers, network packets, and disassembled binaries.',
    },
    {
      icon: <Users size={24} color="var(--accent)" />,
      title: 'Fiercely Collaborative',
      desc: 'Cybersecurity is never a solo pursuit. HackShield connects curious first-years, hardened CTF competitors, and IIT Patna alumni working in Tier-1 security firms and defense agencies.',
    },
    {
      icon: <Lock size={24} color="var(--accent)" />,
      title: 'Responsible & Ethical',
      desc: 'With deep technical capability comes absolute responsibility. Every workshop and lab operates strictly within sanctioned ethical boundaries, instilling white-hat principles from day one.',
    },
    {
      icon: <Cpu size={24} color="var(--accent)" />,
      title: 'Systems-Level Thinking',
      desc: 'From silicon logic gates to cloud container orchestrators, we encourage learners to understand the complete abstraction stack rather than blindly running scripts or automated scanners.',
    },
  ]

  const milestones = [
    {
      year: '2021',
      title: 'The Genesis at IIT Patna',
      desc: 'Founded by a close-knit group of computer science undergraduates who wanted more practical systems security beyond standard coursework.',
    },
    {
      year: '2022',
      title: 'First Inter-Collegiate CTF',
      desc: 'Launched our inaugural internal and inter-IIT Capture The Flag competition with over 300 students and custom-authored reverse engineering challenges.',
    },
    {
      year: '2023',
      title: 'Bootcamp & Industry Synergy',
      desc: 'Introduced our flagship 6-Week Structured Cybersecurity track and hosted guest lectures with security researchers from Google Project Zero and top security consultancies.',
    },
    {
      year: '2024+',
      title: 'National Standing & Research',
      desc: 'HackShield CTF expanded nationwide with 1,500+ participants, while our club members contributed CVEs, bug bounties, and academic security papers.',
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
        paddingBottom: '80px',
        color: 'var(--text-primary)',
        transition: 'color 0.35s ease',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>
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
              padding: '6px 16px',
              marginBottom: '20px',
              fontSize: '0.85rem',
              letterSpacing: '1px',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            <Shield size={14} /> IIT Patna Official Cybersecurity Club
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: '20px',
              color: 'var(--text-primary)',
            }}
          >
            Protecting What Matters.
            <br />
            <span
              style={{
                color: 'var(--accent)',
                fontStyle: 'italic',
                fontFamily: 'Georgia, serif',
              }}
            >
              Exploring The Depths.
            </span>
          </h1>
          <p
            style={{
              maxWidth: 720,
              margin: '0 auto',
              fontSize: '1.15rem',
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
            }}
          >
            HackShield is the premier technical security guild at the Indian
            Institute of Technology Patna. We are hackers, cryptographers, system
            architects, and reverse engineers committed to exploring vulnerabilities
            and strengthening digital resilience.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            position: 'relative',
            background: 'var(--card-gradient)',
            border: '1px solid var(--border-subtle)',
            borderTop: '1.5px solid var(--border-specular)',
            borderBottom: '1px solid var(--border-bottom)',
            borderRadius: '28px',
            padding: '40px',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
            marginBottom: '80px',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: 'var(--accent)',
              marginBottom: '12px',
            }}
          >
            <Sparkles size={20} />
            <span
              style={{
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              Our Vision
            </span>
          </div>
          <h2
            style={{
              fontSize: '1.8rem',
              fontWeight: 700,
              marginBottom: '16px',
              color: 'var(--text-primary)',
            }}
          >
            Demystifying cybersecurity from kernel to cloud.
          </h2>
          <p
            style={{
              fontSize: '1.05rem',
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
              margin: 0,
            }}
          >
            Modern cyber threats do not wait for conventional curriculums to catch
            up. At HackShield, we bridge the gap between academic computer
            science and battle-tested industry security. We provide IIT Patna
            undergraduates with the tools, sandboxed infrastructure, and
            collaborative mentorship required to turn raw curiosity into verified
            expertise.
          </p>
        </motion.div>

        <div ref={valuesRef} style={{ marginBottom: '90px' }}>
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
              Principles
            </span>
            <h2
              style={{
                fontSize: '2.2rem',
                fontWeight: 800,
                marginTop: '8px',
                color: 'var(--text-primary)',
              }}
            >
              How We Operate
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px',
            }}
          >
            {values.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
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
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.30)'
                  e.currentTarget.style.borderTopColor =
                    'rgba(255, 255, 255, 0.58)'
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)'
                  e.currentTarget.style.borderTopColor = 'var(--border-specular)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-card)'
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'var(--accent-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '18px',
                  }}
                >
                  {val.icon}
                </div>
                <h3
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    marginBottom: '10px',
                    color: 'var(--text-primary)',
                  }}
                >
                  {val.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)',
                    margin: 0,
                  }}
                >
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <div ref={timelineRef} style={{ marginBottom: '80px' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span
              style={{
                color: 'var(--accent)',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontSize: '0.8rem',
                fontWeight: 700,
              }}
            >
              Evolution
            </span>
            <h2
              style={{
                fontSize: '2.2rem',
                fontWeight: 800,
                marginTop: '8px',
                color: 'var(--text-primary)',
              }}
            >
              Our Journey
            </h2>
          </div>

          <div
            style={{
              position: 'relative',
              maxWidth: '800px',
              margin: '0 auto',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '10px',
                bottom: '10px',
                left: '28px',
                width: '2px',
                background:
                  'linear-gradient(180deg, var(--accent) 0%, rgba(216,104,62,0.2) 100%)',
              }}
            />

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '36px',
              }}
            >
              {milestones.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={timelineInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  style={{
                    position: 'relative',
                    paddingLeft: '72px',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: '18px',
                      top: '4px',
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: 'var(--bg-primary)',
                      border: '3px solid var(--accent)',
                      boxShadow: '0 0 12px var(--accent-glow)',
                    }}
                  />

                  <div
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-subtle)',
                      borderTop: '1.5px solid var(--border-specular)',
                      borderBottom: '1px solid var(--border-bottom)',
                      borderRadius: '24px',
                      padding: '24px 28px',
                      boxShadow: 'var(--shadow-card)',
                      backdropFilter: 'blur(14px)',
                      WebkitBackdropFilter: 'blur(14px)',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: 'var(--accent)',
                        marginBottom: '6px',
                      }}
                    >
                      {item.year}
                    </span>
                    <h3
                      style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginBottom: '8px',
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.95rem',
                        lineHeight: 1.6,
                        color: 'var(--text-secondary)',
                        margin: 0,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

