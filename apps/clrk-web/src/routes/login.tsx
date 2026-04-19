import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import {
  getConfirmEmailRedirectTarget,
  getSafeRedirectTarget,
} from '#/lib/auth-client'
import { getCurrentSession } from '#/lib/session'
import LoginPage from '#/features/authentication/presentations/components/LoginPage'

const authSearchSchema = z.object({
  redirect: z.string().optional(),
})

export const Route = createFileRoute('/login')({
  validateSearch: (search) => authSearchSchema.parse(search),
  beforeLoad: async ({ search }) => {
    const session = await getCurrentSession()

    if (session) {
      if (!session.user.emailVerified) {
        throw redirect({
          href: getConfirmEmailRedirectTarget(search.redirect),
          replace: true,
        })
      }

      throw redirect({
        to: getSafeRedirectTarget(search.redirect),
        replace: true,
      })
    }
  },
  component: LoginPage,
})
