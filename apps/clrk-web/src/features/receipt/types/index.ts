export const RECEIPT_CATEGORIES = [
  'food',
  'transport',
  'utilities',
  'entertainment',
  'health',
  'shopping',
  'other',
] as const

export type ReceiptCategory = (typeof RECEIPT_CATEGORIES)[number]

export const PAYMENT_METHODS = ['cash', 'card', 'digital'] as const

export type PaymentMethod = (typeof PAYMENT_METHODS)[number]

export const COMMON_RECEIPT_CURRENCIES = ['TRY', 'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'CHF', 'JPY'] as const

export type ReceiptStatus = 'pending' | 'processing' | 'complete' | 'error'

export interface Receipt {
  id: string
  merchant: string
  amount: number
  currency: string
  date: string
  category: ReceiptCategory
  paymentMethod: PaymentMethod
  notes?: string
  status: ReceiptStatus
  aiExtracted: boolean
}

export interface ExtractedReceiptItem {
  name: string
  quantity?: number | null
  unitPrice?: number | null
  totalPrice?: number | null
}

export interface ExtractedReceipt {
  merchant: string | null
  currency: string
  date?: string | null
  subtotal?: number | null
  tax?: number | null
  tip?: number | null
  total?: number | null
  paymentMethod?: PaymentMethod | null
  notes?: string | null
  rawText?: string | null
  confidence?: number | null
  items: ExtractedReceiptItem[]
}

export interface ReceiptExtractionResponse {
  fileName: string
  receipt: ExtractedReceipt
}

export interface UploadState {
  phase: 'idle' | 'dragging' | 'processing' | 'complete' | 'error'
  progress: number
  fileName?: string
  errorMessage?: string
}

export interface ReceiptFormValues {
  merchant: string
  amount: string
  currency: string
  date: string
  category: ReceiptCategory
  paymentMethod: PaymentMethod
  notes: string
}

export interface CreateReceiptInput extends ReceiptFormValues {
  aiExtracted?: boolean
}

export interface ReceiptFilters {
  from?: string
  to?: string
  category?: ReceiptCategory
}

export const RECEIPT_CATEGORY_LABELS: Record<ReceiptCategory, string> = {
  food: 'Food & Dining',
  transport: 'Transport',
  utilities: 'Utilities',
  entertainment: 'Entertainment',
  health: 'Health',
  shopping: 'Shopping',
  other: 'Other',
}

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Cash',
  card: 'Card',
  digital: 'Digital',
}
