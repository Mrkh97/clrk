import { Link } from '@tanstack/react-router'
import { LayoutDashboard, Sparkles, Receipt, LogOut } from 'lucide-react'
import { Separator } from '#/components/ui/separator'

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Optimizer', to: '/optimizer', icon: Sparkles },
  { label: 'Receipt', to: '/receipt', icon: Receipt },
] as const

export default function AppSidebar() {
  return (
    <aside className="flex w-56 flex-shrink-0 flex-col border-r border-[#E8E8E8] bg-white">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#D71921]" />
        <span
          className="text-base font-bold tracking-tight text-[#000]"
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
        >
          clrk
        </span>
      </div>

      <Separator className="bg-[#E8E8E8]" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 no-underline transition-colors"
            >
              {({ isActive }: { isActive: boolean }) => (
                <>
                  <span
                    className="h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors"
                    style={{ background: isActive ? '#D71921' : 'transparent' }}
                  />
                  <item.icon
                    size={15}
                    className={isActive ? 'text-[#000]' : 'text-[#999999]'}
                  />
                  <span
                    className={`text-sm font-medium ${isActive ? 'text-[#000]' : 'text-[#666666]'}`}
                    style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </Link>
          ))}
        </div>
      </nav>

      <Separator className="bg-[#E8E8E8]" />

      {/* Sign out */}
      <div className="px-3 py-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-[#F5F5F5]">
          <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full" />
          <LogOut size={15} className="text-[#999999]" />
          <span
            className="text-sm font-medium text-[#666666]"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
          >
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  )
}
