import { apiClient, getApiErrorMessage } from '#/lib/api-client'
import type { OptimizationLevel, OptimizationResult, CutSuggestion } from '../types'

export type OptimizeRequest = {
  level: OptimizationLevel
  from: string
  to: string
}

type OptimizeResponse = {
  currency: string
  level: OptimizationLevel
  totalCurrentSpend: number
  totalSavings: number
  suggestions: CutSuggestion[]
}

export async function optimizeBudget({ level, from, to }: OptimizeRequest): Promise<OptimizationResult> {
  try {
    const { data } = await apiClient.post<OptimizeResponse>('/api/receipts/optimize', {
      level,
      from,
      to,
    })

    return {
      currency: data.currency,
      level: data.level,
      totalCurrentSpend: data.totalCurrentSpend,
      totalSavings: data.totalSavings,
      suggestions: data.suggestions,
    }
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to optimize budget.'))
  }
}
