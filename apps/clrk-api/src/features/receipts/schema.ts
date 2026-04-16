import { z } from 'zod'

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
