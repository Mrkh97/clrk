import { useQuery } from '@tanstack/react-query'
import type { MonthlySpend, CategorySpend, DashboardStats, Transaction, TimeFilter, DashboardData } from '../types'
import { useDashboardStore } from '../stores/useDashboardStore'

const TRANSACTIONS: Transaction[] = [
  { id: '1', merchant: 'Whole Foods Market', amount: 84.5, date: '2026-04-03', category: 'Food & Dining', status: 'completed' },
  { id: '2', merchant: 'Uber', amount: 23.0, date: '2026-04-02', category: 'Transport', status: 'completed' },
  { id: '3', merchant: 'Netflix', amount: 15.99, date: '2026-04-01', category: 'Entertainment', status: 'completed' },
  { id: '4', merchant: 'CVS Pharmacy', amount: 42.3, date: '2026-04-01', category: 'Health', status: 'pending' },
  { id: '5', merchant: 'Amazon', amount: 156.0, date: '2026-03-30', category: 'Shopping', status: 'completed' },
  { id: '6', merchant: 'PG&E', amount: 120.0, date: '2026-03-28', category: 'Utilities', status: 'completed' },
  { id: '7', merchant: 'Chipotle', amount: 18.75, date: '2026-03-27', category: 'Food & Dining', status: 'completed' },
  { id: '8', merchant: 'Spotify', amount: 9.99, date: '2026-03-26', category: 'Entertainment', status: 'completed' },
]

const MONTHLY_DATA: Record<TimeFilter, MonthlySpend[]> = {
  '7D': [
    { label: 'Mon', amount: 42 },
    { label: 'Tue', amount: 85 },
    { label: 'Wed', amount: 23 },
    { label: 'Thu', amount: 156 },
    { label: 'Fri', amount: 67 },
    { label: 'Sat', amount: 120 },
    { label: 'Sun', amount: 38 },
  ],
  '30D': [
    { label: 'Wk 1', amount: 420 },
    { label: 'Wk 2', amount: 680 },
    { label: 'Wk 3', amount: 530 },
    { label: 'Wk 4', amount: 750 },
  ],
  '3M': [
    { label: 'Feb', amount: 2100 },
    { label: 'Mar', amount: 2650 },
    { label: 'Apr', amount: 1850 },
  ],
  '6M': [
    { label: 'Nov', amount: 1980 },
    { label: 'Dec', amount: 3100 },
    { label: 'Jan', amount: 2300 },
    { label: 'Feb', amount: 2100 },
    { label: 'Mar', amount: 2650 },
    { label: 'Apr', amount: 1850 },
  ],
  '1Y': [
    { label: 'May', amount: 1800 },
    { label: 'Jun', amount: 2100 },
    { label: 'Jul', amount: 2400 },
    { label: 'Aug', amount: 1950 },
    { label: 'Sep', amount: 2200 },
    { label: 'Oct', amount: 2600 },
    { label: 'Nov', amount: 1980 },
    { label: 'Dec', amount: 3100 },
    { label: 'Jan', amount: 2300 },
    { label: 'Feb', amount: 2100 },
    { label: 'Mar', amount: 2650 },
    { label: 'Apr', amount: 1850 },
  ],
}

const CATEGORY_DATA: CategorySpend[] = [
  { category: 'Food & Dining', amount: 847, percentage: 35 },
  { category: 'Shopping', amount: 486, percentage: 20 },
  { category: 'Transport', amount: 364, percentage: 15 },
  { category: 'Utilities', amount: 291, percentage: 12 },
  { category: 'Entertainment', amount: 218, percentage: 9 },
  { category: 'Health', amount: 146, percentage: 6 },
  { category: 'Other', amount: 73, percentage: 3 },
]

const STATS: Record<TimeFilter, DashboardStats> = {
  '7D': { totalSpent: 531, avgDaily: 75.86, topCategory: 'Shopping', transactionCount: 12 },
  '30D': { totalSpent: 2380, avgDaily: 79.33, topCategory: 'Food & Dining', transactionCount: 47 },
  '3M': { totalSpent: 6600, avgDaily: 73.33, topCategory: 'Food & Dining', transactionCount: 138 },
  '6M': { totalSpent: 13930, avgDaily: 77.39, topCategory: 'Food & Dining', transactionCount: 271 },
  '1Y': { totalSpent: 27030, avgDaily: 74.05, topCategory: 'Food & Dining', transactionCount: 523 },
}

const fetchDashboardData = (filter: TimeFilter): Promise<DashboardData> =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          stats: STATS[filter],
          monthlySpend: MONTHLY_DATA[filter],
          categorySpend: CATEGORY_DATA,
          transactions: TRANSACTIONS,
        }),
      200,
    ),
  )

export function useDashboardData() {
  const timeFilter = useDashboardStore((s) => s.timeFilter)

  return useQuery({
    queryKey: ['dashboard', timeFilter],
    queryFn: () => fetchDashboardData(timeFilter),
    staleTime: Infinity,
    placeholderData: (prev) => prev,
  })
}
