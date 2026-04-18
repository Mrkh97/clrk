import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiBaseUrl } from '#/lib/auth-client'
import type { CreateReceiptInput, Receipt, ReceiptFilters } from '../types'

type ReceiptListResponse = {
  receipts: Receipt[]
}

type ReceiptResponse = {
  receipt: Receipt
}

function buildReceiptQuery(filters: ReceiptFilters) {
  const params = new URLSearchParams()

  if (filters.from) {
    params.set('from', filters.from)
  }

  if (filters.to) {
    params.set('to', filters.to)
  }

  if (filters.category) {
    params.set('category', filters.category)
  }

  const query = params.toString()
  return query ? `?${query}` : ''
}

async function parseError(response: Response) {
  try {
    const payload = (await response.json()) as { error?: string; message?: string }
    return payload.error ?? payload.message ?? 'Request failed.'
  } catch {
    return 'Request failed.'
  }
}

async function fetchReceipts(filters: ReceiptFilters): Promise<Receipt[]> {
  const response = await fetch(`${apiBaseUrl}/api/receipts${buildReceiptQuery(filters)}`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  const payload = (await response.json()) as ReceiptListResponse
  return payload.receipts
}

async function fetchReceipt(id: string): Promise<Receipt> {
  const response = await fetch(`${apiBaseUrl}/api/receipts/${id}`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  const payload = (await response.json()) as ReceiptResponse
  return payload.receipt
}

async function createReceipt(values: CreateReceiptInput): Promise<Receipt> {
  const amount = Number.parseFloat(values.amount)

  if (!Number.isFinite(amount)) {
    throw new Error('Amount must be a valid number.')
  }

  const response = await fetch(`${apiBaseUrl}/api/receipts`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      merchant: values.merchant,
      amount,
      currency: 'USD',
      date: values.date,
      category: values.category,
      paymentMethod: values.paymentMethod,
      notes: values.notes,
      aiExtracted: Boolean(values.aiExtracted),
    }),
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  const payload = (await response.json()) as ReceiptResponse
  return payload.receipt
}

async function updateReceipt({ id, values }: { id: string; values: CreateReceiptInput }): Promise<Receipt> {
  const amount = Number.parseFloat(values.amount)

  if (!Number.isFinite(amount)) {
    throw new Error('Amount must be a valid number.')
  }

  const response = await fetch(`${apiBaseUrl}/api/receipts/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      merchant: values.merchant,
      amount,
      currency: 'USD',
      date: values.date,
      category: values.category,
      paymentMethod: values.paymentMethod,
      notes: values.notes,
      aiExtracted: Boolean(values.aiExtracted),
    }),
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  const payload = (await response.json()) as ReceiptResponse
  return payload.receipt
}

async function deleteReceipt(id: string): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/receipts/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }
}

export function useReceipts(filters: ReceiptFilters = {}) {
  return useQuery({
    queryKey: ['receipts', filters],
    queryFn: () => fetchReceipts(filters),
    placeholderData: (previousData) => previousData,
  })
}

export function useReceipt(id: string | null) {
  return useQuery({
    queryKey: ['receipt', id],
    queryFn: () => fetchReceipt(id!),
    enabled: Boolean(id),
  })
}

export function useAddReceipt() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createReceipt,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['receipts'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ])
    },
  })
}

export function useUpdateReceipt() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateReceipt,
    onSuccess: async (receipt) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['receipts'] }),
        queryClient.invalidateQueries({ queryKey: ['receipt', receipt.id] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ])
    },
  })
}

export function useDeleteReceipt() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteReceipt,
    onSuccess: () => {
      void Promise.all([
        queryClient.invalidateQueries({ queryKey: ['receipts'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ])
    },
  })
}
