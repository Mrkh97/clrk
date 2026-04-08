import { Button } from '#/components/ui/button'
import { useDashboardStore } from '../../stores/useDashboardStore'
import type { TimeFilter as TimeFilterType } from '../../types'

const FILTERS: TimeFilterType[] = ['7D', '30D', '3M', '6M', '1Y']

export default function TimeFilter() {
  const { timeFilter, setTimeFilter } = useDashboardStore()

  return (
    <div className="glass flex gap-1 rounded-lg p-1">
      {FILTERS.map((f) => (
        <Button
          key={f}
          variant={timeFilter === f ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setTimeFilter(f)}
          className={`flex-1 font-mono text-xs font-bold uppercase tracking-wider ${
            timeFilter === f
              ? 'bg-brand text-brand-foreground hover:bg-brand/90'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {f}
        </Button>
      ))}
    </div>
  )
}
