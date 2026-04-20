import { CardContent } from '#/components/ui/card'
import { TrendingUp } from 'lucide-react'
import GlassCard from '#/components/GlassCard'

interface StatCardProps {
  label: string
  value: string
  trend?: string
  trendUp?: boolean
}

export default function StatCard({ label, value, trend, trendUp }: StatCardProps) {
  return (
    <GlassCard>
      <CardContent className="p-5">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="mt-2 break-words font-mono text-xl font-bold text-foreground sm:text-2xl">{value}</p>
        {trend && (
          <div className="mt-2 flex flex-wrap items-center gap-1">
            <TrendingUp
              size={12}
              className={trendUp ? 'text-success' : 'text-brand rotate-180'}
            />
            <span
              className={`font-mono text-[10px] ${trendUp ? 'text-success' : 'text-brand'}`}
            >
              {trend}
            </span>
          </div>
        )}
      </CardContent>
    </GlassCard>
  )
}
