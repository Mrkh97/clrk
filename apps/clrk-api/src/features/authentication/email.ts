import { Resend } from 'resend'
import { env } from '@/lib/env.js'

let resendClient: Resend | null = null
const defaultRedirectTarget = '/dashboard'
const confirmEmailPath = '/confirm-email'

function getResendClient() {
  if (!env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is required to send verification emails.')
  }

  resendClient ??= new Resend(env.RESEND_API_KEY)

  return resendClient
}

function getFromAddress() {
  if (!env.RESEND_FROM_EMAIL) {
    throw new Error('RESEND_FROM_EMAIL is required to send verification emails.')
  }

  return env.RESEND_FROM_EMAIL
}

function getSafeRedirectTarget(redirect?: string | null) {
  if (redirect && redirect.startsWith('/') && !redirect.startsWith('//')) {
    return redirect
  }

  return defaultRedirectTarget
}

function getVerificationCallbackURL(verificationUrl: string) {
  try {
    return new URL(verificationUrl).searchParams.get('callbackURL')
  } catch {
    return null
  }
}

export function getVerificationEmailRedirectTarget(callbackURL?: string | null) {
  if (!callbackURL) {
    return defaultRedirectTarget
  }

  try {
    const parsedCallbackUrl = new URL(callbackURL, env.WEB_ORIGIN)
    const webOrigin = new URL(env.WEB_ORIGIN).origin

    if (parsedCallbackUrl.origin !== webOrigin) {
      return defaultRedirectTarget
    }

    if (parsedCallbackUrl.pathname === confirmEmailPath) {
      return getSafeRedirectTarget(parsedCallbackUrl.searchParams.get('redirect'))
    }

    return getSafeRedirectTarget(`${parsedCallbackUrl.pathname}${parsedCallbackUrl.search}`)
  } catch {
    return defaultRedirectTarget
  }
}

export function getVerificationEmailUrl({
  token,
  callbackURL,
}: {
  token: string
  callbackURL?: string | null
}) {
  const verificationUrl = new URL(confirmEmailPath, env.WEB_ORIGIN)
  const redirectTarget = getVerificationEmailRedirectTarget(callbackURL)

  verificationUrl.searchParams.set('token', token)

  if (redirectTarget !== defaultRedirectTarget) {
    verificationUrl.searchParams.set('redirect', redirectTarget)
  }

  return verificationUrl.toString()
}

export async function sendVerificationEmail({
  email,
  name,
  token,
  verificationUrl,
}: {
  email: string
  name?: string | null
  token: string
  verificationUrl: string
}) {
  const resend = getResendClient()
  const callbackURL = getVerificationCallbackURL(verificationUrl)
  const webVerificationUrl = getVerificationEmailUrl({
    token,
    callbackURL,
  })
  const greetingName = name?.trim() || 'there'

  await resend.emails.send({
    from: getFromAddress(),
    to: email,
    subject: 'Confirm your email to use Clrk',
    text: `Hi ${greetingName},\n\nConfirm your email to unlock Clrk: ${webVerificationUrl}\n\nIf you did not create this account, you can ignore this email.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
        <p>Hi ${greetingName},</p>
        <p>Confirm your email to unlock Clrk.</p>
        <p>
          <a href="${webVerificationUrl}" style="display:inline-block;padding:12px 20px;border-radius:9999px;background:#111827;color:#ffffff;text-decoration:none;font-weight:600">
            Confirm email
          </a>
        </p>
        <p>If the button does not work, open this link:</p>
        <p><a href="${webVerificationUrl}">${webVerificationUrl}</a></p>
        <p>If you did not create this account, you can ignore this email.</p>
      </div>
    `,
  })
}
