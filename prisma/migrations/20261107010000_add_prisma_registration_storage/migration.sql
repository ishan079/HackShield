-- Idempotent registration storage migration. It supports a new database and
-- the legacy schema created by server/migrations/001_initial.sql.
CREATE TABLE IF NOT EXISTS "mini_sprints" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "status" TEXT NOT NULL CHECK ("status" IN (
    'REGISTRATION_OPEN', 'REGISTRATION_OPENING_SOON', 'REGISTRATION_CLOSED', 'LIVE', 'COMPLETED'
  )),
  "status_color" TEXT NOT NULL,
  "starts_at" TIMESTAMPTZ NOT NULL,
  "ends_at" TIMESTAMPTZ NOT NULL,
  "duration_minutes" INTEGER NOT NULL CHECK ("duration_minutes" > 0),
  "challenge_count" INTEGER NOT NULL CHECK ("challenge_count" >= 0),
  "difficulty" TEXT NOT NULL CHECK ("difficulty" IN ('Beginner', 'Intermediate', 'Advanced', 'Mixed')),
  "format" TEXT NOT NULL CHECK ("format" IN ('Solo', 'Duos', 'Solo or Duos', 'Teams')),
  "reward" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "registration_open" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "mini_sprints_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "mini_sprints_ends_after_starts" CHECK ("ends_at" > "starts_at")
);

CREATE TABLE IF NOT EXISTS "mini_sprint_registrations" (
  "id" UUID NOT NULL,
  "sprint_id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "email_normalized" TEXT NOT NULL,
  "pwn_username" TEXT NOT NULL,
  "status" TEXT NOT NULL CHECK ("status" IN ('CONFIRMED', 'WAITLISTED')),
  "registered_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "mini_sprint_registrations_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "mini_sprint_registrations_sprint_id_fkey"
    FOREIGN KEY ("sprint_id") REFERENCES "mini_sprints"("id") ON DELETE CASCADE,
  CONSTRAINT "mini_sprint_registrations_sprint_id_email_normalized_key"
    UNIQUE ("sprint_id", "email_normalized"),
  CONSTRAINT "mini_sprint_registrations_sprint_id_pwn_username_key"
    UNIQUE ("sprint_id", "pwn_username")
);

CREATE INDEX IF NOT EXISTS "mini_sprints_starts_at_idx" ON "mini_sprints"("starts_at");
CREATE UNIQUE INDEX IF NOT EXISTS "mini_sprint_registrations_username_ci_idx"
  ON "mini_sprint_registrations"("sprint_id", lower("pwn_username"));

INSERT INTO "mini_sprints" (
  "id", "title", "status", "status_color", "starts_at", "ends_at",
  "duration_minutes", "challenge_count", "difficulty", "format", "reward",
  "description", "registration_open"
) VALUES (
  'mini-14',
  'Mini CTF #14: OAuth & Web Infiltration',
  'REGISTRATION_OPEN',
  '#10b981',
  '2026-11-14T12:30:00.000Z',
  '2026-11-14T15:30:00.000Z',
  180,
  6,
  'Intermediate',
  'Solo or Duos',
  '500 Club XP + Web Infiltrator Digital Badge',
  'Fast-paced sprint targeting OAuth redirect leaks, SSRF escalation, and JWT signature forgery.',
  true
)
ON CONFLICT ("id") DO NOTHING;
