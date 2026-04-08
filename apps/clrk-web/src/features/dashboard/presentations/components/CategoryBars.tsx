import type { CategorySpend } from '../../types'

const TOTAL_SEGMENTS = 20

const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': 'var(--category-food)',
  'Food': 'var(--category-food)',
  'Transport': 'var(--category-transport)',
  'Utilities': 'var(--category-utilities)',
  'Entertainment': 'var(--category-entertainment)',
  'Health': 'var(--category-health)',
  'Shopping': 'var(--category-shopping)',
}

function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? 'var(--category-other)'
}

interface CategoryBarsProps {
  data: CategorySpend[]
}

export default function CategoryBars({ data }: CategoryBarsProps) {
  return (
    <div className="space-y-4">
      {data.map((item) => {
        const filledCount = Math.round((item.percentage / 100) * TOTAL_SEGMENTS)
        const color = getCategoryColor(item.category)
        return (
          <div key={item.category}>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {item.category}
              </span>
              <span className="font-mono text-xs font-bold text-foreground">
                ${item.amount.toLocaleString()}
              </span>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => (
                <span
                  key={i}
                  className="h-3 flex-1 rounded-sm"
                  style={{
                    background: color,
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
