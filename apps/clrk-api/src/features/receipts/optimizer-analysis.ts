import type { ReceiptCategory } from './schema.js'

export type OptimizerLevel = 'easy' | 'hard'

export type ReceiptOptimizerInput = {
  id: string
  merchant: string
  amount: number
  category: string
  paymentMethod: string
  date: Date
}

export type OptimizerSuggestion = {
  id: string
  category: string
  merchant: string
  currentSpend: number
  suggestedSpend: number
  saving: number
  reason: string
}

export type OptimizerResponse = {
  level: OptimizerLevel
  totalCurrentSpend: number
  totalSavings: number
  suggestions: OptimizerSuggestion[]
}

type MerchantGroup = {
  id: string
  category: string
  merchant: string
  currentSpend: number
  transactionCount: number
  averageSpend: number
  recurrenceDays: number | null
  paymentMethods: string[]
}

const levelTargets: Record<OptimizerLevel, number> = {
  easy: 0.1,
  hard: 0.3,
}

const categoryCutMultipliers: Record<ReceiptCategory, number> = {
  entertainment: 1.5,
  shopping: 1.3,
  food: 0.85,
  other: 1.05,
  transport: 0.45,
  utilities: 0.18,
  health: 0.12,
}

const discretionaryKeywords = [
  'netflix',
  'spotify',
  'hulu',
  'max',
  'disney',
  'prime video',
  'youtube',
  'starbucks',
  'doordash',
  'uber eats',
  'amazon',
  'target',
  'nike',
  'best buy',
  'amc',
] as const

const essentialKeywords = [
  'shell',
  'chevron',
  'exxon',
  'costco gas',
  'pg&e',
  'coned',
  'verizon',
  'comcast',
  'at&t',
  'walgreens',
  'cvs',
  'kroger',
  'trader joe',
] as const

function roundMoney(value: number) {
  return Number(value.toFixed(2))
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function getRecurrenceDays(sortedDates: Date[]) {
  if (sortedDates.length < 3) {
    return null
  }

  const intervals: number[] = []

  for (let index = 1; index < sortedDates.length; index += 1) {
    const previous = sortedDates[index - 1]
    const current = sortedDates[index]
    const days = Math.round((current.getTime() - previous.getTime()) / (24 * 60 * 60 * 1000))

    if (days > 0) {
      intervals.push(days)
    }
  }

  if (intervals.length < 2) {
    return null
  }

  return Math.round(intervals.reduce((sum, value) => sum + value, 0) / intervals.length)
}

function groupReceipts(receipts: ReceiptOptimizerInput[]) {
  const grouped = new Map<string, MerchantGroup & { dates: Date[]; paymentMethodSet: Set<string> }>()

  for (const item of receipts) {
    const key = `${item.category}::${item.merchant.trim().toLowerCase()}`
    const existing = grouped.get(key)

    if (existing) {
      existing.currentSpend += item.amount
      existing.transactionCount += 1
      existing.dates.push(item.date)
      existing.paymentMethodSet.add(item.paymentMethod)
      continue
    }

    grouped.set(key, {
      id: key.replace(/[^a-z0-9:]/g, '-'),
      category: item.category,
      merchant: item.merchant,
      currentSpend: item.amount,
      transactionCount: 1,
      averageSpend: item.amount,
      recurrenceDays: null,
      paymentMethods: [],
      dates: [item.date],
      paymentMethodSet: new Set([item.paymentMethod]),
    })
  }

  return Array.from(grouped.values()).map((group) => {
    const sortedDates = [...group.dates].sort((left, right) => left.getTime() - right.getTime())

    return {
      id: group.id,
      category: group.category,
      merchant: group.merchant,
      currentSpend: roundMoney(group.currentSpend),
      transactionCount: group.transactionCount,
      averageSpend: roundMoney(group.currentSpend / group.transactionCount),
      recurrenceDays: getRecurrenceDays(sortedDates),
      paymentMethods: Array.from(group.paymentMethodSet.values()),
    }
  })
}

function getMerchantSignal(merchant: string) {
  const normalizedMerchant = merchant.trim().toLowerCase()

  if (discretionaryKeywords.some((keyword) => normalizedMerchant.includes(keyword))) {
    return 1.2
  }

  if (essentialKeywords.some((keyword) => normalizedMerchant.includes(keyword))) {
    return 0.45
  }

  return 1
}

function buildFallbackReason(group: MerchantGroup, level: OptimizerLevel) {
  const recurring = group.recurrenceDays !== null && group.recurrenceDays >= 20 && group.recurrenceDays <= 40
  const levelText = level === 'hard' ? 'a harder reset' : 'an easy trim'

  if (recurring && group.category === 'entertainment') {
    return `${group.merchant} looks like a recurring entertainment charge, so ${levelText} can usually come from pausing, downgrading, or sharing this subscription.`
  }

  if (group.category === 'food' && group.transactionCount >= 4) {
    return `${group.merchant} shows up frequently in food spending, so shifting a few orders to groceries or meal prep is a believable way to save here.`
  }

  if (group.category === 'shopping') {
    return `${group.merchant} is driving repeat shopping spend, which makes it a practical place to cap impulse purchases before cutting essential bills.`
  }

  if (group.category === 'other') {
    return `${group.merchant} sits in a flexible spending bucket, making it a good candidate for ${levelText} without changing fixed commitments.`
  }

  if (group.category === 'transport') {
    return `${group.merchant} is meaningful transport spend, and modest trip consolidation can usually reduce this without fully removing it.`
  }

  return `${group.merchant} is one of the larger receipt patterns in this category, so a targeted reduction here creates savings faster than spreading cuts everywhere.`
}

export function createOptimizerAnalysis(
  receipts: ReceiptOptimizerInput[],
  level: OptimizerLevel,
): OptimizerResponse {
  const totalCurrentSpend = roundMoney(receipts.reduce((sum, item) => sum + item.amount, 0))

  if (receipts.length === 0 || totalCurrentSpend === 0) {
    return {
      level,
      totalCurrentSpend,
      totalSavings: 0,
      suggestions: [],
    }
  }

  const groupedReceipts = groupReceipts(receipts)
  const targetRatio = levelTargets[level]
  const maxCutRatio = level === 'hard' ? 0.55 : 0.25
  const minSavings = level === 'hard' ? 12 : 6

  const suggestions = groupedReceipts
    .map((group) => {
      const categoryMultiplier = categoryCutMultipliers[(group.category as ReceiptCategory) ?? 'other']
        ?? categoryCutMultipliers.other
      const recurrenceMultiplier = group.recurrenceDays !== null && group.recurrenceDays >= 20 && group.recurrenceDays <= 40
        ? 1.18
        : group.transactionCount >= 4
          ? 1.08
          : 0.92
      const merchantSignal = getMerchantSignal(group.merchant)
      const rawCutRatio = targetRatio * categoryMultiplier * recurrenceMultiplier * merchantSignal
      const cutRatio = clamp(rawCutRatio, targetRatio * 0.35, maxCutRatio)
      const saving = roundMoney(group.currentSpend * cutRatio)

      if (saving < minSavings || group.currentSpend < 25) {
        return null
      }

      return {
        id: group.id,
        category: group.category,
        merchant: group.merchant,
        currentSpend: group.currentSpend,
        suggestedSpend: roundMoney(Math.max(group.currentSpend - saving, 0)),
        saving,
        reason: buildFallbackReason(group, level),
        priorityScore: saving * merchantSignal * recurrenceMultiplier,
      }
    })
    .filter((item): item is OptimizerSuggestion & { priorityScore: number } => item !== null)
    .sort((left, right) => right.priorityScore - left.priorityScore)
    .slice(0, 6)
    .map(({ priorityScore: _priorityScore, ...suggestion }) => suggestion)

  return {
    level,
    totalCurrentSpend,
    totalSavings: roundMoney(suggestions.reduce((sum, item) => sum + item.saving, 0)),
    suggestions,
  }
}
