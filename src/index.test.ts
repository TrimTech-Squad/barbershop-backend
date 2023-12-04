import { f } from './test'
import { describe, test, expect } from 'vitest'

describe('f function', () => {
  test('should do something', () => {
    const result = f()
    expect(result).toBe('f')
  })
})
