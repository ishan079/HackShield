CREATE TABLE IF NOT EXISTS mini_sprints (
  id text PRIMARY KEY,
  title text NOT NULL,
  status text NOT NULL CHECK (status IN (
    'REGISTRATION_OPEN',
    'REGISTRATION_OPENING_SOON',
    'REGISTRATION_CLOSED',
    'LIVE',
    'COMPLETED'
  )),
  status_color text NOT NULL,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  duration_minutes integer NOT NULL CHECK (duration_minutes > 0),
  challenge_count integer NOT NULL CHECK (challenge_count >= 0),
  difficulty text NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'Mixed')),
  format text NOT NULL CHECK (format IN ('Solo', 'Duos', 'Solo or Duos', 'Teams')),
  reward text NOT NULL,
  description text NOT NULL,
  registration_open boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at)
);

CREATE TABLE IF NOT EXISTS mini_sprint_registrations (
  id uuid PRIMARY KEY,
  sprint_id text NOT NULL REFERENCES mini_sprints(id) ON DELETE CASCADE,
  email text NOT NULL,
  email_normalized text NOT NULL,
  pwn_username text NOT NULL,
  status text NOT NULL CHECK (status IN ('CONFIRMED', 'WAITLISTED')),
  registered_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (sprint_id, email_normalized),
  UNIQUE (sprint_id, pwn_username)
);

CREATE INDEX IF NOT EXISTS mini_sprints_starts_at_idx
  ON mini_sprints (starts_at);

CREATE UNIQUE INDEX IF NOT EXISTS mini_sprint_registrations_username_ci_idx
  ON mini_sprint_registrations (sprint_id, lower(pwn_username));

INSERT INTO mini_sprints (
  id,
  title,
  status,
  status_color,
  starts_at,
  ends_at,
  duration_minutes,
  challenge_count,
  difficulty,
  format,
  reward,
  description,
  registration_open
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
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  status = EXCLUDED.status,
  status_color = EXCLUDED.status_color,
  starts_at = EXCLUDED.starts_at,
  ends_at = EXCLUDED.ends_at,
  duration_minutes = EXCLUDED.duration_minutes,
  challenge_count = EXCLUDED.challenge_count,
  difficulty = EXCLUDED.difficulty,
  format = EXCLUDED.format,
  reward = EXCLUDED.reward,
  description = EXCLUDED.description,
  registration_open = EXCLUDED.registration_open,
  updated_at = now();
