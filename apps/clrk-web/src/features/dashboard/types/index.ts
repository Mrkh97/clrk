export type TimeFilter = '7D' | '30D' | '3M' | '6M' | '1Y'

export type TransactionStatus = 'completed' | 'pending' | 'refunded' | 'failed'

export interface Transaction {
  id: string
  merchant: string
  amount: number
  date: string
  category: string
  status: TransactionStatus
}

export interface MonthlySpend {
  label: string
  amount: number
}

export interface CategorySpend {
  category: string
  amount: number
  percentage: number
}

export interface DashboardStats {
  totalSpent: number
  avgDaily: number
  topCategory: string
  transactionCount: number
}

export interface DashboardData {
  stats: DashboardStats
  monthlySpend: MonthlySpend[]
  categorySpend: CategorySpend[]
  transactions: Transaction[]
}
