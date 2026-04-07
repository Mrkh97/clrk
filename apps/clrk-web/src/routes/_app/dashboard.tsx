import { createFileRoute } from '@tanstack/react-router'
import { Bell, Search } from 'lucide-react'
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

  return (
    <div className="min-h-full">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-[#E8E8E8] bg-white px-6 py-4">
        <div>
          <p className="nd-mono text-[10px] uppercase tracking-widest text-[#999999]">
            Dashboard
          </p>
          <h1
            className="text-xl font-bold text-[#000]"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
          >
            Spending Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border-b border-[#CCCCCC] pb-1">
            <Search size={14} className="text-[#999999]" />
            <input
              className="nd-mono w-32 bg-transparent text-xs text-[#666666] outline-none placeholder:text-[#CCCCCC]"
              placeholder="Search..."
            />
          </div>
          <button className="rounded-full p-2 transition-colors hover:bg-[#F5F5F5]">
            <Bell size={16} className="text-[#666666]" />
          </button>
          <div className="h-8 w-8 rounded-full bg-[#000] flex items-center justify-center">
            <span className="nd-mono text-[10px] font-bold text-white">MK</span>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
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
              <div key={i} className="h-28 animate-pulse rounded-xl bg-[#E8E8E8]" />
            ))}
          </div>
        ) : data ? (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              label="Total Spent"
              value={`$${data.stats.totalSpent.toLocaleString()}`}
              trend="+4.2% vs last period"
              trendUp={false}
            />
            <StatCard
              label="Avg. Daily"
              value={`$${data.stats.avgDaily.toFixed(2)}`}
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
            {/* Spending chart */}
            <div className="nd-card p-5">
              <p className="nd-mono mb-4 text-[10px] uppercase tracking-widest text-[#999999]">
                Spending Over Time
              </p>
              <SpendingChart data={data.monthlySpend} />
            </div>

            {/* Category bars */}
            <div className="nd-card p-5">
              <p className="nd-mono mb-4 text-[10px] uppercase tracking-widest text-[#999999]">
                Spending by Category
              </p>
              <CategoryBars data={data.categorySpend} />
            </div>
          </div>
        )}

        {/* Transactions */}
        {data && (
          <div>
            <p className="nd-mono mb-3 text-[10px] uppercase tracking-widest text-[#999999]">
              Recent Transactions
            </p>
            <TransactionList transactions={data.transactions} />
          </div>
        )}
      </div>
    </div>
  )
}
