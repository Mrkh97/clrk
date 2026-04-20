import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useForm, useStore } from '@tanstack/react-form'
import { useMemo, useState } from 'react'
import { z } from 'zod'
import AuthShell from '#/components/AuthShell'
import { Button } from '#/components/ui/button'
import { Field, FieldError, FieldLabel, getFieldErrorText, isFieldInvalid } from '#/components/ui/form'
import { Input } from '#/components/ui/input'
import {
  authClient,
  getAuthSession,
  getConfirmEmailCallbackURL,
  getSafeRedirectTarget,
  signIn,
} from '#/lib/auth-client'

const loginFormSchema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

export default function LoginPage() {
  const search = useSearch({ from: '/login' })
  const navigate = useNavigate({ from: '/login' })
  const redirectTarget = useMemo(
    () => getSafeRedirectTarget(search.redirect),
    [search.redirect],
  )

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      setErrorMessage(null)

      const credentials = loginFormSchema.parse(value)

      const { error } = await signIn.email(credentials)

      if (error) {
        setErrorMessage(error.message ?? 'Unable to sign in. Please check your credentials.')
        return
      }

      const session = await getAuthSession()

      if (session && !session.user.emailVerified) {
        const resendResult = await authClient.sendVerificationEmail({
          email: session.user.email,
          callbackURL: getConfirmEmailCallbackURL(redirectTarget),
        })

        await navigate({
          to: '/confirm-email',
          search: resendResult.error
            ? { error: 'resend_failed', redirect: redirectTarget }
            : { redirect: redirectTarget, resent: '1' },
          replace: true,
        })
        return
      }

      window.location.replace(redirectTarget)
    },
  })
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting)

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
            search={search.redirect ? { redirect: search.redirect } : {}}
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

      <form
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
        className="mt-8 space-y-5"
      >
        {search.verified === '1' && (
          <div className="rounded-2xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-foreground">
            Your email is verified. Sign in to continue.
          </div>
        )}

        <form.Field
          name="email"
          validators={{
            onBlur: loginFormSchema.shape.email,
            onSubmit: loginFormSchema.shape.email,
          }}
        >
          {(field) => (
            <Field field={field}>
              <FieldLabel className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                Email
              </FieldLabel>
              <Input
                type="email"
                autoComplete="email"
                required
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={isFieldInvalid(field) || undefined}
                className="h-12 rounded-2xl border-border/80 bg-background/40 px-4"
                placeholder="you@example.com"
              />
              <FieldError>{getFieldErrorText(field)}</FieldError>
            </Field>
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onBlur: loginFormSchema.shape.password,
            onSubmit: loginFormSchema.shape.password,
          }}
        >
          {(field) => (
            <Field field={field}>
              <FieldLabel className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                Password
              </FieldLabel>
              <Input
                type="password"
                autoComplete="current-password"
                required
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={isFieldInvalid(field) || undefined}
                className="h-12 rounded-2xl border-border/80 bg-background/40 px-4"
                placeholder="Enter your password"
              />
              <FieldError>{getFieldErrorText(field)}</FieldError>
            </Field>
          )}
        </form.Field>

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
