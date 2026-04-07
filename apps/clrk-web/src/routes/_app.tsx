import { createFileRoute, Outlet } from '@tanstack/react-router'
import AppSidebar from '#/components/AppSidebar'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
})

function AppLayout() {
  return (
    <div
      className="nd-app flex h-screen overflow-hidden"
      style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
    >
      <AppSidebar />
      <main className="flex-1 overflow-y-auto bg-[#F5F5F5]">
        <Outlet />
      </main>
    </div>
  )
}
