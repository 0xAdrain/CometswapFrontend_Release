import { describe, it, expect } from 'vitest'
import { CORS_ALLOW, isOriginAllowed } from './index'

describe('worker-utils', () => {
  it.each([
    ['https://cometswap.finance', true],
    ['https://cometswap.com', true],
    ['https://aptoscometswap.finance', false],
    ['https://aptos.cometswap.finance', true],
    ['https://cometswap.finance.com', false],
    ['http://cometswap.finance', false],
    ['https://comet.run', false],
    ['https://test.comet.run', true],
    ['http://localhost:3000', true],
    ['http://localhost:3001', true],
  ])(`isOriginAllowed(%s)`, (origin, expected) => {
    expect(isOriginAllowed(origin, CORS_ALLOW)).toBe(expected)
  })
})
