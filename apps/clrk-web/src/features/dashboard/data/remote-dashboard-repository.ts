import { RECEIPT_CATEGORY_LABELS } from '#/features/receipt/types'
import { apiClient, getApiErrorMessage } from '#/lib/api-client'
import type { DashboardData, TimeFilter } from '../types'

function toCategoryLabel(category: string) {
  return RECEIPT_CATEGORY_LABELS[category as keyof typeof RECEIPT_CATEGORY_LABELS] ?? category
}

export async function getDashboardData(filter: TimeFilter): Promise<DashboardData> {
  try {
    const { data } = await apiClient.get<DashboardData>('/api/dashboard', {
      params: {
        timeFilter: filter,
      },
    })

    return {
      ...data,
      stats: {
        ...data.stats,
        topCategory: data.stats.topCategory ? toCategoryLabel(data.stats.topCategory) : 'No receipts yet',
      },
      categorySpend: data.categorySpend.map((item) => ({
        ...item,
        category: toCategoryLabel(item.category),
      })),
      transactions: data.transactions.map((transaction) => ({
        ...transaction,
        category: toCategoryLabel(transaction.category),
      })),
    }
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Unable to load dashboard data.'))
  }
}
