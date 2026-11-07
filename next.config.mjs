import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js'

export default function nextConfig(phase) {
  return {
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? '.next-dev' : '.next',
    reactStrictMode: true,
    devIndicators: false,
    async redirects() {
      return [
        {
          source: '/register',
          destination: '/ctf?type=mini&register=mini-14#registration-mini-14',
          permanent: false,
        },
      ]
    },
  }
}
