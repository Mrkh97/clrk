import { useMemo, useState } from 'react'
import DatePicker from '#/components/DatePicker'
import { Button } from '#/components/ui/button'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { useDeleteReceipt, useReceipts } from '../../hooks/useReceipts'
import { useReceiptStore } from '../../stores/useReceiptStore'
import { RECEIPT_CATEGORY_LABELS, type Receipt, type ReceiptCategory } from '../../types'
import ReceiptCard from './ReceiptCard'

function ReceiptFiltersBar({
  from,
  to,
  category,
  onFromChange,
  onToChange,
  onCategoryChange,
}: {
  from: string
  to: string
  category: 'all' | ReceiptCategory
  onFromChange: (value: string) => void
  onToChange: (value: string) => void
  onCategoryChange: (value: 'all' | ReceiptCategory) => void
}) {
  return (
    <div className="grid gap-2 rounded-xl border border-border/70 bg-background/30 p-3 sm:grid-cols-3">
      <DatePicker
        value={from}
        onChange={onFromChange}
        placeholder="From date"
        clearable
        className="h-9 rounded-md border border-input bg-background px-3 text-left text-xs font-medium hover:bg-background"
      />
      <DatePicker
        value={to}
        onChange={onToChange}
        placeholder="To date"
        clearable
        className="h-9 rounded-md border border-input bg-background px-3 text-left text-xs font-medium hover:bg-background"
      />
      <Select value={category} onValueChange={(value) => onCategoryChange(value as 'all' | ReceiptCategory)}>
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
  )
}

export default function ReceiptList() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [category, setCategory] = useState<'all' | ReceiptCategory>('all')
  const [pendingDeleteReceipt, setPendingDeleteReceipt] = useState<Receipt | null>(null)
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
        <ReceiptFiltersBar
          from={from}
          to={to}
          category={category}
          onFromChange={setFrom}
          onToChange={setTo}
          onCategoryChange={setCategory}
        />
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
      <ReceiptFiltersBar
        from={from}
        to={to}
        category={category}
        onFromChange={setFrom}
        onToChange={setTo}
        onCategoryChange={setCategory}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {receipts.map((receipt) => (
          <ReceiptCard
            key={receipt.id}
            receipt={receipt}
            selected={selectedReceiptId === receipt.id}
            onClick={() => selectReceipt(receipt.id)}
            onDelete={() => setPendingDeleteReceipt(receipt)}
            isDeleting={isDeleting}
          />
        ))}
      </div>
      <AlertDialog open={Boolean(pendingDeleteReceipt)} onOpenChange={(open) => !open && setPendingDeleteReceipt(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete receipt?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDeleteReceipt
                ? `This will permanently remove ${pendingDeleteReceipt.merchant} from your receipts.`
                : 'This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting || !pendingDeleteReceipt}
              onClick={() => {
                if (!pendingDeleteReceipt) {
                  return
                }

                deleteReceipt(pendingDeleteReceipt.id, {
                  onSuccess: () => {
                    if (selectedReceiptId === pendingDeleteReceipt.id) {
                      selectReceipt(null)
                    }
                    setPendingDeleteReceipt(null)
                  },
                })
              }}
            >
              {isDeleting ? 'Deleting…' : 'Delete receipt'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
