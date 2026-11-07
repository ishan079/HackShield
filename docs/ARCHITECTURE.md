# Architecture

## Request flow

```text
Browser -> Next.js :3000 -> Route Handler -> Prisma Client -> PostgreSQL
```

The browser uses same-origin `/api/v1` endpoints implemented as App Router Route Handlers. Vercel deploys them as Node.js functions. The optional Fastify runtime reuses the same Prisma repository for isolated backend development.

## Repository map

| Path | Ownership |
| --- | --- |
| `app/` | Next.js routes and page-level UI |
| `components/` | Shared React components |
| `context/` | Theme state |
| `lib/api.ts` | Typed browser HTTP client and envelope validation |
| `types/api.ts` | Wire DTOs shared by client and server |
| `types/index.ts` | UI/domain display types |
| `server/app.ts` | Fastify routes, validation, and error mapping |
| `server/index.ts` | Backend lifecycle |
| `server/config.ts` | Environment validation/defaults |
| `lib/prisma.ts` | Pooled Prisma Client singleton |
| `prisma/` | Prisma schema and versioned migrations |
| `server/repositories/` | Prisma persistence and domain errors |
| `contracts/openapi.yaml` | Intended public API contract |
| `tests/frontend/` | React interaction tests |
| `tests/server/` | HTTP plus database integration tests |
| `tests/database/` | Repository-only tests |

## Contract ownership

Keep these synchronized: `contracts/openapi.yaml`, `types/api.ts`, `lib/api.ts`, `server/app.ts`, and their tests. OpenAPI includes planned endpoints; a route is live only when it exists in `server/app.ts` and has a server test.

## Runtime boundaries

- React never imports Prisma or PostgreSQL.
- Repositories never handle HTTP responses.
- Fastify maps validation/domain errors into stable envelopes.
- PostgreSQL constraints are the final integrity boundary.
- pwn.college ownership verification is deferred. Usernames are syntax-validated and duplicate-protected, but not remotely verified.

## Static assets

Fonts and site images are stored in `public/`; pages do not depend on external font/image CDNs. The favicon is `public/favicon.svg`. The stale `/logo.png` request was removed.
