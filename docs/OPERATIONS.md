# Operations and troubleshooting

## Local startup

```bash
brew services start postgresql@16 # or: docker compose up -d postgres
npm run db:migrate
npm run dev
```

In another terminal: `npm run dev`.

| Service | Port |
| --- | --- |
| Next.js | `3000` |
| Fastify (optional) | `5001` |
| PostgreSQL | `5432` |

macOS Control Center/AirPlay commonly occupies `5000`; this caused the original `EADDRINUSE`. Do not kill Control Center. The project intentionally uses `5001`.

## Common failures

### `EADDRINUSE`

```bash
lsof -nP -iTCP:5001 -sTCP:LISTEN
```

Stop only a recognized process, or change `PORT` for the optional Fastify runtime.

### Registration network error

Confirm Next.js is running, PostgreSQL is running, `DATABASE_URL` is valid, and migrations completed.

### Missing table/seed

Run `npm run db:migrate`.

### Next badge remains visible

Restart `npm run dev`; `devIndicators: false` is read at startup.

### pgAdmin blank pane

Expand the object tree; see [Database](./DATABASE.md#pgadmin).

## Production checklist

Connect Prisma Postgres through Vercel, use the pooled URL for application traffic, run `npm run db:migrate:deploy` with the direct URL, and verify logs/backups/rate limits plus a production registration smoke test. Verify QR links against the production hostname.
