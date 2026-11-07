# Database guide

## Runtime and connection

PostgreSQL 16+ is the system of record. Development uses Docker Compose or Homebrew. Production uses Prisma Postgres connected through Vercel. Prisma ORM 7.10.1 owns the schema, migrations, and queries.

```text
host: localhost
port: 5432
database: hackshield
user: hackshield
password: hackshield
```

These credentials are development-only.

## Schema

### `mini_sprints`

Stores display data and authoritative registration state. Constraints enforce valid status/difficulty/format values, positive duration, non-negative challenge count, and `ends_at > starts_at`. `001_initial.sql` idempotently seeds `mini-14`; rerunning it updates seeded metadata and registration state.

### `mini_sprint_registrations`

| Column | Meaning |
| --- | --- |
| `id uuid` | Server-generated registration ID |
| `sprint_id text` | Foreign key to `mini_sprints`, cascade delete |
| `email text` | Trimmed display value |
| `email_normalized text` | Lowercase uniqueness value |
| `pwn_username text` | Trimmed submitted username |
| `pwn_username_normalized text` | Lowercase uniqueness value |
| `status text` | `CONFIRMED` or `WAITLISTED` |
| `registered_at timestamptz` | Database timestamp |

Integrity uses unique `(sprint_id, email_normalized)`, unique `(sprint_id, pwn_username_normalized)`, a foreign key, and status checks.

## Migrations

The schema is declared in `prisma/schema.prisma`; committed migrations live in `prisma/migrations`. Use `migrate dev` only for local development and `migrate deploy` for production.

```bash
npm run db:migrate
npm run db:migrate:deploy
npm run db:studio
```

## pgAdmin

The development server is saved as `HackShield Local`:

```text
Servers -> HackShield Local -> Databases -> hackshield -> Schemas -> public -> Tables -> mini_sprint_registrations
```

Right-click the table and select **View/Edit Data -> All Rows**. Refresh after registration.

## Useful SQL

```sql
SELECT * FROM mini_sprints ORDER BY starts_at;
SELECT id, sprint_id, email, email_normalized, pwn_username, status, registered_at
FROM mini_sprint_registrations ORDER BY registered_at DESC;
```

Intentional development-only reset:

```sql
TRUNCATE TABLE mini_sprint_registrations RESTART IDENTITY;
```

Never run cleanup against a shared/production `DATABASE_URL`. Production also needs scheduled backups, restore drills, TLS, least-privilege roles, pooling/limits, monitoring, and retention policies.
