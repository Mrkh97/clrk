import { and, desc, eq, gte, lte } from 'drizzle-orm'
import type { Handler } from 'hono'
import { db } from '@/db/index.js'
import { receipt } from '@/db/schema.js'
import { ANALYTICS_CURRENCY } from '@/utils/currency.js'
import { toUtcDayEnd, toUtcDayStart } from '@/utils/date.js'
import { normalizeMoneyRecordsToCurrency } from '@/utils/exchange-rates.js'
import type { AppContext, AppEnv } from '../authentication/index.js'
import { createOptimizerAnalysis } from './optimizer-analysis.js'
import { enrichOptimizerSuggestions } from './optimizer-llm.js'
import { optimizerRequestSchema } from './schema.js'

function getAuthenticatedUserId(c: AppContext) {
  const user = c.get('user')

  if (!user) {
    return null
  }

  return user.id
}

export const optimizeReceiptsHandler: Handler<AppEnv> = async (c) => {
  const userId = getAuthenticatedUserId(c)

  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const body = await c.req.json().catch(() => null)
  const parsed = optimizerRequestSchema.safeParse(body)

  if (!parsed.success) {
    return c.json({ error: parsed.error.issues[0]?.message ?? 'Invalid optimizer payload.' }, 400)
  }

  const receipts = await db
    .select({
      id: receipt.id,
      merchant: receipt.merchant,
      amount: receipt.amount,
      currency: receipt.currency,
      category: receipt.category,
      paymentMethod: receipt.paymentMethod,
      date: receipt.date,
      notes: receipt.notes,
    })
    .from(receipt)
    .where(
      and(
        eq(receipt.userId, userId),
        eq(receipt.status, 'complete'),
        gte(receipt.date, toUtcDayStart(parsed.data.from)),
        lte(receipt.date, toUtcDayEnd(parsed.data.to)),
      ),
    )
    .orderBy(desc(receipt.date), desc(receipt.createdAt))

  let normalizedReceipts: typeof receipts

  try {
    normalizedReceipts = await normalizeMoneyRecordsToCurrency(receipts, ANALYTICS_CURRENCY)
  } catch (error) {
    return c.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unable to normalize optimizer amounts right now.',
      },
      503,
    )
  }

  const deterministicResponse = createOptimizerAnalysis(normalizedReceipts, parsed.data.level)
  const optimizedResponse = await enrichOptimizerSuggestions(deterministicResponse, {
    from: parsed.data.from,
    to: parsed.data.to,
  })

  return c.json(optimizedResponse)
}
