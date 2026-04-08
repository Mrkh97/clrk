import type { Transaction } from '../../types'
import StatusBadge from '#/components/StatusBadge'

interface TransactionListProps {
  transactions: Transaction[]
}

export default function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-border px-4 py-2.5 sm:grid-cols-[1fr_auto_auto_auto]">
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Merchant</span>
        <span className="hidden font-mono text-[10px] uppercase tracking-wider text-muted-foreground sm:block">
          Category
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Status</span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Amount</span>
      </div>

      {/* Rows */}
      {transactions.map((tx) => {
        const formattedDate = new Date(tx.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
        return (
          <div
            key={tx.id}
            className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-border px-4 py-3 transition-colors last:border-b-0 hover:bg-accent sm:grid-cols-[1fr_auto_auto_auto]"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{tx.merchant}</p>
              <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">{formattedDate}</p>
            </div>
            <span className="hidden font-mono text-xs text-muted-foreground sm:block">{tx.category}</span>
            <StatusBadge status={tx.status} />
            <span className="font-mono text-sm font-bold text-foreground">
              ${tx.amount.toFixed(2)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
