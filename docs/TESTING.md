# Testing strategy

Tests are separated so failures identify the responsible layer.

| Command | Boundary | Coverage |
| --- | --- | --- |
| `npm run test:frontend` | React with mocked API | Direct link, submit, success/error, required/invalid fields, Enter |
| `npm run test:api-client` | Client with mocked `fetch` | Declared calls and envelope/network failures |
| `npm run test:contracts` | OpenAPI | Operation IDs and endpoint inventory |
| `npm run test:backend` | Fastify inject + pg-mem | Validation, persistence, duplicates, state, malformed JSON |
| `npm run test:database` | Repository + pg-mem | Seed, normalization, uniqueness mapping |
| `npm run test:registration` | Registration across isolated layers | Frontend, backend, repository |
| `npm test` | All Vitest suites | Full automated suite |

`pg-mem` is fast but does not replace a real PostgreSQL smoke test. The real local flow was validated through Fastify/PostgreSQL 16 and the row was confirmed in the database.

## Pre-push verification

```bash
npm ci
npm test
npm run typecheck
npm run build
npm audit
git diff --check
```

Tests use synthetic data and fresh in-memory databases. They must never read `.env`, truncate a real database, or treat live registrations as fixtures.

## Feature test checklist

Add repository tests for SQL/constraints, server tests for validation/status/errors, client tests for URL/method/body/envelopes, frontend tests for pending/success/error/retry, and OpenAPI coverage. Include empty/whitespace values, formats, maximum lengths, unknown resources, duplicate/racing writes, closed state, malformed JSON, unavailable dependencies, and repeated UI actions.
