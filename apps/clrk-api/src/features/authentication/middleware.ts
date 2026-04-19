import type { MiddlewareHandler } from 'hono'
import { auth, type AuthSession } from './auth.js'

type VerificationAwareUser = Pick<AuthSession['user'], 'emailVerified'>

export function isPublicVerificationPath(path: string) {
  return path === '/api/health' || path.startsWith('/api/auth/') || path === '/verify-email'
}

export function shouldBlockUnverifiedUser(path: string, user: VerificationAwareUser | null) {
  if (!path.startsWith('/api/')) {
    return false
  }

  if (!user || user.emailVerified || isPublicVerificationPath(path)) {
    return false
  }

  return true
}

export type AppVariables = {
  user: AuthSession['user'] | null
  session: AuthSession['session'] | null
}

export const authSessionMiddleware: MiddlewareHandler<{ Variables: AppVariables }> = async (
  c,
  next,
) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  c.set('user', session?.user ?? null)
  c.set('session', session?.session ?? null)

  if (shouldBlockUnverifiedUser(c.req.path, session?.user ?? null)) {
    return c.json({ error: 'Email not verified.', code: 'EMAIL_NOT_VERIFIED' }, 403)
  }

  await next()
}
