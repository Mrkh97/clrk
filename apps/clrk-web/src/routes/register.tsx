import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'
import {
  getConfirmEmailRedirectTarget,
  getSafeRedirectTarget,
  getVerifiedSearchValue,
} from '#/lib/auth-client'
import { getCurrentSession } from '#/lib/session'
import RegisterPage from '#/features/authentication/presentations/components/RegisterPage'

const authSearchSchema = z.object({
  redirect: z.string().optional(),
  verified: z.union([z.string(), z.number()]).transform(getVerifiedSearchValue).optional(),
})

export const Route = createFileRoute('/register')({
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
  component: RegisterPage,
})
