import { useState } from 'react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'
import { Textarea } from '#/components/ui/textarea'
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
        <div className="flex items-center gap-2 rounded-lg border border-[#D71921]/20 bg-[#D71921]/5 px-3 py-2">
          <span className="nd-mono text-[10px] font-bold uppercase tracking-widest text-[#D71921]">
            AI Extracted
          </span>
          <span className="text-xs text-[#666666]">— review and confirm details below</span>
        </div>
      )}

      {/* Merchant */}
      <div className="space-y-1.5">
        <Label className="nd-mono text-[10px] uppercase tracking-widest text-[#666666]">
          Merchant
        </Label>
        <Input
          placeholder="e.g. Whole Foods Market"
          value={values.merchant}
          onChange={set('merchant')}
          required
          className="border-x-0 border-t-0 rounded-none border-b border-[#CCCCCC] bg-transparent px-0 text-sm focus-visible:ring-0 focus-visible:border-[#000]"
        />
      </div>

      {/* Amount + Date */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="nd-mono text-[10px] uppercase tracking-widest text-[#666666]">
            Amount
          </Label>
          <div className="relative">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 nd-mono text-sm text-[#999999]">$</span>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={values.amount}
              onChange={set('amount')}
              required
              className="border-x-0 border-t-0 rounded-none border-b border-[#CCCCCC] bg-transparent pl-4 px-0 text-sm nd-mono focus-visible:ring-0 focus-visible:border-[#000]"
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="nd-mono text-[10px] uppercase tracking-widest text-[#666666]">
            Date
          </Label>
          <Input
            type="date"
            value={values.date}
            onChange={set('date')}
            required
            className="border-x-0 border-t-0 rounded-none border-b border-[#CCCCCC] bg-transparent px-0 text-sm nd-mono focus-visible:ring-0 focus-visible:border-[#000]"
          />
        </div>
      </div>

      {/* Category */}
      <div className="space-y-1.5">
        <Label className="nd-mono text-[10px] uppercase tracking-widest text-[#666666]">
          Category
        </Label>
        <Select
          value={values.category}
          onValueChange={(v) => setValues((prev) => ({ ...prev, category: v as ReceiptCategory }))}
        >
          <SelectTrigger className="border-x-0 border-t-0 rounded-none border-b border-[#CCCCCC] bg-transparent px-0 text-sm focus:ring-0 focus:border-[#000]">
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
        <Label className="nd-mono text-[10px] uppercase tracking-widest text-[#666666]">
          Payment Method
        </Label>
        <div className="flex gap-2">
          {PAYMENT_METHODS.map((pm) => (
            <button
              key={pm.value}
              type="button"
              onClick={() => setValues((prev) => ({ ...prev, paymentMethod: pm.value }))}
              className={`nd-mono flex-1 rounded-lg border py-2 text-xs uppercase tracking-wider transition-colors ${
                values.paymentMethod === pm.value
                  ? 'border-[#000] bg-[#000] text-white'
                  : 'border-[#E8E8E8] bg-white text-[#666666] hover:border-[#000]'
              }`}
            >
              {pm.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label className="nd-mono text-[10px] uppercase tracking-widest text-[#666666]">
          Notes
        </Label>
        <Textarea
          placeholder="Optional notes..."
          value={values.notes}
          onChange={set('notes')}
          rows={3}
          className="resize-none border border-[#E8E8E8] bg-white text-sm focus-visible:ring-0 focus-visible:border-[#000]"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending}
        className="nd-mono mt-1 w-full rounded-full bg-[#000] py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#222] disabled:opacity-50"
      >
        {isPending ? 'Saving...' : 'Save Receipt'}
      </Button>
    </form>
  )
}
