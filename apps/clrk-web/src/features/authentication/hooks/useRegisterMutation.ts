import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { z } from 'zod'
import {
  getConfirmEmailCallbackURL,
  getSafeRedirectTarget,
  signUp,
} from '#/lib/auth-client'

export const registerFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.'),
  email: z.email('Enter a valid email address.'),
  password: z.string().min(8, 'Use at least 8 characters.'),
})

type RegisterMutationVariables = z.infer<typeof registerFormSchema>

export function useRegisterMutation() {
  const router = useRouter()

  return useMutation({
    mutationKey: ['auth', 'register'],
    mutationFn: async (values: RegisterMutationVariables) => {
      const registration = registerFormSchema.parse(values)
      const redirectTarget = getSafeRedirectTarget(
        (router.state.resolvedLocation ?? router.state.location).search.redirect,
      )

      const { error } = await signUp.email({
        ...registration,
        callbackURL: getConfirmEmailCallbackURL(redirectTarget),
        subscriptionEnabled: false,
      })

      if (error) {
        throw new Error(error.message ?? 'Unable to create your account right now.')
      }

      await router.navigate({
        to: '/confirm-email',
        search: { redirect: redirectTarget },
        replace: true,
      })
    },
  })
}
