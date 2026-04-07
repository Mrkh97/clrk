import { Zap, Flame } from 'lucide-react'
import { Card, CardContent } from '#/components/ui/card'
import { useOptimizerStore } from '../../stores/useOptimizerStore'
import { useOptimize } from '../../hooks/useOptimize'
import type { OptimizationLevel } from '../../types'

const LEVELS = [
  {
    id: 'easy' as OptimizationLevel,
    label: 'Easy',
    target: '10%',
    description: 'Small cuts, big impact. Trim subscriptions and reduce impulse buys.',
    icon: Zap,
  },
  {
    id: 'hard' as OptimizationLevel,
    label: 'Hard',
    target: '30%',
    description: 'Aggressive savings. Rethink habits and cut non-essentials.',
    icon: Flame,
  },
] as const

export default function LevelSelector() {
  const { selectedLevel, selectLevel } = useOptimizerStore()
  const { mutate } = useOptimize()

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="nd-mono text-[10px] uppercase tracking-widest text-[#999999]">
          Choose Your Goal
        </p>
        <h2
          className="mt-2 text-lg font-bold text-[#000]"
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
        >
          How much do you want to save?
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {LEVELS.map((level) => {
          const selected = selectedLevel === level.id
          return (
            <Card
              key={level.id}
              className={`cursor-pointer border transition-all ${
                selected
                  ? 'border-[#D71921] bg-white'
                  : 'border-[#E8E8E8] bg-white hover:border-[#CCCCCC]'
              }`}
              onClick={() => selectLevel(level.id)}
            >
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
                    selected ? 'bg-[#D71921]' : 'bg-[#F5F5F5]'
                  }`}
                >
                  <level.icon
                    size={20}
                    className={selected ? 'text-white' : 'text-[#666666]'}
                  />
                </div>
                <p
                  className="text-base font-bold text-[#000]"
                  style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
                >
                  {level.label}
                </p>
                <p className="nd-mono mt-1 text-2xl font-bold text-[#D71921]">
                  {level.target}
                </p>
                <p className="nd-mono mt-3 text-xs text-[#666666]">
                  {level.description}
                </p>
                {selected && (
                  <span className="mt-3 h-1.5 w-1.5 rounded-full bg-[#D71921]" />
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {selectedLevel && (
        <div className="flex justify-center">
          <button
            onClick={() => mutate(selectedLevel)}
            className="nd-mono rounded-lg bg-[#000] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#333]"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
          >
            Optimize My Spending
          </button>
        </div>
      )}
    </div>
  )
}
