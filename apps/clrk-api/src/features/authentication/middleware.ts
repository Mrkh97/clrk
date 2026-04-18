import type { MiddlewareHandler } from 'hono'
import { auth, type AuthSession } from './auth.js'

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

  await next()
}
