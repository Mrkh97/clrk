import { Link, useSearch } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import AuthShell from '#/components/AuthShell'
import { Button } from '#/components/ui/button'
import { Field, FieldError, FieldLabel, getFieldErrorText, isFieldInvalid } from '#/components/ui/form'
import { Input } from '#/components/ui/input'
import { registerFormSchema, useRegisterMutation } from '#/features/authentication/hooks/useRegisterMutation'

export default function RegisterPage() {
  const search = useSearch({ from: '/register' })
  const registerMutation = useRegisterMutation()
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      await registerMutation.mutateAsync(value).catch(() => null)
    },
  })
  const errorMessage = registerMutation.error instanceof Error
    ? registerMutation.error.message
    : null

  return (
    <AuthShell
      eyebrow="Create account"
      title="Create your clrk account"
      description="Set up your workspace to store receipts, monitor spending, and keep every expense within reach."
      footer={
        <>
          Already have an account?{' '}
          <Link
            to="/login"
            search={search.redirect ? { redirect: search.redirect } : {}}
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
        <h2 className="font-display text-3xl font-bold text-foreground">Get started in a few seconds.</h2>
        <p className="text-sm leading-6 text-muted-foreground">
          Create an account to upload receipts, organize purchases, and start building a clearer view of your expenses.
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
                placeholder="Alex Johnson"
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
                placeholder="alex@northstarstudio.com"
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
                placeholder="Create a password with at least 8 characters"
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
          disabled={registerMutation.isPending}
          className="h-12 w-full rounded-full bg-brand font-mono text-xs font-bold uppercase tracking-[0.28em] text-brand-foreground hover:bg-brand/90"
        >
          {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>
    </AuthShell>
  )
}
