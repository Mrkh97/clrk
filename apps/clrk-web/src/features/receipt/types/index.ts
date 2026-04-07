export type ReceiptCategory =
  | 'food'
  | 'transport'
  | 'utilities'
  | 'entertainment'
  | 'health'
  | 'shopping'
  | 'other'

export type PaymentMethod = 'cash' | 'card' | 'digital'

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

export interface UploadState {
  phase: 'idle' | 'dragging' | 'processing' | 'complete' | 'error'
  progress: number
  fileName?: string
  errorMessage?: string
}

export interface ReceiptFormValues {
  merchant: string
  amount: string
  date: string
  category: ReceiptCategory
  paymentMethod: PaymentMethod
  notes: string
}
