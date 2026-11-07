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
  // No-op stub for backward compatibility with isolated unit tests
}
