import type { CreateReceipt } from './schema.js'
import { seededUserId } from './seed-data.js'

type OptimizerMerchantTemplate = {
  merchant: string
  category: CreateReceipt['category']
  paymentMethod: CreateReceipt['paymentMethod']
  amountRange: [number, number]
  cadenceDays: number
  count: number
  noteTemplates: string[]
  aiExtractedBias?: number
}

type OptimizerSeedReceiptRecord = CreateReceipt & {
  id: string
  userId: string
}

const optimizerMerchantTemplates: OptimizerMerchantTemplate[] = [
  {
    merchant: 'DoorDash',
    category: 'food',
    paymentMethod: 'digital',
    amountRange: [24, 48],
    cadenceDays: 6,
    count: 18,
    aiExtractedBias: 0.78,
    noteTemplates: [
      'Late-night delivery after long workdays; convenience order with delivery fee, tip, and dessert add-ons.',
      'Weekend takeout for two instead of cooking; mostly convenience spending rather than groceries.',
      'Ordered lunch during meetings because there was no time to meal prep; includes delivery markup and service fees.',
    ],
  },
  {
    merchant: 'Starbucks',
    category: 'food',
    paymentMethod: 'digital',
    amountRange: [7, 16],
    cadenceDays: 3,
    count: 24,
    aiExtractedBias: 0.7,
    noteTemplates: [
      'Morning coffee stop before commuting; repeat convenience purchase that adds up across the month.',
      'Coffee and breakfast sandwich between meetings; habitual weekday spend rather than a planned meal.',
      'Afternoon coffee run and snack while working from a cafe; discretionary routine purchase.',
    ],
  },
  {
    merchant: 'Trader Joe\'s',
    category: 'food',
    paymentMethod: 'card',
    amountRange: [48, 112],
    cadenceDays: 8,
    count: 14,
    aiExtractedBias: 0.44,
    noteTemplates: [
      'Primary grocery run with produce, frozen meals, and pantry staples for the week.',
      'Stock-up trip for meal prep ingredients and household snacks; mostly essential spending.',
      'Weekly groceries with some convenience items but still cheaper than eating out repeatedly.',
    ],
  },
  {
    merchant: 'Uber',
    category: 'transport',
    paymentMethod: 'digital',
    amountRange: [14, 41],
    cadenceDays: 7,
    count: 14,
    aiExtractedBias: 0.62,
    noteTemplates: [
      'Ride home after staying late at the office; faster than public transit but discretionary some nights.',
      'Airport and cross-town rides when timing mattered; convenience transport that could be reduced with planning.',
      'Weekend ride instead of driving or transit; moderate convenience expense rather than a fixed bill.',
    ],
  },
  {
    merchant: 'PG&E',
    category: 'utilities',
    paymentMethod: 'card',
    amountRange: [102, 167],
    cadenceDays: 30,
    count: 8,
    aiExtractedBias: 0.2,
    noteTemplates: [
      'Monthly electricity and gas bill; essential utility expense with limited short-term flexibility.',
      'Recurring household utility payment covering power usage and basic service charges.',
    ],
  },
  {
    merchant: 'Verizon',
    category: 'utilities',
    paymentMethod: 'card',
    amountRange: [84, 111],
    cadenceDays: 30,
    count: 8,
    aiExtractedBias: 0.16,
    noteTemplates: [
      'Monthly phone plan covering unlimited data and device protection; recurring fixed bill.',
      'Recurring mobile service charge; essential communication expense unless plan is downgraded.',
    ],
  },
  {
    merchant: 'Netflix',
    category: 'entertainment',
    paymentMethod: 'digital',
    amountRange: [16, 24],
    cadenceDays: 30,
    count: 8,
    aiExtractedBias: 0.88,
    noteTemplates: [
      'Monthly streaming subscription for evening entertainment; recurring digital membership.',
      'Recurring subscription charge that could be paused or downgraded without affecting essentials.',
    ],
  },
  {
    merchant: 'Spotify',
    category: 'entertainment',
    paymentMethod: 'digital',
    amountRange: [11, 18],
    cadenceDays: 30,
    count: 8,
    aiExtractedBias: 0.9,
    noteTemplates: [
      'Recurring music subscription for work and commute listening; easy cancellation candidate if needed.',
      'Monthly premium music plan; small recurring expense but not essential.',
    ],
  },
  {
    merchant: 'Amazon',
    category: 'shopping',
    paymentMethod: 'card',
    amountRange: [22, 164],
    cadenceDays: 9,
    count: 16,
    aiExtractedBias: 0.6,
    noteTemplates: [
      'Mixed basket of home items and impulse purchases after browsing deals late at night.',
      'Convenience shopping order with some essentials but also discretionary add-ons that were not planned.',
      'Bought replacement household items plus a few nice-to-have extras; spending could be trimmed by batching needs only.',
    ],
  },
  {
    merchant: 'Target',
    category: 'shopping',
    paymentMethod: 'card',
    amountRange: [28, 126],
    cadenceDays: 14,
    count: 10,
    aiExtractedBias: 0.46,
    noteTemplates: [
      'Stopped in for toiletries and left with seasonal decor and snacks; common impulse shopping pattern.',
      'Household refill trip with several discretionary extras that could be skipped in a tighter month.',
      'Essentials run that expanded into general shopping because of in-store browsing.',
    ],
  },
  {
    merchant: 'AMC Theatres',
    category: 'entertainment',
    paymentMethod: 'card',
    amountRange: [21, 58],
    cadenceDays: 20,
    count: 7,
    aiExtractedBias: 0.68,
    noteTemplates: [
      'Movie night spending including tickets, popcorn, and drinks; entirely discretionary entertainment.',
      'Weekend theater outing; optional leisure expense that is easy to reduce in a savings push.',
    ],
  },
  {
    merchant: 'Walgreens',
    category: 'health',
    paymentMethod: 'card',
    amountRange: [13, 37],
    cadenceDays: 22,
    count: 7,
    aiExtractedBias: 0.31,
    noteTemplates: [
      'Pharmacy refill and over-the-counter essentials; mostly necessary health spending.',
      'Cold medicine and personal care essentials; not a great place to cut aggressively.',
    ],
  },
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

function getOptimizerReceiptId(merchant: string, date: string, index: number) {
  const normalizedMerchant = merchant.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return `optimizer-seed-${normalizedMerchant}-${date}-${String(index).padStart(3, '0')}`
}

export function generateOptimizerSeedReceipts(referenceDate = new Date('2026-04-15T00:00:00.000Z')) {
  const random = mulberry32(20260501)
  const receipts: OptimizerSeedReceiptRecord[] = []
  let sequence = 1

  for (const template of optimizerMerchantTemplates) {
    const startOffset = Math.floor(random() * Math.max(template.cadenceDays, 4))
    const startDate = new Date(referenceDate)
    startDate.setUTCDate(startDate.getUTCDate() - startOffset)

    for (let index = 0; index < template.count; index += 1) {
      const date = new Date(startDate)
      date.setUTCDate(date.getUTCDate() - index * template.cadenceDays)
      date.setUTCDate(date.getUTCDate() - Math.floor(random() * 3))

      const spread = template.amountRange[1] - template.amountRange[0]
      const amount = roundMoney(template.amountRange[0] + random() * spread)
      const dateString = toDateOnlyString(date)
      const note = template.noteTemplates[Math.floor(random() * template.noteTemplates.length)]
      const aiExtracted = (template.aiExtractedBias ?? 0.5) > random()

      receipts.push({
        id: getOptimizerReceiptId(template.merchant, dateString, sequence),
        userId: seededUserId,
        merchant: template.merchant,
        amount,
        currency: 'USD',
        date: dateString,
        category: template.category,
        paymentMethod: template.paymentMethod,
        notes: note,
        status: 'complete',
        aiExtracted,
      })

      sequence += 1
    }
  }

  return receipts.sort((left, right) => right.date.localeCompare(left.date) || left.merchant.localeCompare(right.merchant))
}

export function summarizeOptimizerSeedReceipts(receipts: OptimizerSeedReceiptRecord[]) {
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
    notePreview: receipts.slice(0, 6).map((receipt) => ({
      merchant: receipt.merchant,
      date: receipt.date,
      notes: receipt.notes,
    })),
  }
}
