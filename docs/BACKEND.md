# Backend and API guide

## Stack and lifecycle

The backend is TypeScript Fastify using `pg`, Zod, and SQL migrations. `server/index.ts` loads configuration, opens the pool, runs migrations, creates the app, listens on `HOST:PORT`, and closes HTTP/database resources on `SIGINT`/`SIGTERM`.

```bash
npm run dev:server
npm run start:server
npm run db:migrate
```

## Implementation status

| Method/path | Status | Persistence |
| --- | --- | --- |
| `GET /api/v1/ctf/mini-sprints` | Implemented | `mini_sprints` |
| `POST /api/v1/ctf/mini-sprints/:sprintId/register` | Implemented | `mini_sprint_registrations` |
| `GET /api/v1/ctf/flagship/status` | Contract only | Not implemented |
| `POST /api/v1/ctf/flagship/register` | Contract only | Not implemented |
| `GET /api/v1/terminal/challenges` | Contract only | Not implemented |
| `POST /api/v1/terminal/validate-flag` | Contract only | Not implemented |
| `GET /api/v1/stats/live` | Contract only | Not implemented |
| `POST /api/v1/programs/apply` | Contract only | Not implemented |
| `GET /api/v1/resources` | Contract only | Not implemented |

Contract-only routes currently return the standard `404 NOT_FOUND` envelope.

## Standard envelope

```json
{"success":true,"data":{},"timestamp":"2026-11-07T00:00:00.000Z"}
```

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid.",
    "details": [{"field":"email","issue":"Invalid email address"}]
  },
  "timestamp": "2026-11-07T00:00:00.000Z"
}
```

## Registration rules

- Sprint ID matches `mini-[a-zA-Z0-9-]+`.
- Bodies are strict; unknown keys are rejected.
- Email is trimmed, valid, and ends in `@iitp.ac.in`.
- Username is trimmed, 2–64 characters, `[A-Za-z0-9_.-]`.
- Sprint existence and `registration_open` are checked server-side.
- Duplicate email/username maps to `409 ALREADY_REGISTERED`.
- Malformed JSON maps to `400 INVALID_REQUEST`.
- Validation maps to `422 VALIDATION_ERROR` with field details.
- Unknown sprint maps to `404 SPRINT_NOT_FOUND`.
- Closed sprint maps to `409 REGISTRATION_CLOSED`.
- Unexpected errors map to `500 INTERNAL_ERROR` without internals.

## Implemented response codes

| Code | Meaning |
| --- | --- |
| `200` | Sprint list returned |
| `201` | Registration created |
| `400` | Malformed JSON |
| `404` | Unknown endpoint/sprint |
| `409` | Duplicate or closed registration |
| `422` | Invalid params/body |
| `500` | Unexpected failure |

## Adding an endpoint

1. Specify OpenAPI schemas/examples.
2. Add DTOs in `types/api.ts`.
3. Add repository methods and database constraints.
4. Add Zod validation and route/error mapping.
5. Add repository, HTTP, client, and UI tests.
6. Never expose database errors, stack traces, tokens, or CTF flags.

## Production gaps

Before public deployment, add rate limiting, request IDs/audit logs, CSRF/origin policy for authenticated writes, secret management, observability, backups, migration version tracking, and explicit CORS if bypassing Next. pwn.college identity verification is not present.
