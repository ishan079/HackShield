'use client'

import React, { useState, useRef, useEffect, FormEvent } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { TerminalLine } from '@/types'

export default function InteractiveTerminal() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 })

  const [inputVal, setInputVal] = useState('')
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      type: 'system',
      text: 'HackShield Interactive Security Sandbox v2.4 (Bihta Node)',
    },
    { type: 'system', text: 'Type "help" or click one of the quick actions below.' },
    { type: 'cmd', cmd: 'cat challenge.txt' },
    {
      type: 'output',
      text: 'CIPHERTEXT: VEdWMk1HUnBaM2xmVTNScGRHVnVaSE52Ym1sbGQwMWZjSFJ3YmpFPQ==',
    },
    { type: 'output', text: 'Task: Decipher the flag to join the Hall of Fame.' },
  ])
  const [isDecrypting, setIsDecrypting] = useState(false)
  const terminalBodyRef = useRef<HTMLDivElement | null>(null)
  const hasMountedRef = useRef(false)

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }
    // Only scroll the terminal inner viewport, NEVER the whole webpage
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight
    }
  }, [history])

  const handleCommand = (cmdStr: string) => {
    const raw = cmdStr.trim()
    const cmd = raw.toLowerCase()
    if (!raw) return

    const newHistory: TerminalLine[] = [...history, { type: 'cmd', cmd: raw }]

    switch (cmd) {
      case 'help':
        newHistory.push({
          type: 'output',
          text: 'AVAILABLE COMMANDS: cat challenge.txt | decrypt | whoami | members | flag | ctf | clear',
        })
        break
      case 'cat challenge.txt':
        newHistory.push({
          type: 'output',
          text: 'CIPHERTEXT: VEdWMk1HUnBaM2xmVTNScGRHVnVaSE52Ym1sbGQwMWZjSFJ3YmpFPQ==\nClue: Dual base64 layer with IIT Patna salt.',
        })
        break
      case 'decrypt':
      case 'solve':
        setIsDecrypting(true)
        newHistory.push({
          type: 'system',
          text: '[*] Initializing cryptographic permutation matrices...',
        })
        setTimeout(() => {
          setHistory((prev) => [
            ...prev,
            { type: 'system', text: '[*] Bypassing padding oracles... OK' },
            {
              type: 'success',
              text: '[✓] SUCCESS! FLAG{H4CK_L34RN_D3F3ND_T0G3TH3R_IITP_2025}',
            },
            {
              type: 'output',
              text: 'Welcome to the inner circle. Submit this at our next Rookie CTF!',
            },
          ])
          setIsDecrypting(false)
        }, 1200)
        break
      case 'whoami':
        newHistory.push({
          type: 'output',
          text: 'uid=1000(guest_researcher) gid=1000(hackshield_community) groups=1000(hackshield),4(adm),27(sudo)',
        })
        break
      case 'members':
        newHistory.push({
          type: 'output',
          text: 'LEADS: Yash Bhople (Kn1gh7), Ishan Mishra, Arjun Verma, Priya Sharma\nCAMPUS: IIT Patna Bihta Node',
        })
        break
      case 'ctf':
        newHistory.push({
          type: 'output',
          text: 'NEXT EVENT: HackShield CTF 2025 (Flagship National Tournament)\nREGISTRATION: Pre-register at /ctf',
        })
        break
      case 'clear':
        setHistory([])
        setInputVal('')
        return
      default:
        newHistory.push({
          type: 'error',
          text: `bash: command not found: ${raw}. Type "help" for options.`,
        })
        break
    }

    setHistory(newHistory)
    setInputVal('')
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleCommand(inputVal)
  }

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '20px auto 60px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          borderRadius: '28px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderTop: '1.5px solid var(--border-specular)',
          borderBottom: '1px solid var(--border-bottom)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div
          style={{
            padding: '12px 18px',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '0' }}>
            <span
              style={{
                width: '11px',
                height: '11px',
                borderRadius: '50%',
                background: '#ff5f56',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                width: '11px',
                height: '11px',
                borderRadius: '50%',
                background: '#ffbd2e',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                width: '11px',
                height: '11px',
                borderRadius: '50%',
                background: '#27c93f',
                display: 'inline-block',
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.74rem',
                color: 'var(--text-muted)',
                marginLeft: '8px',
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              guest@hackshield-iitp: ~/ctf-sandbox
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { label: 'cat challenge.txt', action: 'cat challenge.txt' },
              { label: 'Decrypt Flag ⚡', action: 'decrypt' },
              { label: 'whoami', action: 'whoami' },
              { label: 'clear', action: 'clear' },
            ].map((btn, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleCommand(btn.action)}
                disabled={isDecrypting}
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '0.7rem',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: 'var(--accent-dim)',
                  color: 'var(--accent)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
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
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={terminalBodyRef}
          style={{
            padding: '24px',
            minHeight: '220px',
            maxHeight: '340px',
            overflowY: 'auto',
            overflowX: 'hidden',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '0.86rem',
            lineHeight: 1.7,
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
          }}
        >
          {history.map((line, idx) => (
            <div key={idx} style={{ marginBottom: '6px', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
              {line.type === 'system' && (
                <span style={{ color: 'var(--text-muted)' }}>{line.text}</span>
              )}
              {line.type === 'cmd' && (
                <div>
                  <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
                    guest@iitp:~$
                  </span>{' '}
                  <span style={{ color: 'var(--text-primary)' }}>
                    {line.cmd}
                  </span>
                </div>
              )}
              {line.type === 'output' && (
                <div
                  style={{
                    color: 'var(--text-secondary)',
                    paddingLeft: '14px',
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {line.text}
                </div>
              )}
              {line.type === 'success' && (
                <div
                  style={{
                    color: 'var(--color-green)',
                    fontWeight: 700,
                    paddingLeft: '14px',
                    textShadow: '0 0 10px var(--color-green-glow)',
                    wordBreak: 'break-word',
                    overflowWrap: 'anywhere',
                  }}
                >
                  {line.text}
                </div>
              )}
              {line.type === 'error' && (
                <div style={{ color: 'var(--color-red)', paddingLeft: '14px', wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                  {line.text}
                </div>
              )}
            </div>
          ))}

          <form
            onSubmit={onSubmit}
            style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}
          >
            <span
              style={{
                color: 'var(--accent)',
                fontWeight: 700,
                marginRight: '8px',
              }}
            >
              guest@iitp:~$
            </span>
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="type help, decrypt, whoami..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '0.86rem',
                color: 'var(--text-primary)',
              }}
            />
          </form>
        </div>
      </div>
    </motion.section>
  )
}

