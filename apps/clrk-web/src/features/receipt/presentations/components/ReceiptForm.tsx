import { useEffect, useState } from 'react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'
import { Textarea } from '#/components/ui/textarea'
import DatePicker from '#/components/DatePicker'
import { useAddReceipt } from '../../hooks/useReceipts'
import { useReceiptStore } from '../../stores/useReceiptStore'
import type { ExtractedReceipt, ReceiptCategory, ReceiptFormValues } from '../../types'

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
  const { uploadState, extractedReceipt, resetUpload } = useReceiptStore()
  const isAiExtracted = uploadState.phase === 'complete'

  useEffect(() => {
    if (!extractedReceipt) {
      return
    }

    setValues((current) => ({
      ...current,
      merchant: extractedReceipt.merchant || current.merchant,
      amount:
        extractedReceipt.total != null
          ? extractedReceipt.total.toFixed(2)
          : current.amount,
      date: normalizeReceiptDate(extractedReceipt.date) ?? current.date,
      paymentMethod: extractedReceipt.paymentMethod ?? current.paymentMethod,
      notes: extractedReceipt.notes ?? current.notes,
    }))
  }, [extractedReceipt])

  const set = (field: keyof ReceiptFormValues) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setValues((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addReceipt(
      {
        ...values,
        aiExtracted: Boolean(extractedReceipt),
      },
      {
        onSuccess: () => {
          setValues(defaultValues)
          resetUpload()
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {isAiExtracted && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-lg border border-brand/20 bg-brand-muted px-3 py-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">
              AI Extracted
            </span>
            <span className="text-xs text-muted-foreground">review and confirm details below</span>
          </div>

          {extractedReceipt && <ExtractedReceiptPreview receipt={extractedReceipt} />}
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

function normalizeReceiptDate(value?: string | null) {
  if (!value) {
    return null
  }

  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  return parsed.toISOString().slice(0, 10)
}

function formatMoney(amount?: number | null, currency = 'USD') {
  if (amount == null) {
    return '—'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

function ExtractedReceiptPreview({ receipt }: { receipt: ExtractedReceipt }) {
  const moneyCurrency = receipt.currency || 'USD'
  const visibleItems = receipt.items.slice(0, 3)

  return (
    <div className="glass rounded-xl p-4">
      <div className="flex items-start justify-between gap-3 border-b border-border/70 pb-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Extracted Summary
          </p>
          <p className="mt-1 text-sm font-semibold text-foreground">
            {receipt.merchant || 'Unknown merchant'}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Confidence
          </p>
          <p className="mt-1 font-mono text-sm font-bold text-brand">
            {receipt.confidence != null ? `${Math.round(receipt.confidence * 100)}%` : '—'}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <SummaryField label="Total" value={formatMoney(receipt.total, moneyCurrency)} />
        <SummaryField label="Subtotal" value={formatMoney(receipt.subtotal, moneyCurrency)} />
        <SummaryField label="Tax" value={formatMoney(receipt.tax, moneyCurrency)} />
        <SummaryField label="Tip" value={formatMoney(receipt.tip, moneyCurrency)} />
        <SummaryField label="Currency" value={moneyCurrency} />
        <SummaryField label="Payment" value={receipt.paymentMethod ?? 'Needs review'} />
      </div>

      {visibleItems.length > 0 && (
        <div className="mt-4 space-y-2 border-t border-border/70 pt-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Line Items
          </p>
          {visibleItems.map((item, index) => (
            <div key={`${item.name}-${index}`} className="flex items-center justify-between gap-3 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium text-foreground">{item.name}</p>
                <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Qty {item.quantity ?? 1}
                </p>
              </div>
              <p className="font-mono text-xs font-bold text-foreground">
                {formatMoney(item.totalPrice ?? item.unitPrice, moneyCurrency)}
              </p>
            </div>
          ))}
          {receipt.items.length > visibleItems.length && (
            <p className="text-xs text-muted-foreground">
              +{receipt.items.length - visibleItems.length} more extracted item{receipt.items.length - visibleItems.length === 1 ? '' : 's'}
            </p>
          )}
        </div>
      )}

      {receipt.rawText && (
        <div className="mt-4 border-t border-border/70 pt-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Raw Text Snapshot
          </p>
          <p className="mt-2 line-clamp-4 text-xs leading-5 text-muted-foreground">
            {receipt.rawText}
          </p>
        </div>
      )}
    </div>
  )
}

function SummaryField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-mono text-sm font-bold text-foreground">{value}</p>
    </div>
  )
}
