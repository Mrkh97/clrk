import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { AlertTriangle, CheckCircle2, MailCheck, RefreshCcw } from 'lucide-react'
import { z } from 'zod'
import AuthShell from '#/components/AuthShell'
import { Button } from '#/components/ui/button'
import {
  authClient,
  getConfirmEmailCallbackURL,
  getSafeRedirectTarget,
  useAuthSession,
} from '#/lib/auth-client'

const confirmEmailSearchSchema = z.object({
  error: z.string().optional(),
  redirect: z.string().optional(),
  resent: z.enum(['1']).optional(),
})

export const Route = createFileRoute('/confirm-email')({
  validateSearch: (search) => confirmEmailSearchSchema.parse(search),
  component: ConfirmEmailPage,
})

function getErrorCopy(error?: string) {
  switch (error) {
    case 'invalid_token':
    case 'token_invalid':
      return 'That verification link is no longer valid. Request a fresh email and try again.'
    case 'expired_token':
    case 'token_expired':
      return 'That verification link expired. Request another email to finish confirming your account.'
    case 'resend_failed':
      return 'We could not send another confirmation email just yet. Try again in a moment.'
    default:
      return 'We could not verify your email from that link. Request another email and try again.'
  }
}

function ConfirmEmailPage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: '/confirm-email' })
  const { data: session, isPending } = useAuthSession()
  const redirectTarget = useMemo(
    () => getSafeRedirectTarget(search.redirect),
    [search.redirect],
  )

  const [isResending, setIsResending] = useState(false)
  const [resendError, setResendError] = useState<string | null>(null)

  const isVerified = Boolean(session?.user.emailVerified)
  const canResend = Boolean(session?.user.email && !session.user.emailVerified)
  const activeError = resendError ?? search.error ?? null
  const hasResent = search.resent === '1'

  let eyebrow = 'Confirm Email'
  let title = 'Check your inbox.'
  let description = 'We need a verified email before opening the protected finance workspace.'
  let Icon = MailCheck

  if (isVerified) {
    eyebrow = 'Email Verified'
    title = 'You are cleared to continue.'
    description = 'Your email is confirmed. Continue into the verified workspace.'
    Icon = CheckCircle2
  } else if (activeError) {
    eyebrow = 'Verification Error'
    title = 'That link did not complete verification.'
    description = getErrorCopy(activeError)
    Icon = AlertTriangle
  } else if (hasResent) {
    eyebrow = 'Email Resent'
    title = 'A fresh confirmation link is on the way.'
    description = 'Open the latest message in your inbox, then come back here once verification finishes.'
    Icon = RefreshCcw
  } else if (isPending) {
    description = 'Loading your current verification state.'
  }

  const handleResend = async () => {
    if (!session?.user.email || session.user.emailVerified) {
      return
    }

    setIsResending(true)
    setResendError(null)

    const { error } = await authClient.sendVerificationEmail({
      email: session.user.email,
      callbackURL: getConfirmEmailCallbackURL(redirectTarget),
    })

    setIsResending(false)

    if (error) {
      setResendError('resend_failed')
      return
    }

    await navigate({
      to: '/confirm-email',
      search: search.redirect
        ? { redirect: search.redirect, resent: '1' }
        : { resent: '1' },
      replace: true,
    })
  }

  return (
    <AuthShell
      eyebrow={eyebrow}
      title={title}
      description={description}
      footer={
        isVerified ? (
          <>
            Ready to continue?{' '}
            <Link
              to={redirectTarget}
              className="font-medium text-foreground underline decoration-brand/40 underline-offset-4"
            >
              Open your workspace
            </Link>
          </>
        ) : (
          <>
            Need a different account?{' '}
            <Link
              to="/login"
              search={search.redirect ? { redirect: search.redirect } : undefined}
              className="font-medium text-foreground underline decoration-brand/40 underline-offset-4"
            >
              Sign in here
            </Link>
          </>
        )
      }
    >
      <div className="space-y-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/12 text-brand">
          <Icon size={18} />
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
          Verification Status
        </p>
        <h2 className="font-display text-3xl font-bold text-foreground">{title}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>

      <div className="mt-8 space-y-5">
        <div className="rounded-[1.5rem] border border-border/80 bg-background/40 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Signed-in email
          </p>
          <p className="mt-3 text-sm text-foreground">
            {session?.user.email ?? 'Sign in to resend a verification email.'}
          </p>
        </div>

        {activeError && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-destructive">
            {getErrorCopy(activeError)}
          </div>
        )}

        {(hasResent || canResend) && !isVerified && (
          <Button
            type="button"
            onClick={handleResend}
            disabled={!canResend || isResending}
            className="h-12 w-full rounded-full bg-brand font-mono text-xs font-bold uppercase tracking-[0.28em] text-brand-foreground hover:bg-brand/90"
          >
            {isResending ? 'Sending Email...' : hasResent ? 'Send Another Link' : 'Resend Verification Email'}
          </Button>
        )}

        {isVerified ? (
          <Button
            asChild
            className="h-12 w-full rounded-full bg-brand font-mono text-xs font-bold uppercase tracking-[0.28em] text-brand-foreground hover:bg-brand/90"
          >
            <Link to={redirectTarget}>Continue To Workspace</Link>
          </Button>
        ) : (
          <Button
            asChild
            variant="outline"
            className="h-12 w-full rounded-full font-mono text-xs font-bold uppercase tracking-[0.28em]"
          >
            <Link
              to="/login"
              search={search.redirect ? { redirect: search.redirect } : undefined}
            >
              {session ? 'Switch Account' : 'Log In'}
            </Link>
          </Button>
        )}
      </div>
    </AuthShell>
  )
}
