import { RotateCcw } from 'lucide-react'
import { Button } from '#/components/ui/button'
import GlassCard from '#/components/GlassCard'
import { useOptimizerStore } from '../../stores/useOptimizerStore'
import SuggestionCard from './SuggestionCard'

export default function OptimizationResults() {
  const { result, reset } = useOptimizerStore()

  if (!result) return null

  const pct = ((result.totalSavings / result.totalCurrentSpend) * 100).toFixed(1)
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: result.currency,
  })

  return (
    <div className="space-y-6">
      <GlassCard variant="elevated" className="p-5 text-center sm:p-6">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Potential Monthly Savings
        </p>
        <p className="mt-2 font-display text-3xl font-bold text-brand">
          {formatter.format(result.totalSavings)}
        </p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          {pct}% of {formatter.format(result.totalCurrentSpend)} monthly spend
        </p>
      </GlassCard>

      <div>
        <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Suggestions ({result.suggestions.length})
        </p>
        <div className="space-y-3">
          {result.suggestions.map((s) => (
            <SuggestionCard key={s.id} currency={result.currency} suggestion={s} />
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={reset}
          className="w-full gap-2 text-muted-foreground hover:text-foreground sm:w-auto"
        >
          <RotateCcw size={14} />
          Try Different Level
        </Button>
      </div>
    </div>
  )
}
