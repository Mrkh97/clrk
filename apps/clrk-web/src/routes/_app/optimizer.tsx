import { createFileRoute } from '@tanstack/react-router'
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
      <header className="flex items-center justify-between border-b border-[#E8E8E8] bg-white px-6 py-4">
        <div>
          <p className="nd-mono text-[10px] uppercase tracking-widest text-[#999999]">
            Optimizer
          </p>
          <h1
            className="text-xl font-bold text-[#000]"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
          >
            Spending Optimizer
          </h1>
        </div>
      </header>

      <div className="mx-auto max-w-2xl p-6">
        {(phase === 'idle' || phase === 'loading') && <LevelSelector />}

        {phase === 'loading' && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#E8E8E8] border-t-[#D71921]" />
            <p className="nd-mono text-xs text-[#999999]">Analyzing your spending...</p>
          </div>
        )}

        {phase === 'done' && <OptimizationResults />}

        {phase === 'error' && (
          <div className="mt-8 text-center">
            <p className="nd-mono text-sm text-[#D71921]">{error}</p>
            <button
              onClick={reset}
              className="nd-mono mt-4 rounded-lg border border-[#E8E8E8] px-6 py-2 text-xs text-[#666666] hover:bg-[#F5F5F5]"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
