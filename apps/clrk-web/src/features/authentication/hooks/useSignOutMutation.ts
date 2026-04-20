import { useMutation } from '@tanstack/react-query'
import { signOut } from '#/lib/auth-client'
import { router } from '#/router'

export function useSignOutMutation() {
  return useMutation({
    mutationKey: ['auth', 'sign-out'],
    mutationFn: async () => {
      const { error } = await signOut()

      if (error) {
        throw new Error(error.message ?? 'Unable to sign out right now.')
      }

      await router.navigate({
        to: '/',
        replace: true,
      })
    },
  })
}
