import { cn } from '#/lib/utils'

type Status = 'completed' | 'pending' | 'refunded' | 'failed' | 'processing' | 'error'

const STATUS_STYLES: Record<Status, { dot: string; text: string; label: string }> = {
  completed: { dot: 'bg-success', text: 'text-success', label: 'Completed' },
  pending: { dot: 'bg-warning', text: 'text-warning', label: 'Pending' },
  refunded: { dot: 'bg-muted-foreground', text: 'text-muted-foreground', label: 'Refunded' },
  failed: { dot: 'bg-brand', text: 'text-brand', label: 'Failed' },
  processing: { dot: 'bg-info', text: 'text-info', label: 'Processing' },
  error: { dot: 'bg-destructive', text: 'text-destructive', label: 'Error' },
}

interface StatusBadgeProps {
  status: Status
  className?: string
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const styles = STATUS_STYLES[status]
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <span className={cn('h-1.5 w-1.5 flex-shrink-0 rounded-full', styles.dot)} />
      <span className={cn('font-mono text-[10px]', styles.text)}>{styles.label}</span>
    </div>
  )
}
