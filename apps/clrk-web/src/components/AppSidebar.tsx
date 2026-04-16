import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { LayoutDashboard, Sparkles, Receipt, LogOut } from 'lucide-react'
import { Separator } from '#/components/ui/separator'
import { Button } from '#/components/ui/button'
import ThemeToggle from '#/components/ThemeToggle'
import { signOut } from '#/lib/auth-client'

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Optimizer', to: '/optimizer', icon: Sparkles },
  { label: 'Receipt', to: '/receipt', icon: Receipt },
] as const

export default function AppSidebar() {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [signOutError, setSignOutError] = useState<string | null>(null)

  const handleSignOut = async () => {
    if (isSigningOut) {
      return
    }

    setIsSigningOut(true)
    setSignOutError(null)
    const { error } = await signOut()

    if (error) {
      setSignOutError(error.message ?? 'Unable to sign out right now.')
      setIsSigningOut(false)
      return
    }

    window.location.assign('/')
  }

  return (
    <aside className="glass-sidebar flex w-56 flex-shrink-0 flex-col">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="h-2.5 w-2.5 rounded-full bg-brand" />
        <span className="text-base font-bold tracking-tight text-foreground">
          clrk
        </span>
      </div>

      <Separator className="bg-border" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 no-underline transition-colors hover:bg-accent"
            >
              {({ isActive }: { isActive: boolean }) => (
                <>
                  <span
                    className={`h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors ${isActive ? 'bg-brand' : 'bg-transparent'}`}
                  />
                  <item.icon
                    size={15}
                    className={isActive ? 'text-foreground' : 'text-muted-foreground'}
                  />
                  <span
                    className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </Link>
          ))}
        </div>
      </nav>

      <Separator className="bg-border" />

      {/* Theme + Sign out */}
      <div className="space-y-2 px-3 py-4">
        <div className="flex justify-center">
          <ThemeToggle />
        </div>
        <Button
          variant="ghost"
          type="button"
          disabled={isSigningOut}
          className="flex w-full items-center justify-start gap-3 px-3 py-2.5 text-muted-foreground hover:text-foreground"
          onClick={() => void handleSignOut()}
        >
          <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" />
          <LogOut size={15} />
          <span className="text-sm font-medium">
            {isSigningOut ? 'Signing Out...' : 'Sign Out'}
          </span>
        </Button>
        {signOutError && (
          <p className="px-3 text-xs text-destructive">{signOutError}</p>
        )}
      </div>
    </aside>
  )
}
