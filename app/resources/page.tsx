'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  FolderGit2,
  Terminal,
  ExternalLink,
  Search,
  BookOpen,
  Cpu,
  Globe,
  Code2,
  Lock,
  FileText,
  BookmarkCheck,
  Sparkles,
} from 'lucide-react'
import { ResourceItem, ResourceCategory } from '@/types'

export default function ResourcesPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const { ref: heroRef, inView: heroInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const categories: ResourceCategory[] = [
    { id: 'all', label: 'All Resources' },
    { id: 'platforms', label: 'Practice Arenas' },
    { id: 'tools', label: 'Core Tools' },
    { id: 'guides', label: 'Cheat Sheets & Docs' },
    { id: 'community', label: 'Community & Groups' },
  ]

  const resources: ResourceItem[] = [
    {
      id: 'thm',
      category: 'platforms',
      title: 'TryHackMe',
      badge: 'Interactive Labs',
      desc: 'Gamified labs covering Linux privilege escalation, network scanning, and Active Directory penetration testing.',
      tags: ['Labs', 'Network', 'PrivEsc'],
      link: 'https://tryhackme.com',
      icon: <Terminal size={19} color="var(--accent)" />,
    },
      {
          id: 'htb',
          category: 'platforms',
          title: 'Hack The Box',
          badge: 'Interactive Labs',
          desc: 'Gamified labs covering Linux privilege escalation, network scanning, and Active Directory penetration testing.',
          tags: ['Labs', 'Network', 'PrivEsc'],
          link: 'https://hackthebox.com',
          icon: <Terminal size={19} color="var(--accent)" />,
      },
    {
      id: 'portswigger',
      category: 'platforms',
      title: 'PortSwigger Web Academy',
      badge: 'Web Security',
      desc: 'The definitive laboratory for modern web vulnerabilities, maintained by the creators of Burp Suite.',
      tags: ['SQLi', 'XSS', 'SSRF', 'JWT'],
      link: 'https://portswigger.net/web-security',
      icon: <Globe size={19} color="var(--accent)" />,
    },

    {
      id: 'cryptohack',
      category: 'platforms',
      title: 'CryptoHack',
      badge: 'Modern Crypto',
      desc: 'A fun, interactive platform to master modern applied cryptography through Python puzzle scripts.',
      tags: ['RSA', 'ECC', 'Diffie-Hellman'],
      link: 'https://cryptohack.org',
      icon: <Lock size={19} color="var(--accent)" />,
    },
    {
      id: 'ghidra',
      category: 'tools',
      title: 'Ghidra & IDA Free',
      badge: 'Reverse Engineering',
      desc: 'NSA-developed software reverse engineering suite with decompiler, disassembler, and graphing tools.',
      tags: ['Decompiler', 'ELF/PE', 'x86/ARM'],
      link: 'https://ghidra-sre.org',
      icon: <Cpu size={19} color="var(--accent)" />,
    },
    {
      id: 'cyberchef',
      category: 'tools',
      title: 'CyberChef',
      badge: 'Swiss Army Knife',
      desc: 'Browser-based data manipulation app for encryption, encoding, compression, and rapid payload decoding.',
      tags: ['Encoding', 'Base64', 'Hex', 'Hashing'],
      link: 'https://gchq.github.io/CyberChef',
      icon: <Code2 size={19} color="var(--accent)" />,
    },
    {
      id: 'gtfobins',
      category: 'guides',
      title: 'PayloadsAllTheThings & GTFOBins',
      badge: 'PrivEsc Vault',
      desc: 'Curated index of Unix and Windows binaries that can be leveraged to bypass restrictions and escalate.',
      tags: ['Linux', 'SUID', 'Bypass', 'PrivEsc'],
      link: 'https://gtfobins.github.io',
      icon: <BookmarkCheck size={19} color="var(--accent)" />,
    },
  ]

  const filtered = resources.filter((res) => {
    const matchesCategory =
      activeCategory === 'all' || res.category === activeCategory
    const matchesSearch =
      res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.badge.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

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
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px' }}>
        <motion.div
          ref={heroRef}
          initial={{ opacity: 0, y: 24 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          style={{ textAlign: 'center', marginBottom: '45px' }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.4rem, 4.8vw, 3.8rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: '14px',
              color: 'var(--text-primary)',
            }}
          >
            Your Security Toolkit.
            <br />
            <span
              style={{
                color: 'var(--accent)',
                fontStyle: 'italic',
                fontFamily: 'Georgia, serif',
              }}
            >
              Curated & Battle-Tested.
            </span>
          </h1>

          <p
            style={{
              maxWidth: 640,
              margin: '0 auto',
              fontSize: '1.08rem',
              lineHeight: 1.7,
              color: 'var(--text-secondary)',
            }}
          >
            Handpicked practice platforms, essential toolkits, and privilege
            escalation references vetted by IIT Patna HackShield mentors.
          </p>
        </motion.div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '44px',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '5px',
              borderRadius: '9999px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderTop: '1.5px solid var(--border-specular)',
              borderBottom: '1px solid var(--border-bottom)',
              boxShadow: 'var(--shadow-card)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              gap: '4px',
              maxWidth: '100%',
              overflowX: 'auto',
            }}
          >
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    position: 'relative',
                    padding: '8px 18px',
                    borderRadius: '9999px',
                    fontSize: '0.86rem',
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                    whiteSpace: 'nowrap',
                    zIndex: 1,
                    outline: 'none',
                  }}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="res-active-pill"
                      transition={{
                        type: 'spring',
                        stiffness: 450,
                        damping: 35,
                      }}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '9999px',
                        background:
                          'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
                        boxShadow: '0 4px 14px var(--accent-glow)',
                        zIndex: -1,
                      }}
                    />
                  )}
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              maxWidth: '640px',
              gap: '12px',
            }}
          >
            <div style={{ position: 'relative', flex: 1 }}>
              <Search
                size={16}
                color="var(--text-muted)"
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                }}
              />
              <input
                type="text"
                placeholder="Search tools, platforms, cheat sheets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="theme-input"
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  borderRadius: '9999px',
                  padding: '11px 40px 11px 44px',
                  fontSize: '0.9rem',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'inset 0 1.5px 3px rgba(0, 0, 0, 0.35)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchTerm('')}
                  style={{
                    position: 'absolute',
                    right: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    padding: '4px',
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                padding: '9px 14px',
                borderRadius: '9999px',
                whiteSpace: 'nowrap',
                letterSpacing: '0.06em',
              }}
            >
              {filtered.length} {filtered.length === 1 ? 'ITEM' : 'ITEMS'}
            </span>
          </div>
        </div>

        {filtered.length > 0 ? (
          <motion.div
            layout
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '22px',
              marginBottom: '60px',
            }}
          >
            <AnimatePresence>
              {filtered.map((item, idx) => (
                <motion.a
                  key={item.id}
                  href={item.link}
                  target={item.link.startsWith('http') ? '_blank' : '_self'}
                  rel="noreferrer"
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.28, delay: idx * 0.03 }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    textDecoration: 'none',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderTop: '1.5px solid var(--border-specular)',
                    borderBottom: '1px solid var(--border-bottom)',
                    borderRadius: '24px',
                    padding: '24px 26px',
                    boxShadow: 'var(--shadow-card)',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      'rgba(255, 255, 255, 0.30)'
                    e.currentTarget.style.borderTopColor =
                      'rgba(255, 255, 255, 0.58)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'
                    e.currentTarget.style.transform = 'translateY(-4px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)'
                    e.currentTarget.style.borderTopColor =
                      'var(--border-specular)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-card)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                  className="hs-resource-card"
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '14px',
                      }}
                    >
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '12px',
                          background: 'var(--accent-dim)',
                          border: '1px solid rgba(232, 132, 91, 0.25)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {item.icon}
                      </div>

                      <span
                        style={{
                          fontSize: '0.68rem',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: 'var(--accent)',
                          background: 'var(--bg-surface)',
                          border: '1px solid var(--border-subtle)',
                          padding: '3px 10px',
                          borderRadius: '999px',
                          fontWeight: 700,
                          fontFamily: 'var(--font-mono)',
                          boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.25)',
                        }}
                      >
                        {item.badge}
                      </span>
                    </div>

                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.22rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginBottom: '8px',
                        lineHeight: 1.3,
                      }}
                    >
                      {item.title}
                    </h3>

                    <p
                      style={{
                        fontSize: '0.88rem',
                        lineHeight: 1.6,
                        color: 'var(--text-secondary)',
                        margin: '0 0 16px',
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>

                  <div>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        marginBottom: '14px',
                      }}
                    >
                      {item.tags.map((t) => (
                        <span
                          key={t}
                          style={{
                            fontSize: '0.68rem',
                            color: 'var(--text-muted)',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid var(--border-divider)',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div
                      style={{
                        borderTop: '1px solid var(--border-divider)',
                        paddingTop: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: 'var(--accent)',
                      }}
                    >
                      <span>Launch Resource</span>
                      <ExternalLink
                        size={14}
                        className="hs-res-arrow"
                        style={{ transition: 'transform 0.2s ease' }}
                      />
                    </div>
                  </div>
                </motion.a>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '50px 24px',
              background: 'var(--bg-card)',
              borderRadius: '24px',
              border: '1px solid var(--border-subtle)',
              borderTop: '1.5px solid var(--border-specular)',
              borderBottom: '1px solid var(--border-bottom)',
              boxShadow: 'var(--shadow-card)',
              backdropFilter: 'blur(14px)',
              maxWidth: '520px',
              margin: '0 auto 60px',
            }}
          >
            <Search
              size={32}
              color="var(--text-muted)"
              style={{ margin: '0 auto 12px' }}
            />
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: '6px',
              }}
            >
              No matching resources
            </h3>
            <p
              style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                marginBottom: '20px',
              }}
            >
              We couldn&apos;t find anything matching &quot;{searchTerm}&quot;.
              Try resetting your filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchTerm('')
                setActiveCategory('all')
              }}
              style={{
                padding: '10px 22px',
                borderRadius: '9999px',
                background: 'var(--accent)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer',
                border: 'none',
                boxShadow: '0 4px 14px var(--accent-glow)',
              }}
            >
              Reset All Filters
            </button>
          </div>
        )}

        <div
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderTop: '1.5px solid var(--border-specular)',
            borderBottom: '1px solid var(--border-bottom)',
            borderRadius: '24px',
            padding: '24px 32px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
            boxShadow: 'var(--shadow-card)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              maxWidth: '720px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'var(--accent-dim)',
                border: '1px solid rgba(232, 132, 91, 0.28)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Sparkles size={20} color="var(--accent)" />
            </div>
            <div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  margin: 0,
                }}
              >
                Have a curated tool or writeup to share with the club?
              </h3>
              <p
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)',
                  margin: '3px 0 0',
                }}
              >
                HackShield maintains an open community knowledge base. Submit a
                pull request on GitHub or message our coordinators on Discord.
              </p>
            </div>
          </div>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '11px 22px',
              borderRadius: '9999px',
              background:
                'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.88rem',
              textDecoration: 'none',
              boxShadow: '0 4px 14px var(--accent-glow)',
              transition: 'transform 0.2s ease',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <span>Contribute on GitHub</span>
            <ExternalLink size={14} />
          </a>
        </div>
      </div>

      <style>{`
        .hs-resource-card:hover .hs-res-arrow {
          transform: translate(2px, -2px);
        }
      `}</style>
    </div>
  )
}

