/**
 * Contract-first HackShield API client.
 * The authoritative wire schema lives in contracts/openapi.yaml.
 */

import type {
  ApiFailure,
  ApiResponse,
  FlagshipRegistrationDto,
  FlagshipRegistrationRequest,
  FlagshipStatusDto,
  FlagValidationDto,
  LiveStatDto,
  MiniSprintDto,
  MiniSprintRegistrationDto,
  MiniSprintRegistrationRequest,
  ProgramApplicationDto,
  ProgramApplicationRequest,
  ResourceListDto,
  ResourceQuery,
  TerminalChallengeDto,
  ValidateFlagRequest,
} from '@/types/api'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1'

export const API_ENDPOINTS = {
  miniSprints: '/ctf/mini-sprints',
  miniSprintRegistration: (sprintId: string) =>
    `/ctf/mini-sprints/${encodeURIComponent(sprintId)}/register`,
  flagshipStatus: '/ctf/flagship/status',
  flagshipRegistration: '/ctf/flagship/register',
  validateFlag: '/terminal/validate-flag',
  terminalChallenges: '/terminal/challenges',
  liveStats: '/stats/live',
  programApplication: '/programs/apply',
  resources: '/resources',
} as const

function clientFailure(code: string, message: string): ApiFailure {
  return {
    success: false,
    error: { code, message },
    timestamp: new Date().toISOString(),
  }
}

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
  if (!value || typeof value !== 'object') return false

  const candidate = value as Record<string, unknown>
  if (typeof candidate.success !== 'boolean') return false
  if (typeof candidate.timestamp !== 'string') return false

  return candidate.success
    ? Object.prototype.hasOwnProperty.call(candidate, 'data')
    : Boolean(
        candidate.error &&
          typeof candidate.error === 'object' &&
          typeof (candidate.error as Record<string, unknown>).code === 'string' &&
          typeof (candidate.error as Record<string, unknown>).message === 'string'
      )
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      ...options,
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers || {}),
      },
    })

    let payload: unknown
    try {
      payload = await response.json()
    } catch {
      return clientFailure(
        'MALFORMED_RESPONSE',
        `API returned non-JSON content with HTTP ${response.status}`
      )
    }

    if (!isApiResponse(payload)) {
      return clientFailure(
        'CONTRACT_VIOLATION',
        'API response does not match the standard response envelope'
      )
    }

    if (!response.ok && payload.success) {
      return clientFailure(
        'HTTP_ERROR',
        `API returned HTTP ${response.status} with a success payload`
      )
    }

    return payload as ApiResponse<T>
  } catch (error) {
    return clientFailure(
      'NETWORK_ERROR',
      error instanceof Error ? error.message : 'Unknown network error'
    )
  }
}

export const api = {
  getMiniSprints: () =>
    request<MiniSprintDto[]>(API_ENDPOINTS.miniSprints, { method: 'GET' }),

  registerMiniSprint: (
    sprintId: string,
    payload: MiniSprintRegistrationRequest
  ) =>
    request<MiniSprintRegistrationDto>(
      API_ENDPOINTS.miniSprintRegistration(sprintId),
      { method: 'POST', body: JSON.stringify(payload) }
    ),

  getFlagshipStatus: () =>
    request<FlagshipStatusDto>(API_ENDPOINTS.flagshipStatus, { method: 'GET' }),

  preRegisterFlagship: (payload: FlagshipRegistrationRequest) =>
    request<FlagshipRegistrationDto>(API_ENDPOINTS.flagshipRegistration, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  validateFlag: (flag: string) =>
    request<FlagValidationDto>(API_ENDPOINTS.validateFlag, {
      method: 'POST',
      body: JSON.stringify({ flag } satisfies ValidateFlagRequest),
    }),

  getChallenges: () =>
    request<TerminalChallengeDto[]>(API_ENDPOINTS.terminalChallenges, {
      method: 'GET',
    }),

  getLiveStats: () =>
    request<LiveStatDto[]>(API_ENDPOINTS.liveStats, { method: 'GET' }),

  applyProgram: (payload: ProgramApplicationRequest) =>
    request<ProgramApplicationDto>(API_ENDPOINTS.programApplication, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getResources: (params: ResourceQuery = {}) => {
    const query = new URLSearchParams()
    if (params.category && params.category !== 'all') {
      query.set('category', params.category)
    }
    if (params.search?.trim()) query.set('search', params.search.trim())

    const queryString = query.size ? `?${query.toString()}` : ''
    return request<ResourceListDto>(`${API_ENDPOINTS.resources}${queryString}`, {
      method: 'GET',
    })
  },
}

export type { ApiResponse } from '@/types/api'
