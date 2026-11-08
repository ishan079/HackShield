import {
  type PwnCollegeScoreboardRecord,
  type PwnCollegeScoreboardWindow,
  type PwnCollegeSolveRecord,
  PwnCollegeSourceError,
} from './contracts'

const DEFAULT_BASE_URL = 'https://pwn.college'
const DEFAULT_DOJO = 'hackshield-iitp~13f8a31b'

export interface PwnCollegeClientConfig {
  baseUrl: string
  dojo: string
  sessionCookie: string
  timeoutMs?: number
}

type FetchLike = typeof fetch

interface ScoreboardResponse {
  standings: unknown[]
  pages: unknown[]
}

function asNonBlankString(value: unknown, field: string, maximum = 512): string {
  if (typeof value !== 'string') {
    throw new PwnCollegeSourceError('INVALID_SCOREBOARD', `${field} must be a string.`)
  }
  const normalized = value.trim()
  if (!normalized || normalized.length > maximum) {
    throw new PwnCollegeSourceError('INVALID_SCOREBOARD', `${field} is invalid.`)
  }
  return normalized
}

function asPositiveInteger(value: unknown, field: string, minimum = 0): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < minimum) {
    throw new PwnCollegeSourceError('INVALID_SCOREBOARD', `${field} must be an integer.`)
  }
  return value
}

function parseScoreboardResponse(value: unknown): ScoreboardResponse {
  if (!value || typeof value !== 'object') {
    throw new PwnCollegeSourceError('INVALID_SCOREBOARD', 'Scoreboard response is not an object.')
  }
  const response = value as { standings?: unknown; pages?: unknown }
  if (!Array.isArray(response.standings) || !Array.isArray(response.pages)) {
    throw new PwnCollegeSourceError('INVALID_SCOREBOARD', 'Scoreboard response is missing standings or pages.')
  }
  return { standings: response.standings, pages: response.pages }
}

function parseScoreboardRecord(value: unknown): PwnCollegeScoreboardRecord {
  if (!value || typeof value !== 'object') {
    throw new PwnCollegeSourceError('INVALID_SCOREBOARD', 'Scoreboard row is not an object.')
  }
  const row = value as Record<string, unknown>
  const rawUserId = row.user_id
  const userId = typeof rawUserId === 'number' && Number.isSafeInteger(rawUserId)
    ? String(rawUserId)
    : asNonBlankString(rawUserId, 'user_id', 64)
  if (!/^\d+$/.test(userId)) {
    throw new PwnCollegeSourceError('INVALID_SCOREBOARD', 'user_id must contain digits only.')
  }
  return {
    userId,
    username: asNonBlankString(row.name, 'name', 128),
    rank: asPositiveInteger(row.rank, 'rank', 1),
    solves: asPositiveInteger(row.solves, 'solves'),
  }
}

function parsePageNumbers(value: unknown[]): number[] {
  if (!value.length) return [1]
  const pages = value.map((page) => asPositiveInteger(page, 'page', 1))
  if (!pages.includes(1) || new Set(pages).size !== pages.length) {
    throw new PwnCollegeSourceError('INVALID_SCOREBOARD', 'Scoreboard pagination is invalid.')
  }
  return pages.sort((left, right) => left - right)
}

export function parseSolvesCsv(csv: string): PwnCollegeSolveRecord[] {
  const rows: string[][] = [[]]
  let field = ''
  let quoted = false

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index]
    if (quoted) {
      if (char === '"') {
        if (csv[index + 1] === '"') {
          field += '"'
          index += 1
        } else {
          quoted = false
        }
      } else {
        field += char
      }
      continue
    }
    if (char === '"') {
      if (field) throw new PwnCollegeSourceError('INVALID_CSV', 'Unexpected quote in CSV.')
      quoted = true
    } else if (char === ',') {
      rows.at(-1)!.push(field)
      field = ''
    } else if (char === '\n') {
      rows.at(-1)!.push(field.replace(/\r$/, ''))
      rows.push([])
      field = ''
    } else {
      field += char
    }
  }
  if (quoted) throw new PwnCollegeSourceError('INVALID_CSV', 'Unclosed quote in CSV.')
  rows.at(-1)!.push(field.replace(/\r$/, ''))

  const populated = rows.filter((row) => row.some((cell) => cell.length > 0))
  const [header, ...dataRows] = populated
  if (!header || header.join(',') !== 'user_id,module,challenge,time') {
    throw new PwnCollegeSourceError('INVALID_CSV', 'Unexpected solves CSV header.')
  }
  const unique = new Map<string, PwnCollegeSolveRecord>()
  for (const row of dataRows) {
    if (row.length !== 4) throw new PwnCollegeSourceError('INVALID_CSV', 'Solves CSV row has the wrong column count.')
    const [rawUserId, rawModule, rawChallenge, rawTime] = row.map((cell) => cell.trim())
    if (!/^\d+$/.test(rawUserId) || !rawModule || !rawChallenge || rawModule.length > 512 || rawChallenge.length > 512) {
      throw new PwnCollegeSourceError('INVALID_CSV', 'Solves CSV row has invalid fields.')
    }
    const solvedAt = new Date(rawTime)
    if (Number.isNaN(solvedAt.valueOf())) {
      throw new PwnCollegeSourceError('INVALID_CSV', 'Solves CSV contains an invalid timestamp.')
    }
    const record = { userId: rawUserId, module: rawModule, challenge: rawChallenge, solvedAt }
    unique.set(`${record.userId}\u0000${record.module}\u0000${record.challenge}\u0000${record.solvedAt.toISOString()}`, record)
  }
  if (!unique.size) throw new PwnCollegeSourceError('EMPTY_SOLVES', 'Solves CSV contains no records.')
  return [...unique.values()]
}

export class PwnCollegeClient {
  private readonly timeoutMs: number

  constructor(
    private readonly config: PwnCollegeClientConfig,
    private readonly fetchImpl: FetchLike = fetch
  ) {
    this.timeoutMs = config.timeoutMs ?? 15_000
  }

  static fromEnvironment(): PwnCollegeClient {
    const sessionCookie = process.env.PWN_COLLEGE_SESSION_COOKIE?.trim()
    if (!sessionCookie) {
      throw new PwnCollegeSourceError('AUTHENTICATION_FAILED', 'PWN_COLLEGE_SESSION_COOKIE is not configured.')
    }
    return new PwnCollegeClient({
      baseUrl: DEFAULT_BASE_URL,
      dojo: process.env.PWN_COLLEGE_DOJO?.trim() || DEFAULT_DOJO,
      sessionCookie,
    })
  }

  private url(pathname: string): URL {
    return new URL(pathname, this.config.baseUrl)
  }

  private async request(url: URL, accept: string): Promise<Response> {
    let response: Response
    try {
      response = await this.fetchImpl(url, {
        headers: {
          Accept: accept,
          Cookie: this.config.sessionCookie,
        },
        signal: AbortSignal.timeout(this.timeoutMs),
      })
    } catch {
      throw new PwnCollegeSourceError('SOURCE_UNAVAILABLE', 'pwn.college could not be reached.')
    }
    if (response.status === 401 || response.status === 403 || response.status === 404) {
      throw new PwnCollegeSourceError('AUTHENTICATION_FAILED', 'pwn.college rejected the configured session.')
    }
    if (!response.ok) {
      throw new PwnCollegeSourceError('SOURCE_UNAVAILABLE', `pwn.college returned ${response.status}.`)
    }
    return response
  }

  private scoreboardUrl(windowDays: PwnCollegeScoreboardWindow, page: number): URL {
    return this.url(
      `/pwncollege_api/v1/scoreboard/${encodeURIComponent(this.config.dojo)}/_/${windowDays}/${page}`
    )
  }

  private async fetchScoreboardPage(windowDays: PwnCollegeScoreboardWindow, page: number): Promise<ScoreboardResponse> {
    const response = await this.request(this.scoreboardUrl(windowDays, page), 'application/json')
    let json: unknown
    try {
      json = await response.json()
    } catch {
      throw new PwnCollegeSourceError('INVALID_SCOREBOARD', 'Scoreboard response is not JSON.')
    }
    return parseScoreboardResponse(json)
  }

  async fetchScoreboard(windowDays: PwnCollegeScoreboardWindow): Promise<PwnCollegeScoreboardRecord[]> {
    const first = await this.fetchScoreboardPage(windowDays, 1)
    const pages = parsePageNumbers(first.pages)
    const payloads = [first]
    for (const page of pages.filter((page) => page !== 1)) {
      payloads.push(await this.fetchScoreboardPage(windowDays, page))
    }
    const records = payloads.flatMap((payload) => payload.standings.map(parseScoreboardRecord))
    if (!records.length) {
      throw new PwnCollegeSourceError('EMPTY_SCOREBOARD', 'Scoreboard response contains no records.')
    }
    const ids = new Set<string>()
    for (const record of records) {
      if (ids.has(record.userId)) {
        throw new PwnCollegeSourceError('INVALID_SCOREBOARD', 'Scoreboard response contains a duplicate user.')
      }
      ids.add(record.userId)
    }
    return records
  }

  private async findSolvesCsvUrl(): Promise<URL> {
    const adminUrl = this.url(`/dojo/${encodeURIComponent(this.config.dojo)}/admin/`)
    const response = await this.request(adminUrl, 'text/html')
    const html = await response.text()
    const solvesLink = [...html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
      .find((match) => /\bSolves\b/i.test(match[2]))
    if (!solvesLink) throw new PwnCollegeSourceError('AUTHENTICATION_FAILED', 'The admin solves export was not found.')
    const csvUrl = new URL(solvesLink[1], adminUrl)
    const expectedPrefix = `/dojo/${this.config.dojo}/solves/`
    if (csvUrl.origin !== adminUrl.origin || !csvUrl.pathname.startsWith(expectedPrefix) || !csvUrl.pathname.endsWith('/csv')) {
      throw new PwnCollegeSourceError('INVALID_CSV', 'Admin solves export URL is invalid.')
    }
    return csvUrl
  }

  async fetchSolves(): Promise<PwnCollegeSolveRecord[]> {
    const csvUrl = await this.findSolvesCsvUrl()
    const response = await this.request(csvUrl, 'text/csv')
    return parseSolvesCsv(await response.text())
  }
}
