import { redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { getAuthSession, getConfirmEmailRedirectTarget } from './auth-client'

const getCurrentSessionServer = createServerFn({ method: 'GET' }).handler(async () => {
  const cookie = getRequestHeader('cookie')

  return getAuthSession({
    fetchOptions: {
      headers: cookie ? { cookie } : undefined,
    },
  })
})

export async function getCurrentSession() {
  if (typeof window !== 'undefined') {
    return getAuthSession()
  }

  return getCurrentSessionServer()
}

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
