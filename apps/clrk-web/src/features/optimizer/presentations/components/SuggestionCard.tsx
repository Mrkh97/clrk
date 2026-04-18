import { Scissors } from 'lucide-react'
import { CardContent } from '#/components/ui/card'
import GlassCard from '#/components/GlassCard'
import type { CutSuggestion } from '../../types'

export default function SuggestionCard({
  currency,
  suggestion,
}: {
  currency: string
  suggestion: CutSuggestion
}) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  })

  return (
    <GlassCard>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-muted">
              <Scissors size={14} className="text-brand" />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-foreground">
                {suggestion.merchant}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {suggestion.category}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-mono text-lg font-bold text-brand">
              -{formatter.format(suggestion.saving)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Now</p>
            <p className="font-mono text-sm font-bold text-foreground">
              {formatter.format(suggestion.currentSpend)}
            </p>
          </div>
          <div className="h-px flex-1 bg-border" />
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Target</p>
            <p className="font-mono text-sm font-bold text-foreground">
              {formatter.format(suggestion.suggestedSpend)}
            </p>
          </div>
        </div>

        <p className="mt-3 font-mono text-xs text-muted-foreground">{suggestion.reason}</p>
      </CardContent>
    </GlassCard>
  )
}
