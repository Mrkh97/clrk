import type { Handler } from 'hono'
import { auth } from './auth.js'
import type { AppEnv } from './middleware.js'

export const authHandler: Handler<AppEnv> = (c) => {
  return auth.handler(c.req.raw)
}
