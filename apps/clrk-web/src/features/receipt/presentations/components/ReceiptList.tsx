import { useMemo, useState } from 'react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { useDeleteReceipt, useReceipts } from '../../hooks/useReceipts'
import { useReceiptStore } from '../../stores/useReceiptStore'
import { RECEIPT_CATEGORY_LABELS, type ReceiptCategory } from '../../types'
import ReceiptCard from './ReceiptCard'

export default function ReceiptList() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [category, setCategory] = useState<'all' | ReceiptCategory>('all')
  const { selectedReceiptId, selectReceipt } = useReceiptStore()
  const { mutate: deleteReceipt, isPending: isDeleting } = useDeleteReceipt()
  const filters = useMemo(
    () => ({
      from: from || undefined,
      to: to || undefined,
      category: category === 'all' ? undefined : category,
    }),
    [category, from, to],
  )
  const { data: receipts, isLoading } = useReceipts(filters)

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
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            0 receipts
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
            onClick={() => {
              setFrom('')
              setTo('')
              setCategory('all')
            }}
          >
            Clear filters
          </Button>
        </div>
        <div className="grid gap-2 rounded-xl border border-border/70 bg-background/30 p-3 sm:grid-cols-3">
          <Input
            type="date"
            value={from}
            onChange={(event) => setFrom(event.target.value)}
            className="font-mono text-xs"
            aria-label="Filter receipts from date"
          />
          <Input
            type="date"
            value={to}
            onChange={(event) => setTo(event.target.value)}
            className="font-mono text-xs"
            aria-label="Filter receipts to date"
          />
          <Select value={category} onValueChange={(value) => setCategory(value as 'all' | ReceiptCategory)}>
            <SelectTrigger className="font-mono text-xs uppercase tracking-wider">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {Object.entries(RECEIPT_CATEGORY_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="glass-card flex flex-col items-center justify-center border border-dashed py-16 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            No receipts found
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Adjust the filters or upload your first receipt to get started
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {receipts.length} receipt{receipts.length !== 1 ? 's' : ''}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
          onClick={() => {
            setFrom('')
            setTo('')
            setCategory('all')
          }}
        >
          Clear filters
        </Button>
      </div>
      <div className="grid gap-2 rounded-xl border border-border/70 bg-background/30 p-3 sm:grid-cols-3">
        <Input
          type="date"
          value={from}
          onChange={(event) => setFrom(event.target.value)}
          className="font-mono text-xs"
          aria-label="Filter receipts from date"
        />
        <Input
          type="date"
          value={to}
          onChange={(event) => setTo(event.target.value)}
          className="font-mono text-xs"
          aria-label="Filter receipts to date"
        />
        <Select value={category} onValueChange={(value) => setCategory(value as 'all' | ReceiptCategory)}>
          <SelectTrigger className="font-mono text-xs uppercase tracking-wider">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {Object.entries(RECEIPT_CATEGORY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {receipts.map((receipt) => (
          <ReceiptCard
            key={receipt.id}
            receipt={receipt}
            selected={selectedReceiptId === receipt.id}
            onClick={() => selectReceipt(receipt.id)}
            onDelete={() => {
              deleteReceipt(receipt.id, {
                onSuccess: () => {
                  if (selectedReceiptId === receipt.id) {
                    selectReceipt(null)
                  }
                },
              })
            }}
            isDeleting={isDeleting}
          />
        ))}
      </div>
    </div>
  )
}
