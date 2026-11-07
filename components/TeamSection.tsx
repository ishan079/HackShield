'use client'

import React, {useState} from 'react'
import {motion} from 'framer-motion'
import {useInView} from 'react-intersection-observer'
import {TeamMember} from '@/types'

const teamMembers: TeamMember[] = [
    {
        name: 'Shiwangini Shreya',
        role: 'Advisor',
        email: 'shiwangini_pa2508mch214@iitp.ac.in',
        linkedin: 'https://www.linkedin.com/in/shiwangini-shreya',
        badge: 'Advisory',
    },
    {
        name: 'Aayush Babu',
        role: 'Club Coordinator',
        email: 'aayush_25s12res03@iitp.ac.in',
        linkedin: 'https://linkedin.com/in/aayushrambo8',
        website: 'https://www.aayushbabu.live',
        badge: 'LEAD COORDINATOR',
    }, {
        name: 'Yash Bhople',
        role: 'Club Sub-coordinator',
        email: 'yash_ua2504aih274@iitp.ac.in',
        linkedin: 'https://linkedin.com/in/yashbhople',
        website: 'https://yashbhople.xyz',
        badge: 'SUB COORDINATOR',
    },
    {
        name: 'Himanshu Kundal',
        role: 'Club Member',
        email: 'himanahu_ua2504cdh203@iitp.ac.in',
        linkedin: 'https://linkedin.com/in/himanshukundal',
        website: 'https://himanshuiitp.github.io/portfolio/',
        badge: 'Member',
    },
    {
        name: 'Ishan Mishra',
        role: 'Core Member and Lead Researcher',
        email: 'ishanmishra079@gmail.com',
        linkedin: 'www.linkedin.com/in/ishanmishra079',
        badge: 'Member'
    },
    {
        name: 'Aditya Adep',
        role: 'Core Member',
        email: 'aditya_ua2504aih22@iitp.ac.in',
        linkedin: 'https://www.linkedin.com/in/aditya-adep-a08248366/',
        badge: 'Member',
    },
    {
        name: 'Antra Priyadarshini',
        role: 'Club Member',
        email: 'antra_ua2503cdh63@iitp.ac.in',
        linkedin: 'https://www.linkedin.com/in/antra-priyadarshini-79a5a0399/',
        badge: 'Member',
    },
    {
        name: 'Anurag Kumar',
        role: 'Club Member',
        email: 'anurag_ua2604aih15@iitp.ac.in',
        linkedin: 'https://www.linkedin.com/in/anurag-kumar-473736349',
        badge: 'Member',
    },
    {
        name: 'Ansh Kumar',
        role: 'Management',
        email: 'ansh_ua2602bbh09@iitp.ac.in',
        linkedin: 'https:// www.linkedin.com/in/Ansh-kumar',
        badge: 'Member',
    }
]

export default function TeamSection() {
    const {ref, inView} = useInView({triggerOnce: true, threshold: 0.12})
    const [aliasToggle, setAliasToggle] = useState<Record<number, boolean>>({})

    const toggleAlias = (idx: number) => {
        setAliasToggle((prev) => ({...prev, [idx]: !prev[idx]}))
    }

    const advisor = teamMembers.find((m) => m.role.toLowerCase().includes('advisor'))
    const coordinators = teamMembers.filter((m) =>
        m.role.toLowerCase().includes('coordinator')
    )
    const otherMembers = teamMembers.filter((m) =>
        m !== advisor && !coordinators.includes(m)
    )

    const renderCard = (member: TeamMember, idx: number) => (
        <motion.div
            key={member.name}
            initial={{opacity: 0, y: 25}}
            animate={inView ? {opacity: 1, y: 0} : {}}
            transition={{
                duration: 0.55,
                delay: idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
            }}
            style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderTop: '1.5px solid var(--border-specular)',
                borderBottom: '1px solid var(--border-bottom)',
                borderRadius: '28px',
                padding: '28px',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
                height: '100%',
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
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '16px',
                    }}
                >
                    <span
                        style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                            color: 'var(--accent)',
                            background: 'var(--accent-dim)',
                            padding: '3px 8px',
                            borderRadius: '4px',
                        }}
                    >
                      {member.badge}
                    </span>

                    <button
                        type="button"
                        onClick={() => toggleAlias(idx)}
                        title="Click to toggle handle display"
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.72rem',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) =>
                            ((e.target as HTMLElement).style.color = 'var(--accent)')
                        }
                        onMouseLeave={(e) =>
                            ((e.target as HTMLElement).style.color =
                                'var(--text-muted)')
                        }
                    >
                    </button>
                </div>

                <h3
                    style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.3rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        margin: '0 0 6px 0',
                    }}
                >
                    {member.name}
                </h3>

                <p
                    style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '0.88rem',
                        color: 'var(--accent)',
                        margin: '0 0 16px 0',
                        fontWeight: 500,
                    }}
                >
                    {member.role}
                </p>
            </div>

            <div
                style={{
                    borderTop: '1px solid var(--border-subtle)',
                    paddingTop: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                }}
            >
                <a
                    href={`mailto:${member.email}`}
                    style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.76rem',
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

                {member.linkedin && (
                    <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                            fontFamily: 'var(--font-sans)',
                            fontSize: '0.8rem',
                            color: 'var(--text-secondary)',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.color = 'var(--accent)')
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.color = 'var(--text-secondary)')
                        }
                    >
                        <span>LinkedIn Profile</span>
                        <span>↗</span>
                    </a>
                )}
            </div>
        </motion.div>
    )

    return (
        <section
            ref={ref}
            style={{
                width: '100%',
                padding: '60px 0 90px',
                maxWidth: '1280px',
                margin: '0 auto',
            }}
        >
            <motion.div
                initial={{opacity: 0, y: 24}}
                animate={inView ? {opacity: 1, y: 0} : {}}
                transition={{duration: 0.65, ease: [0.16, 1, 0.3, 1]}}
                style={{marginBottom: '48px'}}
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

            {/* Row 1: Advisor on top */}
            {advisor && (
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '24px',
                    }}
                >
                    <div style={{width: '100%', maxWidth: '380px'}}>
                        {renderCard(advisor, 0)}
                    </div>
                </div>
            )}

            {/* Row 2: Coordinator and Subcoordinator */}
            {coordinators.length > 0 && (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '24px',
                        maxWidth: '784px',
                        margin: '0 auto 24px',
                    }}
                >
                    {coordinators.map((member, idx) => renderCard(member, idx + 1))}
                </div>
            )}

            {/* Row 3+: Continue the rest like it is */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '24px',
                }}
            >
                {otherMembers.map((member, idx) =>
                    renderCard(member, idx + 1 + coordinators.length)
                )}
            </div>
        </section>
    )
}

