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
        'glass-heavy flex items-center justify-between px-6 py-4',
        className,
      )}
    >
      <div>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        <h1 className="font-display text-xl font-bold text-foreground">
          {title}
        </h1>
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </header>
  )
}
