import { createOpenAI } from '@ai-sdk/openai'
import { generateText, Output } from 'ai'
import { and, desc, eq, gte, lte } from 'drizzle-orm'
import type { Hono } from 'hono'
import { db } from '../../db/index.js'
import { receipt } from '../../db/schema.js'
import type { AppVariables } from '../authentication/index.js'
import { env } from '../../lib/env.js'
import { createOptimizerAnalysis } from './optimizer-analysis.js'
import { enrichOptimizerSuggestions } from './optimizer-llm.js'
import {
  createReceiptSchema,
  dashboardQuerySchema,
  extractedReceiptSchema,
  optimizerRequestSchema,
  receiptQuerySchema,
  updateReceiptSchema,
  type DashboardTimeFilter,
  type ReceiptCategory,
} from './schema.js'

type ReceiptRecord = typeof receipt.$inferSelect

function getAuthenticatedUserId(c: Parameters<Hono<{ Variables: AppVariables }>['get']>[0] extends never
  ? never
  : { get(name: 'user'): AppVariables['user'] }) {
  const user = c.get('user')

  if (!user) {
    return null
  }

  return user.id
}

function parseDateOnly(value: string) {
  return new Date(`${value}T00:00:00.000Z`)
}

function toStartOfDay(value: string) {
  return parseDateOnly(value)
}

function toEndOfDay(value: string) {
  return new Date(`${value}T23:59:59.999Z`)
}

function formatDate(value: Date) {
  return value.toISOString().slice(0, 10)
}

function serializeReceipt(row: ReceiptRecord) {
  return {
    id: row.id,
    merchant: row.merchant,
    amount: row.amount,
    currency: row.currency,
    date: formatDate(row.date),
    category: row.category,
    paymentMethod: row.paymentMethod,
    notes: row.notes,
    status: row.status,
    aiExtracted: row.aiExtracted,
  }
}

function getDashboardStartDate(timeFilter: DashboardTimeFilter, now: Date) {
  const start = new Date(now)
  start.setUTCHours(0, 0, 0, 0)

  switch (timeFilter) {
    case '7D':
      start.setUTCDate(start.getUTCDate() - 6)
      return start
    case '30D':
      start.setUTCDate(start.getUTCDate() - 29)
      return start
    case '3M':
      start.setUTCMonth(start.getUTCMonth() - 2, 1)
      start.setUTCHours(0, 0, 0, 0)
      return start
    case '6M':
      start.setUTCMonth(start.getUTCMonth() - 5, 1)
      start.setUTCHours(0, 0, 0, 0)
      return start
    case '1Y':
      start.setUTCMonth(start.getUTCMonth() - 11, 1)
      start.setUTCHours(0, 0, 0, 0)
      return start
  }
}

function getDashboardDaySpan(timeFilter: DashboardTimeFilter, startDate: Date, endDate: Date) {
  if (timeFilter === '7D') {
    return 7
  }

  if (timeFilter === '30D') {
    return 30
  }

  const millisecondsPerDay = 24 * 60 * 60 * 1000
  return Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime() + 1) / millisecondsPerDay))
}

function getMonthBucketKey(value: Date) {
  return `${value.getUTCFullYear()}-${String(value.getUTCMonth() + 1).padStart(2, '0')}`
}

function buildMonthlyBuckets(startDate: Date, endDate: Date) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: '2-digit',
    timeZone: 'UTC',
  })
  const buckets: Array<{ key: string; label: string; amount: number }> = []
  const cursor = new Date(Date.UTC(startDate.getUTCFullYear(), startDate.getUTCMonth(), 1))
  const lastMonth = new Date(Date.UTC(endDate.getUTCFullYear(), endDate.getUTCMonth(), 1))

  while (cursor <= lastMonth) {
    buckets.push({
      key: getMonthBucketKey(cursor),
      label: formatter.format(cursor),
      amount: 0,
    })

    cursor.setUTCMonth(cursor.getUTCMonth() + 1)
  }

  return buckets
}

function buildDashboard(receipts: ReceiptRecord[], timeFilter: DashboardTimeFilter) {
  const now = new Date()
  const startDate = getDashboardStartDate(timeFilter, now)
  const daySpan = getDashboardDaySpan(timeFilter, startDate, now)
  const totalSpent = receipts.reduce((sum, item) => sum + item.amount, 0)
  const categoryTotals = new Map<ReceiptCategory, number>()
  const monthlyBuckets = buildMonthlyBuckets(startDate, now)
  const monthlyIndex = new Map(monthlyBuckets.map((bucket) => [bucket.key, bucket]))

  for (const item of receipts) {
    const category = item.category as ReceiptCategory
    categoryTotals.set(category, (categoryTotals.get(category) ?? 0) + item.amount)

    const monthBucket = monthlyIndex.get(getMonthBucketKey(item.date))
    if (monthBucket) {
      monthBucket.amount += item.amount
    }
  }

  const topCategoryEntry = Array.from(categoryTotals.entries()).sort((left, right) => right[1] - left[1])[0]

  return {
    stats: {
      totalSpent,
      avgDaily: totalSpent / daySpan,
      topCategory: topCategoryEntry?.[0] ?? '',
      transactionCount: receipts.length,
    },
    monthlySpend: monthlyBuckets.map(({ label, amount }) => ({ label, amount })),
    categorySpend: Array.from(categoryTotals.entries())
      .sort((left, right) => right[1] - left[1])
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalSpent === 0 ? 0 : (amount / totalSpent) * 100,
      })),
      transactions: receipts.map((item) => ({
        id: item.id,
        merchant: item.merchant,
        amount: item.amount,
        date: formatDate(item.date),
        category: item.category,
        status:
          item.status === 'complete'
            ? 'completed'
            : item.status === 'error'
              ? 'failed'
              : 'pending',
      })),
    }
}

export function registerReceiptRoutes(app: Hono<{ Variables: AppVariables }>) {
  app.post('/api/receipts', async (c) => {
    const userId = getAuthenticatedUserId(c)

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const body = await c.req.json().catch(() => null)
    const parsed = createReceiptSchema.safeParse(body)

    if (!parsed.success) {
      return c.json({ error: parsed.error.issues[0]?.message ?? 'Invalid receipt payload.' }, 400)
    }

    const [createdReceipt] = await db
      .insert(receipt)
      .values({
        id: crypto.randomUUID(),
        userId,
        merchant: parsed.data.merchant,
        amount: parsed.data.amount,
        currency: parsed.data.currency,
        date: parseDateOnly(parsed.data.date),
        category: parsed.data.category,
        paymentMethod: parsed.data.paymentMethod,
        notes: parsed.data.notes ?? null,
        status: parsed.data.status,
        aiExtracted: parsed.data.aiExtracted,
      })
      .returning()

    return c.json({ receipt: serializeReceipt(createdReceipt) }, 201)
  })

  app.get('/api/receipts', async (c) => {
    const userId = getAuthenticatedUserId(c)

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const parsed = receiptQuerySchema.safeParse({
      from: c.req.query('from') ?? undefined,
      to: c.req.query('to') ?? undefined,
      category: c.req.query('category') ?? undefined,
    })

    if (!parsed.success) {
      return c.json({ error: parsed.error.issues[0]?.message ?? 'Invalid query parameters.' }, 400)
    }

    const filters = [eq(receipt.userId, userId)]

    if (parsed.data.from) {
      filters.push(gte(receipt.date, toStartOfDay(parsed.data.from)))
    }

    if (parsed.data.to) {
      filters.push(lte(receipt.date, toEndOfDay(parsed.data.to)))
    }

    if (parsed.data.category) {
      filters.push(eq(receipt.category, parsed.data.category))
    }

    const receipts = await db
      .select()
      .from(receipt)
      .where(and(...filters))
      .orderBy(desc(receipt.date), desc(receipt.createdAt))

    return c.json({ receipts: receipts.map(serializeReceipt) })
  })

  app.get('/api/receipts/:id', async (c) => {
    const userId = getAuthenticatedUserId(c)

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const [foundReceipt] = await db
      .select()
      .from(receipt)
      .where(and(eq(receipt.id, c.req.param('id')), eq(receipt.userId, userId)))
      .limit(1)

    if (!foundReceipt) {
      return c.json({ error: 'Receipt not found.' }, 404)
    }

    return c.json({ receipt: serializeReceipt(foundReceipt) })
  })

  app.put('/api/receipts/:id', async (c) => {
    const userId = getAuthenticatedUserId(c)

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const body = await c.req.json().catch(() => null)
    const parsed = updateReceiptSchema.safeParse(body)

    if (!parsed.success) {
      return c.json({ error: parsed.error.issues[0]?.message ?? 'Invalid receipt payload.' }, 400)
    }

    const updates: Partial<typeof receipt.$inferInsert> = {}

    if (parsed.data.merchant !== undefined) {
      updates.merchant = parsed.data.merchant
    }

    if (parsed.data.amount !== undefined) {
      updates.amount = parsed.data.amount
    }

    if (parsed.data.currency !== undefined) {
      updates.currency = parsed.data.currency
    }

    if (parsed.data.date !== undefined) {
      updates.date = parseDateOnly(parsed.data.date)
    }

    if (parsed.data.category !== undefined) {
      updates.category = parsed.data.category
    }

    if (parsed.data.paymentMethod !== undefined) {
      updates.paymentMethod = parsed.data.paymentMethod
    }

    if (parsed.data.notes !== undefined) {
      updates.notes = parsed.data.notes ?? null
    }

    if (parsed.data.status !== undefined) {
      updates.status = parsed.data.status
    }

    if (parsed.data.aiExtracted !== undefined) {
      updates.aiExtracted = parsed.data.aiExtracted
    }

    const [updatedReceipt] = await db
      .update(receipt)
      .set(updates)
      .where(and(eq(receipt.id, c.req.param('id')), eq(receipt.userId, userId)))
      .returning()

    if (!updatedReceipt) {
      return c.json({ error: 'Receipt not found.' }, 404)
    }

    return c.json({ receipt: serializeReceipt(updatedReceipt) })
  })

  app.delete('/api/receipts/:id', async (c) => {
    const userId = getAuthenticatedUserId(c)

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const [deletedReceipt] = await db
      .delete(receipt)
      .where(and(eq(receipt.id, c.req.param('id')), eq(receipt.userId, userId)))
      .returning({ id: receipt.id })

    if (!deletedReceipt) {
      return c.json({ error: 'Receipt not found.' }, 404)
    }

    return c.json({ success: true })
  })

  app.get('/api/dashboard', async (c) => {
    const userId = getAuthenticatedUserId(c)

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const parsed = dashboardQuerySchema.safeParse({
      timeFilter: c.req.query('timeFilter') ?? '30D',
    })

    if (!parsed.success) {
      return c.json({ error: parsed.error.issues[0]?.message ?? 'Invalid query parameters.' }, 400)
    }

    const startDate = getDashboardStartDate(parsed.data.timeFilter, new Date())
    const receipts = await db
      .select()
      .from(receipt)
      .where(and(eq(receipt.userId, userId), gte(receipt.date, startDate)))
      .orderBy(desc(receipt.date), desc(receipt.createdAt))

    return c.json(buildDashboard(receipts, parsed.data.timeFilter))
  })

  app.post('/api/receipts/optimize', async (c) => {
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
        category: receipt.category,
        paymentMethod: receipt.paymentMethod,
        date: receipt.date,
      })
      .from(receipt)
      .where(and(eq(receipt.userId, userId), eq(receipt.status, 'complete')))
      .orderBy(desc(receipt.date), desc(receipt.createdAt))

    const deterministicResponse = createOptimizerAnalysis(receipts, parsed.data.level)
    const optimizedResponse = await enrichOptimizerSuggestions(deterministicResponse)

    return c.json(optimizedResponse)
  })

  app.post('/api/receipts/extract', async (c) => {
    const session = c.get('session')

    if (!session) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    if (!env.OPENAI_API_KEY) {
      return c.json({ error: 'OPENAI_API_KEY is not configured.' }, 503)
    }

    try {
      const body = await c.req.parseBody()
      const file = body.file

      if (!(file instanceof File)) {
        return c.json({ error: 'A receipt image is required in the `file` field.' }, 400)
      }

      if (!file.type.startsWith('image/')) {
        return c.json({ error: 'Only image uploads are supported right now.' }, 400)
      }

      if (file.size > 10 * 1024 * 1024) {
        return c.json({ error: 'Images must be 10MB or smaller.' }, 400)
      }

      const imageBase64 = Buffer.from(await file.arrayBuffer()).toString('base64')
      const imageDataUrl = `data:${file.type};base64,${imageBase64}`
      const openai = createOpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: env.OPENAI_API_KEY,
      })

      const { output } = await generateText({
        model: openai.responses(env.OPENAI_MODEL),
        output: Output.object({
          schema: extractedReceiptSchema,
        }),
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: [
                  'You are extracting structured receipt data from a single image.',
                  'Return only the schema fields requested.',
                  'Infer pricing details, merchant, purchase date, payment method, line items, notes, and raw text when visible.',
                  'Use null when a value is not visible. Keep confidence between 0 and 1.',
                ].join(' '),
              },
              {
                type: 'image',
                image: imageDataUrl,
              },
            ],
          },
        ],
      })

      return c.json({
        fileName: file.name,
        receipt: output,
      })
    } catch (error) {
      return c.json(
        {
          error:
            error instanceof Error
              ? error.message
              : 'Receipt extraction failed unexpectedly.',
        },
        500,
      )
    }
  })
}
