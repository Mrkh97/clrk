import { useReceipts } from '../../hooks/useReceipts'
import ReceiptCard from './ReceiptCard'

export default function ReceiptList() {
  const { data: receipts, isLoading } = useReceipts()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-36 animate-pulse rounded-xl bg-[#E8E8E8]" />
        ))}
      </div>
    )
  }

  if (!receipts || receipts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#E8E8E8] py-16 text-center">
        <p className="nd-mono text-xs uppercase tracking-widest text-[#999999]">
          No receipts found
        </p>
        <p className="mt-2 text-sm text-[#666666]">Upload your first receipt to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="nd-mono text-[10px] uppercase tracking-widest text-[#999999]">
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
