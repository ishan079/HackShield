# HackShield

HackShield is the IIT Patna Cybersecurity Club web application. The repository contains a Next.js 16 frontend, native Next.js API routes for Vercel, an optional local Fastify runtime, Prisma/PostgreSQL persistence, an OpenAPI contract, and isolated frontend/API/backend/database tests.

## Current implementation

- Next.js App Router frontend with local fonts and packaged assets.
- Direct Mini CTF registration URL: `http://localhost:3000/ctf?type=mini&register=mini-14#registration-mini-14`.
- Native Next.js registration API routes for local and Vercel deployment.
- Optional Fastify registration API on port `5001` for independent backend testing.
- Prisma ORM schema and versioned migrations for PostgreSQL.
- Case-insensitive duplicate protection for institute email and pwn.college username.
- Contract, frontend, backend integration, and database repository tests.

The OpenAPI file describes the intended complete platform. At present, only the Mini CTF list and registration endpoints are implemented. See [Backend and API](./docs/BACKEND.md#implementation-status).

## Prerequisites

- Node.js 20.9 or newer. The current development machine uses Node 26.
- npm.
- PostgreSQL 16+, installed locally or run through Docker.

## First-time setup

```bash
npm install
cp .env.example .env
```

Start PostgreSQL using one option:

```bash
docker compose up -d postgres
# or, on macOS/Homebrew:
brew services start postgresql@16
```

Create the local `hackshield` role/database if using a fresh Homebrew server, then run:

```bash
npm run db:migrate
```

Start the full-stack application:

```bash
npm run dev
```

`npm run dev:server` remains available when testing Fastify independently.

Open [http://localhost:3000](http://localhost:3000).

## Environment

The backend uses `dotenv/config`, which reads `.env`. Next.js also reads `.env`. Local environment files are ignored by Git.

| Variable | Used by | Local value | Purpose |
| --- | --- | --- | --- |
| `DATABASE_URL` | Prisma CLI/app | local direct URL | PostgreSQL migrations and fallback application connection |
| `DATABASE_URL_POOLED` | Prisma app | empty locally | Preferred pooled connection for Vercel Functions |
| `HOST` | Fastify | `0.0.0.0` | Listen address |
| `PORT` | Fastify | `5001` | Backend port; avoids macOS AirPlay on `5000` |
| `LOG_LEVEL` | Fastify | `info` | Runtime log level |
| `NEXT_PUBLIC_API_URL` | Browser | `/api/v1` | Relative API prefix |
| `NEXT_PUBLIC_CTFD_URL` | Browser | CTFd origin | Future CTFd integration |
| `NEXT_PUBLIC_WHATSAPP_LINK` | Browser | invite URL | Community navigation |

The credentials in `.env.example` are local-development defaults only. Use secret-managed production credentials outside the repository.

## Quality checks

```bash
npm run test:frontend
npm run test:api-client
npm run test:contracts
npm run test:backend
npm run test:database
npm run test:registration
npm test
npm run typecheck
npm run build
npm audit
```

## Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [Frontend](./docs/FRONTEND.md)
- [Backend and API](./docs/BACKEND.md)
- [Database and pgAdmin](./docs/DATABASE.md)
- [Testing strategy](./docs/TESTING.md)
- [Operations and troubleshooting](./docs/OPERATIONS.md)
- [Implemented work and decisions](./docs/WORK_LOG.md)
- [OpenAPI contract](./contracts/openapi.yaml)

`BACKEND_README.md` remains as a compatibility pointer for existing links.

## Contribution rules

1. Update `contracts/openapi.yaml`, `types/api.ts`, and `lib/api.ts` together when changing a wire contract.
2. Add or update tests in every affected layer.
3. Never commit `.env`, credentials, CTFd tokens, flags, or production data.
4. Run the full quality check before opening a pull request.
5. Keep database constraints authoritative for integrity; UI validation exists for feedback, not security.
empty commit
another empty commit