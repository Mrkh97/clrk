import { create } from 'zustand'
import type { OptimizationLevel, OptimizationResult, OptimizerPhase } from '../types'

interface OptimizerStore {
  phase: OptimizerPhase
  selectedLevel: OptimizationLevel | null
  result: OptimizationResult | null
  error: string | null
  selectLevel: (level: OptimizationLevel) => void
  setResult: (result: OptimizationResult) => void
  setError: (error: string) => void
  setPhase: (phase: OptimizerPhase) => void
  reset: () => void
}

export const useOptimizerStore = create<OptimizerStore>((set) => ({
  phase: 'idle',
  selectedLevel: null,
  result: null,
  error: null,
  selectLevel: (level) => set({ selectedLevel: level }),
  setResult: (result) => set({ result, phase: 'done' }),
  setError: (error) => set({ error, phase: 'error' }),
  setPhase: (phase) => set({ phase }),
  reset: () => set({ phase: 'idle', selectedLevel: null, result: null, error: null }),
}))
