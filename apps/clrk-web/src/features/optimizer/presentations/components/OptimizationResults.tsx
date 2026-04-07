import { RotateCcw } from 'lucide-react'
import { useOptimizerStore } from '../../stores/useOptimizerStore'
import SuggestionCard from './SuggestionCard'

export default function OptimizationResults() {
  const { result, reset } = useOptimizerStore()

  if (!result) return null

  const pct = ((result.totalSavings / result.totalCurrentSpend) * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="nd-card p-6 text-center">
        <p className="nd-mono text-[10px] uppercase tracking-widest text-[#999999]">
          Potential Monthly Savings
        </p>
        <p
          className="mt-2 text-3xl font-bold text-[#D71921]"
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
        >
          ${result.totalSavings.toFixed(2)}
        </p>
        <p className="nd-mono mt-1 text-xs text-[#666666]">
          {pct}% of ${result.totalCurrentSpend.toLocaleString()} monthly spend
        </p>
      </div>

      {/* Suggestions */}
      <div>
        <p className="nd-mono mb-3 text-[10px] uppercase tracking-widest text-[#999999]">
          Suggestions ({result.suggestions.length})
        </p>
        <div className="space-y-3">
          {result.suggestions.map((s) => (
            <SuggestionCard key={s.id} suggestion={s} />
          ))}
        </div>
      </div>

      {/* Reset */}
      <div className="flex justify-center">
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-lg border border-[#E8E8E8] px-6 py-2.5 text-sm font-medium text-[#666666] transition-colors hover:bg-[#F5F5F5] hover:text-[#000]"
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
        >
          <RotateCcw size={14} />
          Try Different Level
        </button>
      </div>
    </div>
  )
}
