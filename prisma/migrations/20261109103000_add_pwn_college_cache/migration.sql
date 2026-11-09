-- Cached, server-collected pwn.college data. This migration is additive: it
-- neither changes nor deletes registration/event data already in production.
CREATE TABLE IF NOT EXISTS "pwn_college_hackers" (
  "user_id" TEXT NOT NULL,
  "username" TEXT,
  "first_seen_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "last_seen_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "pwn_college_hackers_pkey" PRIMARY KEY ("user_id"),
  CONSTRAINT "pwn_college_hackers_user_id_not_blank" CHECK (length(trim("user_id")) > 0)
);

CREATE TABLE IF NOT EXISTS "pwn_college_scoreboard_entries" (
  "window_days" SMALLINT NOT NULL,
  "user_id" TEXT NOT NULL,
  "rank" INTEGER NOT NULL,
  "solves" INTEGER NOT NULL,
  "fetched_at" TIMESTAMPTZ NOT NULL,
  CONSTRAINT "pwn_college_scoreboard_entries_pkey" PRIMARY KEY ("window_days", "user_id"),
  CONSTRAINT "pwn_college_scoreboard_entries_hacker_fkey"
    FOREIGN KEY ("user_id") REFERENCES "pwn_college_hackers"("user_id") ON DELETE RESTRICT,
  CONSTRAINT "pwn_college_scoreboard_entries_window_days_valid"
    CHECK ("window_days" = 30),
  CONSTRAINT "pwn_college_scoreboard_entries_rank_positive" CHECK ("rank" > 0),
  CONSTRAINT "pwn_college_scoreboard_entries_solves_non_negative" CHECK ("solves" >= 0)
);

CREATE INDEX IF NOT EXISTS "pwn_college_scoreboard_entries_window_days_rank_idx"
  ON "pwn_college_scoreboard_entries"("window_days", "rank");

CREATE TABLE IF NOT EXISTS "pwn_college_solves" (
  "user_id" TEXT NOT NULL,
  "module" TEXT NOT NULL,
  "challenge" TEXT NOT NULL,
  "solved_at" TIMESTAMPTZ NOT NULL,
  "first_seen_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "pwn_college_solves_pkey" PRIMARY KEY ("user_id", "module", "challenge", "solved_at"),
  CONSTRAINT "pwn_college_solves_hacker_fkey"
    FOREIGN KEY ("user_id") REFERENCES "pwn_college_hackers"("user_id") ON DELETE RESTRICT,
  CONSTRAINT "pwn_college_solves_module_not_blank" CHECK (length(trim("module")) > 0),
  CONSTRAINT "pwn_college_solves_challenge_not_blank" CHECK (length(trim("challenge")) > 0)
);

CREATE INDEX IF NOT EXISTS "pwn_college_solves_solved_at_idx"
  ON "pwn_college_solves"("solved_at");

CREATE TABLE IF NOT EXISTS "pwn_college_sync_jobs" (
  "id" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "started_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "finished_at" TIMESTAMPTZ,
  "received_rows" INTEGER,
  "retained_rows" INTEGER,
  "error_code" TEXT,
  CONSTRAINT "pwn_college_sync_jobs_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "pwn_college_sync_jobs_source_valid" CHECK ("source" IN ('scoreboard', 'solves')),
  CONSTRAINT "pwn_college_sync_jobs_status_valid" CHECK ("status" IN ('RUNNING', 'SUCCEEDED', 'FAILED', 'REJECTED')),
  CONSTRAINT "pwn_college_sync_jobs_counts_non_negative"
    CHECK (("received_rows" IS NULL OR "received_rows" >= 0) AND ("retained_rows" IS NULL OR "retained_rows" >= 0))
);

CREATE INDEX IF NOT EXISTS "pwn_college_sync_jobs_source_started_at_idx"
  ON "pwn_college_sync_jobs"("source", "started_at" DESC);

-- A single database-backed lease prevents overlapping Cron/manual imports across
-- separate Vercel function instances. It contains no participant data.
CREATE TABLE IF NOT EXISTS "pwn_college_sync_locks" (
  "id" TEXT NOT NULL,
  "locked_at" TIMESTAMPTZ NOT NULL,
  CONSTRAINT "pwn_college_sync_locks_pkey" PRIMARY KEY ("id")
);
