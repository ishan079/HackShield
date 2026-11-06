import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parse } from 'yaml'

const contract = parse(
  readFileSync(resolve(process.cwd(), 'contracts/openapi.yaml'), 'utf8')
) as {
  openapi: string
  paths: Record<string, Record<string, { operationId?: string; responses?: object }>>
}

const expectedOperations = new Map([
  ['GET /ctf/mini-sprints', 'listMiniSprints'],
  ['POST /ctf/mini-sprints/{sprintId}/register', 'registerMiniSprint'],
  ['GET /ctf/flagship/status', 'getFlagshipStatus'],
  ['POST /ctf/flagship/register', 'preRegisterFlagship'],
  ['POST /terminal/validate-flag', 'validateTerminalFlag'],
  ['GET /terminal/challenges', 'listTerminalChallenges'],
  ['GET /stats/live', 'getLiveStats'],
  ['POST /programs/apply', 'applyToProgram'],
  ['GET /resources', 'listResources'],
])

describe('OpenAPI contract', () => {
  it('uses OpenAPI 3.1', () => {
    expect(contract.openapi).toBe('3.1.0')
  })

  it('documents every frontend API operation exactly once', () => {
    const actual = new Map<string, string>()

    for (const [path, pathItem] of Object.entries(contract.paths)) {
      for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
        const operation = pathItem[method]
        if (operation?.operationId) {
          actual.set(`${method.toUpperCase()} ${path}`, operation.operationId)
        }
      }
    }

    expect(actual).toEqual(expectedOperations)
    expect(new Set(actual.values()).size).toBe(actual.size)
  })

  it('defines at least one successful response for every operation', () => {
    for (const pathItem of Object.values(contract.paths)) {
      for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
        const operation = pathItem[method]
        if (!operation?.operationId) continue

        expect(
          Object.keys(operation.responses ?? {}).some((status) => /^2\d\d$/.test(status)),
          `${operation.operationId} must define a 2xx response`
        ).toBe(true)
      }
    }
  })
})
