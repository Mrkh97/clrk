import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { z } from 'zod'
import {
  authClient,
  getAuthSession,
  getConfirmEmailCallbackURL,
  getSafeRedirectTarget,
  signIn,
} from '#/lib/auth-client'

export const loginFormSchema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(1, 'Password is required.'),
})

interface LoginMutationVariables extends z.infer<typeof loginFormSchema> {
}

export function useLoginMutation() {
  const router = useRouter()

  return useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: async (values: LoginMutationVariables) => {
      const credentials = loginFormSchema.parse(values)
      const redirectTarget = getSafeRedirectTarget(
        (router.state.resolvedLocation ?? router.state.location).search.redirect,
      )

      const { error } = await signIn.email(credentials)

      if (error) {
        throw new Error(error.message ?? 'Unable to sign in. Please check your credentials.')
      }

      const session = await getAuthSession()

      if (session && !session.user.emailVerified) {
        const resendResult = await authClient.sendVerificationEmail({
          email: session.user.email,
          callbackURL: getConfirmEmailCallbackURL(redirectTarget),
        })

        await router.navigate({
          to: '/confirm-email',
          search: resendResult.error
            ? { error: 'resend_failed', redirect: redirectTarget }
            : { redirect: redirectTarget, resent: '1' },
          replace: true,
        })
        return
      }

      await router.navigate({
        href: redirectTarget,
        replace: true,
      })
    },
  })
}
