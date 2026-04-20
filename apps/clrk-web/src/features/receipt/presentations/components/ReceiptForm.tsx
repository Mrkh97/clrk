import { useForm, useStore } from '@tanstack/react-form'
import { useEffect } from 'react'
import { z } from 'zod'
import { Button } from '#/components/ui/button'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  getFieldErrorText,
  isFieldInvalid,
} from '#/components/ui/form'
import { Input } from '#/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'
import { Textarea } from '#/components/ui/textarea'
import DatePicker from '#/components/DatePicker'
import { useAddReceipt, useReceipt, useUpdateReceipt } from '../../hooks/useReceipts'
import { useReceiptStore } from '../../stores/useReceiptStore'
import {
  COMMON_RECEIPT_CURRENCIES,
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHODS,
  RECEIPT_CATEGORIES,
  RECEIPT_CATEGORY_LABELS,
  type ExtractedReceipt,
  type Receipt,
  type ReceiptFormValues,
} from '../../types'

const CURRENCY_LABELS: Record<string, string> = {
  TRY: 'Turkish Lira (₺)',
  USD: 'US Dollar ($)',
  EUR: 'Euro (€)',
  GBP: 'British Pound (£)',
  CAD: 'Canadian Dollar (C$)',
  AUD: 'Australian Dollar (A$)',
  CHF: 'Swiss Franc (CHF)',
  JPY: 'Japanese Yen (¥)',
}

function getTodayDateString() {
  const today = new Date()
  const year = today.getFullYear()
  const month = `${today.getMonth() + 1}`.padStart(2, '0')
  const day = `${today.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

const defaultValues: ReceiptFormValues = {
  merchant: '',
  amount: '',
  currency: 'TRY',
  date: '',
  category: 'food',
  paymentMethod: 'card',
  notes: '',
}

const receiptFormSchema = z.object({
  merchant: z.string().trim().min(1, 'Merchant is required.'),
  amount: z.string().trim().refine((value) => {
    const amount = Number.parseFloat(value)
    return Number.isFinite(amount) && amount > 0
  }, 'Enter a valid amount.'),
  currency: z.string().trim().min(1, 'Currency is required.'),
  date: z.string().refine((value) => normalizeReceiptDate(value) !== null, 'Pick a valid date.'),
  category: z.enum(RECEIPT_CATEGORIES),
  paymentMethod: z.enum(PAYMENT_METHODS),
  notes: z.string(),
})

export default function ReceiptForm() {
  const { mutate: addReceipt, isPending: isCreating } = useAddReceipt()
  const { mutate: updateReceipt, isPending: isUpdating } = useUpdateReceipt()
  const { uploadState, extractedReceipt, resetUpload, selectedReceiptId, selectReceipt } = useReceiptStore()
  const { data: selectedReceipt, isLoading: isLoadingSelectedReceipt } = useReceipt(selectedReceiptId)
  const isEditing = Boolean(selectedReceiptId)
  const isPending = isCreating || isUpdating
  const isAiExtracted = uploadState.phase === 'complete' && !isEditing

  const form = useForm({
    defaultValues,
    onSubmit: ({ value }) => {
      const values = receiptFormSchema.parse(value)
      const aiExtracted = isEditing
        ? (selectedReceipt?.aiExtracted ?? false)
        : Boolean(extractedReceipt)

      const payload = {
        ...values,
        aiExtracted,
      }

      const onSuccess = () => {
        form.reset(defaultValues)
        resetUpload()
        selectReceipt(null)
      }

      if (selectedReceiptId) {
        if (!selectedReceipt) {
          return
        }

        updateReceipt({ id: selectedReceiptId, values: payload }, { onSuccess })
        return
      }

      addReceipt(payload, { onSuccess })
    },
  })
  const values = useStore(form.store, (state) => state.values)

  useEffect(() => {
    if (isEditing || extractedReceipt || values.date) {
      return
    }

    form.reset(
      {
        ...values,
        date: getTodayDateString(),
      },
      { keepDefaultValues: true },
    )
  }, [extractedReceipt, form, isEditing, values])

  useEffect(() => {
    if (!selectedReceipt) {
      return
    }

    form.reset(getReceiptFormValues(selectedReceipt), { keepDefaultValues: true })
  }, [form, selectedReceipt])

  useEffect(() => {
    if (!extractedReceipt || isEditing) {
      return
    }

    const current = form.state.values

    form.reset(
      {
        ...current,
        merchant: extractedReceipt.merchant || current.merchant,
        amount:
          extractedReceipt.total != null
            ? extractedReceipt.total.toFixed(2)
            : current.amount,
        currency: extractedReceipt.currency || current.currency,
        date: normalizeReceiptDate(extractedReceipt.date) ?? current.date,
        paymentMethod: extractedReceipt.paymentMethod ?? current.paymentMethod,
        notes: extractedReceipt.notes ?? current.notes,
      },
      { keepDefaultValues: true },
    )
  }, [extractedReceipt, form, isEditing])

  const currencyOptions = values.currency && !COMMON_RECEIPT_CURRENCIES.includes(values.currency as never)
    ? [values.currency, ...COMMON_RECEIPT_CURRENCIES]
    : [...COMMON_RECEIPT_CURRENCIES]

  const amountAdornment = getCurrencyAdornment(values.currency)

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        event.stopPropagation()
        void form.handleSubmit()
      }}
      className="flex flex-col gap-5"
    >
      {isEditing && (
        <div className="flex flex-col gap-2 rounded-lg border border-brand/20 bg-brand-muted px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">
            Editing receipt
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-7 px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
            onClick={() => {
              selectReceipt(null)
              form.reset(defaultValues)
            }}
          >
            Cancel
          </Button>
        </div>
      )}

      {isAiExtracted && (
        <div className="space-y-3">
          <div className="flex flex-col gap-1 rounded-lg border border-brand/20 bg-brand-muted px-3 py-2 sm:flex-row sm:items-center sm:gap-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">
              AI Extracted
            </span>
            <span className="text-xs text-muted-foreground">review and confirm details below</span>
          </div>

          {extractedReceipt && <ExtractedReceiptPreview receipt={extractedReceipt} />}
        </div>
      )}

      <form.Field
        name="merchant"
        validators={{
          onBlur: receiptFormSchema.shape.merchant,
          onSubmit: receiptFormSchema.shape.merchant,
        }}
      >
        {(field) => (
          <FieldGroup>
            <Field field={field} className="space-y-1.5">
              <FieldLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Merchant
              </FieldLabel>
              <Input
                placeholder="e.g. Whole Foods Market"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                required
                aria-invalid={isFieldInvalid(field) || undefined}
                className="rounded-none border-x-0 border-t-0 border-b border-border bg-transparent px-0 text-sm focus-visible:border-foreground focus-visible:ring-0"
              />
              <FieldError>{getFieldErrorText(field)}</FieldError>
            </Field>
          </FieldGroup>
        )}
      </form.Field>

      <div className="grid gap-4 md:grid-cols-3">
        <form.Field
          name="amount"
          validators={{
            onBlur: receiptFormSchema.shape.amount,
            onSubmit: receiptFormSchema.shape.amount,
          }}
        >
          {(field) => (
            <Field field={field} className="space-y-1.5">
              <FieldLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Amount
              </FieldLabel>
              <div className="relative">
                <span className="absolute left-0 top-1/2 inline-flex min-w-8 -translate-y-1/2 items-center font-mono text-xs text-muted-foreground">
                  {amountAdornment}
                </span>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  required
                  aria-invalid={isFieldInvalid(field) || undefined}
                  className="rounded-none border-x-0 border-t-0 border-b border-border bg-transparent pr-0 pl-10 text-sm font-mono focus-visible:border-foreground focus-visible:ring-0"
                />
              </div>
              <FieldError>{getFieldErrorText(field)}</FieldError>
            </Field>
          )}
        </form.Field>
        <form.Field
          name="currency"
          validators={{
            onBlur: receiptFormSchema.shape.currency,
            onSubmit: receiptFormSchema.shape.currency,
          }}
        >
          {(field) => (
            <Field field={field} className="space-y-1.5">
              <FieldLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Currency
              </FieldLabel>
              <Select value={field.state.value} onValueChange={field.handleChange}>
                <SelectTrigger
                  aria-invalid={isFieldInvalid(field) || undefined}
                  className="rounded-none border-x-0 border-t-0 border-b border-border bg-transparent px-0 text-sm focus:border-foreground focus:ring-0"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencyOptions.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {CURRENCY_LABELS[currency] ?? currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError>{getFieldErrorText(field)}</FieldError>
            </Field>
          )}
        </form.Field>
        <form.Field
          name="date"
          validators={{
            onBlur: receiptFormSchema.shape.date,
            onSubmit: receiptFormSchema.shape.date,
          }}
        >
          {(field) => (
            <Field field={field} className="space-y-1.5">
              <FieldLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Date
              </FieldLabel>
              <DatePicker
                value={field.state.value}
                onChange={field.handleChange}
                className={isFieldInvalid(field) ? 'border-destructive text-destructive' : undefined}
              />
              <FieldError>{getFieldErrorText(field)}</FieldError>
            </Field>
          )}
        </form.Field>
      </div>

      <form.Field
        name="category"
        validators={{
          onSubmit: receiptFormSchema.shape.category,
        }}
      >
        {(field) => (
          <Field field={field} className="space-y-1.5">
            <FieldLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Category
            </FieldLabel>
            <Select
              value={field.state.value}
              onValueChange={(value) => field.handleChange(value as ReceiptFormValues['category'])}
            >
              <SelectTrigger
                aria-invalid={isFieldInvalid(field) || undefined}
                className="rounded-none border-x-0 border-t-0 border-b border-border bg-transparent px-0 text-sm focus:border-foreground focus:ring-0"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RECEIPT_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {RECEIPT_CATEGORY_LABELS[category]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError>{getFieldErrorText(field)}</FieldError>
          </Field>
        )}
      </form.Field>

      <form.Field
        name="paymentMethod"
        validators={{
          onSubmit: receiptFormSchema.shape.paymentMethod,
        }}
      >
        {(field) => (
          <Field field={field} className="space-y-1.5">
            <FieldLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Payment Method
            </FieldLabel>
            <div className="flex gap-2">
              {PAYMENT_METHODS.map((paymentMethod) => (
                <Button
                  key={paymentMethod}
                  type="button"
                  variant={field.state.value === paymentMethod ? 'default' : 'outline'}
                  onClick={() => field.handleChange(paymentMethod)}
                  className={`flex-1 font-mono text-xs uppercase tracking-wider ${
                    field.state.value === paymentMethod
                      ? 'bg-brand text-brand-foreground hover:bg-brand/90'
                      : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                  }`}
                >
                  {PAYMENT_METHOD_LABELS[paymentMethod]}
                </Button>
              ))}
            </div>
            <FieldError>{getFieldErrorText(field)}</FieldError>
          </Field>
        )}
      </form.Field>

      <form.Field name="notes">
        {(field) => (
          <Field field={field} className="space-y-1.5">
            <FieldLabel className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Notes
            </FieldLabel>
            <Textarea
              placeholder="Optional notes..."
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              rows={3}
              className="resize-none border border-border bg-transparent text-sm focus-visible:border-foreground focus-visible:ring-0"
            />
            <FieldError>{getFieldErrorText(field)}</FieldError>
          </Field>
        )}
      </form.Field>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending || (isEditing && isLoadingSelectedReceipt)}
        className="mt-1 w-full rounded-full bg-brand py-3 font-mono text-xs font-bold uppercase tracking-widest text-brand-foreground hover:bg-brand/90 disabled:opacity-50"
      >
        {isPending ? 'Saving...' : isEditing && isLoadingSelectedReceipt ? 'Loading…' : isEditing ? 'Update Receipt' : 'Save Receipt'}
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

function getReceiptFormValues(receipt: Receipt): ReceiptFormValues {
  return {
    merchant: receipt.merchant,
    amount: receipt.amount.toFixed(2),
    currency: receipt.currency,
    date: receipt.date,
    category: receipt.category,
    paymentMethod: receipt.paymentMethod,
    notes: receipt.notes ?? '',
  }
}

function formatMoney(amount?: number | null, currency = 'TRY') {
  if (amount == null) {
    return '—'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

function ExtractedReceiptPreview({ receipt }: { receipt: ExtractedReceipt }) {
  const moneyCurrency = receipt.currency || 'TRY'
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

function getCurrencyAdornment(currency: string) {
  switch (currency) {
    case 'TRY':
      return '₺'
    case 'USD':
      return '$'
    case 'EUR':
      return '€'
    case 'GBP':
      return '£'
    default:
      return currency.slice(0, 3).toUpperCase()
  }
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
