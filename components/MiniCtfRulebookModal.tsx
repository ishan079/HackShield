'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ExternalLink, FileText, X } from 'lucide-react'

export const MINI_CTF_DECLARATION =
  'I have read and agree to the HackShield Mini CTF pwn.college Rulebook. I will use my own pwn.college account, submit my correct username, work only on authorised challenge environments, and not share flags or solutions during the event.'

interface MiniCtfRulebookModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function MiniCtfRulebookModal({
  isOpen,
  onClose,
}: MiniCtfRulebookModalProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !isMounted) return null

  return createPortal(
    <div className="mini-ctf-rulebook-overlay" role="presentation">
      <section
        className="mini-ctf-rulebook-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mini-ctf-rulebook-title"
        aria-describedby="mini-ctf-rulebook-intro"
      >
        <header className="mini-ctf-rulebook-header">
          <div>
            <p className="mini-ctf-rulebook-kicker">
              <FileText size={14} aria-hidden="true" /> HackShield Mini CTF
            </p>
            <h2 id="mini-ctf-rulebook-title">pwn.college Rulebook</h2>
          </div>
          <button
            type="button"
            className="mini-ctf-rulebook-close"
            onClick={onClose}
            aria-label="Close rulebook"
          >
            <X size={19} aria-hidden="true" />
          </button>
        </header>

        <div className="mini-ctf-rulebook-content">
          <p id="mini-ctf-rulebook-intro" className="mini-ctf-rulebook-lede">
            This Mini CTF is a learning activity in a private pwn.college dojo.
            There are no prizes. By registering, you agree to these rules and
            the pwn.college ground rules.
          </p>

          <section>
            <h3>Before you register</h3>
            <ol>
              <li>
                Create a pwn.college account at{' '}
                <a href="https://pwn.college/register" target="_blank" rel="noreferrer">
                  pwn.college/register <ExternalLink size={13} aria-hidden="true" />
                </a>{' '}
                if you do not already have one.
              </li>
              <li>
                Enter your pwn.college username exactly as it appears on your
                account. Do not enter a display name, email address, or profile URL.
              </li>
              <li>
                Use your active <code>@iitp.ac.in</code> institute email. One
                institute email and one pwn.college username can each register once.
              </li>
            </ol>
          </section>

          <section>
            <h3>Join the HackShield dojo</h3>
            <ol>
              <li>Sign in to your pwn.college account.</li>
              <li>
                Open the{' '}
                <a
                  href="https://pwn.college/dojo/hackshield-iitp~13f8a31b/join/WeAreThePeople"
                  target="_blank"
                  rel="noreferrer"
                >
                  HackShield dojo invitation <ExternalLink size={13} aria-hidden="true" />
                </a>
                .
              </li>
              <li>
                Confirm that HackShield appears in your joined dojos, then open
                it and begin the assigned challenges.
              </li>
              <li>Make sure you have completed the registration process.</li>
            </ol>
            <p className="mini-ctf-rulebook-note">
              Keep the invitation link within the intended participant group.
            </p>
          </section>

          <section>
            <h3>Using pwn.college</h3>
            <ul>
              <li>
                Use the in-browser Terminal, VS Code workspace, or Desktop.
                SSH setup is not required.
              </li>
              <li>
                Read a challenge, start it, work only in its supplied environment,
                and submit its flag in the dojo interface.
              </li>
              <li>
                If an environment stops working, use its <strong>Restart</strong>{' '}
                option instead of attempting to repair platform infrastructure.
              </li>
            </ul>
          </section>

          <section>
            <h3>Rules of participation</h3>
            <ol>
              <li>Work only on HackShield challenges and authorised environments.</li>
              <li>Follow the pwn.college ground rules as well as these event rules.</li>
              <li>
                Do not share flags, direct solutions, walkthroughs, or live
                answers while the Mini CTF is active.
              </li>
              <li>Use your own account and do not share accounts or credentials.</li>
              <li>If you have not registered in the Mini CTF, please do so before attempting any challenges as we cannot record your participation officially even if you have most scores.</li>
            </ol>
          </section>
        </div>
      </section>
    </div>,
    document.body
  )
}
