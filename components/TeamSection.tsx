'use client'

import React, {useState} from 'react'
import {motion} from 'framer-motion'
import {useInView} from 'react-intersection-observer'
import {User} from 'lucide-react'
import {TeamMember} from '@/types'

export const teamMembers: TeamMember[] = [
    {
        name: 'Shiwangini Shreya',
        role: 'Advisor',
        email: 'shiwangini_pa2508mch214@iitp.ac.in',
        linkedin: 'https://www.linkedin.com/in/shiwangini-shreya',
        badge: 'Advisory',
        image: '/people/Shiwangini.webp',
    },
    {
        name: 'Aayush Babu',
        role: 'Club Coordinator',
        email: 'aayush_25s12res03@iitp.ac.in',
        linkedin: 'https://linkedin.com/in/aayushrambo8',
        website: 'https://www.aayushbabu.live',
        badge: 'LEAD COORDINATOR',
        image: '/people/Aayush.webp',
    },
    {
        name: 'Yash Bhople',
        role: 'Club Sub-coordinator',
        email: 'yash_ua2504aih274@iitp.ac.in',
        linkedin: 'https://linkedin.com/in/yashbhople',
        website: 'https://yashbhople.xyz',
        badge: 'SUB COORDINATOR',
        image: '/people/Yash Bhople.webp',
    },
    {
        name: 'Himanshu Kundal',
        role: 'Core Member',
        email: 'himanahu_ua2504cdh203@iitp.ac.in',
        linkedin: 'https://linkedin.com/in/himanshukundal',
        website: 'https://himanshuiitp.github.io/portfolio/',
        badge: 'Member',
        image: '/people/Himanshu.webp',
    },
    {
        name: 'Antra Priyadarshini',
        role: 'Core Member',
        email: 'antra_ua2503cdh63@iitp.ac.in',
        linkedin: 'https://www.linkedin.com/in/antra-priyadarshini-79a5a0399/',
        badge: 'Member',
        image: '/people/Antara priyadarshini.webp',
    },
    {
        name: 'Ishan Mishra',
        role: 'Core Member and Lead Researcher',
        email: 'ishan_ua2504aih103@iitp.ac.in',
        linkedin: 'www.linkedin.com/in/ishanmishra079',
        badge: 'Member',
        image: '/people/Ishan.webp',
    },
    {
        name: 'Aditya Adep',
        role: 'Core Member',
        email: 'aditya_ua2504aih22@iitp.ac.in',
        linkedin: 'https://www.linkedin.com/in/aditya-adep-a08248366/',
        badge: 'Member',
        image: '/people/Aditya Adep.webp',
    },

    {
        name: 'Anurag Kumar',
        role: 'Core Member',
        email: 'anurag_ua2604aih15@iitp.ac.in',
        linkedin: 'https://www.linkedin.com/in/anurag-kumar-473736349',
        badge: 'Member',
        image: '/people/Anurag.webp',
    },
    {
        name: 'Ansh Kumar',
        role: 'Management',
        email: 'ansh_ua2602bbh09@iitp.ac.in',
        linkedin: 'https://www.linkedin.com/in/Ansh-kumar',
        badge: 'Member',
        image: '/people/Ansh.webp',
    }
]

function normalizeImagePath(path?: string): string {
    if (!path) return ''
    const trimmed = path.trim()
    if (!trimmed) return ''
    if (trimmed.startsWith('public/')) {
        return '/' + trimmed.slice(7)
    }
    if (trimmed.startsWith('/public/')) {
        return '/' + trimmed.slice(8)
    }
    if (!trimmed.startsWith('/') && !trimmed.startsWith('http')) {
        return '/' + trimmed
    }
    return trimmed
}

function MemberAvatar({member}: { member: TeamMember }) {
    const [hasError, setHasError] = useState(false)
    const normalizedSrc = normalizeImagePath(member.image)
    const showImage = Boolean(normalizedSrc && !hasError)

    return (
        <div
            style={{
                position: 'relative',
                width: '200px',
                height: '250px',
                aspectRatio: '4 / 5',
                borderRadius: '14px',
                overflow: 'hidden',
                background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01))',
                border: '1px solid var(--border-subtle)',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {showImage ? (
                <img
                    src={encodeURI(normalizedSrc)}
                    alt={member.name}
                    onError={() => setHasError(true)}
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                    }}
                    loading="lazy"
                />
            ) : (
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        background:
                            'radial-gradient(circle at 50% 40%, rgba(168, 85, 247, 0.14), transparent 70%), var(--bg-card)',
                        position: 'relative',
                    }}
                >
                    {/* Subtle grid pattern background */}
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage:
                                'linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px)',
                            backgroundSize: '16px 16px',
                            opacity: 0.6,
                            pointerEvents: 'none',
                        }}
                    />
                    <div
                        style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '50%',
                            background: 'var(--accent-dim)',
                            border: '1px solid var(--border-subtle)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--accent)',
                            zIndex: 1,
                        }}
                    >
                        <User size={24} strokeWidth={1.5}/>
                    </div>
                    <span
                        style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.62rem',
                            color: 'var(--text-muted)',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            zIndex: 1,
                        }}
                    >
                        200 × 250 (4:5)
                    </span>
                </div>
            )}

            {/* Floating Role / Status Badge */}
            {member.badge && (
                <span
                    style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.58rem',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        color: 'var(--accent)',
                        background: 'rgba(10, 10, 16, 0.82)',
                        border: '1px solid var(--border-subtle)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        padding: '2px 6px',
                        borderRadius: '5px',
                        zIndex: 2,
                        textTransform: 'uppercase',
                    }}
                >
                    {member.badge}
                </span>
            )}
        </div>
    )
}

export default function TeamSection({members = teamMembers}: {members?: TeamMember[]} = {}) {
    const {ref, inView} = useInView({triggerOnce: true, threshold: 0.12})

    const advisor = members.find((m) => m.role.toLowerCase().includes('advisor'))
    const coordinators = members.filter((m) =>
        m.role.toLowerCase().includes('coordinator')
    )
    const otherMembers = members.filter((m) =>
        m !== advisor && !coordinators.includes(m)
    )

    const renderCard = (member: TeamMember, idx: number) => (
        <motion.div
            key={member.name}
            initial={{opacity: 0, y: 20}}
            animate={inView ? {opacity: 1, y: 0} : {}}
            transition={{
                duration: 0.5,
                delay: idx * 0.05,
                ease: [0.16, 1, 0.3, 1],
            }}
            style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderTop: '1.5px solid var(--border-specular)',
                borderBottom: '1px solid var(--border-bottom)',
                borderRadius: '20px',
                padding: '16px',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
                width: '232px',
                boxSizing: 'border-box',
                flexShrink: 0,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.30)'
                e.currentTarget.style.borderTopColor = 'rgba(255, 255, 255, 0.58)'
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
                {/* 200 × 230 Image / Placeholder Container */}
                <MemberAvatar member={member}/>

                {/* Name & Role on the bottom */}
                <h3
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.05rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        margin: '0 0 3px 0',
                        lineHeight: 1.25,
                    }}
                >
                    {member.name}
                </h3>

                <p
                    style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.78rem',
                        color: 'var(--accent)',
                        margin: '0 0 12px 0',
                        fontWeight: 500,
                        lineHeight: 1.3,
                    }}
                >
                    {member.role}
                </p>
            </div>

            <div
                style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                }}
            >
                <a
                    href={`mailto:${member.email}`}
                    style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        color: 'var(--text-muted)',
                        textDecoration: 'none',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) =>
                        ((e.target as HTMLElement).style.color =
                            'var(--text-primary)')
                    }
                    onMouseLeave={(e) =>
                        ((e.target as HTMLElement).style.color = 'var(--text-muted)')
                    }
                >
                    {member.email}
                </a>

                <div style={{display: 'flex', gap: '12px', alignItems: 'center', marginTop: '2px'}}>
                    {member.linkedin && (
                        <a
                            href={member.linkedin.startsWith('http') ? member.linkedin : `https://${member.linkedin.replace(/^\/\/\s*/, '').trim()}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                fontFamily: 'var(--font-sans)',
                                fontSize: '0.74rem',
                                color: 'var(--text-secondary)',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px',
                                transition: 'color 0.2s',
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.color = 'var(--accent)')
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.color = 'var(--text-secondary)')
                            }
                        >
                            <span>LinkedIn</span>
                            <span style={{fontSize: '0.66rem'}}>↗</span>
                        </a>
                    )}

                    {member.website && (
                        <a
                            href={member.website.startsWith('http') ? member.website : `https://${member.website.trim()}`}
                            target="_blank"
                            rel="noreferrer"
                            style={
                                {
                                    fontFamily: 'var(--font-sans)',
                                    fontSize: '0.74rem',
                                    color: 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '3px',
                                    transition: 'color 0.2s',
                                }
                            }
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.color = 'var(--accent)')
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.color = 'var(--text-secondary)')
                            }
                        >
                            <span>Website</span>
                            <span style={{fontSize: '0.66rem'}}>↗</span>
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    )

    return (
        <section
            ref={ref}
            style={
                {
                    width: '100%',
                    padding: '50px 0 80px',
                    maxWidth: '1280px',
                    margin: '0 auto',
                }
            }
        >
            <motion.div
                initial={{opacity: 0, y: 24}}
                animate={inView ? {opacity: 1, y: 0} : {}}
                transition={{duration: 0.65, ease: [0.16, 1, 0.3, 1]}}
                style={{marginBottom: '40px'}}
            >
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '14px',
                    }}
                >
                    <span
                        style={{
                            width: '24px',
                            height: '2px',
                            background: 'var(--accent)',
                            display: 'inline-block',
                            borderRadius: '1px',
                        }}
                    />
                    <span
                        style={{
                            fontFamily: "'Space Grotesk', monospace",
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase',
                            color: 'var(--text-muted)',
                        }}
                    >
                        ORGANIZERS & LEADS
                    </span>
                </div>

                <h2
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        lineHeight: 1.15,
                        letterSpacing: '-0.03em',
                        margin: 0,
                    }}
                >
                    Community Organizers
                </h2>
            </motion.div>

            {/* Row 1: Advisor centered on top */}
            {advisor && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '24px',
                    }}
                >
                    {renderCard(advisor, 0)}
                </div>
            )}

            {/* Row 2: Coordinators centered side-by-side */}
            {coordinators.length > 0 && (
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '24px',
                        marginBottom: '24px',
                    }}
                >
                    {coordinators.map((member, idx) => renderCard(member, idx + 1))}
                </div>
            )}

            {/* Row 3: Club Members in 3 columns */}
            <div className="hs-team-grid">
                {otherMembers.map((member, idx) =>
                    renderCard(member, idx + 1 + coordinators.length)
                )}
            </div>
        </section>
    )
}