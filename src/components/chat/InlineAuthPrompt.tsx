import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { login, signup, validatePassword } from '@/api/auth'
import { ApiError } from '@/api/client'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'

type Mode = 'signup' | 'login'

/**
 * Inline (non-modal) sign-in/sign-up form shown in place of chat history for
 * anonymous visitors. Chatting itself never requires this — it only unlocks
 * saving and searching chats going forward. Signing in does not migrate the
 * conversation the visitor is currently having; that stays anonymous and is
 * purged like any other anonymous chat once it goes idle.
 */
export function InlineAuthPrompt() {
  const setSession = useAuthStore((s) => s.setSession)

  const [mode, setMode] = useState<Mode>('signup')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: async () => {
      if (mode === 'signup') {
        const passwordError = validatePassword(password)
        if (passwordError) throw new Error(passwordError)
      }
      const action = mode === 'signup' ? signup : login
      const token = await action({ username, password })
      return token
    },
    onSuccess: (token) => {
      setSession(token, username)
      setError(null)
    },
    onError: (err) => {
      setError(err instanceof ApiError ? err.displayMessage : err.message)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    mutation.mutate()
  }

  return (
    <div className="flex h-full flex-col justify-center gap-4 p-4">
      <div className="flex flex-col gap-1.5">
        <h2 className="font-heading text-lg font-semibold">
          Sign in to save & search your chats
        </h2>
        <p className="text-sm text-muted-foreground">
          Your current conversation stays anonymous — sign in to save future chats and search
          through them.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sidebar-auth-username">Username</Label>
          <Input
            id="sidebar-auth-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sidebar-auth-password">Password</Label>
          <Input
            id="sidebar-auth-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            required
          />
          {mode === 'signup' && (
            <p className="text-xs text-muted-foreground">
              8-32 characters, with an uppercase letter, a lowercase letter, and a special
              character.
            </p>
          )}
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" disabled={mutation.isPending} className="mt-1">
          {mutation.isPending ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Log in'}
        </Button>

        <button
          type="button"
          onClick={() => {
            setMode((m) => (m === 'signup' ? 'login' : 'signup'))
            setError(null)
          }}
          className={cn('text-sm text-muted-foreground underline-offset-4 hover:underline')}
        >
          {mode === 'signup' ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
        </button>
      </form>
    </div>
  )
}
