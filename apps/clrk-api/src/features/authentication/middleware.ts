import type { Context, MiddlewareHandler } from 'hono'
import { API_BASE_PATH } from '@/lib/api-paths.js'
import { auth, type AuthSession } from './auth.js'

type VerificationAwareUser = Pick<AuthSession['user'], 'emailVerified'>

export function isPublicVerificationPath(path: string) {
  return (
    path === `${API_BASE_PATH}/health`
    || path.startsWith(`${API_BASE_PATH}/auth/`)
  )
}

export function shouldBlockUnverifiedUser(path: string, user: VerificationAwareUser | null) {
  if (!path.startsWith(`${API_BASE_PATH}/`)) {
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

export type AppEnv = {
  Variables: AppVariables
}

export type AppContext = Context<AppEnv>

export const authSessionMiddleware: MiddlewareHandler<AppEnv> = async (
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
