import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Receipt, ReceiptFormValues } from '../types'

const DUMMY_RECEIPTS: Receipt[] = [
  {
    id: '1',
    merchant: 'Whole Foods Market',
    amount: 84.5,
    currency: 'USD',
    date: '2026-04-03',
    category: 'food',
    paymentMethod: 'card',
    notes: 'Weekly groceries',
    status: 'complete',
    aiExtracted: true,
  },
  {
    id: '2',
    merchant: 'Uber',
    amount: 23.0,
    currency: 'USD',
    date: '2026-04-02',
    category: 'transport',
    paymentMethod: 'digital',
    status: 'complete',
    aiExtracted: true,
  },
  {
    id: '3',
    merchant: 'CVS Pharmacy',
    amount: 42.3,
    currency: 'USD',
    date: '2026-04-01',
    category: 'health',
    paymentMethod: 'card',
    notes: 'Prescription + vitamins',
    status: 'pending',
    aiExtracted: false,
  },
  {
    id: '4',
    merchant: 'Amazon',
    amount: 156.0,
    currency: 'USD',
    date: '2026-03-30',
    category: 'shopping',
    paymentMethod: 'card',
    status: 'complete',
    aiExtracted: true,
  },
  {
    id: '5',
    merchant: 'PG&E',
    amount: 120.0,
    currency: 'USD',
    date: '2026-03-28',
    category: 'utilities',
    paymentMethod: 'digital',
    notes: 'Monthly electricity bill',
    status: 'complete',
    aiExtracted: false,
  },
  {
    id: '6',
    merchant: 'Chipotle',
    amount: 18.75,
    currency: 'USD',
    date: '2026-03-27',
    category: 'food',
    paymentMethod: 'cash',
    status: 'complete',
    aiExtracted: true,
  },
]

let receipts = [...DUMMY_RECEIPTS]

const fetchReceipts = (): Promise<Receipt[]> =>
  new Promise((resolve) => setTimeout(() => resolve([...receipts]), 300))

const addReceipt = (values: ReceiptFormValues): Promise<Receipt> =>
  new Promise((resolve) => {
    const newReceipt: Receipt = {
      id: String(Date.now()),
      merchant: values.merchant,
      amount: parseFloat(values.amount) || 0,
      currency: 'USD',
      date: values.date,
      category: values.category,
      paymentMethod: values.paymentMethod,
      notes: values.notes,
      status: 'complete',
      aiExtracted: false,
    }
    receipts = [newReceipt, ...receipts]
    setTimeout(() => resolve(newReceipt), 300)
  })

export function useReceipts() {
  return useQuery({
    queryKey: ['receipts'],
    queryFn: fetchReceipts,
    initialData: [...receipts],
    staleTime: Infinity,
  })
}

export function useAddReceipt() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: addReceipt,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['receipts'] })
    },
  })
}
