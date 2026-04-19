import { Link, useSearch } from '@tanstack/react-router'
import { useForm, useStore } from '@tanstack/react-form'
import { useMemo, useState } from 'react'
import { z } from 'zod'
import AuthShell from '#/components/AuthShell'
import { Button } from '#/components/ui/button'
import { Field, FieldError, FieldLabel, getFieldErrorText, isFieldInvalid } from '#/components/ui/form'
import { Input } from '#/components/ui/input'
import {
  getConfirmEmailCallbackURL,
  getConfirmEmailRedirectTarget,
  getSafeRedirectTarget,
  signUp,
} from '#/lib/auth-client'

const registerFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  email: z.email('Enter a valid email address.'),
  password: z.string().min(8, 'Use at least 8 characters.'),
})

export default function RegisterPage() {
  const search = useSearch({ from: '/register' })
  const redirectTarget = useMemo(
    () => getSafeRedirectTarget(search.redirect),
    [search.redirect],
  )

  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      setErrorMessage(null)

      const registration = registerFormSchema.parse(value)

      const { error } = await signUp.email({
        ...registration,
        callbackURL: getConfirmEmailCallbackURL(redirectTarget),
        subscriptionEnabled: false,
      })

      if (error) {
        setErrorMessage(error.message ?? 'Unable to create your account right now.')
        return
      }

      window.location.assign(getConfirmEmailRedirectTarget(redirectTarget))
    },
  })
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting)

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

      <form
        onSubmit={(event) => {
          event.preventDefault()
          event.stopPropagation()
          void form.handleSubmit()
        }}
        className="mt-8 space-y-5"
      >
        <form.Field
          name="name"
          validators={{
            onBlur: registerFormSchema.shape.name,
            onSubmit: registerFormSchema.shape.name,
          }}
        >
          {(field) => (
            <Field field={field}>
              <FieldLabel className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                Name
              </FieldLabel>
              <Input
                type="text"
                autoComplete="name"
                required
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={isFieldInvalid(field) || undefined}
                className="h-12 rounded-2xl border-border/80 bg-background/40 px-4"
                placeholder="Morgan Lee"
              />
              <FieldError>{getFieldErrorText(field)}</FieldError>
            </Field>
          )}
        </form.Field>

        <form.Field
          name="email"
          validators={{
            onBlur: registerFormSchema.shape.email,
            onSubmit: registerFormSchema.shape.email,
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
            onBlur: registerFormSchema.shape.password,
            onSubmit: registerFormSchema.shape.password,
          }}
        >
          {(field) => (
            <Field field={field}>
              <FieldLabel className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                Password
              </FieldLabel>
              <Input
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                aria-invalid={isFieldInvalid(field) || undefined}
                className="h-12 rounded-2xl border-border/80 bg-background/40 px-4"
                placeholder="Use at least 8 characters"
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
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </AuthShell>
  )
}
