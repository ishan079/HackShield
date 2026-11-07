-- Make email_normalized the primary key of mini_sprint_registrations
ALTER TABLE "mini_sprint_registrations" DROP CONSTRAINT IF EXISTS "mini_sprint_registrations_pkey";
ALTER TABLE "mini_sprint_registrations" ADD CONSTRAINT "mini_sprint_registrations_pkey" PRIMARY KEY ("email_normalized");

-- Ensure no dual entry for username and mobile number
CREATE UNIQUE INDEX IF NOT EXISTS "mini_sprint_registrations_sprint_id_mobile_number_key"
  ON "mini_sprint_registrations"("sprint_id", "mobile_number");

CREATE UNIQUE INDEX IF NOT EXISTS "mini_sprint_registrations_mobile_number_key"
  ON "mini_sprint_registrations"("mobile_number");

CREATE UNIQUE INDEX IF NOT EXISTS "mini_sprint_registrations_username_ci_idx"
  ON "mini_sprint_registrations"("sprint_id", lower("pwn_username"));
