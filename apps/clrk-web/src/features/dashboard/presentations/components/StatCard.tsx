import { Card, CardContent } from '#/components/ui/card'
import { TrendingUp } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string
  trend?: string
  trendUp?: boolean
}

export default function StatCard({ label, value, trend, trendUp }: StatCardProps) {
  return (
    <Card className="border border-[#E8E8E8] bg-white shadow-none">
      <CardContent className="p-5">
        <p className="nd-mono text-[10px] uppercase tracking-widest text-[#999999]">{label}</p>
        <p className="nd-mono mt-2 text-2xl font-bold text-[#000]">{value}</p>
        {trend && (
          <div className="mt-2 flex items-center gap-1">
            <TrendingUp
              size={12}
              className={trendUp ? 'text-[#4A9E5C]' : 'text-[#D71921] rotate-180'}
            />
            <span
              className={`nd-mono text-[10px] ${trendUp ? 'text-[#4A9E5C]' : 'text-[#D71921]'}`}
            >
              {trend}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
