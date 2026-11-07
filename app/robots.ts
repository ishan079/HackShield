import type { MetadataRoute } from 'next'

function siteUrl(): string {
  return (process.env.SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')
}

export default function robots(): MetadataRoute.Robots {
  const origin = siteUrl()

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${origin}/sitemap.xml`,
  }
}
