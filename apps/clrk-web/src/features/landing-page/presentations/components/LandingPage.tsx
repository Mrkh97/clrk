import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import {
  ArrowRight,
  CloudUpload,
  Flame,
  LayoutDashboard,
  Receipt,
  Sparkles,
  Zap,
} from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import GlassCard from '#/components/GlassCard'
import ThemeToggle from '#/components/ThemeToggle'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { Separator } from '#/components/ui/separator'
import { useAuthSession } from '#/lib/auth-client'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'

const HERO_STATS = [
  { label: 'Total Spent', value: '$4,280' },
  { label: 'Avg. Daily', value: '$68.30' },
  { label: 'Top Category', value: 'Food' },
  { label: 'Transactions', value: '127' },
]

const HERO_CHART_DATA = [
  { label: 'Jan', amount: 3200 },
  { label: 'Feb', amount: 2800 },
  { label: 'Mar', amount: 3600 },
  { label: 'Apr', amount: 3100 },
  { label: 'May', amount: 4280 },
  { label: 'Jun', amount: 3800 },
]

const MOCK_CATEGORIES = [
  { category: 'Food & Dining', percentage: 30, color: 'var(--category-food)' },
  { category: 'Transport', percentage: 20, color: 'var(--category-transport)' },
  { category: 'Entertainment', percentage: 15, color: 'var(--category-entertainment)' },
]

const SOCIAL_PROOF = [
  { value: '10,000+', label: 'Active Users' },
  { value: '1M+', label: 'Receipts Scanned' },
  { value: '$2.4M+', label: 'Savings Found' },
]

function BrandDot({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3">
      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand" />
      <span className="text-sm text-muted-foreground">{text}</span>
    </li>
  )
}

function MiniCategoryBar({
  category,
  percentage,
  color,
}: {
  category: string
  percentage: number
  color: string
}) {
  const filled = Math.round((percentage / 100) * 12)

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
          {category}
        </span>
        <span className="font-mono text-[9px] font-bold text-foreground">{percentage}%</span>
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: 12 }).map((_, index) => (
          <span
            key={index}
            className="h-2 flex-1 rounded-sm"
            style={{ background: color, opacity: index < filled ? 1 : 0.1 }}
          />
        ))}
      </div>
    </div>
  )
}

function HeroChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="h-28 animate-pulse rounded-xl bg-muted" />
  }

  return (
    <ResponsiveContainer width="100%" height={112}>
      <AreaChart data={HERO_CHART_DATA} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
        <defs>
          <linearGradient id="heroGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.52 0.21 22)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="oklch(0.52 0.21 22)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="amount"
          stroke="oklch(0.52 0.21 22)"
          strokeWidth={2}
          fill="url(#heroGradient)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export default function LandingPage() {
  useRevealOnScroll()

  const { data: session } = useAuthSession()
  const isAuthenticated = Boolean(session)

  return (
    <div className="landing-bg min-h-screen">
      <nav className="glass-heavy fixed left-0 right-0 top-0 z-50 animate-in fade-in slide-in-from-top duration-500">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-brand" />
            <span className="font-display text-base font-bold tracking-tight text-foreground">
              clrk
            </span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              How It Works
            </a>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              asChild
              size="sm"
              className="bg-brand font-mono text-xs uppercase tracking-wider text-brand-foreground hover:bg-brand/90"
            >
              {isAuthenticated ? (
                <Link to="/dashboard">Open Dashboard</Link>
              ) : (
                <Link to="/register">Get Started</Link>
              )}
            </Button>
          </div>
        </div>
      </nav>

      <section className="flex min-h-screen flex-col items-center justify-center px-6 pb-16 pt-24">
        <div className="mx-auto max-w-4xl text-center">
          <div
            className="animate-in fade-in duration-500 fill-mode-both"
            style={{ animationDelay: '100ms' }}
          >
            <Badge
              variant="secondary"
              className="font-mono text-[10px] uppercase tracking-widest"
            >
              Personal Finance, Reimagined
            </Badge>
          </div>

          <h1
            className="mt-6 font-display text-4xl font-bold tracking-tight text-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ animationDelay: '200ms' }}
          >
            Let Us Manage
            <br />
            Your Money
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground animate-in fade-in duration-500 fill-mode-both sm:text-lg"
            style={{ animationDelay: '400ms' }}
          >
            Track spending, scan receipts with AI, and discover exactly where to
            cut costs. clrk gives you the clarity to take control of your
            finances.
          </p>

          <div
            className="mt-8 flex flex-col items-center gap-3 animate-in fade-in duration-500 fill-mode-both sm:flex-row sm:justify-center sm:gap-4"
            style={{ animationDelay: '500ms' }}
          >
            <Button
              asChild
              size="lg"
              className="bg-brand font-mono text-xs font-bold uppercase tracking-widest text-brand-foreground hover:bg-brand/90"
            >
              {isAuthenticated ? (
                <Link to="/dashboard">
                  Open Dashboard
                  <ArrowRight size={14} />
                </Link>
              ) : (
                <Link to="/register">
                  Get Started Free
                  <ArrowRight size={14} />
                </Link>
              )}
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="font-mono text-xs uppercase tracking-wider"
            >
              <a href="#features">See How It Works</a>
            </Button>
          </div>
        </div>

        <div
          className="mt-12 w-full max-w-3xl animate-float animate-in fade-in zoom-in-95 duration-700 fill-mode-both md:mt-16"
          style={{ animationDelay: '600ms' }}
        >
          <GlassCard variant="elevated" className="overflow-hidden p-5">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {HERO_STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="mt-1 font-mono text-lg font-bold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <HeroChart />
          </GlassCard>
        </div>
      </section>

      <section className="border-y border-border py-12">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-8 px-6 md:gap-16">
          {SOCIAL_PROOF.map((proof, index) => (
            <div key={proof.label} className={`reveal stagger-${index + 1} text-center`}>
              <p className="font-mono text-2xl font-bold text-foreground">{proof.value}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {proof.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="reveal mb-16 text-center">
            <p className="font-mono text-[10px] uppercase tracking-widest text-brand">Features</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
              Everything You Need
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Three powerful tools working together to give you complete control
              over your finances.
            </p>
          </div>

          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="reveal">
              <Badge
                variant="secondary"
                className="gap-1.5 font-mono text-[10px] uppercase tracking-widest"
              >
                <LayoutDashboard size={12} />
                Dashboard
              </Badge>
              <h3 className="mt-4 font-display text-2xl font-bold text-foreground">
                See Where Every Dollar Goes
              </h3>
              <p className="mt-3 text-muted-foreground">
                Real-time spending analytics with interactive charts, category
                breakdowns, and transaction history. Know your financial habits
                at a glance.
              </p>
              <ul className="mt-6 space-y-3">
                <BrandDot text="Interactive spending charts by period" />
                <BrandDot text="Category-wise breakdowns with visual bars" />
                <BrandDot text="Full transaction history with search" />
              </ul>
            </div>

            <div className="reveal stagger-2">
              <GlassCard variant="elevated" className="p-5">
                <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Spending Overview
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {HERO_STATS.map((stat) => (
                    <div key={stat.label} className="rounded-lg bg-accent/50 p-3">
                      <p className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                        {stat.label}
                      </p>
                      <p className="mt-1 font-mono text-sm font-bold text-foreground">
                        {stat.value}
                      </p>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="space-y-3">
                  {MOCK_CATEGORIES.map((category) => (
                    <MiniCategoryBar key={category.category} {...category} />
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>

          <div className="mt-20 grid items-center gap-12 md:mt-28 md:grid-cols-2">
            <div className="reveal stagger-2 md:order-1">
              <GlassCard variant="elevated" className="p-5">
                <div className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent">
                    <CloudUpload size={20} className="text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">Drop your receipt here</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG, PDF</p>
                </div>
                <Separator className="my-4" />
                <div className="flex items-center gap-2 rounded-lg border border-brand/20 bg-brand-muted px-3 py-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-brand">
                    AI Extracted
                  </span>
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    { label: 'Merchant', value: 'Whole Foods Market' },
                    { label: 'Amount', value: '$47.23' },
                    { label: 'Category', value: 'Food & Dining' },
                  ].map((field) => (
                    <div
                      key={field.label}
                      className="flex items-baseline justify-between border-b border-border pb-2"
                    >
                      <span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                        {field.label}
                      </span>
                      <span className="font-mono text-sm font-bold text-foreground">
                        {field.value}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            <div className="reveal md:order-2">
              <Badge
                variant="secondary"
                className="gap-1.5 font-mono text-[10px] uppercase tracking-widest"
              >
                <Receipt size={12} />
                Receipt Scanner
              </Badge>
              <h3 className="mt-4 font-display text-2xl font-bold text-foreground">
                Snap It. Extract It. Done.
              </h3>
              <p className="mt-3 text-muted-foreground">
                Upload any receipt and our AI instantly extracts merchant,
                amount, date, and category. No manual entry required.
              </p>
              <ul className="mt-6 space-y-3">
                <BrandDot text="AI-powered data extraction in seconds" />
                <BrandDot text="Supports photos, scans, and PDF receipts" />
                <BrandDot text="Auto-categorization with smart detection" />
              </ul>
            </div>
          </div>

          <div className="mt-20 grid items-center gap-12 md:mt-28 md:grid-cols-2">
            <div className="reveal">
              <Badge
                variant="secondary"
                className="gap-1.5 font-mono text-[10px] uppercase tracking-widest"
              >
                <Sparkles size={12} />
                Optimizer
              </Badge>
              <h3 className="mt-4 font-display text-2xl font-bold text-foreground">
                Cut Smarter, Not Harder
              </h3>
              <p className="mt-3 text-muted-foreground">
                Choose your savings goal and our AI analyzes your habits to find
                actionable cuts. Save 10% with easy swaps or 30% with aggressive
                changes.
              </p>
              <ul className="mt-6 space-y-3">
                <BrandDot text="Two optimization levels: Easy (10%) and Hard (30%)" />
                <BrandDot text="AI-generated, personalized cut suggestions" />
                <BrandDot text="See exact dollar impact per suggestion" />
              </ul>
            </div>

            <div className="reveal stagger-2">
              <GlassCard variant="elevated" className="p-5">
                <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Choose Your Goal
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col items-center rounded-xl border border-brand p-4 text-center shadow-[0_0_16px_var(--brand)/0.1]">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-brand">
                      <Zap size={16} className="text-brand-foreground" />
                    </div>
                    <p className="font-display text-sm font-bold text-foreground">Easy</p>
                    <p className="mt-0.5 font-mono text-xl font-bold text-brand">10%</p>
                  </div>
                  <div className="flex flex-col items-center rounded-xl border border-border p-4 text-center">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent">
                      <Flame size={16} className="text-muted-foreground" />
                    </div>
                    <p className="font-display text-sm font-bold text-foreground">Hard</p>
                    <p className="mt-0.5 font-mono text-xl font-bold text-muted-foreground">
                      30%
                    </p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="text-center">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Potential Monthly Savings
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold text-brand">$428.00</p>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                    10% of $4,280 monthly spend
                  </p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <div className="reveal">
            <p className="font-mono text-[10px] uppercase tracking-widest text-brand">
              How It Works
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
              Three Steps to Clarity
            </h2>
          </div>

          <div className="mt-16 grid items-start gap-4 md:grid-cols-5">
            <div className="reveal stagger-1 flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand">
                <span className="font-mono text-lg font-bold text-brand-foreground">1</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">Connect</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Link your accounts or start entering transactions manually. Takes
                less than a minute.
              </p>
            </div>

            <div className="hidden items-center justify-center self-center md:flex">
              <div className="h-px w-full border-t border-dashed border-border" />
            </div>

            <div className="reveal stagger-2 flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand">
                <span className="font-mono text-lg font-bold text-brand-foreground">2</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">Scan</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Upload receipts and let AI handle the data entry. Just snap and
                go.
              </p>
            </div>

            <div className="hidden items-center justify-center self-center md:flex">
              <div className="h-px w-full border-t border-dashed border-border" />
            </div>

            <div className="reveal stagger-3 flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand">
                <span className="font-mono text-lg font-bold text-brand-foreground">3</span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold text-foreground">Save</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Get personalized spending insights and actionable savings
                suggestions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-6 py-20 md:py-28">
        <div className="absolute inset-0 bg-brand/5" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(ellipse at 50% 50%, oklch(0.52 0.21 22 / 0.08), transparent 70%)',
          }}
        />
        <div className="reveal relative z-10 mx-auto max-w-2xl text-center">
          <p className="font-mono text-[10px] uppercase tracking-widest text-brand">Ready?</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-foreground sm:text-4xl">
            Start Managing Your Money Today
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Join thousands who have already taken control of their finances with
            clrk.
          </p>
          <div className="mt-8">
            <Button
              asChild
              size="lg"
              className="bg-brand font-mono text-xs font-bold uppercase tracking-widest text-brand-foreground hover:bg-brand/90"
            >
              <Link to="/dashboard">
                Get Started Free
                <ArrowRight size={14} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
            <div className="flex items-center gap-2.5">
              <span className="h-2.5 w-2.5 rounded-full bg-brand" />
              <span className="font-display text-base font-bold tracking-tight text-foreground">
                clrk
              </span>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="#features"
                className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
              >
                How It Works
              </a>
              <Link
                to="/dashboard"
                className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
            </div>

            <p className="font-mono text-[10px] text-muted-foreground">
              &copy; 2026 clrk. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
