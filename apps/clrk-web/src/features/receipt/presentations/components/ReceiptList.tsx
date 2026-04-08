import { useReceipts } from '../../hooks/useReceipts'
import ReceiptCard from './ReceiptCard'

export default function ReceiptList() {
  const { data: receipts, isLoading } = useReceipts()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    )
  }

  if (!receipts || receipts.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center justify-center border border-dashed py-16 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          No receipts found
        </p>
        <p className="mt-2 text-sm text-muted-foreground">Upload your first receipt to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {receipts.length} receipt{receipts.length !== 1 ? 's' : ''}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {receipts.map((receipt) => (
          <ReceiptCard key={receipt.id} receipt={receipt} />
        ))}
      </div>
    </div>
  )
}
