# Registration capacity and safeguards

Last reviewed: 2026-11-09 (IST)

## Current production diagnosis

- The live Mini CTF list endpoint returned `200` with `mini-14` open for registration.
- A deliberately invalid registration payload returned `422` before any database write.
- Valid registration attempts previously returned `500` because the repository writes
  `pwnUsernameNormalized`, while the Prisma schema did not define that column. The
  `20261109090000_add_pwn_username_normalized` migration adds and backfills the
  column without deleting or modifying any existing registration fields.
- No real or synthetic participant registration was submitted during diagnosis. A
  successful live end-to-end write must be performed only with an approved test
  registration after the deployment completes.

## Rate limits

The application has **no code-level rate limiter** on
`POST /api/v1/ctf/mini-sprints/:sprintId/register`. Frontend validation and the
disabled submit state improve usability, but they do not prevent scripted requests.

Before opening registration broadly, configure a Vercel WAF rate-limit rule for
that exact POST path. Use the Vercel dashboard to set the final threshold based on
the expected registration window and ensure a `429` is returned for excess traffic.
Record the selected threshold and its start date here after it is enabled.

| Layer | Verified limit / status | Where to monitor |
| --- | --- | --- |
| Application route | No rate limit currently enforced | Source code and route tests |
| Vercel WAF | Custom rules are available, but this project's dashboard configuration was not accessible during this review | Vercel project → Firewall |
| Vercel Hobby (if applicable) | 1,000,000 function invocations/month, 4 CPU-hours, 360 GB-hours provisioned memory | Vercel project → Usage |
| Prisma Postgres Free | 200,000 database operations/month, 2 GB storage per workspace, 10 pooled connections | Prisma Console → Usage |

Official references: [Vercel Hobby limits](https://vercel.com/docs/plans/hobby),
[Vercel WAF rate limiting](https://vercel.com/kb/guide/add-rate-limiting-vercel),
and [Prisma Postgres Free limits](https://www.prisma.io/postgres/free-postgresql-hosting).

## Registration capacity estimate

For a new accepted registration, the current route performs approximately three
database operations: load the sprint, check for duplicate email/username/mobile,
and create the registration. With no other traffic, the Prisma Free operation cap
therefore permits an upper-bound estimate of about **66,000 successful
registrations per calendar month** (`200,000 / 3`). Listing the sprint, duplicate
attempts, dashboard queries, and other application traffic all reduce that number.

The 2 GB storage cap is unlikely to be the first limit for normal text-only
registration rows; operation usage is the practical constraint. Do not treat the
estimate as a guaranteed capacity: confirm the current remaining operation and
storage usage in Prisma Console before the event.

## Required checks before the event

1. In Vercel Production environment variables, set `DATABASE_URL_POOLED` to the
   Prisma pooled connection URL. The direct `db.prisma.io` URL is intended for
   migrations and administrative tools, not concurrent application traffic.
2. Run the Prisma migration through the normal Vercel build and verify the
   deployment completed.
3. Configure and test a Vercel WAF rate-limit rule on the registration POST path.
4. Record the remaining Prisma operations/storage and Vercel usage immediately
   before registration opens, then monitor both during the event.
5. Keep an external backup. Prisma Postgres Free has no automatic backups.
6. Submit one approved, disposable end-to-end registration after deployment and
   verify it in the database through an authorised administrator tool.
