import { api, ApiError } from './client'
import type { UserGateRequest } from './types'

async function gate(path: '/signup' | '/login', credentials: UserGateRequest) {
  let token: string | null = null
  await api.post<Record<string, never>>(path, credentials, {
    onHeaders: (headers) => {
      token = headers.get('X-Auth-Token')
    },
  })
  if (!token) {
    throw new ApiError(500, {
      showMessageAsIs: false,
      errorMessage: 'Missing auth token in response',
    })
  }
  return token
}

export const signup = (credentials: UserGateRequest) => gate('/signup', credentials)
export const login = (credentials: UserGateRequest) => gate('/login', credentials)

// Mirrors ValidatorUtils on the backend: 8-32 chars, ASCII, needs upper/lower/special.
const PASSWORD_RULES = {
  minLength: 8,
  maxLength: 32,
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!-/:-@[-`{-~])[\x00-\x7F]{8,32}$/,
}

export function validatePassword(password: string): string | null {
  if (password.length < PASSWORD_RULES.minLength || password.length > PASSWORD_RULES.maxLength) {
    return 'Password must be 8-32 characters.'
  }
  if (!PASSWORD_RULES.pattern.test(password)) {
    return 'Password needs an uppercase letter, a lowercase letter, and a special character.'
  }
  return null
}
