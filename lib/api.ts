/**
 * HackShield API Client Service
 * Typed fetch wrapper for communicating with the backend service.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1'

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
  timestamp?: string
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers || {}),
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    })

    const data: ApiResponse<T> = await res.json()
    return data
  } catch (err) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: err instanceof Error ? err.message : 'Unknown network error',
      },
      timestamp: new Date().toISOString(),
    }
  }
}

export const api = {
  // Mini CTF
  getMiniSprints: () => request('/ctf/mini-sprints', { method: 'GET' }),
  registerMiniSprint: (sprintId: string, payload: { email: string; pwnUsername: string }) =>
    request(`/ctf/mini-sprints/${sprintId}/register`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Flagship CTF
  getFlagshipStatus: () => request('/ctf/flagship/status', { method: 'GET' }),
  preRegisterFlagship: (payload: { teamName: string; email: string; membersCount: number }) =>
    request('/ctf/flagship/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Terminal Sandbox
  validateFlag: (flag: string) =>
    request('/terminal/validate-flag', {
      method: 'POST',
      body: JSON.stringify({ flag }),
    }),
  getChallenges: () => request('/terminal/challenges', { method: 'GET' }),

  // Stats
  getLiveStats: () => request('/stats/live', { method: 'GET' }),

  // Programs
  applyProgram: (payload: { programId: string; email: string; reason?: string }) =>
    request('/programs/apply', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Resources
  getResources: (params?: { category?: string; search?: string }) => {
    const query = new URLSearchParams()
    if (params?.category && params.category !== 'all') query.set('category', params.category)
    if (params?.search) query.set('search', params.search)
    const queryString = query.toString() ? `?${query.toString()}` : ''
    return request(`/resources${queryString}`, { method: 'GET' })
  },
}

