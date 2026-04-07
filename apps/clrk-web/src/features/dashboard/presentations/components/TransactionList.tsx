import type { Transaction, TransactionStatus } from '../../types'

const STATUS_CONFIG: Record<TransactionStatus, { label: string; color: string; dot: string }> = {
  completed: { label: 'Completed', color: 'text-[#4A9E5C]', dot: 'bg-[#4A9E5C]' },
  pending: { label: 'Pending', color: 'text-[#D4A843]', dot: 'bg-[#D4A843]' },
  refunded: { label: 'Refunded', color: 'text-[#666666]', dot: 'bg-[#CCCCCC]' },
  failed: { label: 'Failed', color: 'text-[#D71921]', dot: 'bg-[#D71921]' },
}

interface TransactionListProps {
  transactions: Transaction[]
}

export default function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E8E8E8] bg-white">
      {/* Header */}
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-[#F0F0F0] px-4 py-2.5 sm:grid-cols-[1fr_auto_auto_auto]">
        <span className="nd-mono text-[10px] uppercase tracking-wider text-[#999999]">Merchant</span>
        <span className="nd-mono hidden text-[10px] uppercase tracking-wider text-[#999999] sm:block">
          Category
        </span>
        <span className="nd-mono text-[10px] uppercase tracking-wider text-[#999999]">Status</span>
        <span className="nd-mono text-[10px] uppercase tracking-wider text-[#999999]">Amount</span>
      </div>

      {/* Rows */}
      {transactions.map((tx) => {
        const status = STATUS_CONFIG[tx.status]
        const formattedDate = new Date(tx.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
        return (
          <div
            key={tx.id}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-[#F0F0F0] px-4 py-3 transition-colors last:border-b-0 hover:bg-[#F5F5F5] sm:grid-cols-[1fr_auto_auto_auto]"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-[#000]">{tx.merchant}</p>
              <p className="nd-mono mt-0.5 text-[10px] text-[#999999]">{formattedDate}</p>
            </div>
            <span className="nd-mono hidden text-xs text-[#666666] sm:block">{tx.category}</span>
            <div className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${status.dot}`} />
              <span className={`nd-mono text-[10px] ${status.color}`}>{status.label}</span>
            </div>
            <span className="nd-mono text-sm font-bold text-[#000]">
              ${tx.amount.toFixed(2)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
