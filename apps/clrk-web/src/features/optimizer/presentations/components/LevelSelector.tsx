import { Zap, Flame } from 'lucide-react'
import { CardContent } from '#/components/ui/card'
import { Button } from '#/components/ui/button'
import DatePicker from '#/components/DatePicker'
import { Label } from '#/components/ui/label'
import GlassCard from '#/components/GlassCard'
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
  const { selectedLevel, selectLevel, fromDate, toDate, setFromDate, setToDate } = useOptimizerStore()
  const { mutate } = useOptimize()
  const hasValidRange = Boolean(fromDate && toDate && fromDate <= toDate)

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Choose Your Goal
        </p>
        <h2 className="mt-2 font-display text-lg font-bold text-foreground">
          How much do you want to save?
        </h2>
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          Choose the spending window the optimizer should analyze.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            From
          </Label>
          <DatePicker value={fromDate} onChange={setFromDate} />
        </div>
        <div className="space-y-1.5">
          <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            To
          </Label>
          <DatePicker value={toDate} onChange={setToDate} />
        </div>
      </div>

      {!hasValidRange ? (
        <p className="text-center font-mono text-[10px] uppercase tracking-widest text-destructive">
          The start date must be on or before the end date.
        </p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {LEVELS.map((level) => {
          const selected = selectedLevel === level.id
          return (
            <GlassCard
              key={level.id}
              className={`cursor-pointer transition-all ${
                selected
                  ? 'border-brand shadow-[0_0_20px_var(--brand)/0.15]'
                  : 'hover:border-muted-foreground'
              }`}
              onClick={() => selectLevel(level.id)}
            >
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                    selected ? 'bg-brand' : 'bg-accent'
                  }`}
                >
                  <level.icon
                    size={20}
                    className={selected ? 'text-brand-foreground' : 'text-muted-foreground'}
                  />
                </div>
                <p className="font-display text-base font-bold text-foreground">
                  {level.label}
                </p>
                <p className="mt-1 font-mono text-2xl font-bold text-brand">
                  {level.target}
                </p>
                <p className="mt-3 font-mono text-xs text-muted-foreground">
                  {level.description}
                </p>
                {selected && (
                  <span className="mt-3 h-1.5 w-1.5 rounded-full bg-brand" />
                )}
              </CardContent>
            </GlassCard>
          )
        })}
      </div>

      {selectedLevel && (
        <div className="flex justify-center">
          <Button
            disabled={!hasValidRange}
            onClick={() => mutate({ level: selectedLevel, from: fromDate, to: toDate })}
            className="w-full bg-brand font-mono text-sm font-bold uppercase tracking-wider text-brand-foreground hover:bg-brand/90 sm:w-auto"
          >
            Optimize My Spending
          </Button>
        </div>
      )}
    </div>
  )
}
