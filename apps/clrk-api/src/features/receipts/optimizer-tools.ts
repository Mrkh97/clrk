import { tool } from 'ai'
import { z } from 'zod'

function roundMoney(value: number) {
  return Number(value.toFixed(2))
}

function normalizeDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`)
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
  const start = normalizeDate(from)
  const end = normalizeDate(to)
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
      from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      totalSpend: z.number().nonnegative(),
    }),
    execute: async ({ from, to, totalSpend }) => calculateDateRangeMetrics(from, to, totalSpend),
  }),
}
