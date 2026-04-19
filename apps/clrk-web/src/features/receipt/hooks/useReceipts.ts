import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createReceipt,
  deleteReceipt,
  getReceipt,
  getReceipts,
  updateReceipt,
} from '../data/remote-receipt-repository'
import type { ReceiptFilters } from '../types'

export function useReceipts(filters: ReceiptFilters = {}) {
  return useQuery({
    queryKey: ['receipts', filters],
    queryFn: () => getReceipts(filters),
    placeholderData: (previousData) => previousData,
  })
}

export function useReceipt(id: string | null) {
  return useQuery({
    queryKey: ['receipt', id],
    queryFn: () => getReceipt(id!),
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
