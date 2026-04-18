import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import {
  authSessionMiddleware,
  registerAuthenticationRoutes,
  type AppVariables,
} from './features/authentication/index.js'
import { registerReceiptRoutes } from './features/receipts/index.js'
import { env, isAllowedWebOrigin } from './lib/env.js'

const app = new Hono<{ Variables: AppVariables }>()

app.use('/api/*', cors({
  origin: (origin) => (isAllowedWebOrigin(origin) ? origin : env.WEB_ORIGIN),
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}))

app.use('*', authSessionMiddleware)

app.get('/', (c) => {
  return c.json({
    message: 'clrk api ready',
  })
})

app.get('/api/health', (c) => {
  return c.json({
    ok: true,
  })
})

registerAuthenticationRoutes(app)
registerReceiptRoutes(app)

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  },
)
