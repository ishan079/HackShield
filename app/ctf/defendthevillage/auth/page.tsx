'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { MotionConfig, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, BookOpen, GraduationCap, Hash, Mail, User } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'
import { api } from '@/lib/api'
import { MINI_CTF_SUBJECTS, type MiniCtfSubject } from '@/types/api'
import '../minecraft-ctf.css'

type PerfTier = 'high' | 'low'
type Field = 'fullName' | 'rollNumber' | 'subject' | 'semester' | 'email' | 'ctfdUsername' | 'mobileNumber'
type Form = Record<Field, string>

const IITP_EMAIL_PATTERN = /^[^\s@]+@iitp\.ac\.in$/i
const ROLL_NUMBER_PATTERN = /^[a-zA-Z0-9/_-]{3,40}$/
const USERNAME_PATTERN = /^[a-zA-Z0-9_.-]{3,64}$/
const MOBILE_PATTERN = /^[6-9]\d{9}$/
const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

function detectPerformanceTier(): PerfTier {
  if (typeof window === 'undefined') return 'high'
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || nav.connection?.saveData ||
    (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency <= 4) ||
    (typeof nav.deviceMemory === 'number' && nav.deviceMemory <= 4) ? 'low' : 'high'
}

function fieldError(field: Field, form: Form): string | undefined {
  const value = form[field].trim()
  if (!value) return 'This field is required.'
  if (field === 'fullName' && (value.length < 2 || value.length > 120)) return 'Use 2–120 characters.'
  if (field === 'rollNumber' && !ROLL_NUMBER_PATTERN.test(value)) return 'Use 3–40 letters, numbers, slashes, hyphens, or underscores.'
  if (field === 'subject' && !MINI_CTF_SUBJECTS.includes(value as MiniCtfSubject)) return 'Choose a listed subject.'
  if (field === 'semester' && (!Number.isInteger(Number(value)) || Number(value) < 1 || Number(value) > 7)) return 'Choose a semester from 1 to 7.'
  if (field === 'email' && !IITP_EMAIL_PATTERN.test(value)) return 'Use a valid @iitp.ac.in institute email address.'
  if (field === 'ctfdUsername' && !USERNAME_PATTERN.test(value)) return 'Use 3–64 letters, numbers, periods, hyphens, or underscores; spaces are not allowed.'
  if (field === 'mobileNumber' && !MOBILE_PATTERN.test(value)) return 'Enter a valid 10-digit Indian mobile number.'
}

export default function MinecraftCTFAuthPage() {
  const { theme } = useTheme()
  const [perfTier, setPerfTier] = useState<PerfTier>('high')
  const [form, setForm] = useState<Form>({ fullName: '', rollNumber: '', subject: '', semester: '', email: '', ctfdUsername: '', mobileNumber: '' })
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<{ kind: 'idle' | 'error' | 'success'; text: string }>({ kind: 'idle', text: '' })

  useEffect(() => { window.scrollTo(0, 0); setPerfTier(detectPerformanceTier()) }, [])

  const update = (field: Field, value: string) => {
    const next = { ...form, [field]: value }
    setForm(next)
    if (errors[field]) setErrors((current) => ({ ...current, [field]: fieldError(field, next) }))
    if (status.kind !== 'idle') setStatus({ kind: 'idle', text: '' })
  }
  const validate = (field: Field) => setErrors((current) => ({ ...current, [field]: fieldError(field, form) }))
  const inputProps = (field: Field) => ({
    value: form[field], onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => update(field, event.target.value),
    onBlur: () => validate(field), 'aria-invalid': Boolean(errors[field]), 'aria-describedby': errors[field] ? `${field}-error` : undefined,
    className: `mc-auth-input${errors[field] ? ' invalid' : ''}`,
  })

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = Object.fromEntries((Object.keys(form) as Field[]).map((field) => [field, fieldError(field, form)]).filter(([, error]) => error)) as Partial<Record<Field, string>>
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setSubmitting(true)
    const result = await api.preRegisterFlagship({
      fullName: form.fullName.trim(), rollNumber: form.rollNumber.trim(), subject: form.subject as MiniCtfSubject,
      semester: Number(form.semester), email: form.email.trim(), mobileNumber: form.mobileNumber.trim(), ctfdUsername: form.ctfdUsername.trim(),
    })
    setSubmitting(false)
    setStatus(result.success
      ? { kind: 'success', text: `Registration complete for ${result.data.ctfdUsername}. We will contact you using your institute email.` }
      : { kind: 'error', text: result.error.message })
  }
  const error = (field: Field) => errors[field] && <p id={`${field}-error`} className="mc-auth-field-error" role="alert">{errors[field]}</p>

  return <MotionConfig reducedMotion="user"><main className="mc-ctf-page" data-perf={perfTier}>
    {theme === 'light' && <div className="mc-light-nav-scrim" aria-hidden="true" />}
    <section className="mc-auth-shell" aria-labelledby="mc-auth-heading"><div className="mc-auth-backdrop" aria-hidden="true"><img src="/minecraft-ctf-backdrop.jpg" alt="" className="mc-auth-bg-img" /><div className="mc-auth-scrim" /></div>
      <div className="mc-auth-container"><Link href="/ctf/defendthevillage" className="mc-auth-back"><ArrowLeft size={15} aria-hidden="true" />Back to Defend The Village</Link>
        <motion.div className="mc-auth-card" initial={{ opacity: 0, y: perfTier === 'low' ? 10 : 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42, ease: EASE_OUT }}>
          <div className="mc-kicker" style={{ marginBottom: 6 }}>HackShield · Flagship Portal</div>
          <h1 id="mc-auth-heading" className="mc-minecraft-subhead mc-auth-title">Defend The Village</h1>
          <p className="mc-auth-intro">Register as a participant for Defend The Village. Team formation will happen closer to the event.</p>
          <form onSubmit={submit} noValidate>
            <div className="mc-auth-field"><label className="mc-auth-label" htmlFor="mc-reg-name">Full Name</label><div className="mc-auth-input-wrap"><span className="mc-auth-input-icon"><User size={16} /></span><input id="mc-reg-name" type="text" autoComplete="name" minLength={2} maxLength={120} required placeholder="Your full name" {...inputProps('fullName')} /></div>{error('fullName')}</div>
            <div className="mc-auth-field"><label className="mc-auth-label" htmlFor="mc-reg-roll">Roll No.</label><div className="mc-auth-input-wrap"><span className="mc-auth-input-icon"><Hash size={16} /></span><input id="mc-reg-roll" type="text" autoComplete="off" minLength={3} maxLength={40} pattern="[a-zA-Z0-9/_-]+" required placeholder="Institute roll number" {...inputProps('rollNumber')} /></div>{error('rollNumber')}</div>
            <div className="mc-auth-row"><div className="mc-auth-field"><label className="mc-auth-label" htmlFor="mc-reg-subject">Subject</label><div className="mc-auth-input-wrap"><span className="mc-auth-input-icon"><BookOpen size={16} /></span><select id="mc-reg-subject" required {...inputProps('subject')}><option value="" disabled>Select subject</option>{MINI_CTF_SUBJECTS.map((subject) => <option key={subject} value={subject}>{subject}</option>)}</select></div>{error('subject')}</div>
              <div className="mc-auth-field"><label className="mc-auth-label" htmlFor="mc-reg-semester">Semester</label><div className="mc-auth-input-wrap"><span className="mc-auth-input-icon"><GraduationCap size={16} /></span><select id="mc-reg-semester" required {...inputProps('semester')}><option value="" disabled>Select semester</option>{[1, 2, 3, 4, 5, 6, 7].map((semester) => <option key={semester} value={String(semester)}>Semester {semester}</option>)}</select></div>{error('semester')}</div></div>
            <div className="mc-auth-field"><label className="mc-auth-label" htmlFor="mc-reg-email">Institute Email</label><div className="mc-auth-input-wrap"><span className="mc-auth-input-icon"><Mail size={16} /></span><input id="mc-reg-email" type="email" inputMode="email" autoComplete="email" maxLength={254} required placeholder="you@iitp.ac.in" {...inputProps('email')} /></div>{error('email')}</div>
            <div className="mc-auth-field"><label className="mc-auth-label" htmlFor="mc-reg-username">CTFd Username</label><div className="mc-auth-input-wrap"><span className="mc-auth-input-icon"><User size={16} /></span><input id="mc-reg-username" type="text" autoComplete="username" minLength={3} maxLength={64} required placeholder="Choose a unique username" {...inputProps('ctfdUsername')} /></div>{error('ctfdUsername')}</div>
            <div className="mc-auth-field"><label className="mc-auth-label" htmlFor="mc-reg-mobile">Mobile Number</label><div className="mc-auth-input-wrap"><span className="mc-auth-input-icon"><Hash size={16} /></span><input id="mc-reg-mobile" type="tel" inputMode="numeric" autoComplete="tel" maxLength={10} required placeholder="10-digit mobile number" {...inputProps('mobileNumber')} /></div>{error('mobileNumber')}</div>
            <button type="submit" className="mc-btn-primary" disabled={submitting} style={{ width: '100%', marginTop: 8 }}><span>{submitting ? 'Registering…' : 'Submit Registration'}</span><ArrowRight size={15} aria-hidden="true" /></button>
          </form>
          {status.kind !== 'idle' && <div role="status" aria-live="polite" className={`mc-auth-status ${status.kind}`}>{status.text}</div>}
        </motion.div>
      </div>
    </section>
  </main></MotionConfig>
}
