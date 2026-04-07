import { create } from 'zustand'
import type { TimeFilter } from '../types'

interface OptimizerStore {
  timeFilter: TimeFilter
  setTimeFilter: (filter: TimeFilter) => void
}

export const useOptimizerStore = create<OptimizerStore>((set) => ({
  timeFilter: '30D',
  setTimeFilter: (timeFilter) => set({ timeFilter }),
}))
