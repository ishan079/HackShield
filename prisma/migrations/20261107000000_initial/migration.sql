CREATE TYPE "SprintStatus" AS ENUM ('REGISTRATION_OPEN', 'REGISTRATION_OPENING_SOON', 'REGISTRATION_CLOSED', 'LIVE', 'COMPLETED');
CREATE TYPE "RegistrationStatus" AS ENUM ('CONFIRMED', 'WAITLISTED');

CREATE TABLE "mini_sprints" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "status" "SprintStatus" NOT NULL,
  "status_color" TEXT NOT NULL,
  "starts_at" TIMESTAMPTZ(3) NOT NULL,
  "ends_at" TIMESTAMPTZ(3) NOT NULL,
  "duration_minutes" INTEGER NOT NULL,
  "challenge_count" INTEGER NOT NULL,
  "difficulty" TEXT NOT NULL,
  "format" TEXT NOT NULL,
  "reward" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "registration_open" BOOLEAN NOT NULL DEFAULT false,
  "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMPTZ(3) NOT NULL,
  CONSTRAINT "mini_sprints_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "mini_sprints_duration_check" CHECK ("duration_minutes" > 0),
  CONSTRAINT "mini_sprints_challenge_check" CHECK ("challenge_count" >= 0),
  CONSTRAINT "mini_sprints_dates_check" CHECK ("ends_at" > "starts_at")
);

CREATE TABLE "mini_sprint_registrations" (
  "id" UUID NOT NULL,
  "sprint_id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "email_normalized" TEXT NOT NULL,
  "pwn_username" TEXT NOT NULL,
  "pwn_username_normalized" TEXT NOT NULL,
  "status" "RegistrationStatus" NOT NULL DEFAULT 'CONFIRMED',
  "registered_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "mini_sprint_registrations_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "mini_sprints_starts_at_idx" ON "mini_sprints"("starts_at");
CREATE UNIQUE INDEX "mini_sprint_registrations_sprint_id_email_normalized_key" ON "mini_sprint_registrations"("sprint_id", "email_normalized");
CREATE UNIQUE INDEX "mini_sprint_registrations_sprint_id_pwn_username_normalized_key" ON "mini_sprint_registrations"("sprint_id", "pwn_username_normalized");

ALTER TABLE "mini_sprint_registrations" ADD CONSTRAINT "mini_sprint_registrations_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "mini_sprints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "mini_sprints" (
  "id", "title", "status", "status_color", "starts_at", "ends_at",
  "duration_minutes", "challenge_count", "difficulty", "format", "reward",
  "description", "registration_open", "updated_at"
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
  true,
  CURRENT_TIMESTAMP
);
