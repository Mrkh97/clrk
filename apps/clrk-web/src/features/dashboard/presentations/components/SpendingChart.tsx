import { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'
import type { MonthlySpend } from '../../types'

interface SpendingChartProps {
  data: MonthlySpend[]
}

function CustomTooltip({ active, payload, label }: {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-[#E8E8E8] bg-[#000] px-3 py-2 shadow-lg">
      <p className="nd-mono text-[10px] uppercase tracking-wider text-[#666666]">{label}</p>
      <p className="nd-mono text-sm font-bold text-white">
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  )
}

export default function SpendingChart({ data }: SpendingChartProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-48 animate-pulse rounded-xl bg-[#F5F5F5]" />
  }

  return (
    <ResponsiveContainer width="100%" height={192}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 10, fontFamily: 'Space Mono', fill: '#999999' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fontFamily: 'Space Mono', fill: '#999999' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#E8E8E8', strokeWidth: 1 }} />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#D71921"
          strokeWidth={2}
          dot={{ fill: '#D71921', r: 3, strokeWidth: 0 }}
          activeDot={{ fill: '#D71921', r: 5, strokeWidth: 2, stroke: '#fff' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
