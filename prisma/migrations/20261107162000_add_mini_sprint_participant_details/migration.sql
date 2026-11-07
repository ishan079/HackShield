-- Participant details required for Mini CTF registration. Columns are nullable
-- so this migration remains safe for a database that already has registrations;
-- the API requires these values for every registration created after deployment.
ALTER TABLE "mini_sprint_registrations"
  ADD COLUMN IF NOT EXISTS "full_name" TEXT,
  ADD COLUMN IF NOT EXISTS "roll_number" TEXT,
  ADD COLUMN IF NOT EXISTS "subject" TEXT,
  ADD COLUMN IF NOT EXISTS "semester" SMALLINT,
  ADD COLUMN IF NOT EXISTS "mobile_number" TEXT;

ALTER TABLE "mini_sprint_registrations"
  ADD CONSTRAINT "mini_sprint_registrations_semester_range"
  CHECK ("semester" IS NULL OR "semester" BETWEEN 1 AND 7);
