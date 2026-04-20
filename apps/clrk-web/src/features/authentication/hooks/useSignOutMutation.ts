import { useMutation } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { signOut } from '#/lib/auth-client'

export function useSignOutMutation() {
  const router = useRouter()

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
