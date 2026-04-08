import { useState } from 'react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'
import { Textarea } from '#/components/ui/textarea'
import DatePicker from '#/components/DatePicker'
import { useAddReceipt } from '../../hooks/useReceipts'
import { useReceiptStore } from '../../stores/useReceiptStore'
import type { ReceiptCategory, ReceiptFormValues } from '../../types'

const CATEGORIES: { value: ReceiptCategory; label: string }[] = [
  { value: 'food', label: 'Food & Dining' },
  { value: 'transport', label: 'Transport' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'health', label: 'Health' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'other', label: 'Other' },
]

const PAYMENT_METHODS = [
  { value: 'card', label: 'Card' },
  { value: 'cash', label: 'Cash' },
  { value: 'digital', label: 'Digital' },
] as const

const defaultValues: ReceiptFormValues = {
  merchant: '',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  category: 'food',
  paymentMethod: 'card',
  notes: '',
}

export default function ReceiptForm() {
  const [values, setValues] = useState<ReceiptFormValues>(defaultValues)
  const { mutate: addReceipt, isPending } = useAddReceipt()
  const { uploadState } = useReceiptStore()
  const isAiExtracted = uploadState.phase === 'complete'

  const set = (field: keyof ReceiptFormValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setValues((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addReceipt(values, { onSuccess: () => setValues(defaultValues) })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {isAiExtracted && (
        <div className="flex items-center gap-2 rounded-lg border border-brand/20 bg-brand-muted px-3 py-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">
            AI Extracted
          </span>
          <span className="text-xs text-muted-foreground">— review and confirm details below</span>
        </div>
      )}

      {/* Merchant */}
      <div className="space-y-1.5">
        <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Merchant
        </Label>
        <Input
          placeholder="e.g. Whole Foods Market"
          value={values.merchant}
          onChange={set('merchant')}
          required
          className="rounded-none border-x-0 border-t-0 border-b border-border bg-transparent px-0 text-sm focus-visible:border-foreground focus-visible:ring-0"
        />
      </div>

      {/* Amount + Date */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Amount
          </Label>
          <div className="relative">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground">$</span>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={values.amount}
              onChange={set('amount')}
              required
              className="rounded-none border-x-0 border-t-0 border-b border-border bg-transparent pl-4 px-0 text-sm font-mono focus-visible:border-foreground focus-visible:ring-0"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Date
          </Label>
          <DatePicker
            value={values.date}
            onChange={(date) => setValues((prev) => ({ ...prev, date }))}
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Category
        </Label>
        <Select
          value={values.category}
          onValueChange={(v) => setValues((prev) => ({ ...prev, category: v as ReceiptCategory }))}
        >
          <SelectTrigger className="rounded-none border-x-0 border-t-0 border-b border-border bg-transparent px-0 text-sm focus:border-foreground focus:ring-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Payment method */}
      <div className="space-y-1.5">
        <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Payment Method
        </Label>
        <div className="flex gap-2">
          {PAYMENT_METHODS.map((pm) => (
            <Button
              key={pm.value}
              type="button"
              variant={values.paymentMethod === pm.value ? 'default' : 'outline'}
              onClick={() => setValues((prev) => ({ ...prev, paymentMethod: pm.value }))}
              className={`flex-1 font-mono text-xs uppercase tracking-wider ${
                values.paymentMethod === pm.value
                  ? 'bg-brand text-brand-foreground hover:bg-brand/90'
                  : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
              }`}
            >
              {pm.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Notes
        </Label>
        <Textarea
          placeholder="Optional notes..."
          value={values.notes}
          onChange={set('notes')}
          rows={3}
          className="resize-none border border-border bg-transparent text-sm focus-visible:border-foreground focus-visible:ring-0"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending}
        className="mt-1 w-full rounded-full bg-brand py-3 font-mono text-xs font-bold uppercase tracking-widest text-brand-foreground hover:bg-brand/90 disabled:opacity-50"
      >
        {isPending ? 'Saving...' : 'Save Receipt'}
      </Button>
    </form>
  )
}
