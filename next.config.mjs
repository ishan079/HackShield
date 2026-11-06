import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js'

export default function nextConfig(phase) {
  return {
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
    reactStrictMode: true,
    async rewrites() {
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
      return [
        {
          source: '/api/:path*',
          destination: `${backendUrl}/api/:path*`,
        },
      ]
    },
  }
}
