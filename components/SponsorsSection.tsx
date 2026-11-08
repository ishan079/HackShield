'use client'

/**
 * =============================================================================
 * SPONSORS JSON DATA FORMAT (data/sponsors.json)
 * =============================================================================
 *
 * Fill in `data/sponsors.json` with your sponsors array. Example format:
 *
 * [
 *   {
 *     "id": "nextute",
 *     "name": "Nextute",
 *     "logo": "/sponsors/Nextute.svg",
 *     "tag": "current",
 *     "websiteUrl": "https://example.com"
 *   },
 *   {
 *     "id": "xyz-sponsor",
 *     "name": "XYZ",
 *     "logo": "/sponsors/xyz_logo.svg",
 *     "tag": "previous",
 *     "websiteUrl": "https://example.com"
 *   }
 * ]
 *
 * Fields:
 * - id: Unique string identifier
 * - name: Display caption under the logo
 * - logo: Path inside /public (e.g. "/sponsors/Nextute.svg") or remote URL
 * - tag: "current" (shows in top section) or "previous" (shows in lower section)
 * - websiteUrl: (Optional) link opened when tapping/clicking the logo
 * =============================================================================
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Building2 } from 'lucide-react'
import { SponsorItem } from '@/types'
import rawSponsorsData from '@/data/sponsors.json'

// Sample sponsors to display if data/sponsors.json is currently empty
const SAMPLE_SPONSORS: SponsorItem[] = [
  {
    id: 'nextute',
    name: 'Nextute',
    logo: '/sponsors/Nextute.svg',
    tag: 'current',
    websiteUrl: 'https://example.com',
  },
  {
    id: 'xyz-sponsor',
    name: 'XYZ',
    logo: '/sponsors/xyz_logo.svg',
    tag: 'previous',
    websiteUrl: 'https://example.com',
  },
]

interface SponsorsSectionProps {
  sponsors?: SponsorItem[]
  id?: string
}

function SponsorItemView({ sponsor }: { sponsor: SponsorItem }) {
  const [imgError, setImgError] = useState(false)

  const content = (
    <>
      <div
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px 32px',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
        className="hs-sponsor-logo-container"
      >
        {sponsor.logo && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={sponsor.logo}
            alt={sponsor.name}
            onError={() => setImgError(true)}
            className="hs-sponsor-logo"
            style={{
              maxHeight: '100px',
              maxWidth: '100%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto',
              opacity: 0.95,
              transition: 'transform 0.25s ease, opacity 0.25s ease',
            }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              opacity: 0.85,
              padding: '40px 20px',
            }}
          >
            <Building2 size={56} color="var(--accent)" />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1.25rem',
                color: 'var(--text-primary)',
              }}
            >
              {sponsor.name}
            </span>
          </div>
        )}
      </div>

      <span
        className="hs-sponsor-caption"
        style={{
          marginTop: '16px',
          fontSize: '1.05rem',
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          color: 'var(--text-secondary)',
          letterSpacing: '0.01em',
          transition: 'color 0.2s ease',
        }}
      >
        {sponsor.name}
      </span>
    </>
  )

  return (
    <div className="hs-sponsor-col">
      {sponsor.websiteUrl ? (
        <a
          href={sponsor.websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hs-sponsor-link"
          aria-label={`Visit ${sponsor.name} website`}
          title={`Visit ${sponsor.name} website (${sponsor.websiteUrl})`}
        >
          {content}
        </a>
      ) : (
        <div className="hs-sponsor-link" style={{ cursor: 'default' }}>
          {content}
        </div>
      )}
    </div>
  )
}

export default function SponsorsSection({
  sponsors,
  id = 'sponsors',
}: SponsorsSectionProps) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px',
  })

  // If provided prop or JSON file is empty, fallback to sample sponsors so section appears
  const sourceSponsors =
    sponsors ??
    ((rawSponsorsData as SponsorItem[]).length > 0
      ? (rawSponsorsData as SponsorItem[])
      : SAMPLE_SPONSORS)

  // Filter current vs previous sponsors
  const currentSponsors = sourceSponsors.filter(
    (s) => (s.tag || '').toLowerCase() === 'current'
  )
  const previousSponsors = sourceSponsors.filter(
    (s) =>
      (s.tag || '').toLowerCase() === 'previous' ||
      (s.tag || '').toLowerCase() === 'past'
  )

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby="sponsors-heading"
      style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="hs-sponsors-section-box"
      >
        {/* Section Heading */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '44px',
          }}
        >
          <h2
            id="sponsors-heading"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 3.6vw, 2.8rem)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              margin: '0 0 10px',
            }}
          >
            Our Sponsors
          </h2>
        </div>

        {/* Current Sponsors (Top) - Always kept even if blank */}
        <div style={{ marginBottom: previousSponsors.length > 0 ? '48px' : '0' }}>
          <div
            style={{
              textAlign: 'center',
              marginBottom: '28px',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.84rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                margin: 0,
              }}
            >
              Current Sponsors
            </h3>
          </div>

          <div className="hs-sponsors-grid" data-testid="current-sponsors-grid">
            {currentSponsors.map((sponsor, idx) => (
              <SponsorItemView
                key={sponsor.id || `current-${idx}`}
                sponsor={sponsor}
              />
            ))}
          </div>
        </div>

        {/* Divider between current and previous */}
        {previousSponsors.length > 0 && (
          <div
            style={{
              width: '80%',
              maxWidth: '600px',
              height: '1px',
              background: 'var(--border-subtle)',
              margin: '0 auto 40px',
            }}
          />
        )}

        {/* Previous Sponsors (Below) */}
        {previousSponsors.length > 0 && (
          <div>
            <div
              style={{
                textAlign: 'center',
                marginBottom: '28px',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  margin: 0,
                }}
              >
                Previous Sponsors
              </h3>
            </div>

            <div className="hs-sponsors-grid" data-testid="previous-sponsors-grid">
              {previousSponsors.map((sponsor, idx) => (
                <SponsorItemView
                  key={sponsor.id || `prev-${idx}`}
                  sponsor={sponsor}
                />
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </section>
  )
}
