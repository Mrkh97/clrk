import { cn } from '#/lib/utils'

interface PageHeaderProps {
  label: string
  title: string
  children?: React.ReactNode
  className?: string
}

export default function PageHeader({
  label,
  title,
  children,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'glass-heavy flex flex-col items-start gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6',
        className,
      )}
    >
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <h1 className="font-display text-xl font-bold text-foreground sm:text-2xl">
          {title}
        </h1>
      </div>
      {children && (
        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end sm:gap-3">
          {children}
        </div>
      )}
    </header>
  )
}
