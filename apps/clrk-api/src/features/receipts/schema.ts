import { z } from 'zod'

export const receiptCategories = [
  'food',
  'transport',
  'utilities',
  'entertainment',
  'health',
  'shopping',
  'other',
] as const

export const dashboardTimeFilters = ['7D', '30D', '3M', '6M', '1Y'] as const
export const receiptStatuses = ['pending', 'processing', 'complete', 'error'] as const
export const paymentMethods = ['cash', 'card', 'digital'] as const

export const receiptCategorySchema = z.enum(receiptCategories)
export const dashboardTimeFilterSchema = z.enum(dashboardTimeFilters)
export const receiptStatusSchema = z.enum(receiptStatuses)
export const paymentMethodSchema = z.enum(paymentMethods)

const receiptDateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must use YYYY-MM-DD format.')
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00.000Z`)
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
  }, 'Date must be a real calendar date.')

const optionalTrimmedString = z
  .string()
  .trim()
  .transform((value) => (value.length > 0 ? value : null))

export const receiptBaseSchema = z.object({
  merchant: z.string().trim().min(1),
  amount: z.number().finite().nonnegative(),
  currency: z.string().trim().min(1).default('USD'),
  date: receiptDateSchema,
  category: receiptCategorySchema,
  paymentMethod: paymentMethodSchema,
  notes: optionalTrimmedString.optional().nullable(),
  status: receiptStatusSchema.default('complete'),
  aiExtracted: z.boolean().default(false),
})

export const createReceiptSchema = receiptBaseSchema

export const updateReceiptSchema = receiptBaseSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  'At least one field must be provided.',
)

export const receiptQuerySchema = z
  .object({
    from: receiptDateSchema.optional(),
    to: receiptDateSchema.optional(),
    category: receiptCategorySchema.optional(),
  })
  .refine(
    (value) => {
      if (!value.from || !value.to) {
        return true
      }

      return value.from <= value.to
    },
    {
      message: '`from` must be on or before `to`.',
      path: ['from'],
    },
  )

export const dashboardQuerySchema = z.object({
  timeFilter: dashboardTimeFilterSchema,
})

export const optimizerLevelSchema = z.enum(['easy', 'hard'])

export const optimizerRequestSchema = z.object({
  level: optimizerLevelSchema,
})

export const extractedReceiptSchema = z.object({
  merchant: z.string().nullable(),
  currency: z.string().nullable(),
  date: z.string().nullable(),
  subtotal: z.number().nullable(),
  tax: z.number().nullable(),
  tip: z.number().nullable(),
  total: z.number().nullable(),
  paymentMethod: z.enum(['cash', 'card', 'digital']).nullable(),
  notes: z.string().nullable(),
  rawText: z.string().nullable(),
  confidence: z.number().min(0).max(1),
  items: z.array(
    z.object({
      name: z.string(),
      quantity: z.number().nullable(),
      unitPrice: z.number().nullable(),
      totalPrice: z.number().nullable(),
    }),
  ),
})

export type ExtractedReceipt = z.infer<typeof extractedReceiptSchema>
export type ReceiptCategory = z.infer<typeof receiptCategorySchema>
export type DashboardTimeFilter = z.infer<typeof dashboardTimeFilterSchema>
export type CreateReceipt = z.infer<typeof createReceiptSchema>
export type UpdateReceipt = z.infer<typeof updateReceiptSchema>
export type OptimizerLevel = z.infer<typeof optimizerLevelSchema>
