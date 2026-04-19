import { seededUserId } from '@/utils/seed.js'
import type { CreateReceipt } from './schema.js'

type MerchantTemplate = {
  merchant: string
  category: CreateReceipt['category']
  paymentMethod: CreateReceipt['paymentMethod']
  amountRange: [number, number]
  cadenceDays: number
  count: number
  notes?: string
  aiExtractedBias?: number
}

type SeededReceiptRecord = CreateReceipt & {
  id: string
  userId: string
}

const merchantTemplates: MerchantTemplate[] = [
  { merchant: 'Trader Joe\'s', category: 'food', paymentMethod: 'card', amountRange: [42, 118], cadenceDays: 9, count: 18, notes: 'Weekly grocery run' },
  { merchant: 'Whole Foods Market', category: 'food', paymentMethod: 'card', amountRange: [28, 76], cadenceDays: 16, count: 11, notes: 'Top-up groceries and snacks' },
  { merchant: 'Starbucks', category: 'food', paymentMethod: 'digital', amountRange: [6, 15], cadenceDays: 4, count: 22, notes: 'Coffee and breakfast' },
  { merchant: 'DoorDash', category: 'food', paymentMethod: 'digital', amountRange: [21, 49], cadenceDays: 10, count: 12, notes: 'Takeout delivery' },
  { merchant: 'Shell', category: 'transport', paymentMethod: 'card', amountRange: [38, 69], cadenceDays: 13, count: 12, notes: 'Fuel refill' },
  { merchant: 'Uber', category: 'transport', paymentMethod: 'digital', amountRange: [12, 36], cadenceDays: 8, count: 14, notes: 'Airport and city rides' },
  { merchant: 'PG&E', category: 'utilities', paymentMethod: 'card', amountRange: [96, 154], cadenceDays: 30, count: 8, notes: 'Electricity bill' },
  { merchant: 'Verizon', category: 'utilities', paymentMethod: 'card', amountRange: [82, 108], cadenceDays: 30, count: 8, notes: 'Mobile phone plan' },
  { merchant: 'Netflix', category: 'entertainment', paymentMethod: 'digital', amountRange: [15, 24], cadenceDays: 30, count: 8, notes: 'Monthly streaming subscription' },
  { merchant: 'Spotify', category: 'entertainment', paymentMethod: 'digital', amountRange: [11, 17], cadenceDays: 30, count: 8, notes: 'Music streaming subscription' },
  { merchant: 'AMC Theatres', category: 'entertainment', paymentMethod: 'card', amountRange: [18, 54], cadenceDays: 21, count: 7, notes: 'Movies and snacks' },
  { merchant: 'Amazon', category: 'shopping', paymentMethod: 'card', amountRange: [19, 142], cadenceDays: 11, count: 13, notes: 'Household and impulse purchases' },
  { merchant: 'Target', category: 'shopping', paymentMethod: 'card', amountRange: [24, 116], cadenceDays: 18, count: 9, notes: 'Home essentials with extras' },
  { merchant: 'Nike', category: 'shopping', paymentMethod: 'card', amountRange: [45, 138], cadenceDays: 37, count: 4, notes: 'Athleisure and shoe purchases' },
  { merchant: 'Walgreens', category: 'health', paymentMethod: 'card', amountRange: [14, 39], cadenceDays: 24, count: 6, notes: 'OTC medication and pharmacy essentials' },
  { merchant: 'ClassPass', category: 'health', paymentMethod: 'digital', amountRange: [49, 82], cadenceDays: 30, count: 7, notes: 'Fitness membership' },
  { merchant: 'Apple', category: 'other', paymentMethod: 'card', amountRange: [3, 19], cadenceDays: 30, count: 7, notes: 'App subscriptions and iCloud storage' },
  { merchant: 'Petco', category: 'other', paymentMethod: 'card', amountRange: [22, 67], cadenceDays: 27, count: 6, notes: 'Pet food and supplies' },
]

function mulberry32(seed: number) {
  let state = seed

  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function roundMoney(value: number) {
  return Number(value.toFixed(2))
}

function toDateOnlyString(value: Date) {
  return value.toISOString().slice(0, 10)
}

function getReceiptId(merchant: string, date: string, index: number) {
  const normalizedMerchant = merchant.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return `seed-receipt-${normalizedMerchant}-${date}-${String(index).padStart(3, '0')}`
}

export function generateSeedReceipts(referenceDate = new Date('2026-04-15T00:00:00.000Z')) {
  const random = mulberry32(20260415)
  const receipts: SeededReceiptRecord[] = []
  let sequence = 1

  for (const template of merchantTemplates) {
    const startOffset = Math.floor(random() * template.cadenceDays)
    const startDate = new Date(referenceDate)
    startDate.setUTCDate(startDate.getUTCDate() - startOffset)

    for (let index = 0; index < template.count; index += 1) {
      const date = new Date(startDate)
      date.setUTCDate(date.getUTCDate() - index * template.cadenceDays)
      date.setUTCDate(date.getUTCDate() - Math.floor(random() * 3))

      const spread = template.amountRange[1] - template.amountRange[0]
      const amount = roundMoney(template.amountRange[0] + random() * spread)
      const aiExtracted = (template.aiExtractedBias ?? 0.35) > random()
      const dateString = toDateOnlyString(date)

      receipts.push({
        id: getReceiptId(template.merchant, dateString, sequence),
        userId: seededUserId,
        merchant: template.merchant,
        amount,
        currency: 'USD',
        date: dateString,
        category: template.category,
        paymentMethod: template.paymentMethod,
        notes: template.notes ?? null,
        status: 'complete',
        aiExtracted,
      })

      sequence += 1
    }
  }

  return receipts.sort((left, right) => right.date.localeCompare(left.date) || left.merchant.localeCompare(right.merchant))
}

export function summarizeSeedReceipts(receipts: SeededReceiptRecord[]) {
  const categoryTotals = new Map<string, number>()
  const merchantTotals = new Map<string, number>()

  for (const receipt of receipts) {
    categoryTotals.set(receipt.category, (categoryTotals.get(receipt.category) ?? 0) + receipt.amount)
    merchantTotals.set(receipt.merchant, (merchantTotals.get(receipt.merchant) ?? 0) + receipt.amount)
  }

  return {
    userId: seededUserId,
    count: receipts.length,
    totalSpend: roundMoney(receipts.reduce((sum, receipt) => sum + receipt.amount, 0)),
    categoryTotals: Array.from(categoryTotals.entries())
      .sort((left, right) => right[1] - left[1])
      .map(([category, total]) => ({ category, total: roundMoney(total) })),
    topMerchants: Array.from(merchantTotals.entries())
      .sort((left, right) => right[1] - left[1])
      .slice(0, 8)
      .map(([merchant, total]) => ({ merchant, total: roundMoney(total) })),
  }
}

export { seededUserId }
