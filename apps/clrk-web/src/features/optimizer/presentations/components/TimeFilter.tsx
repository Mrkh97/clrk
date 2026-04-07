import { useOptimizerStore } from '../../stores/useOptimizerStore'
import type { TimeFilter as TimeFilterType } from '../../types'

const FILTERS: TimeFilterType[] = ['7D', '30D', '3M', '6M', '1Y']

export default function TimeFilter() {
  const { timeFilter, setTimeFilter } = useOptimizerStore()

  return (
    <div className="flex gap-1 rounded-lg border border-[#E8E8E8] bg-white p-1">
      {FILTERS.map((f) => (
        <button
          key={f}
          onClick={() => setTimeFilter(f)}
          className={`nd-mono flex-1 rounded-md py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
            timeFilter === f
              ? 'bg-[#000] text-white'
              : 'text-[#666666] hover:bg-[#F5F5F5] hover:text-[#000]'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  )
}
