import type { Hono } from 'hono'
import { auth } from './auth.js'
import type { AppVariables } from './middleware.js'

export function registerAuthenticationRoutes(app: Hono<{ Variables: AppVariables }>) {
  app.on(['GET', 'POST'], '/api/auth/*', (c) => {
    return auth.handler(c.req.raw)
  })

  app.get('/verify-email', (c) => {
    return auth.handler(c.req.raw)
  })
}
