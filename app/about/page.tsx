'use client'

import React, {useEffect} from 'react'
import {motion} from 'framer-motion'
import {useInView} from 'react-intersection-observer'
import {Cpu, Lock, Sparkles, Terminal, Users} from 'lucide-react'
import TeamSection from '@/components/TeamSection'

export default function AboutPage() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const {ref: heroRef, inView: heroInView} = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })
    const {ref: valuesRef, inView: valuesInView} = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })
    const {ref: timelineRef, inView: timelineInView} = useInView({
        triggerOnce: true,
        threshold: 0.1,
    })

    const values = [
        {
            icon: <Terminal size={24} color="var(--accent)"/>,
            title: 'Pragmatic Security First',
            desc: 'Theory sets the stage. Practice steals the show. From memory buffers and network packets to reverse-engineering binaries, we dive straight into offensive and defensive security. Less slides, more bytes.',
        },
        {
            icon: <Users size={24} color="var(--accent)"/>,
            title: 'Fiercely Collaborative',
            desc: 'No hacker works alone. From curious freshers to seasoned CTF warriors and alumni in top security firms and defense agencies, HackShield brings the entire crew together. Share knowledge, crack challenges, grow stronger.',
        },
        {
            icon: <Lock size={24} color="var(--accent)"/>,
            title: 'Responsible & Ethical',
            desc: 'With great hacking power comes great responsibility. Every lab and workshop stays within ethical boundaries, because breaking rules isn\'t the goal breaking vulnerabilities is. White-hat mindset, from day one.',
        },
        {
            icon: <Cpu size={24} color="var(--accent)"/>,
            title: 'Systems-Level Thinking',
            desc: 'From logic gates to cloud orchestration, we explore every layer of the stack. No blindly running scripts or scanners —understand what\'s happening under the hood, then make your move.',
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
            <div style={{maxWidth: 1100, margin: '0 auto', padding: '0 24px'}}>
                <motion.div
                    ref={heroRef}
                    initial={{opacity: 0, y: 30}}
                    animate={heroInView ? {opacity: 1, y: 0} : {}}
                    transition={{duration: 0.7}}
                    style={{textAlign: 'center', marginBottom: '70px'}}
                >
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
                        Find the Pattern.
                        <br/>
                        <span
                            style={{
                                color: 'var(--accent)',
                                fontStyle: 'italic',
                                fontFamily: 'Georgia, serif',
                            }}
                        >
                            Find the People.
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
                    initial={{opacity: 0, scale: 0.96}}
                    animate={{opacity: 1, scale: 1}}
                    transition={{duration: 0.8, delay: 0.2}}
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
                        <Sparkles size={20}/>
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
                        Cybersecurity doesn't play by the syllabus, and neither do we. At HackShield, we take learning
                        beyond textbooks and into the trenches of real-world security. From breaking things (ethically,
                        of course) to building things stronger, we equip IIT Patna undergraduates with hands-on tools,
                        sandboxed labs, and a community that thrives on curiosity, collaboration, and a little bit of
                        controlled chaos. Less theory, more hacking. More skills, fewer vulnerabilities.
                    </p>
                </motion.div>

                <div
                    style={{maxWidth: 1280, margin: '60px auto', padding: '0 24px'}}
                >
                    <TeamSection/>
                </div>

                <div ref={valuesRef} style={{marginBottom: '90px'}}>
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
                                initial={{opacity: 0, y: 25}}
                                animate={valuesInView ? {opacity: 1, y: 0} : {}}
                                transition={{duration: 0.5, delay: idx * 0.12}}
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

                <div ref={timelineRef} style={{marginBottom: '80px'}}>
                </div>
            </div>
        </div>
    )
}

