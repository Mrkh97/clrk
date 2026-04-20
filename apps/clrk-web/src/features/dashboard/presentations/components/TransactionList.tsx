import type { Transaction } from '../../types'
import StatusBadge from '#/components/StatusBadge'

function formatDateOnly(value: string) {
  const [year, month, day] = value.split('-').map(Number)

  if (!year || !month || !day) {
    return value
  }

  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

interface TransactionListProps {
  transactions: Transaction[]
}

export default function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="glass-card overflow-hidden">
      {transactions.map((tx) => {
        const formattedDate = formatDateOnly(tx.date)
        const formattedAmount = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: tx.currency,
        }).format(tx.amount)

        return (
          <div
            key={tx.id}
            className="border-b border-border px-4 py-3 transition-colors last:border-b-0 hover:bg-accent"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{tx.merchant}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="font-mono text-[10px] text-muted-foreground">{formattedDate}</p>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {tx.category}
                  </span>
                </div>
              </div>
              <span className="shrink-0 font-mono text-sm font-bold text-foreground">
                {formattedAmount}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Status
              </span>
              <StatusBadge status={tx.status} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
