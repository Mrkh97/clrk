import { createFileRoute, Outlet } from '@tanstack/react-router'
import AppSidebar from '#/components/AppSidebar'
import { requireVerifiedSession } from '#/lib/session'

export const Route = createFileRoute('/_app')({
  beforeLoad: async ({ location }) => {
    await requireVerifiedSession(location.href)
  },
  component: AppLayout,
})

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col font-display md:h-screen md:flex-row md:overflow-hidden">
      <AppSidebar />
      <main className="app-bg min-w-0 flex-1 overflow-y-auto pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        <Outlet />
      </main>
    </div>
  )
}
