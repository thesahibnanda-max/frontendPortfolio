import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { login, signup, validatePassword } from '@/api/auth'
import { ApiError } from '@/api/client'
import { useAuthStore } from '@/store/auth'
import { useChatUiStore } from '@/store/chatUi'
import { cn } from '@/lib/utils'

type Mode = 'signup' | 'login'

export function AuthGateModal({ onAuthenticated }: { onAuthenticated: () => void }) {
  const open = useChatUiStore((s) => s.authGateOpen)
  const closeAuthGate = useChatUiStore((s) => s.closeAuthGate)
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
      closeAuthGate()
      onAuthenticated()
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
    <Dialog open={open} onOpenChange={(next) => !next && closeAuthGate()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            {mode === 'signup' ? 'Create an account to chat' : 'Log back in'}
          </DialogTitle>
          <DialogDescription>
            Browsing the portfolio is always free — chatting with the AI needs a quick
            account so your conversation can be saved.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="auth-username">Username</Label>
            <Input
              id="auth-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="auth-password">Password</Label>
            <Input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              required
            />
            {mode === 'signup' && (
              <p className="text-xs text-muted-foreground">
                8-32 characters, with an uppercase letter, a lowercase letter, and a
                special character.
              </p>
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={mutation.isPending} className="mt-1">
            {mutation.isPending
              ? 'Please wait…'
              : mode === 'signup'
                ? 'Create account & send'
                : 'Log in & send'}
          </Button>

          <button
            type="button"
            onClick={() => {
              setMode((m) => (m === 'signup' ? 'login' : 'signup'))
              setError(null)
            }}
            className={cn('text-sm text-muted-foreground underline-offset-4 hover:underline')}
          >
            {mode === 'signup'
              ? 'Already have an account? Log in'
              : "Don't have an account? Sign up"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
