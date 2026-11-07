# Operations and troubleshooting

## Local startup

```bash
brew services start postgresql@16 # or: docker compose up -d postgres
npm run db:migrate
npm run dev:server
```

In another terminal: `npm run dev`.

| Service | Port |
| --- | --- |
| Next.js | `3000` |
| Fastify | `5001` |
| PostgreSQL | `5432` |

macOS Control Center/AirPlay commonly occupies `5000`; this caused the original `EADDRINUSE`. Do not kill Control Center. The project intentionally uses `5001`.

## Common failures

### `EADDRINUSE`

```bash
lsof -nP -iTCP:5001 -sTCP:LISTEN
```

Stop only a recognized process, or change both `PORT` and `BACKEND_URL`.

### Registration network error

Confirm Fastify is running, `.env` has matching port/origin, Next was restarted after configuration changes, PostgreSQL is running, and migrations completed.

### Missing table/seed

Run `npm run db:migrate`.

### Next badge remains visible

Restart `npm run dev`; `devIndicators: false` is read at startup.

### pgAdmin blank pane

Expand the object tree; see [Database](./DATABASE.md#pgadmin).

## Production checklist

Use managed secrets, TLS/reverse proxy, versioned migrations, health checks, logs/metrics/alerts/backups, rate limits, abuse protection, restricted DB access, all quality checks, and a real PostgreSQL smoke test. Verify QR links against the production hostname.
