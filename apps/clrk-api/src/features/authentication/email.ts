import { Resend } from 'resend'
import { env } from '../../lib/env.js'

let resendClient: Resend | null = null

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

export async function sendVerificationEmail({
  email,
  name,
  verificationUrl,
}: {
  email: string
  name?: string | null
  verificationUrl: string
}) {
  const resend = getResendClient()

  const greetingName = name?.trim() || 'there'

  await resend.emails.send({
    from: getFromAddress(),
    to: email,
    subject: 'Confirm your email to use Clrk',
    text: `Hi ${greetingName},\n\nConfirm your email to unlock Clrk: ${verificationUrl}\n\nIf you did not create this account, you can ignore this email.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
        <p>Hi ${greetingName},</p>
        <p>Confirm your email to unlock Clrk.</p>
        <p>
          <a href="${verificationUrl}" style="display:inline-block;padding:12px 20px;border-radius:9999px;background:#111827;color:#ffffff;text-decoration:none;font-weight:600">
            Confirm email
          </a>
        </p>
        <p>If the button does not work, open this link:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>If you did not create this account, you can ignore this email.</p>
      </div>
    `,
  })
}
