import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import DashboardPage from '#/features/dashboard/presentations/components/DashboardPage'
import { getVerifiedSearchValue } from '#/lib/auth-client'

export const Route = createFileRoute('/_app/dashboard')({
  validateSearch: (search) => z.object({
    verified: z.string().transform(getVerifiedSearchValue).optional(),
  }).parse(search),
  component: DashboardPage,
})
