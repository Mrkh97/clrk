import PageHeader from '#/components/PageHeader'
import { Button } from '#/components/ui/button'
import { useOptimizerStore } from '../../stores/useOptimizerStore'
import LevelSelector from './LevelSelector'
import OptimizationResults from './OptimizationResults'

export default function OptimizerPage() {
  const store = useOptimizerStore((state) => state)

  return (
    <div className="min-h-full">
      <PageHeader label="Optimizer" title="Spending Optimizer" />

      <div className="mx-auto max-w-2xl p-6">
        {(store.phase === 'idle' || store.phase === 'loading') && (
          <LevelSelector />
        )}

        {store.phase === 'loading' && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-brand" />
            <p className="font-mono text-xs text-muted-foreground">
              Analyzing your spending...
            </p>
          </div>
        )}

        {store.phase === 'done' && <OptimizationResults />}

        {store.phase === 'error' && (
          <div className="mt-8 text-center">
            <p className="font-mono text-sm text-destructive">{store.error}</p>
            <Button
              variant="outline"
              onClick={store.reset}
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
