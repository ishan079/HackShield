'use client'

import Link from 'next/link'
import Image from 'next/image'
import {Mail, MapPin} from 'lucide-react'
import {NavLinkItem} from '@/types'

const LinkedinIcon = ({size = 16, color = 'currentColor'}: { size?: number; color?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
    </svg>
)

const WhatsAppIcon = ({size = 16, color = 'currentColor'}: { size?: number; color?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
)

const DiscordIcon = ({size = 16, color = 'currentColor'}: { size?: number; color?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path
            d="M18 6h0a14.5 14.5 0 0 0-4-1.5 9.6 9.6 0 0 0-.4 1 11.5 11.5 0 0 0-3.2 0 9.6 9.6 0 0 0-.4-1A14.5 14.5 0 0 0 6 6a14.6 14.6 0 0 0-2 9.5 14 14 0 0 0 4.5 2.3 10.4 10.4 0 0 0 1-1.6 9.3 9.3 0 0 1-1.6-.8l.2-.2c3.2 1.5 6.6 1.5 9.8 0l.2.2a9.3 9.3 0 0 1-1.6.8c.3.5.7 1.1 1 1.6A14 14 0 0 0 20 15.5 14.6 14.6 0 0 0 18 6z"/>
        <circle cx="9" cy="12" r="1.5"/>
        <circle cx="15" cy="12" r="1.5"/>
    </svg>
)

const quickLinks: NavLinkItem[] = [
    {label: 'Home', to: '/'},
    {label: 'Programs', to: '/programs'},
    {label: 'CTF', to: '/ctf'},
    {label: 'Resources', to: '/resources'},
    {label: 'About', to: '/about'},
]

const communityLinks = [
    {label: 'WhatsApp Community', href: 'https://chat.whatsapp.com/Kk4EPaNeHkp8oNQZ8O0ZR7', Icon: WhatsAppIcon},
    {label: 'Discord', href: 'https://discord.gg', Icon: DiscordIcon},
    {label: 'LinkedIn', href: 'https://www.linkedin.com/company/stc-iitp-hybrid-programs/', Icon: LinkedinIcon},
]

export default function Footer() {
    return (
        <footer
            style={{
                position: 'relative',
                zIndex: 1,
                background: 'var(--bg-secondary)',
                borderTop: '1px solid var(--border-subtle)',
                padding: '36px 0 0',
                fontFamily: 'inherit',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                lineHeight: 1.7,
            }}
        >
            <div
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 24px',
                }}
            >
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '28px',
                        paddingBottom: '24px',
                    }}
                >
                    <div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginBottom: '12px',
                            }}
                        >
                            <Image
                                src="/favicon.svg"
                                alt="HackShield Logo"
                                width={26}
                                height={26}
                                style={{
                                    width: '26px',
                                    height: '26px',
                                    objectFit: 'contain',
                                    flexShrink: 0,
                                    filter: 'drop-shadow(0 2px 6px rgba(168, 85, 247, 0.35))',
                                }}
                            />
                            <span
                                style={{
                                    fontSize: '18px',
                                    fontWeight: 700,
                                    color: 'var(--text-primary)',
                                    letterSpacing: '0.5px',
                                }}
                            >
                HackShield
              </span>
                        </div>
                        <p
                            style={{
                                fontSize: '13px',
                                color: 'var(--accent)',
                                fontWeight: 500,
                                marginBottom: '12px',
                            }}
                        >
                            IITP CET Official Cybersecurity Club - STC IITP CET
                        </p>
                        <p
                            style={{
                                fontSize: '13px',
                                color: 'var(--text-muted)',
                                lineHeight: 1.8,
                            }}
                        >
                            Building the next generation of cybersecurity researchers, builders, and ethical hackers.
                        </p>
                    </div>

                    <div>
                        <h4
                            style={{
                                fontSize: '14px',
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                                marginBottom: '12px',
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase',
                            }}
                        >
                            Quick Links
                        </h4>
                        <ul
                            style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                            }}
                        >
                            {quickLinks.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={item.to}
                                        style={{
                                            color: 'var(--text-secondary)',
                                            textDecoration: 'none',
                                            fontSize: '13px',
                                            transition: 'color 0.25s ease',
                                            display: 'inline-block',
                                        }}
                                        onMouseEnter={(e) => {
                                            ;(e.target as HTMLElement).style.color = 'var(--accent)'
                                        }}
                                        onMouseLeave={(e) => {
                                            ;(e.target as HTMLElement).style.color = 'var(--text-secondary)'
                                        }}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4
                            style={{
                                fontSize: '14px',
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                                marginBottom: '12px',
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase',
                            }}
                        >
                            Community
                        </h4>
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                            }}
                        >
                            {communityLinks.map((item, index) => {
                                const IconComponent = item.Icon
                                return (
                                    <a
                                        key={index}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            color: 'var(--text-secondary)',
                                            textDecoration: 'none',
                                            fontSize: '13px',
                                            transition: 'color 0.25s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = 'var(--accent)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = 'var(--text-secondary)'
                                        }}
                                    >
                                        <IconComponent size={16}/>
                                        <span>{item.label}</span>
                                    </a>
                                )
                            })}
                        </div>
                    </div>

                    <div>
                        <h4
                            style={{
                                fontSize: '14px',
                                fontWeight: 600,
                                color: 'var(--text-primary)',
                                marginBottom: '12px',
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase',
                            }}
                        >
                            Contact
                        </h4>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '10px',
                                marginBottom: '14px',
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                            }}
                        >
                            <Mail
                                size={16}
                                style={{
                                    marginTop: '2px',
                                    flexShrink: 0,
                                    color: 'var(--accent)',
                                }}
                            />
                            <div>
                                <a
                                    href="mailto:aayush_25s12res03@iitp.ac.in"
                                    style={{
                                        color: 'var(--text-secondary)',
                                        textDecoration: 'none',
                                        fontSize: '13px',
                                        transition: 'color 0.25s ease',
                                        display: 'inline',
                                    }}
                                    onMouseEnter={(e) => {
                                        ;(e.target as HTMLElement).style.color = 'var(--accent)'
                                    }}
                                    onMouseLeave={(e) => {
                                        ;(e.target as HTMLElement).style.color = 'var(--text-secondary)'
                                    }}
                                >
                                    Coordinator
                                </a>
                            </div>
                            <div>
                                <a
                                    href="mailto:yash_ua2504aih274@iitp.ac.in"
                                    style={{
                                        color: 'var(--text-secondary)',
                                        textDecoration: 'none',
                                        fontSize: '13px',
                                        transition: 'color 0.25s ease',
                                        display: 'inline',
                                    }}
                                    onMouseEnter={(e) => {
                                        ;(e.target as HTMLElement).style.color = 'var(--accent)'
                                    }}
                                    onMouseLeave={(e) => {
                                        ;(e.target as HTMLElement).style.color = 'var(--text-secondary)'
                                    }}
                                >
                                    Sub-Coordinator
                                </a>
                            </div>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '10px',
                                marginBottom: '14px',
                                fontSize: '13px',
                                color: 'var(--text-secondary)',
                            }}
                        >
                            <MapPin
                                size={16}
                                style={{
                                    marginTop: '2px',
                                    flexShrink: 0,
                                    color: 'var(--accent)',
                                }}
                            />
                            <span>
                Indian Institute of Technology Patna<br/>
                Bihta, Bihar 801106, India
              </span>
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        borderTop: '1px solid var(--border-subtle)',
                        padding: '16px 0',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '12px',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '12px',
                        color: 'var(--text-muted)',
                    }}
                >
                    <div>
                        © {new Date().getFullYear()} HackShield · IIT Patna. All rights reserved.
                    </div>
                    <div>
                        Hack. Learn. Defend. Together.
                    </div>
                </div>
            </div>
        </footer>
    )
}

