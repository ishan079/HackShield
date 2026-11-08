import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/context/ThemeContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import GrainOverlay from '@/components/GrainOverlay'
import MouseSpotlight from '@/components/MouseSpotlight'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: 'HackShield — IIT Patna | Cybersecurity Club & Community',
  description:
    'HackShield — Official Cybersecurity Club & Community at IIT Patna. Learn, compete in CTFs, build security tools, and defend together.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var theme = localStorage.getItem('hackshield-theme') || 'dark';
                document.documentElement.setAttribute('data-theme', theme);
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <div
            style={{
              position: 'relative',
              minHeight: '100vh',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              transition: 'background-color 0.35s ease, color 0.35s ease',
            }}
          >
            <GrainOverlay />
            <MouseSpotlight />
            <Navbar />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

