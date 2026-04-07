import { create } from 'zustand'
import type { TimeFilter } from '../types'

interface DashboardStore {
  timeFilter: TimeFilter
  setTimeFilter: (filter: TimeFilter) => void
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  timeFilter: '30D',
  setTimeFilter: (timeFilter) => set({ timeFilter }),
}))
