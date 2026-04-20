import { Link } from '@tanstack/react-router'
import { ArrowRight, CheckCircle2, ReceiptText, ShieldCheck, Sparkles } from 'lucide-react'
import GlassCard from '#/components/GlassCard'
import ThemeToggle from '#/components/ThemeToggle'

const HIGHLIGHTS = [
  {
    icon: ReceiptText,
    title: 'Receipt AI that flows into review',
    copy: 'Scan, verify, and save without re-entering the essentials by hand.',
  },
  {
    icon: Sparkles,
    title: 'Optimization with context',
    copy: 'Turn live spending history into cuts that feel realistic instead of random.',
  },
  {
    icon: ShieldCheck,
    title: 'Session-backed access',
    copy: 'Protected routes, cookie-based auth, and a cleaner handoff into the app.',
  },
] as const

interface AuthShellProps {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
  footer: React.ReactNode
}

export default function AuthShell({
  eyebrow,
  title,
  description,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="landing-bg min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 pb-8 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <span className="h-2.5 w-2.5 rounded-full bg-brand" />
          <span className="font-display text-base font-bold tracking-tight text-foreground">
            clrk
          </span>
        </Link>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <ThemeToggle compact className="sm:hidden" />
          <ThemeToggle className="hidden sm:inline-flex" />
          <Link
            to="/"
            className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Back Home
          </Link>
        </div>
      </div>

      <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.52),rgba(255,255,255,0.16))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-white/10 dark:bg-[linear-gradient(135deg,rgba(22,22,24,0.76),rgba(22,22,24,0.28))] sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,120,90,0.18),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(111,121,255,0.18),transparent_36%),radial-gradient(circle_at_60%_100%,rgba(96,211,154,0.12),transparent_32%)]" />
          <div className="relative space-y-8">
            <div className="space-y-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-brand">
                {eyebrow}
              </p>
              <div className="space-y-3">
                <h1 className="max-w-xl font-display text-4xl font-bold leading-none text-foreground sm:text-5xl lg:text-6xl">
                  {title}
                </h1>
                <p className="max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
                  {description}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <GlassCard className="rounded-2xl border border-white/25 p-4 dark:border-white/10">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                  Faster Intake
                </p>
                <p className="mt-3 font-display text-3xl font-bold text-foreground">1 tap</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Upload once, then review extracted totals and line items in place.
                </p>
              </GlassCard>

              <GlassCard className="rounded-2xl border border-white/25 p-4 dark:border-white/10">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                  Better Focus
                </p>
                <p className="mt-3 font-display text-3xl font-bold text-foreground">Live</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Session-aware routes keep the finance workspace private and direct.
                </p>
              </GlassCard>

              <GlassCard className="rounded-2xl border border-white/25 p-4 dark:border-white/10">
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                  Built For Clarity
                </p>
                <p className="mt-3 font-display text-3xl font-bold text-foreground">AI</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Merchant, totals, and payment details arrive ready for confirmation.
                </p>
              </GlassCard>
            </div>

            <div className="space-y-3">
              {HIGHLIGHTS.map((item) => (
                <div
                  key={item.title}
                  className="glass flex items-start gap-3 rounded-2xl p-4"
                >
                  <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand/12 text-brand">
                    <item.icon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {item.copy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <GlassCard variant="heavy" className="rounded-[2rem] p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-2 text-brand">
            <CheckCircle2 size={16} />
            <span className="font-mono text-[10px] uppercase tracking-[0.34em]">
              Secure Access
            </span>
          </div>

          {children}

          <div className="mt-6 border-t border-border/80 pt-5 text-sm text-muted-foreground">
            {footer}
          </div>

          <div className="mt-6 flex flex-col gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground sm:flex-row sm:items-center">
            <span>Protected by Better Auth</span>
            <ArrowRight size={12} />
            <span>Receipt extraction stays in your signed-in workspace</span>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
