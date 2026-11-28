'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowUpRight, Calendar, Clock, Trophy, Users } from 'lucide-react'

export default function CTFBanner() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px',
  })

  return (
    <Link
      href="/ctf/defendthevillage"
      aria-label="Explore Defend The Village Flagship CTF"
      className="hs-ctf-banner-link"
    >
      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 36 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="hs-ctf-banner"
      >
        <div className="hs-ctf-banner-bg" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/minecraft-ctf-backdrop.jpg"
            alt=""
            className="hs-ctf-banner-img"
          />
          <div className="hs-ctf-banner-scrim" />
        </div>

        <div className="hs-ctf-banner-content">
          <div className="hs-ctf-banner-kicker">
            <span className="hs-ctf-banner-dot" aria-hidden="true" />
            <span>Flagship Event · HackShield CTF 2026</span>
          </div>

          <h2 className="hs-ctf-banner-title">
            <span className="hs-ctf-banner-title-white">Defend</span>{' '}
            <span className="hs-ctf-banner-title-red">The Village</span>
          </h2>

          <p className="hs-ctf-banner-desc">
            Our 24-hour jeopardy cybersecurity tournament — 40+ original
            challenges built by IIT Patna researchers across 9 security domains.
          </p>

          <div className="hs-ctf-banner-meta">
            <span>
              <Calendar size={14} color="#7dd3fc" aria-hidden="true" /> Dec 14, 2026
            </span>
            <span>
              <Clock size={14} color="#7dd3fc" aria-hidden="true" /> 24 Hours
            </span>
            <span>
              <Users size={14} color="#34d399" aria-hidden="true" /> Teams of 1–4
            </span>
            <span>
              <Trophy size={14} color="#fbbf24" aria-hidden="true" /> Goodies &amp; Interviews
            </span>
          </div>

          <div className="hs-ctf-banner-cta-row">
            <span className="hs-ctf-banner-cta">
              <span>Explore Defend The Village</span>
              <ArrowUpRight size={16} className="hs-ctf-banner-arrow" aria-hidden="true" />
            </span>
          </div>
        </div>
      </motion.section>

      <style>{`
        .hs-ctf-banner-link {
          display: block;
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          text-decoration: none;
          cursor: pointer;
        }

        .hs-ctf-banner {
          position: relative;
          width: 100%;
          min-height: 360px;
          border-radius: 28px;
          overflow: hidden;
          background: #050814;
          border: 1px solid rgba(148, 163, 184, 0.22);
          border-top: 1.5px solid rgba(125, 211, 252, 0.36);
          box-shadow: 0 24px 60px -12px rgba(0, 0, 0, 0.55);
          display: flex;
          align-items: center;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
                      border-color 0.3s ease,
                      box-shadow 0.3s ease;
        }

        .hs-ctf-banner-link:hover .hs-ctf-banner,
        .hs-ctf-banner-link:focus-visible .hs-ctf-banner {
          transform: translate3d(0, -4px, 0);
          border-color: rgba(125, 211, 252, 0.52);
          box-shadow: 0 30px 72px -12px rgba(0, 0, 0, 0.7),
                      0 0 36px rgba(56, 189, 248, 0.16);
        }

        .hs-ctf-banner-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .hs-ctf-banner-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: 78% 28%;
          transform: scale(1.01);
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hs-ctf-banner-link:hover .hs-ctf-banner-img {
          transform: scale(1.045);
        }

        .hs-ctf-banner-scrim {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              rgba(5, 8, 20, 0.96) 0%,
              rgba(5, 8, 20, 0.88) 40%,
              rgba(5, 8, 20, 0.52) 66%,
              rgba(5, 8, 20, 0.14) 100%
            ),
            linear-gradient(
              180deg,
              rgba(5, 8, 20, 0.45) 0%,
              rgba(5, 8, 20, 0) 35%,
              rgba(5, 8, 20, 0.55) 100%
            );
        }

        .hs-ctf-banner-content {
          position: relative;
          z-index: 2;
          max-width: 620px;
          padding: clamp(32px, 5vw, 52px);
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .hs-ctf-banner-kicker {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 12px;
          border-radius: 999px;
          background: rgba(9, 16, 34, 0.82);
          border: 1px solid rgba(125, 211, 252, 0.28);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #bae6fd;
          margin-bottom: 16px;
        }

        .hs-ctf-banner-dot {
          width: 7px;
          height: 7px;
          border-radius: 1px;
          background: #ef4444;
          box-shadow: 0 0 8px rgba(239, 68, 68, 0.8);
        }

        .hs-ctf-banner-title {
          font-family: 'MinecraftPixel', var(--font-display), monospace;
          font-size: clamp(2.1rem, 4.4vw, 3.35rem);
          font-weight: 700;
          line-height: 0.98;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          margin: 0 0 14px;
        }

        .hs-ctf-banner-title-white {
          color: #f8fafc;
          text-shadow: 0 3px 0 #1e293b, 0 6px 0 #050814;
        }

        .hs-ctf-banner-title-red {
          color: #ef4444;
          text-shadow: 0 3px 0 #7f1d1d, 0 6px 0 #050814;
        }

        .hs-ctf-banner-desc {
          font-family: var(--font-sans);
          font-size: 0.98rem;
          line-height: 1.65;
          color: rgba(226, 232, 240, 0.84);
          margin: 0 0 20px;
          max-width: 500px;
        }

        .hs-ctf-banner-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 24px;
        }

        .hs-ctf-banner-meta span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 11px;
          border-radius: 8px;
          background: rgba(9, 16, 34, 0.78);
          border: 1px solid rgba(148, 163, 184, 0.18);
          font-family: var(--font-mono);
          font-size: 0.75rem;
          font-weight: 600;
          color: #e2e8f0;
        }

        .hs-ctf-banner-cta {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 12px 22px;
          border-radius: 10px;
          border: 1px solid rgba(248, 113, 113, 0.65);
          background: linear-gradient(180deg, rgba(220, 38, 38, 0.45) 0%, rgba(127, 29, 29, 0.62) 100%);
          color: #ffffff;
          font-family: var(--font-mono);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16);
          transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease;
        }

        .hs-ctf-banner-link:hover .hs-ctf-banner-cta {
          border-color: #fecaca;
          background: linear-gradient(180deg, rgba(239, 68, 68, 0.65) 0%, rgba(153, 27, 27, 0.76) 100%);
        }

        .hs-ctf-banner-arrow {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hs-ctf-banner-link:hover .hs-ctf-banner-arrow {
          transform: translate3d(2px, -2px, 0);
        }

        @media (max-width: 768px) {
          .hs-ctf-banner {
            min-height: 400px;
            align-items: flex-end;
          }

          .hs-ctf-banner-img {
            object-position: 70% 15%;
          }

          .hs-ctf-banner-scrim {
            background: linear-gradient(
              180deg,
              rgba(5, 8, 20, 0.22) 0%,
              rgba(5, 8, 20, 0.72) 45%,
              rgba(5, 8, 20, 0.96) 100%
            );
          }

          .hs-ctf-banner-content {
            padding: 28px 22px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hs-ctf-banner,
          .hs-ctf-banner-img,
          .hs-ctf-banner-cta,
          .hs-ctf-banner-arrow {
            transition: none !important;
          }
        }
      `}</style>
    </Link>
  )
}
