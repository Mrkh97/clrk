import { useQuery } from '@tanstack/react-query'
import { getDashboardData } from '../data/remote-dashboard-repository'
import { useDashboardStore } from '../stores/useDashboardStore'

export function useDashboardData() {
  const timeFilter = useDashboardStore((s) => s.timeFilter)

  return useQuery({
    queryKey: ['dashboard', timeFilter],
    queryFn: () => getDashboardData(timeFilter),
    staleTime: Infinity,
    placeholderData: (prev) => prev,
  })
}
