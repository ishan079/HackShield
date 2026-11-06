import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from 'pg'

export interface Database {
  query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    values?: unknown[]
  ): Promise<QueryResult<T>>
}

export function createDatabase(connectionString: string): Pool {
  return new Pool({ connectionString })
}

export async function runMigrations(database: Database): Promise<void> {
  const sql = await readFile(
    resolve(process.cwd(), 'server/migrations/001_initial.sql'),
    'utf8'
  )
  await database.query(sql)
}

export async function closeDatabase(database: Database): Promise<void> {
  const closable = database as Database & {
    end?: () => Promise<void>
    release?: PoolClient['release']
  }
  if (closable.end) await closable.end()
  else closable.release?.()
}
