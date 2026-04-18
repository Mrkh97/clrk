import { useMutation } from '@tanstack/react-query'
import { apiBaseUrl } from '#/lib/auth-client'
import type { OptimizationLevel, OptimizationResult, CutSuggestion } from '../types'
import { useOptimizerStore } from '../stores/useOptimizerStore'

type OptimizeResponse = {
  level: OptimizationLevel
  totalCurrentSpend: number
  totalSavings: number
  suggestions: CutSuggestion[]
}

async function parseError(response: Response) {
  try {
    const payload = (await response.json()) as { error?: string; message?: string }
    return payload.error ?? payload.message ?? 'Unable to optimize budget.'
  } catch {
    return 'Unable to optimize budget.'
  }
}

async function optimize(level: OptimizationLevel): Promise<OptimizationResult> {
  const response = await fetch(`${apiBaseUrl}/api/receipts/optimize`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ level }),
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  const payload = (await response.json()) as OptimizeResponse

  return {
    level: payload.level,
    totalCurrentSpend: payload.totalCurrentSpend,
    totalSavings: payload.totalSavings,
    suggestions: payload.suggestions,
  }
}

export function useOptimize() {
  const { setResult, setError, setPhase } = useOptimizerStore()

  return useMutation({
    mutationFn: optimize,
    onMutate: () => setPhase('loading'),
    onSuccess: (data) => setResult(data),
    onError: (err) => setError(err instanceof Error ? err.message : 'Something went wrong'),
  })
}
