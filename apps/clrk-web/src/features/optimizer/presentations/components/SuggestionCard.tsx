import { Scissors } from 'lucide-react'
import { Card, CardContent } from '#/components/ui/card'
import type { CutSuggestion } from '../../types'

export default function SuggestionCard({ suggestion }: { suggestion: CutSuggestion }) {
  return (
    <Card className="border border-[#E8E8E8] bg-white shadow-none">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F5F5]">
              <Scissors size={14} className="text-[#666666]" />
            </div>
            <div>
              <p
                className="text-sm font-bold text-[#000]"
                style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
              >
                {suggestion.merchant}
              </p>
              <p className="nd-mono text-[10px] uppercase tracking-widest text-[#999999]">
                {suggestion.category}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="nd-mono text-lg font-bold text-[#D71921]">
              −${suggestion.saving.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <div>
            <p className="nd-mono text-[10px] uppercase tracking-widest text-[#999999]">Now</p>
            <p className="nd-mono text-sm font-bold text-[#000]">
              ${suggestion.currentSpend.toFixed(2)}
            </p>
          </div>
          <div className="h-px flex-1 bg-[#E8E8E8]" />
          <div>
            <p className="nd-mono text-[10px] uppercase tracking-widest text-[#999999]">Target</p>
            <p className="nd-mono text-sm font-bold text-[#000]">
              ${suggestion.suggestedSpend.toFixed(2)}
            </p>
          </div>
        </div>

        <p className="nd-mono mt-3 text-xs text-[#666666]">{suggestion.reason}</p>
      </CardContent>
    </Card>
  )
}
