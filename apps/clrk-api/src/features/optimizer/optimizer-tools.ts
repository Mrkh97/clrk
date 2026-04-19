import { tool } from 'ai'
import { z } from 'zod'
import { isValidDateOnlyInput, parseUtcDateOnly } from '@/utils/date.js'

const optimizerDateInputSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => isValidDateOnlyInput(value), 'Date must be a real calendar date.')

function roundMoney(value: number) {
  return Number(value.toFixed(2))
}

export function calculateSavingsMetrics(currentSpend: number, suggestedSpend: number) {
  const saving = roundMoney(Math.max(currentSpend - suggestedSpend, 0))
  const savingRate = currentSpend <= 0 ? 0 : roundMoney((saving / currentSpend) * 100)

  return {
    saving,
    savingRate,
  }
}

export function calculateDateRangeMetrics(from: string, to: string, totalSpend: number) {
  const start = parseUtcDateOnly(from)
  const end = parseUtcDateOnly(to)
  const millisecondsPerDay = 24 * 60 * 60 * 1000
  const inclusiveDays = Math.max(
    1,
    Math.floor((end.getTime() - start.getTime()) / millisecondsPerDay) + 1,
  )
  const averageDailySpend = roundMoney(totalSpend / inclusiveDays)
  const averageMonthlySpend = roundMoney(averageDailySpend * 30)

  return {
    inclusiveDays,
    averageDailySpend,
    averageMonthlySpend,
  }
}

export const optimizerCalculationTools = {
  calculateSavingsMetrics: tool({
    description:
      'Calculate the exact savings amount and savings percentage between current spend and suggested spend.',
    inputSchema: z.object({
      currentSpend: z.number().nonnegative(),
      suggestedSpend: z.number().nonnegative(),
    }),
    execute: async ({ currentSpend, suggestedSpend }) =>
      calculateSavingsMetrics(currentSpend, suggestedSpend),
  }),
  calculateDateRangeMetrics: tool({
    description:
      'Calculate the inclusive number of days in the analysis window plus average daily and monthly spend for that period.',
    inputSchema: z.object({
      from: optimizerDateInputSchema,
      to: optimizerDateInputSchema,
      totalSpend: z.number().nonnegative(),
    }),
    execute: async ({ from, to, totalSpend }) => calculateDateRangeMetrics(from, to, totalSpend),
  }),
}
