import { Hono } from 'hono'
import type { AppEnv } from '../authentication/index.js'
import { optimizeReceiptsHandler } from './handler.js'

export const optimizerRoutes = new Hono<AppEnv>()

optimizerRoutes.post('/', optimizeReceiptsHandler)
