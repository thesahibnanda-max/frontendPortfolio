import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SessionState {
  sessionId: string | null
  setSessionId: (sessionId: string) => void
}

/**
 * Anonymous-visitor session id, mirrored from the backend's `X-Session-Id`
 * response header and replayed as a request header on every call (see
 * `api/client.ts`). A header rather than a cookie: the frontend and backend
 * live on different registrable domains, and Safari/strict-mode Firefox
 * block third-party cookies by default regardless of SameSite/Secure —
 * a header stored in localStorage isn't subject to that restriction.
 */
export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      sessionId: null,
      setSessionId: (sessionId) => set({ sessionId }),
    }),
    { name: 'portfolio-session' },
  ),
)
