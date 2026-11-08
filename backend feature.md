# pwn.college backend feature

This feature collects and caches **only the 30-day HackShield IITP scoreboard** plus the private, admin-only solves CSV. It has no frontend component. The application serves cached data; it never makes a browser or pwn.college request while rendering a page.

## Configuration

All values are server-only. Set them in the Vercel environment and local `.env`; never use a `NEXT_PUBLIC_` name or commit an actual value.

| Variable | Purpose |
| --- | --- |
| `PWN_COLLEGE_SESSION_COOKIE` | Complete Cookie header from an authorized pwn.college dojo-admin session. Required for collection. |
| `PWN_COLLEGE_DOJO` | Optional dojo slug; defaults to `hackshield-iitp~13f8a31b`. |
| `PWN_COLLEGE_SYNC_TOKEN` | Required bearer token for the internal synchronization endpoint. `CRON_SECRET` is accepted instead for a Vercel Cron. |

The collector reads the authenticated dojo admin page each time to discover the current solves-CSV link. The capability URL is deliberately not stored in Git, the database, logs, or a public response.

## Stored data

The migration `20261108093000_add_pwn_college_cache` is additive. It creates four new tables and does not alter, delete, or migrate any registration data.

| Table | Data |
| --- | --- |
| `pwn_college_hackers` | `user_id` → latest known `username` translation, with first/last-seen timestamps. A username can be absent when a user appears only in the private CSV. |
| `pwn_college_scoreboard_entries` | Current 30-day cache: user ID, rank, solve count, fetch time. The primary key is `(window_days, user_id)`; only `window_days = 30` is allowed. |
| `pwn_college_solves` | Append-only admin CSV records: user ID, module, challenge, and solve time. The composite primary key prevents duplicate imports. |
| `pwn_college_sync_jobs` | One audit row per scoreboard/solves attempt: source, status, timestamps, row counts, and a safe error code. No session, CSV URL, raw response, or participant payload is saved. |

The scoreboard cache joins through `pwn_college_hackers`, so frontend/server consumers can obtain `userId` and `username` together. Solves can be joined to the same table when a translation has appeared on the scoreboard.

## API surface

### Read cached scoreboard

`GET /api/v1/ctf/pwn-college/scoreboard`

This is the frontend-safe, cached 30-day scoreboard. It returns the usual success envelope with:

```json
{
  "windowDays": 30,
  "lastFetchedAt": "2026-11-08T09:00:00.000Z",
  "entries": [
    {
      "windowDays": 30,
      "userId": "123456",
      "username": "example-hacker",
      "rank": 1,
      "solves": 12,
      "fetchedAt": "2026-11-08T09:00:00.000Z"
    }
  ]
}
```

An empty `entries` list with `lastFetchedAt: null` means no successful scoreboard synchronization has completed yet.

### Run a synchronization

`POST /api/v1/internal/pwn-college/sync`

Send `Authorization: Bearer <PWN_COLLEGE_SYNC_TOKEN>` (or the configured `CRON_SECRET`). This endpoint is for an internal job/Vercel Cron only; it is not a browser-facing endpoint. It returns source-level status and counts, never participant records or credentials.

The admin solves data intentionally has **no public API endpoint**. It is admin-only at the source, so any future UI that needs it must be behind the project’s real organizer authentication and should use a dedicated, authorized server route or repository method.

## Safety and failure behavior

- The 30-day scoreboard is fetched page-by-page and fully validated before the database transaction starts.
- Missing arrays, malformed rows, duplicate users, invalid pagination, network failures, unauthenticated responses, and empty scoreboard payloads are rejected. The last known good cache is not deleted or replaced.
- The solves CSV must have exactly `user_id,module,challenge,time`, valid timestamps, and at least one valid record. CSV quoting is parsed safely.
- Solves are append-only. A CSV with fewer rows than the existing cache is rejected as incomplete; no existing solve is removed.
- Scoreboard and solves are synchronized independently. A failure in one source does not overwrite or invalidate the other source’s last good data.
- Every failure is represented by a safe code in `pwn_college_sync_jobs`; secrets and raw source bodies are never persisted.

## Deployment and verification

1. Review the generated SQL migration.
2. Apply it to a non-production PostgreSQL database first with `npm run db:migrate:deploy`.
3. Run the collector using that non-production database and confirm the cached rows/counts.
4. Run `npm test`, `npm run typecheck`, `npm run build`, and `git diff --check`.
5. Only then apply the same committed additive migration to production through the existing Vercel deploy process.

Do not run `prisma migrate dev`, reset commands, or cleanup SQL against the production database.
