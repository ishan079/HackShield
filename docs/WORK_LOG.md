# Implemented work and decisions

This records current work so another developer can continue without reconstructing chat history.

## Git integration

- Merged `feature/api-contract-tests` and `feature/direct-registration-url` into `Hackshield-next-migrated`.
- Later work was committed directly to `Hackshield-next-migrated` at the owner's request; no new feature branches were created.

## Frontend/assets

- Added the QR-friendly direct Mini CTF registration URL and wired the form.
- Localized fonts/assets and removed stale `/logo.png` usage.
- Uses `public/favicon.svg` and packaged WOFF2 fonts.
- Fixed hard-refresh behavior and hid the Next development badge.
- Added validation, Enter submission, pending/success disabling, error retention/reset, and accessibility attributes.

## Contracts

- Added OpenAPI for nine intended operations, DTOs, typed client, and contract tests.
- Only Mini CTF list/registration are currently backed by Fastify; the rest are planned seams.

## Backend/database

- Scaffolded Fastify, Zod, `pg`, dotenv, shutdown handling, repository, migration, and PostgreSQL Compose.
- Implemented list/registration with normalized email and case-insensitive username uniqueness.
- Added stable envelopes for malformed JSON, validation, unknown/closed sprint, duplicates, and internal errors.
- Validated PostgreSQL 16, pgAdmin 4, local role/database, migrations, and live persistence on macOS.
- Personal live test values are intentionally omitted from documentation.

## Testing

- Split frontend, client, OpenAPI, backend, database, and registration suites.
- Added repository-only, Fastify+pg-mem, and frontend edge-case tests.
- Before documentation, verification passed 36 tests, type checking, build, and real migration.

## Decisions/limitations

- Backend uses `5001` because macOS AirPlay owns `5000` locally.
- pwn.college verification was investigated and explicitly deferred; do not imply usernames are verified.
- Migration execution replays one idempotent SQL file; adopt version tracking before schema growth.
- Pushes require repository-owner approval.
