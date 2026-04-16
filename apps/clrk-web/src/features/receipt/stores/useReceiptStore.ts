import { create } from 'zustand'
import type { ExtractedReceipt, UploadState } from '../types'

interface ReceiptStore {
  uploadState: UploadState
  extractedReceipt: ExtractedReceipt | null
  selectedReceiptId: string | null
  setUploadPhase: (phase: UploadState['phase'], fileName?: string) => void
  setUploadProgress: (progress: number) => void
  setExtractionResult: (fileName: string, receipt: ExtractedReceipt) => void
  setUploadError: (fileName: string, errorMessage: string) => void
  selectReceipt: (id: string | null) => void
  resetUpload: () => void
}

export const useReceiptStore = create<ReceiptStore>((set) => ({
  uploadState: { phase: 'idle', progress: 0 },
  extractedReceipt: null,
  selectedReceiptId: null,

  setUploadPhase: (phase, fileName) =>
    set((s) => ({
      uploadState: {
        ...s.uploadState,
        phase,
        fileName,
        errorMessage: undefined,
      },
      extractedReceipt: phase === 'idle' || phase === 'processing' ? null : s.extractedReceipt,
    })),

  setUploadProgress: (progress) =>
    set((s) => ({ uploadState: { ...s.uploadState, progress } })),

  setExtractionResult: (fileName, receipt) =>
    set({
      uploadState: { phase: 'complete', progress: 100, fileName },
      extractedReceipt: receipt,
      selectedReceiptId: null,
    }),

  setUploadError: (fileName, errorMessage) =>
    set({
      uploadState: { phase: 'error', progress: 0, fileName, errorMessage },
      extractedReceipt: null,
    }),

  selectReceipt: (id) => set({ selectedReceiptId: id }),

  resetUpload: () =>
    set({
      uploadState: { phase: 'idle', progress: 0 },
      extractedReceipt: null,
      selectedReceiptId: null,
    }),
}))
