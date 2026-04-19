import { useForm, useStore } from '@tanstack/react-form'
import { useMemo, useState } from 'react'
import { z } from 'zod'
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
import { Field, FieldError, FieldLabel, getFieldErrorText, isFieldInvalid } from '#/components/ui/form'
import {
  RECEIPT_CATEGORIES,
  RECEIPT_CATEGORY_LABELS,
  type Receipt,
  type ReceiptCategory,
} from '../../types'
import ReceiptCard from './ReceiptCard'

const filterCategories = ['all', ...RECEIPT_CATEGORIES] as const

type ReceiptFilterValues = {
  from: string
  to: string
  category: 'all' | ReceiptCategory
}

const receiptFilterSchema = z.object({
  from: z.string().refine((value) => value === '' || normalizeFilterDate(value), 'Pick a valid start date.'),
  to: z.string().refine((value) => value === '' || normalizeFilterDate(value), 'Pick a valid end date.'),
  category: z.enum(filterCategories),
})

const defaultFilterValues: ReceiptFilterValues = {
  from: '',
  to: '',
  category: 'all',
}

export default function ReceiptList() {
  const [pendingDeleteReceipt, setPendingDeleteReceipt] = useState<Receipt | null>(null)
  const { selectedReceiptId, selectReceipt } = useReceiptStore()
  const { mutate: deleteReceipt, isPending: isDeleting } = useDeleteReceipt()
  const form = useForm({ defaultValues: defaultFilterValues })
  const filterValues = useStore(form.store, (state) => state.values)
  const ReceiptFiltersBar = () => (
    <div className="grid gap-2 rounded-xl border border-border/70 bg-background/30 p-3 sm:grid-cols-3">
      <form.Field
        name="from"
        validators={{
          onChange: receiptFilterSchema.shape.from,
        }}
      >
        {(field) => (
          <Field field={field} className="space-y-1">
            <FieldLabel className="sr-only">From date</FieldLabel>
            <DatePicker
              value={field.state.value}
              onChange={field.handleChange}
              placeholder="From date"
              clearable
              className={`h-9 rounded-md border border-input bg-background px-3 text-left text-xs font-medium hover:bg-background ${
                isFieldInvalid(field) ? 'border-destructive text-destructive' : ''
              }`}
            />
            <FieldError className="text-xs">{getFieldErrorText(field)}</FieldError>
          </Field>
        )}
      </form.Field>
      <form.Field
        name="to"
        validators={{
          onChange: receiptFilterSchema.shape.to,
        }}
      >
        {(field) => (
          <Field field={field} className="space-y-1">
            <FieldLabel className="sr-only">To date</FieldLabel>
            <DatePicker
              value={field.state.value}
              onChange={field.handleChange}
              placeholder="To date"
              clearable
              className={`h-9 rounded-md border border-input bg-background px-3 text-left text-xs font-medium hover:bg-background ${
                isFieldInvalid(field) ? 'border-destructive text-destructive' : ''
              }`}
            />
            <FieldError className="text-xs">{getFieldErrorText(field)}</FieldError>
          </Field>
        )}
      </form.Field>
      <form.Field name="category">
        {(field) => (
          <Field field={field} className="space-y-1">
            <FieldLabel className="sr-only">Category</FieldLabel>
            <Select
              value={field.state.value}
              onValueChange={(value) => field.handleChange(value as ReceiptFilterValues['category'])}
            >
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
            <FieldError className="text-xs">{getFieldErrorText(field)}</FieldError>
          </Field>
        )}
      </form.Field>
    </div>
  )
  const filters = useMemo(
    () => ({
      from: filterValues.from || undefined,
      to: filterValues.to || undefined,
      category: filterValues.category === 'all' ? undefined : filterValues.category,
    }),
    [filterValues],
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
            onClick={() => form.reset()}
          >
            Clear filters
          </Button>
        </div>
        <ReceiptFiltersBar />
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
          onClick={() => form.reset()}
        >
          Clear filters
        </Button>
      </div>
      <ReceiptFiltersBar />
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

function normalizeFilterDate(value: string) {
  return Number.isNaN(new Date(value).getTime()) ? null : value
}
