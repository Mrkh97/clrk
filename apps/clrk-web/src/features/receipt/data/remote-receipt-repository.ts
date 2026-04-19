import { apiClient, getApiErrorMessage } from '#/lib/api-client'
import type { CreateReceiptInput, Receipt, ReceiptExtractionResponse, ReceiptFilters } from '../types'

type ReceiptListResponse = {
  receipts: Receipt[]
}

type ReceiptResponse = {
  receipt: Receipt
}

function buildReceiptParams(filters: ReceiptFilters) {
  const params: Record<string, string> = {}

  if (filters.from) {
    params.from = filters.from
  }

  if (filters.to) {
    params.to = filters.to
  }

  if (filters.category) {
    params.category = filters.category
  }

  return params
}

function toReceiptPayload(values: CreateReceiptInput) {
  const amount = Number.parseFloat(values.amount)

  if (!Number.isFinite(amount)) {
    throw new Error('Amount must be a valid number.')
  }

  return {
    merchant: values.merchant,
    amount,
    currency: values.currency,
    date: values.date,
    category: values.category,
    paymentMethod: values.paymentMethod,
    notes: values.notes,
    aiExtracted: Boolean(values.aiExtracted),
  }
}

export async function getReceipts(filters: ReceiptFilters): Promise<Receipt[]> {
  try {
    const { data } = await apiClient.get<ReceiptListResponse>('/api/receipts', {
      params: buildReceiptParams(filters),
    })

    return data.receipts
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Request failed.'))
  }
}

export async function getReceipt(id: string): Promise<Receipt> {
  try {
    const { data } = await apiClient.get<ReceiptResponse>(`/api/receipts/${id}`)
    return data.receipt
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Request failed.'))
  }
}

export async function createReceipt(values: CreateReceiptInput): Promise<Receipt> {
  try {
    const { data } = await apiClient.post<ReceiptResponse>('/api/receipts', toReceiptPayload(values))
    return data.receipt
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Request failed.'))
  }
}

export async function updateReceipt({
  id,
  values,
}: {
  id: string
  values: CreateReceiptInput
}): Promise<Receipt> {
  try {
    const { data } = await apiClient.put<ReceiptResponse>(`/api/receipts/${id}`, toReceiptPayload(values))
    return data.receipt
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Request failed.'))
  }
}

export async function deleteReceipt(id: string): Promise<void> {
  try {
    await apiClient.delete(`/api/receipts/${id}`)
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Request failed.'))
  }
}

export async function extractReceipt(file: File): Promise<ReceiptExtractionResponse> {
  const formData = new FormData()
  formData.append('file', file)

  try {
    const { data } = await apiClient.post<ReceiptExtractionResponse>('/api/receipts/extract', formData)
    return data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Receipt extraction failed. Please try again.'))
  }
}
