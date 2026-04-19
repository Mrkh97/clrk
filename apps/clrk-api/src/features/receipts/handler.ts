import { createOpenAI } from '@ai-sdk/openai'
import { utc } from '@date-fns/utc'
import { generateText, Output } from 'ai'
import {
  differenceInCalendarDays,
  eachMonthOfInterval,
  format,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from 'date-fns'
import { and, desc, eq, gte, lte } from 'drizzle-orm'
import type { Handler } from 'hono'
import { db } from '@/db/index.js'
import { receipt } from '@/db/schema.js'
import { env } from '@/lib/env.js'
import { ANALYTICS_CURRENCY, DEFAULT_RECEIPT_CURRENCY, resolveReceiptCurrency } from '@/utils/currency.js'
import { formatUtcDate, parseUtcDateOnly, toUtcDayEnd, toUtcDayStart } from '@/utils/date.js'
import { normalizeMoneyRecordsToCurrency } from '@/utils/exchange-rates.js'
import type { AppContext, AppEnv } from '../authentication/index.js'
import {
  createReceiptSchema,
  dashboardQuerySchema,
  extractedReceiptSchema,
  receiptQuerySchema,
  updateReceiptSchema,
  type DashboardTimeFilter,
  type ReceiptCategory,
} from './schema.js'

type ReceiptRecord = typeof receipt.$inferSelect

function getAuthenticatedUserId(c: AppContext) {
  const user = c.get('user')

  if (!user) {
    return null
  }

  return user.id
}

function serializeReceipt(row: ReceiptRecord) {
  return {
    id: row.id,
    merchant: row.merchant,
    amount: row.amount,
    currency: row.currency,
    date: formatUtcDate(row.date),
    category: row.category,
    paymentMethod: row.paymentMethod,
    notes: row.notes,
    status: row.status,
    aiExtracted: row.aiExtracted,
  }
}

function getDashboardStartDate(timeFilter: DashboardTimeFilter, now: Date) {
  switch (timeFilter) {
    case '7D':
      return startOfDay(subDays(now, 6, { in: utc }), { in: utc })
    case '30D':
      return startOfDay(subDays(now, 29, { in: utc }), { in: utc })
    case '3M':
      return startOfMonth(subMonths(now, 2, { in: utc }), { in: utc })
    case '6M':
      return startOfMonth(subMonths(now, 5, { in: utc }), { in: utc })
    case '1Y':
      return startOfMonth(subMonths(now, 11, { in: utc }), { in: utc })
  }
}

function getDashboardDaySpan(timeFilter: DashboardTimeFilter, startDate: Date, endDate: Date) {
  if (timeFilter === '7D') {
    return 7
  }

  if (timeFilter === '30D') {
    return 30
  }

  return Math.max(1, differenceInCalendarDays(endDate, startDate, { in: utc }) + 1)
}

function getMonthBucketKey(value: Date) {
  return format(startOfMonth(value, { in: utc }), 'yyyy-MM', { in: utc })
}

function buildMonthlyBuckets(startDate: Date, endDate: Date) {
  return eachMonthOfInterval(
    {
      start: startOfMonth(startDate, { in: utc }),
      end: startOfMonth(endDate, { in: utc }),
    },
    { in: utc },
  ).map((value) => ({
    key: format(value, 'yyyy-MM', { in: utc }),
    label: format(value, 'MMM yy', { in: utc }),
    amount: 0,
  }))
}

function buildDashboard(
  receipts: ReceiptRecord[],
  timeFilter: DashboardTimeFilter,
  normalizedReceipts: ReceiptRecord[] = receipts,
) {
  const now = new Date()
  const startDate = getDashboardStartDate(timeFilter, now)
  const daySpan = getDashboardDaySpan(timeFilter, startDate, now)
  const totalSpent = normalizedReceipts.reduce((sum, item) => sum + item.amount, 0)
  const categoryTotals = new Map<ReceiptCategory, number>()
  const monthlyBuckets = buildMonthlyBuckets(startDate, now)
  const monthlyIndex = new Map(monthlyBuckets.map((bucket) => [bucket.key, bucket]))

  for (const item of normalizedReceipts) {
    const category = item.category as ReceiptCategory
    categoryTotals.set(category, (categoryTotals.get(category) ?? 0) + item.amount)

    const monthBucket = monthlyIndex.get(getMonthBucketKey(item.date))
    if (monthBucket) {
      monthBucket.amount += item.amount
    }
  }

  const topCategoryEntry = Array.from(categoryTotals.entries()).sort((left, right) => right[1] - left[1])[0]

  return {
    currency: ANALYTICS_CURRENCY,
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
      currency: item.currency,
      date: formatUtcDate(item.date),
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

export const createReceiptHandler: Handler<AppEnv> = async (c) => {
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
      date: parseUtcDateOnly(parsed.data.date),
      category: parsed.data.category,
      paymentMethod: parsed.data.paymentMethod,
      notes: parsed.data.notes ?? null,
      status: parsed.data.status,
      aiExtracted: parsed.data.aiExtracted,
    })
    .returning()

  return c.json({ receipt: serializeReceipt(createdReceipt) }, 201)
}

export const listReceiptsHandler: Handler<AppEnv> = async (c) => {
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
    filters.push(gte(receipt.date, toUtcDayStart(parsed.data.from)))
  }

  if (parsed.data.to) {
    filters.push(lte(receipt.date, toUtcDayEnd(parsed.data.to)))
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
}

export const getReceiptHandler: Handler<AppEnv> = async (c) => {
  const userId = getAuthenticatedUserId(c)
  const receiptId = c.req.param('id')

  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  if (!receiptId) {
    return c.json({ error: 'Receipt id is required.' }, 400)
  }

  const [foundReceipt] = await db
    .select()
    .from(receipt)
    .where(and(eq(receipt.id, receiptId), eq(receipt.userId, userId)))
    .limit(1)

  if (!foundReceipt) {
    return c.json({ error: 'Receipt not found.' }, 404)
  }

  return c.json({ receipt: serializeReceipt(foundReceipt) })
}

export const updateReceiptHandler: Handler<AppEnv> = async (c) => {
  const userId = getAuthenticatedUserId(c)
  const receiptId = c.req.param('id')

  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  if (!receiptId) {
    return c.json({ error: 'Receipt id is required.' }, 400)
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
    updates.date = parseUtcDateOnly(parsed.data.date)
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
    .where(and(eq(receipt.id, receiptId), eq(receipt.userId, userId)))
    .returning()

  if (!updatedReceipt) {
    return c.json({ error: 'Receipt not found.' }, 404)
  }

  return c.json({ receipt: serializeReceipt(updatedReceipt) })
}

export const deleteReceiptHandler: Handler<AppEnv> = async (c) => {
  const userId = getAuthenticatedUserId(c)
  const receiptId = c.req.param('id')

  if (!userId) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  if (!receiptId) {
    return c.json({ error: 'Receipt id is required.' }, 400)
  }

  const [deletedReceipt] = await db
    .delete(receipt)
    .where(and(eq(receipt.id, receiptId), eq(receipt.userId, userId)))
    .returning({ id: receipt.id })

  if (!deletedReceipt) {
    return c.json({ error: 'Receipt not found.' }, 404)
  }

  return c.json({ success: true })
}

export const dashboardHandler: Handler<AppEnv> = async (c) => {
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

  let normalizedReceipts: typeof receipts

  try {
    normalizedReceipts = await normalizeMoneyRecordsToCurrency(receipts, ANALYTICS_CURRENCY)
  } catch (error) {
    return c.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unable to normalize dashboard amounts right now.',
      },
      503,
    )
  }

  return c.json(buildDashboard(receipts, parsed.data.timeFilter, normalizedReceipts))
}

export const extractReceiptHandler: Handler<AppEnv> = async (c) => {
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
    const receiptExtractionModel = 'gpt-5.4-nano'
    const openai = createOpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: env.OPENAI_API_KEY,
    })

    const { output } = await generateText({
      model: openai.responses(receiptExtractionModel),
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
                'Use ISO 4217 currency codes like TRY, USD, EUR, or GBP when the receipt currency is visible.',
                'Infer pricing details, merchant, purchase date, payment method, line items, raw text, and a short spending summary.',
                'Set `notes` to a concise 1-2 sentence summary describing what was purchased, how the money was spent, and any payment context that would help future budget optimization.',
                'If currency is not visible or cannot be inferred confidently, return null for currency. Keep confidence between 0 and 1.',
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

    const extractedReceipt = {
      ...output,
      currency: resolveReceiptCurrency(output.currency, DEFAULT_RECEIPT_CURRENCY),
    }

    return c.json({
      fileName: file.name,
      receipt: extractedReceipt,
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
}
