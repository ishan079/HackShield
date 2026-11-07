'use client'

import React, {Suspense, useEffect, useState} from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import {AnimatePresence, motion} from 'framer-motion'
import {useInView} from 'react-intersection-observer'
import {
    ArrowLeft,
    ArrowUpRight,
    Award,
    Binary,
    Calendar,
    ChevronRight,
    Clock,
    FileText,
    Flag,
    Globe,
    Lock,
    Radio,
    Search,
    Terminal,
    Trophy,
    Users,
    Zap,
} from 'lucide-react'
import {CTFCategory, MiniCTFSprint, MiniStatItem, PastCTFEvent,} from '@/types'
import {api} from '@/lib/api'
import {MINI_CTF_SUBJECTS, type MiniCtfSubject} from '@/types/api'
import MiniCtfRulebookModal, {MINI_CTF_DECLARATION} from '@/components/MiniCtfRulebookModal'

const IITP_EMAIL_PATTERN = /^[^\s@]+@iitp\.ac\.in$/i
const PWN_USERNAME_PATTERN = /^[a-zA-Z0-9_.-]{2,64}$/
const ROLL_NUMBER_PATTERN = /^[a-zA-Z0-9/_-]{3,40}$/
const MOBILE_NUMBER_PATTERN = /^[6-9]\d{9}$/

function CTFContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialType = searchParams.get('type') === 'mini' ? 'mini' : 'flagship'
    const [activeTab, setActiveTab] = useState(initialType)
    const [flippedSprintId, setFlippedSprintId] = useState<string | null>(null)
    const [regForm, setRegForm] = useState({
        fullName: '',
        rollNumber: '',
        subject: '' as '' | MiniCtfSubject,
        semester: '',
        mobileNumber: '',
        email: '',
        pwnUsername: '',
    })
    const [registrationState, setRegistrationState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
    const [registrationMessage, setRegistrationMessage] = useState('')
    const [isRulebookOpen, setIsRulebookOpen] = useState(false)
    const [hasOpenedRulebook, setHasOpenedRulebook] = useState(false)
    const [declaration, setDeclaration] = useState('')
    const declarationMatches = declaration.trim() === MINI_CTF_DECLARATION
    const canRegister = hasOpenedRulebook && declarationMatches

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

    useEffect(() => {
        const sprintId = searchParams.get('register')
        setFlippedSprintId(sprintId)

        if (!sprintId) return

        const frame = window.requestAnimationFrame(() => {
            document
                .getElementById(`registration-${sprintId}`)
                ?.scrollIntoView({behavior: 'smooth', block: 'center'})
        })

        return () => window.cancelAnimationFrame(frame)
    }, [searchParams])

    const handleTabChange = (tab: 'flagship' | 'mini') => {
        setActiveTab(tab)
        router.push(`/ctf?type=${tab}`, {scroll: false})
    }

    const openRegistration = (sprintId: string) => {
        setFlippedSprintId(sprintId)
        router.push(`/ctf?type=mini&register=${encodeURIComponent(sprintId)}#registration-${encodeURIComponent(sprintId)}`, {scroll: false})
    }

    const closeRegistration = () => {
        setFlippedSprintId(null)
        router.push('/ctf?type=mini', {scroll: false})
    }

    const submitRegistration = async (sprintId: string) => {
        const fullName = regForm.fullName.trim()
        const rollNumber = regForm.rollNumber.trim()
        const mobileNumber = regForm.mobileNumber.trim()
        const email = regForm.email.trim()
        const pwnUsername = regForm.pwnUsername.trim()
        const semester = Number(regForm.semester)

        if (!fullName || !rollNumber || !regForm.subject || !regForm.semester || !mobileNumber || !email || !pwnUsername) {
            setRegistrationState('error')
            setRegistrationMessage('Complete all required participant details before registering.')
            return
        }

        if (!hasOpenedRulebook) {
            setRegistrationState('error')
            setRegistrationMessage('Open the rulebook before registering.')
            return
        }

        if (!declarationMatches) {
            setRegistrationState('error')
            setRegistrationMessage('Enter the declaration exactly before registering.')
            return
        }

        if (!IITP_EMAIL_PATTERN.test(email)) {
            setRegistrationState('error')
            setRegistrationMessage('Enter a valid @iitp.ac.in institute email address.')
            return
        }

        if (!PWN_USERNAME_PATTERN.test(pwnUsername)) {
            setRegistrationState('error')
            setRegistrationMessage('Username must be 2–64 characters using letters, numbers, dots, hyphens, or underscores.')
            return
        }

        if (fullName.length < 2 || fullName.length > 120) {
            setRegistrationState('error')
            setRegistrationMessage('Enter your full name using 2–120 characters.')
            return
        }

        if (!ROLL_NUMBER_PATTERN.test(rollNumber)) {
            setRegistrationState('error')
            setRegistrationMessage('Enter a valid roll number using letters, numbers, slashes, hyphens, or underscores.')
            return
        }

        if (!MINI_CTF_SUBJECTS.includes(regForm.subject as MiniCtfSubject)) {
            setRegistrationState('error')
            setRegistrationMessage('Select your subject.')
            return
        }

        if (!Number.isInteger(semester) || semester < 1 || semester > 7) {
            setRegistrationState('error')
            setRegistrationMessage('Select a semester from 1 to 7.')
            return
        }

        if (!MOBILE_NUMBER_PATTERN.test(mobileNumber)) {
            setRegistrationState('error')
            setRegistrationMessage('Enter a valid 10-digit Indian mobile number.')
            return
        }

        setRegistrationState('submitting')
        setRegistrationMessage('')
        const result = await api.registerMiniSprint(sprintId, {
            fullName,
            rollNumber,
            subject: regForm.subject as MiniCtfSubject,
            semester,
            mobileNumber,
            email,
            pwnUsername,
        })

        if (result.success) {
            setRegistrationState('success')
            setRegistrationMessage(`Registration confirmed. Reference: ${result.data.registrationId}`)
        } else {
            setRegistrationState('error')
            setRegistrationMessage(result.error.message)
        }
    }

    const {ref: heroRef, inView: heroInView} = useInView({
        triggerOnce: true, threshold: 0.1,
    })
    const {ref: categoriesRef} = useInView({
        triggerOnce: true, threshold: 0.1,
    })
    const {ref: eventsRef} = useInView({
        triggerOnce: true, threshold: 0.1,
    })

    // Flagship Countdown timer — counts down to the target date/time (IST)
    const targetDate = new Date('2026-12-14T12:00:00+05:30').getTime()

    const calculateTimeLeft = () => {
        const difference = targetDate - Date.now()

        if (difference <= 0) {
            return {days: 0, hours: 0, minutes: 0, seconds: 0}
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / (1000 * 60)) % 60),
            seconds: Math.floor((difference / 1000) % 60),
        }
    }

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft)

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const categories: CTFCategory[] = [
        {
            name: 'Web Exploitation',
            icon: <Globe size={24} color="var(--accent)"/>,
            tag: 'WEB',
            desc: 'SQL injections, XSS, SSRF, JWT forgery, OAuth bypasses, and Prototype Pollution in contemporary microservices.',
        },
        {
            name: 'Binary Exploitation (Pwn)',
            icon: <Terminal size={24} color="var(--accent)"/>,
            tag: 'PWN',
            desc: 'Buffer overflows, ROP chain crafting, heap spray vulnerabilities, format strings, and kernel space privilege escalation.',
        }, {
            name: 'Reverse Engineering',
            icon: <Binary size={24} color="var(--accent)"/>,
            tag: 'REV',
            desc: 'Dissecting compiled ELF/PE executables, x86/ARM assembly analysis with Ghidra & IDA Pro, anti-debugging defeat, and packing unraveling.',
        }, {
            name: 'Cryptography',
            icon: <Lock size={24} color="var(--accent)"/>,
            tag: 'CRYPTO',
            desc: 'Breaking weak RSA implementations, elliptic curve discrete log attacks, padding oracles, and zero-knowledge proof flaws.',
        }, {
            name: 'Digital Forensics & Stego',
            icon: <Search size={24} color="var(--accent)"/>,
            tag: 'FORENSICS',
            desc: 'Memory dump analysis with Volatility, PCAP network traffic inspection, filesystem carving, and steganographic data extraction.',
        }, {
            name: 'OSINT & Recon',
            icon: <Radio size={24} color="var(--accent)"/>,
            tag: 'OSINT',
            desc: 'Open source intelligence gathering, geolocation identification, metadata extraction, and footprint analysis across threat actors.',
        },]

    const pastEvents: PastCTFEvent[] = [{
        title: 'Rookie CTF 2026',
        date: 'June 5–6, 2026',
        type: 'Jeopardy Style',
        teams: '100+ Teams',
    }
    ]

    const miniSprints: MiniCTFSprint[] = [{
        id: 'mini-14',
        title: 'Practice CTF',
        status: 'REGISTRATION OPEN',
        statusColor: 'var(--color-green)',
        date: 'November 10,2026|12:00 PM – November 13,2026|12:00 PM IST',
        duration: '72 Hours',
        challenges: 'Multiple Targets',
        difficulty: 'Beginner,Intermediate',
        format: 'Solo or Duos',
        reward: "Digital Badge & Recognition",
        description: 'Paced marathon targeting practice towards upcoming fast paced Hackathon.',
    },]

    const miniStats: MiniStatItem[] = [
        {
            label: 'Marathon Duration', val: '72 Hours', icon: <Clock size={18} color="var(--accent)"/>,
        },
        {
            label: 'Frequency', val: 'Monthly', icon: <Calendar size={18} color="var(--accent)"/>,
        },
        {
            label: 'Team Format', val: 'Solo or Duos', icon: <Users size={18} color="var(--accent)"/>,
        },
        {
            label: 'Rewards', val: 'Club XP & Badges', icon: <Award size={18} color="var(--accent)"/>,
        },]

    return (<div
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
        <div style={{maxWidth: 1180, margin: '0 auto', padding: '0 24px'}}>
            <motion.div
                ref={heroRef}
                initial={{opacity: 0, y: 30}}
                animate={heroInView ? {opacity: 1, y: 0} : {}}
                transition={{duration: 0.7}}
                style={{textAlign: 'center', marginBottom: '45px'}}
            >
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
                    <br/>
                    <span
                        style={{
                            color: 'var(--accent)', fontStyle: 'italic', fontFamily: 'Georgia, serif',
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
                    display: 'flex', justifyContent: 'center', marginBottom: '50px',
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
                            color: activeTab === 'flagship' ? '#ffffff' : 'var(--text-secondary)',
                            fontSize: '0.96rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'color 0.25s ease',
                            outline: 'none',
                            whiteSpace: 'nowrap',
                            zIndex: 1,
                        }}
                    >
                        {activeTab === 'flagship' && (<motion.div
                            layoutId="ctf-active-pill"
                            transition={{type: 'spring', stiffness: 450, damping: 35}}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                borderRadius: '9999px',
                                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
                                boxShadow: '0 4px 18px var(--accent-glow)',
                                zIndex: -1,
                            }}
                        />)}
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
                                background: activeTab === 'flagship' ? 'rgba(255, 255, 255, 0.25)' : 'var(--accent-dim)',
                                color: activeTab === 'flagship' ? '#ffffff' : 'var(--accent)',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                            }}
                        >
                Biannual
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
                            color: activeTab === 'mini' ? '#ffffff' : 'var(--text-secondary)',
                            fontSize: '0.96rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'color 0.25s ease',
                            outline: 'none',
                            whiteSpace: 'nowrap',
                            zIndex: 1,
                        }}
                    >
                        {activeTab === 'mini' && (<motion.div
                            layoutId="ctf-active-pill"
                            transition={{type: 'spring', stiffness: 450, damping: 35}}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                borderRadius: '9999px',
                                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 100%)',
                                boxShadow: '0 4px 18px var(--accent-glow)',
                                zIndex: -1,
                            }}
                        />)}
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
                                background: activeTab === 'mini' ? 'rgba(255, 255, 255, 0.25)' : 'var(--accent-dim)',
                                color: activeTab === 'mini' ? '#ffffff' : 'var(--accent)',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                            }}
                        >
                Monthly Sprints
              </span>
                    </button>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'flagship' && (<motion.div
                    key="flagship-view"
                    initial={{opacity: 0, y: 15}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -15}}
                    transition={{duration: 0.35}}
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
                            <div style={{maxWidth: 540}}>
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
                                    <Trophy size={13}/> UPCOMING FLAGSHIP TOURNAMENT
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
                                    HackShield CTF 2026
                                </h2>
                                <p
                                    style={{
                                        fontSize: '1.05rem',
                                        lineHeight: 1.7,
                                        color: 'var(--text-secondary)',
                                        margin: '0 0 24px',
                                    }}
                                >
                                    Our 24-hour jeopardy-style cybersecurity tournament
                                    featuring 40+ bespoke challenges built from scratch by IIT
                                    Patna researchers. Win goodies, exclusive badges, and winners get a chance
                                    to direct interviews with security sponsors.
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
                                            display: 'flex', alignItems: 'center', gap: '8px',
                                        }}
                                    >
                                        <Calendar size={18} color="var(--accent)"/> March 2025
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '8px',
                                        }}
                                    >
                                        <Trophy size={18} color="var(--accent)"/> Sponsored Goodies
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '8px',
                                        }}
                                    >
                                        <Users size={18} color="var(--accent)"/> Teams of 1–4
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
                                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.40), var(--shadow-sm)',
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
                      Sprint Commences In
                    </span>
                                <div
                                    style={{
                                        display: 'flex',
                                        gap: '12px',
                                        justifyContent: 'center',
                                        margin: '18px 0',
                                    }}
                                >
                                    {[{label: 'DAYS', val: timeLeft.days}, {
                                        label: 'HOURS',
                                        val: timeLeft.hours
                                    }, {label: 'MINS', val: timeLeft.minutes}, {
                                        label: 'SECS',
                                        val: timeLeft.seconds
                                    },].map((unit, i) => (<div key={i} style={{minWidth: '55px'}}>
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
                                    </div>))}
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
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                                >
                                    Pre-Registeration Open soon
                                </a>
                            </div>
                        </div>
                    </div>

                    <div ref={categoriesRef} style={{marginBottom: '90px'}}>
                        <div style={{textAlign: 'center', marginBottom: '45px'}}>
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
                            {categories.map((cat, idx) => (<div
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
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.30)'
                                    e.currentTarget.style.borderTopColor = 'rgba(255, 255, 255, 0.58)'
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
                            </div>))}
                        </div>
                    </div>

                    <div ref={eventsRef}>
                        <div style={{textAlign: 'center', marginBottom: '45px'}}>
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
                                display: 'flex', flexDirection: 'column', gap: '20px',
                            }}
                        >
                            {pastEvents.map((event, idx) => (<div
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
                                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.30)'
                                    e.currentTarget.style.borderTopColor = 'rgba(255, 255, 255, 0.58)'
                                    e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'
                                    e.currentTarget.style.transform = 'translateY(-3px)'
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
                                fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase',
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
                                        display: 'flex', alignItems: 'center', gap: '24px',
                                    }}
                                >
                                    {event.firstPlace && <div style={{textAlign: 'right'}}>
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
                                            {event.firstPlace ?? 'To be announced'}
                                        </div>
                                    </div>}
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
                            </div>))}
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
                                display: 'flex', alignItems: 'center', gap: '18px',
                            }}
                        >
                            <div
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '14px',
                                    background: 'var(--color-green-dim)',
                                    border: '1px solid var(--color-green-border)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                            >
                                <Zap size={24} color="var(--color-green)"/>
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
                                        margin: '4px 0 0', fontSize: '0.94rem', color: 'var(--text-secondary)',
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
                                background: 'var(--color-green-dim)',
                                border: '1.5px solid var(--color-green)',
                                color: 'var(--color-green)',
                                fontSize: '0.92rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 4px 14px var(--color-green-glow)',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--color-green)'
                                e.currentTarget.style.color = '#ffffff'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'var(--color-green-dim)'
                                e.currentTarget.style.color = 'var(--color-green)'
                            }}
                        >
                            <span>Explore Mini CTF Track</span>
                            <ChevronRight size={16}/>
                        </button>
                    </div>
                </motion.div>)}

                {activeTab === 'mini' && (<motion.div
                    key="mini-view"
                    initial={{opacity: 0, y: 15}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -15}}
                    transition={{duration: 0.35}}
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
                            <div style={{maxWidth: 620}}>
                                <div
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        background: 'var(--color-green-dim)',
                                        border: '1px solid var(--color-green-border)',
                                        color: 'var(--color-green)',
                                        fontSize: '0.75rem',
                                        fontWeight: 800,
                                        letterSpacing: '1.2px',
                                        padding: '4px 12px',
                                        borderRadius: '6px',
                                        textTransform: 'uppercase',
                                        marginBottom: '14px',
                                    }}
                                >
                                    <Zap size={14}/> MONTHLY MARATHON
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
                                    Mini CTF
                                </h2>
                                <p
                                    style={{
                                        fontSize: '1.05rem',
                                        lineHeight: 1.7,
                                        color: 'var(--text-secondary)',
                                        margin: '0 0 20px',
                                    }}
                                >
                                    Focused 72 hour non-competitive event designed to sharpen
                                    practical exploitation skills, give freshers an experience, test fresh boxes built
                                    by
                                    club members, and climb the internal club
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
                                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                gap: '16px',
                                marginTop: '32px',
                                paddingTop: '24px',
                                borderTop: '1px solid var(--border-subtle)',
                            }}
                        >
                            {miniStats.map((stat, i) => (<div
                                key={i}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
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
                            </div>))}
                        </div>
                    </div>

                    <div id="mini-sprints" style={{marginBottom: '80px'}}>
                        <div style={{textAlign: 'center', marginBottom: '36px'}}>
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
                                display: 'flex', flexDirection: 'column', gap: '22px',
                            }}
                        >
                            {miniSprints.map((sprint) => {
                                const isFlipped = flippedSprintId === sprint.id

                                return (<div
                                    key={sprint.id}
                                    id={`registration-${sprint.id}`}
                                    style={{perspective: '1600px', width: '100%'}}
                                >
                                    <AnimatePresence mode="wait" initial={false}>
                                        {!isFlipped ? (<motion.div
                                            key="front"
                                            initial={{rotateY: 90, opacity: 0}}
                                            animate={{rotateY: 0, opacity: 1}}
                                            exit={{rotateY: -90, opacity: 0}}
                                            transition={{
                                                duration: 0.38, ease: [0.22, 1, 0.36, 1],
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
                                                transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.30)'
                                                e.currentTarget.style.borderTopColor = 'rgba(255, 255, 255, 0.58)'
                                                e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = 'var(--border-subtle)'
                                                e.currentTarget.style.borderTopColor = 'var(--border-specular)'
                                                e.currentTarget.style.boxShadow = 'var(--shadow-card)'
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
                                            background: 'var(--color-green-dim)',
                                            border: '1px solid var(--color-green-border)',
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
                                                    onClick={() => openRegistration(sprint.id)}
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                        background: sprint.status === 'REGISTRATION OPEN' ? 'var(--accent)' : 'var(--bg-surface)',
                                                        color: sprint.status === 'REGISTRATION OPEN' ? '#ffffff' : 'var(--text-primary)',
                                                        border: '1px solid var(--border-strong)',
                                                        padding: '10px 22px',
                                                        borderRadius: '9999px',
                                                        fontSize: '0.90rem',
                                                        fontWeight: 700,
                                                        cursor: 'pointer',
                                                        boxShadow: sprint.status === 'REGISTRATION OPEN' ? '0 4px 14px var(--accent-glow)' : 'none',
                                                        transition: 'all 0.2s ease',
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1.03)'
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.transform = 'scale(1)'
                                                    }}
                                                >
                                  <span>
                                    {sprint.status === 'REGISTRATION OPEN' ? 'Join Sprint' : 'View Arena'}
                                  </span>
                                                    <ArrowUpRight size={16}/>
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
                                                    <Clock size={16} color="var(--accent)"/>{' '}
                                                    {sprint.duration}
                                                </div>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                    }}
                                                >
                                                    <Flag size={16} color="var(--accent)"/>{' '}
                                                    {sprint.challenges}
                                                </div>
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '6px',
                                                    }}
                                                >
                                                    <Award size={16} color="var(--accent)"/>{' '}
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
                                        </motion.div>) : (<motion.div
                                            key="back"
                                            initial={{rotateY: -90, opacity: 0}}
                                            animate={{rotateY: 0, opacity: 1}}
                                            exit={{rotateY: 90, opacity: 0}}
                                            transition={{
                                                duration: 0.38, ease: [0.22, 1, 0.36, 1],
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
                                          color: 'var(--color-orange)',
                                          letterSpacing: '0.2px',
                                      }}
                                  >
                                    Registration open
                                  </span>
                                                    <button
                                                        type="button"
                                                        onClick={closeRegistration}
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
                                                            e.currentTarget.style.color = 'var(--text-primary)'
                                                            e.currentTarget.style.borderColor = 'var(--accent)'
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.color = 'var(--text-secondary)'
                                                            e.currentTarget.style.borderColor = 'var(--border-subtle)'
                                                        }}
                                                    >
                                                        <ArrowLeft size={14}/>
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
                                                Register with your IIT Patna institute email and
                                                pwn.college username. Each participant may register
                                                once.
                                            </p>

                                            <div
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    flexWrap: 'wrap',
                                                    gap: '12px',
                                                    margin: '0 0 25px',
                                                    padding: '13px 15px',
                                                    background: 'var(--accent-subtle)',
                                                    border: '1px solid var(--accent-dim)',
                                                    borderRadius: '12px',
                                                }}
                                            >
                                                <div>
                                                    <div
                                                        style={{
                                                            color: 'var(--text-primary)',
                                                            fontSize: '0.88rem',
                                                            fontWeight: 700,
                                                            marginBottom: '2px',
                                                        }}
                                                    >
                                                        Rulebook required
                                                    </div>
                                                    <div
                                                        style={{
                                                            color: hasOpenedRulebook ? 'var(--color-green)' : 'var(--text-muted)',
                                                            fontSize: '0.8rem',
                                                        }}
                                                    >
                                                        {hasOpenedRulebook
                                                            ? 'Rulebook opened — complete the declaration below.'
                                                            : 'Open the rulebook once before registering.'}
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setHasOpenedRulebook(true)
                                                        setIsRulebookOpen(true)
                                                    }}
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '7px',
                                                        padding: '9px 12px',
                                                        borderRadius: '9px',
                                                        background: hasOpenedRulebook ? 'var(--color-green-dim)' : 'var(--accent-dim)',
                                                        border: hasOpenedRulebook ? '1px solid var(--color-green-border)' : '1px solid var(--accent)',
                                                        color: hasOpenedRulebook ? 'var(--color-green)' : 'var(--accent)',
                                                        fontSize: '0.82rem',
                                                        fontWeight: 700,
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    <FileText size={15} aria-hidden="true"/>
                                                    {hasOpenedRulebook ? 'Review rulebook' : 'Read the Mini CTF Rulebook'}
                                                </button>
                                            </div>

                                            <section className="mini-ctf-declaration-section">
                                                <h4>Declaration required to register</h4>
                                                <p>Enter the declaration below exactly.</p>
                                                <blockquote>{MINI_CTF_DECLARATION}</blockquote>
                                                <label htmlFor={`registration-declaration-${sprint.id}`}>
                                                    Declaration
                                                </label>
                                                <textarea
                                                    id={`registration-declaration-${sprint.id}`}
                                                    value={declaration}
                                                    onChange={(event) => {
                                                        setDeclaration(event.target.value)
                                                        if (registrationState === 'error') {
                                                            setRegistrationState('idle')
                                                            setRegistrationMessage('')
                                                        }
                                                    }}
                                                    placeholder="Enter the declaration here"
                                                    rows={4}
                                                    autoComplete="off"
                                                />
                                                <p className="mini-ctf-declaration-status" aria-live="polite">
                                                    {!hasOpenedRulebook
                                                        ? 'Open the rulebook once, then complete this declaration.'
                                                        : declaration && !declarationMatches
                                                            ? 'The declaration must match exactly.'
                                                            : declarationMatches
                                                                ? 'Declaration complete — you can register.'
                                                                : 'Enter the declaration to continue.'}
                                                </p>
                                            </section>

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

                                            <div className="mini-ctf-registration-grid">
                                                <div className="mini-ctf-registration-field">
                                                    <label htmlFor={`registration-full-name-${sprint.id}`}>
                                                        Full name <span>Required</span>
                                                    </label>
                                                    <input
                                                        id={`registration-full-name-${sprint.id}`}
                                                        type="text"
                                                        autoComplete="name"
                                                        minLength={2}
                                                        maxLength={120}
                                                        required
                                                        placeholder="Your full name"
                                                        value={regForm.fullName}
                                                        onChange={(e) => {
                                                            setRegForm({...regForm, fullName: e.target.value})
                                                            if (registrationState === 'error') {
                                                                setRegistrationState('idle')
                                                                setRegistrationMessage('')
                                                            }
                                                        }}
                                                        className="mini-ctf-registration-input"
                                                    />
                                                </div>
                                                <div className="mini-ctf-registration-field">
                                                    <label htmlFor={`registration-roll-number-${sprint.id}`}>
                                                        Roll no. <span>Required</span>
                                                    </label>
                                                    <input
                                                        id={`registration-roll-number-${sprint.id}`}
                                                        type="text"
                                                        autoComplete="off"
                                                        minLength={3}
                                                        maxLength={40}
                                                        pattern="[a-zA-Z0-9/_-]+"
                                                        required
                                                        placeholder="Your institute roll number"
                                                        value={regForm.rollNumber}
                                                        onChange={(e) => {
                                                            setRegForm({...regForm, rollNumber: e.target.value})
                                                            if (registrationState === 'error') {
                                                                setRegistrationState('idle')
                                                                setRegistrationMessage('')
                                                            }
                                                        }}
                                                        className="mini-ctf-registration-input"
                                                    />
                                                </div>
                                                <div className="mini-ctf-registration-field">
                                                    <label htmlFor={`registration-subject-${sprint.id}`}>
                                                        Subject <span>Required</span>
                                                    </label>
                                                    <select
                                                        id={`registration-subject-${sprint.id}`}
                                                        required
                                                        value={regForm.subject}
                                                        onChange={(e) => {
                                                            setRegForm({
                                                                ...regForm,
                                                                subject: e.target.value as '' | MiniCtfSubject
                                                            })
                                                            if (registrationState === 'error') {
                                                                setRegistrationState('idle')
                                                                setRegistrationMessage('')
                                                            }
                                                        }}
                                                        className="mini-ctf-registration-input"
                                                    >
                                                        <option value="" disabled>Select your subject</option>
                                                        {MINI_CTF_SUBJECTS.map((subject) => (
                                                            <option key={subject} value={subject}>{subject}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="mini-ctf-registration-field">
                                                    <label htmlFor={`registration-semester-${sprint.id}`}>
                                                        Semester <span>Required</span>
                                                    </label>
                                                    <select
                                                        id={`registration-semester-${sprint.id}`}
                                                        required
                                                        value={regForm.semester}
                                                        onChange={(e) => {
                                                            setRegForm({...regForm, semester: e.target.value})
                                                            if (registrationState === 'error') {
                                                                setRegistrationState('idle')
                                                                setRegistrationMessage('')
                                                            }
                                                        }}
                                                        className="mini-ctf-registration-input"
                                                    >
                                                        <option value="" disabled>Select your semester</option>
                                                        {[1, 2, 3, 4, 5, 6, 7].map((semester) => (
                                                            <option key={semester}
                                                                    value={semester}>Semester {semester}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div
                                                    className="mini-ctf-registration-field mini-ctf-registration-field-wide">
                                                    <label htmlFor={`registration-mobile-number-${sprint.id}`}>
                                                        Mobile number <span>Required</span>
                                                    </label>
                                                    <input
                                                        id={`registration-mobile-number-${sprint.id}`}
                                                        type="tel"
                                                        inputMode="numeric"
                                                        autoComplete="tel"
                                                        maxLength={10}
                                                        pattern="[6-9][0-9]{9}"
                                                        required
                                                        placeholder="10-digit Indian mobile number"
                                                        value={regForm.mobileNumber}
                                                        onChange={(e) => {
                                                            setRegForm({
                                                                ...regForm,
                                                                mobileNumber: e.target.value.replace(/\D/g, '')
                                                            })
                                                            if (registrationState === 'error') {
                                                                setRegistrationState('idle')
                                                                setRegistrationMessage('')
                                                            }
                                                        }}
                                                        className="mini-ctf-registration-input"
                                                    />
                                                </div>
                                            </div>

                                            <div style={{marginBottom: '20px'}}>
                                                <label
                                                    htmlFor={`registration-email-${sprint.id}`}
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
                                                    id={`registration-email-${sprint.id}`}
                                                    type="email"
                                                    inputMode="email"
                                                    autoComplete="email"
                                                    maxLength={254}
                                                    aria-required="true"
                                                    placeholder="Your institute email address"
                                                    value={regForm.email}
                                                    onChange={(e) => {
                                                        setRegForm({...regForm, email: e.target.value})
                                                        if (registrationState === 'error') {
                                                            setRegistrationState('idle')
                                                            setRegistrationMessage('')
                                                        }
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') submitRegistration(sprint.id)
                                                    }}
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
                                                        e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)'
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = 'var(--border-subtle)'
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

                                            <div style={{marginBottom: '26px'}}>
                                                <label
                                                    htmlFor={`registration-pwn-${sprint.id}`}
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
                                                    id={`registration-pwn-${sprint.id}`}
                                                    type="text"
                                                    autoComplete="username"
                                                    minLength={2}
                                                    maxLength={64}
                                                    pattern="[a-zA-Z0-9_.-]+"
                                                    aria-required="true"
                                                    placeholder="Your pwn.college username"
                                                    value={regForm.pwnUsername}
                                                    onChange={(e) => {
                                                        setRegForm({
                                                            ...regForm, pwnUsername: e.target.value
                                                        })
                                                        if (registrationState === 'error') {
                                                            setRegistrationState('idle')
                                                            setRegistrationMessage('')
                                                        }
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') submitRegistration(sprint.id)
                                                    }}
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
                                                        e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)'
                                                    }}
                                                    onBlur={(e) => {
                                                        e.target.style.borderColor = 'var(--border-subtle)'
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
                                                disabled={registrationState === 'submitting' || registrationState === 'success' || !canRegister}
                                                onClick={() => submitRegistration(sprint.id)}
                                                style={{
                                                    width: '100%',
                                                    padding: '14px 20px',
                                                    borderRadius: '12px',
                                                    background: registrationState === 'success' ? 'var(--color-green)' : 'var(--accent)',
                                                    border: '1px solid var(--border-subtle)',
                                                    color: '#ffffff',
                                                    fontSize: '0.98rem',
                                                    fontWeight: 700,
                                                    cursor: registrationState === 'submitting' || registrationState === 'success' || !canRegister ? 'not-allowed' : 'pointer',
                                                    textAlign: 'center',
                                                    marginBottom: '14px',
                                                    opacity: canRegister ? 0.88 : 0.48,
                                                    transition: 'all 0.2s ease',
                                                }}
                                            >
                                                {registrationState === 'submitting' ? 'Submitting registration…' : registrationState === 'success' ? 'Registration confirmed' : 'Register for this sprint'}
                                            </button>

                                            <div
                                                role="status"
                                                aria-live="polite"
                                                style={{
                                                    fontSize: '0.84rem',
                                                    color: registrationState === 'error' ? 'var(--color-red)' : registrationState === 'success' ? 'var(--color-green)' : 'var(--text-muted)',
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                {registrationMessage || (canRegister
                                                    ? 'Your username and institute email will be sent securely to the HackShield registration API.'
                                                    : 'Open the rulebook once and complete the declaration to enable registration.')}
                                            </div>
                                        </motion.div>)}
                                    </AnimatePresence>
                                </div>)
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
                        <div style={{textAlign: 'center', marginBottom: '32px'}}>
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
                                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                                gap: '24px',
                            }}
                        >
                            {[{
                                step: '01',
                                title: 'Practice',
                                desc: 'Each sprint runs for strictly 2.5 to 3 hours on our self-hosted CTFd instance.',
                            }, {
                                step: '02',
                                title: 'Dynamic Point Decay',
                                desc: 'First bloods receive massive point bonuses; challenge points decay as more competitors solve.',
                            }, {
                                step: '03',
                                title: 'Live Debrief & Writeups',
                                desc: 'Immediately following the flag countdown, challenge authors present step-by-step solutions on Discord.',
                            }, {
                                step: '04',
                                title: 'Club XP & Selection',
                                desc: 'Top scorers earn club badges and fast-track invitations to the official inter-IIT CTF traveling squad.',
                            },].map((rule, idx) => (<div
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
                            </div>))}
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
                                display: 'flex', alignItems: 'center', gap: '18px',
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
                                <Trophy size={24} color="var(--accent)"/>
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
                                        margin: '4px 0 0', fontSize: '0.94rem', color: 'var(--text-secondary)',
                                    }}
                                >
                                    HackShield CTF 2026 is our 24-hour national championship
                                    featuring sposored goodies and top teams.
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
                            <ChevronRight size={16}/>
                        </button>
                    </div>
                </motion.div>)}
            </AnimatePresence>
        </div>
        <MiniCtfRulebookModal
            isOpen={isRulebookOpen}
            onClose={() => setIsRulebookOpen(false)}
        />
    </div>)
}

export default function CTFPage() {
    return (<Suspense
        fallback={<div
            style={{
                minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
        >
            <div style={{color: 'var(--accent)'}}>Loading CTF Arenas...</div>
        </div>}
    >
        <CTFContent/>
    </Suspense>)
}

