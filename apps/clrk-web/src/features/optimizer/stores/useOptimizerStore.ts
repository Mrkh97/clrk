import { create } from 'zustand'
import type { OptimizationLevel, OptimizationResult, OptimizerPhase } from '../types'

interface OptimizerStore {
  phase: OptimizerPhase
  selectedLevel: OptimizationLevel | null
  fromDate: string
  toDate: string
  result: OptimizationResult | null
  error: string | null
  selectLevel: (level: OptimizationLevel) => void
  setFromDate: (date: string) => void
  setToDate: (date: string) => void
  setResult: (result: OptimizationResult) => void
  setError: (error: string) => void
  setPhase: (phase: OptimizerPhase) => void
  reset: () => void
}

function getDefaultDateRange() {
  const today = new Date()
  const toDate = today.toISOString().slice(0, 10)
  const fromDate = new Date(today)
  fromDate.setUTCDate(fromDate.getUTCDate() - 29)

  return {
    fromDate: fromDate.toISOString().slice(0, 10),
    toDate,
  }
}

export const useOptimizerStore = create<OptimizerStore>((set) => ({
  ...getDefaultDateRange(),
  phase: 'idle',
  selectedLevel: null,
  result: null,
  error: null,
  selectLevel: (level) => set({ selectedLevel: level }),
  setFromDate: (fromDate) => set({ fromDate }),
  setToDate: (toDate) => set({ toDate }),
  setResult: (result) => set({ result, phase: 'done' }),
  setError: (error) => set({ error, phase: 'error' }),
  setPhase: (phase) => set({ phase }),
  reset: () => set({
    ...getDefaultDateRange(),
    phase: 'idle',
    selectedLevel: null,
    result: null,
    error: null,
  }),
}))
