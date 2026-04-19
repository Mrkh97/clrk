import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { authClient, getConfirmEmailRedirectTarget } from './auth-client'

export const getCurrentSession = createServerFn({ method: 'GET' }).handler(async () => {
  const cookie = getRequestHeader('cookie')

  const { data, error } = await authClient.getSession({
    fetchOptions: {
      headers: cookie ? { cookie } : undefined,
    },
  })

  if (error) {
    return null
  }

  return data
})

export async function requireSession(redirectTarget: string) {
  const session = await getCurrentSession()

  if (!session) {
    throw redirect({
      to: '/login',
      search: { redirect: redirectTarget },
      replace: true,
    })
  }

  return session
}

export async function requireVerifiedSession(redirectTarget: string) {
  const session = await requireSession(redirectTarget)

  if (!session.user.emailVerified) {
    throw redirect({
      href: getConfirmEmailRedirectTarget(redirectTarget),
      replace: true,
    })
  }

  return session
}
