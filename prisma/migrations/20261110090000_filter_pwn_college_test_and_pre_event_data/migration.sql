-- Remove only the explicitly identified test identities and solves from before
-- the Mini CTF start: 10 November 2026, 12:00 PM IST (06:30 UTC).
-- Registration records are intentionally untouched.

DELETE FROM "pwn_college_scoreboard_entries"
WHERE "user_id" IN (
  SELECT "user_id"
  FROM "pwn_college_hackers"
  WHERE lower(btrim("username")) IN ('fkcon', 'weowshaapsd', 'thisthingexists')
);

DELETE FROM "pwn_college_solves"
WHERE "solved_at" < TIMESTAMPTZ '2026-11-10 06:30:00+00';

DELETE FROM "pwn_college_solves"
WHERE "user_id" IN (
  SELECT "user_id"
  FROM "pwn_college_hackers"
  WHERE lower(btrim("username")) IN ('fkcon', 'weowshaapsd', 'thisthingexists')
);

DELETE FROM "pwn_college_hackers"
WHERE lower(btrim("username")) IN ('fkcon', 'weowshaapsd', 'thisthingexists');
