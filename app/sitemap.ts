import type { MetadataRoute } from 'next'

function siteUrl(): string {
  return (process.env.SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')
}

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteUrl()

  return [
    { url: origin, changeFrequency: 'weekly', priority: 1 },
    { url: `${origin}/ctf`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${origin}/programs`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${origin}/resources`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${origin}/about`, changeFrequency: 'yearly', priority: 0.7 },
  ]
}
