import { createFileRoute } from '@tanstack/react-router'
import { Bell } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '#/components/ui/tooltip'
import PageHeader from '#/components/PageHeader'
import SearchInput from '#/components/SearchInput'
import GlassCard from '#/components/GlassCard'
import TimeFilter from '#/features/dashboard/presentations/components/TimeFilter'
import StatCard from '#/features/dashboard/presentations/components/StatCard'
import SpendingChart from '#/features/dashboard/presentations/components/SpendingChart'
import CategoryBars from '#/features/dashboard/presentations/components/CategoryBars'
import TransactionList from '#/features/dashboard/presentations/components/TransactionList'
import { useDashboardData } from '#/features/dashboard/hooks/useDashboardData'

export const Route = createFileRoute('/_app/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { data, isLoading } = useDashboardData()
  const totalSpent = data
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.stats.totalSpent)
    : ''
  const averageDaily = data
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: data.currency }).format(data.stats.avgDaily)
    : ''

  return (
    <div className="min-h-full">
      {/* Top bar */}
      <PageHeader label="Dashboard" title="Spending Dashboard">
        <SearchInput />
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

      <div className="space-y-6 p-6">
        {/* Time filter */}
        <div className="flex items-center justify-between gap-4">
          <div className="w-64">
            <TimeFilter />
          </div>
        </div>

        {/* Stats */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : data ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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

        {/* Charts row */}
        {data && (
          <div className="grid gap-4 lg:grid-cols-2">
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

        {/* Transactions */}
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
