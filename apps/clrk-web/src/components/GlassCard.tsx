import { cn } from '#/lib/utils'
import { Card } from '#/components/ui/card'

const variantClasses = {
  default: 'glass-card',
  heavy: 'glass-heavy rounded-xl',
  elevated: 'glass-card shadow-lg',
} as const

interface GlassCardProps extends React.ComponentProps<typeof Card> {
  variant?: keyof typeof variantClasses
}

export default function GlassCard({
  variant = 'default',
  className,
  ...props
}: GlassCardProps) {
  return (
    <Card
      className={cn(
        'border-0 bg-transparent shadow-none',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
}
