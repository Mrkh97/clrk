import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import {
  authenticationRoutes,
  authSessionMiddleware,
  type AppEnv,
  verifyEmailHandler,
} from './features/authentication/index.js'
import { optimizerRoutes } from './features/optimizer/index.js'
import { dashboardRoutes, receiptsRoutes } from './features/receipts/index.js'
import { API_BASE_PATH } from './lib/api-paths.js'
import { env, isAllowedWebOrigin } from './lib/env.js'

const app = new Hono<AppEnv>()
const api = app.basePath(API_BASE_PATH)
const corsOptions = {
  origin: (origin: string) => (isAllowedWebOrigin(origin) ? origin : env.WEB_ORIGIN),
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}

api.use('*', cors(corsOptions))
app.use('/verify-email', cors(corsOptions))

app.use('*', authSessionMiddleware)

app.get('/', (c) => {
  return c.json({
    message: 'clrk api ready',
  })
})

app.get('/verify-email', verifyEmailHandler)

api.get('/health', (c) => {
  return c.json({
    ok: true,
  })
})

api.route('/auth', authenticationRoutes)
api.route('/dashboard', dashboardRoutes)
api.route('/receipts/optimize', optimizerRoutes)
api.route('/receipts', receiptsRoutes)

serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
  },
)
