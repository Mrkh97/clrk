import { Link, useSearch } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import AuthShell from '#/components/AuthShell'
import { Button } from '#/components/ui/button'
import { Field, FieldError, FieldLabel, getFieldErrorText, isFieldInvalid } from '#/components/ui/form'
import { Input } from '#/components/ui/input'
import { loginFormSchema, useLoginMutation } from '#/features/authentication/hooks/useLoginMutation'

export default function LoginPage() {
  const search = useSearch({ from: '/login' })
  const loginMutation = useLoginMutation()
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      await loginMutation.mutateAsync(value).catch(() => null)
    },
  })
  const errorMessage = loginMutation.error instanceof Error
    ? loginMutation.error.message
    : null

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign in to your workspace"
      description="Access your receipts, spending insights, and account tools in one place."
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
        <h2 className="font-display text-3xl font-bold text-foreground">Pick up where you left off.</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Sign in to review recent receipts, track expenses, and keep your records organized.
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
                placeholder="alex@northstarstudio.com"
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
                placeholder="Enter your account password"
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
          disabled={loginMutation.isPending}
          className="h-12 w-full rounded-full bg-brand font-mono text-xs font-bold uppercase tracking-[0.28em] text-brand-foreground hover:bg-brand/90"
        >
          {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>
    </AuthShell>
  )
}
