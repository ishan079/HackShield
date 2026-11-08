-- The original database migration created this column, but databases created
-- through the subsequent idempotent migration may not have it. Add and backfill
-- it without altering or discarding any existing registration data.
ALTER TABLE "mini_sprint_registrations"
  ADD COLUMN IF NOT EXISTS "pwn_username_normalized" TEXT;

UPDATE "mini_sprint_registrations"
SET "pwn_username_normalized" = lower(btrim("pwn_username"))
WHERE "pwn_username_normalized" IS NULL;

ALTER TABLE "mini_sprint_registrations"
  ALTER COLUMN "pwn_username_normalized" SET NOT NULL;
