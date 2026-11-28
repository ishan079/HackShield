CREATE TABLE "flagship_registrations" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "full_name" TEXT NOT NULL,
  "roll_number" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "semester" INTEGER NOT NULL,
  "mobile_number" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "email_normalized" TEXT NOT NULL,
  "ctfd_username" TEXT NOT NULL,
  "ctfd_username_normalized" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'REGISTERED',
  "registered_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "flagship_registrations_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "flagship_registrations_semester_check" CHECK ("semester" BETWEEN 1 AND 7)
);

CREATE UNIQUE INDEX "flagship_registrations_mobile_number_key"
  ON "flagship_registrations"("mobile_number");
CREATE UNIQUE INDEX "flagship_registrations_email_normalized_key"
  ON "flagship_registrations"("email_normalized");
CREATE UNIQUE INDEX "flagship_registrations_ctfd_username_normalized_key"
  ON "flagship_registrations"("ctfd_username_normalized");
