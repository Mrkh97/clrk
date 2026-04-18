import { useQuery } from '@tanstack/react-query'
import { apiBaseUrl } from '#/lib/auth-client'
import { RECEIPT_CATEGORY_LABELS } from '#/features/receipt/types'
import type { DashboardData, TimeFilter } from '../types'
import { useDashboardStore } from '../stores/useDashboardStore'

async function parseError(response: Response) {
  try {
    const payload = (await response.json()) as { error?: string; message?: string }
    return payload.error ?? payload.message ?? 'Unable to load dashboard data.'
  } catch {
    return 'Unable to load dashboard data.'
  }
}

function toCategoryLabel(category: string) {
  return RECEIPT_CATEGORY_LABELS[category as keyof typeof RECEIPT_CATEGORY_LABELS] ?? category
}

async function fetchDashboardData(filter: TimeFilter): Promise<DashboardData> {
  const response = await fetch(`${apiBaseUrl}/api/dashboard?timeFilter=${filter}`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  const payload = (await response.json()) as DashboardData

  return {
    ...payload,
    stats: {
      ...payload.stats,
      topCategory: payload.stats.topCategory ? toCategoryLabel(payload.stats.topCategory) : 'No receipts yet',
    },
    categorySpend: payload.categorySpend.map((item) => ({
      ...item,
      category: toCategoryLabel(item.category),
    })),
    transactions: payload.transactions.map((transaction) => ({
      ...transaction,
      category: toCategoryLabel(transaction.category),
    })),
  }
}

export function useDashboardData() {
  const timeFilter = useDashboardStore((s) => s.timeFilter)

  return useQuery({
    queryKey: ['dashboard', timeFilter],
    queryFn: () => fetchDashboardData(timeFilter),
    staleTime: Infinity,
    placeholderData: (prev) => prev,
  })
}
