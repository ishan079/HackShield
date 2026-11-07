import { afterEach, describe, expect, it } from 'vitest'
import robots from '@/app/robots'
import sitemap from '@/app/sitemap'

const originalSiteUrl = process.env.SITE_URL

afterEach(() => {
  if (originalSiteUrl === undefined) delete process.env.SITE_URL
  else process.env.SITE_URL = originalSiteUrl
})

describe('public sitemap metadata', () => {
  it('lists only canonical public routes at the configured origin', () => {
    process.env.SITE_URL = 'https://hackshield.example/'

    expect(sitemap().map((entry) => entry.url)).toEqual([
      'https://hackshield.example',
      'https://hackshield.example/ctf',
      'https://hackshield.example/programs',
      'https://hackshield.example/resources',
      'https://hackshield.example/about',
    ])
    expect(robots()).toMatchObject({ sitemap: 'https://hackshield.example/sitemap.xml' })
  })
})
