import Link from 'next/link'

export default function RegisterPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '120px 24px 48px',
      }}
    >
      <section
        aria-labelledby="registration-status-heading"
        style={{
          width: 'min(100%, 580px)',
          padding: '40px',
          borderRadius: '24px',
          textAlign: 'center',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.2)',
        }}
      >
        <p
          style={{
            margin: '0 0 12px',
            color: 'var(--accent)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
          }}
        >
          REGISTRATION STATUS
        </p>
        <h1 id="registration-status-heading" style={{ margin: '0 0 16px' }}>
          No current event registrations are active.
        </h1>
        <p style={{ margin: '0 0 28px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Please check back when the next HackShield event is announced.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            padding: '12px 20px',
            borderRadius: '9999px',
            background: 'var(--accent)',
            color: '#ffffff',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          Return home
        </Link>
      </section>
    </main>
  )
}
