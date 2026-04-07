import type { CategorySpend } from '../../types'

const TOTAL_SEGMENTS = 20

interface CategoryBarsProps {
  data: CategorySpend[]
}

export default function CategoryBars({ data }: CategoryBarsProps) {
  return (
    <div className="space-y-4">
      {data.map((item) => {
        const filledCount = Math.round((item.percentage / 100) * TOTAL_SEGMENTS)
        return (
          <div key={item.category}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="nd-mono text-[10px] uppercase tracking-wider text-[#666666]">
                {item.category}
              </span>
              <span className="nd-mono text-xs font-bold text-[#000]">
                ${item.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
                <span
                  key={i}
                  className="h-3 flex-1 rounded-sm"
                  style={{
                    background: '#D71921',
                    opacity: i < filledCount ? 1 : 0.1,
                  }}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
