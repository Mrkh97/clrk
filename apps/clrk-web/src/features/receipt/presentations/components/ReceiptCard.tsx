import { CardContent } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import GlassCard from '#/components/GlassCard'
import StatusBadge from '#/components/StatusBadge'
import { RECEIPT_CATEGORY_LABELS, type Receipt } from '../../types'

function formatDateOnly(value: string) {
  const [year, month, day] = value.split('-').map(Number)

  if (!year || !month || !day) {
    return value
  }

  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

interface ReceiptCardProps {
  receipt: Receipt
  onClick?: () => void
  onDelete?: () => void
  isDeleting?: boolean
  selected?: boolean
}

export default function ReceiptCard({ receipt, onClick, onDelete, isDeleting, selected }: ReceiptCardProps) {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: receipt.currency,
  }).format(receipt.amount)

  const formattedDate = formatDateOnly(receipt.date)

  const statusMap: Record<string, 'completed' | 'pending' | 'processing' | 'error'> = {
    complete: 'completed',
    pending: 'pending',
    processing: 'processing',
    error: 'error',
  }

  return (
    <GlassCard
      className={`cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${selected ? 'ring-1 ring-brand shadow-md' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Header row */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{receipt.merchant}</p>
            <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {RECEIPT_CATEGORY_LABELS[receipt.category]}
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
          <div className="flex items-center justify-between gap-2">
            <Badge
              variant="outline"
              className="border-border bg-accent font-mono text-[9px] uppercase tracking-wider text-muted-foreground"
            >
              {receipt.paymentMethod}
            </Badge>
            {onDelete ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isDeleting}
                className="h-7 px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground hover:text-destructive"
                onClick={(event) => {
                  event.stopPropagation()
                  onDelete()
                }}
              >
                {isDeleting ? 'Deleting…' : 'Delete'}
              </Button>
            ) : null}
          </div>
        </div>
      </CardContent>
    </GlassCard>
  )
}
