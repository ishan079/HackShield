import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js'

export default function nextConfig(phase) {
  return {
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
    reactStrictMode: true,
    devIndicators: false,
    async redirects() {
      return [
        {
          source: '/ctf',
          has: [
            {
              type: 'query',
              key: 'register',
              value: 'mini-14',
            },
          ],
          destination: '/ctf?type=mini',
          permanent: false,
        },
      ]
    },
  }
}
