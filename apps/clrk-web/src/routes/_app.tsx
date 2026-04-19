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
    <div className="flex h-screen overflow-hidden font-display">
      <AppSidebar />
      <main className="app-bg flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
