import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { z } from 'zod'
import AuthShell from '#/components/AuthShell'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { getSafeRedirectTarget, signIn } from '#/lib/auth-client'
import { getCurrentSession } from '#/lib/session'

const authSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/login')({
  validateSearch: (search) => authSearchSchema.parse(search),
  beforeLoad: async ({ search }) => {
    const session = await getCurrentSession()

    if (session) {
      throw redirect({
        to: getSafeRedirectTarget(search.redirect),
        replace: true,
      })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const search = Route.useSearch()
  const redirectTarget = useMemo(
    () => getSafeRedirectTarget(search.redirect),
    [search.redirect],
  )

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    const { error } = await signIn.email({
      email,
      password,
    })

    if (error) {
      setErrorMessage(error.message ?? 'Unable to sign in. Please check your credentials.')
      setIsSubmitting(false)
      return
    }

    window.location.assign(redirectTarget)
  }

  return (
    <AuthShell
      eyebrow="Welcome Back"
      title="Resume the money flow."
      description="Sign in to reach your private dashboard, optimizer, and authenticated receipt extraction workspace."
      footer={
        <>
          New to clrk?{' '}
          <Link
            to="/register"
            search={search.redirect ? { redirect: search.redirect } : undefined}
            className="font-medium text-foreground underline decoration-brand/40 underline-offset-4"
          >
            Create an account
          </Link>
        </>
      }
    >
      <div className="space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
          Sign In
        </p>
        <h2 className="font-display text-3xl font-bold text-foreground">Your dashboard is ready.</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Pick up where you left off and move straight into your protected finance workspace.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Email
          </Label>
          <Input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-12 rounded-2xl border-border/80 bg-background/40 px-4"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Password
          </Label>
          <Input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 rounded-2xl border-border/80 bg-background/40 px-4"
            placeholder="Enter your password"
          />
        </div>

        {errorMessage && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-full bg-brand font-mono text-xs font-bold uppercase tracking-[0.28em] text-brand-foreground hover:bg-brand/90"
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
    </AuthShell>
  )
}
