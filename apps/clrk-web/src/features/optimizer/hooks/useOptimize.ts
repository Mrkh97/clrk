import { useMutation } from '@tanstack/react-query'
import type { OptimizationLevel, OptimizationResult, CutSuggestion } from '../types'
import { useOptimizerStore } from '../stores/useOptimizerStore'

const MOCK_SUGGESTIONS: CutSuggestion[] = [
  {
    id: '1',
    category: 'Entertainment',
    merchant: 'Netflix',
    currentSpend: 15.99,
    suggestedSpend: 0,
    saving: 15.99,
    reason: 'You haven\'t watched anything in the last 3 weeks. Consider cancelling or pausing.',
  },
  {
    id: '2',
    category: 'Food & Dining',
    merchant: 'DoorDash',
    currentSpend: 186,
    suggestedSpend: 80,
    saving: 106,
    reason: 'You ordered delivery 12 times this month. Cooking 3x more per week saves ~$106.',
  },
  {
    id: '3',
    category: 'Entertainment',
    merchant: 'Spotify',
    currentSpend: 9.99,
    suggestedSpend: 0,
    saving: 9.99,
    reason: 'Duplicate service — you also have Apple Music. Pick one.',
  },
  {
    id: '4',
    category: 'Transport',
    merchant: 'Uber',
    currentSpend: 145,
    suggestedSpend: 60,
    saving: 85,
    reason: 'Several short rides under 2 miles. Walking or biking for those saves ~$85.',
  },
  {
    id: '5',
    category: 'Shopping',
    merchant: 'Amazon',
    currentSpend: 312,
    suggestedSpend: 200,
    saving: 112,
    reason: 'Impulse purchases detected. Adding a 48-hour wait rule could save ~$112.',
  },
]

const TOTAL_SPEND = 2380

function generateResult(level: OptimizationLevel): OptimizationResult {
  const targetPct = level === 'easy' ? 0.1 : 0.3
  const targetSaving = TOTAL_SPEND * targetPct

  let accumulated = 0
  const selected: CutSuggestion[] = []

  for (const s of MOCK_SUGGESTIONS) {
    if (accumulated >= targetSaving) break
    selected.push(s)
    accumulated += s.saving
  }

  return {
    level,
    totalCurrentSpend: TOTAL_SPEND,
    totalSavings: selected.reduce((sum, s) => sum + s.saving, 0),
    suggestions: selected,
  }
}

export function useOptimize() {
  const { setResult, setError, setPhase } = useOptimizerStore()

  return useMutation({
    mutationFn: (level: OptimizationLevel) =>
      new Promise<OptimizationResult>((resolve) => {
        setTimeout(() => resolve(generateResult(level)), 1500)
      }),
    onMutate: () => setPhase('loading'),
    onSuccess: (data) => setResult(data),
    onError: (err) => setError(err instanceof Error ? err.message : 'Something went wrong'),
  })
}
