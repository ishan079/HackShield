# Prisma-backed Mini CTF registration handoff

This update is for a teammate moving forward from the commit immediately before
`9c623f1`. It covers only the Mini CTF registration workflow and persistence;
the scoreboard collector is intentionally not part of this branch.

## What changed

The live Fastify registration server now uses Prisma ORM for Mini CTF reads and
writes. A successful request to:

```text
POST /api/v1/ctf/mini-sprints/mini-14/register
```

validates the IIT Patna email and pwn.college username, then writes the
registration through `PrismaMiniSprintRepository` into the PostgreSQL database
named by `DATABASE_URL`.

`db.prisma.io` is a hosted PostgreSQL database. The old code could already
connect to it via the `pg` driver when given its URL; this update makes Prisma
the production server's actual database client and tracks the schema with a
Prisma migration.

The relevant pieces are:

- `server/index.ts` — starts the production API with the Prisma repository.
- `server/repositories/prisma-mini-sprint-repository.ts` — validation-safe
  Mini CTF reads and registration inserts through Prisma.
- `prisma/schema.prisma` — Mini CTF and registration models.
- `prisma/migrations/20261107010000_add_prisma_registration_storage/migration.sql`
  — the deployment migration.

The older `pg` repository remains only to keep the fast isolated database tests
working. It is not used by `server/index.ts` in the production path.

## Updating from the commit before `9c623f1`

Use the current `aditya_adep` branch, rather than copying files by hand:

```bash
git fetch origin
git switch aditya_adep
git pull --ff-only origin aditya_adep
npm ci
```

If the local clone has uncommitted work, inspect and preserve that work before
switching branches. Do not copy a `.env` file into Git.

## Configure the database

Create `.env` in the repository root. Set `DATABASE_URL` to the Prisma-hosted
PostgreSQL connection string supplied to the project. It is a server-only
variable and must never be prefixed with `NEXT_PUBLIC_`.

```dotenv
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/postgres?sslmode=require
BACKEND_URL=http://localhost:5001
HOST=0.0.0.0
PORT=5001
```

For a local setup, substitute a local PostgreSQL URL, for example:

```dotenv
DATABASE_URL=postgresql://hackshield:change-me@localhost:5432/hackshield
```

The same migration and code work for both hosted and local PostgreSQL.

## Apply the migration

Run these commands from the repository root:

```bash
npm run prisma:generate
npm run prisma:deploy
```

`npm run db:migrate` is kept as an alias for `prisma migrate deploy`, so the
older migration command also applies the Prisma migration after this update.

The migration is deliberately idempotent.

| Starting database state | Result of `npm run prisma:deploy` |
| --- | --- |
| Empty database | Creates `mini_sprints` and `mini_sprint_registrations`, indexes, constraints, and the `mini-14` registration row. |
| Existing functional registration database with no Prisma migration history | Leaves existing tables and registrations intact, does not overwrite the existing `mini-14` row, and records the migration in `_prisma_migrations`. |

The migration uses `CREATE ... IF NOT EXISTS` and `INSERT ... ON CONFLICT DO
NOTHING`; it does not delete registrations or replace event configuration.

## Run and verify locally

Start the API and the frontend in separate terminals:

```bash
npm run dev:server
npm run dev
```

Then use the Mini CTF registration form at the local site. The backend accepts
only `@iitp.ac.in` email addresses, validates the pwn username format, prevents
duplicate email/username registrations per sprint, and returns a safe error
instead of an unhandled database error.

Automated checks:

```bash
npm run test:registration
npm run typecheck
npm run build
```

## Verification completed for this update

- The migration was applied to the configured Prisma-hosted PostgreSQL
  database, and Prisma reports the database schema as up to date.
- A real Fastify registration request used the Prisma repository, returned HTTP
  201, and the inserted record was read back through Prisma inside a database
  transaction. That transaction was rolled back, so no verification participant
  remains in the database.
- The Prisma repository tests, registration-flow tests, TypeScript check, and
  production build pass.

## Deployment note

Before starting the API in any environment, run `npm run prisma:deploy` once
for that environment. The runtime server intentionally does not auto-run schema
migrations on startup; this keeps database changes explicit and reviewable.
