import { useMutation } from '@tanstack/react-query'
import { optimizeBudget } from '../data/remote-optimizer-repository'
import { useOptimizerStore } from '../stores/useOptimizerStore'

export function useOptimize() {
  const { setResult, setError, setPhase } = useOptimizerStore()

  return useMutation({
    mutationFn: optimizeBudget,
    onMutate: () => setPhase('loading'),
    onSuccess: (data) => setResult(data),
    onError: (err) => setError(err instanceof Error ? err.message : 'Something went wrong'),
  })
}
