import { useSearch } from '@tanstack/react-router'
import { Bell } from 'lucide-react'
import GlassCard from '#/components/GlassCard'
import PageHeader from '#/components/PageHeader'
import SearchInput from '#/components/SearchInput'
import { Button } from '#/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '#/components/ui/tooltip'
import { useDashboardData } from '../../hooks/useDashboardData'
import CategoryBars from './CategoryBars'
import SpendingChart from './SpendingChart'
import StatCard from './StatCard'
import TimeFilter from './TimeFilter'
import TransactionList from './TransactionList'

export default function DashboardPage() {
  const search = useSearch({ from: '/_app/dashboard' })
  const { data, isLoading } = useDashboardData()
  const totalSpent = data
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.stats.totalSpent)
    : ''
  const averageDaily = data
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.stats.avgDaily)
    : ''

  return (
    <div className="min-h-full">
      <PageHeader label="Dashboard" title="Spending Dashboard">
        <SearchInput className="w-full sm:w-auto" />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
                <Bell size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand">
          <span className="font-mono text-[10px] font-bold text-brand-foreground">MK</span>
        </div>
      </PageHeader>

      <div className="space-y-6 p-4 sm:p-6">
        {search.verified === '1' && (
          <div className="rounded-2xl border border-brand/30 bg-brand/10 px-4 py-3 text-sm text-foreground">
            Your email is verified and your account is ready.
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          <div className="w-full sm:w-64">
            <TimeFilter />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : data ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total Spent"
              value={totalSpent}
              trend="+4.2% vs last period"
              trendUp={false}
            />
            <StatCard
              label="Avg. Daily"
              value={averageDaily}
            />
            <StatCard
              label="Top Category"
              value={data.stats.topCategory}
            />
            <StatCard
              label="Transactions"
              value={String(data.stats.transactionCount)}
              trend="+8 vs last period"
              trendUp={true}
            />
          </div>
        ) : null}

        {data && (
          <div className="grid gap-4 xl:grid-cols-2">
            <GlassCard className="p-5">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Spending Over Time
              </p>
              <SpendingChart currency={data.currency} data={data.monthlySpend} />
            </GlassCard>

            <GlassCard className="p-5">
              <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Spending by Category
              </p>
              <CategoryBars currency={data.currency} data={data.categorySpend} />
            </GlassCard>
          </div>
        )}

        {data && (
          <div>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Recent Transactions
            </p>
            <TransactionList transactions={data.transactions} />
          </div>
        )}
      </div>
    </div>
  )
}
