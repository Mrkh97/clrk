import { Card, CardContent } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
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

const STATUS_COLORS: Record<string, string> = {
  complete: 'text-[#4A9E5C]',
  pending: 'text-[#D4A843]',
  processing: 'text-[#666666]',
  error: 'text-[#D71921]',
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

  return (
    <Card
      className="nd-card cursor-pointer border border-[#E8E8E8] bg-white shadow-none transition-all hover:-translate-y-0.5 hover:shadow-sm"
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Header row */}
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[#000]">{receipt.merchant}</p>
            <p className="nd-mono mt-0.5 text-[10px] uppercase tracking-wider text-[#999999]">
              {CATEGORY_LABELS[receipt.category]}
            </p>
          </div>
          {receipt.aiExtracted && (
            <span className="nd-mono flex-shrink-0 rounded border border-[#D71921]/30 bg-[#D71921]/5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-[#D71921]">
              AI
            </span>
          )}
        </div>

        {/* Amount */}
        <p className="nd-mono text-lg font-bold text-[#000]">{formattedAmount}</p>

        {/* Footer row */}
        <div className="mt-3 flex items-center justify-between">
          <p className="nd-mono text-[10px] text-[#999999]">{formattedDate}</p>
          <div className="flex items-center gap-1.5">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                receipt.status === 'complete'
                  ? 'bg-[#4A9E5C]'
                  : receipt.status === 'pending'
                    ? 'bg-[#D4A843]'
                    : 'bg-[#D71921]'
              }`}
            />
            <span className={`nd-mono text-[10px] capitalize ${STATUS_COLORS[receipt.status]}`}>
              {receipt.status}
            </span>
          </div>
        </div>

        {/* Payment method badge */}
        <div className="mt-2">
          <Badge
            variant="outline"
            className="nd-mono border-[#E8E8E8] bg-[#F5F5F5] text-[9px] uppercase tracking-wider text-[#999999]"
          >
            {receipt.paymentMethod}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
