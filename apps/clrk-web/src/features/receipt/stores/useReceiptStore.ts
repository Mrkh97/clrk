import { create } from 'zustand'
import type { UploadState } from '../types'

interface ReceiptStore {
  uploadState: UploadState
  selectedReceiptId: string | null
  setUploadPhase: (phase: UploadState['phase'], fileName?: string) => void
  setUploadProgress: (progress: number) => void
  selectReceipt: (id: string | null) => void
  resetUpload: () => void
}

export const useReceiptStore = create<ReceiptStore>((set) => ({
  uploadState: { phase: 'idle', progress: 0 },
  selectedReceiptId: null,

  setUploadPhase: (phase, fileName) =>
    set((s) => ({ uploadState: { ...s.uploadState, phase, fileName } })),

  setUploadProgress: (progress) =>
    set((s) => ({ uploadState: { ...s.uploadState, progress } })),

  selectReceipt: (id) => set({ selectedReceiptId: id }),

  resetUpload: () =>
    set({ uploadState: { phase: 'idle', progress: 0 }, selectedReceiptId: null }),
}))
