import { Hono } from 'hono'
import { authHandler } from './handler.js'
import type { AppEnv } from './middleware.js'

export const authenticationRoutes = new Hono<AppEnv>()

authenticationRoutes.on(['GET', 'POST'], '/*', authHandler)
