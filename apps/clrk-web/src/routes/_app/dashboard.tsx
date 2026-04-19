import { createFileRoute } from '@tanstack/react-router'
import DashboardPage from '#/features/dashboard/presentations/components/DashboardPage'

export const Route = createFileRoute('/_app/dashboard')({
  component: DashboardPage,
})
