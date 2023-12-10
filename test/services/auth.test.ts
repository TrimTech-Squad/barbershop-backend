import AuthService from '../../src/services/auth'
import { describe, expect, it } from 'vitest'

describe('AuthService', () => {
  it('should return token', async () => {
    const token = await AuthService.login('nishi@gmail.com', '12345678')
    expect(token).toBeTypeOf('string')
  })
})
