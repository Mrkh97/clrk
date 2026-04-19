import { Hono } from 'hono'
import type { AppEnv } from '../authentication/index.js'
import {
  createReceiptHandler,
  dashboardHandler,
  deleteReceiptHandler,
  extractReceiptHandler,
  getReceiptHandler,
  listReceiptsHandler,
  updateReceiptHandler,
} from './handler.js'

export const receiptsRoutes = new Hono<AppEnv>()
export const dashboardRoutes = new Hono<AppEnv>()

receiptsRoutes.post('/', createReceiptHandler)
receiptsRoutes.get('/', listReceiptsHandler)
receiptsRoutes.get('/:id', getReceiptHandler)
receiptsRoutes.put('/:id', updateReceiptHandler)
receiptsRoutes.delete('/:id', deleteReceiptHandler)
receiptsRoutes.post('/extract', extractReceiptHandler)

dashboardRoutes.get('/', dashboardHandler)
