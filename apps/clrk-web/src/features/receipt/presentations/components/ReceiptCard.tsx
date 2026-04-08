import { CardContent } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import GlassCard from '#/components/GlassCard'
import StatusBadge from '#/components/StatusBadge'
import type { Receipt } from '../../types'

const CATEGORY_LABELS: Record<string, string> = {
  food: 'Food & Dining',
  transport: 'Transport',
  utilities: 'Utilities',
  entertainment: 'Entertainment',
  health: 'Health',
  shopping: 'Shopping',
  other: 'Other',
}

interface ReceiptCardProps {
  receipt: Receipt
  onClick?: () => void
}

export default function ReceiptCard({ receipt, onClick }: ReceiptCardProps) {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: receipt.currency,
  }).format(receipt.amount)

  const formattedDate = new Date(receipt.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const statusMap: Record<string, 'completed' | 'pending' | 'processing' | 'error'> = {
    complete: 'completed',
    pending: 'pending',
    processing: 'processing',
    error: 'error',
  }

  return (
    <GlassCard
      className="cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md"
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Header row */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{receipt.merchant}</p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {CATEGORY_LABELS[receipt.category]}
            </p>
          </div>
          {receipt.aiExtracted && (
            <span className="flex-shrink-0 rounded border border-brand/30 bg-brand-muted px-1.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-brand">
              AI
            </span>
          )}
        </div>

        {/* Amount */}
        <p className="font-mono text-lg font-bold text-foreground">{formattedAmount}</p>

        {/* Footer row */}
        <div className="mt-3 flex items-center justify-between">
          <p className="font-mono text-[10px] text-muted-foreground">{formattedDate}</p>
          <StatusBadge status={statusMap[receipt.status] ?? 'pending'} />
        </div>

        {/* Payment method badge */}
        <div className="mt-2">
          <Badge
            variant="outline"
            className="border-border bg-accent font-mono text-[9px] uppercase tracking-wider text-muted-foreground"
          >
            {receipt.paymentMethod}
          </Badge>
        </div>
      </CardContent>
    </GlassCard>
  )
}
