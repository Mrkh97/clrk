import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { z } from 'zod'
import AuthShell from '#/components/AuthShell'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  getConfirmEmailCallbackURL,
  getConfirmEmailRedirectTarget,
  getSafeRedirectTarget,
  signUp,
} from '#/lib/auth-client'
import { getCurrentSession } from '#/lib/session'

const authSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/register')({
  validateSearch: (search) => authSearchSchema.parse(search),
  beforeLoad: async ({ search }) => {
    const session = await getCurrentSession()

    if (session) {
      if (!session.user.emailVerified) {
        throw redirect({
          href: getConfirmEmailRedirectTarget(search.redirect),
          replace: true,
        })
      }

      throw redirect({
        to: getSafeRedirectTarget(search.redirect),
        replace: true,
      })
    }
  },
  component: RegisterPage,
})

function RegisterPage() {
  const search = Route.useSearch()
  const redirectTarget = useMemo(
    () => getSafeRedirectTarget(search.redirect),
    [search.redirect],
  )

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    const { error } = await signUp.email({
      name,
      email,
      password,
      callbackURL: getConfirmEmailCallbackURL(redirectTarget),
    })

    if (error) {
      setErrorMessage(error.message ?? 'Unable to create your account right now.')
      setIsSubmitting(false)
      return
    }

    window.location.assign(getConfirmEmailRedirectTarget(redirectTarget))
  }

  return (
    <AuthShell
      eyebrow="Create Account"
      title="Open your private finance cockpit."
      description="Register once, then move directly into route-protected budgeting, optimization, and receipt review."
      footer={
        <>
          Already have an account?{' '}
          <Link
            to="/login"
            search={search.redirect ? { redirect: search.redirect } : undefined}
            className="font-medium text-foreground underline decoration-brand/40 underline-offset-4"
          >
            Sign in instead
          </Link>
        </>
      }
    >
      <div className="space-y-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
          Register
        </p>
        <h2 className="font-display text-3xl font-bold text-foreground">Start with a clean ledger.</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Create your account to unlock authenticated receipt extraction and the protected app workspace.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="space-y-2">
          <Label className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Name
          </Label>
          <Input
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-12 rounded-2xl border-border/80 bg-background/40 px-4"
            placeholder="Morgan Lee"
          />
        </div>

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
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-12 rounded-2xl border-border/80 bg-background/40 px-4"
            placeholder="Use at least 8 characters"
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
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </AuthShell>
  )
}
