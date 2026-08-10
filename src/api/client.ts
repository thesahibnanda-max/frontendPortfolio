import { config } from '@/lib/config'
import { useAuthStore } from '@/store/auth'
import { useSessionStore } from '@/store/session'
import type { ApiErrorPayload } from './types'

/** Header the anonymous-visitor session id travels on, both ways. */
const X_SESSION_ID = 'X-Session-Id'

export class ApiError extends Error {
  readonly status: number
  readonly showMessageAsIs: boolean

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.errorMessage)
    this.status = status
    this.showMessageAsIs = payload.showMessageAsIs
  }

  get isRateLimited() {
    return this.status === 429
  }

  /** Message safe to show a user as-is; falls back to friendly copy otherwise. */
  get displayMessage() {
    if (this.showMessageAsIs) return this.message
    return this.isRateLimited
      ? "You're going a bit fast — try again in a moment."
      : 'Something went wrong on our end. Please try again shortly.'
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH'
  body?: unknown
  auth?: boolean
}

/** Response headers aren't JSON — callers that need one (e.g. X-Auth-Token) get it via `onHeaders`. */
interface RequestOptionsWithHeaders extends RequestOptions {
  onHeaders?: (headers: Headers) => void
}

async function request<T>(
  path: string,
  { method = 'GET', body, auth = false, onHeaders }: RequestOptionsWithHeaders = {},
): Promise<T> {
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (auth) {
    const token = useAuthStore.getState().token
    if (token) headers['X-Auth-Token'] = token
  }
  const sessionId = useSessionStore.getState().sessionId
  if (sessionId) headers[X_SESSION_ID] = sessionId

  const res = await fetch(`${config.apiBaseUrl}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const returnedSessionId = res.headers.get(X_SESSION_ID)
  if (returnedSessionId) useSessionStore.getState().setSessionId(returnedSessionId)

  onHeaders?.(res.headers)

  if (!res.ok) {
    const payload = (await res.json().catch(() => null)) as ApiErrorPayload | null
    throw new ApiError(
      res.status,
      payload ?? { showMessageAsIs: false, errorMessage: 'Unknown error' },
    )
  }

  if (res.status === 204) return undefined as T
  const text = await res.text()
  return (text ? JSON.parse(text) : undefined) as T
}

/**
 * POSTs like `request()`, but returns the raw `Response` instead of parsing
 * it as JSON, so the caller can read `response.body` as an SSE stream. Always
 * attaches the auth token when one exists — every caller of a streaming
 * endpoint needs it, the same way `sendMessage` calls the non-streaming
 * endpoint with `{ auth: true }` today — so there's no `auth` option here.
 * Skips `onHeaders` and the `204` short-circuit from `request()`: a streaming
 * response is never empty.
 */
async function requestStream(path: string, body: unknown): Promise<Response> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const token = useAuthStore.getState().token
  if (token) headers['X-Auth-Token'] = token
  const sessionId = useSessionStore.getState().sessionId
  if (sessionId) headers[X_SESSION_ID] = sessionId

  const res = await fetch(`${config.apiBaseUrl}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  const returnedSessionId = res.headers.get(X_SESSION_ID)
  if (returnedSessionId) useSessionStore.getState().setSessionId(returnedSessionId)

  if (!res.ok) {
    const payload = (await res.json().catch(() => null)) as ApiErrorPayload | null
    throw new ApiError(res.status, payload ?? { showMessageAsIs: false, errorMessage: 'Unknown error' })
  }
  return res
}

export const api = {
  get: <T>(path: string, opts?: Omit<RequestOptionsWithHeaders, 'method' | 'body'>) =>
    request<T>(path, { ...opts, method: 'GET' }),
  post: <T>(path: string, body?: unknown, opts?: Omit<RequestOptionsWithHeaders, 'method' | 'body'>) =>
    request<T>(path, { ...opts, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, opts?: Omit<RequestOptionsWithHeaders, 'method' | 'body'>) =>
    request<T>(path, { ...opts, method: 'PATCH', body }),
  stream: requestStream,
}
