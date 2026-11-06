# HackShield Backend Integration Guide

This repository is contract-first. Backend services can be implemented in any
language as long as they satisfy the shared HTTP contract.

## Sources of truth

1. [`contracts/openapi.yaml`](./contracts/openapi.yaml) defines routes, methods,
   validation rules, status codes, request bodies, and response schemas.
2. [`types/api.ts`](./types/api.ts) contains the matching frontend DTOs.
3. [`lib/api.ts`](./lib/api.ts) is the frontend HTTP client.
4. [`tests/api.contract.test.ts`](./tests/api.contract.test.ts) verifies every
   request produced by the client.
5. [`tests/openapi.contract.test.ts`](./tests/openapi.contract.test.ts) prevents
   undocumented or duplicate operations.

If prose and the OpenAPI document disagree, the OpenAPI document wins.

## Frontend scan summary

The current UI is a static prototype. It already exposes nine backend seams,
but its page data is still hardcoded and its submit buttons are not yet wired to
the client. This separation lets backend work begin independently while the UI
is integrated incrementally.

| Method and path | Frontend consumer | Current UI state | Backend responsibility |
| --- | --- | --- | --- |
| `GET /api/v1/ctf/mini-sprints` | `app/ctf/page.tsx` | Hardcoded sprint card | Return scheduled sprints and registration state |
| `POST /api/v1/ctf/mini-sprints/{sprintId}/register` | Mini CTF registration card | Form visible, submit disabled | Validate IITP email, prevent duplicates, create registration |
| `GET /api/v1/ctf/flagship/status` | Flagship CTF tab | Hardcoded countdown | Return server time and authoritative event windows |
| `POST /api/v1/ctf/flagship/register` | Future flagship form | Not yet rendered | Validate team size and create pre-registration |
| `GET /api/v1/terminal/challenges` | `components/InteractiveTerminal.tsx` | Hardcoded challenge | Return public challenge text without flags/solutions |
| `POST /api/v1/terminal/validate-flag` | Interactive terminal | Local simulated decrypt | Rate-limit and compare flags server-side |
| `GET /api/v1/stats/live` | `components/StatsSection.tsx` | Hardcoded counters | Return non-negative display metrics |
| `POST /api/v1/programs/apply` | `app/programs/page.tsx` | Links to WhatsApp | Validate and persist program applications |
| `GET /api/v1/resources` | `app/resources/page.tsx` | Hardcoded catalog/filtering | Search and filter public resource DTOs |

## Standard response envelope

Every response, including errors, must be JSON.

Successful response:

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-11-07T02:40:00.000Z"
}
```

Failed response:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid.",
    "details": [{ "field": "email", "issue": "Must be a valid email." }]
  },
  "timestamp": "2026-11-07T02:40:00.000Z"
}
```

The frontend treats missing `success`, missing `timestamp`, non-JSON bodies, or
an HTTP error carrying a success envelope as contract violations.

## HTTP behavior

- `200`: successful reads and flag validation.
- `201`: registration or application created.
- `404`: path entity such as a sprint does not exist.
- `409`: duplicate registration/application or conflicting state.
- `422`: field validation failure.
- `429`: rate limit; include a numeric `Retry-After` header.
- `500`: unexpected server failure; never expose stack traces or secrets.
- Incorrect flags return `200` with `data.correct: false`; transport success and
  challenge correctness are separate concepts.
- All timestamps use UTC ISO-8601 strings.
- Unknown request fields are rejected by the contract.

## Gateway and environment

The browser defaults to `/api/v1`. Next.js proxies `/api/*` to `BACKEND_URL`, so
local development avoids CORS:

```text
Browser -> http://localhost:3000/api/v1/*
Next.js rewrite -> http://localhost:5000/api/v1/*
```

Create local configuration with:

```bash
cp .env.example .env.local
```

| Variable | Scope | Default/example |
| --- | --- | --- |
| `BACKEND_URL` | Next.js server | `http://localhost:5000` |
| `NEXT_PUBLIC_API_URL` | Browser client | `/api/v1` |
| `NEXT_PUBLIC_CTFD_URL` | Browser metadata | `https://ctf.iitp.ac.in` |
| `NEXT_PUBLIC_WHATSAPP_LINK` | Browser navigation | Community invite URL |

If the frontend calls the backend directly instead of using the rewrite, allow
only known frontend origins and credentials. Prefer HttpOnly, Secure,
SameSite cookies over browser-readable tokens.

## Backend implementation order

1. Implement the standard envelope and global error middleware.
2. Implement read-only endpoints: sprints, flagship status, challenges, stats,
   and resources.
3. Implement writes with database uniqueness constraints and idempotent
   duplicate handling.
4. Add rate limiting to registrations, applications, and flag validation.
5. Integrate CTFd behind the backend; never expose its service token to the
   browser.
6. Run backend OpenAPI/schema tests, then run this repository's frontend
   contract suite against the final client behavior.

## Database requirement: PostgreSQL

Use PostgreSQL 16 or newer as the backend system of record. The backend should
own migrations and expose data only through the API contract; the frontend must
never connect to PostgreSQL directly.

Initial relational boundaries:

- `mini_sprints` and `mini_sprint_registrations`
- `flagship_events`, `flagship_teams`, and `flagship_registrations`
- `programs` and `program_applications`
- `terminal_challenges` and rate-limited `flag_attempts`
- `resources`
- materialized or cached community statistics derived from authoritative tables

Enforce unique registration/application rules with database constraints, use
UTC `timestamptz` columns, and store normalized emails separately from display
values. Add the language-specific PostgreSQL driver and migration tool only when
the backend runtime is scaffolded; remove superseded drivers if the runtime or
ORM changes.

The runtime is scaffolded in `server/` with Fastify, `pg`, Zod validation, and
SQL migrations. Start the database with Docker when available:

```bash
docker compose up -d postgres
npm run db:migrate
npm run dev:server
```

Without Docker, point `DATABASE_URL` at any PostgreSQL 16+ instance. The server
runs migrations at startup, so a newly created database is immediately ready.

## Frontend verification

```bash
npm test
npm run typecheck
npm run build
```

The suite includes transport mocks, frontend interaction tests, and backend
route integration tests backed by an in-process PostgreSQL-compatible engine.
For a real end-to-end run, start PostgreSQL and both application processes.

## Security requirements

- Store no CTFd tokens, database credentials, or flag solutions in client code.
- Normalize emails to lowercase before uniqueness checks.
- Enforce registration windows server-side, regardless of button state.
- Use database constraints for duplicate registrations and applications.
- Compare flags in constant time where practical and log attempts without
  recording submitted secrets in plaintext.
- Validate outbound resource URLs before publishing them.
- Return stable machine-readable error codes; UI copy can change independently.
