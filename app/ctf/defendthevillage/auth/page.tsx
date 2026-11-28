'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  Hash,
  Lock,
  Mail,
  User,
} from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { api } from '@/lib/api'
import { MINI_CTF_SUBJECTS, type MiniCtfSubject } from '@/types/api'
import '../minecraft-ctf.css'

type AuthMode = 'login' | 'register'
type PerfTier = 'high' | 'low'

const IITP_EMAIL_PATTERN = /^[^\s@]+@iitp\.ac\.in$/i
const ROLL_NUMBER_PATTERN = /^[a-zA-Z0-9/_-]{3,40}$/
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

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
  if (reducedMotion || nav.connection?.saveData || lowCores || lowMemory || (coarsePointer && smallViewport)) {
    return 'low'
  }
  return 'high'
}

export default function MinecraftCTFAuthPage() {
  const { theme } = useTheme()
  const [perfTier, setPerfTier] = useState<PerfTier>('high')
  const [mode, setMode] = useState<AuthMode>('register')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<{ kind: 'idle' | 'error' | 'success'; text: string }>({
    kind: 'idle',
    text: '',
  })

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })

  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    rollNumber: '',
    subject: '' as '' | MiniCtfSubject,
    semester: '',
    email: '',
    mobileNumber: '',
    ctfdUsername: '',
  })

  useEffect(() => {
    window.scrollTo(0, 0)
    setPerfTier(detectPerformanceTier())
  }, [])

  const switchMode = (next: AuthMode) => {
    setMode(next)
    setShowPassword(false)
    setStatus({ kind: 'idle', text: '' })
  }

  const clearStatus = () => {
    if (status.kind !== 'idle') setStatus({ kind: 'idle', text: '' })
  }

  const handleLoginSubmit = (event: FormEvent) => {
    event.preventDefault()
    const email = loginForm.email.trim()
    const password = loginForm.password

    if (!email || !password) {
      setStatus({ kind: 'error', text: 'Enter both your institute email and password.' })
      return
    }
    if (!IITP_EMAIL_PATTERN.test(email)) {
      setStatus({ kind: 'error', text: 'Use a valid @iitp.ac.in email address.' })
      return
    }
    if (password.length < 8) {
      setStatus({ kind: 'error', text: 'Password must be at least 8 characters.' })
      return
    }

    setStatus({
      kind: 'success',
      text: 'Defend The Village 2026 participant sign-in opens closer to December 14, 2026. Check back once registration goes live.',
    })
  }

  const handleRegisterSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const fullName = registerForm.fullName.trim()
    const rollNumber = registerForm.rollNumber.trim()
    const semester = Number(registerForm.semester)
    const email = registerForm.email.trim()
    const mobileNumber = registerForm.mobileNumber.trim()
    const ctfdUsername = registerForm.ctfdUsername.trim()

    if (
      !fullName ||
      !rollNumber ||
      !registerForm.subject ||
      !registerForm.semester ||
      !email || !mobileNumber || !ctfdUsername
    ) {
      setStatus({ kind: 'error', text: 'Complete all required fields before registering.' })
      return
    }
    if (fullName.length < 2 || fullName.length > 120) {
      setStatus({ kind: 'error', text: 'Enter your full name using 2–120 characters.' })
      return
    }
    if (!ROLL_NUMBER_PATTERN.test(rollNumber)) {
      setStatus({
        kind: 'error',
        text: 'Enter a valid roll number using letters, numbers, slashes, hyphens, or underscores.',
      })
      return
    }
    if (!MINI_CTF_SUBJECTS.includes(registerForm.subject as MiniCtfSubject)) {
      setStatus({ kind: 'error', text: 'Select your subject.' })
      return
    }
    if (!Number.isInteger(semester) || semester < 1 || semester > 7) {
      setStatus({ kind: 'error', text: 'Select a semester from 1 to 7.' })
      return
    }
    if (!IITP_EMAIL_PATTERN.test(email)) {
      setStatus({ kind: 'error', text: 'Enter a valid @iitp.ac.in institute email address.' })
      return
    }
    if (!/^[6-9]\d{9}$/.test(mobileNumber)) {
      setStatus({ kind: 'error', text: 'Enter a valid 10-digit Indian mobile number.' })
      return
    }
    if (!/^[a-zA-Z0-9_.-]{3,64}$/.test(ctfdUsername)) {
      setStatus({ kind: 'error', text: 'Choose a CTFd username using 3–64 letters, numbers, periods, hyphens, or underscores.' })
      return
    }

    setSubmitting(true)
    const result = await api.preRegisterFlagship({
      fullName, rollNumber, subject: registerForm.subject as MiniCtfSubject, semester,
      mobileNumber, email, ctfdUsername,
    })
    setSubmitting(false)
    if (!result.success) {
      setStatus({ kind: 'error', text: result.error.message })
      return
    }
    setStatus({ kind: 'success', text: `Registration complete for ${result.data.ctfdUsername}. We will contact you using your institute email.` })
  }

  return (
    <MotionConfig reducedMotion="user">
      <main className="mc-ctf-page" data-perf={perfTier}>
        {theme === 'light' && <div className="mc-light-nav-scrim" aria-hidden="true" />}

        <section className="mc-auth-shell" aria-labelledby="mc-auth-heading">
          <div className="mc-auth-backdrop" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/minecraft-ctf-backdrop.jpg"
              alt=""
              className="mc-auth-bg-img"
            />
            <div className="mc-auth-scrim" />
          </div>

          <div className="mc-auth-container">
            <Link
              href="/ctf/defendthevillage"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(226, 232, 240, 0.8)',
                marginBottom: '20px',
                textDecoration: 'none',
              }}
            >
              <ArrowLeft size={15} aria-hidden="true" />
              <span>Back to Defend The Village</span>
            </Link>

            <motion.div
              className="mc-auth-card"
              initial={{ opacity: 0, y: perfTier === 'low' ? 10 : 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.42, ease: EASE_OUT }}
            >
              <div className="mc-kicker" style={{ marginBottom: '6px' }}>
                HackShield · Flagship Portal
              </div>

              <h1
                id="mc-auth-heading"
                className="mc-minecraft-subhead"
                style={{
                  fontSize: 'clamp(1.75rem, 4vw, 2.3rem)',
                  color: '#ffffff',
                  margin: '0 0 8px',
                  lineHeight: 1.05,
                  textShadow: '0 3px 0 #1e293b',
                }}
              >
                Defend The Village
              </h1>

              <p
                style={{
                  margin: '0 0 22px',
                  fontSize: '0.92rem',
                  lineHeight: 1.55,
                  color: 'rgba(226, 232, 240, 0.74)',
                }}
              >
                Register as a participant for Defend The Village. Team formation will happen closer to the event.
              </p>

              <div className="mc-auth-tabs" role="tablist" aria-label="Authentication mode">
                {(['register'] as const).map((tab) => {
                  const selected = mode === tab
                  return (
                    <button
                      key={tab}
                      type="button"
                      role="tab"
                      id={`mc-auth-tab-${tab}`}
                      aria-selected={selected}
                      aria-controls={`mc-auth-panel-${tab}`}
                      className="mc-auth-tab"
                      onClick={() => switchMode(tab)}
                    >
                      {selected && (
                        <motion.span
                          layoutId="mc-auth-tab-pill"
                          className="mc-auth-tab-pill"
                          transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                        />
                      )}
                      Register
                    </button>
                  )
                })}
              </div>

              <AnimatePresence mode="wait">
                {mode === 'login' ? (
                  <motion.form
                    key="login"
                    id="mc-auth-panel-login"
                    role="tabpanel"
                    aria-labelledby="mc-auth-tab-login"
                    onSubmit={handleLoginSubmit}
                    noValidate
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: EASE_OUT }}
                  >
                    <div className="mc-auth-field">
                      <label className="mc-auth-label" htmlFor="mc-login-email">
                        <span>Institute Email</span>
                      </label>
                      <div className="mc-auth-input-wrap">
                        <span className="mc-auth-input-icon" aria-hidden="true">
                          <Mail size={16} />
                        </span>
                        <input
                          id="mc-login-email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@iitp.ac.in"
                          className="mc-auth-input"
                          value={loginForm.email}
                          onChange={(e) => {
                            setLoginForm({ ...loginForm, email: e.target.value })
                            clearStatus()
                          }}
                        />
                      </div>
                    </div>

                    <div className="mc-auth-field">
                      <label className="mc-auth-label" htmlFor="mc-login-password">
                        <span>Password</span>
                      </label>
                      <div className="mc-auth-input-wrap">
                        <span className="mc-auth-input-icon" aria-hidden="true">
                          <Lock size={16} />
                        </span>
                        <input
                          id="mc-login-password"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          className="mc-auth-input mc-auth-input-pw"
                          value={loginForm.password}
                          onChange={(e) => {
                            setLoginForm({ ...loginForm, password: e.target.value })
                            clearStatus()
                          }}
                        />
                        <button
                          type="button"
                          className="mc-auth-pw-toggle"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="mc-btn-primary"
                      style={{ width: '100%', marginTop: '8px' }}
                    >
                      <span>Sign In</span>
                      <ArrowRight size={15} aria-hidden="true" />
                    </button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="register"
                    id="mc-auth-panel-register"
                    role="tabpanel"
                    aria-labelledby="mc-auth-tab-register"
                    onSubmit={handleRegisterSubmit}
                    noValidate
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: EASE_OUT }}
                  >
                    <div className="mc-auth-field">
                      <label className="mc-auth-label" htmlFor="mc-reg-name">
                        <span>Full Name</span>
                      </label>
                      <div className="mc-auth-input-wrap">
                        <span className="mc-auth-input-icon" aria-hidden="true">
                          <User size={16} />
                        </span>
                        <input
                          id="mc-reg-name"
                          type="text"
                          autoComplete="name"
                          minLength={2}
                          maxLength={120}
                          required
                          placeholder="Your full name"
                          className="mc-auth-input"
                          value={registerForm.fullName}
                          onChange={(e) => {
                            setRegisterForm({ ...registerForm, fullName: e.target.value })
                            clearStatus()
                          }}
                        />
                      </div>
                    </div>

                    <div className="mc-auth-field">
                      <label className="mc-auth-label" htmlFor="mc-reg-roll">
                        <span>Roll No.</span>
                      </label>
                      <div className="mc-auth-input-wrap">
                        <span className="mc-auth-input-icon" aria-hidden="true">
                          <Hash size={16} />
                        </span>
                        <input
                          id="mc-reg-roll"
                          type="text"
                          autoComplete="off"
                          minLength={3}
                          maxLength={40}
                          pattern="[a-zA-Z0-9/_-]+"
                          required
                          placeholder="Institute roll number"
                          className="mc-auth-input"
                          value={registerForm.rollNumber}
                          onChange={(e) => {
                            setRegisterForm({ ...registerForm, rollNumber: e.target.value })
                            clearStatus()
                          }}
                        />
                      </div>
                    </div>

                    <div className="mc-auth-row">
                      <div className="mc-auth-field">
                        <label className="mc-auth-label" htmlFor="mc-reg-subject">
                          <span>Subject</span>
                        </label>
                        <div className="mc-auth-input-wrap">
                          <span className="mc-auth-input-icon" aria-hidden="true">
                            <BookOpen size={16} />
                          </span>
                          <select
                            id="mc-reg-subject"
                            required
                            className="mc-auth-input"
                            value={registerForm.subject}
                            onChange={(e) => {
                              setRegisterForm({
                                ...registerForm,
                                subject: e.target.value as '' | MiniCtfSubject,
                              })
                              clearStatus()
                            }}
                          >
                            <option value="" disabled>
                              Select subject
                            </option>
                            {MINI_CTF_SUBJECTS.map((subject) => (
                              <option key={subject} value={subject}>
                                {subject}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="mc-auth-field">
                        <label className="mc-auth-label" htmlFor="mc-reg-semester">
                          <span>Semester</span>
                        </label>
                        <div className="mc-auth-input-wrap">
                          <span className="mc-auth-input-icon" aria-hidden="true">
                            <GraduationCap size={16} />
                          </span>
                          <select
                            id="mc-reg-semester"
                            required
                            className="mc-auth-input"
                            value={registerForm.semester}
                            onChange={(e) => {
                              setRegisterForm({ ...registerForm, semester: e.target.value })
                              clearStatus()
                            }}
                          >
                            <option value="" disabled>
                              Select semester
                            </option>
                            {[1, 2, 3, 4, 5, 6, 7].map((semester) => (
                              <option key={semester} value={String(semester)}>
                                Semester {semester}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mc-auth-field">
                      <label className="mc-auth-label" htmlFor="mc-reg-email">
                        <span>Institute Email</span>
                      </label>
                      <div className="mc-auth-input-wrap">
                        <span className="mc-auth-input-icon" aria-hidden="true">
                          <Mail size={16} />
                        </span>
                        <input
                          id="mc-reg-email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          maxLength={254}
                          required
                          placeholder="you@iitp.ac.in"
                          className="mc-auth-input"
                          value={registerForm.email}
                          onChange={(e) => {
                            setRegisterForm({ ...registerForm, email: e.target.value })
                            clearStatus()
                          }}
                        />
                      </div>
                    </div>

                    <div className="mc-auth-field">
                      <label className="mc-auth-label" htmlFor="mc-reg-username">
                        <span>CTFd Username</span>
                      </label>
                      <div className="mc-auth-input-wrap">
                        <span className="mc-auth-input-icon" aria-hidden="true"><User size={16} /></span>
                        <input id="mc-reg-username" type="text" autoComplete="username" minLength={3} maxLength={64}
                          required placeholder="Choose a unique username" className="mc-auth-input"
                          value={registerForm.ctfdUsername}
                          onChange={(e) => { setRegisterForm({ ...registerForm, ctfdUsername: e.target.value }); clearStatus() }} />
                      </div>
                    </div>

                    <div className="mc-auth-field">
                      <label className="mc-auth-label" htmlFor="mc-reg-mobile"><span>Mobile Number</span></label>
                      <div className="mc-auth-input-wrap">
                        <span className="mc-auth-input-icon" aria-hidden="true"><Hash size={16} /></span>
                        <input id="mc-reg-mobile" type="tel" inputMode="numeric" autoComplete="tel" maxLength={10}
                          required placeholder="10-digit mobile number" className="mc-auth-input"
                          value={registerForm.mobileNumber}
                          onChange={(e) => { setRegisterForm({ ...registerForm, mobileNumber: e.target.value }); clearStatus() }} />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="mc-btn-primary"
                      disabled={submitting}
                      style={{ width: '100%', marginTop: '8px' }}
                    >
                      <span>{submitting ? 'Creating Account…' : 'Submit Registration'}</span>
                      <ArrowRight size={15} aria-hidden="true" />
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

              {status.kind !== 'idle' && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`mc-auth-status ${status.kind}`}
                >
                  {status.text}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </main>
    </MotionConfig>
  )
}
