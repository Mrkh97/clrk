import { createFileRoute } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import PageHeader from '#/components/PageHeader'
import { useOptimizerStore } from '#/features/optimizer/stores/useOptimizerStore'
import LevelSelector from '#/features/optimizer/presentations/components/LevelSelector'
import OptimizationResults from '#/features/optimizer/presentations/components/OptimizationResults'

export const Route = createFileRoute('/_app/optimizer')({
  component: OptimizerPage,
})

function OptimizerPage() {
  const phase = useOptimizerStore((s) => s.phase)
  const error = useOptimizerStore((s) => s.error)
  const reset = useOptimizerStore((s) => s.reset)

  return (
    <div className="min-h-full">
      <PageHeader label="Optimizer" title="Spending Optimizer" />

      <div className="mx-auto max-w-2xl p-6">
        {(phase === 'idle' || phase === 'loading') && <LevelSelector />}

        {phase === 'loading' && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-brand" />
            <p className="font-mono text-xs text-muted-foreground">Analyzing your spending...</p>
          </div>
        )}

        {phase === 'done' && <OptimizationResults />}

        {phase === 'error' && (
          <div className="mt-8 text-center">
            <p className="font-mono text-sm text-destructive">{error}</p>
            <Button
              variant="outline"
              onClick={reset}
              className="mt-4 font-mono text-xs text-muted-foreground"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
