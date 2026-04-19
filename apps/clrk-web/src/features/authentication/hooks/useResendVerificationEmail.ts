import { useMutation } from '@tanstack/react-query'
import { authClient, getConfirmEmailCallbackURL } from '#/lib/auth-client'

interface ResendVerificationEmailVariables {
  email: string
  redirect?: string
}

export function useResendVerificationEmail() {
  return useMutation({
    mutationKey: ['auth', 'resend-verification-email'],
    mutationFn: async ({ email, redirect }: ResendVerificationEmailVariables) => {
      const { error } = await authClient.sendVerificationEmail({
        email,
        callbackURL: getConfirmEmailCallbackURL(redirect),
      })

      if (error) {
        throw new Error('resend_failed')
      }
    },
  })
}
