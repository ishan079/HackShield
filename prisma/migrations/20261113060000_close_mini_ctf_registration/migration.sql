-- Close registrations for the live Mini CTF and extend the event through
-- 14 November 2026, 12:00 PM IST (06:30 UTC). This updates only event metadata;
-- participant registrations are intentionally preserved.
UPDATE "mini_sprints"
SET
  "registration_open" = FALSE,
  "status" = 'REGISTRATION_CLOSED',
  "status_color" = '#ef4444',
  "starts_at" = TIMESTAMPTZ '2026-11-10 06:30:00+00',
  "ends_at" = TIMESTAMPTZ '2026-11-14 06:30:00+00',
  "duration_minutes" = 5760,
  "updated_at" = NOW()
WHERE "id" = 'mini-14';
