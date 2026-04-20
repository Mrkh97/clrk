import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import ConfirmEmailPage from '#/features/authentication/presentations/components/ConfirmEmailPage'

const confirmEmailSearchSchema = z.object({
  error: z.string().optional(),
  redirect: z.string().optional(),
  resent: z.enum(['1']).optional(),
  token: z.string().optional(),
})

export const Route = createFileRoute('/confirm-email')({
  validateSearch: (search) => confirmEmailSearchSchema.parse(search),
  component: ConfirmEmailPage,
})
