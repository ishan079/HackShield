export interface QueryResult<T = any> {
  rows: T[]
  rowCount?: number | null
}

export interface Database {
  query<T = any>(
    text: string,
    values?: unknown[]
  ): Promise<QueryResult<T>>
}

export async function runMigrations(_database: Database): Promise<void> {
  // Prisma owns production migrations. This deliberately small, in-memory
  // schema keeps the legacy raw-SQL repository tests isolated from DATABASE_URL.
  await _database.query(`
    CREATE TABLE mini_sprints (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      status TEXT NOT NULL,
      status_color TEXT NOT NULL,
      starts_at TIMESTAMPTZ NOT NULL,
      ends_at TIMESTAMPTZ NOT NULL,
      duration_minutes INTEGER NOT NULL,
      challenge_count INTEGER NOT NULL,
      difficulty TEXT NOT NULL,
      format TEXT NOT NULL,
      reward TEXT NOT NULL,
      description TEXT NOT NULL,
      registration_open BOOLEAN NOT NULL,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    );
    CREATE TABLE mini_sprint_registrations (
      id UUID NOT NULL,
      sprint_id TEXT NOT NULL REFERENCES mini_sprints(id),
      full_name TEXT,
      roll_number TEXT,
      subject TEXT,
      semester SMALLINT,
      mobile_number TEXT,
      email TEXT NOT NULL,
      email_normalized TEXT PRIMARY KEY,
      pwn_username TEXT NOT NULL,
      status TEXT NOT NULL,
      registered_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    INSERT INTO mini_sprints (
      id, title, status, status_color, starts_at, ends_at, duration_minutes,
      challenge_count, difficulty, format, reward, description,
      registration_open, created_at, updated_at
    ) VALUES (
      'mini-14', 'Mini CTF #14: OAuth & Web Infiltration', 'REGISTRATION_OPEN', '#10b981',
      '2026-11-14T12:30:00.000Z', '2026-11-14T15:30:00.000Z', 180, 6,
      'Intermediate', 'Solo or Duos', '500 Club XP + Web Infiltrator Digital Badge',
      'Fast-paced sprint targeting OAuth redirect leaks, SSRF escalation, and JWT signature forgery.',
      true, now(), now()
    );
  `)
}
